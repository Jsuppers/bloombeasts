/**
 * Card Utilities - Central card loading and filtering from JSON catalogs
 */

import { assetCatalogManager } from '../../AssetCatalogManager';
import { BloomBeastCard, HabitatCard, MagicCard, TrapCard, BuffCard, AnyCard } from '../types/core';

/**
 * Get a single card by ID from the catalog
 */
export function getCard<T = AnyCard>(id: string): T {
  const allCards = assetCatalogManager.getAllCardData();
  const card = allCards.find(c => c.id === id);
  if (!card) {
    throw new Error(`Card with id "${id}" not found in catalogs`);
  }
  return card as T;
}

/**
 * Get all cards of a specific affinity
 */
export function getCardsByAffinity(affinity: 'Forest' | 'Fire' | 'Water' | 'Sky'): (BloomBeastCard | HabitatCard)[] {
  const allCards = assetCatalogManager.getAllCardData();
  return allCards.filter(card =>
    'affinity' in card && card.affinity === affinity
  ) as (BloomBeastCard | HabitatCard)[];
}

/**
 * Get beast cards by affinity from catalog
 * Note: This gets cards from the catalog, not from a battlefield
 */
export function getBeastCardsFromCatalog(affinity: 'Forest' | 'Fire' | 'Water' | 'Sky'): BloomBeastCard[] {
  const allCards = assetCatalogManager.getAllCardData();
  return allCards.filter(card =>
    card.type === 'Bloom' && 'affinity' in card && card.affinity === affinity
  ) as BloomBeastCard[];
}

/**
 * Get habitat cards by affinity
 */
export function getHabitatsByAffinity(affinity: 'Forest' | 'Fire' | 'Water' | 'Sky'): HabitatCard[] {
  const allCards = assetCatalogManager.getAllCardData();
  return allCards.filter(card =>
    card.type === 'Habitat' && 'affinity' in card && card.affinity === affinity
  ) as HabitatCard[];
}

/**
 * Get all buff cards
 */
export function getAllBuffCards(): BuffCard[] {
  const allCards = assetCatalogManager.getAllCardData();
  return allCards.filter(card => card.type === 'Buff') as BuffCard[];
}
