/**
 * Constants for the leveling and progression system
 *
 * Balanced leveling system with incremental difficulty:
 * - Beast cards gain XP from battles (distributed evenly across deck)
 * - Player gains XP from mission victories
 * - Each level requires progressively more XP (exponential scaling)
 */

import { Level, StatGain } from '../types/leveling';

/**
 * XP required to reach each level from the previous level
 * Formula: XP = 10 * (2.0 ^ (level - 1))
 * This creates steeper exponential growth with significant difficulty increases
 */
export const XP_REQUIREMENTS: Record<Level, number> = {
  1: 0,      // Starting level
  2: 10,     // 10 XP total
  3: 20,     // 30 XP total
  4: 40,     // 70 XP total
  5: 80,     // 150 XP total
  6: 160,    // 310 XP total
  7: 320,    // 630 XP total
  8: 640,    // 1270 XP total
  9: 1280,   // 2550 XP total
};

/**
 * Cumulative stat gains at each level
 * Beasts gain +1 HP and +1 ATK every 2-3 levels on average
 */
export const STAT_PROGRESSION: Record<Level, StatGain> = {
  1: {
    cumulativeHP: 0,
    cumulativeATK: 0,
  },
  2: {
    cumulativeHP: 1,
    cumulativeATK: 0,
  },
  3: {
    cumulativeHP: 1,
    cumulativeATK: 1,
  },
  4: {
    cumulativeHP: 2,
    cumulativeATK: 1,
  },
  5: {
    cumulativeHP: 3,
    cumulativeATK: 2,
  },
  6: {
    cumulativeHP: 4,
    cumulativeATK: 3,
  },
  7: {
    cumulativeHP: 5,
    cumulativeATK: 4,
  },
  8: {
    cumulativeHP: 6,
    cumulativeATK: 5,
  },
  9: {
    cumulativeHP: 8,
    cumulativeATK: 6,
  },
};

export const MAX_LEVEL: Level = 9;

export const NECTAR_XP_COST = 1;
