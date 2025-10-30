/**
 * Unified Battle Screen Component
 * Works on both Horizon and Web platforms
 * Exactly mimics the UI from deployments/web/src/screens/battleScreen.ts
 */

import { COLORS } from '../styles/colors';
import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import type { AsyncMethods } from '../types/bindings';
import { DIMENSIONS, GAPS } from '../styles/dimensions';
import type { BattleDisplay, ObjectiveDisplay } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createCardDetailPopup } from './common/CardDetailPopup';
import { canAttack } from '../../engine/utils/combatHelpers';

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
  battleDisplay: any; // BattleDisplay binding - REQUIRED
  onAction?: (action: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
  onShowCardDetail?: (card: any, durationMs: number, callback?: () => void) => void;
}

/**
 * Unified Battle Screen that exactly replicates web deployment's battle UI
 */
export class BattleScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;
  private async: AsyncMethods;

  // State bindings
  private battleDisplay: any; // BattleDisplay binding - REQUIRED
  private showHand: any;
  private handScrollOffset: any;
  private turnTimer: any;
  private selectedCardDetail: any;
  private isPlayerTurn: any;
  private endTurnButtonText: any; // Binding for button text that updates reactively

  // Temporary card display (for showing played cards)
  private playedCardDisplay: any | null = null;
  private playedCardTimeout: number | null = null;

  // Timer management
  private timerInterval: number | null = null;

  // Track binding values separately (as per Horizon docs - no .get() method)
  private timerValue = 60;
  private isPlayerTurnValue = false;
  private battleDisplayValue: any | null = null;
  private hasAttackableBeasts = false;
  private showHandValue = true;
  private handScrollOffsetValue = 0;
  private selectedCardDetailValue: any = null;

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

    // Initialize bindings after ui is set
    this.showHandValue = true;
    this.showHand = new this.ui.Binding(this.showHandValue);

    this.handScrollOffsetValue = 0;
    this.handScrollOffset = new this.ui.Binding(this.handScrollOffsetValue);

    this.timerValue = 60;
    this.turnTimer = new this.ui.Binding(this.timerValue);

    this.selectedCardDetailValue = null;
    this.selectedCardDetail = new this.ui.Binding<any | null>(this.selectedCardDetailValue);

    // Store required battleDisplay binding
    this.battleDisplay = props.battleDisplay;

    // Wrap onAction to add logging
    this.onAction = props.onAction ? (action: string) => {
      console.log('[BattleScreen] onAction called with:', action);
      props.onAction!(action);
    } : undefined;

    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.onShowCardDetail = props.onShowCardDetail;

    // Initialize player turn tracking with derived bindings
    // Create derived binding for isPlayerTurn
    this.isPlayerTurn = this.ui.Binding.derive(
      [this.battleDisplay],
      (state: BattleDisplay | null) => {
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
      }
    );

    // Create derived binding for endTurnButtonText
    this.endTurnButtonText = this.ui.Binding.derive(
      [this.battleDisplay, this.turnTimer],
      (state: BattleDisplay | null, timer: number) => state?.turnPlayer === 'player' ? `(${timer})` : 'Enemy Turn'
    );

    // Initialize battle components
    this.backgroundComponent = new BattleBackground({
      ui: this.ui,
      battleDisplay: this.battleDisplay,
    });

    this.beastFieldComponent = new BeastField({
      ui: this.ui,
      battleDisplay: this.battleDisplay,
      onAction: this.onAction,
      showPlayedCard: this.showPlayedCard.bind(this),
    });

    this.trapZoneComponent = new TrapZone({
      ui: this.ui,
      battleDisplay: this.battleDisplay,
      onCardDetailSelected: (card) => {
        this.selectedCardDetailValue = card;
        this.selectedCardDetail.set(card);
      },
    });

    this.buffZoneComponent = new BuffZone({
      ui: this.ui,
      battleDisplay: this.battleDisplay,
      onCardDetailSelected: (card) => {
        this.selectedCardDetailValue = card;
        this.selectedCardDetail.set(card);
      },
    });

    this.habitatZoneComponent = new HabitatZone({
      ui: this.ui,
      battleDisplay: this.battleDisplay,
      onCardDetailSelected: (card) => {
        const habitatWithType = { ...card, type: 'Habitat' };
        this.selectedCardDetailValue = habitatWithType;
        this.selectedCardDetail.set(habitatWithType);
      },
    });

    this.playerHandComponent = new PlayerHand({
      ui: this.ui,
      battleDisplay: this.battleDisplay,
      showHand: this.showHand,
      handScrollOffset: this.handScrollOffset,
      showHandValue: this.showHandValue,
      handScrollOffsetValue: this.handScrollOffsetValue,
      getBattleDisplayValue: () => this.battleDisplayValue,
      onAction: this.onAction,
      onShowHandChange: (newValue) => {
        this.showHandValue = newValue;
        this.showHand.set(newValue);
      },
      onScrollOffsetChange: (newValue) => {
        this.handScrollOffsetValue = newValue;
        this.handScrollOffset.set(newValue);
      },
      onRenderNeeded: this.onRenderNeeded,
      showPlayedCard: this.showPlayedCard.bind(this),
    });

    this.infoDisplaysComponent = new InfoDisplays({
      ui: this.ui,
      battleDisplay: this.battleDisplay,
    });

    this.sideMenuComponent = new BattleSideMenu({
      ui: this.ui,
      battleDisplay: this.battleDisplay,
      endTurnButtonText: this.endTurnButtonText,
      getIsPlayerTurn: () => this.isPlayerTurnValue,
      getHasAttackableBeasts: () => this.hasAttackableBeasts,
      onAction: this.onAction,
      onStopTurnTimer: () => this.stopTurnTimer(),
    });
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
        width: gameDimensions.panelWidth,
        height: gameDimensions.panelHeight,
        position: 'relative',
        overflow: 'hidden',
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
    });
  }


  /**
   * Create card popup layer with conditional visibility
   */
  private createCardPopupLayer(): UINodeType {
    // Use UINode.if for conditional rendering if available
    if (this.ui.UINode?.if) {
      return this.ui.UINode.if(
        this.battleDisplay.derive((state: BattleDisplay | null) => !!state?.cardPopup),
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
        this.selectedCardDetail.derive((card: any) => !!card),
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
                this.selectedCardDetail.set(null);
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
   * Start the turn timer
   */
  private startTurnTimer(): void {
    // Don't start if already running
    if (this.timerInterval !== null) {
      return;
    }

    this.timerValue = 60;
    this.turnTimer.set(60);
    this.updateEndTurnButtonText(); // Initialize button text
    this.onRenderNeeded?.(); // Trigger re-render

    this.timerInterval = this.async.setInterval(() => {
      const current = this.timerValue;

      if (current <= 0) {
        console.log('[BattleScreen] Timer reached 0, auto-ending turn');
        this.stopTurnTimer();
        this.onAction?.('end-turn');
      } else {
        this.timerValue = current - 1;
        this.turnTimer.set(this.timerValue);
        // Update button text and trigger re-render
        this.updateEndTurnButtonText();
        this.onRenderNeeded?.();
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
    this.showHandValue = true;
    this.showHand.set(true);
    this.handScrollOffsetValue = 0;
    this.handScrollOffset.set(0);
    this.selectedCardDetailValue = null;
    this.selectedCardDetail.set(null);
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