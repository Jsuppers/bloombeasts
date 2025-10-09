/**
 * Bubblefin - Protected defender with attack reduction
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const bubblefinPassive: StructuredAbility = {
  name: 'Emerge',
  description: 'Bubblefin cannot be targeted by a Trap Card.',
  trigger: 'Passive',
  effects: [
    {
      type: 'cannot-be-targeted',
      target: 'self',
      by: ['trap'],
    },
  ],
};

const bubblefinBloom: StructuredAbility = {
  name: 'Dampen',
  description: "When Bubblefin is attacked, reduce the attacker's ATK by 1 until the end of the turn.",
  trigger: 'OnDamage',
  effects: [
    {
      type: 'modify-stats',
      target: 'attacker',
      stat: 'attack',
      value: -1,
      duration: 'end-of-turn',
    },
  ],
};

// Level 4 upgrades
const bubblefinBloom4: StructuredAbility = {
  name: 'Tidal Shield',
  description: "When attacked, reduce attacker's ATK by 2 until end of turn.",
  trigger: 'OnDamage',
  effects: [
    {
      type: 'modify-stats',
      target: 'attacker',
      stat: 'attack',
      value: -2,
      duration: 'end-of-turn',
    },
  ],
};

// Level 7 upgrades
const bubblefinPassive7: StructuredAbility = {
  name: 'Deep Dive',
  description: 'Cannot be targeted by Trap Cards or Magic Cards.',
  trigger: 'Passive',
  effects: [
    {
      type: 'cannot-be-targeted',
      target: 'self',
      by: ['trap', 'magic'],
    },
  ],
};

// Level 9 upgrades
const bubblefinPassive9: StructuredAbility = {
  name: 'Ocean Sanctuary',
  description: 'Cannot be targeted by any opponent cards or abilities.',
  trigger: 'Passive',
  effects: [
    {
      type: 'cannot-be-targeted',
      target: 'self',
      by: ['magic', 'trap', 'abilities'],
    },
  ],
};

const bubblefinBloom9: StructuredAbility = {
  name: 'Crushing Depths',
  description: "When attacked, reduce attacker's ATK by 3 permanently and heal self by 2 HP.",
  trigger: 'OnDamage',
  effects: [
    {
      type: 'modify-stats',
      target: 'attacker',
      stat: 'attack',
      value: -3,
      duration: 'permanent',
    },
    {
      type: 'heal',
      target: 'self',
      value: 2,
    },
  ],
};

export const BUBBLEFIN: BloomBeastCard = {
  id: 'bubblefin',
  name: 'Bubblefin',
  type: 'Bloom',
  affinity: 'Water',
  cost: 2,
  baseAttack: 2,
  baseHealth: 5,
  passiveAbility: bubblefinPassive,
  bloomAbility: bubblefinBloom,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 2, atk: 0 },
      3: { hp: 4, atk: 0 },
      4: { hp: 6, atk: 1 },
      5: { hp: 8, atk: 2 },
      6: { hp: 10, atk: 3 },
      7: { hp: 12, atk: 4 },
      8: { hp: 14, atk: 5 },
      9: { hp: 16, atk: 6 },
    },
    abilityUpgrades: {
      4: {
        bloomAbility: bubblefinBloom4,
      },
      7: {
        passiveAbility: bubblefinPassive7,
      },
      9: {
        passiveAbility: bubblefinPassive9,
        bloomAbility: bubblefinBloom9,
      },
    },
  },
};