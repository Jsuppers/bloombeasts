/**
 * Dewdrop Drake - Protected finisher with direct damage
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility } from '../../types/abilities';

const dewdropDrakePassive: StructuredAbility = {
  name: 'Mist Screen',
  description: "Opponent's Bloom Beasts can only attack Dewdrop Drake if it is the only beast on the field.",
  trigger: 'Passive',
  effects: [
    {
      type: 'attack-modification',
      target: 'self',
      modification: 'attack-first',
      condition: {
        type: 'units-on-field',
        value: 1,
        comparison: 'equal',
      },
    },
  ],
};

const dewdropDrakeBloom: StructuredAbility = {
  name: 'Torrent',
  description: "You may pay 1 Nectar to deal 2 damage to the opponent's Gardener when Dewdrop Drake attacks.",
  trigger: 'OnAttack',
  cost: {
    type: 'nectar',
    value: 1,
  },
  effects: [
    {
      type: 'deal-damage',
      target: 'opponent-gardener',
      value: 2,
    },
  ],
};

// Level 4 upgrades
const dewdropDrakeBloom4: StructuredAbility = {
  name: 'Deluge',
  description: "Pay 1 Nectar to deal 3 damage to opponent Gardener when attacking.",
  trigger: 'OnAttack',
  cost: {
    type: 'nectar',
    value: 1,
  },
  effects: [
    {
      type: 'deal-damage',
      target: 'opponent-gardener',
      value: 3,
    },
  ],
};

// Level 7 upgrades
const dewdropDrakePassive7: StructuredAbility = {
  name: 'Fog Veil',
  description: 'Opponents must attack Dewdrop Drake first. Reduce all damage taken by 1.',
  trigger: 'Passive',
  effects: [
    {
      type: 'attack-modification',
      target: 'self',
      modification: 'attack-first',
    },
    {
      type: 'damage-reduction',
      target: 'self',
      value: 1,
      duration: 'while-on-field',
    },
  ],
};

// Level 9 upgrades
const dewdropDrakePassive9: StructuredAbility = {
  name: 'Storm Guardian',
  description: 'All opponents must attack Dewdrop Drake first. Reduce all damage by 2.',
  trigger: 'Passive',
  effects: [
    {
      type: 'attack-modification',
      target: 'self',
      modification: 'attack-first',
    },
    {
      type: 'damage-reduction',
      target: 'self',
      value: 2,
      duration: 'while-on-field',
    },
  ],
};

const dewdropDrakeBloom9: StructuredAbility = {
  name: 'Maelstrom',
  description: "When attacking, deal 5 damage to opponent Gardener and freeze one opponent Bloom Beast.",
  trigger: 'OnAttack',
  effects: [
    {
      type: 'deal-damage',
      target: 'opponent-gardener',
      value: 5,
    },
    {
      type: 'apply-counter',
      target: 'random-enemy',
      counter: 'Freeze',
      value: 1,
    },
  ],
};

export const DEWDROP_DRAKE: BloomBeastCard = {
  id: 'dewdrop-drake',
  name: 'Dewdrop Drake',
  type: 'Bloom',
  affinity: 'Water',
  cost: 3,
  baseAttack: 3,
  baseHealth: 6,
  passiveAbility: dewdropDrakePassive,
  bloomAbility: dewdropDrakeBloom,
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
      9: { hp: 14, atk: 8 },
    },
    abilityUpgrades: {
      4: {
        bloomAbility: dewdropDrakeBloom4,
      },
      7: {
        passiveAbility: dewdropDrakePassive7,
      },
      9: {
        passiveAbility: dewdropDrakePassive9,
        bloomAbility: dewdropDrakeBloom9,
      },
    },
  },
};