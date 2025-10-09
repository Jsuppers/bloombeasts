/**
 * All Card Definitions
 * Single file containing all card definitions for Horizon Worlds
 * This avoids deep nested imports which Horizon Worlds doesn't support
 */

import { BloomBeastCard, HabitatCard, TrapCard, MagicCard, ResourceCard } from './engine/types/core';
import { StructuredAbility } from './engine/types/abilities';

// ============= FOREST CARDS =============

// Fuzzlet abilities
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
};

// Mushroomancer
const mushroomancerPassive: StructuredAbility = {
  name: 'Decay Aura',
  description: 'Whenever an enemy Beast is destroyed, gain 1 Spore counter.',
  trigger: 'Passive',
  effects: [
    {
      type: 'apply-counter',
      target: 'self',
      counter: 'Spore',
      value: 1,
    },
  ],
};

const mushroomancerBloom: StructuredAbility = {
  name: 'Fungal Network',
  description: 'Spend 3 Spore counters: Draw 2 cards and heal all allied Beasts for 1.',
  trigger: 'Activated',
  effects: [
    {
      type: 'draw-cards',
      target: 'player-gardener',
      value: 2,
    },
    {
      type: 'heal',
      target: 'all-allies',
      value: 1,
    },
  ],
};

export const MUSHROOMANCER: BloomBeastCard = {
  id: 'mushroomancer',
  name: 'Mushroomancer',
  type: 'Bloom',
  affinity: 'Forest',
  cost: 4,
  baseAttack: 3,
  baseHealth: 4,
  passiveAbility: mushroomancerPassive,
  bloomAbility: mushroomancerBloom,
};

// Leaf Sprite
const leafSpritePassive: StructuredAbility = {
  name: 'Photosynthesis',
  description: 'At the start of your turn, gain 1 temporary nectar this turn.',
  trigger: 'StartOfTurn',
  effects: [
    {
      type: 'gain-resource',
      target: 'player-gardener',
      resource: 'nectar',
      value: 1,
    },
  ],
};

const leafSpriteBloom: StructuredAbility = {
  name: 'Nature\'s Blessing',
  description: 'All allied Forest Beasts gain +1/+1 this turn.',
  trigger: 'Activated',
  effects: [
    {
      type: 'modify-stats',
      target: 'all-allies',
      stat: 'both',
      value: 1,
      duration: 'end-of-turn',
    },
  ],
};

export const LEAF_SPRITE: BloomBeastCard = {
  id: 'leaf-sprite',
  name: 'Leaf Sprite',
  type: 'Bloom',
  affinity: 'Forest',
  cost: 3,
  baseAttack: 2,
  baseHealth: 3,
  passiveAbility: leafSpritePassive,
  bloomAbility: leafSpriteBloom,
};

// Rootling
const rootlingPassive: StructuredAbility = {
  name: 'Entangle',
  description: 'Enemy Beasts cannot attack the turn they are summoned.',
  trigger: 'Passive',
  effects: [
    {
      type: 'prevent-attack',
      target: 'summoned-unit',
      duration: 'end-of-turn',
    },
  ],
};

const rootlingBloom: StructuredAbility = {
  name: 'Deep Roots',
  description: 'Rootling gains +0/+3 and cannot be targeted by abilities this turn.',
  trigger: 'Activated',
  effects: [
    {
      type: 'modify-stats',
      target: 'self',
      stat: 'health',
      value: 3,
      duration: 'end-of-turn',
    },
    {
      type: 'immunity',
      target: 'self',
      immuneTo: ['targeting'],
      duration: 'end-of-turn',
    },
  ],
};

export const ROOTLING: BloomBeastCard = {
  id: 'rootling',
  name: 'Rootling',
  type: 'Bloom',
  affinity: 'Forest',
  cost: 1,
  baseAttack: 1,
  baseHealth: 3,
  passiveAbility: rootlingPassive,
  bloomAbility: rootlingBloom,
};

// Ancient Forest Habitat
export const ANCIENT_FOREST: HabitatCard = {
  id: 'ancient-forest',
  name: 'Ancient Forest',
  type: 'Habitat',
  affinity: 'Forest',
  cost: 0,
  habitatShiftEffect: 'All Forest Beasts gain +0/+1. Spore counters generate 1 healing at turn end.',
};

// ============= FIRE CARDS =============

// Cinder Pup
const cinderPupPassive: StructuredAbility = {
  name: 'Burning Passion',
  description: 'When Cinder Pup attacks, place a Burn counter (1 damage per turn) on the target Bloom Beast.',
  trigger: 'OnAttack',
  effects: [
    {
      type: 'apply-counter',
      target: 'target',
      counter: 'Burn',
      value: 1,
    },
  ],
};

const cinderPupBloom: StructuredAbility = {
  name: 'Fan the Flames',
  description: 'Double all Burn counters on enemy Bloom Beasts.',
  trigger: 'Activated',
  effects: [
    {
      type: 'apply-counter',
      target: 'all-enemies',
      counter: 'Burn',
      value: 1,  // Simplified - just add more burn counters
    },
  ],
};

export const CINDER_PUP: BloomBeastCard = {
  id: 'cinder-pup',
  name: 'Cinder Pup',
  type: 'Bloom',
  affinity: 'Fire',
  cost: 2,
  baseAttack: 3,
  baseHealth: 2,
  passiveAbility: cinderPupPassive,
  bloomAbility: cinderPupBloom,
};

// Magmite
const magmitePassive: StructuredAbility = {
  name: 'Molten Core',
  description: 'When Magmite is destroyed, deal 2 damage to all enemy Beasts.',
  trigger: 'OnDestroy',
  effects: [
    {
      type: 'deal-damage',
      target: 'all-enemies',
      value: 2,
    },
  ],
};

const magmiteBloom: StructuredAbility = {
  name: 'Eruption',
  description: 'Deal 3 damage to target Beast and 1 damage to adjacent Beasts.',
  trigger: 'Activated',
  effects: [
    {
      type: 'deal-damage',
      target: 'target',
      value: 3,
    },
    {
      type: 'deal-damage',
      target: 'adjacent-enemies',
      value: 1,
    },
  ],
};

export const MAGMITE: BloomBeastCard = {
  id: 'magmite',
  name: 'Magmite',
  type: 'Bloom',
  affinity: 'Fire',
  cost: 3,
  baseAttack: 3,
  baseHealth: 3,
  passiveAbility: magmitePassive,
  bloomAbility: magmiteBloom,
};

// Charcoil
const charcoilPassive: StructuredAbility = {
  name: 'Soot Cloud',
  description: 'At the end of your turn, place a Soot counter on all enemy Beasts (-1 Attack).',
  trigger: 'EndOfTurn',
  effects: [
    {
      type: 'apply-counter',
      target: 'all-enemies',
      counter: 'Soot',
      value: 1,
    },
  ],
};

const charcoilBloom: StructuredAbility = {
  name: 'Ignite',
  description: 'Convert all Soot counters on enemy Beasts to Burn counters.',
  trigger: 'Activated',
  effects: [
    {
      type: 'remove-counter',
      target: 'all-enemies',
      counter: 'Soot',
    },
    {
      type: 'apply-counter',
      target: 'all-enemies',
      counter: 'Burn',
      value: 1,
    },
  ],
};

export const CHARCOIL: BloomBeastCard = {
  id: 'charcoil',
  name: 'Charcoil',
  type: 'Bloom',
  affinity: 'Fire',
  cost: 4,
  baseAttack: 4,
  baseHealth: 3,
  passiveAbility: charcoilPassive,
  bloomAbility: charcoilBloom,
};

// Blazefinch
const blazefinchPassive: StructuredAbility = {
  name: 'Swift Strike',
  description: 'Blazefinch can attack the turn it is summoned.',
  trigger: 'Passive',
  effects: [
    {
      type: 'remove-summoning-sickness',
      target: 'self',
    },
  ],
};

const blazefinchBloom: StructuredAbility = {
  name: 'Phoenix Dive',
  description: 'Deal 2 damage to target Beast. If it\'s destroyed, summon Blazefinch from your graveyard.',
  trigger: 'Activated',
  effects: [
    {
      type: 'deal-damage',
      target: 'target',
      value: 2,
    },
  ],
};

export const BLAZEFINCH: BloomBeastCard = {
  id: 'blazefinch',
  name: 'Blazefinch',
  type: 'Bloom',
  affinity: 'Fire',
  cost: 3,
  baseAttack: 2,
  baseHealth: 2,
  passiveAbility: blazefinchPassive,
  bloomAbility: blazefinchBloom,
};

// Volcanic Scar Habitat
export const VOLCANIC_SCAR: HabitatCard = {
  id: 'volcanic-scar',
  name: 'Volcanic Scar',
  type: 'Habitat',
  affinity: 'Fire',
  cost: 0,
  habitatShiftEffect: 'All Fire Beasts gain +1/+0. Burn counters deal 1 additional damage.',
};

// ============= WATER CARDS =============

// Dewdrop Drake
const dewdropDrakePassive: StructuredAbility = {
  name: 'Healing Mist',
  description: 'At the start of your turn, heal the weakest allied Beast for 1.',
  trigger: 'StartOfTurn',
  effects: [
    {
      type: 'heal',
      target: 'other-ally',
      value: 1,
    },
  ],
};

const dewdropDrakeBloom: StructuredAbility = {
  name: 'Cleansing Wave',
  description: 'Remove all negative counters from allied Beasts and heal them for 1.',
  trigger: 'Activated',
  effects: [
    {
      type: 'remove-counter',
      target: 'all-allies',
      counter: 'Burn',
    },
    {
      type: 'remove-counter',
      target: 'all-allies',
      counter: 'Soot',
    },
    {
      type: 'heal',
      target: 'all-allies',
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
  baseAttack: 2,
  baseHealth: 4,
  passiveAbility: dewdropDrakePassive,
  bloomAbility: dewdropDrakeBloom,
};

// Bubblefin
const bubblefinPassive: StructuredAbility = {
  name: 'Bubble Shield',
  description: 'The first damage dealt to Bubblefin each turn is reduced to 0.',
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

const bubblefinBloom: StructuredAbility = {
  name: 'Bubble Burst',
  description: 'Give all allied Beasts a bubble shield (blocks 1 damage).',
  trigger: 'Activated',
  effects: [
    {
      type: 'damage-reduction',
      target: 'all-allies',
      value: 1,
      duration: 'end-of-turn',
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
  baseHealth: 3,
  passiveAbility: bubblefinPassive,
  bloomAbility: bubblefinBloom,
};

// Kelp Cub
const kelpCubPassive: StructuredAbility = {
  name: 'Regeneration',
  description: 'At the end of your turn, Kelp Cub heals for 1.',
  trigger: 'EndOfTurn',
  effects: [
    {
      type: 'heal',
      target: 'self',
      value: 1,
    },
  ],
};

const kelpCubBloom: StructuredAbility = {
  name: 'Kelp Forest',
  description: 'All Water Beasts gain Regeneration (heal 1 at end of turn) until your next turn.',
  trigger: 'Activated',
  effects: [
    {
      type: 'heal',
      target: 'all-allies',
      value: 1,
    },
  ],
};

export const KELP_CUB: BloomBeastCard = {
  id: 'kelp-cub',
  name: 'Kelp Cub',
  type: 'Bloom',
  affinity: 'Water',
  cost: 1,
  baseAttack: 1,
  baseHealth: 2,
  passiveAbility: kelpCubPassive,
  bloomAbility: kelpCubBloom,
};

// Aqua-Pebble
const aquaPebblePassive: StructuredAbility = {
  name: 'Freeze Touch',
  description: 'When Aqua-Pebble attacks, freeze the target (cannot attack next turn).',
  trigger: 'OnAttack',
  effects: [
    {
      type: 'prevent-attack',
      target: 'attacked-enemy',
      duration: 'end-of-turn',
    },
  ],
};

const aquaPebbleBloom: StructuredAbility = {
  name: 'Flash Freeze',
  description: 'Freeze all enemy Beasts with 2 or less Attack.',
  trigger: 'Activated',
  effects: [
    {
      type: 'prevent-attack',
      target: 'all-enemies',
      duration: 'end-of-turn',
    },
  ],
};

export const AQUA_PEBBLE: BloomBeastCard = {
  id: 'aqua-pebble',
  name: 'Aqua-Pebble',
  type: 'Bloom',
  affinity: 'Water',
  cost: 4,
  baseAttack: 3,
  baseHealth: 5,
  passiveAbility: aquaPebblePassive,
  bloomAbility: aquaPebbleBloom,
};

// Deep Sea Grotto Habitat
export const DEEP_SEA_GROTTO: HabitatCard = {
  id: 'deep-sea-grotto',
  name: 'Deep Sea Grotto',
  type: 'Habitat',
  affinity: 'Water',
  cost: 0,
  habitatShiftEffect: 'All Water Beasts gain +0/+1. Frozen enemies remain frozen for 1 additional turn.',
};

// ============= SKY CARDS =============

// Cirrus Floof
const cirrusFloofPassive: StructuredAbility = {
  name: 'Updraft',
  description: 'When Cirrus Floof is summoned, return target Beast to owner\'s hand.',
  trigger: 'OnSummon',
  effects: [
    {
      type: 'return-to-hand',
      target: 'target',
    },
  ],
};

const cirrusFloofBloom: StructuredAbility = {
  name: 'Gale Force',
  description: 'Return all Beasts with 2 or less Health to their owners\' hands.',
  trigger: 'Activated',
  effects: [
    {
      type: 'return-to-hand',
      target: 'all-units',
      value: 2,
    },
  ],
};

export const CIRRUS_FLOOF: BloomBeastCard = {
  id: 'cirrus-floof',
  name: 'Cirrus Floof',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 3,
  baseAttack: 2,
  baseHealth: 3,
  passiveAbility: cirrusFloofPassive,
  bloomAbility: cirrusFloofBloom,
};

// Aero-Moth
const aeroMothPassive: StructuredAbility = {
  name: 'Evasion',
  description: 'Aero-Moth has a 50% chance to dodge attacks.',
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

const aeroMothBloom: StructuredAbility = {
  name: 'Wind Dance',
  description: 'All Sky Beasts gain Evasion (50% dodge) until your next turn.',
  trigger: 'Activated',
  effects: [
    {
      type: 'damage-reduction',
      target: 'all-allies',
      value: 1,
      duration: 'end-of-turn',
    },
  ],
};

export const AERO_MOTH: BloomBeastCard = {
  id: 'aero-moth',
  name: 'Aero-Moth',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 2,
  baseAttack: 2,
  baseHealth: 2,
  passiveAbility: aeroMothPassive,
  bloomAbility: aeroMothBloom,
};

// Gale Glider
const galeGliderPassive: StructuredAbility = {
  name: 'Tailwind',
  description: 'When you summon a Sky Beast, draw a card.',
  trigger: 'Passive',
  effects: [
    {
      type: 'draw-cards',
      target: 'player-gardener',
      value: 1,
    },
  ],
};

const galeGliderBloom: StructuredAbility = {
  name: 'Storm Front',
  description: 'Draw 2 cards. Sky Beasts cost 1 less nectar next turn.',
  trigger: 'Activated',
  effects: [
    {
      type: 'draw-cards',
      target: 'player-gardener',
      value: 2,
    },
  ],
};

export const GALE_GLIDER: BloomBeastCard = {
  id: 'gale-glider',
  name: 'Gale Glider',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 4,
  baseAttack: 3,
  baseHealth: 4,
  passiveAbility: galeGliderPassive,
  bloomAbility: galeGliderBloom,
};

// Star Bloom
const starBloomPassive: StructuredAbility = {
  name: 'Celestial Power',
  description: 'Your Bloom abilities cost 1 less nectar to activate.',
  trigger: 'Passive',
  effects: [
    {
      type: 'gain-resource',
      target: 'player-gardener',
      resource: 'nectar',
      value: 1,
    },
  ],
};

const starBloomBloom: StructuredAbility = {
  name: 'Cosmic Burst',
  description: 'Activate all allied Beasts\' Bloom abilities for free.',
  trigger: 'Activated',
  effects: [
    {
      type: 'modify-stats',
      target: 'all-allies',
      stat: 'both',
      value: 2,
      duration: 'end-of-turn',
    },
  ],
};

export const STAR_BLOOM: BloomBeastCard = {
  id: 'star-bloom',
  name: 'Star Bloom',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 5,
  baseAttack: 3,
  baseHealth: 3,
  passiveAbility: starBloomPassive,
  bloomAbility: starBloomBloom,
};

// Clear Zenith Habitat
export const CLEAR_ZENITH: HabitatCard = {
  id: 'clear-zenith',
  name: 'Clear Zenith',
  type: 'Habitat',
  affinity: 'Sky',
  cost: 0,
  habitatShiftEffect: 'All Sky Beasts gain +1/+0. Draw an extra card at the start of your turn.',
};

// ============= SHARED CARDS =============

// Nectar Block
export const NECTAR_BLOCK: ResourceCard = {
  id: 'nectar-block',
  name: 'Nectar Block',
  type: 'Resource',
  cost: 0,
  effect: 'Gain 2 nectar this turn only.',
};

// Nectar Surge
export const NECTAR_SURGE: MagicCard = {
  id: 'nectar-surge',
  name: 'Nectar Surge',
  type: 'Magic',
  cost: 1,
  effect: 'Gain 3 nectar this turn. Draw a card.',
};

// Cleansing Downpour
export const CLEANSING_DOWNPOUR: MagicCard = {
  id: 'cleansing-downpour',
  name: 'Cleansing Downpour',
  type: 'Magic',
  cost: 2,
  effect: 'Remove all counters from all Beasts. Each player draws 1 card.',
};

// Habitat Lock
export const HABITAT_LOCK: TrapCard = {
  id: 'habitat-lock',
  name: 'Habitat Lock',
  type: 'Trap',
  cost: 1,
  activation: 'When an opponent plays a Habitat card',
  effect: 'Counter that Habitat. It goes to the graveyard instead.',
};