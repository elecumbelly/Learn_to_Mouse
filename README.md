# Learn to Mouse! 🖱️🎮

![Static Badge](https://img.shields.io/badge/status-production-success?style=for-the-badge)
![License](https://img.shields.io/badge/license-educational-informational?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-yellow?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-installable-purple?style=for-the-badge)

Three educational games that teach toddlers (ages 2–4) how to use a computer mouse through progressive skill building. Vanilla JS, canvas-rendered, installable as a PWA, works offline.

**📦 Repository:** [github.com/elecumbelly/Learn_to_Mouse](https://github.com/elecumbelly/Learn_to_Mouse) · run locally with `npm run dev`

---

## The three games

| Game             | Skill                | What you do                                |
| ---------------- | -------------------- | ------------------------------------------ |
| 🫧 Bubble Popper | Click + movement     | Pop floating bubbles before they escape    |
| 🐰 Feeding Time  | Drag and drop        | Drag the right food onto each hungry animal |
| 🎆 Firework Maker | Targeting / precision | Click anywhere to launch colorful fireworks |

Skill progression: **click → drag → precision**.

## Features

- **Persistent high scores** per game (localStorage)
- **Themes**: Default (rainbow), Space (blue), Candy (pink) — saved across sessions
- **Mute toggle** (button or press `M`) — saved across sessions
- **`Esc`** returns to the main menu from any game
- **Reduced-motion** awareness — disables shake and bounces for users who prefer it
- **Installable PWA** — add to home screen, works offline after first load
- **HiDPI canvas** — sharp on Retina displays
- **No external assets** — sounds via Web Audio API, icons via emoji and SVG

## Run locally

```bash
npm install
npm run dev          # http://localhost:8765
```

Other commands:

```bash
npm run build        # production build → dist/
npm run preview      # serve the build at :4173
npm run lint         # ESLint
npm test             # Vitest unit tests
npm run test:e2e     # Playwright end-to-end tests
npm run format       # Prettier
```

## Project structure

```
.
├── public/                # static assets copied as-is
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   └── icons/             # PWA manifest icons
├── src/
│   ├── audio.js           # Web Audio System (mute-aware)
│   ├── colors.js          # palette, hex→rgba, lighten
│   ├── particle.js        # physics-based particles + bursts
│   ├── storage.js         # localStorage wrapper (theme, mute, scores)
│   ├── game-base.js       # canvas sizing, RAF loop, screen-shake
│   ├── games/
│   │   ├── bubble.js
│   │   ├── feeding.js
│   │   └── fireworks.js
│   ├── manager.js         # menu, theme, keyboard, mute
│   ├── styles.css
│   └── main.js            # entry point
├── tests/
│   ├── unit/              # Vitest (jsdom)
│   └── e2e/               # Playwright (chromium)
├── .github/workflows/
│   ├── ci.yml             # lint + unit + e2e on every PR
│   └── deploy.yml         # build → GitHub Pages on main
├── index.html
├── vite.config.js
├── eslint.config.js
└── playwright.config.js
```

## How it works

- **GameManager** wires up menu buttons, theme/mute toggles, keyboard shortcuts, and swaps the active `<section class="screen">` when you pick a game.
- **Game** (base class) handles HiDPI canvas sizing, a `requestAnimationFrame` loop, an optional screen-shake effect, and particle pool maintenance.
- **BubbleGame** / **FeedingGame** / **FireworksGame** extend `Game` and implement `update(dt)` and `draw(dt)`.
- **AudioSystem** routes all tones through a master gain so muting is instant and persistent.
- **Storage** is a thin localStorage wrapper that fails silently in private-browsing mode.

## Design for toddlers

- Large click targets (radius 40–70 px)
- Bright, high-contrast colors
- Immediate audio + visual feedback
- No failure states or penalties
- Short, repeatable gameplay loops
- Emoji-based icons (no reading required)
- High scores celebrate progress without comparison to others

## Accessibility

- ARIA labels on all interactive controls
- `aria-pressed` state on toggleable buttons (theme, mute)
- Visible focus rings via `:focus-visible`
- Keyboard shortcuts: `M` to mute, `Esc` to leave a game
- Respects `prefers-reduced-motion`

## Browser support

Modern evergreens: Chrome 90+, Edge 90+, Firefox 88+, Safari 14+.

## License

Free for educational use.
