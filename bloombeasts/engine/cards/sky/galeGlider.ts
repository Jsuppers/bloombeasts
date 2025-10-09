/**
 * Gale Glider - Fast, mobile attacker
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const galeGliderPassive: StructuredAbility = {
  name: 'First Wind',
  description: 'Gale Glider always attacks first in a conflict phase.',
  trigger: 'Passive',
  effects: [
    {
      type: 'attack-modification',
      target: 'self',
      modification: 'attack-first',
    },
  ],
};

const galeGliderBloom: StructuredAbility = {
  name: 'Air Current',
  description: 'When Gale Glider attacks, you may move it to an adjacent empty Beast Slot.',
  trigger: 'OnAttack',
  effects: [
    {
      type: 'move-unit',
      target: 'self',
      destination: 'adjacent-slot',
    },
  ],
};

// Level 4 upgrades
const galeGliderBloom4: StructuredAbility = {
  name: 'Wind Dance',
  description: 'After attacking, move to any empty Beast Slot.',
  trigger: 'OnAttack',
  effects: [
    {
      type: 'move-unit',
      target: 'self',
      destination: 'any-slot',
    },
  ],
};

// Level 7 upgrades
const galeGliderPassive7: StructuredAbility = {
  name: 'Storm Blade',
  description: 'Always attacks first and deals +2 damage if attacking first.',
  trigger: 'Passive',
  effects: [
    {
      type: 'attack-modification',
      target: 'self',
      modification: 'attack-first',
    },
    {
      type: 'modify-stats',
      target: 'self',
      stat: 'attack',
      value: 2,
      duration: 'next-attack',
    },
  ],
};

// Level 9 upgrades
const galeGliderPassive9: StructuredAbility = {
  name: 'Tempest Strike',
  description: 'Attacks first with triple damage. Cannot be counterattacked.',
  trigger: 'Passive',
  effects: [
    {
      type: 'attack-modification',
      target: 'self',
      modification: 'attack-first',
    },
    {
      type: 'attack-modification',
      target: 'self',
      modification: 'triple-damage',
    },
    {
      type: 'attack-modification',
      target: 'self',
      modification: 'cannot-counterattack',
    },
  ],
};

const galeGliderBloom9: StructuredAbility = {
  name: 'Hurricane Assault',
  description: 'After attacking, attack again and move to any slot.',
  trigger: 'OnAttack',
  effects: [
    {
      type: 'attack-modification',
      target: 'self',
      modification: 'attack-twice',
    },
    {
      type: 'move-unit',
      target: 'self',
      destination: 'any-slot',
    },
  ],
};

export const GALE_GLIDER: BloomBeastCard = {
  id: 'gale-glider',
  name: 'Gale Glider',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 1,
  baseAttack: 2,
  baseHealth: 2,
  passiveAbility: galeGliderPassive,
  bloomAbility: galeGliderBloom,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 0, atk: 2 },
      3: { hp: 0, atk: 3 },
      4: { hp: 1, atk: 5 },
      5: { hp: 1, atk: 7 },
      6: { hp: 2, atk: 9 },
      7: { hp: 2, atk: 10 },
      8: { hp: 3, atk: 12 },
      9: { hp: 3, atk: 14 },
    },
    abilityUpgrades: {
      4: {
        bloomAbility: galeGliderBloom4,
      },
      7: {
        passiveAbility: galeGliderPassive7,
      },
      9: {
        passiveAbility: galeGliderPassive9,
        bloomAbility: galeGliderBloom9,
      },
    },
  },
};