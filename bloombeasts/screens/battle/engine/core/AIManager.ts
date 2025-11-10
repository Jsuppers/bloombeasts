/**
 * AIManager - Manages AI players and their turn execution
 *
 * Responsibilities:
 * - Register AI players
 * - Execute AI turns
 * - Check if current player is AI
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import { Logger } from '../../../../common/engine/utils/Logger';
import { MAX_AI_ACTIONS_PER_TURN } from '../../../../common/engine/constants/battleConstants';
import type { BloomBeastsState, BloomBeastsActionData } from '../BloomBeastsGame';
import { BloomBeastsActionType } from '../types';
import { BloomBeastsGreedyAI } from '../BloomBeastsAI';
import type { BattleConfig } from '../types';
import type { AsyncMethods } from '../../../../common/ui/types/types/bindings';

export class AIManager {
  private game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>;
  private aiPlayers: Set<string>;
  private async?: AsyncMethods;

  constructor(
    game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>,
    asyncMethods?: AsyncMethods
  ) {
    this.game = game;
    this.aiPlayers = new Set();
    this.async = asyncMethods;
  }

  /**
   * Register AI players from battle config
   */
  registerAIPlayers(config: BattleConfig): void {
    if (config.player1.isAI) {
      const difficulty = this.mapStrategyToDifficulty(config.player1.aiStrategy);
      const ai = new BloomBeastsGreedyAI({
        playerId: config.player1.id,
        difficulty,
        async: this.async
      });
      this.game.registerAI(config.player1.id, ai);
      this.aiPlayers.add(config.player1.id);
      Logger.info(`[AIManager] Registered AI for player1: ${config.player1.id}`);
    }

    if (config.player2.isAI) {
      const difficulty = this.mapStrategyToDifficulty(config.player2.aiStrategy);
      const ai = new BloomBeastsGreedyAI({
        playerId: config.player2.id,
        difficulty,
        async: this.async
      });
      this.game.registerAI(config.player2.id, ai);
      this.aiPlayers.add(config.player2.id);
      Logger.info(`[AIManager] Registered AI for player2: ${config.player2.id}`);
    }
  }

  /**
   * Map strategy string to AILevel
   */
  private mapStrategyToDifficulty(strategy?: string): Turbo.AILevel {
    switch (strategy) {
      case 'aggressive':
        return Turbo.AILevel.HARD;
      case 'defensive':
        return Turbo.AILevel.EASY;
      default:
        return Turbo.AILevel.MEDIUM;
    }
  }

  /**
   * Execute AI turn - loops until AI ends turn or game ends
   * @param onActionComplete Optional callback called after each AI action to update UI
   */
  async executeAITurn(onActionComplete?: () => void): Promise<void> {
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    const currentPlayer = state.gameData.players.find(p => p.id === currentPlayerId);

    if (!currentPlayer) {
      Logger.error('[AIManager] Current player not found');
      return;
    }

    Logger.info(`[AIManager] Executing AI turn for ${currentPlayer.name} (${currentPlayerId})`);

    try {
      let actionCount = 0;
      const maxActions = MAX_AI_ACTIONS_PER_TURN;

      while (actionCount < maxActions) {
        const currentState = this.game.getState();

        // Check if turn switched (AI ended turn)
        if (currentState.turnInfo.currentPlayerId !== currentPlayerId) {
          Logger.info(`[AIManager] AI turn ended, turn switched to: ${currentState.turnInfo.currentPlayerId}`);
          break;
        }

        // Check if game completed
        if (currentState.isComplete) {
          Logger.info('[AIManager] Game completed during AI turn');
          break;
        }

        // Execute one AI action
        await this.game.executeAITurn();
        actionCount++;

        Logger.debug(`[AIManager] AI executed action ${actionCount}`);

        // Trigger UI update after each action
        if (onActionComplete) {
          onActionComplete();
        }
      }

      if (actionCount >= maxActions) {
        Logger.warn('[AIManager] AI reached maximum action limit, forcing END_TURN');

        // Force end turn when max actions reached
        const finalState = this.game.getState();
        if (finalState.turnInfo.currentPlayerId === currentPlayerId) {
          this.game.performAction({
            type: 'game_action',
            playerId: currentPlayerId,
            data: { type: BloomBeastsActionType.END_TURN }
          });
          Logger.info('[AIManager] Forced turn end after max actions');
        }
      }

      Logger.info('[AIManager] AI turn execution completed');
    } catch (error) {
      Logger.error('[AIManager] AI turn execution failed:', error);
      throw error;
    }
  }

  /**
   * Check if the current player is an AI
   */
  isAIPlayerTurn(): boolean {
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    return this.aiPlayers.has(currentPlayerId);
  }

  /**
   * Check if a specific player is AI
   */
  isAIPlayer(playerId: string): boolean {
    return this.aiPlayers.has(playerId);
  }

  /**
   * Clear all registered AIs
   */
  clear(): void {
    this.aiPlayers.clear();
  }
}
