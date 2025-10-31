/**
 * Unified Cards Screen Component
 * Works on both Horizon and Web platforms
 * Matches the styling from cardsScreen.new.ts
 */

import { COLORS } from '../styles/colors';
import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import { DIMENSIONS, GAPS } from '../styles/dimensions';
import { sideMenuButtonDimensions } from '../constants/dimensions';
import { deckEmoji } from '../constants/emojis';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createTextRow } from './common/SideMenu';
import { createReactiveCardComponent } from './common/CardRenderer';
import { type PopupButton } from '../common/Popup';
import type { ButtonColor } from '../common/Button';
import { BindingType, UIState } from '../types/BindingManager';
import { createReactiveCardDetailPopup } from './common/CardDetailPopup';

export interface CardsScreenProps {
  ui: UIMethodMappings;
  onCardSelect?: (cardId: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
  playSfx?: (sfxId: string) => void;
}

/**
 * Unified Cards Screen
 */
export class CardsScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;

  private cardsPerRow = 4;
  private rowsPerPage = 2;
  private onCardSelect?: (cardId: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;
  private playSfx?: (sfxId: string) => void;

  constructor(props: CardsScreenProps) {
    this.ui = props.ui;
    this.onCardSelect = props.onCardSelect;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.playSfx = props.playSfx;

  }

  
  /**
   * Create a single card slot using reactive card component
   * Passes playerDataBinding to avoid binding nesting
   */
  private createCardSlot(
    slotIndex: number,
    cardsPerPage: number,
    hasMarginRight: boolean
  ): UINodeType {
    return this.ui.View({
      style: {
        marginRight: hasMarginRight ? GAPS.cards : 0,
      },
      children: createReactiveCardComponent(this.ui, {
        mode: 'slot',
        slotIndex,
        cardsPerPage,
        onClick: (cardId: string) => {
          console.log('[CardsScreen] Card clicked:', cardId);
          this.handleCardClick(cardId);
        },
        showDeckIndicator: true,
      }),
    });
  }

  /**
   * Create card grid with reactive bindings
   * Card slots derive directly from playerDataBinding to avoid nesting
   */
  private createCardGrid(): UINodeType {
    const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
    return this.ui.View({
      style: {
        position: 'absolute',
        left: 70,
        top: 70,
        width: 920,
        height: 580,
      },
      children: [
        // Empty state - derive directly from playerDataBinding
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.PlayerData], (pd: any) => {
            const cards = pd?.cards?.collected || [];
            console.log('[CardsScreen] Empty state check - cards.length:', cards.length);
            return cards.length === 0 ? true : false;
          }),
          this.ui.View({
            style: {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
            children: this.ui.Text({
              text: 'No cards in your collection yet.',
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                color: COLORS.textPrimary,
              },
            }),
          })
        )] : []),

        // Card grid - pre-create 8 slots using reactive card components
        this.ui.View({
          style: {
            flexDirection: 'column',
          },
          children: Array.from({ length: this.rowsPerPage }, (_, rowIndex) =>
            this.ui.View({
              style: {
                flexDirection: 'row',
                marginBottom: rowIndex < this.rowsPerPage - 1 ? GAPS.cards : 0,
              },
              children: Array.from({ length: this.cardsPerRow }, (_, colIndex) => {
                const slotIndex = rowIndex * this.cardsPerRow + colIndex;

                // Create card slot - passes playerDataBinding
                return this.createCardSlot(slotIndex, cardsPerPage, colIndex < this.cardsPerRow - 1);
              }),
            })
          ),
        }),
      ],
    });
  }

  createUI(): UINodeType {

    // Create scroll buttons for the side menu
    // Check bounds inside onClick to avoid multi-binding derives (which create new bindings)
    const scrollButtons = [
      {
        label: '↑',
        onClick: () => {
          // Check bounds before scrolling
          const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
          const currentOffset = currentState.cards?.scrollOffset ?? 0;
          console.log('[CardsScreen] Up button clicked, currentOffset:', currentOffset);
          if (currentOffset > 0) {
            // Update UIState binding
            this.ui.bindingManager.setBinding(BindingType.UIState, {
              ...currentState,
              cards: {
                ...currentState.cards,
                scrollOffset: currentOffset - 1
              }
            });
            console.log('[CardsScreen] Scrolled up to offset:', currentOffset - 1);
            // Trigger re-render for web
            if (this.onRenderNeeded) {
              this.onRenderNeeded();
            }
          }
        },
        disabled: this.ui.bindingManager.derive(
          [BindingType.UIState],
          (uiState: UIState) => {
            const offset = uiState.cards?.scrollOffset ?? 0;
            return offset <= 0;
          }
        ) as any,
        yOffset: 0,
      },
      {
        label: '↓',
        onClick: () => {
          // Reactive disabled state prevents invalid scrolling, so just increment
          const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
          const playerData = this.ui.bindingManager.getSnapshot(BindingType.PlayerData);
          const cards = playerData?.cards?.collected || [];
          const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
          const totalPages = Math.ceil(cards.length / cardsPerPage);
          const currentOffset = currentState.cards?.scrollOffset ?? 0;
          console.log('[CardsScreen] Down button clicked, currentOffset:', currentOffset, 'totalPages:', totalPages);
          if (currentOffset < totalPages - 1) {
            this.ui.bindingManager.setBinding(BindingType.UIState, {
              ...currentState,
              cards: {
                ...currentState.cards,
                scrollOffset: currentOffset + 1
              }
            });
            console.log('[CardsScreen] Scrolled down to offset:', currentOffset + 1);
            // Trigger re-render for web
            if (this.onRenderNeeded) {
              this.onRenderNeeded();
            }
          }
        },
        disabled: this.ui.bindingManager.derive(
          [BindingType.UIState, BindingType.PlayerData],
          (uiState: UIState, pd: any) => {
            const offset = uiState.cards?.scrollOffset ?? 0;
            const cards = pd?.cards?.collected || [];
            const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(cards.length / cardsPerPage);
            return offset >= totalPages - 1;
          }
        ) as any,
        yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
      },
    ];

    // Deck info text - derive directly from playerDataBinding to avoid nesting
    const deckInfoText = this.ui.bindingManager.derive([BindingType.PlayerData], (pd: any) => `${deckEmoji} ${pd?.cards?.deck?.length || 0}/30`);

    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('background') || null,
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
        }),
        // Cards Container image as background
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('cards-container') || null,
          style: {
            position: 'absolute',
            left: 40,
            top: 40,
            width: 980,
            height: 640,
          },
        }),
        // Main content - card grid
        // Card grid view with Horizon-compatible pattern (derives bindings internally)
        this.createCardGrid(),
        // Sidebar with common side menu
        createSideMenu(this.ui, {
          title: 'Cards',
          customTextContent: [
            createTextRow(this.ui, deckInfoText, 0),
          ],
          buttons: scrollButtons,
          bottomButton: {
            label: 'Back',
            onClick: () => {
              if (this.onNavigate) this.onNavigate('menu');
            },
            disabled: false,
          },
          playSfx: this.playSfx,
        }),

        // Card detail popup overlay container (conditionally rendered)
        // Uses UINode.if() for proper conditional rendering per Horizon docs
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.UIState], (state: any) => (state.cards?.selectedCardId ?? null) !== null),
          this.ui.View({
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
            children: createReactiveCardDetailPopup(this.ui, {
              onClose: () => this.closePopup(),
              buttons: this.createPopupButtons(),
              playSfx: this.playSfx,
            }),
          })
        )] : []),
      ],
    });
  }

  /**
   * Handle card click - show popup with Add/Remove options
   */
  private handleCardClick(cardId: string): void {
    console.log('[CardsScreen] handleCardClick called with cardId:', cardId);
    const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
    this.ui.bindingManager.setBinding(BindingType.UIState, {
      ...currentState,
      cards: {
        ...currentState.cards,
        selectedCardId: cardId
      }
    });
  }

  /**
   * Close the popup
   */
  private closePopup(): void {
    const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
    this.ui.bindingManager.setBinding(BindingType.UIState, {
      ...currentState,
      cards: {
        ...currentState.cards,
        selectedCardId: null
      }
    });
  }

  /**
   * Create reactive popup buttons
   * Returns Add/Remove and Close buttons as PopupButton array
   */
  private createPopupButtons(): PopupButton[] {
    // Derive button label (Add/Remove) based on deck status
    const buttonLabel = this.ui.bindingManager.derive(
      [BindingType.PlayerData],
      (pd: any) => {
        const state = this.ui.bindingManager.getSnapshot(BindingType.UIState);
        const cardId = state.cards?.selectedCardId ?? null;
        if (!cardId) return '';
        const deckCardIds: string[] = pd?.cards?.deck || [];
        const isInDeck = deckCardIds.includes(cardId);
        return isInDeck ? 'Remove' : 'Add';
      }
    );

    // Derive button color based on deck status
    const buttonColor = this.ui.bindingManager.derive(
      [BindingType.PlayerData],
      (pd: any) => {
        const state = this.ui.bindingManager.getSnapshot(BindingType.UIState);
        const cardId = state.cards?.selectedCardId ?? null;
        if (!cardId) return 'default' as ButtonColor;
        const deckCardIds: string[] = pd?.cards?.deck || [];
        const isInDeck = deckCardIds.includes(cardId);
        return (isInDeck ? 'red' : 'green') as ButtonColor;
      }
    );

    return [
      // Add/Remove button
      {
        label: buttonLabel,
        onClick: () => {
          const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
          const cardId = currentState.cards?.selectedCardId ?? null;
          if (cardId && this.onCardSelect) {
            this.onCardSelect(cardId);
          }
        },
        color: buttonColor as any,
      },

      // Close button
      {
        label: 'Close',
        onClick: () => this.closePopup(),
        color: 'default',
      },
    ];
  }

  dispose(): void {
    // Nothing to clean up
  }
}
