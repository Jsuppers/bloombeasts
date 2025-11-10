/**
 * Battle UI - Manages battle state and connects missions to the battle system
 *
 * This class handles:
 * - Battle initialization and configuration
 * - Mission setup (special rules, opponent configuration)
 * - Reward calculation
 * - Progress tracking
 * - Mission objectives
 *
 * The core battle logic is handled by the generic BattleController.
 */

import { Mission, resolveDeck } from '../missions/types';
import { MissionManager, MissionRunProgress, RewardResult } from '../missions/MissionManager';
import { AnyCard, CardType } from '../../common/engine/types/core';
import { Logger } from '../../common/engine/utils/Logger';
import type { AsyncMethods } from '../../common/ui/types/types/bindings';
import { BattleController } from './engine/core/BattleController';
import type { BattleConfig, BattleState, RuntimeCard, RuntimeBeast } from './engine/types';
import { BloomBeastsActionType } from './engine/types';
import type { BattleAction } from './engine/types/actions';
import type { BloomBeastsPlayer } from './engine/BloomBeastsGame';
import { createBattleCard } from '../../common/utils/cardUtils';
import type { CardInstance } from '../common/types';
import { getCardIdentifier } from './engine/utils/cardIdentifiers';

/**
 * Convert AnyCard[] to RuntimeCard[] for opponent decks
 * Creates minimal CardInstances (level 1, 0 XP) and converts them to RuntimeCards
 */
function convertDeckToRuntimeCards(cards: AnyCard[]): RuntimeCard[] {
  return cards.map((cardDef, index) => {
    // Create minimal CardInstance for opponent cards (level 1)
    const minimalInstance: CardInstance = {
      id: `${cardDef.id}-opp-${index}`,
      cardId: cardDef.id,
      currentXP: 0, // Level 1 (0 XP)
    };

    return createBattleCard(minimalInstance, cardDef);
  });
}

/**
 * Helper: Extract a unique identifier from a RuntimeCard
 * Tries instanceId first, then id, then falls back to provided fallback
 */
function getCardId(card: RuntimeCard, fallback: string): string {
  if ('instanceId' in card && card.instanceId) return card.instanceId;
  if (card.id) return card.id;
  return fallback;
}

/**
 * Helper: Extract a unique identifier from a RuntimeBeast on field
 * Tries instanceId first, then id, then falls back to provided fallback
 */
// Removed: getBeastId - now using getCardIdentifier from cardIdentifiers utility

export class BattleUI {
  private missionManager: MissionManager;
  // private gameEngine: GameEngine;
  private async: AsyncMethods;

  // Battle system components
  private battleController: BattleController;

  // Current state
  private currentBattle: BattleState | null = null;
  private shouldStopAI: boolean = false;

  // Callbacks
  private renderCallback: (() => void) | null = null;

  constructor(missionManager: MissionManager, async: AsyncMethods) {
    this.missionManager = missionManager;
    this.async = async;

    // Initialize battle controller
    this.battleController = new BattleController(async);

    // Subscribe to TURBO events
    this.setupEventListeners();
  }

  /**
   * Setup TURBO event listeners
   */
  private setupEventListeners(): void {
    const game = this.battleController.getGameController();

    game.on('turnStarted', ({ playerId, turnNumber }) => {
      Logger.debug(`[BattleUI] Turn ${turnNumber} started for player ${playerId}`);
    });

    game.on('turnEnded', ({ playerId }) => {
      Logger.debug(`[BattleUI] Turn ended for player ${playerId}`);
    });

    game.on('stateChanged', () => {
      if (this.renderCallback) {
        this.renderCallback();
      }
    });
  }

  /**
   * Set a callback to trigger UI re-rendering
   */
  setRenderCallback(callback: () => void): void {
    this.renderCallback = callback;
  }

  /**
   * Initialize a mission battle
   */
  initializeBattle(playerDeckCards: RuntimeCard[], playerName?: string): BattleState | null {
    this.shouldStopAI = false;

    const mission = this.missionManager.getCurrentMission();
    if (!mission) {
      Logger.error('No mission selected');
      return null;
    }

    // Resolve the opponent deck
    const opponentDeck = resolveDeck(mission.opponentDeck);

    // Log opponent deck info for debugging
    Logger.info(`[BattleUI] Opponent deck for ${mission.id}: ${opponentDeck.cards.length} cards`);
    if (opponentDeck.cards.length === 0) {
      Logger.error(`[BattleUI] Opponent deck is EMPTY for mission ${mission.id}! This will cause immediate game end.`);
    }

    // Convert opponent deck cards to RuntimeCards (level 1)
    const opponentRuntimeCards = convertDeckToRuntimeCards(opponentDeck.cards);

    Logger.info(`[BattleUI] Converted opponent runtime cards: ${opponentRuntimeCards.length}`);

    // Configure opponent health (mission 1 has reduced health for tutorial)
    const opponentHealth = mission.id === 'mission-01' ? 1 : 30;
    const opponentMaxHealth = mission.id === 'mission-01' ? 1 : 30;

    // Configure battle
    const battleConfig: BattleConfig = {
      player1: {
        id: 'player',
        name: playerName ?? 'Player',  // Use player's actual name from PlayerData
        deck: playerDeckCards,
        health: 30,
        maxHealth: 30,
      },
      player2: {
        id: 'opponent',
        name: mission.name,  // Use mission name as opponent name (e.g., "Rootling")
        deck: opponentRuntimeCards,
        health: opponentHealth,
        maxHealth: opponentMaxHealth,
        isAI: true,
      },
    };

    // Initialize battle using generic battle controller
    const battle = this.battleController.initializeBattle(battleConfig);

    // Store battle state
    this.currentBattle = battle;

    return this.currentBattle;
  }

  /**
   * Get current battle state
   */
  getCurrentBattle(): BattleState | null {
    return this.currentBattle;
  }

  /**
   * Get mission manager
   */
  getMissionManager(): MissionManager {
    return this.missionManager;
  }

  /**
   * Helper: Get player from TURBO state (player is always index 0)
   */
  private getPlayer() {
    return this.currentBattle?.turboState.gameData.players[0];
  }

  /**
   * Helper: Get opponent from TURBO state (opponent is always index 1)
   */
  private getOpponent() {
    return this.currentBattle?.turboState.gameData.players[1];
  }

  /**
   * Helper: Get player field from TURBO state
   */
  private getPlayerField() {
    return this.currentBattle?.turboState.gameData.field.player1;
  }

  /**
   * Helper: Get opponent field from TURBO state
   */
  private getOpponentField() {
    return this.currentBattle?.turboState.gameData.field.player2;
  }

  /**
   * Process a typed player action
   */
  async processTypedAction(action: BattleAction, data?: any): Promise<void> {
    if (!this.currentBattle?.turboState) {
      Logger.error('No active battle');
      return;
    }

    const player = this.getPlayer();
    const opponent = this.getOpponent();

    if (!player || !opponent) {
      Logger.error('Invalid battle state: missing players');
      return;
    }

    let result: any = { success: false, damage: data?.damage || 0 };
    const playerId = action.playerId || 'player';

    // Process based on action type
    switch (action.type) {
      case 'play-card': {
        // Get the card from player's hand
        const card = player.hand[action.cardIndex];
        if (card) {
          // Use the canonical card identifier (prefers instanceId)
          const cardId = getCardIdentifier(card);

          // For Beast and Buff cards, find an empty position if not specified
          let position = action.position || action.targetIndex;
          if (position === undefined) {
            const playerField = this.getPlayerField();
            if (playerField) {
              if (card.type === CardType.Beast) {
                // Find the first empty beast slot
                for (let i = 0; i < 3; i++) {
                  if (!playerField.beasts[i]) {
                    position = i;
                    break;
                  }
                }
              } else if (card.type === CardType.Buff) {
                // Find the first empty buff slot
                for (let i = 0; i < 3; i++) {
                  if (!playerField.buffs[i]) {
                    position = i;
                    break;
                  }
                }
              }
            }
          }

          result.success = this.battleController.playCard(cardId, playerId, position);
        }
        break;
      }

      case 'use-ability': {
        // Use beastIndex to find the beast on the field
        const beastIndex = action.beastIndex;
        if (beastIndex !== undefined) {
          const playerField = this.getPlayerField();
          const beast = playerField?.beasts[beastIndex];
          if (beast) {
            const beastId = getCardIdentifier(beast);
            result.success = this.battleController.useAbility(beastId, null, playerId);
          }
        }
        break;
      }

      case 'auto-attack-all': {
        result = await this.autoAttackAll(player, opponent, data?.onAttackAnimation);
        break;
      }

      // NOTE: attack-beast and attack-player are legacy - all attacks now use auto-attack-all
      // which handles slot-based targeting. Keeping type definitions for backwards compatibility.
      case 'attack-beast':
      case 'attack-player': {
        Logger.warn('[BattleUI] Direct attack actions are deprecated - use auto-attack-all instead');
        result.success = false;
        break;
      }

      case 'end-turn': {
        result = await this.endPlayerTurn();
        break;
      }

      case 'forfeit': {
        // Process forfeit action through TURBO
        const turboResult = this.battleController.getGameController().performAction({
          type: 'game_action',
          playerId,
          data: { type: BloomBeastsActionType.FORFEIT },
        });
        result.success = turboResult.success;
        break;
      }

      case 'timeout': {
        // Process timeout action through TURBO
        // Action is executed by current player, but marks who actually timed out
        const turboResult = this.battleController.getGameController().performAction({
          type: 'game_action',
          playerId,
          data: {
            type: BloomBeastsActionType.TIMEOUT,
            timedOutPlayerId: action.timedOutPlayerId || playerId
          },
        });
        result.success = turboResult.success;
        break;
      }

      default: {
        // TypeScript exhaustiveness check ensures this is unreachable
        const exhaustiveCheck: never = action;
        Logger.warn(`[BattleUI] Unknown action type: ${(exhaustiveCheck as BattleAction).type}`);
      }
    }

    // Sync state from BattleController immediately after action
    const updatedBattle = this.battleController.getCurrentBattle();
    if (updatedBattle) {
      this.currentBattle = updatedBattle;
    }

    // Update mission progress
    this.updateMissionProgress(action, result);

    // Check for battle end with the freshly synced state
    const battleResult = this.battleController.checkBattleEnd();
    if (battleResult) {
      this.endBattle();
    }
  }

  /**
   * Auto-attack with all beasts
   */
  private async autoAttackAll(
    player: BloomBeastsPlayer,
    opponent: BloomBeastsPlayer,
    onAttackAnimation?: (attackerIndex: number, targetType: 'beast' | 'health', targetIndex?: number) => Promise<void>
  ): Promise<any> {
    let anyAttackSucceeded = false;
    const results: any[] = [];
    const playerId = 'player';

    for (let i = 0; i < 3; i++) {
      // CRITICAL: Refresh field state before each attack to reflect deaths from previous attacks
      const playerField = this.getPlayerField();
      const opponentField = this.getOpponentField();

      if (!playerField || !opponentField) {
        results.push({ success: false });
        continue;
      }

      const attackerBeast = playerField.beasts[i];
      if (!attackerBeast || attackerBeast.summoningSickness) continue;

      const opposingBeast = opponentField.beasts[i];
      let success = false;

      if (opposingBeast) {
        if (onAttackAnimation) await onAttackAnimation(i, 'beast', i);
        const attackerId = getCardIdentifier(attackerBeast);
        const targetId = getCardIdentifier(opposingBeast);
        success = this.battleController.attackBeast(attackerId, targetId, playerId);
      } else {
        if (onAttackAnimation) await onAttackAnimation(i, 'health');
        const attackerId = getCardIdentifier(attackerBeast);
        success = this.battleController.attackPlayer(attackerId, playerId);
      }

      results.push({ success });
      if (success) anyAttackSucceeded = true;

      const battleResult = this.battleController.checkBattleEnd();
      if (battleResult) break;
    }

    return {
      success: anyAttackSucceeded,
      results: results,
      message: anyAttackSucceeded ? 'Auto-attack completed' : 'No attacks could be performed'
    };
  }

  /**
   * End player's turn and start opponent's turn
   */
  private async endPlayerTurn(): Promise<any> {
    Logger.info('[BattleUI] endPlayerTurn called');
    if (!this.currentBattle?.turboState) {
      Logger.warn('[BattleUI] No current battle for endPlayerTurn');
      return { success: false };
    }

    // Check if battle is already complete (e.g., player just won)
    if (this.currentBattle.turboState.isComplete) {
      Logger.info('[BattleUI] Battle is already complete');
      return { success: false };
    }

    // Check if battle has ended before processing end-of-turn
    const battleResultBeforeTurn = this.battleController.checkBattleEnd();
    if (battleResultBeforeTurn) {
      Logger.info('[BattleUI] Battle ended before turn could end');
      return { success: false };
    }

    // End player turn using BattleController
    Logger.info('[BattleUI] Ending player turn via BattleController');
    this.battleController.endTurn('player');

    // Update the local game state immediately after turn change
    const stateAfterTurnEnd = this.battleController.getCurrentBattle();
    if (stateAfterTurnEnd) {
      this.currentBattle = stateAfterTurnEnd;
      Logger.info('[BattleUI] Updated local battle state after turn end');
      // Trigger render to update UI with new turn
      if (this.renderCallback) this.renderCallback();
    }

    // Process opponent AI turn
    Logger.info('[BattleUI] Now processing opponent turn');
    await this.processOpponentTurn();

    // Update the local game state again after AI turn
    const battleState = this.battleController.getCurrentBattle();
    if (battleState) {
      this.currentBattle = battleState;
      Logger.info('[BattleUI] Updated local battle state after AI turn');
      // Trigger render to update UI to show player's turn
      if (this.renderCallback) this.renderCallback();
    }

    return { success: true };
  }

  /**
   * Process opponent's AI turn
   */
  private async processOpponentTurn(): Promise<void> {
    Logger.info('[BattleUI] Processing opponent turn');
    if (!this.currentBattle?.turboState) {
      Logger.warn('[BattleUI] No current battle state for opponent turn');
      return;
    }

    // Helper function for delays
    const delay = (ms: number) => new Promise(resolve => this.async.setTimeout(resolve, ms));

    try {
      // Check if it's actually an AI player's turn
      if (!this.battleController.isAIPlayerTurn()) {
        Logger.info('[BattleUI] Current player is not AI, skipping AI turn');
        return;
      }

      // Small delay before AI starts for better UX
      await delay(500);
      if (this.shouldStopAI) return;

      // Execute AI turn using BattleController
      // The TURBO system will handle all the turn mechanics
      // Pass callback to update UI after each AI action
      Logger.info('[BattleUI] Executing AI turn');
      await this.battleController.executeAITurn(() => {
        // Update display after each AI action for smoother UX and timer updates
        const updatedState = this.battleController.getCurrentBattle();
        if (updatedState) {
          // this.currentBattle.battleState = updatedState;
          if (this.renderCallback) this.renderCallback();
        }
      });
      Logger.info('[BattleUI] AI turn completed');

      // Final update after AI completes
      const updatedState = this.battleController.getCurrentBattle();
      if (updatedState) {
        this.currentBattle = updatedState;
        if (this.renderCallback) this.renderCallback();
      }
    } catch (error) {
      Logger.error('[BattleUI] Failed to process opponent turn:', error);
    }
  }

  /**
   * Update mission progress based on action
   */
  private updateMissionProgress(action: BattleAction, result: any): void {
    if (!this.currentBattle) return;

    const player = this.getPlayer();
    const opponent = this.getOpponent();
    if (!player || !opponent) return;

    // Update health values in mission progress
    this.missionManager.updateProgress('health-update', {
      playerHealth: player.health,
      opponentHealth: opponent.health
    });

    // Check if opponent is defeated
    if (opponent.health <= 0) {
      Logger.info('[BattleUI] Opponent defeated! Updating mission progress.');
      this.missionManager.updateProgress('opponent-defeated', {});
    }

    // Track other actions
    if (action.type === 'play-card') {
      this.missionManager.updateProgress('beast-summoned', {});
    }
  }

  /**
   * End the battle and calculate rewards
   */
  private endBattle(): void {
    if (!this.currentBattle) {
      Logger.info('[BattleUI] endBattle called but no current battle');
      return;
    }

    // Prevent multiple calls
    if (this.currentBattle.turboState.isComplete) {
      Logger.info('[BattleUI] Battle already completed, ignoring duplicate endBattle call');
      return;
    }

    const battleResult = this.battleController.checkBattleEnd();
    if (!battleResult) {
      Logger.info('[BattleUI] endBattle called but battle not ended yet');
      return;
    }

    Logger.info(`[BattleUI] Battle ending. Winner: ${battleResult.winner}, P1 HP: ${battleResult.player1Health}, P2 HP: ${battleResult.player2Health}`);

    this.shouldStopAI = true;

    // Update mission progress based on winner
    if (battleResult.winner === 'player1') {
      // Player won! Mark opponent as defeated for mission progress
      Logger.info('[BattleUI] Player 1 won! Marking opponent as defeated.');
      Logger.info(`[BattleUI] About to call updateProgress. MissionManager exists: ${!!this.missionManager}`);

      this.missionManager.updateProgress('opponent-defeated', {});
      Logger.info('[BattleUI] updateProgress called successfully');
      this.battleController.completeBattle('player1');
    } else if (battleResult.winner === 'player2') {
      // Player lost
      Logger.info('[BattleUI] Player 2 won! No rewards.');
      this.battleController.completeBattle('player2');
    } else {
      // Tie (both died) - treat as loss for now
      Logger.info('[BattleUI] Tie! No rewards.');
      this.battleController.completeBattle(null);
    }

    Logger.info(`[BattleUI] Battle ended.`);
  }

  /**
   * Stop AI processing (when battle ends or is forfeit)
   */
  stopAI(): void {
    this.shouldStopAI = true;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stopAI();
    this.battleController.dispose();
    this.currentBattle = null;
  }
}
