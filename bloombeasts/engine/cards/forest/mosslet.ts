/**
 * Mosslet - Defensive tank with spore mechanics
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger } from '../../types/abilities';

const mossletPassive: StructuredAbility = {
  name: 'Spores of Defense',
  description: 'When Mosslet takes damage, place a "Spore" counter on the Habitat Card.',
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
  description: 'At the start of your turn, Mosslet gains +1 Health for every 2 Spore counters on the Habitat Card.',
  trigger: AbilityTrigger.StartOfTurn,
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 1, // TODO: Needs calculation based on Spore counters / 2
    },
  ],
};

// Level 4 upgrades
const mossletPassive4: StructuredAbility = {
  name: 'Spore Burst',
  description: 'When Mosslet takes damage, place 2 "Spore" counters on the Habitat Card.',
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
  description: 'At the start of your turn, Mosslet gains +2 Health for every 2 Spore counters on the Habitat Card.',
  trigger: AbilityTrigger.StartOfTurn,
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 2, // TODO: Needs calculation based on Spore counters / 2
    },
  ],
};

// Level 9 upgrades
const mossletPassive9: StructuredAbility = {
  name: 'Spore Dominance',
  description: 'When Mosslet takes damage, place 2 "Spore" counters on the Habitat Card and heal 1 HP.',
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
  description: 'At the start of your turn, Mosslet gains +3 Health for every 2 Spore counters. Adjacent allies gain +1 HP.',
  trigger: AbilityTrigger.StartOfTurn,
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 3, // TODO: Needs calculation based on Spore counters / 2
    },
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
  ability: mossletPassive,
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
        ability: mossletPassive4,
      },
      7: {
        ability: mossletBloom7,
      },
      9: {
        ability: mossletPassive9,
      },
    },
  },
};
