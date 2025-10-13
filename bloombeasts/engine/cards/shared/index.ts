/**
 * Shared Core Cards - Present in all starter decks
 */

import { MagicCard, TrapCard } from '../../types/core';
import { DeckCardEntry } from '../BaseDeck';

// Import all shared cards from their new locations
import { NECTAR_BLOCK } from '../magic/nectarBlock';
import { NECTAR_SURGE } from '../magic/nectarSurge';
import { CLEANSING_DOWNPOUR } from '../magic/cleansingDownpour';
import { HABITAT_LOCK } from '../trap/habitatLock';

// Re-export all cards
export { NECTAR_BLOCK } from '../magic/nectarBlock';
export { NECTAR_SURGE } from '../magic/nectarSurge';
export { CLEANSING_DOWNPOUR } from '../magic/cleansingDownpour';
export { HABITAT_LOCK } from '../trap/habitatLock';

/**
 * Get all shared core cards with quantities
 */
export function getSharedCoreCards(): DeckCardEntry<MagicCard | TrapCard>[] {
  return [
    { card: NECTAR_BLOCK, quantity: 10 },
    { card: NECTAR_SURGE, quantity: 2 },
    { card: CLEANSING_DOWNPOUR, quantity: 1 },
    { card: HABITAT_LOCK, quantity: 1 },
  ];
}