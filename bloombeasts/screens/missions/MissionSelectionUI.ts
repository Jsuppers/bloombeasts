/**
 * Mission Selection UI - Display available missions and let players choose
 */

import { Mission } from './types';
import { getAvailableMissions, getCompletedMissions } from './definitions';
import { MissionManager } from './MissionManager';
import { Logger } from '../../engine/utils/Logger';

export interface MissionDisplayData {
  mission: Mission;
  isAvailable: boolean;
  completionCount: number;
  difficultyColor: string;
  rewardPreview: string[];
}

export class MissionSelectionUI {
  private missionManager: MissionManager;
  private currentPlayerLevel: number = 1;

  constructor(missionManager: MissionManager) {
    this.missionManager = missionManager;
  }

  /**
   * Set the player's current level for mission filtering
   */
  setPlayerLevel(level: number): void {
    this.currentPlayerLevel = level;
  }

  /**
   * Get all missions formatted for display
   */
  getMissionList(): MissionDisplayData[] {
    const availableMissions = getAvailableMissions(this.currentPlayerLevel);
    const completedMissions = getCompletedMissions();

    return availableMissions.map(mission => ({
      mission,
      isAvailable: this.isMissionPlayable(mission),
      completionCount: this.missionManager.getCompletedCount(mission.id),
      difficultyColor: this.getDifficultyColor(mission.difficulty),
      rewardPreview: this.getRewardPreview(mission),
    }));
  }

  /**
   * Check if a mission can be played
   */
  private isMissionPlayable(mission: Mission): boolean {
    // First mission is always unlocked
    if (mission.unlocked) {
      return true;
    }

    // Check if mission is unlocked by checking actual completion counts
    const completionCount = this.missionManager.getCompletedCount(mission.id);
    if (completionCount === 0) {
      // Check if previous mission is completed
      const allMissions = getAvailableMissions(99); // Get all missions
      const missionIndex = allMissions.findIndex(m => m.id === mission.id);

      if (missionIndex > 0) {
        const previousMission = allMissions[missionIndex - 1];
        const previousCompletionCount = this.missionManager.getCompletedCount(previousMission.id);
        if (previousCompletionCount === 0) {
          return false;
        }
      }
    }

    // Check level requirements
    const levelDifference = Math.abs(this.currentPlayerLevel - mission.level);
    return levelDifference <= 3; // Allow missions within 3 levels
  }

  /**
   * Get difficulty color for UI
   */
  private getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'tutorial':
        return '#90EE90'; // Light green
      case 'easy':
        return '#87CEEB'; // Sky blue
      case 'normal':
        return '#FFD700'; // Gold
      case 'hard':
        return '#FF6347'; // Tomato red
      case 'expert':
        return '#8B008B'; // Dark magenta
      case 'legendary':
        return '#FF1493'; // Deep pink
      default:
        return '#FFFFFF';
    }
  }

  /**
   * Generate reward preview text
   */
  private getRewardPreview(mission: Mission): string[] {
    const preview: string[] = [];

    // XP rewards
    const totalPossibleXP = mission.rewards.guaranteedXP +
                           (mission.rewards.bonusXPAmount || 0);
    preview.push(`XP: ${mission.rewards.guaranteedXP}-${totalPossibleXP}`);

    // Card rewards
    if (mission.rewards.cardRewards && mission.rewards.cardRewards.length > 0) {
      let minCards = 0;
      let maxCards = 0;

      mission.rewards.cardRewards.forEach(reward => {
        if (reward.dropChance >= 0.7) {
          minCards += reward.minAmount;
        }
        maxCards += reward.maxAmount;
      });

      preview.push(`Cards: ${minCards}-${maxCards}`);
    }

    return preview;
  }

  /**
   * Get detailed mission info for display
   */
  getMissionDetails(missionId: string): string {
    const availableMissions = getAvailableMissions(this.currentPlayerLevel);
    const mission = availableMissions.find(m => m.id === missionId);

    if (!mission) {
      return 'Mission not found';
    }

    const details: string[] = [
      `=== ${mission.name} ===`,
      `Level: ${mission.level}`,
      `Difficulty: ${mission.difficulty}`,
      '',
      '📖 Story:',
      mission.storyText || 'No story available',
      '',
      '🎯 Objectives:',
    ];

    if (mission.objectives && mission.objectives.length > 0) {
      mission.objectives.forEach(obj => {
        details.push(`  • ${obj.description}`);
      });
    } else {
      details.push(`  • Defeat the opponent`);
    }


    if (mission.turnLimit) {
      details.push('');
      details.push(`⏱️ Turn Limit: ${mission.turnLimit}`);
    }

    details.push('');
    details.push('🏆 Rewards:');
    this.getRewardPreview(mission).forEach(reward => {
      details.push(`  • ${reward}`);
    });

    const completionCount = this.missionManager.getCompletedCount(mission.id);
    if (completionCount > 0) {
      details.push('');
      details.push(`✅ Completed: ${completionCount} time(s)`);
    }

    return details.join('\n');
  }

  /**
   * Start a selected mission
   */
  startMission(missionId: string): boolean {
    const mission = this.missionManager.startMission(missionId);

    if (!mission) {
      Logger.error('Failed to start mission:', missionId);
      return false;
    }

    Logger.debug(`Starting mission: ${mission.name}`);
    if (mission.opponentAI) {
      Logger.debug(`Opponent: ${mission.opponentAI.name}`);
    }
    Logger.debug(`Difficulty: ${mission.difficulty}`);

    return true;
  }

  /**
   * Get progress display for current mission
   */
  getCurrentMissionProgress(): string[] | null {
    const mission = this.missionManager.getCurrentMission();
    const progress = this.missionManager.getProgress();

    if (!mission || !progress) {
      return null;
    }

    const display: string[] = [
      `Current Mission: ${mission.name}`,
      `Turn: ${progress.turnCount}`,
      '',
      'Objectives Progress:',
    ];

    if (mission.objectives && mission.objectives.length > 0) {
      mission.objectives.forEach(obj => {
        const key = `${obj.type}-${obj.target || 0}`;
        const currentProgress = progress.objectiveProgress.get(key) || 0;
        const target = obj.target || 1;
        const isComplete = currentProgress >= target;
        const status = isComplete ? '✅' : '⬜';

        display.push(`  ${status} ${obj.description} (${Math.min(currentProgress, target)}/${target})`);
      });
    } else {
      display.push(`  ⬜ Defeat the opponent`);
    }

    if (mission.turnLimit) {
      display.push('');
      display.push(`Turns Remaining: ${mission.turnLimit - progress.turnCount}`);
    }

    return display;
  }
}