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
 * Get multiple cards by IDs
 */
export function getCards<T = AnyCard>(ids: string[]): T[] {
  return ids.map(id => getCard<T>(id));
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
 * Get all cards of a specific type
 */
export function getCardsByType<T extends AnyCard>(
  type: 'Bloom' | 'Habitat' | 'Magic' | 'Trap' | 'Buff'
): T[] {
  const allCards = assetCatalogManager.getAllCardData();
  return allCards.filter(card => card.type === type) as T[];
}

/**
 * Get beast cards by affinity
 */
export function getBeastsByAffinity(affinity: 'Forest' | 'Fire' | 'Water' | 'Sky'): BloomBeastCard[] {
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
 * Get all magic cards
 */
export function getAllMagicCards(): MagicCard[] {
  return getCardsByType<MagicCard>('Magic');
}

/**
 * Get all trap cards
 */
export function getAllTrapCards(): TrapCard[] {
  return getCardsByType<TrapCard>('Trap');
}

/**
 * Get all buff cards
 */
export function getAllBuffCards(): BuffCard[] {
  return getCardsByType<BuffCard>('Buff');
}

/**
 * Get all beast cards
 */
export function getAllBeastCards(): BloomBeastCard[] {
  return getCardsByType<BloomBeastCard>('Bloom');
}

/**
 * Get all habitat cards
 */
export function getAllHabitatCards(): HabitatCard[] {
  return getCardsByType<HabitatCard>('Habitat');
}

/**
 * Create a deck instance for any affinity
 * This is a simplified deck class that works for all affinities
 */
export class Deck {
  readonly deckName: string;
  readonly affinity: 'Forest' | 'Fire' | 'Water' | 'Sky';
  private config: any;

  constructor(affinity: 'Forest' | 'Fire' | 'Water' | 'Sky') {
    // Import deckConfig here to avoid circular dependency
    const { getDeckConfig } = require('./deckConfig');
    this.config = getDeckConfig(affinity);
    this.affinity = affinity;
    this.deckName = this.config.name;
  }

  public getDeckCards() {
    return {
      beasts: this.config.beasts,
      habitats: this.config.habitats,
    };
  }

  public getAllCards(): AnyCard[] {
    const cards: AnyCard[] = [];
    this.config.beasts.forEach(({ card, quantity }: any) => {
      for (let i = 0; i < quantity; i++) {
        cards.push(card);
      }
    });
    this.config.habitats.forEach(({ card, quantity }: any) => {
      for (let i = 0; i < quantity; i++) {
        cards.push(card);
      }
    });
    return cards;
  }
}

/**
 * Create a deck for a specific affinity
 * @param affinity - The affinity type ('Forest', 'Fire', 'Water', or 'Sky')
 * @returns A Deck instance
 */
export function createDeck(affinity: 'Forest' | 'Fire' | 'Water' | 'Sky'): Deck {
  return new Deck(affinity);
}
