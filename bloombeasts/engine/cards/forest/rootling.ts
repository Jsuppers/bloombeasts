/**
 * Rootling - Small, protected creature with resource generation
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const rootlingPassive: StructuredAbility = {
  name: 'Deep Roots',
  description: 'This Bloom Beast cannot be targeted by Magic Cards.',
  trigger: 'Passive',
  effects: [
    {
      type: 'cannot-be-targeted',
      target: 'self',
      by: ['magic'],
    },
  ],
};

const rootlingBloom: StructuredAbility = {
  name: 'Nourish',
  description: 'When Rootling destroys a Bloom Beast, immediately gain +1 Nectar.',
  trigger: 'OnDestroy',
  effects: [
    {
      type: 'gain-resource',
      target: 'player-gardener',
      resource: 'nectar',
      value: 1,
    },
  ],
};

// Level 4 upgrades
const rootlingBloom4: StructuredAbility = {
  name: 'Abundant Nourish',
  description: 'When Rootling destroys a Bloom Beast, gain +2 Nectar.',
  trigger: 'OnDestroy',
  effects: [
    {
      type: 'gain-resource',
      target: 'player-gardener',
      resource: 'nectar',
      value: 2,
    },
  ],
};

// Level 7 upgrades
const rootlingPassive7: StructuredAbility = {
  name: 'Ancient Roots',
  description: 'Cannot be targeted by Magic Cards or Trap Cards.',
  trigger: 'Passive',
  effects: [
    {
      type: 'cannot-be-targeted',
      target: 'self',
      by: ['magic', 'trap'],
    },
  ],
};

// Level 9 upgrades
const rootlingPassive9: StructuredAbility = {
  name: 'Eternal Roots',
  description: 'Cannot be targeted by Magic, Trap, or opponent Bloom abilities.',
  trigger: 'Passive',
  effects: [
    {
      type: 'cannot-be-targeted',
      target: 'self',
      by: ['magic', 'trap', 'abilities'],
    },
  ],
};

const rootlingBloom9: StructuredAbility = {
  name: 'Harvest Feast',
  description: 'When Rootling destroys a Bloom Beast, gain +2 Nectar and draw 1 card.',
  trigger: 'OnDestroy',
  effects: [
    {
      type: 'gain-resource',
      target: 'player-gardener',
      resource: 'nectar',
      value: 2,
    },
    {
      type: 'draw-cards',
      target: 'player-gardener',
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
  passiveAbility: rootlingPassive,
  bloomAbility: rootlingBloom,
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
        bloomAbility: rootlingBloom4,
      },
      7: {
        passiveAbility: rootlingPassive7,
      },
      9: {
        passiveAbility: rootlingPassive9,
        bloomAbility: rootlingBloom9,
      },
    },
  },
};