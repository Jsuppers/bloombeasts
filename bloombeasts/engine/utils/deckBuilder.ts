/**
 * Deck Builder Utilities - Construct and manage decks
 */

import { AnyCard } from '../types/core';
import { getSharedCoreCards } from '../cards/shared';
import { ForestDeck } from '../cards/forest';
import { FireDeck } from '../cards/fire';
import { WaterDeck } from '../cards/water';
import { SkyDeck } from '../cards/sky';
import { BATTLE_FURY, NATURES_BLESSING, MYSTIC_SHIELD, SWIFT_WIND } from '../cards/buff';

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
  // TESTING: Use testing deck with 1 of each card
  return getTestingDeck(type);

  // ORIGINAL: Starter deck with multiple copies
  // return buildDeck(type);
}

/**
 * Get a testing deck with 1 of each card (for easy testing)
 * This includes 1 of every card in the game across all affinities
 */
export function getTestingDeck(type: DeckType): DeckList {
  const deck = DECK_INSTANCES[type];

  // Get 1 of each card from all affinities
  const allCards: AnyCard[] = [];

  // Add shared cards (Magic, Trap) - 1 of each
  const sharedCards = getSharedCoreCards();
  sharedCards.forEach(({ card }) => {
    allCards.push({
      ...card,
      instanceId: `${card.id}-1`,
    } as unknown as AnyCard);
  });

  // Add buff cards - 1 of each
  const buffCards = [BATTLE_FURY, NATURES_BLESSING, MYSTIC_SHIELD, SWIFT_WIND];
  buffCards.forEach(card => {
    allCards.push({
      ...card,
      instanceId: `${card.id}-1`,
    } as unknown as AnyCard);
  });

  // Add all beasts from all affinities - 1 of each
  (['Forest', 'Fire', 'Water', 'Sky'] as DeckType[]).forEach(affinity => {
    const affinityDeck = DECK_INSTANCES[affinity];
    const cards = affinityDeck.getDeckCards();

    // Add beasts
    cards.beasts.forEach(({ card }) => {
      allCards.push({
        ...card,
        instanceId: `${card.id}-1`,
      } as unknown as AnyCard);
    });

    // Add habitats
    cards.habitats.forEach(({ card }) => {
      allCards.push({
        ...card,
        instanceId: `${card.id}-1`,
      } as unknown as AnyCard);
    });
  });

  return {
    name: `${deck.deckName} (Testing)`,
    affinity: type,
    cards: allCards,
    totalCards: allCards.length,
  };
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
