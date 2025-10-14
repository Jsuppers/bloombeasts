# Systems Directory

This directory contains extracted manager classes that handle specific responsibilities previously housed in the GameManager god class.

## Manager Classes

### SaveLoadManager
**File**: `SaveLoadManager.ts` (~250 lines)

**Purpose**: Handles all game persistence and player data management

**Key Methods**:
- `saveGameData(cardCollection, playerDeck)` - Persists game state to platform storage
- `loadGameData(cardCollection, missionManager)` - Loads game state with format migration
- `updatePlayerLevel()` - Updates player level based on cumulative XP
- `getPlayerInfo()` - Returns player display info (name, level, XP progress)
- `addXP(amount)` - Adds XP to player and updates level
- `getItemQuantity(itemId)` - Returns quantity of a specific item
- `trackMissionCompletion(missionId)` - Records mission completion

**Interfaces**:
- `PlayerData` - Complete player state structure
- `PlayerItem` - Item inventory entry

**Constants**:
- `XP_THRESHOLDS` - Cumulative XP requirements for levels 1-9 (exponential scaling)

**Dependencies**:
- `PlatformStorage` interface (passed to constructor)
- `CardCollection` (for save/load operations)
- `MissionManager` (for loading completed missions)

---

### CardCollectionManager
**File**: `CardCollectionManager.ts` (~580 lines)

**Purpose**: Manages all card-related operations, conversions, and leveling

**Key Methods**:
- `cardInstanceToDisplay(card)` - Converts CardInstance to UI-friendly CardDisplay
- `getPlayerDeckCards(playerDeck, cardCollection)` - Converts deck card IDs to battle-ready AnyCard format
- `awardDeckExperience(totalCardXP, playerDeck, cardCollection)` - Distributes XP to deck cards with leveling
- `initializeStartingCollection(cardCollection, playerDeck)` - Creates Forest starter deck
- `addCardReward(card, cardCollection)` - Adds reward card to collection

**Helper Methods**:
- `buildBaseCardDisplay(card, cardDef)` - Builds common card display properties
- `calculateExperienceRequired(card, cardDef)` - Calculates XP needed for next level
- `addTypeSpecificFields(displayCard, card, cardDef)` - Adds type-specific display fields
- `getAbilitiesForLevel(cardInstance)` - Returns ability with level-based upgrades (4, 7, 9)
- `getEffectDescriptions(card)` - Converts card effects to readable descriptions

**Interfaces**:
- `CardDisplay` - UI representation of a card

**Leveling Systems**:
- **Bloom Beasts**: Uses LevelingSystem with stat gains and ability upgrades
- **Other Cards**: Uses exponential formula [0, 20, 40, 80, 160, 320, 640, 1280, 2560]

**Dependencies**:
- `CardCollection` (passed to methods)
- `getAllCards()` from engine/cards
- `LevelingSystem` from engine/systems
- `Logger` for level-up notifications

---

### BattleDisplayManager
**File**: `BattleDisplayManager.ts` (~270 lines)

**Purpose**: Handles battle UI rendering and display enrichment

**Key Methods**:
- `createBattleDisplay(battleState, selectedBeastIndex, attackAnimation?)` - Converts battle state to display format
- `createBattleDisplayWithPopup(battleState, selectedBeastIndex, card, player)` - Creates display with card popup overlay

**Private Methods**:
- `enrichFieldBeasts(field, gameState?, playerIndex?)` - Enriches beasts with card definitions and stat bonuses
- `calculateStatBonuses(beast, gameState, playerIndex)` - Calculates habitat and buff zone bonuses
- `getObjectiveDisplay(battleState)` - Converts mission objectives to display format

**Interfaces**:
- `BattleDisplay` - Complete battle screen state
- `ObjectiveDisplay` - Mission objective progress

**Features**:
- Applies visual-only stat bonuses from habitat and buff zones
- Enriches field beasts with card definition data (name, affinity, cost, ability)
- Supports attack animation state
- Supports card popup overlays for magic/trap/habitat cards

**Dependencies**:
- `getAllCards()` from engine/cards
- `STARTING_HEALTH`, `TURN_TIME_LIMIT` from engine/constants/gameRules

---

## Integration Guide

To integrate these managers into GameManager:

1. **Import the managers**:
```typescript
import { SaveLoadManager, PlayerData, PlayerItem } from './systems/SaveLoadManager';
import { CardCollectionManager, CardDisplay } from './systems/CardCollectionManager';
import { BattleDisplayManager, BattleDisplay, ObjectiveDisplay } from './systems/BattleDisplayManager';
```

2. **Create manager instances**:
```typescript
export class GameManager {
  private saveLoadManager: SaveLoadManager;
  private cardCollectionManager: CardCollectionManager;
  private battleDisplayManager: BattleDisplayManager;

  constructor(platformCallbacks: PlatformCallbacks) {
    this.platform = platformCallbacks;

    // Initialize managers
    this.saveLoadManager = new SaveLoadManager(this.platform);
    this.cardCollectionManager = new CardCollectionManager();
    this.battleDisplayManager = new BattleDisplayManager();

    // ... rest of initialization
  }
}
```

3. **Replace method bodies with manager calls**:
```typescript
// Example: saveGameData
private async saveGameData(): Promise<void> {
  await this.saveLoadManager.saveGameData(this.cardCollection, this.playerDeck);
}

// Example: cardInstanceToDisplay
private cardInstanceToDisplay(card: CardInstance): CardDisplay {
  return this.cardCollectionManager.cardInstanceToDisplay(card);
}

// Example: updateBattleDisplay
private async updateBattleDisplay(attackAnimation?: {...} | null): Promise<void> {
  const battleState = this.battleUI.getCurrentBattle();

  const display = this.battleDisplayManager.createBattleDisplay(
    battleState,
    this.selectedBeastIndex,
    attackAnimation
  );

  if (display) {
    this.platform.renderBattle(display);

    // Check if battle ended (only if no animation is running)
    if (battleState.isComplete && !attackAnimation) {
      await this.handleBattleComplete(battleState);
    }
  }
}
```

4. **Remove duplicate interfaces from GameManager**:
- Move `PlayerData`, `PlayerItem` to SaveLoadManager
- Move `CardDisplay` to CardCollectionManager
- Move `BattleDisplay`, `ObjectiveDisplay` to BattleDisplayManager
- Keep `PlatformCallbacks`, `MissionDisplay`, `CardDetailDisplay`, `RewardDisplay` in GameManager (platform-specific)

5. **Update playerData access**:
```typescript
// Replace direct access with manager methods
this.playerData.totalXP -> this.saveLoadManager.getPlayerData().totalXP
this.getItemQuantity(itemId) -> this.saveLoadManager.getItemQuantity(itemId)
```

## Benefits

- **Separation of Concerns**: Each manager has a single, well-defined responsibility
- **Easier Testing**: Managers can be tested independently with mocked dependencies
- **Better Maintainability**: Changes to card logic, save/load, or battle display are isolated
- **Reduced Complexity**: GameManager becomes a thin coordinator instead of a god class
- **Type Safety**: All interfaces properly defined and exported

## File Locations

```
bloombeasts/
├── systems/
│   ├── README.md (this file)
│   ├── SaveLoadManager.ts
│   ├── CardCollectionManager.ts
│   ├── BattleDisplayManager.ts
│   └── SoundManager.ts (existing)
└── gameManager.ts (to be refactored)
```
