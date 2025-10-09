/**
 * Deck Builder Utilities - Construct and manage decks
 */

import { AnyCard } from '../types/core';
import { getSharedCoreCards } from '../cards/shared';
import { ForestDeck } from '../cards/forest';
import { FireDeck } from '../cards/fire';
import { WaterDeck } from '../cards/water';
import { SkyDeck } from '../cards/sky';

export type DeckType = 'Forest' | 'Fire' | 'Water' | 'Sky';

export interface DeckList {
  name: string;
  affinity: DeckType;
  cards: AnyCard[];
  totalCards: number;
}

/**
 * Expand cards based on quantity
 */
function expandCards<T extends AnyCard>(cardQuantities: Array<{ card: T; quantity: number }>): T[] {
  const result: T[] = [];

  for (const { card, quantity } of cardQuantities) {
    for (let i = 0; i < quantity; i++) {
      // Create a unique copy with an instance ID
      result.push({
        ...card,
        instanceId: `${card.id}-${i + 1}`,
      });
    }
  }

  return result;
}

/**
 * Deck configurations using new class-based approach
 */
const DECK_INSTANCES = {
  Forest: new ForestDeck(),
  Fire: new FireDeck(),
  Water: new WaterDeck(),
  Sky: new SkyDeck(),
};

/**
 * Build a complete deck with shared cards and affinity-specific cards
 */
function buildDeck(type: DeckType): DeckList {
  // Use new class-based approach for all decks
  const deck = DECK_INSTANCES[type];
  const affinityCards = deck.getDeckCards();

  const sharedCards = expandCards(getSharedCoreCards());
  const beasts = expandCards(affinityCards.beasts);
  const habitats = expandCards(affinityCards.habitats);

  const allCards = [...sharedCards, ...beasts, ...habitats];

  return {
    name: deck.deckName,
    affinity: type,
    cards: allCards,
    totalCards: allCards.length,
  };
}

/**
 * Build Forest starter deck
 */
export function buildForestDeck(): DeckList {
  return buildDeck('Forest');
}

/**
 * Build Fire starter deck
 */
export function buildFireDeck(): DeckList {
  return buildDeck('Fire');
}

/**
 * Build Water starter deck
 */
export function buildWaterDeck(): DeckList {
  return buildDeck('Water');
}

/**
 * Build Sky starter deck
 */
export function buildSkyDeck(): DeckList {
  return buildDeck('Sky');
}

/**
 * Get all starter decks
 */
export function getAllStarterDecks(): DeckList[] {
  return (['Forest', 'Fire', 'Water', 'Sky'] as DeckType[]).map(buildDeck);
}

/**
 * Get a specific starter deck by type
 */
export function getStarterDeck(type: DeckType): DeckList {
  return buildDeck(type);
}

/**
 * Shuffle a deck
 */
export function shuffleDeck(cards: AnyCard[]): AnyCard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Validate deck (30 cards required)
 */
export function validateDeck(cards: AnyCard[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (cards.length !== 30) {
    errors.push(`Deck must contain exactly 30 cards. Current: ${cards.length}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}