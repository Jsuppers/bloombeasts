/**
 * Deck Configuration - Simplified deck building using card utilities
 */

import { BloomBeastCard, HabitatCard, MagicCard, TrapCard, AnyCard } from '../types/core';
import { getCard } from './cardUtils';

export type DeckCardEntry<T = AnyCard> = {
  card: T;
  quantity: number;
};

// Deck config that stores card IDs instead of card objects (for lazy loading)
export type DeckCardIdEntry = {
  cardId: string;
  quantity: number;
};

export type AffinityType = 'Forest' | 'Fire' | 'Water' | 'Sky';

/**
 * Deck configuration for each affinity (with card IDs)
 */
export interface AffinityDeckConfigIds {
  name: string;
  affinity: AffinityType;
  beasts: DeckCardIdEntry[];
  habitats: DeckCardIdEntry[];
}

/**
 * Deck configuration for each affinity (with resolved cards)
 */
export interface AffinityDeckConfig {
  name: string;
  affinity: AffinityType;
  beasts: DeckCardEntry<BloomBeastCard>[];
  habitats: DeckCardEntry<HabitatCard>[];
}

/**
 * Static deck configurations using card IDs (no catalog dependency)
 * These can be loaded at module initialization time
 */
const AFFINITY_DECK_CONFIG_IDS: Record<AffinityType, AffinityDeckConfigIds> = {
  Forest: {
    name: 'Forest Starter: The Growth Deck',
    affinity: 'Forest',
    beasts: [
      { cardId: 'mosslet', quantity: 4 },
      { cardId: 'rootling', quantity: 4 },
      { cardId: 'mushroomancer', quantity: 2 },
      { cardId: 'leaf-sprite', quantity: 3 },
    ],
    habitats: [
      { cardId: 'ancient-forest', quantity: 3 },
    ],
  },
  Fire: {
    name: 'Fire Starter: The Aggro Deck',
    affinity: 'Fire',
    beasts: [
      { cardId: 'cinder-pup', quantity: 4 },
      { cardId: 'blazefinch', quantity: 4 },
      { cardId: 'magmite', quantity: 2 },
      { cardId: 'charcoil', quantity: 3 },
    ],
    habitats: [
      { cardId: 'volcanic-scar', quantity: 3 },
    ],
  },
  Water: {
    name: 'Water Starter: The Control Deck',
    affinity: 'Water',
    beasts: [
      { cardId: 'bubblefin', quantity: 4 },
      { cardId: 'aqua-pebble', quantity: 4 },
      { cardId: 'dewdrop-drake', quantity: 2 },
      { cardId: 'kelp-cub', quantity: 3 },
    ],
    habitats: [
      { cardId: 'deep-sea-grotto', quantity: 3 },
    ],
  },
  Sky: {
    name: 'Sky Starter: The Utility Deck',
    affinity: 'Sky',
    beasts: [
      { cardId: 'cirrus-floof', quantity: 4 },
      { cardId: 'gale-glider', quantity: 4 },
      { cardId: 'star-bloom', quantity: 2 },
      { cardId: 'aero-moth', quantity: 3 },
    ],
    habitats: [
      { cardId: 'clear-zenith', quantity: 3 },
    ],
  },
};

/**
 * Shared core cards (card IDs)
 */
const SHARED_CORE_CARD_IDS: DeckCardIdEntry[] = [
  // Basic resource generation
  { cardId: 'nectar-block', quantity: 10 },
  { cardId: 'nectar-surge', quantity: 2 },
  { cardId: 'nectar-drain', quantity: 1 },

  // Removal and utility
  { cardId: 'cleansing-downpour', quantity: 1 },
  { cardId: 'purify', quantity: 1 },
  { cardId: 'lightning-strike', quantity: 1 },
  { cardId: 'elemental-burst', quantity: 1 },

  // Buffs and positioning
  { cardId: 'power-up', quantity: 1 },
  { cardId: 'overgrowth', quantity: 1 },
  { cardId: 'aether-swap', quantity: 1 },

  // Trap cards
  { cardId: 'habitat-lock', quantity: 1 },
  { cardId: 'magic-shield', quantity: 1 },
  { cardId: 'habitat-shield', quantity: 1 },
  { cardId: 'bear-trap', quantity: 1 },
  { cardId: 'thorn-snare', quantity: 1 },
  { cardId: 'vaporize', quantity: 1 },
  { cardId: 'emergency-bloom', quantity: 1 },
  { cardId: 'xp-harvest', quantity: 1 },
];

/**
 * Resolve card IDs to card objects
 */
function resolveCardIds<T = AnyCard>(cardIdEntries: DeckCardIdEntry[]): DeckCardEntry<T>[] {
  return cardIdEntries.map(({ cardId, quantity }) => ({
    card: getCard<T>(cardId),
    quantity,
  }));
}

/**
 * Get shared core cards configuration (resolved from IDs)
 */
export function getSharedCoreCards(): DeckCardEntry<MagicCard | TrapCard>[] {
  return resolveCardIds<MagicCard | TrapCard>(SHARED_CORE_CARD_IDS);
}

/**
 * Get deck configuration for a specific affinity (resolves card IDs to cards)
 */
export function getDeckConfig(affinity: AffinityType): AffinityDeckConfig {
  const configIds = AFFINITY_DECK_CONFIG_IDS[affinity];

  return {
    name: configIds.name,
    affinity: configIds.affinity,
    beasts: resolveCardIds<BloomBeastCard>(configIds.beasts),
    habitats: resolveCardIds<HabitatCard>(configIds.habitats),
  };
}

/**
 * Get all deck configurations (resolves card IDs to cards)
 */
export function getAllDeckConfigs(): AffinityDeckConfig[] {
  return Object.values(AFFINITY_DECK_CONFIG_IDS).map(configIds => ({
    name: configIds.name,
    affinity: configIds.affinity,
    beasts: resolveCardIds<BloomBeastCard>(configIds.beasts),
    habitats: resolveCardIds<HabitatCard>(configIds.habitats),
  }));
}
