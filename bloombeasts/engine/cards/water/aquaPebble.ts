/**
 * Aqua-Pebble - Synergy attacker with healing
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration, ConditionType, HealValueType } from '../../types/abilities';

const aquaPebblePassive: StructuredAbility = {
  name: 'Tide Flow',
  trigger: AbilityTrigger.OnAllySummon,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.Self,
      stat: StatType.Attack,
      value: 1,
      duration: EffectDuration.EndOfTurn,
      condition: {
        type: ConditionType.AffinityMatches,
        value: 'Water',
      },
    },
  ],
};

const aquaPebbleBloom: StructuredAbility = {
  name: 'Hydration',
  trigger: AbilityTrigger.EndOfTurn,
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.OtherAlly,
      value: 1,
    },
  ],
};

// Level 4 upgrades
const aquaPebblePassive4: StructuredAbility = {
  name: 'Tidal Surge',
  trigger: AbilityTrigger.OnAllySummon,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.Self,
      stat: StatType.Attack,
      value: 2,
      duration: EffectDuration.EndOfTurn,
      condition: {
        type: ConditionType.AffinityMatches,
        value: 'Water',
      },
    },
  ],
};

// Level 7 upgrades
const aquaPebbleBloom7: StructuredAbility = {
  name: 'Rejuvenation',
  trigger: AbilityTrigger.EndOfTurn,
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.AllAllies,
      value: 2,
    },
  ],
};

// Level 9 upgrades
const aquaPebblePassive9: StructuredAbility = {
  name: 'Tsunami Force',
  trigger: AbilityTrigger.OnAllySummon,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.Self,
      stat: StatType.Attack,
      value: 3,
      duration: EffectDuration.Permanent,
      condition: {
        type: ConditionType.AffinityMatches,
        value: 'Water',
      },
    },
  ],
};

const aquaPebbleBloom9: StructuredAbility = {
  name: 'Fountain of Life',
  trigger: AbilityTrigger.EndOfTurn,
  effects: [
    {
      type: EffectType.Heal,
      target: AbilityTarget.AllAllies,
      value: HealValueType.Full,
    },
  ],
};

export const AQUA_PEBBLE: BloomBeastCard = {
  id: 'aqua-pebble',
  name: 'Aqua Pebble',
  type: 'Bloom',
  affinity: 'Water',
  cost: 1,
  baseAttack: 1,
  baseHealth: 4,
  ability: aquaPebblePassive,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 1, atk: 0 },
      3: { hp: 3, atk: 0 },
      4: { hp: 4, atk: 1 },
      5: { hp: 6, atk: 2 },
      6: { hp: 7, atk: 3 },
      7: { hp: 9, atk: 4 },
      8: { hp: 10, atk: 5 },
      9: { hp: 12, atk: 6 },
    },
    abilityUpgrades: {
      4: {
        ability: aquaPebblePassive4,
      },
      7: {
        ability: aquaPebbleBloom7,
      },
      9: {
        ability: aquaPebblePassive9,
      },
    },
  },
};