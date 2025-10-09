/**
 * Aqua-Pebble - Synergy attacker with healing
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const aquaPebblePassive: StructuredAbility = {
  name: 'Tide Flow',
  description: 'When you summon another Water Affinity Bloom Beast, Aqua-Pebble gains +1 ATK until the end of the turn.',
  trigger: 'OnSummon',
  effects: [
    {
      type: 'modify-stats',
      target: 'self',
      stat: 'attack',
      value: 1,
      duration: 'end-of-turn',
      condition: {
        type: 'affinity-matches',
        value: 'Water',
      },
    },
  ],
};

const aquaPebbleBloom: StructuredAbility = {
  name: 'Hydration',
  description: 'At the end of your turn, heal any other allied Bloom Beast by 1 HP.',
  trigger: 'EndOfTurn',
  effects: [
    {
      type: 'heal',
      target: 'other-ally',
      value: 1,
    },
  ],
};

// Level 4 upgrades
const aquaPebblePassive4: StructuredAbility = {
  name: 'Tidal Surge',
  description: 'When you summon another Water Beast, gain +2 ATK until end of turn.',
  trigger: 'OnSummon',
  effects: [
    {
      type: 'modify-stats',
      target: 'self',
      stat: 'attack',
      value: 2,
      duration: 'end-of-turn',
      condition: {
        type: 'affinity-matches',
        value: 'Water',
      },
    },
  ],
};

// Level 7 upgrades
const aquaPebbleBloom7: StructuredAbility = {
  name: 'Rejuvenation',
  description: 'At end of turn, heal all allied Bloom Beasts by 2 HP.',
  trigger: 'EndOfTurn',
  effects: [
    {
      type: 'heal',
      target: 'all-allies',
      value: 2,
    },
  ],
};

// Level 9 upgrades
const aquaPebblePassive9: StructuredAbility = {
  name: 'Tsunami Force',
  description: 'When you summon another Water Beast, gain +3 ATK permanently.',
  trigger: 'OnSummon',
  effects: [
    {
      type: 'modify-stats',
      target: 'self',
      stat: 'attack',
      value: 3,
      duration: 'permanent',
      condition: {
        type: 'affinity-matches',
        value: 'Water',
      },
    },
  ],
};

const aquaPebbleBloom9: StructuredAbility = {
  name: 'Fountain of Life',
  description: 'At end of turn, fully heal all allied Bloom Beasts.',
  trigger: 'EndOfTurn',
  effects: [
    {
      type: 'heal',
      target: 'all-allies',
      value: 'full',
    },
  ],
};

export const AQUA_PEBBLE: BloomBeastCard = {
  id: 'aqua-pebble',
  name: 'Aqua-Pebble',
  type: 'Bloom',
  affinity: 'Water',
  cost: 1,
  baseAttack: 1,
  baseHealth: 4,
  passiveAbility: aquaPebblePassive,
  bloomAbility: aquaPebbleBloom,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 1, atk: 0 },
      3: { hp: 3, atk: 0 },
      4: { hp: 4, atk: 1 },
      5: { hp: 6, atk: 2 },
      6: { hp: 7, atk: 3 },
      7: { hp: 9, atk: 4 },
      8: { hp: 10, atk: 5 },
      9: { hp: 12, atk: 6 },
    },
    abilityUpgrades: {
      4: {
        passiveAbility: aquaPebblePassive4,
      },
      7: {
        bloomAbility: aquaPebbleBloom7,
      },
      9: {
        passiveAbility: aquaPebblePassive9,
        bloomAbility: aquaPebbleBloom9,
      },
    },
  },
};