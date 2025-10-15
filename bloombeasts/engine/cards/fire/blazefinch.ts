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
import { CardBuilder } from '../CardBuilder';

const blazefinchPassive: StructuredAbility = {
  name: 'Quick Strike',
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

export const BLAZEFINCH: BloomBeastCard = CardBuilder.bloomBeast('blazefinch', 'Blazefinch')
  .affinity('Fire')
  .cost(1)
  .stats(1, 2)
  .abilities([blazefinchPassive])
  .leveling({
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
        abilities: [blazefinchBloom4],
      },
      7: {
        abilities: [blazefinchPassive7],
      },
      9: {
        abilities: [blazefinchPassive9],
      },
    },
  })
  .build();