/**
 * Card Popup Manager - Handles all card popup UI logic for BattleScreen
 *
 * Extracted from BattleScreen to reduce complexity and consolidate popup logic
 */

import type { UIMethodMappings } from '../../types/ui/UIMethodMappings';
import type { AsyncMethods } from '../../common/ui/types/types/bindings';
import type { BattleDisplay } from '../../types/game/DisplayTypes';
import { UINodeType } from '../../common/ui/ScreenUtils';
import { createCardDetailPopup } from '../../common/ui/screens/CardDetailPopup';
import { createReactiveCardComponent } from '../../common/ui/screens/CardRenderer';
import { BindingType, UIState } from '../../common/ui/types/types/BindingManager';
import { Logger } from '../../common/engine/utils/Logger';

export interface CardPopupCallbacks {
  onCardDetailSelected: (card: any, cardType?: string) => void;
  onUpdateUIState: (updates: any) => void;
  onShowCardDetail?: (card: any, durationMs: number, callback?: () => void) => void;
  onAction?: (action: string) => void;
}

export class CardPopupManager {
  // Temporary card display (for showing played cards)
  private playedCardDisplay: any | null = null;
  private playedCardTimeout: number | null = null;

  constructor(
    private ui: UIMethodMappings,
    private async: AsyncMethods,
    private callbacks: CardPopupCallbacks
  ) {}

  /**
   * Handle card detail selection from trap/buff/habitat zones
   */
  handleCardDetailSelected(card: any, cardType?: string): void {
    const cardWithType = cardType ? { ...card, type: cardType } : card;
    this.callbacks.onUpdateUIState({ selectedCardDetail: cardWithType });
  }

  /**
   * Create card popup layer (from battleDisplay.cardPopup) - conditionally visible
   */
  createCardPopupLayer(): UINodeType {
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
            text: 'Card Popup',
            style: { color: '#fff', fontSize: 20 }
          }),
        })
      );
    }

    // Fallback: empty View (popup won't work)
    return this.ui.View({ style: { display: 'none' } });
  }

  /**
   * Create selected card detail popup layer (from UIState.battle.selectedCardDetail) - conditionally visible
   */
  createSelectedCardDetailLayer(): UINodeType {
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
                this.callbacks.onUpdateUIState({ selectedCardDetail: null });
              },
              style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }),
            // Card display centered on screen with reactive rendering
            this.ui.View({
              style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: this.createBattleCardDisplay(),
            }),
          ],
        })
      );
    }

    // Fallback: empty View
    return this.ui.View({ style: { display: 'none' } });
  }

  /**
   * Create battle card display with reactive bindings for selectedCardDetail
   * Uses the shared reactive card component
   */
  private createBattleCardDisplay(): UINodeType {
    return createReactiveCardComponent(this.ui, {
      mode: 'battleSelectedCard',
      showDeckIndicator: false,
    });
  }

  /**
   * Create card popup overlay (legacy/unused)
   */
  createCardPopup(popup: any): UINodeType {
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
          onButtonClick: () => this.callbacks.onAction?.('btn-card-close'),
        }),
      ],
    });
  }

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
      }
    });
  }

  /**
   * Show a played card popup for 2 seconds, then execute callback
   */
  showPlayedCard(card: any, callback?: () => void): void {
    // Use the onShowCardDetail callback if available
    if (this.callbacks.onShowCardDetail) {
      this.callbacks.onShowCardDetail(card, 2000, callback);
    } else {
      Logger.warn('[CardPopupManager] onShowCardDetail not defined, executing callback immediately');
      callback?.();
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    // Clear played card timeout
    if (this.playedCardTimeout) {
      this.async.clearTimeout(this.playedCardTimeout);
      this.playedCardTimeout = null;
    }
    this.playedCardDisplay = null;
  }
}
