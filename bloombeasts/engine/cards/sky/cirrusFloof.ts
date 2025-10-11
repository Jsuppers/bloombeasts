/**
 * Cirrus Floof - Support creature with team-wide HP boost
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, EffectDuration, ImmunityType } from '../../types/abilities';

const cirrusFloofPassive: StructuredAbility = {
  name: 'Lightness',
  description: 'Cirrus Floof cannot be targeted by Bloom Beasts with a Cost of 3 or higher.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.CannotBeTargeted,
      target: AbilityTarget.Self,
      by: ['high-cost-units'],
      costThreshold: 3,
    },
  ],
};

const cirrusFloofBloom: StructuredAbility = {
  name: 'Cloud Cover',
  description: 'All allied Bloom Beasts gain 1 temporary HP at the start of your turn.',
  trigger: AbilityTrigger.StartOfTurn,
  effects: [
    {
      type: EffectType.TemporaryHP,
      target: AbilityTarget.AllAllies,
      value: 1,
    },
  ],
};

// Level 4 upgrades
const cirrusFloofBloom4: StructuredAbility = {
  name: 'Storm Shield',
  description: 'All allied Bloom Beasts gain 2 temporary HP at start of turn.',
  trigger: AbilityTrigger.StartOfTurn,
  effects: [
    {
      type: EffectType.TemporaryHP,
      target: AbilityTarget.AllAllies,
      value: 2,
    },
  ],
};

// Level 7 upgrades
const cirrusFloofPassive7: StructuredAbility = {
  name: 'Ethereal Form',
  description: 'Cannot be targeted by any Bloom Beast attacks.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.CannotBeTargeted,
      target: AbilityTarget.Self,
      by: ['attacks'],
    },
  ],
};

// Level 9 upgrades
const cirrusFloofPassive9: StructuredAbility = {
  name: 'Celestial Protector',
  description: 'Cannot be targeted by anything. Reduce all damage to allies by 1.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.CannotBeTargeted,
      target: AbilityTarget.Self,
      by: ['all'],
    },
    {
      type: EffectType.DamageReduction,
      target: AbilityTarget.AllAllies,
      value: 1,
      duration: EffectDuration.WhileOnField,
    },
  ],
};

const cirrusFloofBloom9: StructuredAbility = {
  name: 'Divine Barrier',
  description: 'All allied Bloom Beasts gain 3 temporary HP and immunity to negative effects this turn.',
  trigger: AbilityTrigger.StartOfTurn,
  effects: [
    {
      type: EffectType.TemporaryHP,
      target: AbilityTarget.AllAllies,
      value: 3,
    },
    {
      type: EffectType.Immunity,
      target: AbilityTarget.AllAllies,
      immuneTo: [ImmunityType.NegativeEffects],
      duration: EffectDuration.ThisTurn,
    },
  ],
};

export const CIRRUS_FLOOF: BloomBeastCard = {
  id: 'cirrus-floof',
  name: 'Cirrus Floof',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 2,
  baseAttack: 1,
  baseHealth: 6,
  ability: cirrusFloofPassive,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 3, atk: 0 },
      3: { hp: 5, atk: 0 },
      4: { hp: 7, atk: 1 },
      5: { hp: 10, atk: 1 },
      6: { hp: 12, atk: 2 },
      7: { hp: 14, atk: 3 },
      8: { hp: 17, atk: 3 },
      9: { hp: 20, atk: 4 },
    },
    abilityUpgrades: {
      4: {
        ability: cirrusFloofBloom4,
      },
      7: {
        ability: cirrusFloofPassive7,
      },
      9: {
        ability: cirrusFloofPassive9,
      },
    },
  },
};