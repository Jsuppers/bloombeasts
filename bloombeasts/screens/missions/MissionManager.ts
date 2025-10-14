/**
 * Mission Manager - Handles mission progress, rewards, and completion
 */

import { Mission, MissionObjective, MissionRewards, CardPool } from './types';
import { missions, getMissionById } from './definitions';
import { BloomBeastCard, HabitatCard, TrapCard, MagicCard } from '../../engine/types/core';
import { GameState } from '../../engine/types/game';
import { getAllCards } from '../../engine/cards';
import { SimpleMap } from '../../utils/polyfills';
import { Logger } from '../../engine/utils/Logger';

export interface MissionRunProgress {
  missionId: string;
  objectiveProgress: SimpleMap<string, number>;
  turnCount: number;
  isCompleted: boolean;
  damageDealt: number;
  beastsSummoned: number;
  abilitiesUsed: number;
  playerHealth: number;
  opponentHealth: number;
  startTime: number;           // Timestamp when mission started (milliseconds)
  endTime?: number;             // Timestamp when mission ended (milliseconds)
}

export interface ItemRewardResult {
  itemId: string;
  quantity: number;
}

export interface RewardResult {
  xpGained: number;
  beastXP: number;              // XP earned by beasts
  cardsReceived: (BloomBeastCard | HabitatCard | TrapCard | MagicCard)[];
  itemsReceived: ItemRewardResult[];
  completionTimeSeconds: number; // Time taken to complete mission
  bonusRewards?: string[];
}

export class MissionManager {
  private currentMission: Mission | null = null;
  private progress: MissionRunProgress | null = null;
  private completedMissions: SimpleMap<string, number> = new SimpleMap();

  /**
   * Start a mission
   */
  startMission(missionId: string): Mission | null {
    const mission = getMissionById(missionId);
    if (!mission) {
      Logger.error(`Mission ${missionId} not found`);
      return null;
    }

    this.currentMission = mission;
    this.progress = {
      missionId,
      objectiveProgress: new SimpleMap(),
      turnCount: 0,
      isCompleted: false,
      damageDealt: 0,
      beastsSummoned: 0,
      abilitiesUsed: 0,
      playerHealth: 30,
      opponentHealth: 30,
      startTime: Date.now(),
    };

    // Initialize objective tracking (if objectives exist)
    if (mission.objectives) {
      mission.objectives.forEach(obj => {
        const key = this.getObjectiveKey(obj);
        this.progress!.objectiveProgress.set(key, 0);
      });
    }

    return mission;
  }

  /**
   * Update mission progress based on game events
   */
  updateProgress(event: string, data: any): void {
    if (!this.progress || !this.currentMission) return;

    switch (event) {
      case 'turn-end':
        this.progress.turnCount++;
        this.checkTurnBasedObjectives();
        break;

      case 'damage-dealt':
        this.progress.damageDealt += data.amount;
        this.updateObjective('deal-damage', this.progress.damageDealt);
        break;

      case 'beast-summoned':
        this.progress.beastsSummoned++;
        this.updateObjective('summon-beasts', this.progress.beastsSummoned);
        break;

      case 'ability-used':
        this.progress.abilitiesUsed++;
        this.updateObjective('use-abilities', this.progress.abilitiesUsed);
        break;

      case 'opponent-defeated':
        this.updateObjective('defeat-opponent', 1);
        this.checkMissionCompletion();
        break;

      case 'health-update':
        this.progress.playerHealth = data.playerHealth;
        this.progress.opponentHealth = data.opponentHealth;
        this.updateObjective('maintain-health', this.progress.playerHealth);
        break;
    }

    this.checkMissionCompletion();
  }

  /**
   * Check if all objectives are completed
   */
  private checkMissionCompletion(): void {
    if (!this.currentMission || !this.progress) return;

    // If no objectives, just check if opponent is defeated (default win condition)
    if (!this.currentMission.objectives || this.currentMission.objectives.length === 0) {
      // Mission complete when opponent health reaches 0
      if (this.progress.opponentHealth <= 0) {
        this.progress.isCompleted = true;
      }
      return;
    }

    const allObjectivesComplete = this.currentMission.objectives.every(obj => {
      const key = this.getObjectiveKey(obj);
      const progress = this.progress!.objectiveProgress.get(key) || 0;

      switch (obj.type) {
        case 'defeat-opponent':
          return progress >= 1;
        case 'deal-damage':
        case 'summon-beasts':
        case 'use-abilities':
        case 'survive-turns':
          return progress >= (obj.target || 0);
        case 'maintain-health':
          return this.progress!.playerHealth >= (obj.target || 0);
        default:
          return false;
      }
    });

    if (allObjectivesComplete) {
      this.progress.isCompleted = true;
    }
  }

  /**
   * Complete the mission and generate rewards
   */
  completeMission(): RewardResult | null {
    if (!this.currentMission || !this.progress || !this.progress.isCompleted) {
      return null;
    }

    // Mark mission end time
    this.progress.endTime = Date.now();

    const rewards = this.generateRewards(this.currentMission.rewards);

    // Track completion
    const timesCompleted = this.completedMissions.get(this.currentMission.id) || 0;
    this.completedMissions.set(this.currentMission.id, timesCompleted + 1);
    this.currentMission.timesCompleted = timesCompleted + 1;

    // Unlock next mission
    const nextMissionIndex = missions.indexOf(this.currentMission) + 1;
    if (nextMissionIndex < missions.length) {
      missions[nextMissionIndex].unlocked = true;
    }

    // Clear current mission
    this.currentMission = null;
    this.progress = null;

    return rewards;
  }

  /**
   * Generate rewards based on mission configuration
   */
  private generateRewards(rewardConfig: MissionRewards): RewardResult {
    // Calculate completion time
    const completionTimeMs = (this.progress!.endTime || Date.now()) - this.progress!.startTime;
    const completionTimeSeconds = Math.floor(completionTimeMs / 1000);

    // Calculate beast XP (same as player XP for now)
    const beastXP = rewardConfig.guaranteedXP;

    const result: RewardResult = {
      xpGained: rewardConfig.guaranteedXP,
      beastXP: beastXP,
      cardsReceived: [],
      itemsReceived: [],
      completionTimeSeconds: completionTimeSeconds,
      bonusRewards: [],
    };

    // Roll for bonus XP
    if (rewardConfig.bonusXPChance && Math.random() < rewardConfig.bonusXPChance) {
      result.xpGained += rewardConfig.bonusXPAmount || 0;
      result.bonusRewards?.push(`Bonus XP: +${rewardConfig.bonusXPAmount}`);
    }

    // Generate card rewards
    if (rewardConfig.cardRewards) {
      rewardConfig.cardRewards.forEach(cardReward => {
        if (Math.random() < cardReward.dropChance) {
          const amount = Math.floor(
            Math.random() * (cardReward.maxAmount - cardReward.minAmount + 1) +
            cardReward.minAmount
          );

          const cards = this.selectRandomCards(
            cardReward.cardPool,
            amount,
            cardReward.affinity
          );

          result.cardsReceived.push(...cards);
        }
      });
    }

    // Generate item rewards
    if (rewardConfig.itemRewards) {
      rewardConfig.itemRewards.forEach(itemReward => {
        if (Math.random() < itemReward.dropChance) {
          const amount = Math.floor(
            Math.random() * (itemReward.maxAmount - itemReward.minAmount + 1) +
            itemReward.minAmount
          );

          result.itemsReceived.push({
            itemId: itemReward.itemId,
            quantity: amount,
          });
        }
      });
    }

    // Apply special rule rewards (like double rewards for mission 10)
    if (this.currentMission?.specialRules) {
      const hasDoubleRewards = this.currentMission.specialRules.some(
        rule => rule.effect === 'double-xp' || rule.id === 'champions-trial'
      );
      if (hasDoubleRewards) {
        result.xpGained *= 2;
        result.bonusRewards?.push('Double rewards earned!');
      }
    }

    return result;
  }

  /**
   * Select random cards from the card pool
   */
  private selectRandomCards(
    pool: CardPool,
    amount: number,
    affinity?: string
  ): (BloomBeastCard | HabitatCard | TrapCard | MagicCard)[] {
    const allCards = getAllCards();

    // Filter by pool and affinity
    let eligibleCards = allCards.filter(card => {
      if (affinity && 'affinity' in card && card.affinity !== affinity) {
        return false;
      }

      // Filter by rarity based on pool
      // Cards have rarity added dynamically by getAllCards
      const cardWithRarity = card as any;
      switch (pool) {
        case 'common':
          return !cardWithRarity.rarity || cardWithRarity.rarity === 'common';
        case 'uncommon':
          return cardWithRarity.rarity === 'uncommon';
        case 'rare':
          return cardWithRarity.rarity === 'rare';
        case 'any':
        case 'affinity':
        default:
          return true;
      }
    }) as (BloomBeastCard | HabitatCard | TrapCard | MagicCard)[];

    // Randomly select cards
    const selected: (BloomBeastCard | HabitatCard | TrapCard | MagicCard)[] = [];
    for (let i = 0; i < amount && eligibleCards.length > 0; i++) {
      const index = Math.floor(Math.random() * eligibleCards.length);
      selected.push(eligibleCards[index]);
      // Allow duplicates in rewards
    }

    return selected;
  }

  /**
   * Helper methods
   */
  private getObjectiveKey(objective: MissionObjective): string {
    return `${objective.type}-${objective.target || 0}`;
  }

  private updateObjective(type: string, value: number): void {
    if (!this.progress) return;

    this.progress.objectiveProgress.forEach((_, key) => {
      if (key.startsWith(type)) {
        this.progress!.objectiveProgress.set(key, value);
      }
    });
  }

  private checkTurnBasedObjectives(): void {
    this.updateObjective('survive-turns', this.progress!.turnCount);
  }

  /**
   * Get current mission status
   */
  getCurrentMission(): Mission | null {
    return this.currentMission;
  }

  getProgress(): MissionRunProgress | null {
    return this.progress;
  }

  getCompletedCount(missionId: string): number {
    return this.completedMissions.get(missionId) || 0;
  }

  /**
   * Load completed missions from saved data
   */
  loadCompletedMissions(completedMissionsData: { [missionId: string]: number }): void {
    // Clear current data
    this.completedMissions = new SimpleMap();

    // Load saved completion data
    for (const missionId in completedMissionsData) {
      if (completedMissionsData.hasOwnProperty(missionId)) {
        this.completedMissions.set(missionId, completedMissionsData[missionId]);
      }
    }

    // Restore mission unlock state and completion counts from saved data
    this.restoreMissionState();
  }

  /**
   * Restore mission unlock state and completion counts from saved data
   * This updates the mission definition objects to reflect saved progress
   */
  private restoreMissionState(): void {
    missions.forEach((mission, index) => {
      // Restore completion count
      const completionCount = this.completedMissions.get(mission.id) || 0;
      mission.timesCompleted = completionCount;

      // Unlock mission if it has been completed before
      if (completionCount > 0) {
        mission.unlocked = true;

        // Also unlock the next mission
        if (index + 1 < missions.length) {
          missions[index + 1].unlocked = true;
        }
      }
    });
  }

  /**
   * Get all completed missions as a plain object for saving
   */
  getCompletedMissionsData(): { [missionId: string]: number } {
    const data: { [missionId: string]: number } = {};
    this.completedMissions.forEach((count, missionId) => {
      data[missionId] = count;
    });
    return data;
  }
}