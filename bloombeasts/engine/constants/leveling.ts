/**
 * Constants for the leveling and progression system
 */

import { Level, StatGain } from '../types/leveling';

/**
 * XP required to reach each level from the previous level
 */
export const XP_REQUIREMENTS: Record<Level, number> = {
  1: 0,  // Starting level
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
};

/**
 * Cumulative stat gains at each level
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
    cumulativeHP: 7,
    cumulativeATK: 6,
  },
};

export const MAX_LEVEL: Level = 9;

export const NECTAR_XP_COST = 1;
