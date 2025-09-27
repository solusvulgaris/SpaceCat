# 🐱 Space Cat

A fun and engaging space adventure game featuring a cat astronaut navigating through the cosmos! Built with HTML5 Canvas and vanilla JavaScript.

## 🎮 Game Features

- **Cat Astronaut**: Play as an adorable cat exploring space
- **Dynamic Gameplay**: Dodge enemies and shoot your way through space
- **Progressive Difficulty**: Game speed increases as you advance levels
- **Particle Effects**: Beautiful explosion effects when defeating enemies
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Sleek, space-themed interface with gradient backgrounds

## 🚀 How to Play

### Controls
- **Arrow Keys**: Move your cat astronaut around
- **Spacebar**: Shoot at enemies
- **P Key**: Pause/Resume the game

### Objective
- Survive as long as possible by avoiding enemy ships
- Shoot enemies to earn points
- Each enemy destroyed gives you 10 points
- Every 100 points increases your level and game speed
- You start with 3 lives

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- A modern web browser

### Quick Start
1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd space-cat
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Or for a simple HTTP server:
   ```bash
   npm start
   ```
5. Open your browser and go to `http://localhost:3000`

### Alternative Setup (No Node.js)
If you don't have Node.js installed, you can simply:
1. Open `index.html` directly in your web browser
2. The game will run locally without a server

## 📁 Project Structure

```
space-cat/
├── index.html          # Main HTML file
├── styles.css          # Game styling and UI
├── game.js            # Core game logic
├── package.json       # Project dependencies and scripts
└── README.md          # This file
```

## 🎯 Game Mechanics

### Player (Space Cat)
- Moves with arrow keys
- Shoots bullets with spacebar
- Has 3 lives initially
- Collision with enemies reduces lives

### Enemies
- Spawn randomly from the top of the screen
- Move downward at varying speeds
- Destroyed by player bullets
- Collision with player reduces lives

### Scoring System
- 10 points per enemy destroyed
- Level increases every 100 points
- Game speed increases with each level

## 🎨 Customization

The game is built with modular JavaScript, making it easy to customize:

- **Colors**: Modify the color schemes in `game.js` and `styles.css`
- **Game Speed**: Adjust spawn rates and movement speeds
- **Player Stats**: Change starting lives, bullet speed, etc.
- **Enemy Behavior**: Modify enemy spawning patterns and movement

## 🚀 Future Enhancements

Potential features for future versions:
- Power-ups and special weapons
- Different enemy types with unique behaviors
- Sound effects and background music
- High score persistence
- Multiplayer mode
- Mobile touch controls
- More visual effects and animations

## 🛠️ Development

### Scripts
- `npm run dev`: Start live development server with auto-reload
- `npm start`: Start simple HTTP server

### Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## 📝 License

This project is licensed under the MIT License - see the package.json file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🎮 Enjoy Playing!

Have fun exploring the cosmos with your Space Cat! 🐱🚀

---

*Built with ❤️ using HTML5 Canvas and vanilla JavaScript*
