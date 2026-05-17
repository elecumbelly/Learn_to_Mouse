import { Game } from '../game-base.js';
import { audio } from '../audio.js';
import { burst } from '../particle.js';
import { PALETTE, hexToRgba, lighten, pickRandom } from '../colors.js';
import { storage } from '../storage.js';

const SPAWN_BASE_MS = 1000;
const SPAWN_MIN_MS = 320;

export class BubbleGame extends Game {
  constructor(onScore) {
    super('bubble-canvas');
    this.onScore = onScore;
    this.bubbles = [];
    this.score = 0;
    this.best = storage.getBest('bubble');
    this.lastSpawn = 0;
    this.spawnRate = SPAWN_BASE_MS;

    this.canvas.addEventListener('click', (e) => {
      if (this.active) this.handleClick(e);
    });
  }

  handleClick(e) {
    const { x, y } = this.pointerPos(e);
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      const dx = x - b.x;
      const dy = y - b.y;
      if (dx * dx + dy * dy < b.radius * b.radius) {
        burst(this.particles, b.x, b.y, b.color, 20, { speedMin: 1, speedRange: 6 });
        audio.playPop();
        this.bubbles.splice(i, 1);
        this.score++;
        this.onScore?.(this.score);
        if (this.score > this.best) {
          this.best = this.score;
          storage.setBest('bubble', this.best);
        }
        if (this.score % 10 === 0) {
          audio.playSuccess();
          this.spawnRate = Math.max(SPAWN_MIN_MS, this.spawnRate - 100);
          this.triggerShake(5);
        }
        return;
      }
    }
  }

  spawnBubble() {
    const radius = Math.random() * 30 + 40;
    this.bubbles.push({
      x: Math.random() * (this.width - radius * 2) + radius,
      y: this.height + radius,
      radius,
      speed: Math.random() * 1.6 + 0.9,
      color: pickRandom(PALETTE),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.04 + 0.02,
    });
  }

  update(_dt) {
    const now = performance.now();
    if (now - this.lastSpawn > this.spawnRate) {
      this.spawnBubble();
      this.lastSpawn = now;
    }
    this.bubbles = this.bubbles.filter((b) => {
      b.y -= b.speed;
      b.wobble += b.wobbleSpeed;
      b.x += Math.sin(b.wobble) * 0.6;
      return b.y + b.radius > 0;
    });
    this.updateParticles();
  }

  draw(_dt) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (const b of this.bubbles) {
      const grad = this.ctx.createRadialGradient(
        b.x - b.radius * 0.35,
        b.y - b.radius * 0.35,
        b.radius * 0.05,
        b.x,
        b.y,
        b.radius
      );
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.25, lighten(b.color, 0.25));
      grad.addColorStop(0.85, b.color);
      grad.addColorStop(1, hexToRgba(b.color, 0.5));
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(b.x - b.radius * 0.4, b.y - b.radius * 0.4, b.radius * 0.18, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.fill();
    }
    this.drawParticles();
  }

  start() {
    this.score = 0;
    this.bubbles = [];
    this.spawnRate = SPAWN_BASE_MS;
    this.onScore?.(0);
    super.start();
  }

}
