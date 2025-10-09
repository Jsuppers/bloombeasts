/**
 * Shared Core Cards - Present in all starter decks
 */

import { ResourceCard, MagicCard, TrapCard } from '../../types/core';
import { DeckCardEntry } from '../BaseDeck';

// Import all shared cards
import { NECTAR_BLOCK } from './nectarBlock';
import { NECTAR_SURGE } from './nectarSurge';
import { CLEANSING_DOWNPOUR } from './cleansingDownpour';
import { HABITAT_LOCK } from './habitatLock';

// Re-export all cards
export { NECTAR_BLOCK } from './nectarBlock';
export { NECTAR_SURGE } from './nectarSurge';
export { CLEANSING_DOWNPOUR } from './cleansingDownpour';
export { HABITAT_LOCK } from './habitatLock';

/**
 * Get all shared core cards with quantities
 */
export function getSharedCoreCards(): DeckCardEntry<ResourceCard | MagicCard | TrapCard>[] {
  return [
    { card: NECTAR_BLOCK, quantity: 10 },
    { card: NECTAR_SURGE, quantity: 2 },
    { card: CLEANSING_DOWNPOUR, quantity: 1 },
    { card: HABITAT_LOCK, quantity: 1 },
  ];
}