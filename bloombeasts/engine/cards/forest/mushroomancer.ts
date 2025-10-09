/**
 * Mushroomancer - AOE debuffer with self-heal
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const mushroomancerPassive: StructuredAbility = {
  name: 'Fungal Cloud',
  description: 'When Summoned, give all adjacent Bloom Beasts -1 ATK until the start of your next turn.',
  trigger: 'OnSummon',
  effects: [
    {
      type: 'modify-stats',
      target: 'adjacent-enemies',
      stat: 'attack',
      value: -1,
      duration: 'start-of-next-turn',
    },
  ],
};

const mushroomancerBloom: StructuredAbility = {
  name: 'Life Spore',
  description: 'Remove 1 Spore counter from the Habitat Card to heal Mushroomancer by 2 HP.',
  trigger: 'Activated',
  cost: {
    type: 'remove-counter',
    counter: 'Spore',
    value: 1,
  },
  effects: [
    {
      type: 'heal',
      target: 'self',
      value: 2,
    },
  ],
};

// Level 4 upgrades
const mushroomancerPassive4: StructuredAbility = {
  name: 'Toxic Spores',
  description: 'When Summoned, give all adjacent Bloom Beasts -2 ATK until the start of your next turn.',
  trigger: 'OnSummon',
  effects: [
    {
      type: 'modify-stats',
      target: 'adjacent-enemies',
      stat: 'attack',
      value: -2,
      duration: 'start-of-next-turn',
    },
  ],
};

// Level 7 upgrades
const mushroomancerBloom7: StructuredAbility = {
  name: 'Greater Life Spore',
  description: 'Remove 1 Spore counter from the Habitat Card to heal Mushroomancer by 3 HP.',
  trigger: 'Activated',
  cost: {
    type: 'remove-counter',
    counter: 'Spore',
    value: 1,
  },
  effects: [
    {
      type: 'heal',
      target: 'self',
      value: 3,
    },
  ],
};

// Level 9 upgrades
const mushroomancerPassive9: StructuredAbility = {
  name: 'Parasitic Bloom',
  description: 'When Summoned, give all opponent Bloom Beasts -2 ATK permanently.',
  trigger: 'OnSummon',
  effects: [
    {
      type: 'modify-stats',
      target: 'all-enemies',
      stat: 'attack',
      value: -2,
      duration: 'permanent',
    },
  ],
};

const mushroomancerBloom9: StructuredAbility = {
  name: 'Spore Regeneration',
  description: 'Remove 1 Spore counter to fully heal Mushroomancer and gain +1 ATK permanently.',
  trigger: 'Activated',
  cost: {
    type: 'remove-counter',
    counter: 'Spore',
    value: 1,
  },
  effects: [
    {
      type: 'heal',
      target: 'self',
      value: 'full',
    },
    {
      type: 'modify-stats',
      target: 'self',
      stat: 'attack',
      value: 1,
      duration: 'permanent',
    },
  ],
};

export const MUSHROOMANCER: BloomBeastCard = {
  id: 'mushroomancer',
  name: 'Mushroomancer',
  type: 'Bloom',
  affinity: 'Forest',
  cost: 3,
  baseAttack: 3,
  baseHealth: 5,
  passiveAbility: mushroomancerPassive,
  bloomAbility: mushroomancerBloom,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 2, atk: 0 },
      3: { hp: 3, atk: 1 },
      4: { hp: 4, atk: 2 },
      5: { hp: 6, atk: 3 },
      6: { hp: 8, atk: 4 },
      7: { hp: 10, atk: 5 },
      8: { hp: 12, atk: 6 },
      9: { hp: 14, atk: 7 },
    },
    abilityUpgrades: {
      4: {
        passiveAbility: mushroomancerPassive4,
      },
      7: {
        bloomAbility: mushroomancerBloom7,
      },
      9: {
        passiveAbility: mushroomancerPassive9,
        bloomAbility: mushroomancerBloom9,
      },
    },
  },
};