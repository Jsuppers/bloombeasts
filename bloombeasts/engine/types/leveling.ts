/**
 * Type definitions for the leveling and progression system
 */

import { Affinity, Counter } from './core';

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Stat progression by level
 */
export interface StatGain {
  cumulativeHP: number;
  cumulativeATK: number;
}

/**
 * XP source tracking
 */
export type XPSource = 'Combat' | 'NectarSacrifice';

/**
 * Temporary effect on a unit
 */
export interface TemporaryEffect {
  type: string;
  stat?: 'attack' | 'health' | 'both';
  value?: number;
  duration: string;
  turnsRemaining: number;
}

/**
 * Prevention effect on a unit
 */
export interface PreventionEffect {
  type: 'prevent-attack' | 'prevent-abilities';
  duration: string;
}

/**
 * Targeting restrictions
 */
export interface TargetingRestrictions {
  costThreshold?: number;
}

/**
 * Beast instance with leveling state
 */
export interface BloomBeastInstance {
  cardId: string;
  instanceId: string;

  // Current stats
  currentLevel: Level;
  currentXP: number;
  currentAttack: number;
  currentHealth: number;
  maxHealth: number;

  // Counters and effects
  counters: Counter[];
  statusEffects: any[];  // Status effects like burn, freeze, etc.

  // Positioning
  slotIndex: number;

  // Combat state
  summoningSickness: boolean;

  // New properties for ability system
  temporaryHP?: number;
  temporaryEffects?: TemporaryEffect[];
  immunities?: Array<string>;
  cannotBeTargetedBy?: Array<string>;
  targetingRestrictions?: TargetingRestrictions;
  attackModifications?: Array<string>;
  preventions?: PreventionEffect[];
}