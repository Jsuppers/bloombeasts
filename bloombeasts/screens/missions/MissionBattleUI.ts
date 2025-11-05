/**
 * Mission Battle UI - Mission-specific wrapper around the generic battle system
 *
 * This class adds mission-specific functionality on top of the generic BattleController:
 * - Mission setup (special rules, opponent configuration)
 * - Reward calculation
 * - Progress tracking
 * - Mission objectives
 *
 * The core battle logic is handled by the generic BattleController.
 */

import { Mission, resolveDeck } from './types';
import { MissionManager, MissionRunProgress, RewardResult } from './MissionManager';
import { GameEngine } from '../../engine/systems/GameEngine';
import { GameState, Player } from '../../engine/types/game';
import { AnyCard, CardType } from '../../engine/types/core';
import { Logger } from '../../engine/utils/Logger';
import type { AsyncMethods } from '../../ui/types/bindings';
import { BattleController } from '../../battle/core/BattleController';
import type { BattleConfig, BattleState, BattleCallbacks } from '../../battle/types';
import { parseActionString, type BattleAction } from '../../battle/types/actions';

export interface BattleUIState {
  mission: Mission;
  battleState: BattleState | null;
  progress: MissionRunProgress | null;
  isComplete: boolean;
  rewards: RewardResult | null;
}

export class MissionBattleUI {
  private missionManager: MissionManager;
  private gameEngine: GameEngine;
  private async: AsyncMethods;

  // Battle system components
  private battleController: BattleController;

  // Current state
  private currentBattle: BattleUIState | null = null;
  private shouldStopAI: boolean = false;

  // Callbacks
  private renderCallback: (() => void) | null = null;
  private opponentActionCallback: ((action: string) => void) | null = null;
  private playerLowHealthTriggered: boolean = false;

  constructor(missionManager: MissionManager, gameEngine: GameEngine, async: AsyncMethods) {
    this.missionManager = missionManager;
    this.gameEngine = gameEngine;
    this.async = async;

    // Initialize battle controller with callbacks
    const battleCallbacks: BattleCallbacks = {
      onTurnStart: (playerIndex: number) => {
        Logger.debug(`[MissionBattleUI] Turn started for player ${playerIndex}`);
      },
      onTurnEnd: (playerIndex: number) => {
        Logger.debug(`[MissionBattleUI] Turn ended for player ${playerIndex}`);
      },
      onRender: () => {
        if (this.renderCallback) this.renderCallback();
      },
    };

    this.battleController = new BattleController(async, battleCallbacks);
  }

  /**
   * Set a callback to trigger UI re-rendering
   */
  setRenderCallback(callback: () => void): void {
    this.renderCallback = callback;
  }

  /**
   * Set a callback for opponent actions (for sound effects, etc.)
   */
  setOpponentActionCallback(callback: (action: string) => void): void {
    this.opponentActionCallback = callback;
  }

  /**
   * Initialize a mission battle
   */
  initializeBattle(playerDeckCards: AnyCard[], playerName?: string): BattleUIState | null {
    this.shouldStopAI = false;
    this.playerLowHealthTriggered = false;

    const mission = this.missionManager.getCurrentMission();
    if (!mission) {
      Logger.error('No mission selected');
      return null;
    }

    // Resolve the opponent deck
    const opponentDeck = resolveDeck(mission.opponentDeck);

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
        deck: opponentDeck.cards,
        health: opponentHealth,
        maxHealth: opponentMaxHealth,
        isAI: true,
      },
    };

    // Initialize battle using generic battle controller
    const battle = this.battleController.initializeBattle(battleConfig);

    // Create mission-specific state
    this.currentBattle = {
      mission,
      battleState: battle,
      progress: this.missionManager.getProgress(),
      isComplete: false,
      rewards: null,
    };

    return this.currentBattle;
  }

  /**
   * Get current battle state
   */
  getCurrentBattle(): BattleUIState | null {
    return this.currentBattle;
  }

  /**
   * Helper: Get player from TURBO state (player is always index 0)
   */
  private getPlayer() {
    return this.currentBattle?.battleState?.turboState.gameData.players[0];
  }

  /**
   * Helper: Get opponent from TURBO state (opponent is always index 1)
   */
  private getOpponent() {
    return this.currentBattle?.battleState?.turboState.gameData.players[1];
  }

  /**
   * Helper: Get player field from TURBO state
   */
  private getPlayerField() {
    return this.currentBattle?.battleState?.turboState.gameData.field.player1;
  }

  /**
   * Helper: Get opponent field from TURBO state
   */
  private getOpponentField() {
    return this.currentBattle?.battleState?.turboState.gameData.field.player2;
  }

  /**
   * Process a player action (string-based, for backwards compatibility)
   * @deprecated Use processTypedAction instead
   */
  async processPlayerAction(action: string, data: any): Promise<void> {
    // Parse string action to typed action
    const typedAction = parseActionString(action, 'player');
    if (!typedAction) {
      Logger.error(`[MissionBattleUI] Failed to parse action: ${action}`);
      return;
    }

    // Process typed action
    await this.processTypedAction(typedAction, data);
  }

  /**
   * Process a typed player action
   */
  async processTypedAction(action: BattleAction, data?: any): Promise<void> {
    if (!this.currentBattle?.battleState) {
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
          // Use the card's id property
          const cardId = action.cardId || (card as any).id || (card as any).name || action.cardIndex.toString();

          // For Beast cards, find an empty position if not specified
          let position = action.position || action.targetIndex;
          if (card.type === CardType.Beast && position === undefined) {
            // Find the first empty slot
            for (let i = 0; i < 3; i++) {
              if (!player.field[i]) {
                position = i;
                break;
              }
            }
          }

          result.success = this.battleController.playCard(cardId, playerId, position);
        }
        break;
      }

      case 'use-ability': {
        const beastIndex = action.beastIndex;
        if (beastIndex !== undefined) {
          const beast = player.field[beastIndex];
          if (beast) {
            const beastId = action.beastId || (beast as any).id || (beast as any).instanceId || beastIndex.toString();
            result.success = this.battleController.useAbility(beastId, null, playerId);
          }
        }
        break;
      }

      case 'auto-attack-all': {
        result = await this.autoAttackAll(player, opponent, data?.onAttackAnimation);
        break;
      }

      case 'attack-beast': {
        const attackerIndex = action.attackerIndex;
        const targetIndex = action.targetIndex;
        if (attackerIndex !== undefined && targetIndex !== undefined) {
          const attacker = player.field[attackerIndex];
          const target = opponent.field[targetIndex];
          if (attacker && target) {
            const attackerId = action.attackerId || (attacker as any).id || (attacker as any).instanceId || attackerIndex.toString();
            const targetId = action.targetId || (target as any).id || (target as any).instanceId || targetIndex.toString();
            result.success = this.battleController.attackBeast(attackerId, targetId, playerId);
          }
        }
        break;
      }

      case 'attack-player': {
        const attackerIndex = action.attackerIndex;
        if (attackerIndex !== undefined) {
          const attacker = player.field[attackerIndex];
          if (attacker) {
            const attackerId = action.attackerId || (attacker as any).id || (attacker as any).instanceId || attackerIndex.toString();
            result.success = this.battleController.attackPlayer(attackerId, playerId);
          }
        }
        break;
      }

      case 'end-turn': {
        result = await this.endPlayerTurn();
        break;
      }

      case 'forfeit': {
        // TODO: Implement forfeit
        Logger.warn('[MissionBattleUI] Forfeit action not yet implemented');
        break;
      }

      default: {
        Logger.warn(`[MissionBattleUI] Unknown action type: ${(action as any).type}`);
      }
    }

    // Sync state from BattleController immediately after action
    const updatedBattle = this.battleController.getCurrentBattle();
    if (updatedBattle && this.currentBattle) {
      this.currentBattle.battleState = updatedBattle;
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
    player: Player,
    opponent: Player,
    onAttackAnimation?: (attackerIndex: number, targetType: 'beast' | 'health', targetIndex?: number) => Promise<void>
  ): Promise<any> {
    let anyAttackSucceeded = false;
    const results: any[] = [];
    const playerId = 'player';

    for (let i = 0; i < 3; i++) {
      const attackerBeast = player.field[i];
      if (!attackerBeast || attackerBeast.summoningSickness) continue;

      const opposingBeast = opponent.field[i];
      let success = false;

      if (opposingBeast) {
        if (onAttackAnimation) await onAttackAnimation(i, 'beast', i);
        const attackerId = (attackerBeast as any).id || (attackerBeast as any).instanceId || i.toString();
        const targetId = (opposingBeast as any).id || (opposingBeast as any).instanceId || i.toString();
        success = this.battleController.attackBeast(attackerId, targetId, playerId);
      } else {
        if (onAttackAnimation) await onAttackAnimation(i, 'health');
        const attackerId = (attackerBeast as any).id || (attackerBeast as any).instanceId || i.toString();
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
    Logger.info('[MissionBattleUI] endPlayerTurn called');
    if (!this.currentBattle?.battleState) {
      Logger.warn('[MissionBattleUI] No current battle for endPlayerTurn');
      return { success: false };
    }

    // Check if battle is already complete (e.g., player just won)
    if (this.currentBattle.isComplete) {
      Logger.info('[MissionBattleUI] Battle is already complete');
      return { success: false };
    }

    // Check if battle has ended before processing end-of-turn
    const battleResultBeforeTurn = this.battleController.checkBattleEnd();
    if (battleResultBeforeTurn) {
      Logger.info('[MissionBattleUI] Battle ended before turn could end');
      return { success: false };
    }

    // End player turn using BattleController
    Logger.info('[MissionBattleUI] Ending player turn via BattleController');
    this.battleController.endTurn('player');

    // Update the local game state immediately after turn change
    const stateAfterTurnEnd = this.battleController.getCurrentBattle();
    if (stateAfterTurnEnd) {
      this.currentBattle.battleState = stateAfterTurnEnd;
      Logger.info('[MissionBattleUI] Updated local battle state after turn end');
      // Trigger render to update UI with new turn
      if (this.renderCallback) this.renderCallback();
    }

    // Process opponent AI turn
    Logger.info('[MissionBattleUI] Now processing opponent turn');
    await this.processOpponentTurn();

    // Update the local game state again after AI turn
    const battleState = this.battleController.getCurrentBattle();
    if (battleState) {
      this.currentBattle.battleState = battleState;
      Logger.info('[MissionBattleUI] Updated local battle state after AI turn');
      // Trigger render to update UI to show player's turn
      if (this.renderCallback) this.renderCallback();
    }

    return { success: true };
  }

  /**
   * Process opponent's AI turn
   */
  private async processOpponentTurn(): Promise<void> {
    Logger.info('[MissionBattleUI] Processing opponent turn');
    if (!this.currentBattle?.battleState) {
      Logger.warn('[MissionBattleUI] No current battle state for opponent turn');
      return;
    }

    // Helper function for delays
    const delay = (ms: number) => new Promise(resolve => this.async.setTimeout(resolve, ms));

    try {
      // Check if it's actually an AI player's turn
      if (!this.battleController.isAIPlayerTurn()) {
        Logger.info('[MissionBattleUI] Current player is not AI, skipping AI turn');
        return;
      }

      // Small delay before AI starts for better UX
      await delay(500);
      if (this.shouldStopAI) return;

      // Execute AI turn using BattleController
      // The TURBO system will handle all the turn mechanics
      Logger.info('[MissionBattleUI] Executing AI turn');
      await this.battleController.executeAITurn();
      Logger.info('[MissionBattleUI] AI turn completed');

      // Update local state and render after AI completes
      const updatedState = this.battleController.getCurrentBattle();
      if (updatedState) {
        this.currentBattle.battleState = updatedState;
        if (this.renderCallback) this.renderCallback();
      }
    } catch (error) {
      Logger.error('[MissionBattleUI] Failed to process opponent turn:', error);
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
      console.log('[MissionBattleUI] Opponent defeated! Updating mission progress.');
      this.missionManager.updateProgress('opponent-defeated', {});
    }

    // Track other actions
    if (action.type === 'play-card') {
      this.missionManager.updateProgress('beast-summoned', {});
    }
  }

  /**
   * Check if battle has ended
   */
  private checkBattleEnd(): boolean {
    return this.battleController.checkBattleEnd() !== null;
  }

  /**
   * End the battle and calculate rewards
   */
  private endBattle(): void {
    if (!this.currentBattle) {
      console.log('[MissionBattleUI] endBattle called but no current battle');
      return;
    }

    // Prevent multiple calls
    if (this.currentBattle.isComplete) {
      console.log('[MissionBattleUI] Battle already completed, ignoring duplicate endBattle call');
      return;
    }

    const battleResult = this.battleController.checkBattleEnd();
    if (!battleResult) {
      console.log('[MissionBattleUI] endBattle called but battle not ended yet');
      return;
    }

    console.log(`[MissionBattleUI] Battle ending. Winner: ${battleResult.winner}, P1 HP: ${battleResult.player1Health}, P2 HP: ${battleResult.player2Health}`);
    Logger.info(`[MissionBattleUI] Battle ending. Winner: ${battleResult.winner}, P1 HP: ${battleResult.player1Health}, P2 HP: ${battleResult.player2Health}`);

    this.shouldStopAI = true;
    this.currentBattle.isComplete = true;

    // Calculate rewards based on winner
    if (battleResult.winner === 'player1') {
      // Player won!
      console.log('[MissionBattleUI] Player 1 (YOU) won! Awarding rewards.');
      Logger.info('[MissionBattleUI] Player 1 won! Awarding rewards.');
      this.currentBattle.rewards = this.missionManager.completeMission();
      this.battleController.completeBattle('player1');
    } else if (battleResult.winner === 'player2') {
      // Player lost
      console.log('[MissionBattleUI] Player 2 (OPPONENT) won! No rewards.');
      Logger.info('[MissionBattleUI] Player 2 won! No rewards.');
      this.currentBattle.rewards = null;
      this.battleController.completeBattle('player2');
    } else {
      // Tie (both died) - treat as loss for now
      console.log('[MissionBattleUI] Tie (both died)! No rewards.');
      Logger.info('[MissionBattleUI] Tie! No rewards.');
      this.currentBattle.rewards = null;
      this.battleController.completeBattle(null);
    }

    console.log(`[MissionBattleUI] Battle ended. Rewards set: ${this.currentBattle.rewards !== null}, Rewards object:`, this.currentBattle.rewards);
    Logger.info(`[MissionBattleUI] Battle ended. Rewards set: ${this.currentBattle.rewards !== null}`);
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
