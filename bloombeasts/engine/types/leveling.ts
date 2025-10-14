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
 * Source of a stat modification
 */
export enum StatModifierSource {
  Base = 'base',              // Base stats from card + level
  BuffZone = 'buff-zone',     // From buff cards in buff zone
  Ability = 'ability',        // From triggered abilities (temporary)
  Magic = 'magic',            // From magic card effects
  Habitat = 'habitat',        // From habitat cards
  Equipment = 'equipment'     // Future: From equipment
}

/**
 * A single stat modifier
 */
export interface StatModifier {
  source: StatModifierSource;
  sourceId: string;           // ID of the card/ability that applied this
  stat: 'attack' | 'health' | 'maxHealth';
  value: number;              // Amount of modification (can be negative)
  duration?: 'permanent' | 'end-of-turn' | 'while-active';
  turnsRemaining?: number;    // For temporary effects
}

/**
 * Beast instance with leveling state
 */
export interface BloomBeastInstance {
  cardId: string;
  instanceId: string;

  // Card properties (from blueprint)
  name: string;
  affinity: Affinity;

  // Base stats (card stats + level bonuses, never includes buffs/modifiers)
  baseAttack: number;
  baseHealth: number;

  // Current stats (calculated from base + all modifiers)
  currentLevel: Level;
  currentXP: number;
  currentAttack: number;
  currentHealth: number;
  maxHealth: number;

  // Stat modification tracking
  statModifiers?: StatModifier[];

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