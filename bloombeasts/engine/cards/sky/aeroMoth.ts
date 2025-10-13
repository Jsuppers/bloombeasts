/**
 * Aero-Moth - Card draw with positioning manipulation
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration } from '../../types/abilities';

const aeroMothPassive: StructuredAbility = {
  name: 'Wing Flutter',
  description: 'When Aero-Moth is summoned, draw one card.',
  trigger: AbilityTrigger.OnSummon,
  effects: [
    {
      type: EffectType.DrawCards,
      target: AbilityTarget.PlayerGardener,
      value: 1,
    },
  ],
};

const aeroMothBloom: StructuredAbility = {
  name: 'Gust',
  description: "When Aero-Moth attacks, swap the position of two opponent's Bloom Beasts.",
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.SwapPositions,
      target: AbilityTarget.AllEnemies,
    },
  ],
};

// Level 4 upgrades
const aeroMothPassive4: StructuredAbility = {
  name: 'Hypnotic Wings',
  description: 'When summoned, draw 2 cards.',
  trigger: AbilityTrigger.OnSummon,
  effects: [
    {
      type: EffectType.DrawCards,
      target: AbilityTarget.PlayerGardener,
      value: 2,
    },
  ],
};

// Level 7 upgrades
const aeroMothBloom7: StructuredAbility = {
  name: 'Cyclone',
  description: 'When attacking, rearrange all opponent Bloom Beasts in any order.',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.SwapPositions,
      target: AbilityTarget.AllEnemies,
    },
  ],
};

// Level 9 upgrades
const aeroMothPassive9: StructuredAbility = {
  name: 'Rainbow Cascade',
  description: 'When summoned, draw 3 cards and all allies gain +1/+1.',
  trigger: AbilityTrigger.OnSummon,
  effects: [
    {
      type: EffectType.DrawCards,
      target: AbilityTarget.PlayerGardener,
      value: 3,
    },
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AllAllies,
      stat: StatType.Attack,
      value: 1,
      duration: EffectDuration.Permanent,
    },
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AllAllies,
      stat: StatType.Health,
      value: 1,
      duration: EffectDuration.Permanent,
    },
  ],
};

const aeroMothBloom9: StructuredAbility = {
  name: 'Chaos Storm',
  description: 'When attacking, rearrange opponent Beasts, return one to hand, and draw 2 cards.',
  trigger: AbilityTrigger.OnAttack,
  effects: [
    {
      type: EffectType.SwapPositions,
      target: AbilityTarget.AllEnemies,
    },
    {
      type: EffectType.ReturnToHand,
      target: AbilityTarget.RandomEnemy,
      value: 1,
    },
    {
      type: EffectType.DrawCards,
      target: AbilityTarget.PlayerGardener,
      value: 2,
    },
  ],
};

export const AERO_MOTH: BloomBeastCard = {
  id: 'aero-moth',
  name: 'Aero Moth',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 2,
  baseAttack: 3,
  baseHealth: 3,
  ability: aeroMothPassive,
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
        ability: aeroMothPassive4,
      },
      7: {
        ability: aeroMothBloom7,
      },
      9: {
        ability: aeroMothPassive9,
      },
    },
  },
};