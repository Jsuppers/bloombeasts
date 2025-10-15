/**
 * Mosslet - Defensive tank with spore mechanics
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger } from '../../types/abilities';

const mossletPassive: StructuredAbility = {
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

const mossletBloom: StructuredAbility = {
  name: 'Rapid Growth',
  trigger: AbilityTrigger.OnOwnStartOfTurn,
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 1,
      // Implementation note: Value should be calculated as floor(SporeCounters / 2) at runtime
      // This requires the game engine to check habitat counters during processing
    } as any,
  ],
};

// Level 4 upgrades
const mossletPassive4: StructuredAbility = {
  name: 'Spore Burst',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Self,
      counter: 'Spore',
      value: 2,
    },
  ],
};

// Level 7 upgrades
const mossletBloom7: StructuredAbility = {
  name: 'Accelerated Growth',
  trigger: AbilityTrigger.OnOwnStartOfTurn,
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 2,
      // Implementation note: Value should be calculated as 2 * floor(SporeCounters / 2) at runtime
    } as any,
  ],
};

// Level 9 upgrades
const mossletPassive9: StructuredAbility = {
  name: 'Spore Dominance',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Self,
      counter: 'Spore',
      value: 2,
    },
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 1,
    },
  ],
};

const mossletBloom9: StructuredAbility = {
  name: 'Maximum Bloom',
  trigger: AbilityTrigger.OnOwnStartOfTurn,
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 3,
      // Implementation note: Value should be calculated as 3 * floor(SporeCounters / 2) at runtime
    } as any,
    {
      type: EffectType.Heal,
      target: AbilityTarget.AdjacentAllies,
      value: 1,
    },
  ],
};

export const MOSSLET: BloomBeastCard = {
  id: 'mosslet',
  name: 'Mosslet',
  type: 'Bloom',
  affinity: 'Forest',
  cost: 2,
  baseAttack: 2,
  baseHealth: 4,
  abilities: [mossletPassive],
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 2, atk: 0 },
      3: { hp: 3, atk: 1 },
      4: { hp: 5, atk: 2 },
      5: { hp: 7, atk: 3 },
      6: { hp: 9, atk: 4 },
      7: { hp: 11, atk: 5 },
      8: { hp: 13, atk: 6 },
      9: { hp: 15, atk: 7 },
    },
    abilityUpgrades: {
      4: {
        abilities: [mossletPassive4],
      },
      7: {
        abilities: [mossletBloom7],
      },
      9: {
        abilities: [mossletPassive9],
      },
    },
  },
};
