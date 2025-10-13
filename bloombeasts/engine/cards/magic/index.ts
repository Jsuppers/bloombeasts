/**
 * Magic Cards Registry
 */

import { MagicCard } from '../../types/core';
import { NECTAR_BLOCK } from './nectarBlock';
import { NECTAR_SURGE } from './nectarSurge';
import { CLEANSING_DOWNPOUR } from './cleansingDownpour';

// Re-export individual cards
export { NECTAR_BLOCK } from './nectarBlock';
export { NECTAR_SURGE } from './nectarSurge';
export { CLEANSING_DOWNPOUR } from './cleansingDownpour';

/**
 * Array of all magic cards
 */
export const MagicCards: MagicCard[] = [
  NECTAR_BLOCK,
  NECTAR_SURGE,
  CLEANSING_DOWNPOUR,
];
