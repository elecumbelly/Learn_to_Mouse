const PREFIX = 'ltm.';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // localStorage may be disabled (private mode, quota); fail silently
  }
}

export const storage = {
  getTheme: () => read('theme', 'default'),
  setTheme: (t) => write('theme', t),
  getMuted: () => read('muted', false),
  setMuted: (m) => write('muted', m),
  getBest: (game) => read(`best.${game}`, 0),
  setBest: (game, score) => write(`best.${game}`, score),
  getReducedMotion: () => read('reducedMotion', null),
  setReducedMotion: (v) => write('reducedMotion', v),
};

export function prefersReducedMotion() {
  const override = storage.getReducedMotion();
  if (override !== null) return override;
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
