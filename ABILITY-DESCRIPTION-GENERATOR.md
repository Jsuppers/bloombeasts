# Ability Description Generator

## Overview

The ability description generator automatically creates human-readable descriptions from ability effects. This eliminates the need to manually write and maintain description strings for every ability.

## How It Works

### 1. Generator Function
Located in `bloombeasts/engine/utils/abilityDescriptionGenerator.ts`, this function analyzes the structured ability data and generates descriptive text.

### 2. Helper Function
`getAbilityDescription()` in `bloombeasts/engine/utils/getAbilityDescription.ts` checks if a description exists and falls back to generation if not.

### 3. Integration
The canvas renderer automatically uses `getAbilityDescription()` when displaying abilities, so cards work with or without manual descriptions.

## Usage

### Removing Descriptions (Recommended)

You can now remove the `description` field from abilities:

**Before:**
```typescript
const ability: StructuredAbility = {
  name: 'Spores of Defense',
  description: 'When taking damage, place a Spore counter on the Habitat Card.',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Self,
      counter: 'Spore',
      value: 1,
    },
  ],
};
```

**After:**
```typescript
const ability: StructuredAbility = {
  name: 'Spores of Defense',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Self,
      counter: 'Spore',
      value: 1,
    },
  ],
};
```

The system will generate: "When attacked, place 1 Spore counter on this"

### Keeping Custom Descriptions (Optional)

For complex abilities or those requiring specific wording, keep the description field:

```typescript
const ability: StructuredAbility = {
  name: 'Rapid Growth',
  description: 'At turn start, gain +1 HP for every 2 Spore counters.',
  trigger: AbilityTrigger.StartOfTurn,
  effects: [...],
};
```

The manual description will be used instead of generation.

## Generated Description Format

The generator follows this pattern:

1. **Trigger prefix**: "When attacking,", "At turn start,", etc.
2. **Cost** (if applicable): "Pay 1 Nectar:", "Discard 1 card:", etc.
3. **Effects**: Multiple effects combined with "and"
4. **Usage limits** (if applicable): "(once per game)", "(2x per turn)"

### Examples

| Effects | Generated Description |
|---------|----------------------|
| OnAttack + DealDamage | "When attacking, deal 2 damage to opponent" |
| OnSummon + DrawCards | "When summoned, draw 2 cards" |
| Passive + CannotBeTargeted | "Cannot be targeted by Magic or Trap" |
| StartOfTurn + Heal + ModifyStats | "At turn start, heal this by 2 HP and all allies get +1 ATK" |

## Benefits

1. **Consistency**: All descriptions follow the same format
2. **Less Code**: No need to write and maintain description strings
3. **Flexibility**: Can override with custom descriptions when needed
4. **Auto-sync**: Descriptions automatically match effect changes
5. **Easier Refactoring**: Changing effect structures updates descriptions automatically

## Migration Strategy

You can migrate cards gradually:

1. ✅ **Cards without descriptions** - Already work with generation
2. **Simple cards** - Remove descriptions, test generation
3. **Complex cards** - Keep manual descriptions for now
4. **Special cases** - Add custom logic to generator if needed

## Current Status

- ✅ Generator created
- ✅ Helper function created
- ✅ Canvas renderer updated
- ✅ `StructuredAbility.description` made optional
- ⏳ Cards still have descriptions (can be removed gradually)

## Next Steps

1. Test with cards that have removed descriptions
2. Verify generated text is accurate and readable
3. Remove descriptions from simple cards first
4. Enhance generator for edge cases as needed
5. Eventually remove most manual descriptions
