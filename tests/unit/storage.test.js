import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../../src/storage.js';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns fallback when nothing stored', () => {
    expect(storage.getTheme()).toBe('default');
    expect(storage.getMuted()).toBe(false);
    expect(storage.getBest('bubble')).toBe(0);
  });

  it('round-trips theme', () => {
    storage.setTheme('boy');
    expect(storage.getTheme()).toBe('boy');
  });

  it('round-trips muted', () => {
    storage.setMuted(true);
    expect(storage.getMuted()).toBe(true);
  });

  it('round-trips best per game', () => {
    storage.setBest('bubble', 42);
    storage.setBest('fireworks', 7);
    expect(storage.getBest('bubble')).toBe(42);
    expect(storage.getBest('fireworks')).toBe(7);
    expect(storage.getBest('feeding')).toBe(0);
  });

  it('survives corrupted JSON', () => {
    localStorage.setItem('ltm.theme', '{bad json');
    expect(storage.getTheme()).toBe('default');
  });
});
