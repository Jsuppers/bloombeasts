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
import { AnyCard } from '../../engine/types/core';
import { Logger } from '../../engine/utils/Logger';
import type { AsyncMethods } from '../../ui/types/bindings';
import { BattleController } from '../../battle/core/BattleController';
import { BattleStateManager } from '../../battle/core/BattleRules';
import { OpponentAI } from '../../battle/ai/OpponentAI';
import type { BattleConfig, BattleState, BattleCallbacks } from '../../battle/types';

export interface BattleUIState {
  mission: Mission;
  gameState: GameState | null;
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
  private battleStateManager: BattleStateManager;
  private opponentAI: OpponentAI;

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

    // Initialize battle components
    this.battleStateManager = new BattleStateManager();
    this.opponentAI = new OpponentAI({
      async,
      onAction: (action: string) => {
        if (this.opponentActionCallback) this.opponentActionCallback(action);
      },
      onRender: () => {
        if (this.renderCallback) this.renderCallback();
      },
    });

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
      gameState: battle.gameState,
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
   * Process a player action
   */
  async processPlayerAction(action: string, data: any): Promise<void> {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      Logger.error('No active battle');
      return;
    }

    let result: any = { success: false, damage: data?.damage || 0 };

    // Handle different action types using BattleStateManager
    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    if (action.startsWith('play-card-')) {
      const parts = action.substring('play-card-'.length).split('-target-');
      const cardIndex = parseInt(parts[0], 10);
      const targetIndex = parts.length > 1 ? parseInt(parts[1], 10) : undefined;
      result = this.battleStateManager.playCard(cardIndex, player, opponent, this.currentBattle.gameState, targetIndex);

    } else if (action.startsWith('use-ability-')) {
      const beastIndex = parseInt(action.substring('use-ability-'.length), 10);
      result = this.battleStateManager.useAbility(beastIndex, player, opponent, this.currentBattle.gameState);

    } else if (action === 'auto-attack-all') {
      result = await this.autoAttackAll(player, opponent, data?.onAttackAnimation);

    } else if (action.startsWith('attack-beast-')) {
      const parts = action.substring('attack-beast-'.length).split('-');
      const attackerIndex = parseInt(parts[0], 10);
      const targetIndex = parseInt(parts[1], 10);
      result = this.battleStateManager.attackBeast(attackerIndex, targetIndex, player, opponent, (trapName: string) => {
        if (this.opponentActionCallback) this.opponentActionCallback('trap-activated');
      });

    } else if (action.startsWith('attack-player-')) {
      const attackerIndex = parseInt(action.substring('attack-player-'.length), 10);
      result = this.battleStateManager.attackPlayer(attackerIndex, player, opponent, (trapName: string) => {
        if (this.opponentActionCallback) this.opponentActionCallback('trap-activated');
      });

    } else if (action === 'end-turn') {
      result = await this.endPlayerTurn();
    }

    // Update mission progress
    this.updateMissionProgress(action, result);

    // Check for battle end
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

    for (let i = 0; i < 3; i++) {
      const attackerBeast = player.field[i];
      if (!attackerBeast || attackerBeast.summoningSickness) continue;

      const opposingBeast = opponent.field[i];

      if (opposingBeast) {
        if (onAttackAnimation) await onAttackAnimation(i, 'beast', i);
        const result = this.battleStateManager.attackBeast(i, i, player, opponent, (trapName: string) => {
          if (this.opponentActionCallback) this.opponentActionCallback('trap-activated');
        });
        results.push(result);
        if (result.success) anyAttackSucceeded = true;
      } else {
        if (onAttackAnimation) await onAttackAnimation(i, 'health');
        const result = this.battleStateManager.attackPlayer(i, player, opponent, (trapName: string) => {
          if (this.opponentActionCallback) this.opponentActionCallback('trap-activated');
        });
        results.push(result);
        if (result.success) anyAttackSucceeded = true;
      }

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
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return { success: false };
    }

    // Check if battle is already complete (e.g., player just won)
    if (this.currentBattle.isComplete) {
      return { success: false };
    }

    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    // Check if battle has ended before processing end-of-turn
    const battleResultBeforeTurn = this.battleController.checkBattleEnd();
    if (battleResultBeforeTurn) {
      return { success: false };
    }

    // Process end-of-turn effects
    player.field.forEach((beast: any) => {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedAbilityThisTurn = false;
      }
    });
    this.battleStateManager.processEndOfTurnTriggers(player, opponent);

    // Switch to opponent turn
    this.currentBattle.gameState.activePlayer = 1;

    // Process opponent AI turn
    await this.processOpponentTurn();

    // Switch back to player and increment turn
    this.currentBattle.gameState.activePlayer = 0;
    this.currentBattle.gameState.turn++;

    // Start player's new turn
    this.battleController.startTurn(0);

    // Process start-of-turn buff effects
    this.battleStateManager.applyBuffStartOfTurnEffects(player, opponent);
    this.battleStateManager.processStartOfTurnTriggers(player, opponent);
    this.battleStateManager.applyStatBuffEffects(player);

    return { success: true };
  }

  /**
   * Process opponent's AI turn
   */
  private async processOpponentTurn(): Promise<void> {
    if (!this.currentBattle || !this.currentBattle.gameState) return;

    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    // Helper function for delays
    const delay = (ms: number) => new Promise(resolve => this.async.setTimeout(resolve, ms));

    // Draw a card for opponent
    if (opponent.deck.length > 0) {
      const card = opponent.deck.shift();
      if (card) opponent.hand.push(card);
    }
    if (this.renderCallback) this.renderCallback();
    await delay(800);
    if (this.shouldStopAI) return;

    // Increase opponent nectar
    opponent.currentNectar = Math.min(10, this.currentBattle.gameState.turn);
    if (this.renderCallback) this.renderCallback();
    await delay(500);
    if (this.shouldStopAI) return;

    // Apply start-of-turn buff effects
    this.battleStateManager.applyBuffStartOfTurnEffects(opponent, player);
    this.battleStateManager.processStartOfTurnTriggers(opponent, player);
    this.battleStateManager.applyStatBuffEffects(opponent);

    // Remove summoning sickness
    opponent.field.forEach((beast: any) => {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedAbilityThisTurn = false;
      }
    });

    // Use AI to execute opponent turn with proper effect processors
    await this.opponentAI.executeTurn(
      opponent,
      player,
      this.currentBattle.gameState,
      {
        processOnSummonTrigger: this.battleStateManager.processOnSummonTrigger.bind(this.battleStateManager),
        processOnAttackTrigger: this.battleStateManager.processOnAttackTrigger.bind(this.battleStateManager),
        processOnDamageTrigger: this.battleStateManager.processOnDamageTrigger.bind(this.battleStateManager),
        processOnDestroyTrigger: this.battleStateManager.processOnDestroyTrigger.bind(this.battleStateManager),
        processMagicEffect: this.battleStateManager.processMagicEffect.bind(this.battleStateManager),
        processHabitatEffect: this.battleStateManager.processHabitatEffect.bind(this.battleStateManager),
        applyStatBuffEffects: this.battleStateManager.applyStatBuffEffects.bind(this.battleStateManager),
      },
      () => this.shouldStopAI
    );
  }

  /**
   * Update mission progress based on action
   */
  private updateMissionProgress(action: string, result: any): void {
    if (!this.currentBattle) return;

    // Track objectives, etc.
    // Implementation depends on mission objectives system
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
    if (!this.currentBattle) return;

    const battleResult = this.battleController.checkBattleEnd();
    if (!battleResult) return;

    Logger.info(`[MissionBattleUI] Battle ending. Winner: ${battleResult.winner}, P1 HP: ${battleResult.player1Health}, P2 HP: ${battleResult.player2Health}`);

    this.shouldStopAI = true;
    this.currentBattle.isComplete = true;

    // Calculate rewards based on winner
    if (battleResult.winner === 'player1') {
      // Player won!
      Logger.info('[MissionBattleUI] Player 1 won! Awarding rewards.');
      this.currentBattle.rewards = this.missionManager.completeMission();
      this.battleController.completeBattle('player1');
    } else if (battleResult.winner === 'player2') {
      // Player lost
      Logger.info('[MissionBattleUI] Player 2 won! No rewards.');
      this.currentBattle.rewards = null;
      this.battleController.completeBattle('player2');
    } else {
      // Tie (both died) - treat as loss for now
      Logger.info('[MissionBattleUI] Tie! No rewards.');
      this.currentBattle.rewards = null;
      this.battleController.completeBattle(null);
    }

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
