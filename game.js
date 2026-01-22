class AudioSystem {
    constructor() {
        this.audioContext = null;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playPop() {
        this.playTone(800, 0.1, 'sine');
        setTimeout(() => this.playTone(600, 0.1, 'sine'), 50);
    }

    playSuccess() {
        this.playTone(523, 0.1, 'sine');
        setTimeout(() => this.playTone(659, 0.1, 'sine'), 100);
        setTimeout(() => this.playTone(784, 0.2, 'sine'), 200);
    }

    playFirework() {
        const frequencies = [400, 500, 600, 700, 800];
        frequencies.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15, 'triangle'), i * 30);
        });
    }

    playChomp() {
        this.playTone(300, 0.1, 'square');
        setTimeout(() => this.playTone(250, 0.1, 'square'), 80);
        setTimeout(() => this.playTone(200, 0.1, 'square'), 160);
    }

    playSelect() {
        this.playTone(440, 0.05, 'sine');
    }
}

const audio = new AudioSystem();

class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = velocity.x;
        this.vy = velocity.y;
        this.alpha = 1;
        this.size = Math.random() * 6 + 3;
        this.gravity = 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= 0.02;
        this.size *= 0.98;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.active = false;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = Math.min(container.clientWidth - 40, 1000);
        this.canvas.height = Math.min(window.innerHeight * 0.6, 600);
    }

    spawnParticles(x, y, color, count = 15) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i;
            const speed = Math.random() * 5 + 2;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            this.particles.push(new Particle(x, y, color, velocity));
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(p => p.alpha > 0);
        this.particles.forEach(p => p.update());
    }

    drawParticles() {
        this.particles.forEach(p => p.draw(this.ctx));
    }

    start() {
        this.active = true;
        audio.init();
        this.animate();
    }

    stop() {
        this.active = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    animate() {
        if (!this.active) return;
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    update() {}
    draw() {}
}

class BubbleGame extends Game {
    constructor() {
        super('bubble-canvas');
        this.bubbles = [];
        this.score = 0;
        this.lastSpawn = 0;
        this.spawnRate = 1000;
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const bubble = this.bubbles[i];
            const dist = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);

            if (dist < bubble.radius) {
                this.spawnParticles(bubble.x, bubble.y, bubble.color, 20);
                audio.playPop();
                this.bubbles.splice(i, 1);
                this.score++;
                document.getElementById('bubble-score').textContent = this.score;

                if (this.score % 10 === 0) {
                    audio.playSuccess();
                    this.spawnRate = Math.max(300, this.spawnRate - 100);
                }

                return;
            }
        }
    }

    spawnBubble() {
        const radius = Math.random() * 30 + 40;
        this.bubbles.push({
            x: Math.random() * (this.canvas.width - radius * 2) + radius,
            y: this.canvas.height + radius,
            radius: radius,
            speed: Math.random() * 2 + 1,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.05 + 0.02
        });
    }

    update() {
        const now = Date.now();

        if (now - this.lastSpawn > this.spawnRate) {
            this.spawnBubble();
            this.lastSpawn = now;
        }

        this.bubbles = this.bubbles.filter(bubble => {
            bubble.y -= bubble.speed;
            bubble.wobble += bubble.wobbleSpeed;
            bubble.x += Math.sin(bubble.wobble) * 0.5;
            return bubble.y + bubble.radius > 0;
        });

        this.updateParticles();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.bubbles.forEach(bubble => {
            this.ctx.beginPath();
            this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);

            const gradient = this.ctx.createRadialGradient(
                bubble.x - bubble.radius * 0.3,
                bubble.y - bubble.radius * 0.3,
                bubble.radius * 0.1,
                bubble.x,
                bubble.y,
                bubble.radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.3, bubble.color);
            gradient.addColorStop(1, bubble.color.replace(')', ', 0.7)').replace('rgb', 'rgba'));

            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        });

        this.drawParticles();
    }

    start() {
        this.score = 0;
        this.bubbles = [];
        this.spawnRate = 1000;
        document.getElementById('bubble-score').textContent = '0';
        super.start();
    }
}

class FeedingGame extends Game {
    constructor() {
        super('feeding-canvas');
        this.animals = [];
        this.foods = [];
        this.draggedFood = null;
        this.score = 0;
        this.lastSpawn = 0;
        this.spawnRate = 3000;

        this.setupEvents();
    }

    getAnimalTypes() {
        return [
            { emoji: '🐰', food: '🥕', name: 'rabbit' },
            { emoji: '🐱', food: '🐟', name: 'cat' },
            { emoji: '🐶', food: '🦴', name: 'dog' },
            { emoji: '🐦', food: '🌾', name: 'bird' },
            { emoji: '🐵', food: '🍌', name: 'monkey' },
            { emoji: '🐢', food: '🥬', name: 'turtle' }
        ];
    }

    spawnAnimal() {
        const types = this.getAnimalTypes();
        const type = types[Math.floor(Math.random() * types.length)];

        this.animals.push({
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: Math.random() * (this.canvas.height - 250) + 50,
            type: type,
            radius: 50,
            hungry: true,
            hungryTimer: 0
        });
    }

    setupEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', () => this.draggedFood = null);
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let food of this.foods) {
            const dist = Math.sqrt((x - food.x) ** 2 + (y - food.y) ** 2);
            if (dist < food.radius) {
                this.draggedFood = food;
                audio.playSelect();
                break;
            }
        }
    }

    handleMouseMove(e) {
        if (!this.draggedFood) return;
        const rect = this.canvas.getBoundingClientRect();
        this.draggedFood.x = e.clientX - rect.left;
        this.draggedFood.y = e.clientY - rect.top;
    }

    handleMouseUp(e) {
        if (!this.draggedFood) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let animal of this.animals) {
            const dist = Math.sqrt((x - animal.x) ** 2 + (y - animal.y) ** 2);
            if (dist < animal.radius + 30 && animal.hungry) {
                if (this.draggedFood.type.food === animal.type.food) {
                    audio.playChomp();
                    this.spawnParticles(animal.x, animal.y, '#FFD700', 15);
                    animal.hungry = false;
                    this.foods = this.foods.filter(f => f !== this.draggedFood);
                    this.score++;
                    document.getElementById('feeding-score').textContent = this.score;

                    if (this.score % 5 === 0) {
                        audio.playSuccess();
                    }
                }
                break;
            }
        }

        this.draggedFood = null;
    }

    update() {
        const now = Date.now();

        if (now - this.lastSpawn > this.spawnRate) {
            if (this.animals.length < 4) {
                this.spawnAnimal();
            }
            this.lastSpawn = now;
        }

        if (this.foods.length < 3) {
            const types = this.getAnimalTypes();
            const type = types[Math.floor(Math.random() * types.length)];
            this.foods.push({
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: this.canvas.height - 40,
                type: type,
                radius: 30
            });
        }

        this.animals.forEach(animal => {
            if (animal.hungry) {
                animal.hungryTimer++;
                if (animal.hungryTimer % 60 < 30) {
                    animal.y += Math.sin(animal.hungryTimer * 0.1) * 0.5;
                }
            }
        });

        this.updateParticles();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawSidebar();
        this.drawAnimals();
        this.drawFoods();
        this.drawParticles();
    }

    drawSidebar() {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 80, this.canvas.width, 80);

        this.ctx.fillStyle = '#DEB887';
        this.ctx.fillRect(5, this.canvas.height - 75, this.canvas.width - 10, 70);
    }

    drawAnimals() {
        this.animals.forEach(animal => {
            this.ctx.font = `${animal.radius * 1.5}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            if (animal.hungry) {
                this.ctx.save();
                this.ctx.translate(animal.x, animal.y);
                this.ctx.scale(0.9 + Math.sin(Date.now() * 0.01) * 0.1, 0.9 + Math.sin(Date.now() * 0.01) * 0.1);
                this.ctx.fillText(animal.type.emoji, 0, 0);
                this.ctx.restore();
            } else {
                this.ctx.save();
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillText(animal.type.emoji, animal.x, animal.y);
                this.ctx.restore();
            }
        });
    }

    drawFoods() {
        this.foods.forEach(food => {
            this.ctx.font = `${food.radius * 1.2}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(food.type.food, food.x, food.y);

            if (food === this.draggedFood) {
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(food.x, food.y, food.radius + 5, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        });
    }

    start() {
        this.score = 0;
        this.animals = [];
        this.foods = [];
        this.spawnRate = 3000;
        document.getElementById('feeding-score').textContent = '0';
        super.start();
    }
}

class FireworksGame extends Game {
    constructor() {
        super('fireworks-canvas');
        this.fireworks = [];
        this.score = 0;
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#DDA0DD', '#87CEEB'];

        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.createFirework(x, y);
        this.score++;
        document.getElementById('fireworks-score').textContent = this.score;

        if (this.score % 5 === 0) {
            audio.playSuccess();
        }
    }

    createFirework(x, y) {
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.5;
            const speed = Math.random() * 6 + 3;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            this.particles.push(new Particle(x, y, color, velocity));
        }

        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 5;
            const velocity = {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            };
            const particle = new Particle(x, y, '#FFFFFF', velocity);
            particle.size = Math.random() * 4 + 2;
            particle.gravity = 0.15;
            this.particles.push(particle);
        }

        audio.playFirework();
    }

    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 100; i++) {
            const x = (i * 73) % this.canvas.width;
            const y = (i * 37) % this.canvas.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    update() {
        this.updateParticles();
    }

    draw() {
        this.drawBackground();
        this.drawParticles();
    }

    start() {
        this.score = 0;
        this.particles = [];
        document.getElementById('fireworks-score').textContent = '0';
        super.start();
    }
}

class GameManager {
    constructor() {
        this.currentTheme = 'default';
        this.currentGame = null;
        this.games = {
            bubble: null,
            feeding: null,
            fireworks: null
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.games.bubble = new BubbleGame();
        this.games.feeding = new FeedingGame();
        this.games.fireworks = new FireworksGame();
    }

    setupEventListeners() {
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                audio.playSelect();
                this.startGame(btn.dataset.game);
            });
        });

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                audio.playSelect();
                this.setTheme(btn.dataset.theme);
            });
        });

        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                audio.playSelect();
                this.showMainMenu();
            });
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = theme === 'default' ? '' : `theme-${theme}`;

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    showMainMenu() {
        if (this.currentGame) {
            this.currentGame.stop();
            this.currentGame = null;
        }

        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        document.getElementById('main-menu').classList.add('active');
    }

    startGame(gameName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        document.getElementById(`${gameName}-game`).classList.add('active');

        if (this.currentGame) {
            this.currentGame.stop();
        }

        this.currentGame = this.games[gameName];
        this.currentGame.start();
    }
}

const gameManager = new GameManager();
