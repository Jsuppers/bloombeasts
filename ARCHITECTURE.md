# BloomBeasts Unified Architecture

## Overview

This document describes the new unified architecture for BloomBeasts that works seamlessly across Web and Horizon platforms with **minimal platform-specific code**.

## Design Philosophy

**Core Principle**: The game logic should be 100% platform-agnostic. Platform wrappers should only handle:

1. **Storage** (localStorage vs Persistent Variables)
2. **Asset mappings** (web paths vs Horizon Asset IDs)
3. **UI component implementations** (web custom components vs Horizon native components)
4. **Rendering** (Canvas vs Horizon UIComponent)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   BloomBeastsGame                       │
│              (Platform-Agnostic Core)                   │
│                                                         │
│  - Game logic and state management                      │
│  - Screen orchestration                                 │
│  - Card collection, missions, battles                   │
│  - Sound management                                     │
│  - All UI tree creation                                 │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ PlatformConfig
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
┌───────▼────────┐                 ┌────────▼────────┐
│  Web Wrapper   │                 │ Horizon Wrapper │
│  (~100 lines)  │                 │  (~100 lines)   │
└────────────────┘                 └─────────────────┘
│                                   │
│ - localStorage                    │ - Persistent Vars
│ - /paths/to/images.png            │ - ImageSource.fromAsset()
│ - Web UI components               │ - hz.View, hz.Text, etc.
│ - Canvas rendering                │ - UIComponent rendering
└───────────────────────────────────┘
```

## Key Interfaces

### PlatformConfig

The core interface that platforms must implement:

```typescript
interface PlatformConfig {
  // Storage
  setPlayerData: (data: PlayerData) => void;
  getPlayerData: () => PlayerData | null;

  // Assets: Type-safe maps that enforce completeness
  imageAssets: ImageAssetMap;  // Record<ImageAssetId, any>
  soundAssets: SoundAssetMap;  // Record<SoundAssetId, any>

  // UI Components
  getUIMethodMappings: () => UIMethodMappings;

  // Rendering
  render: (uiNode: UINode) => void;

  // Audio (optional)
  playMusic?: (src: any, loop: boolean, volume: number) => void;
  playSfx?: (src: any, volume: number) => void;
  stopMusic?: () => void;
  setMusicVolume?: (volume: number) => void;
  setSfxVolume?: (volume: number) => void;
}
```

### Platform-Agnostic Styles

All styles use platform-agnostic types that map to both web and Horizon:

```typescript
interface StyleProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  position?: 'relative' | 'absolute';
  top?: number;
  left?: number;
  opacity?: number;
  // ... more as needed
}
```

## Platform Implementations

### Web Platform

**File**: `/deployments/web/src/webGameExample.ts` (see example)

**Key Points**:
- Uses `localStorage` for storage
- Image assets are string paths: `'/shared/images/background.png'`
- Sound assets are string paths: `'/shared/sounds/menu.mp3'`
- UI components: Custom web implementations (View, Text, Image, Pressable)
- Rendering: Canvas-based via UIRenderer

**Example**:
```typescript
import { AssetCatalog } from '../../../bloombeasts/AssetCatalog';

const platformConfig: PlatformConfig = {
  setPlayerData: (data) => localStorage.setItem('playerData', JSON.stringify(data)),
  getPlayerData: () => JSON.parse(localStorage.getItem('playerData') || 'null'),

  // Type-safe asset maps using helper functions
  imageAssets: AssetCatalog.createWebImageAssets(),
  soundAssets: AssetCatalog.createWebSoundAssets(),

  getUIMethodMappings: () => ({ View, Text, Image, Pressable, Binding }),
  render: (uiNode) => this.renderer.render(uiNode)
};

const game = new BloomBeastsGame(platformConfig);
await game.initialize();
```

### Horizon Platform

**File**: `/deployments/horizon/src/horizonGameExample.ts` (see example)

**Key Points**:
- Uses Persistent Variables v2 for storage
- Image assets are `ImageSource` objects: `ImageSource.fromTextureAsset(new hz.Asset(BigInt('123')))`
- Sound assets are `hz.Asset` objects: `new hz.Asset(BigInt('456'))`
- UI components: Horizon native (hz.View, hz.Text, hz.Image, hz.Pressable, hz.Binding)
- Rendering: Horizon UIComponent system

**Example**:
```typescript
import { AssetCatalog, ImageAssetIds, SoundAssetIds } from '../../../bloombeasts/AssetCatalog';

const platformConfig: PlatformConfig = {
  setPlayerData: (data) => this.persistentVar.set(data),
  getPlayerData: () => this.persistentVar.get(),

  // Type-safe asset maps - TypeScript enforces ALL assets must be provided
  imageAssets: {
    [ImageAssetIds.BACKGROUND]: ImageSource.fromTextureAsset(new hz.Asset(BigInt('802255839066806'))),
    [ImageAssetIds.CARD_ROOTLING]: ImageSource.fromTextureAsset(new hz.Asset(BigInt('123456789100'))),
    [ImageAssetIds.CARD_EMBERLING]: ImageSource.fromTextureAsset(new hz.Asset(BigInt('123456789101'))),
    // ... TypeScript ensures ALL ImageAssetIds are provided!
  },
  soundAssets: {
    [SoundAssetIds.MUSIC_BACKGROUND]: new hz.Asset(BigInt('999999999001')),
    [SoundAssetIds.SFX_MENU_BUTTON]: new hz.Asset(BigInt('999999999002')),
    // ... TypeScript ensures ALL SoundAssetIds are provided!
  },

  getUIMethodMappings: () => ({
    View: hz.View,
    Text: hz.Text,
    Image: hz.Image,
    Pressable: hz.Pressable,
    Binding: hz.Binding
  }),
  render: (uiNode) => this.updateUI(uiNode)
};

const game = new BloomBeastsGame(platformConfig);
await game.initialize();
```

## Asset Management

### Centralized Asset Catalog

All game assets are defined in `/bloombeasts/AssetCatalog.ts` - a single source of truth.

**Key Features**:
- **Type-safe asset IDs**: `ImageAssetIds` and `SoundAssetIds` as const objects
- **Enforced completeness**: TypeScript ensures ALL assets are provided by platform
- **Helper functions**: Web platform can use `AssetCatalog.createWebImageAssets()` and `AssetCatalog.createWebSoundAssets()`

**Asset ID Examples**:
```typescript
export const ImageAssetIds = {
  BACKGROUND: 'background',
  CARD_ROOTLING: 'rootling',
  CARD_EMBERLING: 'emberling',
  ICON_PLAY: 'icon-play',
  // ... all assets defined here
} as const;

export const SoundAssetIds = {
  MUSIC_BACKGROUND: 'music-BackgroundMusic.mp3',
  SFX_MENU_BUTTON: 'sfx-menuButtonSelect',
  // ... all sounds defined here
} as const;
```

### Type-Safe Asset Maps

Platforms must provide complete asset maps:

```typescript
// Type enforces ALL assets must be provided
export type ImageAssetMap = Record<ImageAssetId, any>;
export type SoundAssetMap = Record<SoundAssetId, any>;
```

**Web Platform** - Uses helper functions:
```typescript
imageAssets: AssetCatalog.createWebImageAssets()
// Returns: { 'rootling': '/shared/images/cards/Forest/Rootling.png', ... }
```

**Horizon Platform** - Manual mapping with type enforcement:
```typescript
imageAssets: {
  [ImageAssetIds.CARD_ROOTLING]: ImageSource.fromTextureAsset(new hz.Asset(BigInt('123'))),
  // TypeScript error if ANY asset is missing!
}
```

### Using Assets in Game Code

The game retrieves assets using semantic IDs:
```typescript
const rootlingAsset = this.getImageAsset(ImageAssetIds.CARD_ROOTLING);
const buttonSound = this.getSoundAsset(SoundAssetIds.SFX_MENU_BUTTON);
```

No platform-specific code in game logic - assets are resolved via the platform config!

## Migration Plan

### Current State

**Existing Code**:
- `/bloombeasts/gameManager.ts` (49KB) - Current game orchestrator
- `/bloombeasts/ui/screens/BloomBeastsGame.ts` (377 lines) - Current unified UI
- `/deployments/web/src/unifiedGame.ts` (322 lines) - Current web wrapper
- `/deployments/web/src/screens/*` - Old platform-specific screen implementations (deprecated)

**New Code**:
- `/bloombeasts/BloomBeastsGame.ts` - New unified game class
- `/deployments/web/src/webGameExample.ts` - New minimal web wrapper
- `/deployments/horizon/src/horizonGameExample.ts` - New minimal horizon wrapper

### Migration Steps

1. **Phase 1: Core Integration** (In Progress)
   - ✅ Create `BloomBeastsGame` with `PlatformConfig` interface
   - ⏳ Integrate `GameManager` functionality into `BloomBeastsGame`
   - ⏳ Move game logic (missions, cards, battles) into core game

2. **Phase 2: Web Migration**
   - Update web deployment to use new minimal wrapper
   - Test that all screens work correctly
   - Verify asset loading and rendering

3. **Phase 3: Horizon Migration**
   - Create Horizon wrapper with new pattern
   - Map all Horizon assets to asset keys
   - Test on Horizon platform

4. **Phase 4: Cleanup**
   - Remove old platform-specific screen implementations
   - Remove old `GameManager` and `unifiedGame.ts`
   - Consolidate `.ts` and `.new.ts` duplicate files
   - Update imports across codebase

### What to Integrate from GameManager

**Keep and integrate**:
- Game state management (current screen, player data)
- Card collection and deck management
- Mission management and battle orchestration
- Save/load functionality (via platform callbacks)
- Sound management
- Input handling (button clicks, card selection, etc.)

**Remove (delegate to platform)**:
- Platform-specific rendering callbacks
- Platform-specific asset loading
- Direct platform integration

## Benefits

### Before (Old Architecture)

**Web wrapper**: ~1000+ lines
- Complex platform callbacks with multiple render methods
- Duplicate rendering logic for each screen
- Tight coupling between game logic and platform
- Asset loading mixed with game logic

**Horizon wrapper**: ~500+ lines
- Duplicate game logic
- Platform-specific screen implementations
- Manual UI tree construction

### After (New Architecture)

**Web wrapper**: ~100 lines
- Simple config object with callbacks
- No game logic - just platform specifics
- Asset mappings in one place
- Clean separation of concerns

**Horizon wrapper**: ~100 lines
- Same structure as web
- Just different asset format and storage
- No duplicate code

**Core game**: All game logic in one place
- Platform-agnostic
- Testable without platform
- Shared across all platforms
- Easy to maintain

## File Structure

```
bloombeasts/
├── BloomBeastsGame.ts              # Main game class (NEW)
├── gameManager.ts                  # Old manager (to be integrated)
├── engine/                         # Game engine (shared)
│   ├── systems/
│   │   ├── GameEngine.ts
│   │   └── ...
│   └── cards/
│       └── ...
├── systems/                        # Core systems (shared)
│   ├── SoundManager.ts
│   ├── SaveLoadManager.ts
│   ├── CardCollectionManager.ts
│   └── ...
├── screens/                        # Screen logic (shared)
│   ├── missions/
│   │   └── MissionManager.ts
│   └── ...
└── ui/                            # UI components (shared)
    ├── Binding.ts
    └── screens/
        ├── MenuScreen.ts
        ├── CardsScreen.ts
        ├── MissionScreen.ts
        ├── BattleScreen.ts
        └── SettingsScreen.ts

deployments/
├── web/
│   └── src/
│       ├── webGameExample.ts      # Minimal wrapper (~100 lines)
│       ├── ui/
│       │   ├── View.ts            # Web UI components
│       │   ├── Text.ts
│       │   ├── Image.ts
│       │   └── UIRenderer.ts
│       ├── unifiedGame.ts         # Old wrapper (to be replaced)
│       └── screens/               # Old screens (to be deleted)
│
└── horizon/
    └── src/
        ├── horizonGameExample.ts  # Minimal wrapper (~100 lines)
        ├── BloomBeasts-Game.ts    # Old wrapper (to be replaced)
        └── ...

shared/
├── images/                        # All game images
│   ├── cards/
│   ├── affinity/
│   └── ...
├── sounds/                        # All game sounds
└── ...
```

## Testing

The new architecture makes testing much easier:

```typescript
// Mock platform for testing
const mockPlatform: PlatformConfig = {
  setPlayerData: vi.fn(),
  getPlayerData: () => null,
  getImageAssetMappings: () => ({}),
  getSoundAssetMappings: () => ({}),
  getUIMethodMappings: () => mockUIComponents,
  render: vi.fn()
};

const game = new BloomBeastsGame(mockPlatform);
await game.initialize();

// Test game logic without platform concerns
expect(mockPlatform.setPlayerData).toHaveBeenCalled();
```

## Next Steps

1. ✅ Define `PlatformConfig` interface
2. ✅ Create `BloomBeastsGame` class structure
3. ⏳ Integrate `GameManager` functionality
4. ⏳ Implement card collection and mission logic
5. ⏳ Update web wrapper to use new pattern
6. ⏳ Test web platform
7. ⏳ Update Horizon wrapper
8. ⏳ Test Horizon platform
9. ⏳ Clean up old code

## Questions?

See example implementations in:
- `/deployments/web/src/webGameExample.ts`
- `/deployments/horizon/src/horizonGameExample.ts`
