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
│   ├── main.ts        # Main entry point (uses BloomBeastsGame)
│   └── ui/            # UI rendering components
│       ├── UIRenderer.ts      # Canvas renderer
│       ├── Binding.ts         # Reactive bindings
│       ├── AnimatedBinding.ts # Animation system
│       └── components.ts      # UI components
├── dist/              # Compiled output
│   └── bundle.js      # Bundled game code
└── assets/            # Images, sounds, etc.
```

## Features

✅ **Full TypeScript** - Built with TypeScript for type safety
✅ **Unified Architecture** - Uses the BloomBeastsGame with PlatformConfig
✅ **Asset Catalog System** - Centralized JSON-based asset management
✅ **LocalStorage Saves** - Persistent game saves
✅ **Canvas-Based Rendering** - Image-based UI using HTML5 Canvas UIRenderer
✅ **Reactive Bindings** - Clean reactive data flow with Binding system
✅ **Animation System** - Built-in animation support with AnimatedBinding

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
npm run dev            # Build + watch + serve (recommended)
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
   - Exports BloomBeastsGame class with unified architecture

2. **deployments/web/** - Web-specific presentation layer
   - WebGameApp creates BloomBeastsGame with PlatformConfig
   - UIRenderer handles canvas-based rendering
   - Reactive Binding system for data flow
   - Minimal HTML with full-screen canvas for visual presentation

3. **PlatformConfig Interface** - Clean boundary
   - Provides platform-specific implementations for storage, assets, rendering
   - BloomBeastsGame uses reactive bindings for UI updates
   - UIRenderer renders UI component trees to canvas

### Data Flow

```
User Interaction → UIRenderer click regions → Game state updates →
Binding system triggers re-render → UIRenderer draws to canvas → User sees result
```

### Integration Points

The `WebGameApp` class in `src/main.ts` provides platform configuration:

- **Asset Management**: Loads JSON asset catalogs and maps to web paths
- **UI Rendering**: UIRenderer draws component trees to canvas with click regions
- **Storage**: `setPlayerData()`, `getPlayerData()` using localStorage
- **Audio**: HTML5 Audio for music and sound effects
- **UI Components**: Provides View, Text, Image, Pressable, Binding implementations

## Development

### Building

```bash
npm run build         # Production build
npm run build:watch   # Watch mode for development
```

### File Structure

- `src/main.ts` - Entry point, creates WebGameApp and BloomBeastsGame
- `src/ui/UIRenderer.ts` - Canvas renderer for UI component trees
- `src/ui/Binding.ts` - Reactive binding system
- `src/ui/AnimatedBinding.ts` - Animation system with easing
- `src/ui/components.ts` - UI component definitions (View, Text, Image, Pressable)
- `index.html` - Minimal HTML with canvas element and modal overlay
- `rollup.config.js` - Bundles TypeScript from web + bloombeasts + shared folders
- `tsconfig.json` - TypeScript configuration for web deployment

### Adding Features

1. **New UI Screen**: Create screen in `bloombeasts/ui/screens/`, use UI components with reactive bindings
2. **New Assets**: Add to asset catalogs in `assets/catalogs/`, update `AssetCatalogManager`
3. **New UI Components**: Extend component system in `src/ui/components.ts`
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

### Asset Catalogs

Update JSON catalogs in `assets/catalogs/`:
- `images.json` - Image asset paths and IDs
- `sounds.json` - Sound effect and music paths
- Add new categories as needed

### UI Customization

Modify UI components in `bloombeasts/ui/screens/`:
- Screen layouts using View, Text, Image, Pressable components
- Reactive bindings for dynamic data
- Animations using AnimatedBinding

### Renderer Behavior

Modify `src/ui/UIRenderer.ts` to change:
- Canvas rendering logic
- Click region handling
- Drawing methods for UI components
- Layout calculations

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
