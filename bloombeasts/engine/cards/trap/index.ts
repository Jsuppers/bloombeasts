/**
 * Trap Cards Registry
 */

import { TrapCard } from '../../types/core';
import { HABITAT_LOCK } from './habitatLock';

// Re-export individual cards
export { HABITAT_LOCK } from './habitatLock';

/**
 * Array of all trap cards
 */
export const TrapCards: TrapCard[] = [
  HABITAT_LOCK,
];
