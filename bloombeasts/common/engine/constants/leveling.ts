/**
 * Constants for the leveling and progression system
 *
 * Leveling system:
 * - Beast cards gain XP from battles (distributed evenly across deck)
 * - Each level increases stats by 10% (Level 1 = 100%, Level 9 = 180%)
 * - XP thresholds use exponential scaling for progressively harder leveling
 */

import { Level } from '../types/leveling';

/**
 * Cumulative XP thresholds for card leveling
 * Level 2: 100 XP, Level 3: 300 XP, etc.
 */
export const CARD_XP_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  700,    // Level 4
  1500,   // Level 5
  3100,   // Level 6
  6300,   // Level 7
  12700,  // Level 8
  25500,  // Level 9
];

export const MAX_LEVEL: Level = 9;

export const ENERGY_XP_COST = 1;
