/**
 * Leveling System - Handles XP gain, level ups, and stat progression
 */

import { BloomBeastInstance, Level, XPSource } from '../types/leveling';
import { BloomBeastCard, Counter } from '../types/core';
import { XP_REQUIREMENTS, STAT_PROGRESSION, MAX_LEVEL, NECTAR_XP_COST } from '../constants/leveling';
import { ILevelingSystem } from './interfaces';

export class LevelingSystem implements ILevelingSystem {
  /**
   * Add XP to a Bloom Beast
   */
  addXP(
    beast: BloomBeastInstance,
    amount: number,
    source: XPSource,
    card?: BloomBeastCard
  ): BloomBeastInstance {
    const updatedBeast = { ...beast };
    updatedBeast.currentXP += amount;

    // Check if level up is possible
    if (this.canLevelUp(updatedBeast, card)) {
      return this.levelUp(updatedBeast, card);
    }

    return updatedBeast;
  }

  /**
   * Add XP from combat victory
   */
addCombatXP(beast: BloomBeastInstance, card?: BloomBeastCard): BloomBeastInstance {
    return this.addXP(beast, 1, 'Combat', card);
  }

  /**
   * Add XP from nectar sacrifice
   */
addNectarXP(beast: BloomBeastInstance, nectarSpent: number, card?: BloomBeastCard): BloomBeastInstance {
    const xpGained = nectarSpent / NECTAR_XP_COST;
    return this.addXP(beast, xpGained, 'NectarSacrifice', card);
  }

  /**
   * Get XP requirement for a specific level, considering custom config
   */
  private getXPRequirementForLevel(level: Level, card?: BloomBeastCard): number {
    // Level 1 doesn't require XP
    if (level === 1) {
      return 0;
    }
    // Check custom XP requirements for levels 2-9
    const customXP = card?.levelingConfig?.xpRequirements?.[level as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9];
    if (customXP !== undefined) {
      return customXP;
    }
    return XP_REQUIREMENTS[level];
  }

  /**
   * Check if a beast can level up
   */
canLevelUp(beast: BloomBeastInstance, card?: BloomBeastCard): boolean {
    if (beast.currentLevel >= MAX_LEVEL) {
      return false;
    }

    const nextLevel = (beast.currentLevel + 1) as Level;
    const xpRequired = this.getXPRequirementForLevel(nextLevel, card);

    return beast.currentXP >= xpRequired;
  }

  /**
   * Level up a beast
   */
levelUp(beast: BloomBeastInstance, card?: BloomBeastCard): BloomBeastInstance {
    if (!this.canLevelUp(beast, card)) {
      return beast;
    }

    const updatedBeast = { ...beast };
    const nextLevel = (updatedBeast.currentLevel + 1) as Level;
    const xpRequired = this.getXPRequirementForLevel(nextLevel, card);

    // Remove XP counters and increase level
    updatedBeast.currentXP -= xpRequired;
    updatedBeast.currentLevel = nextLevel;

    // Apply stat gains
    const statGain = this.getStatGain(updatedBeast.currentLevel, card);
    updatedBeast.currentAttack += statGain.attackGain;
    updatedBeast.currentHealth += statGain.healthGain;
    updatedBeast.maxHealth += statGain.healthGain;

    // Check for level up again (in case there's excess XP)
    if (this.canLevelUp(updatedBeast, card)) {
      return this.levelUp(updatedBeast, card);
    }

    return updatedBeast;
  }

  /**
   * Get stat gains for leveling from previous level to current level
   */
getStatGain(
    newLevel: Level,
    card?: BloomBeastCard
  ): { attackGain: number; healthGain: number } {
    const previousLevel = (newLevel - 1) as Level;

    // Check for custom stat gains
    const customCurrent = card?.levelingConfig?.statGains?.[newLevel];
    const customPrevious = card?.levelingConfig?.statGains?.[previousLevel];

    if (customCurrent && customPrevious) {
      return {
        attackGain: customCurrent.atk - customPrevious.atk,
        healthGain: customCurrent.hp - customPrevious.hp,
      };
    }

    // Use default progression
    const currentStats = STAT_PROGRESSION[newLevel];
    const previousStats = STAT_PROGRESSION[previousLevel];

    return {
      attackGain: currentStats.cumulativeATK - previousStats.cumulativeATK,
      healthGain: currentStats.cumulativeHP - previousStats.cumulativeHP,
    };
  }

  /**
   * Get total stat bonus at a given level
   */
getTotalStatBonus(level: Level, card?: BloomBeastCard): { hp: number; atk: number } {
    // Check for custom stat gains
    const customStats = card?.levelingConfig?.statGains?.[level];
    if (customStats) {
      return {
        hp: customStats.hp,
        atk: customStats.atk,
      };
    }

    // Use default progression
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
    const bonus = this.getTotalStatBonus(level, baseCard);
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
      counters: [],
      statusEffects: [],
      slotIndex,
      summoningSickness: true,
    };
  }

  /**
   * Get XP requirement for next level
   */
getXPRequirement(currentLevel: Level, card?: BloomBeastCard): number | null {
    if (currentLevel >= MAX_LEVEL) {
      return null;
    }

    const nextLevel = (currentLevel + 1) as Level;
    return this.getXPRequirementForLevel(nextLevel, card);
  }

  /**
   * Get current abilities for a beast based on its level
   */
getCurrentAbilities(card: BloomBeastCard, level: Level) {
    let ability = card.ability;

    // Check for ability upgrades at level milestones
    const upgrades = card.levelingConfig?.abilityUpgrades;
    if (upgrades) {
      // Check each upgrade level in order (4, 7, 9)
      const upgradeLevel: Array<4 | 7 | 9> = [4, 7, 9];
      for (const lvl of upgradeLevel) {
        if (level >= lvl && upgrades[lvl]) {
          const upgrade = upgrades[lvl];
          if (upgrade && upgrade.ability) {
            ability = upgrade.ability;
          }
        }
      }
    }

    return { ability };
  }

  /**
   * Check if a beast has an ability upgrade at the current level
   */
hasAbilityUpgrade(card: BloomBeastCard, level: Level): boolean {
    if (level !== 4 && level !== 7 && level !== 9) return false;
    return card.levelingConfig?.abilityUpgrades?.[level as 4 | 7 | 9] !== undefined;
  }
}
