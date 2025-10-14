/**
 * Rootling - Small, protected creature with resource generation
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, ResourceType } from '../../types/abilities';

const rootlingPassive: StructuredAbility = {
  name: 'Deep Roots',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.CannotBeTargeted,
      target: AbilityTarget.Self,
      by: ['magic'],
    },
  ],
};

const rootlingBloom: StructuredAbility = {
  name: 'Nourish',
  trigger: AbilityTrigger.OnDestroy,
  effects: [
    {
      type: EffectType.GainResource,
      target: AbilityTarget.PlayerGardener,
      resource: ResourceType.Nectar,
      value: 1,
    },
  ],
};

// Level 4 upgrades
const rootlingBloom4: StructuredAbility = {
  name: 'Abundant Nourish',
  trigger: AbilityTrigger.OnDestroy,
  effects: [
    {
      type: EffectType.GainResource,
      target: AbilityTarget.PlayerGardener,
      resource: ResourceType.Nectar,
      value: 2,
    },
  ],
};

// Level 7 upgrades
const rootlingPassive7: StructuredAbility = {
  name: 'Ancient Roots',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.CannotBeTargeted,
      target: AbilityTarget.Self,
      by: ['magic', 'trap'],
    },
  ],
};

// Level 9 upgrades
const rootlingPassive9: StructuredAbility = {
  name: 'Eternal Roots',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.CannotBeTargeted,
      target: AbilityTarget.Self,
      by: ['magic', 'trap', 'abilities'],
    },
  ],
};

const rootlingBloom9: StructuredAbility = {
  name: 'Harvest Feast',
  trigger: AbilityTrigger.OnDestroy,
  effects: [
    {
      type: EffectType.GainResource,
      target: AbilityTarget.PlayerGardener,
      resource: ResourceType.Nectar,
      value: 2,
    },
    {
      type: EffectType.DrawCards,
      target: AbilityTarget.PlayerGardener,
      value: 1,
    },
  ],
};

export const ROOTLING: BloomBeastCard = {
  id: 'rootling',
  name: 'Rootling',
  type: 'Bloom',
  affinity: 'Forest',
  cost: 1,
  baseAttack: 1,
  baseHealth: 3,
  ability: rootlingPassive,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 1, atk: 0 },
      3: { hp: 2, atk: 1 },
      4: { hp: 3, atk: 2 },
      5: { hp: 4, atk: 3 },
      6: { hp: 5, atk: 4 },
      7: { hp: 6, atk: 5 },
      8: { hp: 7, atk: 6 },
      9: { hp: 8, atk: 7 },
    },
    abilityUpgrades: {
      4: {
        ability: rootlingBloom4,
      },
      7: {
        ability: rootlingPassive7,
      },
      9: {
        ability: rootlingPassive9,
      },
    },
  },
};