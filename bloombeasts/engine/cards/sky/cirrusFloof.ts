/**
 * Cirrus Floof - Support creature with team-wide HP boost
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const cirrusFloofPassive: StructuredAbility = {
  name: 'Lightness',
  description: 'Cirrus Floof cannot be targeted by Bloom Beasts with a Cost of 3 or higher.',
  trigger: 'Passive',
  effects: [
    {
      type: 'cannot-be-targeted',
      target: 'self',
      by: ['high-cost-units'],
      costThreshold: 3,
    },
  ],
};

const cirrusFloofBloom: StructuredAbility = {
  name: 'Cloud Cover',
  description: 'All allied Bloom Beasts gain 1 temporary HP at the start of your turn.',
  trigger: 'StartOfTurn',
  effects: [
    {
      type: 'temporary-hp',
      target: 'all-allies',
      value: 1,
    },
  ],
};

// Level 4 upgrades
const cirrusFloofBloom4: StructuredAbility = {
  name: 'Storm Shield',
  description: 'All allied Bloom Beasts gain 2 temporary HP at start of turn.',
  trigger: 'StartOfTurn',
  effects: [
    {
      type: 'temporary-hp',
      target: 'all-allies',
      value: 2,
    },
  ],
};

// Level 7 upgrades
const cirrusFloofPassive7: StructuredAbility = {
  name: 'Ethereal Form',
  description: 'Cannot be targeted by any Bloom Beast attacks.',
  trigger: 'Passive',
  effects: [
    {
      type: 'cannot-be-targeted',
      target: 'self',
      by: ['attacks'],
    },
  ],
};

// Level 9 upgrades
const cirrusFloofPassive9: StructuredAbility = {
  name: 'Celestial Protector',
  description: 'Cannot be targeted by anything. Reduce all damage to allies by 1.',
  trigger: 'Passive',
  effects: [
    {
      type: 'cannot-be-targeted',
      target: 'self',
      by: ['all'],
    },
    {
      type: 'damage-reduction',
      target: 'all-allies',
      value: 1,
      duration: 'while-on-field',
    },
  ],
};

const cirrusFloofBloom9: StructuredAbility = {
  name: 'Divine Barrier',
  description: 'All allied Bloom Beasts gain 3 temporary HP and immunity to negative effects this turn.',
  trigger: 'StartOfTurn',
  effects: [
    {
      type: 'temporary-hp',
      target: 'all-allies',
      value: 3,
    },
    {
      type: 'immunity',
      target: 'all-allies',
      immuneTo: ['negative-effects'],
      duration: 'this-turn',
    },
  ],
};

export const CIRRUS_FLOOF: BloomBeastCard = {
  id: 'cirrus-floof',
  name: 'Cirrus Floof',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 2,
  baseAttack: 1,
  baseHealth: 6,
  passiveAbility: cirrusFloofPassive,
  bloomAbility: cirrusFloofBloom,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 3, atk: 0 },
      3: { hp: 5, atk: 0 },
      4: { hp: 7, atk: 1 },
      5: { hp: 10, atk: 1 },
      6: { hp: 12, atk: 2 },
      7: { hp: 14, atk: 3 },
      8: { hp: 17, atk: 3 },
      9: { hp: 20, atk: 4 },
    },
    abilityUpgrades: {
      4: {
        bloomAbility: cirrusFloofBloom4,
      },
      7: {
        passiveAbility: cirrusFloofPassive7,
      },
      9: {
        passiveAbility: cirrusFloofPassive9,
        bloomAbility: cirrusFloofBloom9,
      },
    },
  },
};