# Bloom Beasts - Web Deployment

This is the web browser deployment of Bloom Beasts card game, fully integrated with the actual game engine.

## Structure

```
deployments/web/
├── index.html          # Main HTML file
├── styles.css          # Game styling
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
├── rollup.config.js    # Build configuration
├── src/
│   ├── main.ts        # Main entry point (uses real GameManager)
│   └── platform.ts    # Web platform implementation (PlatformCallbacks)
├── dist/              # Compiled output
│   └── bundle.js      # Bundled game code
└── assets/            # Images, sounds, etc.
```

## Features

✅ **Full TypeScript** - Built with TypeScript for type safety
✅ **Real GameManager** - Uses the actual bloombeasts game engine
✅ **Platform Callbacks** - Clean separation via PlatformCallbacks interface
✅ **LocalStorage Saves** - Persistent game saves
✅ **Canvas-Based Rendering** - Image-based UI using HTML5 Canvas
✅ **Position System** - Cards positioned using shared/constants/positions
✅ **Image Assets** - Loads Menu.png, Background.png, and Playboard.png backgrounds

## Setup

### Install Dependencies

```bash
cd deployments/web
npm install
```

### Build the Game

```bash
npm run build          # Build once
npm run build:watch    # Build and watch for changes
npm run dev           # Build + watch + serve
```

## Running the Game

### Option 1: Use npm serve script

```bash
npm run serve
# Visit http://localhost:8000/deployments/web/
```

**Note:** The server runs from the project root to access shared images directly.

### Option 2: Use the start scripts

```bash
# Windows
start-server.bat

# Linux/Mac
./start-server.sh
```

### Option 3: Use any local server

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Then open http://localhost:8000 in your browser.

## How It Works

### Architecture

1. **bloombeasts/** - Platform-agnostic game engine
   - Game logic, state management, card definitions
   - Mission system, combat system, leveling
   - Exports GameManager class

2. **deployments/web/** - Web-specific presentation layer
   - WebPlatform class implements PlatformCallbacks
   - Canvas-based rendering, click region tracking, localStorage
   - Minimal HTML with full-screen canvas for visual presentation

3. **PlatformCallbacks Interface** - Clean boundary
   - GameManager emits state changes via callbacks
   - WebPlatform renders UI based on game state
   - User input flows back through callbacks

### Data Flow

```
User Click → Canvas click region → GameManager callback →
GameManager processes → GameManager calls platform.render*() →
WebPlatform draws to canvas → User sees result
```

### Integration Points

The `WebPlatform` class in `src/platform.ts` implements all required callbacks:

- **UI Rendering**: `renderStartMenu()`, `renderMissionSelect()`, `renderInventory()`, `renderBattle()`
  - Renders background images from `shared/images/`
  - Draws buttons and cards on canvas
  - Uses position data from `shared/constants/positions`
- **User Input**: Click region tracking for interactive elements
- **Storage**: `saveData()`, `loadData()` using localStorage
- **Assets**: Image loading for backgrounds and card images
- **Dialogs**: `showDialog()`, `showRewards()` using modal overlays

## Development

### Building

```bash
npm run build         # Production build
npm run build:watch   # Watch mode for development
```

### File Structure

- `src/main.ts` - Entry point, creates WebPlatform and GameManager
- `src/platform.ts` - WebPlatform class implementing PlatformCallbacks with canvas rendering
- `index.html` - Minimal HTML with canvas element and modal overlay
- `rollup.config.js` - Bundles TypeScript from web + bloombeasts + shared folders
- `tsconfig.json` - TypeScript configuration for web deployment

### Adding Features

1. **New UI Screen**: Add render method to `WebPlatform`, draw on canvas using background images
2. **New Background Images**: Place in `shared/images/` folder, load via WebPlatform.loadImage()
3. **New Card Positions**: Update `shared/constants/positions.ts` with new coordinate data
4. **Game Logic**: Modify files in `bloombeasts/` folder, rebuild

## Game Features

### Current Screens

- ✅ **Start Menu** - Navigate to different game modes
- ✅ **Mission Select** - Choose from available missions
- ✅ **Inventory** - View and manage your card collection
- ✅ **Battle** - Full battle interface with objectives
- ✅ **Rewards** - View mission completion rewards

### Battle System

- Health bars with color coding
- Beast fields (yours and opponent's)
- Hand management
- Objective tracking
- Turn-based gameplay

### Persistence

- Game saves automatically to localStorage
- Player progress, XP, and nectar are saved
- Card collection persists
- Mission completion tracked

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Customization

### Background Images

Replace images in `shared/images/`:
- `Menu.png` - Full-screen menu background (1280x720)
- `Background.png` - Background for inventory/missions screens
- `Playboard.png` - Battle screen background

### Card Images

Add card art in `shared/images/cards/`:
- Organized by affinity: `Forest/`, `Fire/`, `Water/`, `Sky/`, `Shared/`
- Named by card ID (e.g., `Mosslet.png`)

### Card Positions

Modify `shared/constants/positions.ts` to adjust:
- Beast card positions for each player
- Magic and trap card positions
- Card text positions (cost, level, name, attack, health)

### Platform Behavior

Modify `src/platform.ts` to change:
- Canvas rendering logic
- Click region definitions
- Drawing methods for cards and UI elements
- Storage implementation

## Troubleshooting

### Build Errors

If you get TypeScript errors:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Game Not Loading

1. Check browser console for errors
2. Verify `dist/bundle.js` exists and is recent
3. Try hard refresh (Ctrl+F5)
4. Check if localStorage is enabled

### Performance Issues

- Use Chrome DevTools to profile
- Check for memory leaks in long sessions
- Consider reducing animation complexity

## Next Steps

- [ ] Add sound effects and music
- [ ] Implement card animations
- [ ] Add deck builder UI
- [ ] Multiplayer support (future)
- [ ] Progressive Web App features
- [ ] Touch gesture controls for mobile

## License

Part of the Bloom Beasts project.
