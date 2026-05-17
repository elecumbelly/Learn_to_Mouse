import { Game } from '../game-base.js';
import { audio } from '../audio.js';
import { Particle } from '../particle.js';
import { PALETTE, pickRandom } from '../colors.js';
import { storage } from '../storage.js';

export class FireworksGame extends Game {
  constructor(onScore) {
    super('fireworks-canvas');
    this.onScore = onScore;
    this.score = 0;
    this.best = storage.getBest('fireworks');
    this.stars = [];

    this.canvas.addEventListener('click', (e) => {
      if (this.active) this.handleClick(e);
    });
  }

  generateStars() {
    this.stars = [];
    for (let i = 0; i < 120; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.85,
        size: Math.random() * 1.4 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  handleClick(e) {
    const { x, y } = this.pointerPos(e);
    this.createFirework(x, y);
    this.score++;
    this.onScore?.(this.score);
    if (this.score > this.best) {
      this.best = this.score;
      storage.setBest('fireworks', this.best);
    }
    if (this.score % 5 === 0) {
      audio.playSuccess();
      this.triggerShake(3);
    }
  }

  createFirework(x, y) {
    const color = pickRandom(PALETTE);
    const count = 32;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4;
      const speed = Math.random() * 6 + 3;
      this.particles.push(
        new Particle(x, y, color, {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        }, { gravity: 0.1, fadeRate: 0.014, shrinkRate: 0.985, drag: 0.985 })
      );
    }
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 5;
      this.particles.push(
        new Particle(x, y, '#FFFFFF', {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        }, { gravity: 0.15, fadeRate: 0.022, shrinkRate: 0.97, size: Math.random() * 3 + 2 })
      );
    }
    this.triggerShake(2);
    audio.playFirework();
  }

  resize() {
    super.resize();
    this.generateStars();
  }

  drawBackground() {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#0b0b1a');
    grad.addColorStop(0.55, '#16213e');
    grad.addColorStop(1, '#0f3460');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    const t = performance.now() / 1000;
    for (const s of this.stars) {
      const alpha = 0.45 + Math.sin(s.twinkle + t * 2) * 0.3;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  update(_dt) {
    this.updateParticles();
  }

  draw(_dt) {
    this.drawBackground();
    this.drawParticles();
  }

  start() {
    this.score = 0;
    this.particles = [];
    this.generateStars();
    this.onScore?.(0);
    super.start();
  }
}
