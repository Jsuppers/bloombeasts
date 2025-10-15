/**
 * Kelp Cub - Control creature with immobilization
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, EffectDuration, ImmunityType } from '../../types/abilities';

const kelpCubPassive: StructuredAbility = {
  name: 'Entangle',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.PreventAttack,
      target: AbilityTarget.Target,
      duration: EffectDuration.StartOfNextTurn,
    },
  ],
};

const kelpCubBloom: StructuredAbility = {
  name: 'Anchor',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.Immunity,
      target: AbilityTarget.Self,
      immuneTo: [ImmunityType.Magic, ImmunityType.Trap],
      duration: EffectDuration.WhileOnField,
    },
  ],
};

// Level 4 upgrades
const kelpCubPassive4: StructuredAbility = {
  name: 'Binding Vines',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.PreventAttack,
      target: AbilityTarget.Target,
      duration: EffectDuration.StartOfNextTurn,
    },
    {
      type: EffectType.PreventAbilities,
      target: AbilityTarget.Target,
      duration: EffectDuration.StartOfNextTurn,
    },
  ],
};

// Level 7 upgrades
const kelpCubBloom7: StructuredAbility = {
  name: 'Deep Anchor',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.Immunity,
      target: AbilityTarget.Self,
      immuneTo: [ImmunityType.Magic, ImmunityType.Trap, ImmunityType.Abilities],
      duration: EffectDuration.WhileOnField,
    },
  ],
};

// Level 9 upgrades
const kelpCubPassive9: StructuredAbility = {
  name: 'Strangling Grasp',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.PreventAttack,
      target: AbilityTarget.Target,
      duration: EffectDuration.Permanent,
    },
    {
      type: EffectType.PreventAbilities,
      target: AbilityTarget.Target,
      duration: EffectDuration.Permanent,
    },
  ],
};

const kelpCubBloom9: StructuredAbility = {
  name: 'Immovable Force',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.Immunity,
      target: AbilityTarget.Self,
      immuneTo: [ImmunityType.Damage, ImmunityType.Targeting, ImmunityType.NegativeEffects],
      duration: EffectDuration.WhileOnField,
    },
    {
      type: EffectType.Retaliation,
      target: AbilityTarget.Self,
      value: 0,
      applyCounter: 'Entangle',
      counterValue: 1,
    },
  ],
};

export const KELP_CUB: BloomBeastCard = {
  id: 'kelp-cub',
  name: 'Kelp Cub',
  type: 'Bloom',
  affinity: 'Water',
  cost: 2,
  baseAttack: 3,
  baseHealth: 3,
  abilities: [kelpCubPassive],
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 1, atk: 1 },
      3: { hp: 2, atk: 2 },
      4: { hp: 3, atk: 3 },
      5: { hp: 4, atk: 4 },
      6: { hp: 5, atk: 5 },
      7: { hp: 6, atk: 6 },
      8: { hp: 7, atk: 7 },
      9: { hp: 8, atk: 8 },
    },
    abilityUpgrades: {
      4: {
        abilities: [kelpCubPassive4],
      },
      7: {
        abilities: [kelpCubBloom7],
      },
      9: {
        abilities: [kelpCubPassive9],
      },
    },
  },
};