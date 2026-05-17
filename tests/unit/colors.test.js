import { describe, it, expect } from 'vitest';
import { hexToRgba, lighten, pickRandom, PALETTE } from '../../src/colors.js';

describe('hexToRgba', () => {
  it('converts 6-digit hex with default alpha', () => {
    expect(hexToRgba('#FF6B6B')).toBe('rgba(255, 107, 107, 1)');
  });

  it('respects custom alpha', () => {
    expect(hexToRgba('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
  });

  it('expands 3-digit hex', () => {
    expect(hexToRgba('#abc')).toBe('rgba(170, 187, 204, 1)');
  });

  it('handles hex without leading #', () => {
    expect(hexToRgba('4ECDC4', 0.8)).toBe('rgba(78, 205, 196, 0.8)');
  });
});

describe('lighten', () => {
  it('moves color toward white', () => {
    expect(lighten('#000000', 0.5)).toBe('rgb(128, 128, 128)');
  });

  it('returns approximately the same color with zero amount', () => {
    expect(lighten('#FF6B6B', 0)).toBe('rgb(255, 107, 107)');
  });

  it('caps at white', () => {
    expect(lighten('#FFFFFF', 0.9)).toBe('rgb(255, 255, 255)');
  });
});

describe('pickRandom', () => {
  it('returns an element from the palette', () => {
    const c = pickRandom();
    expect(PALETTE).toContain(c);
  });

  it('works on a custom array', () => {
    expect(pickRandom(['a'])).toBe('a');
  });
});
