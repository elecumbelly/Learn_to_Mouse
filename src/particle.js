export class Particle {
  constructor(x, y, color, velocity, opts = {}) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = velocity.x;
    this.vy = velocity.y;
    this.alpha = 1;
    this.size = opts.size ?? Math.random() * 6 + 3;
    this.gravity = opts.gravity ?? 0.12;
    this.fadeRate = opts.fadeRate ?? 0.018;
    this.shrinkRate = opts.shrinkRate ?? 0.985;
    this.drag = opts.drag ?? 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.drag;
    this.vy = this.vy * this.drag + this.gravity;
    this.alpha -= this.fadeRate;
    this.size *= this.shrinkRate;
  }

  draw(ctx) {
    if (this.alpha <= 0 || this.size <= 0.2) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  get dead() {
    return this.alpha <= 0 || this.size <= 0.2;
  }
}

export function burst(target, x, y, color, count = 15, opts = {}) {
  const speedMin = opts.speedMin ?? 2;
  const speedRange = opts.speedRange ?? 5;
  const spread = opts.spread ?? 0.5;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * spread;
    const speed = Math.random() * speedRange + speedMin;
    target.push(
      new Particle(x, y, color, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      }, opts)
    );
  }
}
