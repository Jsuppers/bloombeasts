# BloomBeasts Refactoring Roadmap

**Created**: 2025-11-05
**Goal**: Simplify architecture, remove dead code, complete TURBO migration
**Estimated Total Effort**: 18-25 hours
**Estimated LOC Reduction**: ~1,000 lines (from 2,400 to 1,400)

---

## Phase 1: Remove Dead Code (Quick Wins)
**Estimated Effort**: 2-3 hours | **Impact**: Remove ~700 LOC

### 1.1 Delete Unused Phase System
- [x] Delete `bloombeasts/battle/BloomBeastsGameDefinition.ts` (442 LOC, 100% unused) - **FILE NEVER EXISTED**
- [ ] Remove `phase: Phase` field from `bloombeasts/engine/types/game.ts:58` - **NEEDS MANUAL EDIT (file watcher active)**
- [ ] Remove legacy `Phase` enum from `bloombeasts/engine/types/game.ts:13-31` - **NEEDS MANUAL EDIT (file watcher active)**
- [ ] Search for any remaining references to old Phase system
- [ ] Update types/interfaces that referenced Phase

### 1.2 Consolidate AI Systems
- [x] Delete `bloombeasts/battle/ai/OpponentAI.ts` (150+ LOC) - **COMPLETED**
- [ ] Update `MissionBattleUI.ts` to use `BloomBeastsAI` (TURBO-based) - **NEEDS MANUAL EDIT (file watcher active)**
- [ ] Remove imports/references to OpponentAI - **NEEDS MANUAL EDIT (file watcher active)**
- [ ] Test AI behavior works correctly with TURBO AI

### 1.3 Clean Up Legacy Battle System
- [ ] Review `bloombeasts/battle/core/TurnManager.ts` - delete if fully stubbed
- [ ] Remove unused methods from `bloombeasts/battle/core/BattleRules.ts`
- [ ] Delete any other backward compatibility wrappers

### 1.4 Remove Magic Numbers/Strings
- [x] Create `bloombeasts/engine/constants/battleConstants.ts` - **COMPLETED**
- [x] Extract: `MAX_AI_ACTIONS_PER_TURN = 50` - **COMPLETED**
- [x] Extract: `BEAST_PLAY_DELAY_MS = 1200` - **COMPLETED**
- [x] Extract: `MAGIC_PLAY_DELAY_MS = 3500` - **COMPLETED**
- [x] Extract: `TURN_TIMER_SECONDS = 300` - **COMPLETED**
- [x] Extract: `MAX_FIELD_SIZE = 3` - **COMPLETED**
- [ ] Replace all magic numbers with named constants - **NEEDS MANUAL EDIT (file watcher active)**

---

## Phase 2: Fix State Management
**Estimated Effort**: 4-6 hours | **Impact**: Major architectural improvement

### 2.1 Standardize on TURBO State
- [ ] Audit all state access points
- [ ] Choose TURBO `IGameState<BloomBeastsState>` as single source of truth
- [ ] Remove legacy `GameState` type from `bloombeasts/engine/types/game.ts`
- [ ] Update all interfaces to use TURBO state

### 2.2 Remove State Conversion Layer
- [ ] Delete `BattleController.convertToBattleState()` method (~50 LOC)
- [ ] Delete `BattleController.convertPlayer()` method
- [ ] Remove conversion calls throughout `BattleController.ts`
- [ ] Update `MissionBattleUI` to work with TURBO state directly
- [ ] Update `BattleScreen` to consume TURBO state

### 2.3 Improve State Cloning
- [ ] Replace `JSON.parse(JSON.stringify())` with proper cloning
- [ ] Add `structuredClone()` or use Immer library
- [ ] Remove Set serialization hacks in `BloomBeastsGame.ts:292-305`
- [ ] Test state immutability

### 2.4 Better State Access Patterns
- [ ] Create getter methods for common state queries
- [ ] Add: `getCurrentPlayer(state): Player`
- [ ] Add: `getOpponentPlayer(state): Player`
- [ ] Add: `getPlayerField(state, playerId): FieldState`
- [ ] Replace direct state access with getters

---

## Phase 3: Simplify Architecture
**Estimated Effort**: 8-10 hours | **Impact**: Improved maintainability

### 3.1 Replace String-Based Actions
- [ ] Create `bloombeasts/battle/types/actions.ts`
- [ ] Define discriminated union for all action types:
  ```typescript
  type BattleAction =
    | { type: 'play-card'; cardIndex: number; targetIndex?: number; position?: number }
    | { type: 'attack'; attackerId: string; targetId: string }
    | { type: 'use-ability'; beastId: string; abilityIndex: number; targetId?: string }
    | { type: 'end-turn' }
    | { type: 'forfeit' }
  ```
- [ ] Create action creator functions
- [ ] Create centralized action parser: `parseActionString(str): BattleAction`
- [ ] Update `BattleScreen` to emit typed actions
- [ ] Update `MissionBattleUI` to use typed actions
- [ ] Remove all string parsing logic
- [ ] Update tests

### 3.2 Extract Action Handlers
- [ ] Create `bloombeasts/battle/actions/` directory
- [ ] Create interface: `ActionHandler<T extends BloomBeastsActionData>`
- [ ] Extract `DrawCardAction.ts` from `executeAction()`
- [ ] Extract `PlayCardAction.ts` from `executeAction()`
- [ ] Extract `AttackAction.ts` from `executeAction()`
- [ ] Extract `EndTurnAction.ts` from `executeAction()`
- [ ] Extract `UseAbilityAction.ts` from `executeAction()`
- [ ] Create `ActionHandlerRegistry` to map types to handlers
- [ ] Refactor `BloomBeastsGame.executeAction()` to use registry
- [ ] Unit test each action handler independently

### 3.3 Split BattleController (God Object)
- [ ] Create `bloombeasts/battle/core/BattleOrchestrator.ts` (lifecycle, turn management)
- [ ] Create `bloombeasts/battle/core/StateAdapter.ts` (TURBO ↔ Legacy conversion, if still needed)
- [ ] Create `bloombeasts/battle/core/ActionProcessor.ts` (player action handling)
- [ ] Create `bloombeasts/battle/core/AIManager.ts` (AI turn execution)
- [ ] Create `bloombeasts/battle/core/WinConditionChecker.ts` (end game logic)
- [ ] Migrate methods from `BattleController` to new classes
- [ ] Update `BattleController` to be a thin facade/coordinator
- [ ] Update `MissionBattleUI` to use new structure
- [ ] Test battle flow end-to-end

### 3.4 Flatten Wrapper Layers
- [ ] Evaluate: Can `MissionBattleUI` consume TURBO directly?
- [ ] Evaluate: Can `BattleScreen` consume TURBO directly?
- [ ] Create mission system as event listeners/plugins instead of wrappers
- [ ] Reduce layers from 4 to 2
- [ ] Update call chains

### 3.5 Split Long Methods
- [ ] Split `MissionBattleUI.processPlayerAction()` (88 lines):
  - Extract `ActionParser.parse()`
  - Extract `ActionExecutor.execute()`
- [ ] Split `BattleScreen.createUI()` (68 lines):
  - Extract `createGameBoard()`
  - Extract `createInfoBar()`
  - Extract `createHandOverlay()`
  - Extract `createPopupLayer()`
- [ ] Split `BattleController.executeAITurn()` (45 lines):
  - Extract AI action loop logic
  - Extract turn switch logic
  - Add clearer exit conditions

### 3.6 Improve Type Safety
- [ ] Remove all `any` types from:
  - `BattleController.convertPlayer(player: any)`
  - `BattleController.findBeast(id: string, field: any)`
  - Action parsing code
- [ ] Replace `!` assertions with proper validation
- [ ] Add runtime checks before unsafe casts
- [ ] Use discriminated unions for card types

---

## Phase 4: Utilize TURBO Features
**Estimated Effort**: 4-6 hours | **Impact**: Unlock framework capabilities

### 4.1 Use TURBO Event Bus
- [ ] Remove custom callback pattern from `BattleController`
- [ ] Remove `BattleCallbacks` interface
- [ ] Subscribe to TURBO events in `MissionBattleUI`:
  - `gameStarted`
  - `actionExecuted`
  - `turnChanged`
  - `gameEnded`
- [ ] Subscribe to TURBO events in `BattleScreen`
- [ ] Remove manual event propagation

### 4.2 Implement Proper Phase Management
- [ ] Map `BattlePhase` to TURBO's `GamePhase` properly
- [ ] Use TURBO phase transitions
- [ ] Remove custom phase tracking
- [ ] Test phase-specific logic works

### 4.3 Enable Advanced Features
- [ ] Expose TURBO's `getActionHistory()` for replay
- [ ] Expose TURBO's `undo()` / `redo()` for turn rewinding (if desired)
- [ ] Consider using TURBO's pause/resume functionality
- [ ] Add save/load state using TURBO's state serialization

### 4.4 Standardize Async Patterns
- [ ] Document when async is needed (animations, delays)
- [ ] Make all action methods consistently async or sync
- [ ] Use Promise patterns consistently
- [ ] Consider adding animation queue system

---

## Phase 5: Testing & Documentation
**Estimated Effort**: 4-6 hours | **Impact**: Long-term maintainability

### 5.1 Unit Tests
- [ ] Test each action handler independently
- [ ] Test state transformations
- [ ] Test win condition logic
- [ ] Test AI decision making
- [ ] Aim for 80%+ coverage on game logic

### 5.2 Integration Tests
- [ ] Test full turn flow (player → AI → player)
- [ ] Test battle start → end flow
- [ ] Test card playing scenarios
- [ ] Test beast combat scenarios
- [ ] Test mission-specific logic

### 5.3 Documentation
- [ ] Create architecture diagram (current vs new)
- [ ] Document TURBO integration approach
- [ ] Document action flow
- [ ] Document state management pattern
- [ ] Create developer guide for adding new cards/abilities
- [ ] Add JSDoc comments to key interfaces

### 5.4 Performance
- [ ] Profile state cloning performance
- [ ] Profile action execution
- [ ] Profile AI decision making
- [ ] Optimize hot paths if needed

---

## Phase 6: Polish & Cleanup
**Estimated Effort**: 2-3 hours

### 6.1 Code Quality
- [ ] Run linter and fix all issues
- [ ] Format all modified files
- [ ] Remove unused imports
- [ ] Remove commented-out code
- [ ] Add missing type annotations

### 6.2 Final Review
- [ ] Review all changes as a whole
- [ ] Verify no regressions in gameplay
- [ ] Check that all tests pass
- [ ] Update README if needed
- [ ] Close this roadmap or archive it

---

## Metrics Tracking

### Before Refactoring
- **Total Battle System LOC**: ~2,400
- **Dead Code**: ~700 LOC (29%)
- **Duplicate Code**: ~500 LOC (21%)
- **Code Smells**: 15 (3 critical, 7 high, 5 medium)
- **Average Method Length**: 45 lines
- **Max Method Complexity**: 116 lines, 5 nesting levels

### Target After Refactoring
- **Total Battle System LOC**: ~1,400 (-42%)
- **Dead Code**: 0 LOC
- **Duplicate Code**: <50 LOC
- **Code Smells**: <3
- **Average Method Length**: <25 lines
- **Max Method Complexity**: <40 lines, 3 nesting levels

### Actual After Refactoring
- **Total Battle System LOC**: _TBD_
- **Dead Code**: _TBD_
- **Duplicate Code**: _TBD_
- **Code Smells**: _TBD_
- **Average Method Length**: _TBD_
- **Max Method Complexity**: _TBD_

---

## Notes & Decisions

### Decision Log
- **2025-11-05**: Decided to remove BloomBeastsGameDefinition.ts entirely (unused phase system)
- **2025-11-05**: Decided to consolidate on TURBO state format as single source of truth
- **2025-11-05**: Decided to use discriminated unions for actions instead of string parsing

### Risks & Mitigations
- **Risk**: Breaking existing gameplay
  - **Mitigation**: Comprehensive testing after each phase
- **Risk**: Performance regression from state cloning changes
  - **Mitigation**: Profile before/after, use structuredClone
- **Risk**: Incomplete migration causing more confusion
  - **Mitigation**: Complete phases fully before moving on

### Questions/Blockers
- _None yet_

---

## Quick Reference: Key Files

### Will Be Deleted
- `bloombeasts/battle/BloomBeastsGameDefinition.ts` (442 LOC)
- `bloombeasts/battle/ai/OpponentAI.ts` (~150 LOC)
- `bloombeasts/battle/core/TurnManager.ts` (if fully stubbed)

### Will Be Heavily Modified
- `bloombeasts/battle/BloomBeastsGame.ts` (841 → ~500 LOC)
- `bloombeasts/battle/core/BattleController.ts` (456 → ~200 LOC split)
- `bloombeasts/screens/missions/MissionBattleUI.ts` (489 → ~300 LOC)
- `bloombeasts/ui/screens/BattleScreen.ts` (613 → ~400 LOC)
- `bloombeasts/engine/types/game.ts` (remove legacy types)

### Will Be Created
- `bloombeasts/battle/types/actions.ts` (new)
- `bloombeasts/battle/actions/` directory (5-6 handler files)
- `bloombeasts/battle/core/BattleOrchestrator.ts` (new)
- `bloombeasts/battle/core/ActionProcessor.ts` (new)
- `bloombeasts/battle/core/AIManager.ts` (new)
- `bloombeasts/battle/core/WinConditionChecker.ts` (new)
- `bloombeasts/engine/constants/battleConstants.ts` (new)
