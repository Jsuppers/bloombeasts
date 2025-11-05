/**
 * Core type definitions for BloomBeasts card game
 */

import type { StructuredAbility, AbilityEffect } from './abilities';

export enum Affinity {
  Forest = 'Forest',
  Fire = 'Fire',
  Water = 'Water',
  Sky = 'Sky',
  Generic = 'Generic',
  Boss = 'Boss'
}

export enum CardType {
  Magic = 'Magic',
  Trap = 'Trap',
  Beast = 'Beast',
  Habitat = 'Habitat',
  Buff = 'Buff'
}

// Counter types removed to reduce game complexity

/**
 * Base card interface
 */
export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  titleColor?: string;  // Optional custom color for card title (hex color, e.g., '#000000')
  instanceId?: string;  // Optional instance ID for tracking unique card instances in battle
  level?: number;  // Optional runtime level for card instances (not present in card definitions)
}

/**
 * Trigger conditions for trap cards
 */
export enum TrapTrigger {
  OnBeastPlay = 'OnBeastPlay',          // When opponent plays a Beast
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
  type: CardType.Magic;
  abilities: Ability[];  // Standardized to use abilities like Beast cards
  targetRequired?: boolean;  // Whether the card needs a target
}

/**
 * Trap card
 */
export interface TrapCard extends Card {
  type: CardType.Trap;
  activation: TrapActivation;  // Structured activation instead of string
  abilities: Ability[];         // Standardized to use abilities like Beast cards
}

/**
 * Habitat card
 */
export interface HabitatCard extends Card {
  type: CardType.Habitat;
  affinity: Affinity;
  abilities: Ability[];  // Standardized to use abilities like Beast cards
}

/**
 * Buff card - stays on board and provides ongoing effects
 */
export interface BuffCard extends Card {
  type: CardType.Buff;
  affinity?: Affinity;  // Optional affinity for buff cards
  abilities: Ability[];  // Standardized to use abilities like Beast cards
  duration?: number;  // Optional turn duration (undefined = permanent)
}

/**
 * Beast card
 *
 * All cards use standard leveling progression:
 * - Standard XP requirements (10, 20, 40, 80, 160, 320, 640, 1280)
 * - Standard stat boosts (+0-8 HP, +0-6 ATK over 9 levels)
 * - Abilities remain constant across all levels
 */
export interface BloomBeastCard extends Card {
  type: CardType.Beast;
  affinity: Affinity;
  baseAttack: number;
  baseHealth: number;
  abilities: Ability[];  // Array of passive abilities (constant across all levels)
  // Note: Card definitions are blueprints. All cards (Beast, Magic, Trap, Habitat, Buff)
  // start at level 1 with 0 XP when added to player's collection as CardInstance objects.
  // Level and XP tracking is handled by the CardInstance interface, not the card definitions.
}

/**
 * Simple ability definition (for backward compatibility)
 */
export interface SimpleAbility {
  name: string;
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
export type AnyCard = MagicCard | TrapCard | HabitatCard | BloomBeastCard | BuffCard;
