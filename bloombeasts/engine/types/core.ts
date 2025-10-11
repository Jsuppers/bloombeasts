/**
 * Core type definitions for Bloom Beasts card game
 */

import type { StructuredAbility, AbilityEffect } from './abilities';

export type Affinity = 'Forest' | 'Fire' | 'Water' | 'Sky' | 'Generic';

export type CardType = 'Magic' | 'Trap' | 'Bloom' | 'Habitat';

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
 * Trigger conditions for trap cards
 */
export enum TrapTrigger {
  OnBloomPlay = 'OnBloomPlay',          // When opponent plays a Bloom Beast
  OnHabitatPlay = 'OnHabitatPlay',      // When opponent plays a Habitat
  OnMagicPlay = 'OnMagicPlay',          // When opponent plays a Magic card
  OnAttack = 'OnAttack',                // When opponent attacks
  OnDamage = 'OnDamage',                // When your units take damage
  OnDestroy = 'OnDestroy',              // When your units are destroyed
  OnDraw = 'OnDraw',                    // When opponent draws cards
  OnHeal = 'OnHeal',                    // When opponent heals
  OnAbilityUse = 'OnAbilityUse'        // When opponent uses an ability
}

/**
 * Trap condition types
 */
export enum TrapConditionType {
  CostAbove = 'cost-above',
  CostBelow = 'cost-below',
  AffinityMatches = 'affinity-matches',
  DamageAbove = 'damage-above'
}

/**
 * Structured trap activation
 */
export interface TrapActivation {
  trigger: TrapTrigger;
  condition?: {
    type: TrapConditionType;
    value?: number | Affinity;
  };
}

/**
 * Magic card
 */
export interface MagicCard extends Card {
  type: 'Magic';
  effects: AbilityEffect[];  // Structured effects instead of string
  targetRequired?: boolean;  // Whether the card needs a target
}

/**
 * Trap card
 */
export interface TrapCard extends Card {
  type: 'Trap';
  description: string;
  activation: TrapActivation;  // Structured activation instead of string
  effects: AbilityEffect[];     // Structured effects instead of string
}

/**
 * Habitat card
 */
export interface HabitatCard extends Card {
  type: 'Habitat';
  affinity: Affinity;
  ongoingEffects: AbilityEffect[];  // Effects that persist while habitat is active
  onPlayEffects?: AbilityEffect[];  // One-time effects when played
}

/**
 * Ability upgrade at a specific level
 */
export interface AbilityUpgrade {
  ability?: Ability;
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
  ability: Ability;  // Single ability field (trigger determines if passive/active)
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
export type AnyCard = MagicCard | TrapCard | HabitatCard | BloomBeastCard;
