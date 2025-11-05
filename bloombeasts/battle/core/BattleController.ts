/**
 * BattleController - Battle orchestrator using TURBO library
 *
 * This controller manages battles using the generic TURBO turn-based game engine.
 */

import { Logger } from '../../engine/utils/Logger';
import type { AsyncMethods } from '../../ui/types/bindings';
import type { GameState } from '../../engine/types/game';
import {
  BattleConfig,
  BattleState,
  BattleCallbacks,
  BattleResult
} from '../types';
import { MAX_AI_ACTIONS_PER_TURN } from '../../engine/constants/battleConstants';

import { createBloomBeastsGame, BloomBeastsActionType, BloomBeastsActionData } from '../BloomBeastsGame';
import { BloomBeastsGreedyAI } from '../BloomBeastsAI';
import { GameController, AILevel } from '../../../turbo/src';
import type { IGameState } from '../../../turbo/src';
import type { BloomBeastsState } from '../BloomBeastsGame';

export class BattleController {
  private async: AsyncMethods;
  private game: GameController<BloomBeastsState, BloomBeastsActionData>;
  private callbacks: BattleCallbacks;
  private battleConfig: BattleConfig | null = null;

  constructor(async: AsyncMethods, callbacks: BattleCallbacks = {}) {
    this.async = async;
    this.callbacks = callbacks;
    this.game = createBloomBeastsGame();
  }

  /**
   * Initialize a new battle between two players
   */
  initializeBattle(config: BattleConfig): BattleState {
    Logger.info('[BattleController] Initializing battle with TURBO engine');

    this.battleConfig = config;

    // Subscribe to game events
    this.game.on('gameStarted', ({ state }) => {
      Logger.info('[BattleController] Game started');
    });

    this.game.on('turnStarted', ({ playerId, turnNumber }) => {
      Logger.debug(`[BattleController] Turn started for player ${playerId}`);
      // Find player index from playerId
      const state = this.game.getState();
      const playerIndex = state.gameData.players.findIndex((p: any) => p.id === playerId);
      if (this.callbacks.onTurnStart) {
        this.callbacks.onTurnStart(playerIndex);
      }
    });

    this.game.on('turnEnded', ({ playerId }) => {
      Logger.debug(`[BattleController] Turn ended for player ${playerId}`);
      const state = this.game.getState();
      const playerIndex = state.gameData.players.findIndex((p: any) => p.id === playerId);
      if (this.callbacks.onTurnEnd) {
        this.callbacks.onTurnEnd(playerIndex);
      }
    });

    this.game.on('actionPerformed', ({ action }) => {
      Logger.debug(`[BattleController] Action performed: ${action.data.type}`);
      if (this.callbacks.onAction) {
        // Convert the action to a string representation for the callback
        const actionStr = `${action.data.type}${action.data.cardId ? `-${action.data.cardId}` : ''}`;
        this.callbacks.onAction(actionStr, action.playerId);
      }
    });

    this.game.on('gameEnded', ({ winnerId }) => {
      Logger.info(`[BattleController] Game ended. Winner: ${winnerId || 'tie'}`);
      if (this.callbacks.onBattleEnd) {
        const state = this.game.getState();
        const battleWinner = winnerId === state.gameData.players[0].id ? 'player1' :
                             winnerId === state.gameData.players[1].id ? 'player2' : null;
        this.callbacks.onBattleEnd(battleWinner);
      }
    });

    this.game.on('stateChanged', ({ state }) => {
      if (this.callbacks.onRender) {
        this.callbacks.onRender();
      }
    });

    // Initialize the TURBO game
    this.game.initialize({
      players: [
        {
          id: config.player1.id,
          name: config.player1.name,
          type: 'human' as any,
          metadata: {
            deck: [...config.player1.deck],
            health: config.player1.health ?? 30,
            maxHealth: config.player1.maxHealth ?? 30,
          }
        },
        {
          id: config.player2.id,
          name: config.player2.name,
          type: 'human' as any,
          metadata: {
            deck: [...config.player2.deck],
            health: config.player2.health ?? 30,
            maxHealth: config.player2.maxHealth ?? 30,
          }
        }
      ]
    });

    // Register AI players if needed
    if (config.player1.isAI) {
      const ai = new BloomBeastsGreedyAI({
        playerId: config.player1.id,
        difficulty: AILevel.MEDIUM
      });
      this.game.registerAI(config.player1.id, ai);
      Logger.info(`[BattleController] Registered AI for player1: ${config.player1.id}`);
    }

    if (config.player2.isAI) {
      const ai = new BloomBeastsGreedyAI({
        playerId: config.player2.id,
        difficulty: AILevel.MEDIUM
      });
      this.game.registerAI(config.player2.id, ai);
      Logger.info(`[BattleController] Registered AI for player2: ${config.player2.id}`);
    }

    Logger.info('[BattleController] Battle initialized successfully');

    return this.getTurboState();
  }

  /**
   * Get the current battle state
   */
  getCurrentBattle(): BattleState | null {
    if (!this.battleConfig) return null;
    return this.getTurboState();
  }

  /**
   * Check if battle has ended and determine winner
   */
  checkBattleEnd(): BattleResult | null {
    if (!this.game.isComplete()) {
      return null;
    }

    const winner = this.game.getWinner();
    const state = this.game.getState();

    return {
      winner: winner === state.gameData.players[0].id ? 'player1' :
              winner === state.gameData.players[1].id ? 'player2' : null,
      turns: state.turnInfo.turnNumber,
      player1Health: state.gameData.players[0].health,
      player2Health: state.gameData.players[1].health,
    };
  }

  /**
   * Mark battle as complete
   */
  completeBattle(winner: 'player1' | 'player2' | null): void {
    // Game completion is handled automatically by TURBO
    if (this.callbacks.onBattleEnd) {
      this.callbacks.onBattleEnd(winner);
    }
    Logger.info(`[BattleController] Battle complete. Winner: ${winner || 'tie'}`);
  }

  /**
   * Play a card
   */
  playCard(cardId: string, playerId: string, position?: number): boolean {
    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.PLAY_CARD,
        cardId,
        position,
      }
    });

    if (!result.success) {
      Logger.warn(`[BattleController] Failed to play card: ${result.error}`);
    }

    return result.success;
  }

  /**
   * Attack with a creature
   */
  attackBeast(attackerId: string, targetId: string, playerId: string): boolean {
    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.ATTACK,
        cardId: attackerId,
        targetId,
      }
    });

    if (!result.success) {
      Logger.warn(`[BattleController] Failed to attack: ${result.error}`);
    }

    return result.success;
  }

  /**
   * Attack player directly
   */
  attackPlayer(attackerId: string, playerId: string): boolean {
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    const currentIndex = state.gameData.players.findIndex(p => p.id === currentPlayerId);
    const targetPlayer = state.gameData.players[1 - currentIndex];

    return this.attackBeast(attackerId, targetPlayer.id, playerId);
  }

  /**
   * Use creature ability
   */
  useAbility(creatureId: string, targetId: string | null, playerId: string): boolean {
    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.USE_ABILITY,
        cardId: creatureId,
        targetId: targetId || undefined,
        abilityId: 'default', // Could be extended to support multiple abilities
      }
    });

    if (!result.success) {
      Logger.warn(`[BattleController] Failed to use ability: ${result.error}`);
    }

    return result.success;
  }

  /**
   * End turn
   */
  endTurn(playerId: string): void {
    Logger.info(`[BattleController] endTurn called for ${playerId}`);
    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.END_TURN,
      }
    });

    if (result.success) {
      const newState = this.game.getState();
      const currentPlayerId = newState.turnInfo.currentPlayerId;
      const currentIndex = newState.gameData.players.findIndex(p => p.id === currentPlayerId);
      Logger.info(`[BattleController] Turn ended successfully. New current player: ${currentPlayerId} (index: ${currentIndex})`);
    } else {
      Logger.error(`[BattleController] Failed to end turn: ${result.error}`);
    }
  }

  /**
   * Execute AI turn - loops until AI ends turn
   */
  async executeAITurn(): Promise<void> {
    Logger.info('[BattleController] executeAITurn called');
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    const currentIndex = state.gameData.players.findIndex(p => p.id === currentPlayerId);
    const currentPlayer = state.gameData.players[currentIndex];
    Logger.info(`[BattleController] Current player: ${currentPlayer.id} (index: ${currentIndex})`);

    try {
      // Keep executing AI actions until turn ends (switches to another player)
      let actionCount = 0;
      const maxActions = MAX_AI_ACTIONS_PER_TURN;

      while (actionCount < maxActions) {
        const currentState = this.game.getState();

        // Check if it's still the AI's turn
        if (currentState.turnInfo.currentPlayerId !== currentPlayerId) {
          Logger.info(`[BattleController] AI turn ended, turn switched to: ${currentState.turnInfo.currentPlayerId}`);
          break;
        }

        // Check if game is complete
        if (currentState.isComplete) {
          Logger.info('[BattleController] Game completed during AI turn');
          break;
        }

        // Execute one AI action
        await this.game.executeAITurn();
        actionCount++;

        Logger.info(`[BattleController] AI executed action ${actionCount}`);
      }

      if (actionCount >= maxActions) {
        Logger.warn('[BattleController] AI reached maximum action limit, forcing turn end');
      }

      Logger.info('[BattleController] AI turn execution completed');
    } catch (error) {
      Logger.error('[BattleController] AI turn execution failed:', error);
      throw error;
    }
  }

  /**
   * Get the current player (TURBO format)
   */
  getCurrentPlayer() {
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    const currentIndex = state.gameData.players.findIndex(p => p.id === currentPlayerId);
    return state.gameData.players[currentIndex];
  }

  /**
   * Get the opponent player (TURBO format)
   */
  getOpponentPlayer() {
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    const currentIndex = state.gameData.players.findIndex(p => p.id === currentPlayerId);
    const opponentIndex = 1 - currentIndex;
    return state.gameData.players[opponentIndex];
  }

  /**
   * Check if it's an AI player's turn
   */
  isAIPlayerTurn(): boolean {
    if (!this.battleConfig) return false;
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    const currentIndex = state.gameData.players.findIndex(p => p.id === currentPlayerId);

    return currentIndex === 0 ?
      !!this.battleConfig.player1.isAI :
      !!this.battleConfig.player2.isAI;
  }

  /**
   * Get available actions for current player
   */
  getAvailableActions() {
    return this.game.getAvailableActions();
  }

  /**
   * Draw a card (if allowed)
   */
  drawCard(playerId: string): boolean {
    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.DRAW_CARD,
      }
    });

    return result.success;
  }

  /**
   * Clean up battle resources
   */
  dispose(): void {
    this.game.reset();
    this.battleConfig = null;
    Logger.info('[BattleController] Battle controller disposed');
  }

  /**
   * Private helper methods
   */

  /**
   * Get current battle state in TURBO format
   */
  private getTurboState(): BattleState {
    return {
      turboState: this.game.getState(),
    };
  }
}