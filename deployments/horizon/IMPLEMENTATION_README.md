# BloomBeasts Horizon Implementation Guide

## Overview
This guide provides a comprehensive plan for implementing a simplified version of BloomBeasts for Meta Horizon Worlds using persistent variables v2 and a cleaner architecture.

## Core Architecture Principles

### 1. Single Source of Truth
- All game state stored in `PlayerData` interface using Horizon's persistent variables v2
- Extended with `localState` for UI navigation and settings
- No separate bindings or cached values needed

### 2. Simplified Asset Management
- Dynamic props definition based on asset naming convention
- Map asset names directly from IDs instead of hardcoding 100+ properties

### 3. Clean Separation of Concerns
- `BloomBeasts-Game.ts`: UI rendering and event handling only
- `BloomBeasts-GamePlatform.ts`: Platform bridge with persistent storage
- `BloomBeasts-GameEngine.ts`: Core game logic (unchanged)

## Implementation Checklist

### Phase 1: Foundation Setup ✅
- [x] Review current implementation complexity
- [x] Document issues with current approach
- [x] Create comprehensive implementation plan

### Phase 2: Data Structure
- [ ] Extend `PlayerData` interface with `localState`:
  ```typescript
  interface LocalState {
    currentScreen: 'menu' | 'missions' | 'cards' | 'battle' | 'settings';
    volume: number;
    sfxEnabled: boolean;
    cardsPageOffset: number;
  }
  ```
- [ ] Update save/load methods to handle extended data
- [ ] Implement data migration for existing saves

### Phase 3: Platform Layer (BloomBeasts-GamePlatform.ts)
- [ ] Implement persistent variables v2 integration
  - [ ] Use `world.data.player.get()` for reading
  - [ ] Use `world.data.player.set()` for writing
  - [ ] Handle player-specific data isolation
- [ ] Simplify platform callbacks interface
- [ ] Remove redundant state management code
- [ ] Add proper error handling for storage operations

### Phase 4: UI Component (BloomBeasts-Game.ts)
- [ ] Create simplified props definition:
  ```typescript
  static propsDefinition = createPropsFromAssets([
    'img_Background',
    'img_Menu',
    'img_CardsContainer',
    // ... dynamically generate from asset list
  ]);
  ```
- [ ] Implement clean UI structure:
  - [ ] Single `playerData` binding for all state
  - [ ] Direct derivation from playerData for UI updates
  - [ ] No cached values or manual synchronization

### Phase 5: Menu Screen Implementation
- [ ] Create main menu layout:
  - [ ] Background rendering
  - [ ] Title display
  - [ ] Menu animation frames (if needed)
  - [ ] Side menu with player stats
- [ ] Implement menu interactions:
  - [ ] Button clicks for navigation
  - [ ] Stats display from playerData
  - [ ] XP bar visualization
- [ ] Add menu sound effects

### Phase 6: Cards Page Implementation
- [ ] Create cards container layout:
  - [ ] Background with container image
  - [ ] Grid layout (4x2 cards per page)
  - [ ] Deck counter display
- [ ] Implement card rendering:
  - [ ] Dynamic card image loading
  - [ ] Stats display (attack/health)
  - [ ] Deck indicator border
- [ ] Add pagination:
  - [ ] Scroll buttons in side menu
  - [ ] Page offset in localState
  - [ ] Smooth navigation
- [ ] Implement card interactions:
  - [ ] Card selection for deck building
  - [ ] Card detail view popup
  - [ ] Add/remove from deck

### Phase 7: Additional Screens (Future)
- [ ] Missions screen
- [ ] Battle screen
- [ ] Settings screen

### Phase 8: Testing & Polish
- [ ] Test persistent storage:
  - [ ] Save/load player data
  - [ ] Multi-session persistence
  - [ ] Multiplayer isolation
- [ ] Test UI responsiveness:
  - [ ] Screen transitions
  - [ ] Button interactions
  - [ ] Card pagination
- [ ] Performance optimization:
  - [ ] Asset loading
  - [ ] State updates
  - [ ] Memory usage
- [ ] Bug fixes and polish

## Asset Naming Convention

All assets follow a consistent naming pattern that allows dynamic mapping:

### Images
- UI Elements: `img_[ElementName]`
- Cards: `img_cards_[Affinity]_[CardName]`
- Affinities: `img_affinity_[AffinityName]Icon`
- Chests: `img_chests_[Affinity]Chest[State]`
- Icons: `img_icons_[IconName]`
- Menu frames: `img_menu_Frame[Number]`

### Audio
- Music: `audio_[MusicName]`
- SFX: `audio_sfx_[SoundName]`

## Helper Functions

### Dynamic Props Generator
```typescript
function createPropsFromAssets(assetList: string[]): any {
  const props: any = {};
  for (const asset of assetList) {
    props[asset] = { type: hz.PropTypes.Asset };
  }
  return props;
}
```

### Asset Mapper
```typescript
function getAssetByID(assetType: string, id: string): any {
  const propName = `${assetType}_${id.replace(/\//g, '_')}`;
  return this.props[propName] || null;
}
```

## State Management Pattern

### Reading State
```typescript
// Get current player data
const playerData = await world.data.player.get('playerData');
const currentScreen = playerData.localState.currentScreen;
```

### Updating State
```typescript
// Update local state
playerData.localState.currentScreen = 'cards';
await world.data.player.set('playerData', playerData);
```

### UI Binding
```typescript
// Single binding for all data
private playerDataBinding = new Binding<PlayerData>(defaultPlayerData);

// Derive UI state from binding
const currentScreen = this.playerDataBinding.derive(
  (data) => data.localState.currentScreen
);
```

## Benefits of This Approach

1. **Simplicity**: Single data source eliminates synchronization issues
2. **Maintainability**: Clear separation of concerns
3. **Performance**: Fewer bindings and reactive updates
4. **Persistence**: Built-in multiplayer support with v2 variables
5. **Scalability**: Easy to add new screens and features
6. **Testability**: Clean interfaces for mocking and testing

## Migration Path

1. Backup existing implementation
2. Create new simplified files alongside old ones
3. Test new implementation in parallel
4. Migrate feature by feature
5. Remove old implementation once stable

## Resources

- [Horizon Persistent Variables v2 Documentation](https://developers.meta.com/horizon-worlds/learn/documentation/typescript/getting-started/persistent-variables-v2)
- [Horizon Custom UI Guide](https://developers.meta.com/horizon-worlds/learn/documentation/create-world-scripting/custom-ui-in-typescript)
- [BloomBeasts Game Engine Documentation](../../README.md)

## Known Limitations

### Card Images in Cards Screen

**Issue:** Horizon's `Image` component doesn't support reactive/binding sources. The `source` property must be a static `ImageSource`, not a `Binding<ImageSource>`.

**Current Solution:** Cards display with:
- ✅ Card name (text)
- ✅ Stats (attack/health)
- ✅ Deck indicator (green border)
- ✅ Pagination
- ⏳ Card images (placeholder backgrounds)

**Future Solutions:**

#### Option 1: Pre-render All Cards (Recommended)
```typescript
private renderCardSlot(index: number): UINode {
  // Create Image components for all possible cards
  const allCardImages = ALL_CARD_IDS.map(cardId => ({
    cardId,
    image: Image({
      source: this.createImageSource(this.getCardImage(cardId)),
      style: {
        opacity: this.playerData.derive(data => {
          const currentCard = this.getCardAtSlot(data, index);
          return currentCard?.id === cardId ? 1 : 0;
        })
      }
    })
  }));

  // Overlay all images in the same position
  // Only the matching card will be visible (opacity: 1)
}
```

**Pros:** Uses actual card images from props
**Cons:** Renders many hidden images (performance impact with 100+ cards)

#### Option 2: Static Card Mapping
Pre-create a limited set of card image components for common cards only.

#### Option 3: Text-Based Display (Current)
Use card names and colored backgrounds to differentiate cards.

**Recommendation:** Implement Option 1 with lazy loading - only render images for cards the player owns.

## Support

For questions or issues, refer to the main BloomBeasts documentation or contact the development team.