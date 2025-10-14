/**
 * Interfaces for dependency injection and testability
 *
 * These interfaces define contracts for major system components,
 * allowing for easier testing, mocking, and alternative implementations.
 */

import { BloomBeastInstance, Level, XPSource } from '../types/leveling';
import { BloomBeastCard, Ability } from '../types/core';
import { GameState, Player } from '../types/game';
import { StructuredAbility } from '../types/abilities';
import { AbilityContext, EffectResult } from './AbilityProcessor';
import { CombatResult } from './CombatSystem';

/**
 * IAbilityProcessor - Processes ability effects in the game
 */
export interface IAbilityProcessor {
  /**
   * Process a structured ability
   */
  processAbility(
    ability: StructuredAbility,
    context: AbilityContext
  ): EffectResult[];
}

/**
 * ICombatSystem - Handles battle mechanics and turn flow
 */
export interface ICombatSystem {
  /**
   * Execute a combat phase between two players
   */
  executeCombat(
    gameState: GameState,
    attacker: Player,
    defender: Player
  ): Promise<void>;

  /**
   * Process an attack between two beasts
   */
  processAttack(
    attacker: BloomBeastInstance,
    defender: BloomBeastInstance,
    gameState: GameState
  ): number;

  /**
   * Apply damage to a beast
   */
  applyDamage(
    target: BloomBeastInstance,
    damage: number,
    source: BloomBeastInstance | null
  ): void;

  /**
   * Check if combat should end
   */
  checkWinCondition(gameState: GameState): CombatResult | null;

  /**
   * Reset combat system for new battle
   */
  reset(): void;
}

/**
 * ILevelingSystem - Handles XP gain, level ups, and stat progression
 */
export interface ILevelingSystem {
  /**
   * Add XP to a Bloom Beast
   */
  addXP(
    beast: BloomBeastInstance,
    amount: number,
    source: XPSource,
    card?: BloomBeastCard
  ): BloomBeastInstance;

  /**
   * Add XP from combat victory
   */
  addCombatXP(beast: BloomBeastInstance, card?: BloomBeastCard): BloomBeastInstance;

  /**
   * Add XP from nectar sacrifice
   */
  addNectarXP(
    beast: BloomBeastInstance,
    nectarSpent: number,
    card?: BloomBeastCard
  ): BloomBeastInstance;

  /**
   * Check if a beast can level up
   */
  canLevelUp(beast: BloomBeastInstance, card?: BloomBeastCard): boolean;

  /**
   * Level up a beast
   */
  levelUp(beast: BloomBeastInstance, card?: BloomBeastCard): BloomBeastInstance;

  /**
   * Get stat gains for leveling from previous level to current level
   */
  getStatGain(
    newLevel: Level,
    card?: BloomBeastCard
  ): { attackGain: number; healthGain: number };

  /**
   * Get total stat bonus at a given level
   */
  getTotalStatBonus(level: Level, card?: BloomBeastCard): { hp: number; atk: number };

  /**
   * Calculate current stats for a beast based on base stats and level
   */
  calculateCurrentStats(
    baseCard: BloomBeastCard,
    level: Level
  ): { attack: number; health: number };

  /**
   * Create a new beast instance from a card
   */
  createBeastInstance(
    card: BloomBeastCard,
    instanceId: string,
    slotIndex: number
  ): BloomBeastInstance;

  /**
   * Get XP requirement for next level
   */
  getXPRequirement(currentLevel: Level, card?: BloomBeastCard): number | null;

  /**
   * Get current abilities for a beast based on its level
   */
  getCurrentAbilities(card: BloomBeastCard, level: Level): { ability: Ability };

  /**
   * Check if a beast has an ability upgrade at the current level
   */
  hasAbilityUpgrade(card: BloomBeastCard, level: Level): boolean;
}
