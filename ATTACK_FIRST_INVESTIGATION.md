# Attack-First Mechanic Investigation

## Question: "What is this meant to do?"
```typescript
{
  type: EffectType.AttackModification,
  target: AbilityTarget.Self,
  modification: 'attack-first'
}
```

## Answer

**The `attack-first` modification should make a beast deal its damage before the defending beast can counter-attack. If the defender dies from the first strike, it cannot counter back.**

---

## Current Implementation Status: ❌ NOT IMPLEMENTED

### What's Defined ✅
1. **Type System** (abilities.ts:10)
   - `attack-first` is a valid AttackModificationEffect type
   - Properly typed alongside other modifications: `double-damage`, `triple-damage`, `instant-destroy`, `attack-twice`, `cannot-counterattack`, `piercing`, `lifesteal`

2. **Card Definitions** ✅
   - **Gale Glider** (galeGlider.ts:8-17) - Passive ability "First Wind" - always has attack-first
   - **Dewdrop Drake** (dewdropDrake.ts:8-23) - Passive ability "Mist Screen" - has attack-first when it's the only unit on field

3. **Description Generators** ✅
   - Code exists to generate descriptions like "attacks first" for cards with this modification

### What's Missing ❌

**Counter-attacks are NOT implemented at all!**

## Combat Flow Analysis

### Current Implementation (GameEngine.ts:845-869)

When a beast attacks another beast:

```typescript
// 1. Trigger OnAttack abilities
this.triggerCombatAbilities('OnAttack', attacker, attackingPlayer, defendingPlayer);

// 2. Deal damage to defender
const damage = attacker.currentAttack;
defender.currentHealth = Math.max(0, defender.currentHealth - damage);

// 3. Trigger OnDamage abilities on defender
this.triggerCombatAbilities('OnDamage', defender, defendingPlayer, attackingPlayer, undefined, attacker);

// 4. Check if defender died
if (defender.currentHealth <= 0) {
  this.triggerCombatAbilities('OnDestroy', defender, defendingPlayer, attackingPlayer);
  // Remove from field, add to graveyard
}

// 5. ❌ NO COUNTER-ATTACK CODE EXISTS
// Return true - attack complete
```

**Key Finding:** The defender **NEVER** deals damage back to the attacker.

### Expected Implementation (with counter-attacks)

```typescript
// 1. Check for attack-first modification
const attackerHasFirstStrike = checkAttackModifications(attacker, 'attack-first');
const attackerHasCannotCounter = checkAttackModifications(attacker, 'cannot-counterattack');

// 2. Trigger OnAttack abilities
this.triggerCombatAbilities('OnAttack', attacker, ...);

// 3a. If attack-first: Deal attacker damage first
if (attackerHasFirstStrike) {
  applyDamage(defender, attacker.currentAttack);
  if (defender.currentHealth <= 0) {
    handleDefeat(defender);
    return; // Defender died, no counter-attack
  }
}

// 3b. If no attack-first: Deal damage simultaneously
else {
  applyDamage(defender, attacker.currentAttack);
  applyDamage(attacker, defender.currentAttack);
  handleDefeats();
  return;
}

// 4. Counter-attack (only if defender survived first strike)
if (!attackerHasCannotCounter) {
  applyDamage(attacker, defender.currentAttack);
}

// 5. Handle any defeats
handleDefeats();
```

## Integration Test Results

### Test Setup
Created comprehensive integration tests for Gale Glider (2 ATK / 2 HP with attack-first)

### Key Findings from Tests

**Test 1: Gale Glider (2/2) vs Mosslet (2/4)**
- Expected: Mosslet should die (takes 2 damage, has 4 HP base)
- **Actual: Mosslet survived at 2 HP** ✓ Correct (base HP is 4, not 2)
- Gale Glider: **Stayed at 2 HP** (took NO damage)

**Test 2: Gale Glider (2/2) vs Charcoil (3/3)**
- Expected: Both should die (2 damage vs 2 HP, 3 damage vs 3 HP)
- **Actual: BOTH SURVIVED**
  - Charcoil: 1 HP (took 2 damage from 3 HP base) ✓ Correct
  - Gale Glider: **2 HP** (took NO damage) ❌ Should have taken 3 damage and died

**Test 3: Gale Glider (2/2) vs Modified Mosslet (2/3)**
- Expected: Gale Glider should die (takes 2 damage)
- **Actual: Gale Glider stayed at 2 HP** (took NO damage)
- Modified Mosslet: 1 HP ✓ Correct

### Conclusion from Tests

**Counter-attacks do not exist in the current implementation.** All beasts tested (with and without attack-first) took zero counter-attack damage. This means:
- The attack-first mechanic cannot be tested yet
- Combat is currently one-directional (attacker → defender only)
- No beast ever takes return damage when attacking

## When Will Attack-First Matter?

The attack-first mechanic will become relevant when:

1. **Counter-attacks are implemented** in GameEngine.ts executeAttack method
2. **CombatSystem.ts** is expanded to handle attack modifications
3. **AbilityProcessor** checks for AttackModificationEffect during combat resolution

### Implementation Priority

```
High Priority:
[ ] Implement basic counter-attacks (defender deals damage back to attacker)
[ ] Add attack modification system in CombatSystem
[ ] Handle cannot-counterattack modification
[ ] Handle attack-first modification (deal damage in order, check for death between strikes)

Medium Priority:
[ ] Implement other attack modifications (double-damage, triple-damage, attack-twice)
[ ] Implement piercing (excess damage goes to player)
[ ] Implement lifesteal (heal attacker)

Low Priority:
[ ] Implement instant-destroy modification
[ ] Complex interaction testing
```

## Example Use Cases (When Implemented)

### Scenario 1: Attack-First Saves the Attacker
- **Gale Glider (2/2 attack-first)** attacks **Mosslet (2/2)**
- Without attack-first: Both deal 2 damage simultaneously → Both die
- **With attack-first**: Gale Glider deals 2 first → Mosslet dies → Dead beasts can't counter → **Gale Glider survives** ✓

### Scenario 2: Attack-First Doesn't Help
- **Gale Glider (2/2 attack-first)** attacks **Charcoil (3/3)**
- Gale Glider deals 2 first → Charcoil survives at 1 HP
- Charcoil counters for 3 damage → **Gale Glider dies**
- Result: Same as without attack-first (attacker dies, defender survives)

### Scenario 3: Comparing to Cannot-Counterattack
- **attack-first**: Defender can counter IF it survives the first strike
- **cannot-counterattack**: Defender NEVER counters even if it survives
- In a 2/2 vs 2/2 scenario, both result in the attacker surviving, but mechanically they're different

---

## Summary

**What is attack-first meant to do?**
It should give the attacking beast "first strike" priority in combat, dealing damage before the defender can counter-attack. If the defender dies from the first strike, no counter-attack occurs.

**Is it working?**
No. Counter-attacks don't exist yet, so the mechanic is defined but has no effect.

**What needs to be done?**
Implement counter-attacks in GameEngine.ts executeAttack method, then add logic to check for attack modifications like 'attack-first' and 'cannot-counterattack' to modify the damage order.

---

## Related Files

- **Type Definition**: `bloombeasts/engine/types/abilities.ts` (line 10)
- **Card Using It**: `bloombeasts/engine/cards/sky/galeGlider.ts` (line 8-17)
- **Card Using It**: `bloombeasts/engine/cards/water/dewdropDrake.ts` (line 8-23)
- **Combat System**: `bloombeasts/engine/systems/CombatSystem.ts` (mostly delegated to GameEngine)
- **Combat Logic**: `bloombeasts/engine/systems/GameEngine.ts` (line 808-887)
- **Integration Tests**: `bloombeasts/engine/cards/sky/galeGlider.integration.test.ts`

---

*Investigation Date: 2025-10-15*
*Investigator: Claude (Code Assistant)*
