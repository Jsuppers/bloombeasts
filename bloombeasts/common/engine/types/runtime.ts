/**
 * Runtime Card Types
 *
 * Unified type system for cards during gameplay (battle, field, UI rendering).
 * These types extend card definitions with instance metadata and runtime state.
 *
 * REPLACES:
 * - BattleBeast, BattleMagic, BattleTrap, BattleBuff, BattleHabitat (from battle/types.ts)
 * - BloomBeastInstance (from engine/types/leveling.ts)
 * - CardDisplay (from utils/cardUtils.ts)
 *
 * ARCHITECTURE:
 * - CardInstance (screens/cards/types.ts): Minimal storage (id, cardId, currentXP)
 * - *Card types (engine/types/core.ts): Readonly catalog definitions
 * - Runtime* types (this file): Full gameplay state (extends card definitions)
 */

import type {
  BloomBeastCard,
  MagicCard,
  TrapCard,
  BuffCard,
  HabitatCard,
  Ability,
  Affinity,
  TrapActivation
} from './core';
import { CardType } from './core'; // Import as value for type guards
import type { Level, StatModifier, TemporaryEffect, PreventionEffect, TargetingRestrictions } from './leveling';

/**
 * Base runtime card interface
 * Extends card definitions with instance metadata
 */
export interface RuntimeCardBase {
  // Instance identity (from CardInstance)
  instanceId: string;    // Unique instance ID (e.g., "forest-beast-1-1")
  currentXP: number;     // Current XP for leveling
  level: number;         // Current level (1-9), computed from currentXP

  // All card definition properties inherited via extension
}

/**
 * Runtime Beast Card
 *
 * Unified type for beasts in any context:
 * - In deck/hand: Basic state (summoningSickness not set)
 * - On field: Full state with slotIndex, modifiers, effects
 * - In UI: All display properties available
 *
 * REPLACES: BattleBeast, BloomBeastInstance, CardDisplay (for beasts)
 */
export interface RuntimeBeast extends BloomBeastCard, RuntimeCardBase {
  // Card definition properties from BloomBeastCard:
  // - id: string (base card ID, e.g., "forest-beast")
  // - name: string
  // - type: CardType.Beast
  // - cost: number
  // - affinity: Affinity
  // - baseAttack: number (base stats without level bonuses or modifiers)
  // - baseHealth: number
  // - abilities: Ability[]
  // - titleColor?: string

  // Additional tracking (from BloomBeastInstance)
  cardId: string;          // Base card ID (same as id, kept for compatibility)

  // Runtime combat stats (includes level scaling and modifiers)
  currentAttack: number;   // Current attack (base + level + modifiers)
  currentHealth: number;   // Current health (decreases with damage)
  maxHealth: number;       // Maximum health for this level (base + level bonuses)

  // Game engine tracking (required for game engine)
  currentLevel: Level;             // Strongly-typed level (1-9)
  statusEffects: any[];            // Status effects like burn, freeze, etc.
  statModifiers?: StatModifier[];  // Active stat modifications

  // Battle state (optional - only set when card is in play)
  summoningSickness?: boolean;     // True when first played, prevents actions
  usedAbilityThisTurn?: boolean;   // True if ability was used this turn
  slotIndex?: number;              // Position on field (0-2)
  temporaryHP?: number;            // Temporary HP from abilities
  temporaryEffects?: TemporaryEffect[];  // Temporary stat/effect modifications
  immunities?: Array<string>;      // Immunity to specific effects
  cannotBeTargetedBy?: Array<string>;  // Targeting restrictions
  targetingRestrictions?: TargetingRestrictions;
  attackModifications?: Array<string>;  // Attack modifications
  preventions?: PreventionEffect[];     // Prevention effects (can't attack, etc.)
}

/**
 * Runtime Magic Card
 *
 * Used for magic cards in deck, hand, or being played.
 * Magic cards are one-time use and don't persist on field.
 *
 * REPLACES: BattleMagic
 */
export interface RuntimeMagic extends MagicCard, RuntimeCardBase {
  // Card definition properties from MagicCard:
  // - id, name, type: CardType.Magic, cost, abilities, targetRequired, titleColor

  // Magic cards have no additional runtime state
}

/**
 * Runtime Trap Card
 *
 * Used for traps in deck, hand, or trap zone.
 * Traps activate when their trigger condition is met.
 *
 * REPLACES: BattleTrap
 */
export interface RuntimeTrap extends TrapCard, RuntimeCardBase {
  // Card definition properties from TrapCard:
  // - id, name, type: CardType.Trap, cost, activation, abilities, titleColor

  // Trap-specific runtime state
  isActive?: boolean;         // True when trap is set and active
  turnsActive?: number;       // How many turns the trap has been active
}

/**
 * Runtime Buff Card
 *
 * Used for buff cards in deck, hand, or buff zone.
 * Buffs provide ongoing effects while on field.
 *
 * REPLACES: BattleBuff
 */
export interface RuntimeBuff extends BuffCard, RuntimeCardBase {
  // Card definition properties from BuffCard:
  // - id, name, type: CardType.Buff, cost, affinity, abilities, duration, titleColor

  // Buff-specific runtime state
  turnsRemaining?: number;    // Remaining turns (for temporary buffs)
  isActive?: boolean;         // True when buff is on field and active
}

/**
 * Runtime Habitat Card
 *
 * Used for habitat cards in deck, hand, or habitat zone.
 * Habitats provide field-wide effects.
 *
 * REPLACES: BattleHabitat
 */
export interface RuntimeHabitat extends HabitatCard, RuntimeCardBase {
  // Card definition properties from HabitatCard:
  // - id, name, type: CardType.Habitat, cost, affinity, abilities, titleColor

  // Habitat-specific runtime state
  isActive?: boolean;         // True when habitat is on field
  turnsActive?: number;       // How many turns habitat has been active
}

/**
 * Union type for all runtime cards
 *
 * REPLACES: BattleCard
 */
export type RuntimeCard = RuntimeBeast | RuntimeMagic | RuntimeTrap | RuntimeBuff | RuntimeHabitat;

/**
 * Type guards for runtime cards
 */
export function isRuntimeBeast(card: RuntimeCard): card is RuntimeBeast {
  return card.type === CardType.Beast;
}

export function isRuntimeMagic(card: RuntimeCard): card is RuntimeMagic {
  return card.type === CardType.Magic;
}

export function isRuntimeTrap(card: RuntimeCard): card is RuntimeTrap {
  return card.type === CardType.Trap;
}

export function isRuntimeBuff(card: RuntimeCard): card is RuntimeBuff {
  return card.type === CardType.Buff;
}

export function isRuntimeHabitat(card: RuntimeCard): card is RuntimeHabitat {
  return card.type === CardType.Habitat;
}
