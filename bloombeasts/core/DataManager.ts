/**
 * DataManager - Handles all data persistence and state synchronization
 *
 * Extracted from BloomBeastsGame to reduce its size and improve maintainability.
 * Centralizes save/load operations, binding updates, and leaderboard management.
 */

import { Logger } from '../common/engine/utils/Logger';
import type { CoreSystems } from './CoreSystemsInitializer';
import type { PlayerData, PlatformConfig } from '../types';
import { BindingType } from '../common/ui/types/types/BindingManager';
import type { BindingManager } from '../common/ui/types/types/BindingManager';

export interface DataManagerConfig {
  platform: PlatformConfig;
  systems: CoreSystems;
  bindingManager: BindingManager;
  validatePlayerData: (data: any) => data is PlayerData;
}

/**
 * Manages data persistence, state synchronization, and leaderboards
 */
export class DataManager {
  private platform: PlatformConfig;
  private systems: CoreSystems;
  private bindingManager: BindingManager;
  private validatePlayerData: (data: any) => data is PlayerData;

  constructor(config: DataManagerConfig) {
    this.platform = config.platform;
    this.systems = config.systems;
    this.bindingManager = config.bindingManager;
    this.validatePlayerData = config.validatePlayerData;
  }

  /**
   * Load game data from platform storage
   */
  async loadGameData(): Promise<void> {
    try {
      if (!this.platform.getPlayerData) {
        throw new Error('Platform does not support getPlayerData');
      }

      const savedData = this.platform.getPlayerData();

      if (!savedData || Object.keys(savedData).length === 0) {
        throw new Error('Platform must provide valid PlayerData (either loaded or newly created)');
      }

      // Validate data structure
      if (!this.validatePlayerData(savedData)) {
        Logger.error('[DataManager] Player data validation failed - attempting recovery');
        throw new Error('Invalid player data structure');
      }

      // Set player data in game state manager
      this.systems.gameStateManager.setPlayerData(savedData);
      Logger.info(`[DataManager] Loaded player data for "${savedData.name}" with ${savedData.cards.collected.length} cards`);

      Logger.info(`[DataManager] Restored deck with ${savedData.cards.deck.length} cards`);

      // Apply sound settings to platform
      if (savedData.settings) {
        this.systems.soundManager.updateSettings(savedData.settings);
        this.systems.soundManager.applySettings();
      }

      // Load completed missions into MissionManager
      this.systems.missionManager.loadCompletedMissions(savedData.missions.completedMissions);

      // Initialize starting cards if collection is empty
      if (savedData.cards.collected.length === 0) {
        Logger.info('[DataManager] Initializing starting card collection');
        await this.systems.gameStateManager.initializeStartingCollection();
        await this.saveGameData();
      }

      // Save to ensure data persists
      await this.saveGameData();
    } catch (error) {
      Logger.error('[DataManager] Failed to load game data:', error);
      throw error; // Re-throw to let caller handle initialization failure
    }
  }

  /**
   * Save game data to platform storage
   */
  async saveGameData(): Promise<void> {
    const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
    if (!playerData) {
      const error = new Error('[DataManager] Cannot save invalid player data - critical error');
      Logger.error(error.message);
      throw error;
    }

    try {
      if (!this.platform.setPlayerData) {
        Logger.warn('[DataManager] Platform does not support setPlayerData - save skipped');
        return;
      }

      this.platform.setPlayerData(playerData);
      Logger.info('[DataManager] Player data saved successfully');
    } catch (error) {
      Logger.error('[DataManager] Failed to save player data:', error);
      // Don't throw - allow game to continue even if save failed
      // User will see warning but won't lose current session
    }
  }

  /**
   * Update bindings from current game state
   * This syncs the UI bindings with the actual game state
   */
  async updateBindingsFromGameState(): Promise<void> {
    const playerData = this.systems.gameStateManager.getPlayerData();
    const playerLevel = this.systems.gameStateManager.getPlayerLevel();
    this.systems.uiCoordinator.updateBindingsFromGameState(playerData, this.systems.missionUI, playerLevel);
  }

  /**
   * Load leaderboard data from world variables
   */
  loadLeaderboardData(): void {
    if (!this.platform.getWorldVariable) {
      // World variables not supported on this platform, use mock data
      this.bindingManager.setBinding(BindingType.LeaderboardData, {
        topExperience: [
          { playerName: 'Player 1', score: 10000, level: 7 },
          { playerName: 'Player 2', score: 5000, level: 6 },
          { playerName: 'Player 3', score: 3000, level: 5 },
        ],
        fastestCluckNorris: [
          { playerName: 'Speed Runner', score: 45 },
          { playerName: 'Fast Player', score: 60 },
          { playerName: 'Quick Win', score: 75 },
        ],
      });
      return;
    }

    try {
      // Get leaderboard data from world variable
      const leaderboardData = this.platform.getWorldVariable('BloomBeastsData', 'leaderboard');

      if (leaderboardData) {
        this.bindingManager.setBinding(BindingType.LeaderboardData, leaderboardData);
      } else {
        // No data yet, set empty arrays
        this.bindingManager.setBinding(BindingType.LeaderboardData, {
          topExperience: [],
          fastestCluckNorris: [],
        });
      }
    } catch (error) {
      Logger.error('[DataManager] Failed to load leaderboard data:', error);
      this.bindingManager.setBinding(BindingType.LeaderboardData, {
        topExperience: [],
        fastestCluckNorris: [],
      });
    }
  }

  /**
   * Submit player score to leaderboard via network event
   */
  submitLeaderboardScore(type: 'experience' | 'cluckNorris', score: number): void {
    if (!this.platform.sendNetworkEvent) return;

    const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
    if (!playerData) {
      Logger.warn('[DataManager] Cannot submit score: player data not loaded');
      return;
    }

    try {
      const eventData = {
        playerName: playerData.name || 'Unknown Player',
        type,
        score,
        level: type === 'experience' ? this.systems.gameStateManager.getPlayerLevel() : undefined,
      };

      this.platform.sendNetworkEvent('leaderboard_score_submit', eventData);
    } catch (error) {
      Logger.error('[DataManager] Failed to submit leaderboard score:', error);
    }
  }
}
