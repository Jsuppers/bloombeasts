/**
 * Deck Builder Utilities - Construct and manage decks
 */

import { AnyCard } from '../types/core';
import {
  getSharedCoreCards,
  getDeckConfig,
  type AffinityType,
  type DeckCardEntry
} from '../cards';

// Module-level catalog manager reference for deck builder
// Set via setCatalogManagerForDeckBuilder() which is called by BloomBeastsGame
let _deckBuilderCatalogManager: any = null;

/**
 * Set the catalog manager instance for deck builder functions
 * Called by BloomBeastsGame during construction
 */
export function setCatalogManagerForDeckBuilder(catalogManager: any): void {
  _deckBuilderCatalogManager = catalogManager;
}

export type DeckType = AffinityType;

export interface DeckList {
  name: string;
  affinity: DeckType;
  cards: AnyCard[];
  totalCards: number;
}

/**
 * Expand cards based on quantity
 */
function expandCards<T extends AnyCard>(cardQuantities: DeckCardEntry<T>[]): T[] {
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
 * Build a complete deck with shared cards and affinity-specific cards
 */
function buildDeck(type: DeckType): DeckList {
  if (!_deckBuilderCatalogManager) {
    console.error('[deckBuilder] catalogManager not initialized');
    return { name: '', affinity: type, cards: [], totalCards: 0 };
  }

  // Get deck configuration from centralized config
  const deckConfig = getDeckConfig(_deckBuilderCatalogManager, type);

  const sharedCards = expandCards(getSharedCoreCards(_deckBuilderCatalogManager));
  const beasts = expandCards(deckConfig.beasts);
  const habitats = expandCards(deckConfig.habitats);

  const allCards = [...sharedCards, ...beasts, ...habitats];

  return {
    name: deckConfig.name,
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
  // Use simple Forest starter deck
  return buildDeck('Forest');
}

/**
 * Get a quick win deck with just a few low-level beasts for fast testing
 * This creates a minimal deck for quick victories in testing
 */
export function quickWinDeck(type: DeckType): DeckList {
  if (!_deckBuilderCatalogManager) {
    console.error('[deckBuilder] catalogManager not initialized');
    return { name: '', affinity: type, cards: [], totalCards: 0 };
  }

  const deckConfig = getDeckConfig(_deckBuilderCatalogManager, type);
  const allCards: AnyCard[] = [];

  // Add just a few level 1 beasts (3 total - easy to draw and summon quickly)
  const beastEntry = deckConfig.beasts[0]; // Get the first beast type
  if (beastEntry) {
    for (let i = 1; i <= 3; i++) {
      allCards.push({
        ...beastEntry.card,
        instanceId: `${beastEntry.card.id}-${i}`,
      } as unknown as AnyCard);
    }
  }

  // Add 27 Nectar Blocks for fast summoning
  const nectarBlock = _deckBuilderCatalogManager.getCard('nectar-block');
  if (nectarBlock) {
    for (let i = 1; i <= 27; i++) {
      allCards.push({
        ...nectarBlock,
        instanceId: `nectar-block-${i}`,
      } as unknown as AnyCard);
    }
  }

  return {
    name: `${deckConfig.name} (Quick Win)`,
    affinity: type,
    cards: allCards,
    totalCards: allCards.length,
  };
}

/**
 * Get a testing deck with 1 of each card (for easy testing)
 * This includes 1 of every card in the game across all affinities
 */
export function getTestingDeck(type: DeckType): DeckList {
  if (!_deckBuilderCatalogManager) {
    console.error('[deckBuilder] catalogManager not initialized');
    return { name: '', affinity: type, cards: [], totalCards: 0 };
  }

  const deckConfig = getDeckConfig(_deckBuilderCatalogManager, type);

  // Get 1 of each card from all affinities
  const allCards: AnyCard[] = [];

  // Add shared cards (Magic, Trap) - 1 of each
  const sharedCards = getSharedCoreCards(_deckBuilderCatalogManager);
  sharedCards.forEach(({ card }) => {
    allCards.push({
      ...card,
      instanceId: `${card.id}-1`,
    } as unknown as AnyCard);
  });

  // Add buff cards - 1 of each
  const buffCards = _deckBuilderCatalogManager.getAllBuffCards();
  buffCards.forEach((card: any) => {
    allCards.push({
      ...card,
      instanceId: `${card.id}-1`,
    } as unknown as AnyCard);
  });

  // Add all beasts from all affinities - 1 of each
  (['Forest', 'Fire', 'Water', 'Sky'] as DeckType[]).forEach(affinity => {
    const affinityConfig = getDeckConfig(_deckBuilderCatalogManager, affinity);

    // Add beasts
    affinityConfig.beasts.forEach(({ card }) => {
      allCards.push({
        ...card,
        instanceId: `${card.id}-1`,
      } as unknown as AnyCard);
    });

    // Add habitats
    affinityConfig.habitats.forEach(({ card }) => {
      allCards.push({
        ...card,
        instanceId: `${card.id}-1`,
      } as unknown as AnyCard);
    });
  });

  return {
    name: `${deckConfig.name} (Testing)`,
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
