import { audio } from './audio.js';
import { prefersReducedMotion } from './storage.js';

export class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.active = false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.shake = 0;
    this.reducedMotion = prefersReducedMotion();

    this._resize = () => this.resize();
    this._motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._motionHandler = () => {
      this.reducedMotion = prefersReducedMotion();
    };

    this.resize();
  }

  resize() {
    const container = this.canvas.parentElement;
    const cssW = Math.min(container.clientWidth - 40, 1000);
    const cssH = Math.min(window.innerHeight * 0.6, 600);
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
    this.canvas.width = Math.round(cssW * this.dpr);
    this.canvas.height = Math.round(cssH * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.width = cssW;
    this.height = cssH;
  }

  pointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  triggerShake(amount = 6) {
    if (this.reducedMotion) return;
    this.shake = Math.min(this.shake + amount, 18);
  }

  updateParticles() {
    for (const p of this.particles) p.update();
    this.particles = this.particles.filter((p) => !p.dead);
  }

  drawParticles() {
    for (const p of this.particles) p.draw(this.ctx);
  }

  start() {
    this.active = true;
    audio.init();
    window.addEventListener('resize', this._resize);
    this._motionQuery.addEventListener?.('change', this._motionHandler);
    this.lastFrame = performance.now();
    this.animate();
  }

  stop() {
    this.active = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this._resize);
    this._motionQuery.removeEventListener?.('change', this._motionHandler);
  }

  animate() {
    if (!this.active) return;
    const now = performance.now();
    const dt = Math.min(now - this.lastFrame, 50);
    this.lastFrame = now;
    this.update(dt);
    this.ctx.save();
    if (this.shake > 0.5 && !this.reducedMotion) {
      const sx = (Math.random() - 0.5) * this.shake;
      const sy = (Math.random() - 0.5) * this.shake;
      this.ctx.translate(sx, sy);
      this.shake *= 0.85;
    } else {
      this.shake = 0;
    }
    this.draw(dt);
    this.ctx.restore();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  update(_dt) {}
  draw(_dt) {}
}
