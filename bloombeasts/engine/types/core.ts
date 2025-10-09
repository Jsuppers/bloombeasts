/**
 * Core type definitions for Bloom Beasts card game
 */

import type { StructuredAbility } from './abilities';

export type Affinity = 'Forest' | 'Fire' | 'Water' | 'Sky' | 'Generic';

export type CardType = 'Resource' | 'Magic' | 'Trap' | 'Bloom' | 'Habitat';

export type CounterType = 'XP' | 'Spore' | 'Burn' | 'Freeze' | 'Soot' | 'Entangle';

export interface Counter {
  type: CounterType;
  amount: number;
}

/**
 * Base card interface
 */
export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
}

/**
 * Resource card (Nectar Block)
 */
export interface ResourceCard extends Card {
  type: 'Resource';
  effect: string;
}

/**
 * Magic card
 */
export interface MagicCard extends Card {
  type: 'Magic';
  effect: string;
}

/**
 * Trap card
 */
export interface TrapCard extends Card {
  type: 'Trap';
  activation: string;
  effect: string;
}

/**
 * Habitat card
 */
export interface HabitatCard extends Card {
  type: 'Habitat';
  affinity: Affinity;
  habitatShiftEffect: string;
}

/**
 * Ability upgrade at a specific level
 */
export interface AbilityUpgrade {
  passiveAbility?: Ability;
  bloomAbility?: Ability;
}

/**
 * Custom leveling configuration for a Bloom Beast
 */
export interface LevelingConfig {
  /** Custom XP requirements per level (overrides defaults) */
  xpRequirements?: Partial<Record<2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, number>>;
  /** Custom stat gains per level (overrides defaults) - cumulative values */
  statGains?: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, { hp: number; atk: number }>;
  /** Ability upgrades at specific levels (4, 7, 9) */
  abilityUpgrades?: Partial<Record<4 | 7 | 9, AbilityUpgrade>>;
}

/**
 * Bloom Beast card
 */
export interface BloomBeastCard extends Card {
  type: 'Bloom';
  affinity: Affinity;
  baseAttack: number;
  baseHealth: number;
  passiveAbility: Ability;
  bloomAbility: Ability;
  /** Optional custom leveling configuration */
  levelingConfig?: LevelingConfig;
}

/**
 * Simple ability definition (for backward compatibility)
 */
export interface SimpleAbility {
  name: string;
  description: string;
  trigger?: 'OnSummon' | 'OnAttack' | 'OnDamage' | 'OnDestroy' | 'StartOfTurn' | 'EndOfTurn' | 'Passive' | 'Activated';
}

/**
 * Ability can be either simple (text-only) or structured (with effects)
 * Import StructuredAbility from './abilities' for full type
 */
export type Ability = SimpleAbility | StructuredAbility;

/**
 * Union type for all cards
 */
export type AnyCard = ResourceCard | MagicCard | TrapCard | HabitatCard | BloomBeastCard;
