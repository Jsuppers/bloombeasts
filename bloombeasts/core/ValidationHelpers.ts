/**
 * ValidationHelpers - Validation utilities for critical operations
 *
 * Phase 4: Code Hygiene - Add validation before critical operations
 */

import { Logger } from '../common/engine/utils/Logger';
import type { PlayerData } from '../types';
import type { RuntimeCard } from '../common/engine/types/runtime';
import type { BattleState } from '../screens/battle/engine/types';
import { GAME_CONSTANTS } from './GameConstants';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * ValidationHelpers - Centralized validation logic
 */
export class ValidationHelpers {
  /**
   * Validate deck before starting battle
   */
  static validateDeck(deckCards: RuntimeCard[]): ValidationResult {
    const errors: string[] = [];

    // Check deck size
    if (!deckCards || deckCards.length === 0) {
      errors.push('Deck is empty');
      return { valid: false, errors };
    }

    if (deckCards.length < GAME_CONSTANTS.MIN_DECK_SIZE) {
      errors.push(`Deck must have at least ${GAME_CONSTANTS.MIN_DECK_SIZE} card(s) (current: ${deckCards.length})`);
    }

    // Check for valid cards
    const invalidCards = deckCards.filter(card => !card || !card.id);
    if (invalidCards.length > 0) {
      errors.push(`Deck contains ${invalidCards.length} invalid card(s)`);
    }

    // Check for duplicate instance IDs (should not happen, but safety check)
    const instanceIds = deckCards.map(c => c.instanceId).filter(Boolean);
    const uniqueIds = new Set(instanceIds);
    if (instanceIds.length !== uniqueIds.size) {
      errors.push('Deck contains duplicate card instances');
    }

    if (errors.length > 0) {
      Logger.error('[ValidationHelpers] Deck validation failed:', errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate player data structure
   * Type guard pattern - checks if unknown data is valid PlayerData
   */
  static validatePlayerData(data: unknown): ValidationResult {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('Player data is not an object');
      return { valid: false, errors };
    }

    const playerData = data as Record<string, unknown>;

    // Check required fields
    if (!playerData.name || typeof playerData.name !== 'string') {
      errors.push('Player name is missing or invalid');
    }

    if (typeof playerData.totalXP !== 'number' || playerData.totalXP < 0) {
      errors.push('Player XP is invalid');
    }

    if (typeof playerData.coins !== 'number' || playerData.coins < 0) {
      errors.push('Player coins is invalid');
    }

    // Check cards structure
    if (!playerData.cards || typeof playerData.cards !== 'object') {
      errors.push('Player cards data is missing');
    } else {
      const cards = playerData.cards as Record<string, unknown>;
      if (!Array.isArray(cards.collected)) {
        errors.push('Player collected cards must be an array');
      }
      if (!Array.isArray(cards.deck)) {
        errors.push('Player deck must be an array');
      }
    }

    // Check missions structure
    if (!playerData.missions || typeof playerData.missions !== 'object') {
      errors.push('Player missions data is missing');
    } else {
      const missions = playerData.missions as Record<string, unknown>;
      if (typeof missions.completedMissions !== 'object') {
        errors.push('Completed missions must be an object');
      }
    }

    if (errors.length > 0) {
      Logger.error('[ValidationHelpers] Player data validation failed:', errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate battle action
   */
  static validateBattleAction(action: string, battleState: BattleState | null): ValidationResult {
    const errors: string[] = [];

    if (!action || typeof action !== 'string') {
      errors.push('Battle action is invalid');
      return { valid: false, errors };
    }

    if (!battleState) {
      errors.push('Battle state is null or undefined');
      return { valid: false, errors };
    }

    if (battleState.turboState?.isComplete) {
      errors.push('Cannot perform action - battle is already complete');
    }

    if (errors.length > 0) {
      Logger.warn('[ValidationHelpers] Battle action validation failed:', errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate upgrade purchase
   */
  static validateUpgradePurchase(
    playerCoins: number,
    upgradeCost: number,
    upgradeId: string
  ): ValidationResult {
    const errors: string[] = [];

    if (typeof playerCoins !== 'number' || playerCoins < 0) {
      errors.push('Player coins is invalid');
      return { valid: false, errors };
    }

    if (typeof upgradeCost !== 'number' || upgradeCost < 0) {
      errors.push('Upgrade cost is invalid');
      return { valid: false, errors };
    }

    if (playerCoins < upgradeCost) {
      errors.push(`Insufficient coins for ${upgradeId} (need ${upgradeCost}, have ${playerCoins})`);
    }

    if (errors.length > 0) {
      Logger.warn('[ValidationHelpers] Upgrade validation failed:', errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate card addition to deck
   */
  static validateCardAddition(
    cardId: string,
    currentDeckSize: number,
    maxDeckSize: number,
    cardExists: boolean
  ): ValidationResult {
    const errors: string[] = [];

    if (!cardId || typeof cardId !== 'string') {
      errors.push('Card ID is invalid');
      return { valid: false, errors };
    }

    if (!cardExists) {
      errors.push(`Card ${cardId} does not exist in collection`);
    }

    if (currentDeckSize >= maxDeckSize) {
      errors.push(`Deck is full (${maxDeckSize} cards maximum)`);
    }

    if (errors.length > 0) {
      Logger.warn('[ValidationHelpers] Card addition validation failed:', errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
