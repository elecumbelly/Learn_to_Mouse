import { audio } from './audio.js';
import { storage } from './storage.js';
import { BubbleGame } from './games/bubble.js';
import { FeedingGame } from './games/feeding.js';
import { FireworksGame } from './games/fireworks.js';

export class GameManager {
  constructor() {
    this.currentGame = null;
    this.games = {};
    this.scoreEls = {};
    this.bestEls = {};
  }

  init() {
    this.scoreEls = {
      bubble: document.getElementById('bubble-score'),
      feeding: document.getElementById('feeding-score'),
      fireworks: document.getElementById('fireworks-score'),
    };
    this.bestEls = {
      bubble: document.getElementById('bubble-best'),
      feeding: document.getElementById('feeding-best'),
      fireworks: document.getElementById('fireworks-best'),
    };

    this.games.bubble = new BubbleGame((s) => this.updateScore('bubble', s));
    this.games.feeding = new FeedingGame((s) => this.updateScore('feeding', s));
    this.games.fireworks = new FireworksGame((s) => this.updateScore('fireworks', s));

    for (const k of Object.keys(this.games)) {
      this.updateBest(k, this.games[k].best);
    }

    this.setTheme(storage.getTheme());
    this.setupListeners();
    this.updateMuteButton();
  }

  setupListeners() {
    document.querySelectorAll('.game-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.init();
        audio.playSelect();
        this.startGame(btn.dataset.game);
      });
    });
    document.querySelectorAll('.theme-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.playSelect();
        this.setTheme(btn.dataset.theme);
      });
    });
    document.querySelectorAll('.back-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.playSelect();
        this.showMainMenu();
      });
    });
    const muteBtn = document.getElementById('mute-btn');
    muteBtn?.addEventListener('click', () => {
      audio.init();
      audio.toggleMuted();
      this.updateMuteButton();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentGame) this.showMainMenu();
      if (e.key === 'm' || e.key === 'M') {
        audio.init();
        audio.toggleMuted();
        this.updateMuteButton();
      }
    });
  }

  updateMuteButton() {
    const muteBtn = document.getElementById('mute-btn');
    if (!muteBtn) return;
    const muted = audio.muted;
    muteBtn.textContent = muted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-label', muted ? 'Unmute audio' : 'Mute audio');
    muteBtn.setAttribute('aria-pressed', String(muted));
  }

  updateScore(game, score) {
    if (this.scoreEls[game]) this.scoreEls[game].textContent = String(score);
    const best = storage.getBest(game);
    if (score > 0 && score >= best) this.updateBest(game, score);
  }

  updateBest(game, best) {
    if (this.bestEls[game]) this.bestEls[game].textContent = String(best);
  }

  setTheme(theme) {
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
    document.querySelectorAll('.theme-btn').forEach((btn) => {
      const active = btn.dataset.theme === theme;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    storage.setTheme(theme);
  }

  showMainMenu() {
    if (this.currentGame) {
      this.currentGame.stop();
      this.currentGame = null;
    }
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    const menu = document.getElementById('main-menu');
    menu.classList.add('active');
    menu.querySelector('.game-btn')?.focus();
  }

  startGame(name) {
    const game = this.games[name];
    if (!game) return;
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    const screen = document.getElementById(`${name}-game`);
    screen.classList.add('active');
    screen.querySelector('.back-btn')?.focus();
    if (this.currentGame) this.currentGame.stop();
    this.currentGame = game;
    game.resize();
    game.start();
  }
}
