/**
 * StatModifierManager - Centralized stat modification management
 *
 * This utility handles all stat modifications in a consistent way across the game.
 * It tracks different sources of modifications and calculates final stats.
 */

import { BloomBeastInstance, StatModifier, StatModifierSource } from '../types/leveling';
import { Logger } from './Logger';

export class StatModifierManager {
  /**
   * Add a stat modifier to a beast
   */
  static addModifier(
    beast: BloomBeastInstance,
    source: StatModifierSource,
    sourceId: string,
    stat: 'attack' | 'health' | 'maxHealth',
    value: number,
    duration?: 'permanent' | 'end-of-turn' | 'while-active',
    turnsRemaining?: number
  ): void {
    if (!beast.statModifiers) {
      beast.statModifiers = [];
    }

    const modifier: StatModifier = {
      source,
      sourceId,
      stat,
      value,
      duration,
      turnsRemaining
    };

    beast.statModifiers.push(modifier);
    Logger.debug(`Added ${stat} modifier: ${value > 0 ? '+' : ''}${value} from ${source} (${sourceId})`);

    // Recalculate stats after adding modifier
    this.recalculateStats(beast);
  }

  /**
   * Remove all modifiers from a specific source
   */
  static removeModifiersBySource(
    beast: BloomBeastInstance,
    source: StatModifierSource,
    sourceId?: string
  ): void {
    if (!beast.statModifiers) return;

    const before = beast.statModifiers.length;

    if (sourceId) {
      beast.statModifiers = beast.statModifiers.filter(
        m => !(m.source === source && m.sourceId === sourceId)
      );
    } else {
      beast.statModifiers = beast.statModifiers.filter(m => m.source !== source);
    }

    const removed = before - beast.statModifiers.length;
    if (removed > 0) {
      Logger.debug(`Removed ${removed} modifier(s) from ${source}${sourceId ? ` (${sourceId})` : ''}`);
      this.recalculateStats(beast);
    }
  }

  /**
   * Update modifiers for end of turn (decrement turns remaining, remove expired)
   */
  static updateEndOfTurn(beast: BloomBeastInstance): void {
    if (!beast.statModifiers) return;

    const before = beast.statModifiers.length;

    beast.statModifiers = beast.statModifiers.filter(modifier => {
      // Remove end-of-turn effects
      if (modifier.duration === 'end-of-turn') {
        Logger.debug(`Removing end-of-turn modifier: ${modifier.stat} ${modifier.value > 0 ? '+' : ''}${modifier.value}`);
        return false;
      }

      // Decrement turns remaining for temporary effects
      if (modifier.turnsRemaining !== undefined) {
        modifier.turnsRemaining--;
        if (modifier.turnsRemaining <= 0) {
          Logger.debug(`Removing expired temporary modifier: ${modifier.stat} ${modifier.value > 0 ? '+' : ''}${modifier.value}`);
          return false;
        }
      }

      return true;
    });

    const removed = before - beast.statModifiers.length;
    if (removed > 0) {
      this.recalculateStats(beast);
    }
  }

  /**
   * Recalculate all current stats from base + modifiers
   */
  static recalculateStats(beast: BloomBeastInstance): void {
    // Store current health percentage to maintain damage
    const healthPercent = beast.maxHealth > 0 ? beast.currentHealth / beast.maxHealth : 1;

    // Start with base stats
    let calculatedAttack = beast.baseAttack;
    let calculatedMaxHealth = beast.baseHealth;

    // Apply all modifiers
    if (beast.statModifiers) {
      for (const modifier of beast.statModifiers) {
        if (modifier.stat === 'attack') {
          calculatedAttack += modifier.value;
        } else if (modifier.stat === 'maxHealth' || modifier.stat === 'health') {
          calculatedMaxHealth += modifier.value;
        }
      }
    }

    // Ensure stats don't go below minimum values
    calculatedAttack = Math.max(0, calculatedAttack);
    calculatedMaxHealth = Math.max(1, calculatedMaxHealth);

    // Update current stats
    const oldMaxHealth = beast.maxHealth;
    beast.currentAttack = calculatedAttack;
    beast.maxHealth = calculatedMaxHealth;

    // Adjust current health proportionally if max health changed
    if (oldMaxHealth !== calculatedMaxHealth && oldMaxHealth > 0) {
      beast.currentHealth = Math.max(1, Math.min(
        Math.floor(calculatedMaxHealth * healthPercent),
        calculatedMaxHealth
      ));
    }

    // Ensure current health doesn't exceed max health
    beast.currentHealth = Math.min(beast.currentHealth, beast.maxHealth);
  }

  /**
   * Get total modifier value for a specific stat from all sources
   */
  static getTotalModifier(beast: BloomBeastInstance, stat: 'attack' | 'health' | 'maxHealth'): number {
    if (!beast.statModifiers) return 0;

    return beast.statModifiers
      .filter(m => m.stat === stat || (m.stat === 'health' && stat === 'maxHealth'))
      .reduce((sum, m) => sum + m.value, 0);
  }

  /**
   * Get modifiers from a specific source
   */
  static getModifiersBySource(
    beast: BloomBeastInstance,
    source: StatModifierSource,
    sourceId?: string
  ): StatModifier[] {
    if (!beast.statModifiers) return [];

    return beast.statModifiers.filter(m => {
      if (sourceId) {
        return m.source === source && m.sourceId === sourceId;
      }
      return m.source === source;
    });
  }

  /**
   * Clear all modifiers (useful when beast is destroyed or returned to hand)
   */
  static clearAllModifiers(beast: BloomBeastInstance): void {
    beast.statModifiers = [];
    this.recalculateStats(beast);
  }

  /**
   * Initialize a beast's stat system (call when beast is created/summoned)
   */
  static initializeStatSystem(beast: BloomBeastInstance): void {
    if (!beast.statModifiers) {
      beast.statModifiers = [];
    }

    // Ensure baseAttack and baseHealth are set
    if (beast.baseAttack === undefined) {
      beast.baseAttack = beast.currentAttack;
    }
    if (beast.baseHealth === undefined) {
      beast.baseHealth = beast.maxHealth;
    }

    // Recalculate to ensure consistency
    this.recalculateStats(beast);
  }
}
