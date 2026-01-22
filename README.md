# Learn to Mouse! 🖱️🎮

![Static Badge](https://img.shields.io/badge/status-production-success?style=for-the-badge)
![License](https://img.shields.io/badge/license-educational-informational?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge)
![Made with](https://img.shields.io/badge/made%20with-❤️-red?style=for-the-badge)

A collection of three educational games designed to teach toddlers (ages 2-4) how to use a computer mouse through progressive skill building. Built with pure HTML, CSS, and JavaScript - no dependencies required.

---

**🎯 Try it live:** [Demo Link](https://elecumbelly.github.io/Learn_to_Mouse/) | [GitHub Repository](https://github.com/elecumbelly/Learn_to_Mouse)

## Features

### Three Games

1. **Bubble Popper** 🫧
   - Teaches: Basic clicking and mouse movement
   - Click floating bubbles to pop them
   - Large targets for easy success
   - Satisfying pop sounds and animations

2. **Feeding Time** 🐰
   - Teaches: Drag and drop
   - Drag food from the sidebar to hungry animals
   - Match food to the right animal (carrot → rabbit)
   - Forgiving hitboxes make dragging easy

3. **Firework Creator** 🎆
   - Teaches: Targeting and precision clicking
   - Click anywhere to create beautiful fireworks
   - Creative expression with colorful particle effects
   - Dark sky background for dramatic effect

### Skill Progression

```
Bubble Popper → Feeding Time → Firework Creator
(basic click) → (drag & drop) → (precision targeting)
```

## How to Run

### Option 1: Python (Recommended)
```bash
cd "Learn_to_Mouse"
python3 -m http.server 8765
```
Then open: http://localhost:8765

### Option 2: Node.js
```bash
cd "Learn_to_Mouse"
npx http-server -p 8765
```

### Option 3: Direct File
Simply open `index.html` in any modern web browser.

## Theme Options

- **🌈 Default**: Colorful rainbow theme
- **🚀 Boy Theme**: Blue/space theme
- **🦄 Girl Theme**: Pink/pastel theme

## Design for Toddlers

- Large clickable areas (minimum 40-50px radius)
- Bright, engaging colors
- Instant audio/visual feedback
- No failure states or punishment
- Short, repeatable gameplay loops
- Emoji-based icons (no reading required)
- Smooth animations for engagement

## Audio Feedback

All games use Web Audio API for sound effects:
- Pop sounds when popping bubbles
- Chewing sounds when feeding animals
- Explosion sounds for fireworks
- Success chimes for milestones

## Technical Details

- Pure HTML/CSS/JavaScript (no dependencies)
- Canvas-based rendering for smooth performance
- Responsive design (works on different screen sizes)
- Web Audio API for sound generation (no external audio files)

## Game Controls

- **Mouse movement**: Navigate cursor
- **Left click**: Interact with game elements
- **Click and drag**: Move food in Feeding Time

## Tips for Parents

1. Start with **Bubble Popper** to build confidence
2. When comfortable, try **Feeding Time** for drag-and-drop skills
3. Finally, advance to **Firework Creator** for precision
4. Switch themes based on child's preference
5. Praise successes and keep sessions short (5-10 minutes)

## Browser Support

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

Free for educational use.

---

## Project Structure

```
Learn_to_Mouse/
├── index.html       # Main HTML with all game screens
├── styles.css       # Styling with responsive design
├── game.js          # All game logic (700+ lines)
└── README.md        # This file
```

## Development Background

This project is based on research into early childhood development and educational game design:

- **Motor Development**: Toddlers (2-4 years) are developing fine motor skills and hand-eye coordination
- **Attention Span**: Short sessions (2-5 minutes) are developmentally appropriate
- **Positive Reinforcement**: Immediate feedback without punishment builds confidence
- **Progressive Difficulty**: Skills build incrementally (click → drag → precision)

### Educational Benefits

- **Fine Motor Skills**: Small muscle development through precise mouse control
- **Hand-Eye Coordination**: Connecting visual targets with physical actions
- **Cause-Effect Understanding**: Immediate feedback reinforces learning
- **Computer Literacy**: Foundation for future digital skills
- **Pattern Recognition**: Matching food to animals, shapes, and sequences

## Game Mechanics

### Bubble Popper
- Bubbles spawn from bottom and float up with random paths
- Wobble animation simulates natural floating
- Generous hitboxes (radius 40-70px) for easy clicking
- Speed increases every 10 pops for progressive challenge
- Particle explosion on pop with pop sound effect

### Feeding Time
- Animals spawn randomly in play area with wobble animation when hungry
- Food appears in sidebar (brown wooden shelf)
- Drag-and-drop with visual trail
- Magnet snap effect when near target animal
- Match correct food to animal type
- Animals fade when fed (become satisfied)
- New animals spawn every 3 seconds (up to 4 max)
- 3 food items in sidebar at all times

### Firework Creator
- Dark night sky with star background
- Click anywhere to launch firework
- 30 colored particles + 10 white sparkle particles per explosion
- Particles have gravity and fade out
- Multiple colors available
- Creates artistic "show" without wrong answers

## Technical Implementation

### Class Structure

- `AudioSystem`: Web Audio API sound generation (no external files)
- `Particle`: Physics-based particle with gravity and fade
- `Game`: Base class for common game functionality
- `BubbleGame`: Extends Game - bubble spawning and popping logic
- `FeedingGame`: Extends Game - drag-and-drop and animal feeding logic
- `FireworksGame`: Extends Game - firework particle systems
- `GameManager`: Handles navigation between games and theme switching

### Performance Optimizations

- Canvas rendering at 60fps
- Particle pooling (arrays filtered for alpha > 0)
- RequestAnimationFrame for smooth animations
- Event delegation for efficient mouse handling
- CSS transitions for UI animations

### Accessibility Features

- Large click targets (minimum 80px diameter)
- High contrast colors
- No text required (emoji-based)
- Clear visual feedback
- No penalty for mistakes
- Adjustable difficulty through progression

## Browser Compatibility

Tested and working in:
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

## Future Enhancements

Potential additions for v2.0:
- [ ] Touchscreen support for tablets
- [ ] More theme options (holiday, seasonal)
- [ ] Score tracking across sessions
- [ ] Level unlocks based on skill mastery
- [ ] Parental dashboard with progress reports
- [ ] Multi-language support
- [ ] Difficulty settings for advanced play

## Contributing

This project is open for educational use and improvement. Suggestions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Acknowledgments

Built with ❤️ for parents and educators helping children build digital skills.

Design inspired by:
- Early childhood development research
- Occupational therapy guidelines for fine motor skills
- Educational game design principles for preschoolers

## License

Free for educational use.
