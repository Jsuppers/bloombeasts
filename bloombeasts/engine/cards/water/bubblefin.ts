/**
 * Bubblefin - Protected defender with attack reduction
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration } from '../../types/abilities';
import { CardBuilder } from '../CardBuilder';

const bubblefinPassive: StructuredAbility = {
  name: 'Emerge',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.CannotBeTargeted,
      target: AbilityTarget.Self,
      by: ['trap'],
    },
  ],
};

const bubblefinBloom: StructuredAbility = {
  name: 'Dampen',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.Attacker,
      stat: StatType.Attack,
      value: -1,
      duration: EffectDuration.EndOfTurn,
    },
  ],
};

// Level 4 upgrades
const bubblefinBloom4: StructuredAbility = {
  name: 'Tidal Shield',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.Attacker,
      stat: StatType.Attack,
      value: -2,
      duration: EffectDuration.EndOfTurn,
    },
  ],
};

// Level 7 upgrades
const bubblefinPassive7: StructuredAbility = {
  name: 'Deep Dive',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.CannotBeTargeted,
      target: AbilityTarget.Self,
      by: ['trap', 'magic'],
    },
  ],
};

// Level 9 upgrades
const bubblefinPassive9: StructuredAbility = {
  name: 'Ocean Sanctuary',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.CannotBeTargeted,
      target: AbilityTarget.Self,
      by: ['magic', 'trap', 'abilities'],
    },
  ],
};

const bubblefinBloom9: StructuredAbility = {
  name: 'Crushing Depths',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.Attacker,
      stat: StatType.Attack,
      value: -3,
      duration: EffectDuration.Permanent,
    },
    {
      type: EffectType.Heal,
      target: AbilityTarget.Self,
      value: 2,
    },
  ],
};

export const BUBBLEFIN: BloomBeastCard = CardBuilder.bloomBeast('bubblefin', 'Bubblefin')
  .affinity('Water')
  .cost(2)
  .stats(2, 5)
  .abilities([bubblefinPassive])
  .leveling({
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 2, atk: 0 },
      3: { hp: 4, atk: 0 },
      4: { hp: 6, atk: 1 },
      5: { hp: 8, atk: 2 },
      6: { hp: 10, atk: 3 },
      7: { hp: 12, atk: 4 },
      8: { hp: 14, atk: 5 },
      9: { hp: 16, atk: 6 },
    },
    abilityUpgrades: {
      4: {
        abilities: [bubblefinBloom4],
      },
      7: {
        abilities: [bubblefinPassive7],
      },
      9: {
        abilities: [bubblefinPassive9],
      },
    },
  })
  .build();