/**
 * Water Affinity Deck - The Control Deck
 * Strategy: Defense, healing, and control via preventing effects and attacks
 */

import { BaseDeck, DeckCardEntry } from '../BaseDeck';
import { BloomBeastCard, HabitatCard } from '../../types/core';

// Import all Water cards
import { BUBBLEFIN } from './bubblefin';
import { AQUA_PEBBLE } from './aquaPebble';
import { DEWDROP_DRAKE } from './dewdropDrake';
import { KELP_CUB } from './kelpCub';
import { DEEP_SEA_GROTTO } from './deepSeaGrotto';

// Re-export all cards for external use
export { BUBBLEFIN } from './bubblefin';
export { AQUA_PEBBLE } from './aquaPebble';
export { DEWDROP_DRAKE } from './dewdropDrake';
export { KELP_CUB } from './kelpCub';
export { DEEP_SEA_GROTTO } from './deepSeaGrotto';

/**
 * Water Deck implementation
 */
export class WaterDeck extends BaseDeck {
  readonly deckName = 'Water Starter: The Control Deck';
  readonly affinity = 'Water' as const;

  protected getBeasts(): DeckCardEntry<BloomBeastCard>[] {
    return [
      { card: BUBBLEFIN, quantity: 4 },
      { card: AQUA_PEBBLE, quantity: 4 },
      { card: DEWDROP_DRAKE, quantity: 2 },
      { card: KELP_CUB, quantity: 3 },
    ];
  }

  protected getHabitats(): DeckCardEntry<HabitatCard>[] {
    return [
      { card: DEEP_SEA_GROTTO, quantity: 3 },
    ];
  }
}

/**
 * Factory function for backward compatibility
 */
export function getWaterDeckCards() {
  const deck = new WaterDeck();
  return deck.getDeckCards();
}