/**
 * BattleOrchestrator - Manages battle actions, state, and completion
 * Extracted from BloomBeastsGame to separate concerns
 */

import type { BattleUI } from '../screens/battle/BattleUI';
import type { BattleDisplayManager } from '../screens/battle/BattleDisplayManager';
import type { BattleState } from '../screens/battle/engine/types';
import { parseActionString, BattleActions, type BattleAction } from '../screens/battle/engine/types/actions';
import { Logger } from '../common/engine/utils/Logger';
import type { AsyncMethods } from '../common/ui/types/types/bindings';
import type { RuntimeCard } from '../common/engine/types/runtime';
import type { PlayerData } from '../types';
import type { AnyCard } from '../common/engine/types/core';
import type { ItemRewardResult } from '../screens/missions/MissionManager';
import type { BattleRewards } from './BattleRewardCalculator';
import { GameStateManager } from './GameStateManager';
import { BattleRewardCalculator, BoostMap } from './BattleRewardCalculator';
import { UICoordinator } from './UICoordinator';
import { SoundManager } from './SoundManager';
import { GAME_CONSTANTS, SOUND_EFFECTS } from './GameConstants';
import { BindingType } from '../common/ui/types/types/BindingManager';
import { getPlayerDeckCards, awardDeckExperience, addCardReward } from '../common/utils/cardUtils';
import { ValidationHelpers } from './ValidationHelpers';

/**
 * Orchestrates all battle-related operations
 */
export class BattleOrchestrator {
  private battleUI: BattleUI;
  private battleDisplayManager: BattleDisplayManager;
  private gameStateManager: GameStateManager;
  private rewardCalculator: BattleRewardCalculator;
  private uiCoordinator: UICoordinator;
  private soundManager: SoundManager;
  private asyncMethods: AsyncMethods;

  private currentBattleId: string | null = null;
  private battleStartTime: number | null = null;

  constructor(
    battleUI: BattleUI,
    battleDisplayManager: BattleDisplayManager,
    gameStateManager: GameStateManager,
    rewardCalculator: BattleRewardCalculator,
    uiCoordinator: UICoordinator,
    soundManager: SoundManager,
    asyncMethods: AsyncMethods
  ) {
    this.battleUI = battleUI;
    this.battleDisplayManager = battleDisplayManager;
    this.gameStateManager = gameStateManager;
    this.rewardCalculator = rewardCalculator;
    this.uiCoordinator = uiCoordinator;
    this.soundManager = soundManager;
    this.asyncMethods = asyncMethods;
  }

  /**
   * Initialize battle with mission ID
   */
  initializeBattle(missionId: string, playerDeckCards: RuntimeCard[], playerName: string): BattleState | null {
    const battleState = this.battleUI.initializeBattle(playerDeckCards, playerName);

    if (battleState) {
      this.currentBattleId = missionId;
      this.battleStartTime = Date.now();
    }

    return battleState;
  }

  /**
   * Get current battle ID
   */
  getCurrentBattleId(): string | null {
    return this.currentBattleId;
  }

  /**
   * Clear battle state
   */
  clearBattle(): void {
    this.currentBattleId = null;
    this.battleStartTime = null;
  }

  /**
   * Handle battle actions
   */
  async handleBattleAction(action: string): Promise<void> {
    Logger.debug('[BattleOrchestrator] handleBattleAction called with action:', action);

    // Handle timeout losses - convert to TIMEOUT action
    if (action === 'timeout-player' || action === 'timeout-opponent') {
      await this.handleTimeout(action);
      return;
    }

    // Handle forfeit button - show confirmation popup
    if (action === 'btn-forfeit' || action === 'forfeit') {
      this.uiCoordinator.showForfeitConfirmation(
        () => this.handleForfeit(),
        (sfxId: string) => this.soundManager.playSfx(sfxId)
      );
      return;
    }

    // Handle back button
    if (action === 'btn-back') {
      this.uiCoordinator.navigate('menu');
      return;
    }

    // Get current battle state
    const currentBattle = this.battleUI.getCurrentBattle();

    // Validate battle action
    const validation = ValidationHelpers.validateBattleAction(action, currentBattle);
    if (!validation.valid) {
      Logger.warn('[BattleOrchestrator] Battle action validation failed:', validation.errors);
      return;
    }

    // CRITICAL: Check if battle is already complete - prevent double processing
    if (currentBattle && currentBattle.turboState.isComplete) {
      Logger.info(`[BattleOrchestrator] Battle already complete, ignoring action: ${action}`);
      return;
    }

    // Beast and opponent clicks are now just for viewing details (no selection)
    if (action.startsWith('view-field-card-player-') || action.startsWith('view-field-card-opponent-')) {
      return;
    }

    // Parse string action to typed action
    const typedAction = parseActionString(action, 'player');
    if (!typedAction) {
      Logger.warn(`[BattleOrchestrator] Failed to parse action: ${action}`);
      return;
    }

    // Play sound effects and show animations based on action type
    if (typedAction.type === 'auto-attack-all') {
      await this.handleAutoAttackAll(typedAction);
      return;
    } else if (typedAction.type === 'attack-beast') {
      this.soundManager.playSfx(SOUND_EFFECTS.ATTACK);
    } else if (typedAction.type === 'attack-player') {
      this.soundManager.playSfx(SOUND_EFFECTS.ATTACK);
      if (typedAction.attackerIndex !== undefined) {
        await this.showAttackAnimation('player', typedAction.attackerIndex, 'health', undefined);
      }
    } else if (typedAction.type === 'play-card') {
      this.soundManager.playSfx(SOUND_EFFECTS.PLAY_CARD);
    } else if (action.startsWith('activate-trap-')) {
      this.soundManager.playSfx(SOUND_EFFECTS.TRAP_ACTIVATED);
    } else if (typedAction.type === 'end-turn') {
      this.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);
    }

    // Process action
    await this.battleUI.processTypedAction(typedAction, {});

    // Immediately update display after action to show cards instantly
    const immediateState = this.battleUI.getCurrentBattle();
    if (immediateState && !immediateState.turboState?.isComplete) {
      const mission = this.battleUI.getMissionManager().getCurrentMission();
      const progress = this.battleUI.getMissionManager().getProgress();
      const immediateDisplay = this.battleDisplayManager.createBattleDisplay(
        immediateState,
        undefined,
        mission,
        progress
      );
      if (immediateDisplay) {
        this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, immediateDisplay);
      }
    }

    // Get updated battle state
    const updatedState = this.battleUI.getCurrentBattle();
    if (updatedState) {
      // Check if battle ended FIRST - never render after completion
      if (updatedState.turboState?.isComplete) {
        await this.handleBattleComplete(updatedState);
        return;
      }

      // Create updated battle display with fresh state
      const mission = this.battleUI.getMissionManager().getCurrentMission();
      const progress = this.battleUI.getMissionManager().getProgress();
      const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
        updatedState,
        undefined,
        mission,
        progress
      );

      if (updatedDisplay) {
        this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, updatedDisplay);
      }
    }
  }

  /**
   * Handle auto-attack-all action with animations
   */
  private async handleAutoAttackAll(typedAction: BattleAction): Promise<void> {
    this.soundManager.playSfx(SOUND_EFFECTS.ATTACK);

    // Process action with animation callback
    await this.battleUI.processTypedAction(typedAction, {
      onAttackAnimation: async (attackerIndex: number, targetType: 'beast' | 'health', targetIndex?: number) => {
        if (targetType === 'beast' && targetIndex !== undefined) {
          await this.showAttackAnimation('player', attackerIndex, 'opponent', targetIndex);
        } else {
          await this.showAttackAnimation('player', attackerIndex, 'health', undefined);
        }
      }
    });

    // Get updated state and render
    const updatedState = this.battleUI.getCurrentBattle();
    if (updatedState) {
      if (updatedState.turboState?.isComplete) {
        await this.handleBattleComplete(updatedState);
        return;
      }

      const mission = this.battleUI.getMissionManager().getCurrentMission();
      const progress = this.battleUI.getMissionManager().getProgress();
      const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
        updatedState,
        undefined,
        mission,
        progress
      );
      if (updatedDisplay) {
        this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, updatedDisplay);
      }
    }
  }

  /**
   * Handle timeout action
   */
  private async handleTimeout(action: string): Promise<void> {
    const timedOutPlayerId = action === 'timeout-player' ? 'player' : 'opponent';

    const currentBattle = this.battleUI.getCurrentBattle();
    if (currentBattle && currentBattle.turboState) {
      const currentPlayerId = currentBattle.turboState.turnInfo.currentPlayerId;

      // Process TIMEOUT action through TURBO
      await this.battleUI.processTypedAction({
        type: 'timeout',
        playerId: currentPlayerId,
        timedOutPlayerId,
        timestamp: Date.now()
      });

      // Check if battle ended and handle completion
      const updatedState = this.battleUI.getCurrentBattle();
      if (updatedState && updatedState.turboState?.isComplete) {
        await this.handleBattleComplete(updatedState);
      }
    }
  }

  /**
   * Handle forfeit - player gives up
   */
  private async handleForfeit(): Promise<void> {
    // Close popup
    this.uiCoordinator.updateBindingAndRender(BindingType.ForfeitPopup, null);

    // Play lose sound
    this.soundManager.playSfx(SOUND_EFFECTS.LOSE);

    // Process FORFEIT action through TURBO
    await this.battleUI.processTypedAction(BattleActions.forfeit('player'));

    // Check if battle ended and handle completion
    const updatedState = this.battleUI.getCurrentBattle();
    if (updatedState && updatedState.turboState?.isComplete) {
      await this.handleBattleComplete(updatedState);
    }
  }

  /**
   * Handle battle completion (victory or defeat)
   */
  async handleBattleComplete(battleState: BattleState): Promise<void> {
    const playerData = this.gameStateManager.getPlayerDataOrNull();
    if (!playerData) return;

    Logger.info('[BattleOrchestrator] handleBattleComplete called');

    const battleId = this.currentBattleId;
    this.currentBattleId = null;

    // Use the BattleController's checkBattleEnd to get the proper winner
    // This checks ALL win conditions: health, deck-out, sudden end, etc.
    const battleResult = this.battleUI.getCurrentBattle();
    if (!battleResult) {
      Logger.error('[BattleOrchestrator] No battle result available');
      return;
    }

    // Import WinConditionChecker to properly determine winner
    // Player is always players[0] with id 'player', opponent is players[1] with id 'opponent'
    const players = battleState.turboState.gameData.players;
    const playerHealth = players[0].health;
    const opponentHealth = players[1].health;

    // Determine winner using the same logic as WinConditionChecker
    let playerWon = false;

    // Check sudden end (timeout/forfeit/disconnect) first (highest priority)
    const suddenEnd = battleState.turboState.gameData.suddenEnd;
    if (suddenEnd) {
      // If opponent caused sudden end, player wins
      playerWon = suddenEnd.playerId !== 'player';
      Logger.info(`[BattleOrchestrator] Sudden end by ${suddenEnd.playerId}, player won: ${playerWon}`);
    } else {
      // Check health-based win
      if (opponentHealth <= 0 && playerHealth > 0) {
        playerWon = true;
        Logger.info('[BattleOrchestrator] Player won by health');
      } else if (playerHealth <= 0 && opponentHealth > 0) {
        playerWon = false;
        Logger.info('[BattleOrchestrator] Player lost by health');
      } else {
        // Check deck-out win
        const playerHasCards = players[0].deck.length > 0 || players[0].hand.length > 0;
        const opponentHasCards = players[1].deck.length > 0 || players[1].hand.length > 0;

        if (!opponentHasCards && playerHasCards) {
          playerWon = true;
          Logger.info('[BattleOrchestrator] Player won by deck-out (opponent has no cards)');
        } else if (!playerHasCards && opponentHasCards) {
          playerWon = false;
          Logger.info('[BattleOrchestrator] Player lost by deck-out (player has no cards)');
        } else {
          // Both dead or both decked out = tie (treat as loss)
          playerWon = false;
          Logger.info('[BattleOrchestrator] Tie game (treated as loss)');
        }
      }
    }

    // Get mission before any updates (needed for popups later)
    const missionManager = this.battleUI.getMissionManager();
    const mission = missionManager.getCurrentMission();

    if (playerWon) {
      // CRITICAL: Update mission progress with final health values AND mark opponent as defeated
      // This sets progress.isCompleted = true, which is required for completeMission() to return rewards

      // Update health first (needed for checkMissionCompletion to work)
      missionManager.updateProgress('health-update', {
        playerHealth: playerHealth,
        opponentHealth: opponentHealth
      });
      Logger.info(`[BattleOrchestrator] Updated health - Player: ${playerHealth}, Opponent: ${opponentHealth}`);

      // Then mark opponent as defeated (this calls checkMissionCompletion)
      missionManager.updateProgress('opponent-defeated', {});
      Logger.info('[BattleOrchestrator] Updated mission progress - opponent defeated');

      // Debug: Check if mission is actually completed
      const progress = missionManager.getProgress();
      Logger.info(`[BattleOrchestrator] Mission progress.isCompleted: ${progress?.isCompleted}`);

      // Victory!
      await this.handleVictory(battleState, playerData, battleId, mission);
    } else {
      // Defeat
      await this.handleDefeat(battleState, mission);
    }

    // Resume background music
    this.soundManager.playMusic('music-background', true);
  }

  /**
   * Handle victory scenario
   */
  private async handleVictory(battleState: BattleState, playerData: PlayerData, battleId: string | null, mission: any): Promise<void> {
    Logger.info('[BattleOrchestrator] VICTORY! Showing rewards popup');

    // Complete the mission and get rewards
    const missionManager = this.battleUI.getMissionManager();

    // Debug: Check mission manager state before completing
    const progress = missionManager.getProgress();
    Logger.info(`[BattleOrchestrator] Before completeMission - mission: ${!!mission}, progress: ${!!progress}, isCompleted: ${progress?.isCompleted}`);
    if (mission) {
      Logger.info(`[BattleOrchestrator] Mission ID: ${mission.id}`);
    }

    const rewardResult = missionManager.completeMission();

    if (!rewardResult) {
      Logger.error('[BattleOrchestrator] No rewards received from mission completion');
      Logger.error(`[BattleOrchestrator] Debug info - mission existed: ${!!mission}, progress existed: ${!!progress}, was completed: ${progress?.isCompleted}`);
      return;
    }

    // Convert RewardResult to BattleRewards format
    const rewards: BattleRewards = {
      xpGained: rewardResult.xpGained,
      beastXP: rewardResult.beastXP,
      coinsReceived: rewardResult.coinsReceived || 0,
      cardsReceived: rewardResult.cardsReceived,
      itemsReceived: rewardResult.itemsReceived,
      completionTimeSeconds: rewardResult.completionTimeSeconds,
    };

    // Apply boost multipliers to rewards
    const boostMap = this.rewardCalculator.getBoostMap(playerData.boosts);
    const boostedRewards = this.rewardCalculator.calculateRewards(rewards, boostMap);

    // Award XP
    this.gameStateManager.addXP(boostedRewards.xpGained);

    // Award card XP directly to deck cards
    const cardXP = boostedRewards.beastXP || boostedRewards.xpGained;
    awardDeckExperience(
      cardXP,
      playerData.cards.deck,
      playerData.cards.collected
    );

    // Add cards directly to collection
    boostedRewards.cardsReceived.forEach((card: AnyCard, index: number) => {
      addCardReward(card, playerData.cards.collected, index);
    });

    // Add coins
    if (boostedRewards.coinsReceived) {
      this.gameStateManager.addCoins(boostedRewards.coinsReceived);
    }

    // Add items to inventory
    if (boostedRewards.itemsReceived) {
      boostedRewards.itemsReceived.forEach((itemReward: ItemRewardResult) => {
        this.gameStateManager.addItems(itemReward.itemId, itemReward.quantity);
      });
    }

    // Track mission completion
    if (battleId) {
      this.gameStateManager.trackMissionCompletion(battleId);

      // If this is Cluck Norris mission, submit time to leaderboard
      if (battleId === GAME_CONSTANTS.MISSION_CLUCK_NORRIS_ID && this.battleStartTime) {
        const completionTime = (Date.now() - this.battleStartTime) / 1000;
        // Submit time to leaderboard
        this.gameStateManager.submitCluckNorrisTime(completionTime);
        Logger.info(`[BattleOrchestrator] Submitted Cluck Norris completion time: ${completionTime}s`);
      }
    }

    // Reset battle start time
    this.battleStartTime = null;

    // Play win sound
    this.soundManager.playSfx(SOUND_EFFECTS.WIN);

    // Show mission complete popup
    // NOTE: Use mission parameter captured before completeMission(),
    // because completeMission() clears the mission manager's currentMission
    this.uiCoordinator.showMissionCompletePopup(
      mission,
      boostedRewards,
      (sfxId: string) => this.soundManager.playSfx(sfxId),
      () => this.uiCoordinator.closePopupAndNavigate('missions')
    );
  }

  /**
   * Handle defeat scenario
   */
  private async handleDefeat(battleState: BattleState, mission: any): Promise<void> {
    Logger.info('[BattleOrchestrator] DEFEAT! Showing failed popup');

    // Reset battle start time
    this.battleStartTime = null;

    // Play lose sound
    this.soundManager.playSfx(SOUND_EFFECTS.LOSE);

    // Show mission failed popup
    this.uiCoordinator.showMissionFailedPopup(
      mission,
      (sfxId: string) => this.soundManager.playSfx(sfxId),
      () => this.uiCoordinator.closePopupAndNavigate('missions')
    );
  }

  /**
   * Show attack animation
   */
  async showAttackAnimation(
    attackerPlayer: 'player' | 'opponent',
    attackerIndex: number,
    targetPlayer: 'player' | 'opponent' | 'health',
    targetIndex?: number
  ): Promise<void> {
    const currentState = this.battleUI.getCurrentBattle();
    if (!currentState) return;

    const mission = this.battleUI.getMissionManager().getCurrentMission();
    const progress = this.battleUI.getMissionManager().getProgress();

    // Show animation (attacker glows green, target glows red)
    const displayWithAnimation = this.battleDisplayManager.createBattleDisplay(
      currentState,
      {
        attackerPlayer,
        attackerIndex,
        targetPlayer,
        targetIndex
      },
      mission,
      progress
    );

    if (displayWithAnimation) {
      this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, displayWithAnimation);
    }

    // Wait for animation duration
    await new Promise(resolve => this.asyncMethods.setTimeout(resolve, GAME_CONSTANTS.ATTACK_ANIMATION_DURATION_MS));

    // CRITICAL: Refresh state before clearing animation (state may have changed during delay)
    const updatedState = this.battleUI.getCurrentBattle();
    if (!updatedState) return;

    // Clear animation with fresh state
    const displayWithoutAnimation = this.battleDisplayManager.createBattleDisplay(
      updatedState,
      undefined
    );

    if (displayWithoutAnimation) {
      this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, displayWithoutAnimation);
    }
  }
}
