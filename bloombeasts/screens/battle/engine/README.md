# BloomBeasts Battle System

Clean, modular battle system built on the TURBO turn-based game engine framework.

## Architecture

```
battle/
├── core/                        # Core subsystems
│   ├── BattleController.ts      # Thin facade (137 lines)
│   ├── BattleOrchestrator.ts    # Lifecycle & events (150 lines)
│   ├── AIManager.ts             # AI turn execution (119 lines)
│   ├── ActionProcessor.ts       # Player actions (145 lines)
│   └── WinConditionChecker.ts   # Game end logic (87 lines)
├── actions/                     # Action handlers (registry pattern)
│   ├── ActionHandler.ts         # Base handler & registry
│   ├── DrawCardActionHandler.ts
│   ├── PlayCardActionHandler.ts
│   ├── AttackActionHandler.ts
│   ├── EndTurnActionHandler.ts
│   └── __tests__/               # Unit tests
├── BloomBeastsGame.ts          # TURBO game rules (516 lines)
├── BloomBeastsAI.ts            # AI implementations
├── types.ts                     # Type definitions
└── index.ts                     # Public API
```

## Design Principles

### 1. **Single Responsibility**
Every class has one job:
- `BattleController`: Facade for backward compatibility
- `BattleOrchestrator`: Battle lifecycle coordination
- `AIManager`: AI player management
- `ActionProcessor`: Execute player actions
- `WinConditionChecker`: Determine battle outcomes
- `ActionHandlers`: Handle specific action types

### 2. **Registry Pattern**
Action handlers are registered and dispatched via `ActionHandlerRegistry`:
- Easy to add new action types
- Each handler owns validation, execution, events, and triggers
- No large switch statements

### 3. **TURBO Integration**
Built directly on TURBO framework:
- Uses TURBO's event system (no custom callbacks)
- Uses TURBO's state management
- Access to TURBO's advanced features (replay, undo/redo, serialization)

### 4. **Type Safety**
- Zero `any` types in battle system
- `TriggerContext` for type-safe trigger processing
- Proper TypeScript interfaces throughout

## Usage

### Basic Battle Setup

```typescript
import { BattleController } from './battle/core/BattleController';

// Create battle controller
const controller = new BattleController(asyncMethods);

// Subscribe to TURBO events
const game = controller.getGameController();
game.on('stateChanged', () => console.log('State changed'));
game.on('turnStarted', ({ playerId }) => console.log(`Turn: ${playerId}`));
game.on('gameEnded', ({ winnerId }) => console.log(`Winner: ${winnerId}`));

// Initialize battle
const battle = controller.initializeBattle({
  player1: {
    id: 'player',
    name: 'Player',
    deck: playerDeck,
    health: 30,
  },
  player2: {
    id: 'opponent',
    name: 'Opponent',
    deck: opponentDeck,
    health: 30,
    isAI: true,
    aiStrategy: 'aggressive', // 'default' | 'aggressive' | 'defensive'
  },
});
```

### Performing Actions

```typescript
// Draw a card
controller.drawCard('player');

// Play a card
controller.playCard('card-123', 'player', position);

// Attack
controller.attackBeast('attacker-id', 'target-id', 'player');

// End turn
controller.endTurn('player');

// Execute AI turn
await controller.executeAITurn();
```

### Advanced Features (via TURBO)

```typescript
const game = controller.getGameController();

// Action history for replay
const history = game.getActionHistory();

// Undo/Redo
game.undo();
game.redo();

// Pause/Resume
game.pause();
game.resume();

// State serialization for save/load
const state = game.getState();
const serialized = JSON.stringify(state);
```

## Architecture Deep Dive

### Action Handler Pattern

Each action type has a dedicated handler:

```typescript
export class DrawCardActionHandler extends BaseActionHandler {
  readonly actionType = BloomBeastsActionType.DRAW_CARD;

  validate(actionData, state, playerId): ActionValidationResult {
    // Validation logic
  }

  execute(actionData, state, playerId, context): IActionResult {
    // Execution logic
    // Event generation
    // Trigger processing
    return { success: true, newState, sideEffects: [event] };
  }
}
```

**Benefits:**
- Each handler owns ALL logic for its action
- Easy to test in isolation
- No large switch statements
- Clean separation of concerns

### Subsystem Responsibilities

**BattleOrchestrator**
- Initializes TURBO game
- Coordinates subsystems
- Exposes game controller

**AIManager**
- Registers AI players
- Executes AI turns with loop protection
- Maps AI strategies to difficulty levels

**ActionProcessor**
- Validates and executes player actions
- Returns success/failure results

**WinConditionChecker**
- Determines if battle should end
- Calculates battle results
- Handles tie scenarios

## Event System

All events use TURBO's event bus:

```typescript
game.on('gameStarted', ({ state }) => { /* ... */ });
game.on('turnStarted', ({ playerId, turnNumber }) => { /* ... */ });
game.on('turnEnded', ({ playerId }) => { /* ... */ });
game.on('actionPerformed', ({ action }) => { /* ... */ });
game.on('stateChanged', ({ state }) => { /* ... */ });
game.on('gameEnded', ({ winnerId }) => { /* ... */ });
```

**No more callbacks!** Direct TURBO event subscription.

## State Management

### Immutability
Uses `structuredClone()` for proper deep cloning:
- Handles Sets, Maps, Dates
- No serialization hacks
- Full immutability guarantee

### State Access
Helper methods in `BaseActionHandler`:
```typescript
protected getCurrentPlayer(state, playerId)
protected getOpponentPlayer(state, playerId)
protected getCurrentPlayerIndex(state, playerId)
protected cloneState(state)
protected createEvent(type, playerId, data?)
```

## Testing

### Unit Tests
```bash
npm test -- DrawCardActionHandler.test.ts
npm test -- WinConditionChecker.test.ts
```

### Integration Tests
```bash
npm test -- battle/tests/
```

## Performance

- **State cloning**: O(n) via structuredClone
- **Action validation**: O(1) via registry lookup
- **AI turn execution**: Bounded by MAX_AI_ACTIONS_PER_TURN (50)

## Migration Notes

### From Phase 2 (Pre-refactoring)
- ❌ `BattleCallbacks` → ✅ TURBO events
- ❌ Manual event propagation → ✅ TURBO event bus
- ❌ Large switch statements → ✅ Action handler registry
- ❌ God object (413 lines) → ✅ Focused subsystems (87-150 lines each)

### Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| BattleController | 413 lines | 137 lines | **-67%** |
| BloomBeastsGame.executeAction() | 110 lines | 45 lines | **-59%** |
| BloomBeastsGame.validateAction() | 60 lines | 30 lines | **-50%** |
| Code Smells | Multiple | **0** | ✅ |
| `any` Types | Multiple | **0** | ✅ |

## Adding New Features

### New Action Type

1. Create handler in `battle/actions/`:
```typescript
export class NewActionHandler extends BaseActionHandler<NewActionData> {
  readonly actionType = BloomBeastsActionType.NEW_ACTION;

  validate(actionData, state, playerId) { /* ... */ }
  execute(actionData, state, playerId, context) { /* ... */ }
}
```

2. Register in `BloomBeastsGame.ts`:
```typescript
this.actionHandlers.register(new NewActionHandler());
```

3. Add to `BloomBeastsActionType` enum
4. Export from `actions/index.ts`

### New AI Strategy

Implement in `BloomBeastsAI.ts`:
```typescript
export class CustomAI extends BloomBeastsGreedyAI {
  // Override decision making
}
```

Register in `AIManager.ts`:
```typescript
const ai = new CustomAI({ playerId, difficulty });
this.game.registerAI(playerId, ai);
```

## Future Enhancements

- [ ] Multiplayer support via networked players
- [ ] Tournament mode
- [ ] Spectator mode
- [ ] Replay system using TURBO action history
- [ ] Time-travel debugging with undo/redo

## Resources

- [TURBO Framework](../../turbo/)
- [Action Handler Tests](./actions/__tests__/)
- [Subsystem Tests](./core/__tests__/)
- [Refactoring Roadmap](../../REFACTORING-ROADMAP.md)
