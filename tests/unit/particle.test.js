import { describe, it, expect } from 'vitest';
import { Particle, burst } from '../../src/particle.js';

describe('Particle', () => {
  it('starts opaque', () => {
    const p = new Particle(0, 0, '#fff', { x: 0, y: 0 });
    expect(p.alpha).toBe(1);
    expect(p.dead).toBe(false);
  });

  it('moves according to velocity and gravity', () => {
    const p = new Particle(0, 0, '#fff', { x: 2, y: 0 }, { gravity: 0.1, drag: 1, fadeRate: 0 });
    p.update();
    expect(p.x).toBe(2);
    expect(p.vy).toBeCloseTo(0.1);
  });

  it('fades over time and becomes dead', () => {
    const p = new Particle(0, 0, '#fff', { x: 0, y: 0 }, { fadeRate: 0.3 });
    for (let i = 0; i < 5; i++) p.update();
    expect(p.dead).toBe(true);
  });

  it('respects drag', () => {
    const p = new Particle(0, 0, '#fff', { x: 10, y: 0 }, { drag: 0.5, gravity: 0, fadeRate: 0 });
    p.update();
    expect(p.vx).toBe(5);
  });
});

describe('burst', () => {
  it('pushes count particles into the target array', () => {
    const arr = [];
    burst(arr, 100, 100, '#fff', 12);
    expect(arr).toHaveLength(12);
    for (const p of arr) {
      expect(p).toBeInstanceOf(Particle);
      expect(p.x).toBe(100);
      expect(p.y).toBe(100);
    }
  });

  it('spreads particles in a circle', () => {
    const arr = [];
    burst(arr, 0, 0, '#fff', 8, { spread: 0 });
    const speeds = arr.map((p) => Math.hypot(p.vx, p.vy));
    for (const s of speeds) expect(s).toBeGreaterThan(0);
  });
});
