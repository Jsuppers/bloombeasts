# BloomBeasts 🌺

A turn-based card battler game built with TypeScript, featuring creature collection, strategic combat, and deck building. The game is powered by **TURBO** (TURn-Based Operations), a generic turn-based game engine inspired by boardgame.io.

## 🎮 Game Overview

BloomBeasts is a creature collection card game where players:
- Collect and battle with Bloom Beasts (creature cards)
- Build strategic decks with various card types
- Engage in turn-based tactical combat
- Complete missions and challenges

## 🏗️ Architecture

The project uses a clean separation between the generic game engine (TURBO) and game-specific logic (BloomBeasts):

```
/turbo                     # Generic turn-based game engine
  └── /src
      ├── /core           # TurnBasedGame, Player classes
      ├── /interfaces     # Type definitions & context
      ├── /systems        # Effect system
      └── /managers       # State management

/bloombeasts              # Game-specific implementation
  └── /battle
      ├── BloomBeastsGame.ts      # Game rules using TURBO
      ├── BloomBeastsAI.ts        # AI strategies
      └── /core
          └── BattleController.ts # Main battle interface
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.11+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bloombeasts.git
cd bloombeasts
```

2. Install dependencies:
```bash
npm install
```

3. Build and run the web version:
```bash
cd deployments/web
npm run build
npm run dev
```

4. Open your browser to `http://localhost:8000`

## 🎯 TURBO Game Engine

TURBO is a powerful, boardgame.io-inspired turn-based game framework that powers BloomBeasts.

### Core Concepts

#### Context (ctx) vs State (G)

Similar to boardgame.io, TURBO separates:
- **G** (Game state): What your game manages (cards, health, resources)
- **ctx** (Context): What the framework manages (turn order, phases, stages)

```typescript
interface IGameState<TState> {
  G: TState;          // Your game state
  ctx: IGameContext;  // Framework state
}
```

#### Turn Order

Flexible turn order management with built-in strategies:

```typescript
// Round-robin (default)
turn: { order: TurnOrder.DEFAULT }

// Random each round
turn: { order: TurnOrder.RANDOM }

// Each player once
turn: { order: TurnOrder.ONCE }

// Custom order
turn: {
  order: TurnOrder.CUSTOM({
    playOrder: (G, ctx) => sortByScore(G.players),
    first: (ctx) => ctx.playOrder[0],
    next: (ctx) => ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length]
  })
}
```

#### Phases

Phases define major game states with different rules:

```typescript
phases: {
  setup: {
    onBegin: (G, ctx) => { /* Deal cards */ },
    endIf: () => true,
    next: 'play'
  },

  play: {
    turn: {
      order: TurnOrder.DEFAULT,
      stages: { /* ... */ }
    },
    moves: { /* ... */ },
    endIf: (G, ctx) => checkWinner(G)
  }
}
```

#### Stages

Stages subdivide turns for complex sequences:

```typescript
turn: {
  stages: {
    draw: {
      moves: {
        drawCard: (G, ctx) => {
          // Draw a card
          ctx.events.setStage('main');
        }
      }
    },

    main: {
      moves: {
        playCard: (G, ctx, cardId) => {
          // Play card
          // Trigger opponent response
          ctx.events.setActivePlayers({
            value: { [opponentId]: 'respond' }
          });
        }
      }
    },

    respond: {
      moves: {
        counter: (G, ctx) => { /* ... */ },
        pass: (G, ctx) => ctx.events.endStage()
      }
    }
  }
}
```

#### Active Players

Control who can act during each stage:

```typescript
// Only current player
activePlayers: { current: 'main' }

// All players simultaneously
activePlayers: { all: 'deciding' }

// Specific players in specific stages
activePlayers: {
  value: {
    '0': 'attack',
    '1': 'defend'
  }
}
```

### BloomBeasts Implementation

BloomBeasts uses TURBO's features for its game flow:

1. **Setup Phase**: Initial card draw
2. **Mulligan Phase**: Optional hand redraw (simultaneous)
3. **Play Phase**: Main gameplay with stages:
   - Draw stage
   - Main stage (play cards)
   - Attack stage (combat)
   - Response stages (traps, counters)

## 🎴 Card Types

- **Bloom Beasts**: Creature cards with attack/health stats
- **Magic Cards**: Instant effects
- **Trap Cards**: Triggered defenses
- **Buff Cards**: Ongoing enhancements
- **Habitat Cards**: Field effects

## 🤖 AI System

The game includes multiple AI strategies using TURBO's AI framework:

```typescript
// Greedy AI - best immediate value
class BloomBeastsGreedyAI extends GreedyAI {
  evaluateAction(action, state): number { /* ... */ }
}

// Also available: RandomAI, MinimaxAI, MCTSAI
```

## 🛠️ Development

### Project Structure

```
/bloombeasts
  ├── /battle          # Battle system
  ├── /cards           # Card definitions
  ├── /engine          # Game engine utilities
  ├── /screens         # UI screens
  └── /ui              # UI components

/turbo
  ├── /src             # TURBO library source
  └── /examples        # Example games

/deployments
  ├── /web            # Web deployment
  └── /horizon        # Meta Horizon deployment
```

### Building

```bash
# Build TURBO library
cd turbo
npm run build

# Build web deployment
cd deployments/web
npm run build

# Development mode (auto-rebuild)
npm run dev
```

### Testing

```bash
npm test
```

## 📚 Examples

### Simple TURBO Game

```typescript
const game: IGameDefinition = {
  setup: (ctx) => ({ deck: [], players: [] }),

  phases: {
    play: {
      moves: {
        drawCard: (G, ctx) => { /* ... */ },
        playCard: (G, ctx, card) => { /* ... */ }
      }
    }
  },

  endIf: (G, ctx) => G.winner !== null
};
```

### Using Stages for Responses

```typescript
moves: {
  playTrap: (G, ctx, trapCard) => {
    // Play trap
    placeTrap(G, trapCard);

    // Allow opponent to respond
    ctx.events.setActivePlayers({
      value: {
        [getOpponent(ctx)]: 'trapResponse'
      }
    });
  }
}
```

## 🎯 Features

- **Turn-based combat** with strategic depth
- **Deck building** with 100+ unique cards
- **AI opponents** with multiple difficulty levels
- **Effect system** for complex card interactions
- **Mission system** for single-player content
- **Cross-platform** support (Web, Meta Horizon Worlds)

## 🤝 Contributing

Contributions are welcome! The modular architecture makes it easy to:

1. **Add new cards**: Define in `/bloombeasts/cards`
2. **Create AI strategies**: Extend TURBO's AI classes
3. **Add game modes**: Use TURBO's phase system
4. **Enhance effects**: Add handlers to the effect system

## 📄 License

MIT

## 🔗 Links

- [Play Online](http://localhost:8000) (when running locally)
- [Documentation](./turbo/README.md) (TURBO library docs)

---

Built with ❤️ using TypeScript and the TURBO game engine.