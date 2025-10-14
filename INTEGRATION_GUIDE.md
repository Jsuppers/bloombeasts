# Manager Integration Guide

This guide provides step-by-step instructions for integrating the extracted manager classes into GameManager.

---

## Step 1: Add Imports

At the top of `gameManager.ts`, add:

```typescript
import { SaveLoadManager, PlayerData, PlayerItem } from './systems/SaveLoadManager';
import { CardCollectionManager, CardDisplay } from './systems/CardCollectionManager';
import { BattleDisplayManager, BattleDisplay, ObjectiveDisplay } from './systems/BattleDisplayManager';
```

---

## Step 2: Add Manager Properties

In the GameManager class, add these private properties:

```typescript
export class GameManager {
  // ... existing properties ...

  // Manager instances
  private saveLoadManager: SaveLoadManager;
  private cardCollectionManager: CardCollectionManager;
  private battleDisplayManager: BattleDisplayManager;

  // ... rest of class ...
}
```

---

## Step 3: Initialize Managers in Constructor

In the constructor, initialize the managers:

```typescript
constructor(platformCallbacks: PlatformCallbacks) {
  this.platform = platformCallbacks;

  // Initialize systems
  this.startMenuUI = new StartMenuUI();
  this.menuController = new MenuController();
  this.cardCollection = new CardCollection();
  this.cardsUI = new CardsUI();
  this.missionManager = new MissionManager();
  this.missionUI = new MissionSelectionUI(this.missionManager);
  this.gameEngine = new GameEngine();
  this.battleUI = new MissionBattleUI(this.missionManager, this.gameEngine);

  // Initialize managers
  this.saveLoadManager = new SaveLoadManager(this.platform);
  this.cardCollectionManager = new CardCollectionManager();
  this.battleDisplayManager = new BattleDisplayManager();

  // Initialize sound manager
  this.soundManager = new SoundManager({
    playMusic: (src, loop, volume) => this.platform.playMusic(src, loop, volume),
    stopMusic: () => this.platform.stopMusic(),
    playSfx: (src, volume) => this.platform.playSfx(src, volume),
    setMusicVolume: (volume) => this.platform.setMusicVolume(volume),
    setSfxVolume: (volume) => this.platform.setSfxVolume(volume),
  });

  // ... rest of constructor ...
}
```

---

## Step 4: Replace Save/Load Methods

### Replace saveGameData()

**OLD**:
```typescript
private async saveGameData(): Promise<void> {
  // Update cards in playerData before saving
  this.playerData.cards.collected = this.cardCollection.getAllCards();
  this.playerData.cards.deck = this.playerDeck;

  await this.platform.saveData('bloom-beasts-save', {
    playerData: this.playerData,
  });
}
```

**NEW**:
```typescript
private async saveGameData(): Promise<void> {
  await this.saveLoadManager.saveGameData(this.cardCollection, this.playerDeck);
}
```

---

### Replace loadGameData()

**OLD**: (Lines 1680-1754 - entire method)

**NEW**:
```typescript
private async loadGameData(): Promise<void> {
  this.playerDeck = await this.saveLoadManager.loadGameData(
    this.cardCollection,
    this.missionManager
  );
}
```

---

### Replace updatePlayerLevel()

**OLD**: (Lines 1761-1781)

**NEW**:
```typescript
private updatePlayerLevel(): void {
  this.saveLoadManager.updatePlayerLevel();
}
```

---

### Replace getItemQuantity()

**OLD**:
```typescript
private getItemQuantity(itemId: string): number {
  const item = this.playerData.items.find(i => i.itemId === itemId);
  return item ? item.quantity : 0;
}
```

**NEW**:
```typescript
private getItemQuantity(itemId: string): number {
  return this.saveLoadManager.getItemQuantity(itemId);
}
```

---

### Update playerData Access

Replace all direct `this.playerData` access with:

```typescript
// OLD
this.playerData.level
this.playerData.totalXP
this.playerData.missions.completedMissions

// NEW
this.saveLoadManager.getPlayerData().level
this.saveLoadManager.getPlayerData().totalXP
this.saveLoadManager.getPlayerData().missions.completedMissions
```

**Common locations**:
- `showStartMenu()` - line 459-465
- `showMissionSelect()` - line 498-504
- `showCards()` - line 651-657
- `showSettings()` - line 697-703
- `handleCardSelect()` - line 539-545
- `handleBattleComplete()` - line 1334 (totalXP)

---

## Step 5: Replace Card Management Methods

### Replace cardInstanceToDisplay()

**OLD**: (Lines 514-636 - entire method with 6 helpers)

**NEW**:
```typescript
private cardInstanceToDisplay(card: CardInstance): CardDisplay {
  return this.cardCollectionManager.cardInstanceToDisplay(card);
}
```

**DELETE** these helper methods (no longer needed):
- `buildBaseCardDisplay()` - lines 530-549
- `calculateExperienceRequired()` - lines 554-564
- `addTypeSpecificFields()` - lines 569-585
- `addBloomCardFields()` - lines 590-596
- `addTrapCardFields()` - lines 601-614
- `addMagicCardFields()` - lines 619-627
- `addHabitatBuffCardFields()` - lines 632-636

---

### Replace getPlayerDeckCards()

**OLD**: (Lines 778-842)

**NEW**:
```typescript
private getPlayerDeckCards(): AnyCard[] {
  return this.cardCollectionManager.getPlayerDeckCards(
    this.playerDeck,
    this.cardCollection
  );
}
```

---

### Replace awardDeckExperience()

**OLD**: (Lines 886-976 - entire method)

**NEW**:
```typescript
private awardDeckExperience(totalCardXP: number): void {
  this.cardCollectionManager.awardDeckExperience(
    totalCardXP,
    this.playerDeck,
    this.cardCollection
  );
}
```

---

### Replace getAbilitiesForLevel()

**OLD**: (Lines 740-773)

This method is now internal to CardCollectionManager. Remove from GameManager.

---

### Replace getEffectDescriptions() and helpers

**OLD**: (Lines 1199-1312 - entire method with 4 helpers)

This is now internal to CardCollectionManager. Remove from GameManager:
- `getEffectDescriptions()` - lines 1199-1219
- `getMagicCardDescriptions()` - lines 1224-1240
- `getTrapCardDescriptions()` - lines 1245-1269
- `getHabitatCardDescriptions()` - lines 1274-1285
- `getEffectDescription()` - lines 1290-1312

---

### Update initializeStartingCollection()

**OLD**: (Lines 1483-1544)

**NEW**:
```typescript
private async initializeStartingCollection(): Promise<void> {
  this.playerDeck = await this.cardCollectionManager.initializeStartingCollection(
    this.cardCollection,
    this.playerDeck
  );

  // Update player data
  this.saveLoadManager.getPlayerData().cards.collected = this.cardCollection.getAllCards();
  this.saveLoadManager.getPlayerData().cards.deck = this.playerDeck;

  await this.saveGameData();
}
```

---

## Step 6: Replace Battle Display Methods

### Replace updateBattleDisplay()

**OLD**: (Lines 748-798)

**NEW**:
```typescript
private async updateBattleDisplay(attackAnimation?: {
  attackerPlayer: 'player' | 'opponent';
  attackerIndex: number;
  targetPlayer: 'player' | 'opponent' | 'health';
  targetIndex?: number;
} | null): Promise<void> {
  const battleState = this.battleUI.getCurrentBattle();

  const display = this.battleDisplayManager.createBattleDisplay(
    battleState,
    this.selectedBeastIndex,
    attackAnimation
  );

  if (!display) return;

  this.platform.renderBattle(display);

  // Check if battle ended (only if no animation is running)
  if (battleState.isComplete && !attackAnimation) {
    await this.handleBattleComplete(battleState);
  }
}
```

---

### Replace showCardPopup()

**OLD**: (Lines 1173-1219)

**NEW**:
```typescript
private async showCardPopup(card: any, player: 'player' | 'opponent'): Promise<void> {
  const battleState = this.battleUI.getCurrentBattle();
  if (!battleState || !battleState.gameState) return;

  // Create display with popup
  const display = this.battleDisplayManager.createBattleDisplayWithPopup(
    battleState,
    this.selectedBeastIndex,
    card,
    player
  );

  if (!display) return;

  // Show popup
  this.platform.renderBattle(display);

  // Wait 2 seconds
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Clear popup (re-render without popup)
  await this.updateBattleDisplay();
}
```

---

### DELETE these helper methods (no longer needed):

- `enrichFieldBeasts()` - lines 706-743
- `calculateStatBonuses()` - lines 640-701
- `getObjectiveDisplay()` - lines 803-825

---

## Step 7: Move Interfaces

### Remove from GameManager

Delete these interface definitions from GameManager (they're now in the managers):

```typescript
// DELETE - now in SaveLoadManager
interface PlayerData { ... }
interface PlayerItem { ... }

// DELETE - now in CardCollectionManager
// (CardDisplay is imported from the manager)

// DELETE - now in BattleDisplayManager
interface BattleDisplay { ... }
interface ObjectiveDisplay { ... }
```

### Keep in GameManager

Keep these interfaces (they're platform-specific):

```typescript
export interface MenuStats { ... }
export interface PlatformCallbacks { ... }
export interface MissionDisplay { ... }
export interface CardDetailDisplay { ... }
export interface RewardDisplay { ... }
export type GameScreen = ...;
```

---

## Step 8: Update Imports and Exports

At the top of GameManager, update type imports:

```typescript
import { CardInstance } from './screens/cards/types';
import { BloomBeastCard, AnyCard } from './engine/types/core';
import { LevelingSystem } from './engine/systems/LevelingSystem'; // Can be removed - only used in managers now
import { SaveLoadManager, PlayerData, PlayerItem } from './systems/SaveLoadManager';
import { CardCollectionManager, CardDisplay } from './systems/CardCollectionManager';
import { BattleDisplayManager, BattleDisplay, ObjectiveDisplay } from './systems/BattleDisplayManager';
```

Export interfaces that platforms need:

```typescript
export interface MenuStats { ... }
export interface PlatformCallbacks { ... }
export interface MissionDisplay { ... }
export interface CardDetailDisplay { ... }
export interface RewardDisplay { ... }
export type GameScreen = ...;

// Re-export from managers for convenience
export { PlayerData, PlayerItem } from './systems/SaveLoadManager';
export { CardDisplay } from './systems/CardCollectionManager';
export { BattleDisplay, ObjectiveDisplay } from './systems/BattleDisplayManager';
```

---

## Step 9: Update Mission Completion Tracking

Replace direct tracking with manager method:

**OLD**:
```typescript
// Track mission completion
if (this.currentBattleId) {
  const currentCount = this.playerData.missions.completedMissions[this.currentBattleId] || 0;
  this.playerData.missions.completedMissions[this.currentBattleId] = currentCount + 1;
}
```

**NEW**:
```typescript
// Track mission completion
if (this.currentBattleId) {
  this.saveLoadManager.trackMissionCompletion(this.currentBattleId);
}
```

**Location**: `handleBattleComplete()` around line 1387

---

## Step 10: Update XP Addition

Replace direct XP addition:

**OLD**:
```typescript
this.playerData.totalXP += battleState.rewards.xpGained;
```

**NEW**:
```typescript
this.saveLoadManager.addXP(battleState.rewards.xpGained);
```

**Location**: `handleBattleComplete()` around line 1334

---

## Step 11: Testing Checklist

After integration, test these scenarios:

- [ ] Start new game - creates starter collection
- [ ] Save game - persists all data correctly
- [ ] Load game - restores all data correctly
- [ ] Complete mission - awards XP and levels up player
- [ ] Card levels up - applies stat gains and ability upgrades
- [ ] View card collection - displays cards with correct stats
- [ ] Add/remove cards from deck - persists changes
- [ ] Battle display - shows field beasts with stat bonuses
- [ ] Card popup - displays magic/trap/habitat cards
- [ ] Attack animation - blinks correctly
- [ ] Mission objectives - track and display correctly
- [ ] Old save format - migrates successfully

---

## Expected Results

### Line Count Reduction

**Before Integration**:
- GameManager: 2,290 lines

**After Integration**:
- GameManager: ~1,200 lines (47% reduction)
- SaveLoadManager: 250 lines
- CardCollectionManager: 580 lines
- BattleDisplayManager: 270 lines
- **Total**: 2,300 lines (well-organized across 4 files)

### Largest File

**Before**: GameManager.ts (2,290 lines)
**After**: GameManager.ts (~1,200 lines) - still needs further work, but much improved

### Benefits

✅ Clear separation of concerns
✅ Each manager has single responsibility
✅ Easier to test individual managers
✅ Simpler to maintain and extend
✅ Better code organization

---

## Troubleshooting

### Issue: TypeScript errors about missing properties

**Solution**: Make sure you've updated all `this.playerData` references to `this.saveLoadManager.getPlayerData()`

### Issue: Cards not displaying correctly

**Solution**: Check that cardInstanceToDisplay is calling the manager method correctly

### Issue: Save/load not working

**Solution**: Verify SaveLoadManager is initialized with correct platform callbacks

### Issue: Battle display broken

**Solution**: Ensure BattleDisplayManager is receiving correct battleState from battleUI

---

## Next Steps After Integration

1. Run full test suite
2. Manually test all game features
3. Update any platform-specific code that uses GameManager
4. Extract remaining managers (UICoordinator later)
5. Refactor MissionBattleUI (OpponentAI, BattleStateManager)

---

*Last Updated: 2025-10-14*
*Ready for Integration - Phase 2*
