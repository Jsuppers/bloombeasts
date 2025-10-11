/**
 * Bubblefin - Protected defender with attack reduction
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration } from '../../types/abilities';

const bubblefinPassive: StructuredAbility = {
  name: 'Emerge',
  description: 'Bubblefin cannot be targeted by a Trap Card.',
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
  description: "When Bubblefin is attacked, reduce the attacker's ATK by 1 until the end of the turn.",
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
  description: "When attacked, reduce attacker's ATK by 2 until end of turn.",
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
  description: 'Cannot be targeted by Trap Cards or Magic Cards.',
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
  description: 'Cannot be targeted by any opponent cards or abilities.',
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
  description: "When attacked, reduce attacker's ATK by 3 permanently and heal self by 2 HP.",
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

export const BUBBLEFIN: BloomBeastCard = {
  id: 'bubblefin',
  name: 'Bubblefin',
  type: 'Bloom',
  affinity: 'Water',
  cost: 2,
  baseAttack: 2,
  baseHealth: 5,
  ability: bubblefinPassive,
  levelingConfig: {
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
        ability: bubblefinBloom4,
      },
      7: {
        ability: bubblefinPassive7,
      },
      9: {
        ability: bubblefinPassive9,
      },
    },
  },
};