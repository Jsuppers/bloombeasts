/**
 * Mushroomancer - AOE debuffer with self-heal
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration, CostType, HealValueType } from '../../types/abilities';

const mushroomancerPassive: StructuredAbility = {
  name: 'Fungal Cloud',
  description: 'When Summoned, give all adjacent Bloom Beasts -1 ATK until the start of your next turn.',
  trigger: AbilityTrigger.OnSummon,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AdjacentEnemies,
      stat: StatType.Attack,
      value: -1,
      duration: EffectDuration.StartOfNextTurn,
    },
  ],
};

const mushroomancerBloom: StructuredAbility = {
  name: 'Life Spore',
  description: 'Remove 1 Spore counter from the Habitat Card to heal Mushroomancer by 2 HP.',
  trigger: AbilityTrigger.Activated,
  cost: {
    type: CostType.RemoveCounter,
    counter: 'Spore',
    value: 1,
  },
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 2,
    },
  ],
};

// Level 4 upgrades
const mushroomancerPassive4: StructuredAbility = {
  name: 'Toxic Spores',
  description: 'When Summoned, give all adjacent Bloom Beasts -2 ATK until the start of your next turn.',
  trigger: AbilityTrigger.OnSummon,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AdjacentEnemies,
      stat: StatType.Attack,
      value: -2,
      duration: EffectDuration.StartOfNextTurn,
    },
  ],
};

// Level 7 upgrades
const mushroomancerBloom7: StructuredAbility = {
  name: 'Greater Life Spore',
  description: 'Remove 1 Spore counter from the Habitat Card to heal Mushroomancer by 3 HP.',
  trigger: AbilityTrigger.Activated,
  cost: {
    type: CostType.RemoveCounter,
    counter: 'Spore',
    value: 1,
  },
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 3,
    },
  ],
};

// Level 9 upgrades
const mushroomancerPassive9: StructuredAbility = {
  name: 'Parasitic Bloom',
  description: 'When Summoned, give all opponent Bloom Beasts -2 ATK permanently.',
  trigger: AbilityTrigger.OnSummon,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AllEnemies,
      stat: StatType.Attack,
      value: -2,
      duration: EffectDuration.Permanent,
    },
  ],
};

const mushroomancerBloom9: StructuredAbility = {
  name: 'Spore Regeneration',
  description: 'Remove 1 Spore counter to fully heal Mushroomancer and gain +1 ATK permanently.',
  trigger: AbilityTrigger.Activated,
  cost: {
    type: CostType.RemoveCounter,
    counter: 'Spore',
    value: 1,
  },
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: HealValueType.Full,
    },
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.Self,
      stat: StatType.Attack,
      value: 1,
      duration: EffectDuration.Permanent,
    },
  ],
};

export const MUSHROOMANCER: BloomBeastCard = {
  id: 'mushroomancer',
  name: 'Mushroomancer',
  type: 'Bloom',
  affinity: 'Forest',
  cost: 3,
  baseAttack: 3,
  baseHealth: 5,
  ability: mushroomancerPassive,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 2, atk: 0 },
      3: { hp: 3, atk: 1 },
      4: { hp: 4, atk: 2 },
      5: { hp: 6, atk: 3 },
      6: { hp: 8, atk: 4 },
      7: { hp: 10, atk: 5 },
      8: { hp: 12, atk: 6 },
      9: { hp: 14, atk: 7 },
    },
    abilityUpgrades: {
      4: {
        ability: mushroomancerPassive4,
      },
      7: {
        ability: mushroomancerBloom7,
      },
      9: {
        ability: mushroomancerPassive9,
      },
    },
  },
};