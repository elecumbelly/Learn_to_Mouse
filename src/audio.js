import { storage } from './storage.js';

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = storage.getMuted();
  }

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    this.master.connect(this.ctx.destination);
  }

  setMuted(muted) {
    this.muted = muted;
    storage.setMuted(muted);
    if (this.master) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(muted ? 0 : 0.8, this.ctx.currentTime + 0.05);
    }
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  playTone(frequency, duration, type = 'sine', when = 0) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.master);
    osc.frequency.value = frequency;
    osc.type = type;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  playPop() {
    this.playTone(900, 0.08, 'sine');
    this.playTone(650, 0.1, 'sine', 0.04);
  }

  playSuccess() {
    [523, 659, 784].forEach((f, i) => this.playTone(f, 0.18, 'sine', i * 0.1));
  }

  playFirework() {
    const freqs = [380, 480, 580, 700, 820];
    freqs.forEach((f, i) => this.playTone(f, 0.16, 'triangle', i * 0.03));
  }

  playChomp() {
    this.playTone(280, 0.09, 'square');
    this.playTone(220, 0.09, 'square', 0.07);
    this.playTone(180, 0.1, 'square', 0.14);
  }

  playSelect() {
    this.playTone(520, 0.05, 'sine');
  }
}

export const audio = new AudioSystem();
