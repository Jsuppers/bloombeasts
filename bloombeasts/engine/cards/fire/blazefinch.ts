/**
 * Blazefinch - Fast attacker with execute mechanic
 */

import { BloomBeastCard } from '../../types/core';
import {
  StructuredAbility,
  EffectType,
  AbilityTarget,
  AbilityTrigger,
  ConditionType
} from '../../types/abilities';

const blazefinchPassive: StructuredAbility = {
  name: 'Quick Strike',
  description: 'Blazefinch can attack the turn it is summoned.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.RemoveSummoningSickness,
      target: AbilityTarget.Self,
    },
  ],
};

const blazefinchBloom: StructuredAbility = {
  name: 'Incinerate',
  description: 'When Blazefinch attacks a Wilting Bloom Beast, its attack deals double damage.',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'double-damage',
      condition: {
        type: ConditionType.IsWilting,
      },
    },
  ],
};

// Level 4 upgrades
const blazefinchBloom4: StructuredAbility = {
  name: 'Ember Strike',
  description: 'When attacking a damaged Bloom Beast, deal triple damage.',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'triple-damage',
      condition: {
        type: ConditionType.IsDamaged,
      },
    },
  ],
};

// Level 7 upgrades
const blazefinchPassive7: StructuredAbility = {
  name: 'Lightning Speed',
  description: 'Blazefinch can attack twice the turn it is summoned.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.RemoveSummoningSickness,
      target: AbilityTarget.Self,
    },
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'attack-twice',
    },
  ],
};

// Level 9 upgrades
const blazefinchPassive9: StructuredAbility = {
  name: 'Phoenix Form',
  description: 'Blazefinch can attack twice per turn. When destroyed, return to hand.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'attack-twice',
    },
    // Note: Return to hand on death would need a separate OnDestroy trigger
  ],
};

const blazefinchBloom9: StructuredAbility = {
  name: 'Annihilation',
  description: 'When attacking a damaged Bloom Beast, instantly destroy it.',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'instant-destroy',
      condition: {
        type: ConditionType.IsDamaged,
      },
    },
  ],
};

export const BLAZEFINCH: BloomBeastCard = {
  id: 'blazefinch',
  name: 'Blazefinch',
  type: 'Bloom',
  affinity: 'Fire',
  cost: 1,
  baseAttack: 1,
  baseHealth: 2,
  ability: blazefinchPassive,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 0, atk: 1 },
      3: { hp: 0, atk: 3 },
      4: { hp: 1, atk: 5 },
      5: { hp: 1, atk: 6 },
      6: { hp: 2, atk: 8 },
      7: { hp: 2, atk: 9 },
      8: { hp: 3, atk: 11 },
      9: { hp: 3, atk: 13 },
    },
    abilityUpgrades: {
      4: {
        ability: blazefinchBloom4,
      },
      7: {
        ability: blazefinchPassive7,
      },
      9: {
        ability: blazefinchPassive9,
      },
    },
  },
};