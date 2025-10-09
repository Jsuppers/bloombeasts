/**
 * Kelp Cub - Control creature with immobilization
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const kelpCubPassive: StructuredAbility = {
  name: 'Entangle',
  description: 'When Kelp Cub attacks, the target Bloom Beast cannot attack next turn.',
  trigger: 'OnAttack',
  effects: [
    {
      type: 'prevent-attack',
      target: 'target',
      duration: 'start-of-next-turn',
    },
  ],
};

const kelpCubBloom: StructuredAbility = {
  name: 'Anchor',
  description: "Kelp Cub cannot be returned to the hand or deck by an opponent's card effect.",
  trigger: 'Passive',
  effects: [
    {
      type: 'immunity',
      target: 'self',
      immuneTo: ['magic', 'trap'],
      duration: 'while-on-field',
    },
  ],
};

// Level 4 upgrades
const kelpCubPassive4: StructuredAbility = {
  name: 'Binding Vines',
  description: 'When attacking, target cannot attack or use abilities next turn.',
  trigger: 'OnAttack',
  effects: [
    {
      type: 'prevent-attack',
      target: 'target',
      duration: 'start-of-next-turn',
    },
    {
      type: 'prevent-abilities',
      target: 'target',
      duration: 'start-of-next-turn',
    },
  ],
};

// Level 7 upgrades
const kelpCubBloom7: StructuredAbility = {
  name: 'Deep Anchor',
  description: 'Cannot be affected by any opponent card effects.',
  trigger: 'Passive',
  effects: [
    {
      type: 'immunity',
      target: 'self',
      immuneTo: ['magic', 'trap', 'bloom-abilities'],
      duration: 'while-on-field',
    },
  ],
};

// Level 9 upgrades
const kelpCubPassive9: StructuredAbility = {
  name: 'Strangling Grasp',
  description: 'When attacking, permanently disable target Bloom Beast (it cannot attack or use abilities).',
  trigger: 'OnAttack',
  effects: [
    {
      type: 'prevent-attack',
      target: 'target',
      duration: 'permanent',
    },
    {
      type: 'prevent-abilities',
      target: 'target',
      duration: 'permanent',
    },
  ],
};

const kelpCubBloom9: StructuredAbility = {
  name: 'Immovable Force',
  description: 'Cannot be affected by anything. When attacked, entangle the attacker permanently.',
  trigger: 'Passive',
  effects: [
    {
      type: 'immunity',
      target: 'self',
      immuneTo: ['damage', 'targeting', 'negative-effects'],
      duration: 'while-on-field',
    },
    {
      type: 'retaliation',
      target: 'self',
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
  passiveAbility: kelpCubPassive,
  bloomAbility: kelpCubBloom,
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
        passiveAbility: kelpCubPassive4,
      },
      7: {
        bloomAbility: kelpCubBloom7,
      },
      9: {
        passiveAbility: kelpCubPassive9,
        bloomAbility: kelpCubBloom9,
      },
    },
  },
};