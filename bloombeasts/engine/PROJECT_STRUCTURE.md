# Bloom Beasts - Project Structure

## Overview
Bloom Beasts is organized into three main components:
1. **Game Engine** - Core game logic and mechanics
2. **Start Menu** - Main menu and navigation
3. **Inventory** - Card collection management

## Directory Structure

```
bloombeasts/
├── index.ts                 # Main application entry point
├── game/                    # Game engine and core logic
│   ├── cards/              # Card definitions
│   │   ├── fire/           # Fire affinity cards
│   │   ├── forest/         # Forest affinity cards
│   │   ├── water/          # Water affinity cards
│   │   ├── sky/            # Sky affinity cards
│   │   ├── shared/         # Shared cards across all decks
│   │   └── BaseDeck.ts     # Abstract base deck class
│   ├── types/              # Type definitions
│   │   ├── core.ts         # Core game types
│   │   ├── abilities.ts    # Ability system types
│   │   ├── leveling.ts     # Leveling system types
│   │   └── gameState.ts    # Game state types
│   ├── systems/            # Game systems
│   │   ├── GameEngine.ts   # Main game controller
│   │   ├── CombatSystem.ts # Combat mechanics
│   │   ├── LevelingSystem.ts # XP and leveling
│   │   └── AbilityProcessor.ts # Ability execution
│   ├── utils/              # Utility functions
│   │   ├── deckBuilder.ts  # Deck construction
│   │   ├── cardHelpers.ts  # Card utilities
│   │   └── combatHelpers.ts # Combat utilities
│   └── examples/           # Usage examples
├── startmenu/              # Main menu UI
│   ├── index.ts           # Start menu entry point
│   ├── StartMenuUI.ts     # Menu visual presentation
│   └── MenuController.ts  # Menu navigation logic
└── inventory/              # Card collection UI
    ├── index.ts           # Inventory entry point
    ├── InventoryUI.ts     # Collection visual presentation
    ├── CardCollection.ts  # Collection management
    ├── InventoryFilters.ts # Filtering system
    └── types.ts          # Inventory-specific types
```

## Module Descriptions

### Game Engine (`/game`)
The core game logic including:
- **Cards**: All card definitions organized by affinity
- **Types**: TypeScript interfaces and types
- **Systems**: Game mechanics implementations
- **Utils**: Helper functions for game operations

### Start Menu (`/startmenu`)
Main menu interface with options to:
- Start new game
- Open inventory
- Access settings
- Quit game

### Inventory (`/inventory`)
Card collection management featuring:
- View all owned cards
- Filter by affinity, level, etc.
- Sort cards by various criteria
- Track card experience and stats

## Key Features

### Card System
- 4 affinities: Fire, Forest, Water, Sky
- Each card has individual file for maintainability
- Structured abilities that can be programmatically executed
- Leveling system with ability upgrades at levels 4, 7, and 9

### Leveling System
- Cards gain XP from combat (1 per kill) and nectar spending (1 per nectar)
- 9 levels with increasing XP requirements
- Custom stat gains per beast per level
- Ability evolution at milestone levels

### Ability System
- Programmatic ability effects (damage, heal, buffs, etc.)
- Multiple trigger types (OnSummon, OnAttack, OnDamage, etc.)
- Conditional effects and complex interactions
- Cost requirements for activated abilities

## Usage

### Main Application
```typescript
import { BloomBeastsApp } from './bloombeasts';

const app = new BloomBeastsApp();
await app.run();
```

### Direct Game Engine Usage
```typescript
import { GameEngine } from './bloombeasts/game/systems/GameEngine';
import { buildFireDeck, buildForestDeck } from './bloombeasts/game/utils/deckBuilder';

const engine = new GameEngine();
const player1Deck = buildFireDeck();
const player2Deck = buildForestDeck();

await engine.startMatch(player1Deck, player2Deck);
```

### Inventory Access
```typescript
import { Inventory } from './bloombeasts/inventory';

const inventory = new Inventory();
await inventory.initialize();
```

## Development Status

### Complete ✅
- Core game types and structures
- All 4 starter decks with structured abilities
- Leveling system with XP tracking
- Ability processing system
- Basic UI placeholders

### In Progress 🚧
- Game engine integration
- Combat system implementation
- Save/load functionality

### Planned 📋
- Multiplayer support
- Advanced deck building
- Tournament mode
- Card crafting system

## Next Steps
1. Connect UI components to game engine
2. Implement input handling
3. Add persistence layer
4. Create visual rendering system