/**
 * Cinder Pup - Burn applier with additional burn mechanic
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, CostType } from '../../types/abilities';

const cinderPupPassive: StructuredAbility = {
  name: 'Burning Passion',
  description: 'When Cinder Pup attacks, place a Burn counter (1 damage per turn) on the target Bloom Beast.',
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
  description: "Discard one card to apply an additional Burn counter to any opponent's Bloom Beast.",
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
  description: 'When Cinder Pup attacks, place 2 Burn counters on the target.',
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
  description: "Discard one card to apply 2 Burn counters to all opponent Bloom Beasts.",
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
  description: 'When Cinder Pup attacks, place 3 Burn counters on the target. Burn damage happens immediately.',
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
  description: "Apply 3 Burn counters to all opponent Bloom Beasts and deal 2 damage to opponent Gardener.",
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

export const CINDER_PUP: BloomBeastCard = {
  id: 'cinder-pup',
  name: 'Cinder Pup',
  type: 'Bloom',
  affinity: 'Fire',
  cost: 2,
  baseAttack: 2,
  baseHealth: 3,
  ability: cinderPupPassive,
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
        ability: cinderPupPassive4,
      },
      7: {
        ability: cinderPupBloom7,
      },
      9: {
        ability: cinderPupPassive9,
      },
    },
  },
};