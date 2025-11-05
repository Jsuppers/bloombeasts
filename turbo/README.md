# TURBO - TURn-Based Operations

A modern, type-safe TypeScript library for building turn-based games.

## Features

- 🎮 **Generic Game Controller** - Flexible system for any turn-based game
- 🤖 **Built-in AI Support** - Multiple AI strategies (Random, Greedy, Minimax, MCTS)
- 📝 **Type Safety** - Full TypeScript support with strict typing
- 🔄 **State Management** - Built-in undo/redo and history tracking
- 📢 **Event System** - Type-safe event-driven architecture
- ⚡ **Performance Optimized** - Efficient cloning and state updates

## Installation

```bash
npm install @bloombeasts/turbo
```

## Quick Start

```typescript
import { GameController, IGameRules, PlayerType } from '@bloombeasts/turbo';

// Define your game state
interface MyGameState extends Record<string, unknown> {
  score: number;
  board: string[][];
}

// Define your actions
interface MyGameAction extends Record<string, unknown> {
  type: 'move' | 'pass';
  position?: { x: number; y: number };
}

// Implement game rules
class MyGameRules implements IGameRules<MyGameState, MyGameAction> {
  // ... implement required methods
}

// Create and use the game
const rules = new MyGameRules();
const game = new GameController(rules);

game.initialize({
  players: [
    { id: 'p1', name: 'Alice', type: PlayerType.HUMAN },
    { id: 'p2', name: 'Bob', type: PlayerType.AI }
  ]
});
```

## Examples

See the `examples/` directory for complete implementations:

- **TicTacToe.example.ts** - Classic game with AI opponent
- **simple-card-game.ts** - Turn-based card game

## License

MIT
