/**
 * Magmite - Tanky finisher with death effect
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const magmitePassive: StructuredAbility = {
  name: 'Hardened Shell',
  description: 'Magmite takes 1 less damage from all sources.',
  trigger: 'Passive',
  effects: [
    {
      type: 'damage-reduction',
      target: 'self',
      value: 1,
      duration: 'while-on-field',
    },
  ],
};

const magmiteBloom: StructuredAbility = {
  name: 'Volcanic Burst',
  description: "When Magmite is destroyed, deal 3 damage to the opponent's Gardener.",
  trigger: 'OnDestroy',
  effects: [
    {
      type: 'deal-damage',
      target: 'opponent-gardener',
      value: 3,
    },
  ],
};

// Level 4 upgrades
const magmitePassive4: StructuredAbility = {
  name: 'Molten Armor',
  description: 'Magmite takes 2 less damage from all sources.',
  trigger: 'Passive',
  effects: [
    {
      type: 'damage-reduction',
      target: 'self',
      value: 2,
      duration: 'while-on-field',
    },
  ],
};

// Level 7 upgrades
const magmiteBloom7: StructuredAbility = {
  name: 'Eruption',
  description: "When destroyed, deal 5 damage to opponent Gardener and 2 damage to all opponent Bloom Beasts.",
  trigger: 'OnDestroy',
  effects: [
    {
      type: 'deal-damage',
      target: 'opponent-gardener',
      value: 5,
    },
    {
      type: 'deal-damage',
      target: 'all-enemies',
      value: 2,
    },
  ],
};

// Level 9 upgrades
const magmitePassive9: StructuredAbility = {
  name: 'Obsidian Carapace',
  description: 'Takes 3 less damage. When attacked, deal 2 damage to attacker.',
  trigger: 'Passive',
  effects: [
    {
      type: 'damage-reduction',
      target: 'self',
      value: 3,
      duration: 'while-on-field',
    },
    {
      type: 'retaliation',
      target: 'attacker',
      value: 2,
    },
  ],
};

const magmiteBloom9: StructuredAbility = {
  name: 'Cataclysm',
  description: "When destroyed, deal 8 damage to opponent Gardener and destroy all Bloom Beasts with 3 HP or less.",
  trigger: 'OnDestroy',
  effects: [
    {
      type: 'deal-damage',
      target: 'opponent-gardener',
      value: 8,
    },
    {
      type: 'destroy',
      target: 'all-enemies',
      condition: {
        type: 'health-below',
        value: 4,
        comparison: 'less',
      },
    },
  ],
};

export const MAGMITE: BloomBeastCard = {
  id: 'magmite',
  name: 'Magmite',
  type: 'Bloom',
  affinity: 'Fire',
  cost: 3,
  baseAttack: 4,
  baseHealth: 6,
  passiveAbility: magmitePassive,
  bloomAbility: magmiteBloom,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 2, atk: 1 },
      3: { hp: 3, atk: 2 },
      4: { hp: 5, atk: 3 },
      5: { hp: 7, atk: 4 },
      6: { hp: 9, atk: 5 },
      7: { hp: 11, atk: 6 },
      8: { hp: 13, atk: 7 },
      9: { hp: 15, atk: 9 },
    },
    abilityUpgrades: {
      4: {
        passiveAbility: magmitePassive4,
      },
      7: {
        bloomAbility: magmiteBloom7,
      },
      9: {
        passiveAbility: magmitePassive9,
        bloomAbility: magmiteBloom9,
      },
    },
  },
};