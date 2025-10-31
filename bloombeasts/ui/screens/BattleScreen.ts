/**
 * Unified Battle Screen Component
 * Works on both Horizon and Web platforms
 * Exactly mimics the UI from deployments/web/src/screens/battleScreen.ts
 */

import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import type { AsyncMethods } from '../types/bindings';
import type { BattleDisplay } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createCardDetailPopup } from './common/CardDetailPopup';
import { canAttack } from '../../engine/utils/combatHelpers';
import { BindingType, UIState } from '../types/BindingManager';

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
  gameDimensions,
  standardCardDimensions,
} from './battle';

export interface BattleScreenProps {
  ui: UIMethodMappings;
  async: AsyncMethods;
  onAction?: (action: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
  onShowCardDetail?: (card: any, durationMs: number, callback?: () => void) => void;
  playSfx?: (sfxId: string) => void;
}

/**
 * Unified Battle Screen that exactly replicates web deployment's battle UI
 */
export class BattleScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;
  private async: AsyncMethods;

  // Temporary card display (for showing played cards)
  private playedCardDisplay: any | null = null;
  private playedCardTimeout: number | null = null;

  // Timer management
  private timerInterval: number | null = null;

  // Track binding values separately (as per Horizon docs - no .get() method)
  private playerTimerValue = 300; // 5 minutes = 300 seconds
  private opponentTimerValue = 300; // 5 minutes = 300 seconds
  private isPlayerTurnValue = false;
  private battleDisplayValue: any | null = null;
  private hasAttackableBeasts = false;
  private showHandValue = true;
  private handScrollOffsetValue = 0;
  private selectedCardDetailValue: any = null;

  // Track current UIState value for updates
  private currentUIState: any = {
    battle: {
      showHand: true,
      handScrollOffset: 0,
      playerTimer: 300,
      opponentTimer: 300,
      selectedCardDetail: null,
    },
  };

  // Configuration
  private cardsPerRow = 5;
  private rowsPerPage = 1;

  // Render guard to prevent infinite loops
  private isRendering = false;
  private needsRerender = false;

  // Callbacks
  private onAction?: (action: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;
  private onShowCardDetail?: (card: any, durationMs: number, callback?: () => void) => void;
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
    console.log('[BattleScreen] Constructor called, onAction:', props.onAction ? 'DEFINED' : 'UNDEFINED');

    // Initialize local value trackers
    this.showHandValue = true;
    this.handScrollOffsetValue = 0;
    this.playerTimerValue = 300;
    this.opponentTimerValue = 300;
    this.selectedCardDetailValue = null;

    // Wrap onAction to add logging
    this.onAction = props.onAction ? (action: string) => {
      console.log('[BattleScreen] onAction called with:', action);
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

      // Check if player has any beasts that can attack (using proper canAttack check)
      this.hasAttackableBeasts = false;
      if (state && state.playerField) {
        for (const beast of state.playerField) {
          if (beast && canAttack(beast)) {
            this.hasAttackableBeasts = true;
            break;
          }
        }
      }

      // Start/stop timer based on turn changes
      if (this.isPlayerTurnValue !== newIsPlayerTurn) {
        this.isPlayerTurnValue = newIsPlayerTurn;
        if (newIsPlayerTurn) {
          this.startTurnTimer();
        } else {
          this.stopTurnTimer();
        }
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
      showPlayedCard: this.showPlayedCard.bind(this),
    });

    this.trapZoneComponent = new TrapZone({
      ui: this.ui,
      onCardDetailSelected: (card) => {
        this.selectedCardDetailValue = card;
        this.updateUIState({ selectedCardDetail: card });
      },
    });

    this.buffZoneComponent = new BuffZone({
      ui: this.ui,
      onCardDetailSelected: (card) => {
        this.selectedCardDetailValue = card;
        this.updateUIState({ selectedCardDetail: card });
      },
    });

    this.habitatZoneComponent = new HabitatZone({
      ui: this.ui,
      onCardDetailSelected: (card) => {
        const habitatWithType = { ...card, type: 'Habitat' };
        this.selectedCardDetailValue = habitatWithType;
        this.updateUIState({ selectedCardDetail: habitatWithType });
      },
    });

    this.playerHandComponent = new PlayerHand({
      ui: this.ui,
      getBattleDisplayValue: () => this.battleDisplayValue,
      onAction: this.onAction,
      onShowHandChange: (newValue) => {
        this.showHandValue = newValue;
        this.updateUIState({ showHand: newValue });
      },
      onScrollOffsetChange: (newValue) => {
        this.handScrollOffsetValue = newValue;
        this.updateUIState({ handScrollOffset: newValue });
      },
      onRenderNeeded: this.onRenderNeeded,
      showPlayedCard: this.showPlayedCard.bind(this),
    });

    this.infoDisplaysComponent = new InfoDisplays({
      ui: this.ui,
    });

    this.sideMenuComponent = new BattleSideMenu({
      ui: this.ui,
      getIsPlayerTurn: () => this.isPlayerTurnValue,
      getHasAttackableBeasts: () => this.hasAttackableBeasts,
      onAction: this.onAction,
      onStopTurnTimer: () => this.stopTurnTimer(),
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
  }

  /**
   * Safe render wrapper to prevent infinite loops
   */
  private safeRender(): void {
    if (this.isRendering) {
      // Already rendering, schedule for after current render completes
      this.needsRerender = true;
      return;
    }
    this.onRenderNeeded?.();
  }

  /**
   * Create the complete battle UI
   */
  createUI(): UINodeType {
    // console.log('[BattleScreen] createUI called');
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
        this.ui.View({
          style: {
            width: '100%',
            height: '100%',
            position: 'relative',
            aspectRatio: `${gameDimensions.panelWidth}/${gameDimensions.panelHeight}`
          },
          children: [
            // Layer 1: Background image (full screen)
            this.backgroundComponent.createBackground(),

            // Layer 2: Playboard overlay
            this.backgroundComponent.createPlayboard(),

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
            this.createCardPopupLayer(),

            // Layer 7.25: Selected card detail popup (from clicking buff/trap cards) - conditionally visible
            this.createSelectedCardDetailLayer(),

            // Layer 7.5: Played card popup (temporary 2-second display) - conditionally visible
            this.createPlayedCardPopupLayer(),

            // Layer 8: Attack animation overlays
            this.createAttackAnimations(),
        ],
        }),
      ],
    });
  }


  /**
   * Create card popup layer with conditional visibility
   */
  private createCardPopupLayer(): UINodeType {
    // Use UINode.if for conditional rendering if available
    if (this.ui.UINode?.if) {
      return this.ui.UINode.if(
        this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => !!state?.cardPopup),
        this.ui.View({
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          },
          children: this.ui.Text({
            text: 'Card Popup - TODO: Implement with reactive data',
            style: { color: '#fff', fontSize: 20 }
          }),
        })
      );
    }

    // Fallback: empty View (popup won't work)
    return this.ui.View({ style: { display: 'none' } });
  }

  /**
   * Create selected card detail popup layer with conditional visibility
   */
  private createSelectedCardDetailLayer(): UINodeType {
    // Use UINode.if for conditional rendering if available
    if (this.ui.UINode?.if) {
      return this.ui.UINode.if(
        // Derive visibility from base UIState binding (not from derived selectedCardDetail)
        this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) => !!(state.battle?.selectedCardDetail)),
        this.ui.View({
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
          children: [
            // Black backdrop
            this.ui.Pressable({
              onClick: () => {
                this.selectedCardDetailValue = null;
                this.updateUIState({ selectedCardDetail: null });
              },
              style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }),
            // Card display
            this.ui.Text({
              text: 'Selected Card Detail - TODO: Implement with reactive card rendering',
              style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                color: '#fff',
                fontSize: 20,
              }
            }),
          ],
        })
      );
    }

    // Fallback: empty View
    return this.ui.View({ style: { display: 'none' } });
  }

  /**
   * Create played card popup layer with conditional visibility
   */
  private createPlayedCardPopupLayer(): UINodeType {
    // For now, return empty View since playedCardDisplay is not reactive yet
    // TODO: Make playedCardDisplay reactive and implement properly
    return this.ui.View({ style: { display: 'none' } });
  }

  /**
   * Create card popup overlay
   */
  private createCardPopup(popup: any): UINodeType {
    return this.ui.View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },
      children: [
        // Card detail popup
        createCardDetailPopup(this.ui, {
          cardDetail: {
            card: popup.card,
            isInDeck: false,
            buttons: popup.showCloseButton ? ['Close'] : []
          },
          onButtonClick: () => this.onAction?.('btn-card-close'),
        }),
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
   * Start the turn timer (chess-clock style)
   */
  private startTurnTimer(): void {
    // Don't start if already running
    if (this.timerInterval !== null) {
      return;
    }

    console.log('[BattleScreen] Starting timer for player turn');
    this.onRenderNeeded?.(); // Trigger re-render

    this.timerInterval = this.async.setInterval(() => {
      // Count down the current player's timer
      if (this.isPlayerTurnValue) {
        const current = this.playerTimerValue;
        if (current <= 0) {
          console.log('[BattleScreen] Player timer reached 0, player loses');
          this.stopTurnTimer();
          // Trigger loss - forfeit the battle
          this.onAction?.('forfeit');
        } else {
          this.playerTimerValue = current - 1;
          this.updateUIState({ playerTimer: this.playerTimerValue });
          this.onRenderNeeded?.();
        }
      } else {
        const current = this.opponentTimerValue;
        if (current <= 0) {
          console.log('[BattleScreen] Opponent timer reached 0, opponent loses');
          this.stopTurnTimer();
          // Opponent loses - this should trigger victory
          // For now, just end their turn
          this.onAction?.('end-turn');
        } else {
          this.opponentTimerValue = current - 1;
          this.updateUIState({ opponentTimer: this.opponentTimerValue });
          this.onRenderNeeded?.();
        }
      }
    }, 1000);
  }

  /**
   * Stop the turn timer
   */
  private stopTurnTimer(): void {
    if (this.timerInterval) {
      this.async.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Update the end turn button text based on turn and timer
   */
  private updateEndTurnButtonText(): void {
    // endTurnButtonText is now a derived binding, so it updates automatically
    // This method is kept for compatibility but doesn't need to do anything
    console.log('[BattleScreen] updateEndTurnButtonText called (no-op, using derived binding)');
  }

  /**
   * Finish render and trigger re-render if needed
   */
  private finishRender(): void {
    this.isRendering = false;
    if (this.needsRerender) {
      console.log('[BattleScreen] Re-render needed after current render');
      this.needsRerender = false;
      // Use setTimeout to break out of the current call stack
      this.async.setTimeout(() => this.onRenderNeeded?.(), 0);
    }
  }

  /**
   * Cleanup resources
   */
  /**
   * Create played card popup (shows for 2 seconds when card is played)
   */
  private createPlayedCardPopup(card: any): UINodeType {
    return createCardDetailPopup(this.ui, {
      cardDetail: {
        card: card,
        isInDeck: false,
        buttons: []
      },
      onButtonClick: (buttonId: string) => {
        // User can close early by clicking
        if (this.playedCardTimeout) {
          this.async.clearTimeout(this.playedCardTimeout);
          this.playedCardTimeout = null;
        }
        this.playedCardDisplay = null;
        this.onRenderNeeded?.();
      }
    });
  }

  /**
   * Show a played card popup for 2 seconds, then execute callback
   */
  private showPlayedCard(card: any, callback?: () => void): void {
    console.log('[BattleScreen] Showing played card popup:', card.name);

    // Use the onShowCardDetail callback if available
    if (this.onShowCardDetail) {
      this.onShowCardDetail(card, 2000, callback);
    } else {
      console.warn('[BattleScreen] onShowCardDetail not defined, executing callback immediately');
      callback?.();
    }
  }

  public cleanup(): void {
    this.stopTurnTimer();
    // Reset all UI state
    this.playerTimerValue = 300;
    this.opponentTimerValue = 300;
    this.showHandValue = true;
    this.handScrollOffsetValue = 0;
    this.selectedCardDetailValue = null;

    // Update UIState with reset values
    this.updateUIState({
      playerTimer: 300,
      opponentTimer: 300,
      showHand: true,
      handScrollOffset: 0,
      selectedCardDetail: null,
    });

    // Trigger final re-render
    this.onRenderNeeded?.();

    // Clear played card timeout
    if (this.playedCardTimeout) {
      this.async.clearTimeout(this.playedCardTimeout);
      this.playedCardTimeout = null;
    }
    this.playedCardDisplay = null;
  }
}