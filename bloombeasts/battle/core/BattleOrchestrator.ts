/**
 * BattleOrchestrator - Orchestrates battle lifecycle and coordinates subsystems
 *
 * Responsibilities:
 * - Initialize battles
 * - Subscribe to game events
 * - Coordinate between subsystems (AI, Actions, Win conditions)
 * - Manage battle lifecycle
 */

import { Turbo } from '../../lib/Turbo-Standalone';

import { Logger } from '../../engine/utils/Logger';
import type { AsyncMethods } from '../../ui/types/bindings';
import type { BloomBeastsState, BloomBeastsActionData, BloomBeastsPlayer } from '../BloomBeastsGame';
import { createBloomBeastsGame } from '../BloomBeastsGame';
import type { BattleConfig, BattleState } from '../types';
import { AIManager } from './AIManager';
import { ActionProcessor } from './ActionProcessor';
import { WinConditionChecker } from './WinConditionChecker';

export class BattleOrchestrator {
  private async: AsyncMethods;
  private game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>;
  private config: BattleConfig | null = null;

  // Subsystems
  public readonly ai: AIManager;
  public readonly actions: ActionProcessor;
  public readonly winChecker: WinConditionChecker;

  constructor(async: AsyncMethods) {
    this.async = async;
    this.game = createBloomBeastsGame();

    // Initialize subsystems
    this.ai = new AIManager(this.game);
    this.actions = new ActionProcessor(this.game);
    this.winChecker = new WinConditionChecker();
  }

  /**
   * Initialize a new battle
   */
  initializeBattle(config: BattleConfig): BattleState {
    Logger.info('[BattleOrchestrator] Initializing battle with TURBO engine');

    this.config = config;

    // Initialize the TURBO game
    this.game.initialize({
      players: [
        {
          id: config.player1.id,
          name: config.player1.name,
          type: config.player1.isAI ? Turbo.PlayerType.AI : Turbo.PlayerType.HUMAN,
          metadata: {
            deck: [...config.player1.deck],
            health: config.player1.health ?? 30,
            maxHealth: config.player1.maxHealth ?? 30,
          }
        },
        {
          id: config.player2.id,
          name: config.player2.name,
          type: config.player2.isAI ? Turbo.PlayerType.AI : Turbo.PlayerType.HUMAN,
          metadata: {
            deck: [...config.player2.deck],
            health: config.player2.health ?? 30,
            maxHealth: config.player2.maxHealth ?? 30,
          }
        }
      ]
    });

    // Register AI players
    this.ai.registerAIPlayers(config);

    Logger.info('[BattleOrchestrator] Battle initialized successfully');

    return this.getState();
  }

  /**
   * Get the underlying TURBO game controller
   * Consumers should subscribe to TURBO events directly
   */
  getGameController(): Turbo.GameController<BloomBeastsState, BloomBeastsActionData> {
    return this.game;
  }

  /**
   * Get current battle state
   */
  getState(): BattleState {
    return {
      turboState: this.game.getState(),
    };
  }

  /**
   * Get current player
   */
  getCurrentPlayer(): BloomBeastsPlayer {
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    const currentPlayer = state.gameData.players.find(p => p.id === currentPlayerId);

    if (!currentPlayer) {
      throw new Error('Current player not found');
    }

    return currentPlayer;
  }

  /**
   * Get opponent player
   */
  getOpponentPlayer(): BloomBeastsPlayer {
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    const currentIndex = state.gameData.players.findIndex(p => p.id === currentPlayerId);
    const opponentIndex = 1 - currentIndex;

    return state.gameData.players[opponentIndex];
  }

  /**
   * Check if game is complete
   */
  isComplete(): boolean {
    return this.game.isComplete();
  }

  /**
   * Get game winner
   */
  getWinner(): string | null {
    return this.game.getWinner() || null;
  }

  /**
   * Dispose battle resources
   */
  dispose(): void {
    this.game.reset();
    this.ai.clear();
    this.config = null;
    Logger.info('[BattleOrchestrator] Battle disposed');
  }
}
