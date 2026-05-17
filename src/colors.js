export const PALETTE = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#DDA0DD',
  '#87CEEB',
];

export function hexToRgba(hex, alpha = 1) {
  const m = hex.replace('#', '');
  const full = m.length === 3
    ? m.split('').map((c) => c + c).join('')
    : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function lighten(hex, amount = 0.3) {
  const m = hex.replace('#', '');
  const full = m.length === 3
    ? m.split('').map((c) => c + c).join('')
    : m;
  let r = parseInt(full.slice(0, 2), 16);
  let g = parseInt(full.slice(2, 4), 16);
  let b = parseInt(full.slice(4, 6), 16);
  r = Math.min(255, Math.round(r + (255 - r) * amount));
  g = Math.min(255, Math.round(g + (255 - g) * amount));
  b = Math.min(255, Math.round(b + (255 - b) * amount));
  return `rgb(${r}, ${g}, ${b})`;
}

export function pickRandom(palette = PALETTE) {
  return palette[Math.floor(Math.random() * palette.length)];
}
