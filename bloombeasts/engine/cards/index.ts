/**
 * Central card registry
 * Now loads cards from JSON catalogs with centralized utilities
 */

import { AnyCard } from '../types/core';
import { assetCatalogManager } from '../../AssetCatalogManager';

// Re-export everything from card utilities and config
export * from './cardUtils';
export * from './deckConfig';

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