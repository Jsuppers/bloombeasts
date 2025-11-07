/**
 * ActionHandler - Handles all user actions and events
 *
 * Extracted from BloomBeastsGame to reduce its size and improve maintainability.
 * Centralizes all user interaction handling (button clicks, card selection, etc.)
 */

import { Logger } from '../common/engine/utils/Logger';
import { DECK_SIZE } from '../common/engine/constants/gameRules';
import { getPlayerDeckCards } from '../common/utils/cardUtils';
import { GAME_CONSTANTS, SOUND_EFFECTS, MUSIC_TRACKS } from './GameConstants';
import { UPGRADE_COSTS, ROOSTER } from '../common/constants/upgrades';
import { ValidationHelpers } from './ValidationHelpers';
import { BindingType } from '../common/ui/types/types/BindingManager';
import type { CoreSystems } from './CoreSystemsInitializer';
import type { BattleScreen } from '../screens/battle/BattleScreen';
import type { AsyncMethods } from '../common/ui/types/types/bindings';

export interface ActionHandlerConfig {
  systems: CoreSystems;
  asyncMethods: AsyncMethods;
  navigate: (screen: string) => void;
  saveGameData: () => Promise<void>;
  updateBindingsFromGameState: () => Promise<void>;
}

/**
 * Handles all user actions and interactions
 */
export class ActionHandler {
  private systems: CoreSystems;
  private asyncMethods: AsyncMethods;
  private navigate: (screen: string) => void;
  private saveGameData: () => Promise<void>;
  private updateBindingsFromGameState: () => Promise<void>;

  constructor(config: ActionHandlerConfig) {
    this.systems = config.systems;
    this.asyncMethods = config.asyncMethods;
    this.navigate = config.navigate;
    this.saveGameData = config.saveGameData;
    this.updateBindingsFromGameState = config.updateBindingsFromGameState;
  }

  /**
   * Handle button clicks (navigation, back buttons, etc.)
   */
  async handleButtonClick(buttonId: string): Promise<void> {
    // Play button sound
    this.systems.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);

    // Handle navigation buttons
    switch (buttonId) {
      case 'play':
      case 'btn-missions':
        this.navigate('missions');
        break;
      case 'cards':
      case 'btn-cards':
        this.navigate('cards');
        break;
      case 'upgrades':
      case 'btn-upgrades':
        this.navigate('upgrades');
        break;
      case 'missions':
        this.navigate('missions');
        break;
      case 'settings':
      case 'btn-settings':
        this.navigate('settings');
        break;
      case 'shop':
        break;
      case 'btn-back':
        this.navigate('menu');
        break;
      default:
    }
  }

  /**
   * Show card detail popup for a duration, then close and execute callback
   */
  showCardDetailPopup(card: any, durationMs: number, callback?: () => void): void {
    this.systems.uiCoordinator.showCardDetailPopup(
      card,
      durationMs,
      (sfxId: string) => this.systems.soundManager.playSfx(sfxId),
      (cb: () => void, delay: number) => this.asyncMethods.setTimeout(cb, delay),
      callback
    );
  }

  /**
   * Handle card selection (add/remove from deck)
   */
  async handleCardSelect(cardId: string): Promise<void> {
    const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
    if (!playerData) return;

    // Play menu button sound
    this.systems.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);

    const cardEntry = playerData.cards.collected.find(c => c.id === cardId);
    if (!cardEntry) return;

    // Check if card is in deck
    const isInDeck = playerData.cards.deck.includes(cardId);

    // Toggle card in/out of deck
    if (isInDeck) {
      if (this.systems.gameStateManager.removeCardFromDeck(cardId)) {
        await this.saveGameData();
        await this.updateBindingsFromGameState();
      }
    } else {
      if (this.systems.gameStateManager.addCardToDeck(cardId, DECK_SIZE)) {
        await this.saveGameData();
        await this.updateBindingsFromGameState();
      }
    }
  }

  /**
   * Handle mission selection and battle initialization
   */
  async handleMissionSelect(missionId: string): Promise<void> {
    Logger.info(`Mission selected: ${missionId}`);
    const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
    if (!playerData) return;

    // Play menu button sound
    this.systems.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);

    // Check if player has cards in deck
    if (playerData.cards.deck.length === 0) {
      Logger.warn('No cards in deck');
      return;
    }

    // Get player's deck cards
    const playerDeckCards = getPlayerDeckCards(
      playerData.cards.deck,
      playerData.cards.collected
    );

    if (playerDeckCards.length === 0) {
      Logger.error('Failed to load deck cards');
      return;
    }

    // Validate deck before starting battle
    const deckValidation = ValidationHelpers.validateDeck(playerDeckCards);
    if (!deckValidation.valid) {
      Logger.error('[ActionHandler] Deck validation failed:', deckValidation.errors);
      // Could show error popup to user here in future
      return;
    }

    // Start the mission
    const success = this.systems.missionUI.startMission(missionId);

    if (success) {
      // Initialize battle using BattleOrchestrator
      const battleState = this.systems.battleOrchestrator.initializeBattle(missionId, playerDeckCards, playerData.name);

      if (battleState) {
        // Set up render callback for battle UI to update display during AI turns
        this.systems.battleUI.setRenderCallback(() => {
          const currentBattle = this.systems.battleUI.getCurrentBattle();
          if (currentBattle && !currentBattle.isComplete) {
            const updatedDisplay = this.systems.battleDisplayManager.createBattleDisplay(
              currentBattle,
              null
            );
            if (updatedDisplay) {
              this.systems.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, updatedDisplay);
            }
          }
        });

        // Create battle display from battle state
        const battleDisplay = this.systems.battleDisplayManager.createBattleDisplay(
          battleState,
          null
        );

        // Update battle display binding and navigate
        if (battleDisplay) {
          this.systems.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, battleDisplay);
        }

        this.navigate('battle');

        // Play battle music
        this.systems.soundManager.playMusic(MUSIC_TRACKS.BATTLE, true);

        Logger.info('Battle initialized successfully');
      }
    } else {
      Logger.warn('Mission is not available');
    }
  }

  /**
   * Handle settings changes
   */
  handleSettingsChange(settingId: string, value: any): void {
    const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
    if (!playerData) return;

    // Play button sound for toggles (not sliders)
    if (settingId === 'musicEnabled' || settingId === 'sfxEnabled') {
      this.systems.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);
    }

    // Apply settings via sound manager
    switch (settingId) {
      case 'musicVolume':
        this.systems.soundManager.setMusicVolume(value);
        break;
      case 'sfxVolume':
        this.systems.soundManager.setSfxVolume(value);
        break;
      case 'musicEnabled':
        this.systems.soundManager.toggleMusic(value);
        break;
      case 'sfxEnabled':
        this.systems.soundManager.toggleSfx(value);
        break;
    }

    // Save settings and update binding
    this.systems.uiCoordinator.updateBindingAndRender(BindingType.PlayerData, playerData);
    this.saveGameData();
  }

  /**
   * Handle upgrade purchase
   */
  handleUpgrade(boostId: string): void {
    const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
    if (!playerData) return;

    const currentLevel = this.systems.gameStateManager.getBoostLevel(boostId);

    // Check if already at max level
    if (currentLevel >= GAME_CONSTANTS.MAX_BOOST_LEVEL) {
      return;
    }

    // Get cost for next level
    const costs = UPGRADE_COSTS[boostId];
    if (!costs) return;

    const cost = costs[currentLevel];

    // Deduct coins (returns false if insufficient)
    if (!this.systems.gameStateManager.deductCoins(cost)) {
      return;
    }

    // Upgrade boost
    if (!this.systems.gameStateManager.upgradeBoost(boostId)) {
      // Refund if upgrade failed
      this.systems.gameStateManager.addCoins(cost);
      return;
    }

    // Play upgrade sound (special sound for rooster)
    if (boostId === ROOSTER.id) {
      this.systems.soundManager.playSfx(SOUND_EFFECTS.UPGRADE_ROOSTER);
    } else {
      this.systems.soundManager.playSfx(SOUND_EFFECTS.UPGRADE);
    }

    // Save and update
    this.systems.uiCoordinator.updateBindingAndRender(BindingType.PlayerData, playerData);
    this.saveGameData();
  }

  /**
   * Handle battle actions
   * Delegates to BattleOrchestrator
   */
  async handleBattleAction(action: string, battleScreen?: BattleScreen): Promise<void> {
    // Stop all timers when battle completes
    if (battleScreen) {
      const currentBattle = this.systems.battleUI.getCurrentBattle();
      const wasComplete = currentBattle?.isComplete;

      await this.systems.battleOrchestrator.handleBattleAction(action);

      // Check if battle just completed and cleanup if needed
      const updatedBattle = this.systems.battleUI.getCurrentBattle();
      if (!wasComplete && updatedBattle?.isComplete) {
        battleScreen.cleanup();
      }
    } else {
      await this.systems.battleOrchestrator.handleBattleAction(action);
    }

    // Save game data after battle actions
    await this.saveGameData();
  }
}
