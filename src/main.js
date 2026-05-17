import './styles.css';
import { GameManager } from './manager.js';

function boot() {
  const manager = new GameManager();
  manager.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
