# Mission Complete Popup Implementation Guide

## Overview
This document describes the implementation of the mission complete popup system with chest animations, rewards display, and item drops.

## What Has Been Implemented

### 1. Type Definitions
- **ItemReward interface** in `types.ts` - defines item drop chances and amounts
- **MissionRewards interface** updated to include `itemRewards?: ItemReward[]`
- **ItemRewardResult interface** in `MissionManager.ts` - structure for rewarded items
- **RewardResult interface** updated with:
  - `beastXP: number` - XP for beasts in deck
  - `itemsReceived: ItemRewardResult[]` - array of item rewards
  - `completionTimeSeconds: number` - mission completion time

### 2. Mission Timer Tracking
- **MissionRunProgress** now includes:
  - `startTime: number` - timestamp when mission started
  - `endTime?: number` - timestamp when mission ended
- Mission timer starts when `startMission()` is called
- End time is set when `completeMission()` is called

### 3. Item Reward Generation
- Updated `generateRewards()` method in `MissionManager.ts` to:
  - Calculate completion time in seconds
  - Calculate beast XP (currently same as player XP)
  - Generate item rewards based on drop chances defined in mission
  - Each item reward has min/max amounts and drop chance (0-1)

### 4. SaveLoadManager Updates
- Added `addItems(itemId, quantity)` method to add items to player inventory
- Existing `getItemQuantity(itemId)` method retrieves item counts

### 5. MissionCompletePopup Component
Created `MissionCompletePopup.ts` with:
- **Chest states**: Shows closed chest initially, opens when rewards claimed
- **Chest by affinity**: Uses mission affinity (Forest/Water/Fire/Sky) to determine chest image
- **Info display**:
  - Completion time (formatted as Xm Ys or Xs)
  - Player XP gained
  - Beast XP gained
- **Rewards display** (after chest opened):
  - Cards received
  - Items received (with quantities)
  - Nectar gained
- **Interactive buttons**:
  - "CLAIM REWARDS" button opens chest
  - "CONTINUE" button closes popup after chest opened

### 6. Example Mission Updated
- `mission01.ts` now includes example item rewards:
  - Tokens: 5-15, 80% drop chance
  - Diamonds: 1-3, 30% drop chance

## What Still Needs to be Done

### Integration with Game Manager

The `MissionCompletePopup` component needs to be integrated into the game flow. Since the game uses a platform-based rendering system, here's what needs to happen:

#### Option 1: Canvas-Based Integration (Recommended if using HTML5 Canvas)

1. **Add popup to platform renderer**:
   ```typescript
   // In your platform-specific code (e.g., index.ts or game.ts)
   import { MissionCompletePopup } from './bloombeasts/screens/missions/MissionCompletePopup';

   // Create popup instance
   const missionCompletePopup = new MissionCompletePopup();
   ```

2. **Handle mission complete event**:
   Instead of calling `platform.showRewards()` immediately in `handleBattleComplete()`, show the popup first:
   ```typescript
   // In handleBattleComplete() in gameManager.ts around line 1308
   if (battleState.rewards) {
     // Show mission complete popup instead of immediate reward dialog
     this.missionCompletePopup.show(battleState.mission, battleState.rewards);

     // Wait for user interaction...
     // (Implementation depends on your event system)
   }
   ```

3. **Render popup in game loop**:
   ```typescript
   // In your render loop
   if (missionCompletePopup.isVisible()) {
     missionCompletePopup.render(ctx, images);
   }
   ```

4. **Handle click events**:
   ```typescript
   // In click handler
   canvas.addEventListener('click', (event) => {
     if (missionCompletePopup.isVisible()) {
       const shouldClose = missionCompletePopup.handleClick(event.offsetX, event.offsetY);

       if (shouldClose) {
         // Apply rewards
         const state = missionCompletePopup.getState();
         if (state) {
           // Add player XP
           saveLoadManager.addXP(state.rewards.xpGained);

           // Add items to inventory
           state.rewards.itemsReceived.forEach(item => {
             saveLoadManager.addItems(item.itemId, item.quantity);
           });

           // Add cards to collection
           state.rewards.cardsReceived.forEach((card, index) => {
             cardCollectionManager.addCardReward(card, cardCollection, index);
           });

           // Award beast XP to deck
           awardDeckExperience(state.rewards.beastXP);

           // Track mission completion
           saveLoadManager.trackMissionCompletion(currentBattleId);

           // Save game
           await saveGameData();

           // Play win sound
           soundManager.playSfx('sfx/win.ogg');

           // Hide popup
           missionCompletePopup.hide();

           // Return to mission select
           await showMissionSelect();
         }
       }
     }
   });
   ```

#### Option 2: Platform Callback Integration

If you want to keep using the platform callback system:

1. **Update PlatformCallbacks interface**:
   ```typescript
   export interface PlatformCallbacks {
     // ... existing callbacks
     renderMissionComplete(mission: Mission, rewards: RewardResult, chestOpened: boolean): void;
     onMissionCompleteAction(callback: (action: 'claim' | 'continue') => void): void;
   }
   ```

2. **Implement in platform code**:
   The platform-specific code would need to handle rendering the mission complete screen using the MissionCompletePopup component.

### Required Images

Ensure these images are loaded in your image manager:
- `MissionCompleteContainer.png` - background container (550x330)
- `LongGreenButton.png` - claim/continue button (201x35)
- `ForestChestClosed.png` - closed forest chest
- `ForestChestOpened.png` - opened forest chest
- `WaterChestClosed.png` - closed water chest
- `WaterChestOpened.png` - opened water chest
- `FireChestClosed.png` - closed fire chest
- `FireChestOpened.png` - opened fire chest
- `SkyChestClosed.png` - closed sky chest
- `SkyChestOpened.png` - opened sky chest

All chest images are already present in `shared/images/chests/`.

### Position Constants

Already defined in `positions.ts`:
```typescript
export const missionCompleteCardPositions = {
  title: { x: 275, y: 24, size: 36, textAlign: 'center', textBaseline: 'top' },
  chestImage: { x: 73, y: 76 },
  infoText: { x: 245, y: 98, size: 14, textAlign: 'left', textBaseline: 'top' },
  claimRewardButton: { x: 175, y: 271 },
};
```

## Testing

1. Start mission01 (Rootling)
2. Complete the mission by defeating the opponent
3. Mission complete popup should appear showing:
   - "MISSION COMPLETE!" title
   - Closed Forest chest (since mission01 is Forest affinity)
   - Time taken to complete
   - Player XP: +50 (or +75 if bonus XP triggered)
   - Beast XP: +50
   - "CLAIM REWARDS" button
4. Click "CLAIM REWARDS"
5. Chest should change to open Forest chest
6. Should display:
   - Cards received (1-2 common cards)
   - Items received (5-15 tokens at 80% chance, 1-3 diamonds at 30% chance)
   - "CONTINUE" button
7. Click "CONTINUE"
8. Should return to mission select screen
9. Player items should be updated in save data

## Future Enhancements

- Add chest opening animation (sprite sheet or frame-by-frame)
- Add particle effects when chest opens
- Add sound effect for chest opening
- Show individual beast XP gains (currently shows total)
- Add rarity indicators for item drops
- Support for Boss missions with special chest type

## Notes

- The popup currently calculates beast XP as equal to player XP. You may want to adjust this formula based on game balance.
- Item drops are randomly generated each time based on drop chances. Some missions may give no items if the drop chance check fails.
- The completion time starts from when `startMission()` is called, not when the battle actually starts. If there's a delay between these, you may want to adjust the timer logic.
