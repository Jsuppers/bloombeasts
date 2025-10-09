/**
 * Star Bloom - Team buffer with deck search
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const starBloomPassive: StructuredAbility = {
  name: 'Aura',
  description: 'All allied Bloom Beasts gain +1 ATK.',
  trigger: 'Passive',
  effects: [
    {
      type: 'modify-stats',
      target: 'all-allies',
      stat: 'attack',
      value: 1,
      duration: 'while-on-field',
    },
  ],
};

const starBloomBloom: StructuredAbility = {
  name: 'Celestial Alignment',
  description: 'Once per game, during the Main Phase, you may search your deck for one Bloom Card and add it to your hand.',
  trigger: 'Activated',
  maxUsesPerGame: 1,
  effects: [
    {
      type: 'search-deck',
      target: 'player-gardener',
      searchFor: 'bloom',
      quantity: 1,
    },
  ],
};

// Level 4 upgrades
const starBloomPassive4: StructuredAbility = {
  name: 'Radiant Aura',
  description: 'All allied Bloom Beasts gain +2 ATK.',
  trigger: 'Passive',
  effects: [
    {
      type: 'modify-stats',
      target: 'all-allies',
      stat: 'attack',
      value: 2,
      duration: 'while-on-field',
    },
  ],
};

// Level 7 upgrades
const starBloomBloom7: StructuredAbility = {
  name: 'Cosmic Guidance',
  description: 'Once per turn, search deck for any card and add it to hand.',
  trigger: 'Activated',
  maxUsesPerTurn: 1,
  effects: [
    {
      type: 'search-deck',
      target: 'player-gardener',
      searchFor: 'any',
      quantity: 1,
    },
  ],
};

// Level 9 upgrades
const starBloomPassive9: StructuredAbility = {
  name: 'Astral Dominance',
  description: 'All allied Bloom Beasts gain +3 ATK and +2 HP.',
  trigger: 'Passive',
  effects: [
    {
      type: 'modify-stats',
      target: 'all-allies',
      stat: 'attack',
      value: 3,
      duration: 'while-on-field',
    },
    {
      type: 'modify-stats',
      target: 'all-allies',
      stat: 'health',
      value: 2,
      duration: 'while-on-field',
    },
  ],
};

const starBloomBloom9: StructuredAbility = {
  name: 'Universal Harmony',
  description: 'Draw 3 cards, search deck for any 2 cards, and all allies gain +2/+2.',
  trigger: 'Activated',
  effects: [
    {
      type: 'draw-cards',
      target: 'player-gardener',
      value: 3,
    },
    {
      type: 'search-deck',
      target: 'player-gardener',
      searchFor: 'any',
      quantity: 2,
    },
    {
      type: 'modify-stats',
      target: 'all-allies',
      stat: 'attack',
      value: 2,
      duration: 'permanent',
    },
    {
      type: 'modify-stats',
      target: 'all-allies',
      stat: 'health',
      value: 2,
      duration: 'permanent',
    },
  ],
};

export const STAR_BLOOM: BloomBeastCard = {
  id: 'star-bloom',
  name: 'Star Bloom',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 3,
  baseAttack: 4,
  baseHealth: 5,
  passiveAbility: starBloomPassive,
  bloomAbility: starBloomBloom,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 1, atk: 1 },
      3: { hp: 2, atk: 2 },
      4: { hp: 4, atk: 3 },
      5: { hp: 6, atk: 4 },
      6: { hp: 8, atk: 5 },
      7: { hp: 10, atk: 6 },
      8: { hp: 12, atk: 7 },
      9: { hp: 14, atk: 9 },
    },
    abilityUpgrades: {
      4: {
        passiveAbility: starBloomPassive4,
      },
      7: {
        bloomAbility: starBloomBloom7,
      },
      9: {
        passiveAbility: starBloomPassive9,
        bloomAbility: starBloomBloom9,
      },
    },
  },
};