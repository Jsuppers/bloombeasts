/**
 * Fuzzlet - Defensive tank with spore mechanics
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const fuzzletPassive: StructuredAbility = {
  name: 'Spores of Defense',
  description: 'When Fuzzlet takes damage, place a "Spore" counter on the Habitat Card.',
  trigger: 'OnDamage',
  effects: [
    {
      type: 'apply-counter',
      target: 'self',
      counter: 'Spore',
      value: 1,
    },
  ],
};

const fuzzletBloom: StructuredAbility = {
  name: 'Rapid Growth',
  description: 'At the start of your turn, Fuzzlet gains +1 Health for every 2 Spore counters on the Habitat Card.',
  trigger: 'StartOfTurn',
  effects: [
    {
      type: 'heal',
      target: 'self',
      value: 1, // TODO: Needs calculation based on Spore counters / 2
    },
  ],
};

// Level 4 upgrades
const fuzzletPassive4: StructuredAbility = {
  name: 'Spore Burst',
  description: 'When Fuzzlet takes damage, place 2 "Spore" counters on the Habitat Card.',
  trigger: 'OnDamage',
  effects: [
    {
      type: 'apply-counter',
      target: 'self',
      counter: 'Spore',
      value: 2,
    },
  ],
};

// Level 7 upgrades
const fuzzletBloom7: StructuredAbility = {
  name: 'Accelerated Growth',
  description: 'At the start of your turn, Fuzzlet gains +2 Health for every 2 Spore counters on the Habitat Card.',
  trigger: 'StartOfTurn',
  effects: [
    {
      type: 'heal',
      target: 'self',
      value: 2, // TODO: Needs calculation based on Spore counters / 2
    },
  ],
};

// Level 9 upgrades
const fuzzletPassive9: StructuredAbility = {
  name: 'Spore Dominance',
  description: 'When Fuzzlet takes damage, place 2 "Spore" counters on the Habitat Card and heal 1 HP.',
  trigger: 'OnDamage',
  effects: [
    {
      type: 'apply-counter',
      target: 'self',
      counter: 'Spore',
      value: 2,
    },
    {
      type: 'heal',
      target: 'self',
      value: 1,
    },
  ],
};

const fuzzletBloom9: StructuredAbility = {
  name: 'Maximum Bloom',
  description: 'At the start of your turn, Fuzzlet gains +3 Health for every 2 Spore counters. Adjacent allies gain +1 HP.',
  trigger: 'StartOfTurn',
  effects: [
    {
      type: 'heal',
      target: 'self',
      value: 3, // TODO: Needs calculation based on Spore counters / 2
    },
    {
      type: 'heal',
      target: 'adjacent-allies',
      value: 1,
    },
  ],
};

export const FUZZLET: BloomBeastCard = {
  id: 'fuzzlet',
  name: 'Fuzzlet',
  type: 'Bloom',
  affinity: 'Forest',
  cost: 2,
  baseAttack: 2,
  baseHealth: 4,
  passiveAbility: fuzzletPassive,
  bloomAbility: fuzzletBloom,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 2, atk: 0 },
      3: { hp: 3, atk: 1 },
      4: { hp: 5, atk: 2 },
      5: { hp: 7, atk: 3 },
      6: { hp: 9, atk: 4 },
      7: { hp: 11, atk: 5 },
      8: { hp: 13, atk: 6 },
      9: { hp: 15, atk: 7 },
    },
    abilityUpgrades: {
      4: {
        passiveAbility: fuzzletPassive4,
      },
      7: {
        bloomAbility: fuzzletBloom7,
      },
      9: {
        passiveAbility: fuzzletPassive9,
        bloomAbility: fuzzletBloom9,
      },
    },
  },
};