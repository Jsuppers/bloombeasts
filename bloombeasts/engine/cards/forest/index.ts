/**
 * Forest Affinity Deck - The Growth Deck
 * Strategy: Defensive growth, healing, and resource denial
 */

import { BaseDeck, DeckCardEntry } from '../BaseDeck';
import { BloomBeastCard, HabitatCard } from '../../types/core';

// Import all Forest cards
import { MOSSLET } from './mosslet';
import { ROOTLING } from './rootling';
import { MUSHROOMANCER } from './mushroomancer';
import { LEAF_SPRITE } from './leafSprite';
import { ANCIENT_FOREST } from './ancientForest';

// Re-export all cards for external use
export { MOSSLET } from './mosslet';
export { ROOTLING } from './rootling';
export { MUSHROOMANCER } from './mushroomancer';
export { LEAF_SPRITE } from './leafSprite';
export { ANCIENT_FOREST } from './ancientForest';

/**
 * Forest Deck implementation
 */
export class ForestDeck extends BaseDeck {
  readonly deckName = 'Forest Starter: The Growth Deck';
  readonly affinity = 'Forest' as const;

  protected getBeasts(): DeckCardEntry<BloomBeastCard>[] {
    return [
      { card: MOSSLET, quantity: 4 },
      { card: ROOTLING, quantity: 4 },
      { card: MUSHROOMANCER, quantity: 2 },
      { card: LEAF_SPRITE, quantity: 3 },
    ];
  }

  protected getHabitats(): DeckCardEntry<HabitatCard>[] {
    return [
      { card: ANCIENT_FOREST, quantity: 3 },
    ];
  }
}

/**
 * Factory function for backward compatibility
 */
export function getForestDeckCards() {
  const deck = new ForestDeck();
  return deck.getDeckCards();
}