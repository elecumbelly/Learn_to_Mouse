import { Game } from '../game-base.js';
import { audio } from '../audio.js';
import { burst } from '../particle.js';
import { storage } from '../storage.js';

const ANIMAL_TYPES = [
  { emoji: '🐰', food: '🥕', name: 'rabbit' },
  { emoji: '🐱', food: '🐟', name: 'cat' },
  { emoji: '🐶', food: '🦴', name: 'dog' },
  { emoji: '🐦', food: '🌾', name: 'bird' },
  { emoji: '🐵', food: '🍌', name: 'monkey' },
  { emoji: '🐢', food: '🥬', name: 'turtle' },
];

const SHELF_HEIGHT = 90;
const MAX_ANIMALS = 4;
const MAX_FOODS = 3;
const SPAWN_RATE_MS = 3000;

export class FeedingGame extends Game {
  constructor(onScore) {
    super('feeding-canvas');
    this.onScore = onScore;
    this.animals = [];
    this.foods = [];
    this.draggedFood = null;
    this.dragOffset = { x: 0, y: 0 };
    this.score = 0;
    this.best = storage.getBest('feeding');
    this.lastSpawn = 0;

    this.canvas.addEventListener('mousedown', (e) => {
      if (this.active) this.handleMouseDown(e);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.active) this.handleMouseMove(e);
    });
    this.canvas.addEventListener('mouseup', (e) => {
      if (this.active) this.handleMouseUp(e);
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.draggedFood = null;
    });
  }

  pickRandomType() {
    return ANIMAL_TYPES[Math.floor(Math.random() * ANIMAL_TYPES.length)];
  }

  spawnAnimal() {
    const type = this.pickRandomType();
    this.animals.push({
      x: Math.random() * (this.width - 120) + 60,
      y: Math.random() * (this.height - SHELF_HEIGHT - 120) + 60,
      type,
      radius: 50,
      hungry: true,
      hungryTimer: Math.random() * Math.PI * 2,
      fadeAlpha: 1,
    });
  }

  spawnFood() {
    const type = this.pickRandomType();
    const slot = this.foods.length;
    this.foods.push({
      x: 80 + slot * 120,
      y: this.height - SHELF_HEIGHT / 2,
      homeX: 80 + slot * 120,
      homeY: this.height - SHELF_HEIGHT / 2,
      type,
      radius: 32,
    });
  }

  handleMouseDown(e) {
    const { x, y } = this.pointerPos(e);
    for (let i = this.foods.length - 1; i >= 0; i--) {
      const f = this.foods[i];
      const dx = x - f.x;
      const dy = y - f.y;
      if (dx * dx + dy * dy < (f.radius + 6) ** 2) {
        this.draggedFood = f;
        this.dragOffset = { x: dx, y: dy };
        audio.playSelect();
        return;
      }
    }
  }

  handleMouseMove(e) {
    if (!this.draggedFood) return;
    const { x, y } = this.pointerPos(e);
    this.draggedFood.x = x - this.dragOffset.x;
    this.draggedFood.y = y - this.dragOffset.y;
  }

  handleMouseUp(e) {
    if (!this.draggedFood) return;
    const { x, y } = this.pointerPos(e);
    let fed = false;
    for (const animal of this.animals) {
      const dx = x - animal.x;
      const dy = y - animal.y;
      const hit = animal.radius + 32;
      if (dx * dx + dy * dy < hit * hit && animal.hungry) {
        if (this.draggedFood.type.food === animal.type.food) {
          audio.playChomp();
          burst(this.particles, animal.x, animal.y, '#FFD700', 18, {
            speedMin: 1.5,
            speedRange: 4,
          });
          animal.hungry = false;
          this.foods = this.foods.filter((f) => f !== this.draggedFood);
          this.score++;
          this.onScore?.(this.score);
          if (this.score > this.best) {
            this.best = this.score;
            storage.setBest('feeding', this.best);
          }
          if (this.score % 5 === 0) {
            audio.playSuccess();
            this.triggerShake(4);
          }
          fed = true;
        } else {
          audio.playSelect();
        }
        break;
      }
    }
    if (!fed && this.draggedFood) {
      this.draggedFood.x = this.draggedFood.homeX;
      this.draggedFood.y = this.draggedFood.homeY;
    }
    this.draggedFood = null;
  }

  update(_dt) {
    const now = performance.now();
    if (now - this.lastSpawn > SPAWN_RATE_MS && this.animals.length < MAX_ANIMALS) {
      this.spawnAnimal();
      this.lastSpawn = now;
    }
    while (this.foods.length < MAX_FOODS) this.spawnFood();

    for (const a of this.animals) {
      if (a.hungry) {
        a.hungryTimer += 0.05;
      } else {
        a.fadeAlpha = Math.max(0.35, a.fadeAlpha - 0.005);
      }
    }
    this.updateParticles();
  }

  draw(_dt) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawShelf();
    this.drawAnimals();
    this.drawFoods();
    this.drawParticles();
  }

  drawShelf() {
    const y = this.height - SHELF_HEIGHT;
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(0, y, this.width, SHELF_HEIGHT);
    this.ctx.fillStyle = '#DEB887';
    this.ctx.fillRect(6, y + 6, this.width - 12, SHELF_HEIGHT - 12);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    this.ctx.lineWidth = 1;
    for (let i = 1; i < 6; i++) {
      const lineY = y + 6 + (SHELF_HEIGHT - 12) * (i / 6);
      this.ctx.beginPath();
      this.ctx.moveTo(6, lineY);
      this.ctx.lineTo(this.width - 6, lineY);
      this.ctx.stroke();
    }
  }

  drawAnimals() {
    for (const a of this.animals) {
      this.ctx.save();
      this.ctx.font = `${a.radius * 1.6}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      if (a.hungry) {
        const scale = 0.95 + Math.sin(a.hungryTimer) * 0.07;
        this.ctx.translate(a.x, a.y + Math.sin(a.hungryTimer) * 2);
        this.ctx.scale(scale, scale);
        this.ctx.fillText(a.type.emoji, 0, 0);
      } else {
        this.ctx.globalAlpha = a.fadeAlpha;
        this.ctx.fillText(a.type.emoji, a.x, a.y);
      }
      this.ctx.restore();
    }
  }

  drawFoods() {
    for (const f of this.foods) {
      this.ctx.save();
      this.ctx.font = `${f.radius * 1.5}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      if (f === this.draggedFood) {
        this.ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        this.ctx.shadowBlur = 18;
      }
      this.ctx.fillText(f.type.food, f.x, f.y);
      this.ctx.restore();
      if (f === this.draggedFood) {
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(f.x, f.y, f.radius + 8, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    }
  }

  start() {
    this.score = 0;
    this.animals = [];
    this.foods = [];
    this.draggedFood = null;
    this.onScore?.(0);
    super.start();
  }
}
