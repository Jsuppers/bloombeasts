/**
 * BattleOrchestrator - Manages battle actions, state, and completion
 * Extracted from BloomBeastsGame to separate concerns
 */

import type { BattleUI } from '../screens/battle/BattleUI';
import type { BattleDisplayManager } from '../screens/battle/BattleDisplayManager';
import { parseActionString, BattleActions } from '../screens/battle/engine/types/actions';
import { Logger } from '../common/engine/utils/Logger';
import type { AsyncMethods } from '../common/ui/types/types/bindings';
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
  initializeBattle(missionId: string, playerDeckCards: any[], playerName: string): any {
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
    const validation = ValidationHelpers.validateBattleAction(action, currentBattle?.battleState);
    if (!validation.valid) {
      Logger.warn('[BattleOrchestrator] Battle action validation failed:', validation.errors);
      return;
    }

    // CRITICAL: Check if battle is already complete - prevent double processing
    if (currentBattle && currentBattle.isComplete) {
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
    if (immediateState && !immediateState.isComplete) {
      const immediateDisplay = this.battleDisplayManager.createBattleDisplay(
        immediateState,
        undefined
      );
      if (immediateDisplay) {
        this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, immediateDisplay);
      }
    }

    // Get updated battle state
    const updatedState = this.battleUI.getCurrentBattle();
    if (updatedState) {
      // Check if battle ended FIRST - never render after completion
      if (updatedState.isComplete) {
        await this.handleBattleComplete(updatedState);
        return;
      }

      // Create updated battle display with fresh state
      const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
        updatedState,
        undefined
      );

      if (updatedDisplay) {
        this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, updatedDisplay);
      }
    }
  }

  /**
   * Handle auto-attack-all action with animations
   */
  private async handleAutoAttackAll(typedAction: any): Promise<void> {
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
      if (updatedState.isComplete) {
        await this.handleBattleComplete(updatedState);
        return;
      }

      const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
        updatedState,
        undefined
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
    if (currentBattle && currentBattle.battleState) {
      const currentPlayerId = currentBattle.battleState.turboState.turnInfo.currentPlayerId;

      // Process TIMEOUT action through TURBO
      await this.battleUI.processTypedAction({
        type: 'timeout',
        playerId: currentPlayerId,
        timedOutPlayerId,
        timestamp: Date.now()
      });

      // Check if battle ended and handle completion
      const updatedState = this.battleUI.getCurrentBattle();
      if (updatedState && updatedState.isComplete) {
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
    if (updatedState && updatedState.isComplete) {
      await this.handleBattleComplete(updatedState);
    }
  }

  /**
   * Handle battle completion (victory or defeat)
   */
  async handleBattleComplete(battleState: any): Promise<void> {
    const playerData = this.gameStateManager.getPlayerDataOrNull();
    if (!playerData) return;

    Logger.info('[BattleOrchestrator] handleBattleComplete called');

    const battleId = this.currentBattleId;
    this.currentBattleId = null;

    if (battleState.rewards) {
      // Victory!
      await this.handleVictory(battleState, playerData, battleId);
    } else {
      // Defeat
      await this.handleDefeat(battleState);
    }

    // Resume background music
    this.soundManager.playMusic('music-background', true);
  }

  /**
   * Handle victory scenario
   */
  private async handleVictory(battleState: any, playerData: any, battleId: string | null): Promise<void> {
    Logger.info('[BattleOrchestrator] VICTORY! Showing rewards popup');

    // Apply boost multipliers to rewards
    const boostMap = this.rewardCalculator.getBoostMap(playerData.boosts);
    battleState.rewards = this.rewardCalculator.calculateRewards(battleState.rewards, boostMap);

    // Award XP
    this.gameStateManager.addXP(battleState.rewards.xpGained);

    // Award card XP directly to deck cards
    const cardXP = battleState.rewards.beastXP || battleState.rewards.xpGained;
    awardDeckExperience(
      cardXP,
      playerData.cards.deck,
      playerData.cards.collected
    );

    // Add cards directly to collection
    battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
      addCardReward(card, playerData.cards.collected, index);
    });

    // Add coins
    if (battleState.rewards.coinsReceived) {
      this.gameStateManager.addCoins(battleState.rewards.coinsReceived);
    }

    // Add items to inventory
    if (battleState.rewards.itemsReceived) {
      battleState.rewards.itemsReceived.forEach((itemReward: any) => {
        this.gameStateManager.addItems(itemReward.itemId, itemReward.quantity);
      });
    }

    // Track mission completion
    if (battleId) {
      this.gameStateManager.trackMissionCompletion(battleId);

      // If this is Cluck Norris mission, submit time to leaderboard
      if (battleId === GAME_CONSTANTS.MISSION_CLUCK_NORRIS_ID && this.battleStartTime) {
        const completionTime = (Date.now() - this.battleStartTime) / 1000;
        // Submit via callback if available
        // This will need to be passed through constructor or method
      }
    }

    // Reset battle start time
    this.battleStartTime = null;

    // Play win sound
    this.soundManager.playSfx(SOUND_EFFECTS.WIN);

    // Show mission complete popup
    this.uiCoordinator.showMissionCompletePopup(
      battleState.mission,
      battleState.rewards,
      (sfxId: string) => this.soundManager.playSfx(sfxId),
      () => this.uiCoordinator.closePopupAndNavigate('missions')
    );
  }

  /**
   * Handle defeat scenario
   */
  private async handleDefeat(battleState: any): Promise<void> {
    Logger.info('[BattleOrchestrator] DEFEAT! Showing failed popup');

    // Reset battle start time
    this.battleStartTime = null;

    // Play lose sound
    this.soundManager.playSfx(SOUND_EFFECTS.LOSE);

    // Show mission failed popup
    this.uiCoordinator.showMissionFailedPopup(
      battleState.mission,
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

    // Show animation (attacker glows green, target glows red)
    const displayWithAnimation = this.battleDisplayManager.createBattleDisplay(
      currentState,
      {
        attackerPlayer,
        attackerIndex,
        targetPlayer,
        targetIndex
      }
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
