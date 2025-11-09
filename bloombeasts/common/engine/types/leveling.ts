/**
 * Type definitions for the leveling and progression system
 */

import { Affinity } from './core';

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * XP source tracking
 */
export enum XPSource {
  Combat = 'Combat',
  EnergySacrifice = 'EnergySacrifice'
}

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
 * A single stat modifier
 */
export interface StatModifier {
  source: string;
  sourceId: string;           // ID of the card/ability that applied this
  stat: 'attack' | 'health' | 'maxHealth';
  value: number;              // Amount of modification (can be negative)
  duration?: 'permanent' | 'end-of-turn' | 'while-active';
  turnsRemaining?: number;    // For temporary effects
}