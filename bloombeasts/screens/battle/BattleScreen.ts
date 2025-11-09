/**
 * Unified Battle Screen Component
 * Works on both Horizon and Web platforms
 * Exactly mimics the UI from deployments/web/src/screens/battleScreen.ts
 */

import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import type { AsyncMethods } from '../../common/ui/types/types/bindings';
import type { BattleDisplay } from '../../../bloombeasts/gameManager';
import type { Card } from '../../common/engine/types/core';
import { UINodeType } from '../../common/ui/ScreenUtils';
import { hasAttackableBeasts } from '../../common/engine/utils/combatHelpers';
import { BindingType } from '../../common/ui/types/types/BindingManager';
import {
  TURN_TIMER_SECONDS,
  AUTO_ATTACK_TOTAL_DELAY_MS
} from '../../common/engine/constants/battleConstants';

// Import modular battle components
import {
  BattleBackground,
  BeastField,
  TrapZone,
  BuffZone,
  HabitatZone,
  PlayerHand,
  InfoDisplays,
  BattleSideMenu,
} from './ui';
import { BattleTimerManager } from './BattleTimerManager';
import { CardPopupManager } from './CardPopupManager';

interface BattleUIState {
  battle: {
    showHand: boolean;
    handScrollOffset: number;
    playerTimer: number;
    opponentTimer: number;
    selectedCardDetail: Card | null;
  };
}

export interface BattleScreenProps {
  ui: UIMethodMappings;
  async: AsyncMethods;
  onAction?: (action: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
  onShowCardDetail?: (card: Card, durationMs: number, callback?: () => void) => void;
  playSfx?: (sfxId: string) => void;
}

/**
 * Unified Battle Screen that exactly replicates web deployment's battle UI
 */
export class BattleScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;
  private async: AsyncMethods;

  // Manager instances
  private timerManager: BattleTimerManager;
  private cardPopupManager: CardPopupManager;

  // Track binding values separately (as per Horizon docs - no .get() method)
  private isPlayerTurnValue = false;
  private battleDisplayValue: BattleDisplay | null = null;
  private hasAttackableBeasts = false;

  // Track current UIState value for updates
  private currentUIState: BattleUIState = {
    battle: {
      showHand: true,
      handScrollOffset: 0,
      playerTimer: TURN_TIMER_SECONDS,
      opponentTimer: TURN_TIMER_SECONDS,
      selectedCardDetail: null,
    },
  };

  // Render guard to prevent infinite loops
  private isRendering = false;
  private needsRerender = false;

  // Callbacks
  private onAction?: (action: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;
  private onShowCardDetail?: (card: Card, durationMs: number, callback?: () => void) => void;
  private playSfx?: (sfxId: string) => void;

  // Battle components (modular)
  private backgroundComponent!: BattleBackground;
  private beastFieldComponent!: BeastField;
  private trapZoneComponent!: TrapZone;
  private buffZoneComponent!: BuffZone;
  private habitatZoneComponent!: HabitatZone;
  private playerHandComponent!: PlayerHand;
  private infoDisplaysComponent!: InfoDisplays;
  private sideMenuComponent!: BattleSideMenu;

  constructor(props: BattleScreenProps) {
    this.ui = props.ui;
    this.async = props.async;

    // Initialize managers
    this.timerManager = new BattleTimerManager(this.async, {
      onPlayerTimeout: () => this.onAction?.('timeout-player'),
      onOpponentTimeout: () => this.onAction?.('timeout-opponent'),
      onTimerTick: (playerTimer, opponentTimer) => {
        this.updateUIState({ playerTimer, opponentTimer });
      },
    });

    this.cardPopupManager = new CardPopupManager(this.ui, this.async, {
      onCardDetailSelected: (card, cardType) => this.handleCardDetailSelected(card, cardType),
      onUpdateUIState: (updates) => this.updateUIState(updates),
      onShowCardDetail: props.onShowCardDetail,
      onAction: props.onAction,
    });

    // Wrap onAction to add logging
    this.onAction = props.onAction ? (action: string) => {
      props.onAction!(action);
    } : undefined;

    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.onShowCardDetail = props.onShowCardDetail;
    this.playSfx = props.playSfx;

    // Initialize player turn tracking - derive from battleDisplay only (not multi-binding)
    // NOTE: this should be moved to the battle logic right?
    this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
      const newIsPlayerTurn = state?.turnPlayer === 'player';

      // Cache battle display value for onClick handlers
      this.battleDisplayValue = state;

      // Check if player has any beasts that can attack
      this.hasAttackableBeasts = state?.playerField ? hasAttackableBeasts(state.playerField) : false;

      // Start/restart timer based on turn changes or if timer not running
      if (this.isPlayerTurnValue !== newIsPlayerTurn) {
        this.isPlayerTurnValue = newIsPlayerTurn;
        // Restart timer to ensure it's tracking the correct player
        this.timerManager.restart(newIsPlayerTurn);
      } else if (state && !this.timerManager.isRunning()) {
        // Start timer if it's not running but we have a valid battle state
        this.timerManager.start(newIsPlayerTurn);
      }

      return newIsPlayerTurn;
    });

    // Initialize battle components
    this.backgroundComponent = new BattleBackground({
      ui: this.ui,
    });

    this.beastFieldComponent = new BeastField({
      ui: this.ui,
      onAction: this.onAction,
      showPlayedCard: this.cardPopupManager.showPlayedCard.bind(this.cardPopupManager),
    });

    this.trapZoneComponent = new TrapZone({
      ui: this.ui,
      onCardDetailSelected: (card) => this.cardPopupManager.handleCardDetailSelected(card),
    });

    this.buffZoneComponent = new BuffZone({
      ui: this.ui,
      onCardDetailSelected: (card) => this.cardPopupManager.handleCardDetailSelected(card),
    });

    this.habitatZoneComponent = new HabitatZone({
      ui: this.ui,
      onCardDetailSelected: (card) => this.cardPopupManager.handleCardDetailSelected(card, 'Habitat'),
    });

    this.playerHandComponent = new PlayerHand({
      ui: this.ui,
      getBattleDisplayValue: () => this.battleDisplayValue,
      onAction: this.onAction,
      onShowHandChange: (newValue) => {
        this.updateUIState({ showHand: newValue });
      },
      onScrollOffsetChange: (newValue) => {
        this.updateUIState({ handScrollOffset: newValue });
      },
      onRenderNeeded: this.onRenderNeeded,
      showPlayedCard: this.cardPopupManager.showPlayedCard.bind(this.cardPopupManager),
    });

    this.infoDisplaysComponent = new InfoDisplays({
      ui: this.ui,
    });

    this.sideMenuComponent = new BattleSideMenu({
      ui: this.ui,
      getIsPlayerTurn: () => this.isPlayerTurnValue,
      getHasAttackableBeasts: () => this.hasAttackableBeasts,
      onAction: this.onAction,
      onActionAsync: async (action: string) => {
        // Call the action and wait for animations to complete
        if (this.onAction) {
          this.onAction!(action);
          // Wait for attack animations to complete (auto-attack-all can have multiple animations)
          // Each attack takes about 1 second, and there can be up to 3 attacks
          await new Promise<void>((resolve) => {
            this.async.setTimeout(() => resolve(), AUTO_ATTACK_TOTAL_DELAY_MS);
          });
        }
      },
      onStopTurnTimer: () => this.timerManager.stop(),
      playSfx: this.playSfx,
    });
  }

  /**
   * Helper to update UIState.battle
   */
  private updateUIState(updates: Partial<typeof this.currentUIState.battle>): void {
    this.currentUIState = {
      ...this.currentUIState,
      battle: {
        ...this.currentUIState.battle,
        ...updates,
      },
    };
    this.ui.bindingManager.setBinding(BindingType.UIState, this.currentUIState);
    this.onRenderNeeded?.();
  }

  /**
   * Handle card detail selection from trap/buff/habitat zones
   * Delegates to CardPopupManager
   */
  private handleCardDetailSelected(card: any, cardType?: string): void {
    this.cardPopupManager.handleCardDetailSelected(card, cardType);
  }

  /**
   * Create the complete battle UI
   */
  createUI(): UINodeType {
    this.isRendering = true;
    this.needsRerender = false;

    // Mark rendering as complete
    this.finishRender();

    // Full battle UI - all structure created once, bindings handle updates
    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        // Stretched background layer
        this.backgroundComponent.createBackground(),

        // Game content container - all content scales to fit screen
        this.ui.View({
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
          children: [
              // Layer 2: Playboard overlay (future enhancement)
              // this.backgroundComponent.createPlayboard(),

              // Layer 3: Battle zones (beasts, traps, buffs, habitat)
              ...this.beastFieldComponent.createBeastField('player'),
              ...this.beastFieldComponent.createBeastField('opponent'),
              ...this.trapZoneComponent.createTrapZone('player'),
              ...this.trapZoneComponent.createTrapZone('opponent'),
              ...this.buffZoneComponent.createBuffZone('player'),
              ...this.buffZoneComponent.createBuffZone('opponent'),
              this.habitatZoneComponent.createHabitatZone(),

              // Layer 4: Player/Opponent info displays
              this.infoDisplaysComponent.createInfoDisplays(),

              // Layer 5: Side menu with controls
              this.sideMenuComponent.createBattleSideMenu(),

              // Layer 6: Player hand overlay (always rendered, bindings control visibility)
              this.playerHandComponent.createPlayerHand(),

              // Layer 7: Card detail popup (from battleDisplay) - conditionally visible
              this.cardPopupManager.createCardPopupLayer(),

              // Layer 7.25: Selected card detail popup (from clicking buff/trap cards) - conditionally visible
              this.cardPopupManager.createSelectedCardDetailLayer(),

              // Layer 8: Attack animation overlays
              this.createAttackAnimations(),
          ],
        }),

        // Note: Forfeit popup is handled at the root level in BloomBeastsGame
      ],
    });
  }


  /**
   * Create attack animation overlays
   */
  private createAttackAnimations(): UINodeType | null {
    // Attack animations are handled directly in the beast field rendering (reactive)
    // This is a placeholder for any additional animation effects
    return null;
  }

  /**
   * Finish render and trigger re-render if needed
   */
  private finishRender(): void {
    this.isRendering = false;
    if (this.needsRerender) {
      this.needsRerender = false;
      // Use setTimeout to break out of the current call stack
      this.async.setTimeout(() => this.onRenderNeeded?.(), 0);
    }
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    // Reset managers
    this.timerManager.reset();
    this.cardPopupManager.cleanup();

    // Update UIState with reset values
    const { playerTimer, opponentTimer } = this.timerManager.getTimerValues();
    this.updateUIState({
      playerTimer,
      opponentTimer,
      showHand: true,
      handScrollOffset: 0,
      selectedCardDetail: null,
    });

    // Trigger final re-render
    this.onRenderNeeded?.();
  }
}