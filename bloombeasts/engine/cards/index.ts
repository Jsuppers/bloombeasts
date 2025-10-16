/**
 * Central card registry
 */

import { FireDeck } from './fire';
import { WaterDeck } from './water';
import { ForestDeck } from './forest';
import { SkyDeck } from './sky';
import { MagicCards } from './magic';
import { TrapCards } from './trap';
import { BATTLE_FURY, NATURES_BLESSING, MYSTIC_SHIELD, SWIFT_WIND } from './buff';
import { BloomBeastCard, HabitatCard, TrapCard, MagicCard, BuffCard, AnyCard } from '../types/core';
import { SimpleMap, arrayFrom } from '../../utils/polyfills';

// Export deck classes
export { FireDeck } from './fire';
export { WaterDeck } from './water';
export { ForestDeck } from './forest';
export { SkyDeck } from './sky';

// Export magic, trap, and buff cards
export * from './magic';
export * from './trap';
export * from './buff';

/**
 * Get all cards from all decks
 * Also adds rarity property for reward generation
 */
export function getAllCards(): AnyCard[] {
  const allCards: AnyCard[] = [];

  // Create instances of each deck
  const decks = [
    new FireDeck(),
    new WaterDeck(),
    new ForestDeck(),
    new SkyDeck(),
  ];

  // Collect all unique cards
  const cardMap = new SimpleMap<string, AnyCard>();

  // Add cards from decks (Bloom beasts and Habitats)
  decks.forEach(deck => {
    const deckCards = deck.getAllCards();
    deckCards.forEach(card => {
      if (!cardMap.has(card.id)) {
        // Add rarity based on card stats for reward system
        if (card.type === 'Bloom') {
          const beast = card as BloomBeastCard;
          // Assign rarity based on nectar cost and stats
          if (beast.cost >= 5) {
            (beast as any).rarity = 'rare';
          } else if (beast.cost >= 3) {
            (beast as any).rarity = 'uncommon';
          } else {
            (beast as any).rarity = 'common';
          }
        } else {
          // Non-beast cards are common by default
          (card as any).rarity = 'common';
        }
        cardMap.set(card.id, card);
      }
    });
  });

  // Add Magic cards
  MagicCards.forEach(card => {
    if (!cardMap.has(card.id)) {
      (card as any).rarity = 'common';
      cardMap.set(card.id, card);
    }
  });

  // Add Trap cards
  TrapCards.forEach(card => {
    if (!cardMap.has(card.id)) {
      (card as any).rarity = 'common';
      cardMap.set(card.id, card);
    }
  });

  // Add Buff cards
  [BATTLE_FURY, NATURES_BLESSING, MYSTIC_SHIELD, SWIFT_WIND].forEach(card => {
    if (!cardMap.has(card.id)) {
      (card as any).rarity = 'common';
      cardMap.set(card.id, card as BuffCard);
    }
  });

  return cardMap.values();
}

/**
 * Get cards by affinity
 */
export function getCardsByAffinity(
  affinity: 'Fire' | 'Water' | 'Forest' | 'Sky'
): (BloomBeastCard | HabitatCard)[] {
  return getAllCards().filter(card =>
    'affinity' in card && card.affinity === affinity
  ) as (BloomBeastCard | HabitatCard)[];
}

/**
 * Get cards by type
 */
export function getCardsByType<T extends 'Beast' | 'Habitat' | 'Trap' | 'Magic'>(
  type: T
): T extends 'Beast' ? BloomBeastCard[] :
   T extends 'Habitat' ? HabitatCard[] :
   T extends 'Trap' ? TrapCard[] :
   T extends 'Magic' ? MagicCard[] :
   never {
  return getAllCards().filter(card => card.type === type) as any;
}