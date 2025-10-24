/**
 * Trap Cards Registry
 */

import { TrapCard } from '../../types/core';
import { HABITAT_LOCK } from './habitatLock';
import { HABITAT_SHIELD } from './habitatShield';
import { EMERGENCY_BLOOM } from './emergencyBloom';
import { BEAR_TRAP } from './bearTrap';
import { MAGIC_SHIELD } from './magicShield';
import { THORN_SNARE } from './thornSnare';
import { VAPORIZE } from './vaporize';
import { XP_HARVEST } from './xpHarvest';

// Re-export individual cards
export { HABITAT_LOCK } from './habitatLock';
export { HABITAT_SHIELD } from './habitatShield';
export { EMERGENCY_BLOOM } from './emergencyBloom';
export { BEAR_TRAP } from './bearTrap';
export { MAGIC_SHIELD } from './magicShield';
export { THORN_SNARE } from './thornSnare';
export { VAPORIZE } from './vaporize';
export { XP_HARVEST } from './xpHarvest';

/**
 * Array of all trap cards
 */
export const TrapCards: TrapCard[] = [
  HABITAT_LOCK,
  HABITAT_SHIELD,
  EMERGENCY_BLOOM,
  BEAR_TRAP,
  MAGIC_SHIELD,
  THORN_SNARE,
  VAPORIZE,
  XP_HARVEST,
];
