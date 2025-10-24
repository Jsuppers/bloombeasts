/**
 * Central card registry
 * Now loads cards from JSON catalogs with centralized utilities
 */

import { AnyCard } from '../types/core';
import { assetCatalogManager } from '../../AssetCatalogManager';
import { createDeck, Deck } from './cardUtils';

// Re-export everything from card utilities and config
export * from './cardUtils';
export * from './deckConfig';

// Export the unified Deck class and createDeck function
export { Deck, createDeck } from './cardUtils';

// Convenience functions for creating affinity-specific decks
export function createForestDeck(): Deck {
  return createDeck('Forest');
}

export function createFireDeck(): Deck {
  return createDeck('Fire');
}

export function createWaterDeck(): Deck {
  return createDeck('Water');
}

export function createSkyDeck(): Deck {
  return createDeck('Sky');
}

// Backward compatibility: Class aliases
export class ForestDeck extends Deck {
  constructor() {
    super('Forest');
  }
}

export class FireDeck extends Deck {
  constructor() {
    super('Fire');
  }
}

export class WaterDeck extends Deck {
  constructor() {
    super('Water');
  }
}

export class SkyDeck extends Deck {
  constructor() {
    super('Sky');
  }
}

/**
 * Get all cards from JSON catalogs
 * Requires asset catalogs to be loaded first via assetCatalogManager.loadAllCatalogs()
 * Also adds rarity property for reward generation
 */
export function getAllCards(): AnyCard[] {
  // Get all card data from loaded JSON catalogs
  const cards = assetCatalogManager.getAllCardData();

  // If no cards are loaded, return empty array
  // This can happen if catalogs haven't been loaded yet
  if (cards.length === 0) {
    console.warn('getAllCards(): No cards loaded from catalogs. Make sure to call assetCatalogManager.loadAllCatalogs() during initialization.');
  }

  return cards as AnyCard[];
}