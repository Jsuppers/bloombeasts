/**
 * Fire Affinity Deck - The Aggro Deck
 * Strategy: Direct damage, persistent Burn effects, overwhelming early ATK
 */

import { BaseDeck, DeckCardEntry } from '../BaseDeck';
import { BloomBeastCard, HabitatCard } from '../../types/core';

// Import all Fire cards
import { CINDER_PUP } from './cinderPup';
import { BLAZEFINCH } from './blazefinch';
import { MAGMITE } from './magmite';
import { CHARCOIL } from './charcoil';
import { VOLCANIC_SCAR } from './volcanicScar';

// Re-export all cards for external use
export { CINDER_PUP } from './cinderPup';
export { BLAZEFINCH } from './blazefinch';
export { MAGMITE } from './magmite';
export { CHARCOIL } from './charcoil';
export { VOLCANIC_SCAR } from './volcanicScar';

/**
 * Fire Deck implementation
 */
export class FireDeck extends BaseDeck {
  readonly deckName = 'Fire Starter: The Aggro Deck';
  readonly affinity = 'Fire' as const;

  protected getBeasts(): DeckCardEntry<BloomBeastCard>[] {
    return [
      { card: CINDER_PUP, quantity: 4 },
      { card: BLAZEFINCH, quantity: 4 },
      { card: MAGMITE, quantity: 2 },
      { card: CHARCOIL, quantity: 3 },
    ];
  }

  protected getHabitats(): DeckCardEntry<HabitatCard>[] {
    return [
      { card: VOLCANIC_SCAR, quantity: 3 },
    ];
  }
}

/**
 * Factory function for backward compatibility
 */
export function getFireDeckCards() {
  const deck = new FireDeck();
  return deck.getDeckCards();
}