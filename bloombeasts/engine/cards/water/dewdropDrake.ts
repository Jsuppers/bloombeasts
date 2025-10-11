/**
 * Dewdrop Drake - Protected finisher with direct damage
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, EffectDuration, ConditionType, Comparison, CostType } from '../../types/abilities';

const dewdropDrakePassive: StructuredAbility = {
  name: 'Mist Screen',
  description: "Opponent's Bloom Beasts can only attack Dewdrop Drake if it is the only beast on the field.",
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'attack-first',
      condition: {
        type: ConditionType.UnitsOnField,
        value: 1,
        comparison: Comparison.Equal,
      },
    },
  ],
};

const dewdropDrakeBloom: StructuredAbility = {
  name: 'Torrent',
  description: "You may pay 1 Nectar to deal 2 damage to the opponent's Gardener when Dewdrop Drake attacks.",
  trigger: AbilityTrigger.OnAttack,
  cost: {
    type: CostType.Nectar,
    value: 1,
  },
  effects: [
    {
      type: EffectType.DealDamage,
      target: AbilityTarget.OpponentGardener,
      value: 2,
    },
  ],
};

// Level 4 upgrades
const dewdropDrakeBloom4: StructuredAbility = {
  name: 'Deluge',
  description: "Pay 1 Nectar to deal 3 damage to opponent Gardener when attacking.",
  trigger: AbilityTrigger.OnAttack,
  cost: {
    type: CostType.Nectar,
    value: 1,
  },
  effects: [
    {
      type: EffectType.DealDamage,
      target: AbilityTarget.OpponentGardener,
      value: 3,
    },
  ],
};

// Level 7 upgrades
const dewdropDrakePassive7: StructuredAbility = {
  name: 'Fog Veil',
  description: 'Opponents must attack Dewdrop Drake first. Reduce all damage taken by 1.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'attack-first',
    },
    {
      type: EffectType.DamageReduction,
      target: AbilityTarget.Self,
      value: 1,
      duration: EffectDuration.WhileOnField,
    },
  ],
};

// Level 9 upgrades
const dewdropDrakePassive9: StructuredAbility = {
  name: 'Storm Guardian',
  description: 'All opponents must attack Dewdrop Drake first. Reduce all damage by 2.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'attack-first',
    },
    {
      type: EffectType.DamageReduction,
      target: AbilityTarget.Self,
      value: 2,
      duration: EffectDuration.WhileOnField,
    },
  ],
};

const dewdropDrakeBloom9: StructuredAbility = {
  name: 'Maelstrom',
  description: "When attacking, deal 5 damage to opponent Gardener and freeze one opponent Bloom Beast.",
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.DealDamage,
      target: AbilityTarget.OpponentGardener,
      value: 5,
    },
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.RandomEnemy,
      counter: 'Freeze',
      value: 1,
    },
  ],
};

export const DEWDROP_DRAKE: BloomBeastCard = {
  id: 'dewdrop-drake',
  name: 'Dewdrop Drake',
  type: 'Bloom',
  affinity: 'Water',
  cost: 3,
  baseAttack: 3,
  baseHealth: 6,
  ability: dewdropDrakePassive,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 1, atk: 1 },
      3: { hp: 2, atk: 2 },
      4: { hp: 4, atk: 3 },
      5: { hp: 6, atk: 4 },
      6: { hp: 8, atk: 5 },
      7: { hp: 10, atk: 6 },
      8: { hp: 12, atk: 7 },
      9: { hp: 14, atk: 8 },
    },
    abilityUpgrades: {
      4: {
        ability: dewdropDrakeBloom4,
      },
      7: {
        ability: dewdropDrakePassive7,
      },
      9: {
        ability: dewdropDrakePassive9,
      },
    },
  },
};