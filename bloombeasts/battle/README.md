# Battle System

Generic, reusable battle system for Bloom Beasts. Supports any two-player combination: human vs AI, human vs human, or AI vs AI.

## Architecture

```
battle/
├── core/
│   ├── BattleController.ts     # Main battle orchestrator
│   ├── BattleRules.ts           # Game rules (card playing, combat, abilities)
│   └── TurnManager.ts           # Turn flow management
├── player/
│   └── BattlePlayer.ts          # Player interfaces (Human, AI, future: Networked)
├── ai/
│   └── OpponentAI.ts            # AI decision making
├── types.ts                     # Type definitions
└── index.ts                     # Public API
```

## Design Principles

1. **Separation of Concerns**
   - BattleController: Battle flow, victory conditions, turn management
   - BattleRules: Game rules (card effects, combat calculations)
   - OpponentAI: AI decision logic
   - Mission system: Mission-specific features (special rules, rewards)

2. **Player-Agnostic**
   - Battle system doesn't care if a player is human, AI, or networked
   - Uses IBattlePlayer interface for abstraction
   - Easily extensible for multiplayer

3. **Reusable**
   - No mission-specific code in core battle system
   - Special rules injected via configuration
   - Used by missions but can be used for any battle mode

## Usage

### Basic Battle Setup

```typescript
import { BattleController, BattleConfig } from './battle';

const controller = new BattleController(asyncMethods, {
  onBattleEnd: (winner) => console.log(`Winner: ${winner}`),
  onRender: () => updateUI(),
});

const battle = controller.initializeBattle({
  player1: {
    id: 'player',
    name: 'Player',
    deck: playerDeck,
  },
  player2: {
    id: 'opponent',
    name: 'Opponent',
    deck: opponentDeck,
    isAI: true,
  },
});
```

### With Special Rules

```typescript
const battle = controller.initializeBattle({
  player1: { ... },
  player2: { ... },
  specialRules: [{
    id: 'high-health',
    name: 'High Health Mode',
    description: 'Both players start with 50 health',
    apply: (gameState) => {
      gameState.players[0].health = 50;
      gameState.players[0].maxHealth = 50;
      gameState.players[1].health = 50;
      gameState.players[1].maxHealth = 50;
    },
  }],
});
```

### Mission Wrapper

```typescript
import { MissionBattleUI } from '../screens/missions/MissionBattleUI';

// MissionBattleUI adds:
// - Mission configuration
// - Rewards calculation
// - Progress tracking
// - Mission objectives
const missionBattle = new MissionBattleUI(missionManager, gameEngine, async);
const battle = missionBattle.initializeBattle(playerDeck);
```

## Future Extensions

### Multiplayer (Networked Players)

```typescript
export class NetworkedPlayer implements IBattlePlayer {
  private connection: WebSocket;

  async executeTurn(): Promise<void> {
    // Wait for network action
    return new Promise((resolve) => {
      this.connection.on('action', (action) => {
        // Process action
        resolve();
      });
    });
  }
}
```

### Custom AI Strategies

```typescript
export class AggressiveAI extends OpponentAI {
  // Override decision making
  chooseAction(options): AIDecision {
    // Prefer attacking over other actions
    return mostAggressiveOption(options);
  }
}
```

### Tournament Mode

```typescript
const tournament = new TournamentController([
  { player: player1, deck: deck1 },
  { player: player2, deck: deck2 },
  { player: player3, deck: deck3 },
]);

tournament.runBracket().then(winner => {
  console.log(`Tournament winner: ${winner.name}`);
});
```

## Components

### BattleController

Main orchestrator. Handles:
- Battle initialization (deck shuffling, initial draw)
- Turn management (start/end turn, player switching)
- Victory condition checking
- Game state management

### BattleRules (formerly BattleStateManager)

Game rules engine. Handles:
- Card playing validation and effects
- Combat resolution (damage calculation, beast destruction)
- Ability processing
- Trap activation
- Buff/debuff application
- Trigger management (OnSummon, OnAttack, OnDestroy, etc.)

### OpponentAI

AI decision making. Handles:
- Card play decisions
- Attack target selection
- Resource management (nectar spending)
- Turn timing and delays

### TurnManager

Turn flow logic. Handles:
- Turn initialization (drawing cards, applying start-of-turn effects)
- Turn cleanup (removing summoning sickness, end-of-turn effects)
- Turn transitions

## Migration from Old System

The old MissionBattleUI was 800+ lines and tightly coupled mission-specific and generic battle logic. The new system:

1. **Core battle logic** → `BattleController` (generic, reusable)
2. **Game rules** → `BattleRules` (was BattleStateManager, moved to battle/core/)
3. **AI logic** → `OpponentAI` (moved to battle/ai/)
4. **Mission features** → `MissionBattleUI` (thin wrapper, ~400 lines)

Benefits:
- **Cleaner**: Each component has a single responsibility
- **Reusable**: Core battle system works for any game mode
- **Testable**: Components can be tested independently
- **Extensible**: Easy to add new game modes (multiplayer, tournament, practice)
