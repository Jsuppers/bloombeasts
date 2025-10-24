/**
 * Magic Cards Registry
 */

import { MagicCard } from '../../types/core';
import { NECTAR_BLOCK } from './nectarBlock';
import { NECTAR_SURGE } from './nectarSurge';
import { CLEANSING_DOWNPOUR } from './cleansingDownpour';
import { NECTAR_DRAIN } from './nectarDrain';
import { AETHER_SWAP } from './aetherSwap';
import { ELEMENTAL_BURST } from './elementalBurst';
import { LIGHTNING_STRIKE } from './lightningStrike';
import { PURIFY } from './purify';
import { OVERGROWTH } from './overgrowth';
import { POWER_UP } from './powerUp';

// Re-export individual cards
export { NECTAR_BLOCK } from './nectarBlock';
export { NECTAR_SURGE } from './nectarSurge';
export { CLEANSING_DOWNPOUR } from './cleansingDownpour';
export { NECTAR_DRAIN } from './nectarDrain';
export { AETHER_SWAP } from './aetherSwap';
export { ELEMENTAL_BURST } from './elementalBurst';
export { LIGHTNING_STRIKE } from './lightningStrike';
export { PURIFY } from './purify';
export { OVERGROWTH } from './overgrowth';
export { POWER_UP } from './powerUp';

/**
 * Array of all magic cards
 */
export const MagicCards: MagicCard[] = [
  NECTAR_BLOCK,
  NECTAR_SURGE,
  CLEANSING_DOWNPOUR,
  NECTAR_DRAIN,
  AETHER_SWAP,
  ELEMENTAL_BURST,
  LIGHTNING_STRIKE,
  PURIFY,
  OVERGROWTH,
  POWER_UP,
];
