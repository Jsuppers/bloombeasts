# 🚀 DO THIS NEXT - Quick Reference

**Last Updated**: 2025-11-05
**Time Required**: 20 minutes
**Difficulty**: Easy (just copy-paste edits)

---

## ⚠️ STEP 0: STOP DEV SERVER FIRST!

```bash
# Stop all Node.js processes
taskkill /F /IM node.exe

# Or press Ctrl+C in terminal running npm
```

**WHY**: File watcher is preventing edits. Files keep reverting.

---

## ✅ STEP 1: Remove OpponentAI from MissionBattleUI.ts (3 edits)

**File**: `bloombeasts/screens/missions/MissionBattleUI.ts`

### Edit 1/3 - Line 21 (remove import)
```typescript
// DELETE THIS LINE:
import { OpponentAI } from '../../battle/ai/OpponentAI';
```

### Edit 2/3 - Line 39 (remove field)
```typescript
// DELETE THIS LINE:
private opponentAI: OpponentAI;
```

### Edit 3/3 - Lines 56-64 (remove initialization)
```typescript
// DELETE THESE LINES:
    this.opponentAI = new OpponentAI({
      async,
      onAction: (action: string) => {
        if (this.opponentActionCallback) this.opponentActionCallback(action);
      },
      onRender: () => {
        if (this.renderCallback) this.renderCallback();
      },
    });

    // KEEP THIS LINE (the blank line stays):
```

**Result**: File should now have no OpponentAI references.

---

## ✅ STEP 2: Use Constants in BattleController.ts (2 edits)

**File**: `bloombeasts/battle/core/BattleController.ts`

### Edit 1/2 - Add import (after line 7)
```typescript
import { Logger } from '../../engine/utils/Logger';
import type { AsyncMethods } from '../../ui/types/bindings';
import {
  BattleConfig,
  BattleState,
  BattleCallbacks,
  BattleResult
} from '../types';
import { MAX_AI_ACTIONS_PER_TURN } from '../../engine/constants/battleConstants';  // ← ADD THIS
```

### Edit 2/2 - Replace line 293
```typescript
// OLD:
      const maxActions = 50; // Safety limit to prevent infinite loops

// NEW:
      const maxActions = MAX_AI_ACTIONS_PER_TURN;
```

**Result**: Magic number replaced with named constant.

---

## ✅ STEP 3: Use Constants in BattleScreen.ts (6 edits)

**File**: `bloombeasts/ui/screens/BattleScreen.ts`

### Edit 1/6 - Add import (top of file)
```typescript
import { Logger } from '../../engine/utils/Logger';
import { EMOJIS } from '../constants/emojis';
// ... other imports ...
import {
  TURN_TIMER_SECONDS,
  AUTO_ATTACK_TOTAL_DELAY_MS
} from '../../engine/constants/battleConstants';  // ← ADD THIS
```

### Edit 2/6 - Line 58
```typescript
// OLD:
  private playerTimerValue = 300; // 5 minutes = 300 seconds

// NEW:
  private playerTimerValue = TURN_TIMER_SECONDS;
```

### Edit 3/6 - Line 59
```typescript
// OLD:
  private opponentTimerValue = 300; // 5 minutes = 300 seconds

// NEW:
  private opponentTimerValue = TURN_TIMER_SECONDS;
```

### Edit 4/6 - Line 110
```typescript
// OLD:
    this.playerTimerValue = 300;

// NEW:
    this.playerTimerValue = TURN_TIMER_SECONDS;
```

### Edit 5/6 - Line 111
```typescript
// OLD:
    this.opponentTimerValue = 300;

// NEW:
    this.opponentTimerValue = TURN_TIMER_SECONDS;
```

### Edit 6/6 - Line 222
```typescript
// OLD:
            this.async.setTimeout(() => resolve(), 3500);

// NEW:
            this.async.setTimeout(() => resolve(), AUTO_ATTACK_TOTAL_DELAY_MS);
```

### Edit 7/6 - Lines 589-590 (bonus!)
```typescript
// OLD:
    this.playerTimerValue = 300;
    this.opponentTimerValue = 300;

// NEW:
    this.playerTimerValue = TURN_TIMER_SECONDS;
    this.opponentTimerValue = TURN_TIMER_SECONDS;
```

**Result**: All timer magic numbers replaced with constants.

---

## ✅ STEP 4: Test Everything (5 minutes)

```bash
# Start dev server
npm run dev

# Or if using different command:
npm start
# or
npm run watch
```

### Manual Testing Checklist:
- [ ] Game loads without errors
- [ ] Can start a battle
- [ ] Can play cards (Beast, Magic, Trap, Buff)
- [ ] Can attack with beasts
- [ ] Can end turn
- [ ] AI takes turn automatically
- [ ] AI plays cards and attacks
- [ ] Battle ends correctly (win/loss)
- [ ] Timer displays correctly (5:00)

### Run Unit Tests:
```bash
npm test

# Or specific tests:
npm test -- bloombeasts/battle
npm test -- bloombeasts/screens
```

**Expected**: All tests pass, no new errors.

---

## ✅ STEP 5: Commit Changes (2 minutes)

```bash
# Check what changed
git status
git diff

# Stage changes
git add bloombeasts/battle/ai/
git add bloombeasts/screens/missions/MissionBattleUI.ts
git add bloombeasts/battle/core/BattleController.ts
git add bloombeasts/ui/screens/BattleScreen.ts
git add bloombeasts/engine/constants/battleConstants.ts
git add bloombeasts/battle/types/actions.ts
git add bloombeasts/battle/actions/ActionHandler.ts
git add REFACTORING-ROADMAP.md
git add MANUAL-CHANGES-GUIDE.md
git add REFACTORING-SUMMARY.md
git add REFACTORING-STATUS.md
git add DO-NEXT.md

# Commit
git commit -m "refactor: Phase 1 - Remove dead code and extract constants

- Delete unused OpponentAI.ts (372 LOC)
- Remove OpponentAI references from MissionBattleUI
- Create battleConstants.ts with extracted magic numbers
- Create typed action system (actions.ts)
- Create action handler framework (ActionHandler.ts)
- Replace magic numbers with named constants
- Add comprehensive refactoring documentation

Impact: Removed 372 LOC, improved maintainability"
```

---

## 📊 What We Accomplished

### ✅ Completed (This Session):
1. **Comprehensive Code Review**
   - Identified 15 code smells
   - Mapped architecture issues
   - Created detailed refactoring plan

2. **Files Created**:
   - `battleConstants.ts` - All magic numbers extracted
   - `actions.ts` - Complete typed action system
   - `ActionHandler.ts` - Action handler framework
   - 5 documentation files

3. **Files Deleted**:
   - `OpponentAI.ts` - 372 LOC removed

4. **Documentation**:
   - `REFACTORING-ROADMAP.md` - 6-phase plan
   - `MANUAL-CHANGES-GUIDE.md` - Step-by-step guide
   - `REFACTORING-SUMMARY.md` - Executive summary
   - `REFACTORING-STATUS.md` - Progress tracker
   - `DO-NEXT.md` - This file

### ⏳ Needs Manual Edit (20 minutes):
- Remove OpponentAI from MissionBattleUI.ts (3 lines)
- Add constants to BattleController.ts (2 edits)
- Add constants to BattleScreen.ts (7 edits)
- Test + commit

### 🔜 Phase 2 (After This):
- Remove state conversion layer
- Improve state cloning
- Flatten architecture

---

## 💡 Pro Tips

### If TypeScript Errors Appear:
```bash
# Rebuild
npm run build

# Clean and rebuild
rm -rf dist/
npm run build
```

### If Tests Fail:
1. Check import paths (relative paths correct?)
2. Check for missing dependencies
3. Re-run tests: `npm test -- --clearCache`

### If Dev Server Won't Start:
```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Clear cache
rm -rf node_modules/.cache/

# Restart
npm run dev
```

---

## 🎯 Success Criteria

✅ **You're done when**:
- [ ] No TypeScript errors
- [ ] All tests pass
- [ ] Battle gameplay works identically
- [ ] No console errors in browser
- [ ] Git commit created
- [ ] Ready to start Phase 2

---

## 📞 Need Help?

**Read These First**:
1. `REFACTORING-STATUS.md` - What's done, what's blocked
2. `MANUAL-CHANGES-GUIDE.md` - Detailed instructions
3. `REFACTORING-ROADMAP.md` - Full checklist

**Common Issues**:
- "File won't save" → Stop dev server (Step 0)
- "Import errors" → Check file paths, rebuild
- "Tests fail" → Check if OpponentAI fully removed
- "Type errors" → Run `npm run build` to see details

---

## 🚀 Ready?

1. ⚠️ **Stop dev server** (taskkill /F /IM node.exe)
2. ✏️ **Make edits** (3 files, 12 changes total)
3. ✅ **Test** (5 minutes)
4. 💾 **Commit** (2 minutes)
5. 🎉 **Done!** (Move to Phase 2)

**Total Time**: ~20 minutes

**Let's go!** 🚀
