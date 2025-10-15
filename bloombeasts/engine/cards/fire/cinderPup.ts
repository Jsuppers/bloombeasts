/**
 * Cinder Pup - Burn applier with additional burn mechanic
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, CostType } from '../../types/abilities';
import { CardBuilder } from '../CardBuilder';

const cinderPupPassive: StructuredAbility = {
  name: 'Burning Passion',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Target,
      counter: 'Burn',
      value: 1,
    },
  ],
};

const cinderPupBloom: StructuredAbility = {
  name: 'Spitfire',
  trigger: AbilityTrigger.Activated,
  cost: {
    type: CostType.Discard,
    value: 1,
  },
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Target,
      counter: 'Burn',
      value: 1,
    },
  ],
};

// Level 4 upgrades
const cinderPupPassive4: StructuredAbility = {
  name: 'Inferno Bite',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Target,
      counter: 'Burn',
      value: 2,
    },
  ],
};

// Level 7 upgrades
const cinderPupBloom7: StructuredAbility = {
  name: 'Flame Burst',
  trigger: AbilityTrigger.Activated,
  cost: {
    type: CostType.Discard,
    value: 1,
  },
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.AllEnemies,
      counter: 'Burn',
      value: 2,
    },
  ],
};

// Level 9 upgrades
const cinderPupPassive9: StructuredAbility = {
  name: 'Wildfire Aura',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Target,
      counter: 'Burn',
      value: 3,
    },
  ],
};

const cinderPupBloom9: StructuredAbility = {
  name: 'Apocalypse Flame',
  trigger: AbilityTrigger.Activated,
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.AllEnemies,
      counter: 'Burn',
      value: 3,
    },
    {
      type: EffectType.DealDamage,
      target: AbilityTarget.OpponentGardener,
      value: 2,
    },
  ],
};

export const CINDER_PUP: BloomBeastCard = CardBuilder.bloomBeast('cinder-pup', 'Cinder Pup')
  .affinity('Fire')
  .cost(2)
  .stats(2, 3)
  .abilities([cinderPupPassive])
  .leveling({
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
        abilities: [cinderPupPassive4],
      },
      7: {
        abilities: [cinderPupBloom7],
      },
      9: {
        abilities: [cinderPupPassive9],
      },
    },
  })
  .build();