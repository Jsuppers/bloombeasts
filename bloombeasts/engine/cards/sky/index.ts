/**
 * Sky Affinity Deck - The Utility Deck
 * Strategy: Mobility, card draw, and team-wide utility bonuses
 */

import { BaseDeck, DeckCardEntry } from '../BaseDeck';
import { BloomBeastCard, HabitatCard } from '../../types/core';

// Import all Sky cards
import { CIRRUS_FLOOF } from './cirrusFloof';
import { GALE_GLIDER } from './galeGlider';
import { STAR_BLOOM } from './starBloom';
import { AERO_MOTH } from './aeroMoth';
import { CLEAR_ZENITH } from './clearZenith';

// Re-export all cards for external use
export { CIRRUS_FLOOF } from './cirrusFloof';
export { GALE_GLIDER } from './galeGlider';
export { STAR_BLOOM } from './starBloom';
export { AERO_MOTH } from './aeroMoth';
export { CLEAR_ZENITH } from './clearZenith';

/**
 * Sky Deck implementation
 */
export class SkyDeck extends BaseDeck {
  readonly deckName = 'Sky Starter: The Utility Deck';
  readonly affinity = 'Sky' as const;

  protected getBeasts(): DeckCardEntry<BloomBeastCard>[] {
    return [
      { card: CIRRUS_FLOOF, quantity: 4 },
      { card: GALE_GLIDER, quantity: 4 },
      { card: STAR_BLOOM, quantity: 2 },
      { card: AERO_MOTH, quantity: 3 },
    ];
  }

  protected getHabitats(): DeckCardEntry<HabitatCard>[] {
    return [
      { card: CLEAR_ZENITH, quantity: 3 },
    ];
  }
}

/**
 * Factory function for backward compatibility
 */
export function getSkyDeckCards() {
  const deck = new SkyDeck();
  return deck.getDeckCards();
}