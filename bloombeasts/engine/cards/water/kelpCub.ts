/**
 * Kelp Cub - Control creature with immobilization
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, EffectDuration, ImmunityType } from '../../types/abilities';

const kelpCubPassive: StructuredAbility = {
  name: 'Entangle',
  description: 'When Kelp Cub attacks, the target Bloom Beast cannot attack next turn.',
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
  description: "Kelp Cub cannot be returned to the hand or deck by an opponent's card effect.",
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
  description: 'When attacking, target cannot attack or use abilities next turn.',
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
  description: 'Cannot be affected by any opponent card effects.',
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
  description: 'When attacking, permanently disable target Bloom Beast (it cannot attack or use abilities).',
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
  description: 'Cannot be affected by anything. When attacked, entangle the attacker permanently.',
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
  ability: kelpCubPassive,
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
        ability: kelpCubPassive4,
      },
      7: {
        ability: kelpCubBloom7,
      },
      9: {
        ability: kelpCubPassive9,
      },
    },
  },
};