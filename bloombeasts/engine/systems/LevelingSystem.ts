/**
 * Leveling System - Handles XP gain, level ups, and stat progression
 */

import { BloomBeastInstance, Level, XPSource } from '../types/leveling';
import { BloomBeastCard } from '../types/core';
import { XP_REQUIREMENTS, STAT_PROGRESSION, MAX_LEVEL, NECTAR_XP_COST } from '../constants/leveling';
import { ILevelingSystem } from './interfaces';

export class LevelingSystem implements ILevelingSystem {
  /**
   * Add XP to a Bloom Beast
   */
  addXP(
    beast: BloomBeastInstance,
    amount: number,
    source: XPSource
  ): BloomBeastInstance {
    const updatedBeast = { ...beast };
    updatedBeast.currentXP += amount;

    // Check if level up is possible
    if (this.canLevelUp(updatedBeast)) {
      return this.levelUp(updatedBeast);
    }

    return updatedBeast;
  }

  /**
   * Add XP from combat victory
   */
addCombatXP(beast: BloomBeastInstance): BloomBeastInstance {
    return this.addXP(beast, 1, 'Combat');
  }

  /**
   * Add XP from nectar sacrifice
   */
addNectarXP(beast: BloomBeastInstance, nectarSpent: number): BloomBeastInstance {
    const xpGained = nectarSpent / NECTAR_XP_COST;
    return this.addXP(beast, xpGained, 'NectarSacrifice');
  }

  /**
   * Get XP requirement for a specific level (uses standard progression)
   */
  private getXPRequirementForLevel(level: Level): number {
    return XP_REQUIREMENTS[level];
  }

  /**
   * Check if a beast can level up
   */
canLevelUp(beast: BloomBeastInstance): boolean {
    if (beast.currentLevel >= MAX_LEVEL) {
      return false;
    }

    const nextLevel = (beast.currentLevel + 1) as Level;
    const xpRequired = this.getXPRequirementForLevel(nextLevel);

    return beast.currentXP >= xpRequired;
  }

  /**
   * Level up a beast
   */
levelUp(beast: BloomBeastInstance): BloomBeastInstance {
    if (!this.canLevelUp(beast)) {
      return beast;
    }

    const updatedBeast = { ...beast };
    const nextLevel = (updatedBeast.currentLevel + 1) as Level;
    const xpRequired = this.getXPRequirementForLevel(nextLevel);

    // Remove XP counters and increase level
    updatedBeast.currentXP -= xpRequired;
    updatedBeast.currentLevel = nextLevel;

    // Apply stat gains
    const statGain = this.getStatGain(updatedBeast.currentLevel);
    updatedBeast.currentAttack += statGain.attackGain;
    updatedBeast.currentHealth += statGain.healthGain;
    updatedBeast.maxHealth += statGain.healthGain;

    // Check for level up again (in case there's excess XP)
    if (this.canLevelUp(updatedBeast)) {
      return this.levelUp(updatedBeast);
    }

    return updatedBeast;
  }

  /**
   * Get stat gains for leveling from previous level to current level (uses standard progression)
   */
getStatGain(
    newLevel: Level
  ): { attackGain: number; healthGain: number } {
    const previousLevel = (newLevel - 1) as Level;

    // Use standard progression
    const currentStats = STAT_PROGRESSION[newLevel];
    const previousStats = STAT_PROGRESSION[previousLevel];

    return {
      attackGain: currentStats.cumulativeATK - previousStats.cumulativeATK,
      healthGain: currentStats.cumulativeHP - previousStats.cumulativeHP,
    };
  }

  /**
   * Get total stat bonus at a given level (uses standard progression)
   */
getTotalStatBonus(level: Level): { hp: number; atk: number } {
    // Use standard progression
    const stats = STAT_PROGRESSION[level];
    return {
      hp: stats.cumulativeHP,
      atk: stats.cumulativeATK,
    };
  }

  /**
   * Calculate current stats for a beast based on base stats and level
   */
calculateCurrentStats(
    baseCard: BloomBeastCard,
    level: Level
  ): { attack: number; health: number } {
    const bonus = this.getTotalStatBonus(level);
    return {
      attack: baseCard.baseAttack + bonus.atk,
      health: baseCard.baseHealth + bonus.hp,
    };
  }

  /**
   * Create a new beast instance from a card
   */
createBeastInstance(
    card: BloomBeastCard,
    instanceId: string,
    slotIndex: number
  ): BloomBeastInstance {
    const stats = this.calculateCurrentStats(card, 1);

    return {
      cardId: card.id,
      instanceId,
      name: card.name,
      affinity: card.affinity,
      currentLevel: 1,
      currentXP: 0,
      baseAttack: card.baseAttack,
      baseHealth: card.baseHealth,
      currentAttack: stats.attack,
      currentHealth: stats.health,
      maxHealth: stats.health,
      statusEffects: [],
      slotIndex,
      summoningSickness: true,
    };
  }

  /**
   * Get XP requirement for next level
   */
getXPRequirement(currentLevel: Level): number | null {
    if (currentLevel >= MAX_LEVEL) {
      return null;
    }

    const nextLevel = (currentLevel + 1) as Level;
    return this.getXPRequirementForLevel(nextLevel);
  }

  /**
   * Get current abilities for a beast (always returns base abilities - no level-based changes)
   */
getCurrentAbilities(card: BloomBeastCard, level: Level) {
    // Cards keep their base abilities at all levels
    return { abilities: [...card.abilities] };
  }

  /**
   * Check if a beast has an ability upgrade at the current level (always false now)
   */
hasAbilityUpgrade(card: BloomBeastCard, level: Level): boolean {
    // No ability upgrades in simplified system
    return false;
  }
}
