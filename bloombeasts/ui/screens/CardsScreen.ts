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
import type { MenuStats, CardDetailDisplay } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createTextRow } from './common/SideMenu';
import { createCardComponent, createReactiveCardComponent, CARD_DIMENSIONS } from './common/CardRenderer';
import { createReactiveCardDetailPopup } from './common/CardDetailPopup';

export interface CardsScreenProps {
  ui: UIMethodMappings;
  playerDataBinding: any; // PlayerData binding - screens derive what they need
  onCardSelect?: (cardId: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
}

/**
 * Unified Cards Screen
 */
export class CardsScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;

  private playerDataBinding: any;
  private scrollOffset: any;
  private selectedCardId: any; // Binding<string | null>

  // Track scroll offset for button handlers (can't use .get() in Horizon)
  private scrollOffsetValue: number = 0;

  private cardsPerRow = 4;
  private rowsPerPage = 2;
  private onCardSelect?: (cardId: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;

  constructor(props: CardsScreenProps) {
    this.ui = props.ui;
    this.selectedCardId = new this.ui.Binding<string | null>(null);
    this.playerDataBinding = props.playerDataBinding;
    this.onCardSelect = props.onCardSelect;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.scrollOffset = new this.ui.Binding(0);
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
        playerDataBinding: this.playerDataBinding,
        scrollOffsetBinding: this.scrollOffset,
        slotIndex,
        cardsPerPage,
        onClick: (cardId: string) => this.handleCardClick(cardId),
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
          this.playerDataBinding.derive((pd: any) => {
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
              text: new this.ui.Binding('No cards in your collection yet.'),
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
    // Note: Derive directly from playerDataBinding to avoid nesting (cards is already a derived binding)
    const scrollButtons = [
      {
        label: '↑',
        onClick: () => {
          // Reactive disabled state prevents invalid scrolling, so just decrement
          this.scrollOffsetValue--;
          this.scrollOffset.set(this.scrollOffsetValue);
        },
        disabled: this.ui.Binding.derive(
          [this.playerDataBinding, this.scrollOffset],
          (pd: any, offset: number) => offset <= 0 ? true : false
        ) as any,
        yOffset: 0,
      },
      {
        label: '↓',
        onClick: () => {
          // Reactive disabled state prevents invalid scrolling, so just increment
          this.scrollOffsetValue++;
          this.scrollOffset.set(this.scrollOffsetValue);
        },
        disabled: this.ui.Binding.derive(
          [this.playerDataBinding, this.scrollOffset],
          (pd: any, offset: number) => {
            const cards = pd?.cards?.collected || [];
            const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(cards.length / cardsPerPage);
            return offset >= totalPages - 1 ? true : false;
          }
        ) as any,
        yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
      },
    ];

    // Deck info text - derive directly from playerDataBinding to avoid nesting
    const deckInfoText = this.playerDataBinding.derive((pd: any) => `${deckEmoji} ${pd?.cards?.deck?.length || 0}/30`);

    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background
        this.ui.Image({
          source: this.ui.Binding.derive(
            [this.ui.assetsLoadedBinding],
            (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null
          ),
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
          source: this.ui.Binding.derive(
            [this.ui.assetsLoadedBinding],
            (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('cards-container') : null
          ),
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
          playerDataBinding: this.playerDataBinding,
        }),

        // Card detail popup overlay container (conditionally rendered)
        // Uses UINode.if() for proper conditional rendering per Horizon docs
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.Binding.derive(
            [this.selectedCardId],
            (cardId: string | null) => cardId !== null ? true : false
          ),
          this.ui.View({
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
            children: createReactiveCardDetailPopup(this.ui, {
              cardIdBinding: this.selectedCardId,
              playerDataBinding: this.playerDataBinding,
              onClose: () => this.closePopup(),
              sideContent: (ui, deps) => this.createPopupButtons(deps),
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
    this.selectedCardId.set(cardId);
  }

  /**
   * Close the popup
   */
  private closePopup(): void {
    this.selectedCardId.set(null);
  }

  /**
   * Create reactive popup buttons
   * Returns Add/Remove and Close buttons with reactive state
   */
  private createPopupButtons(deps: {
    cardIdBinding: any;
    playerDataBinding: any;
  }): UINodeType[] {
    const { cardIdBinding, playerDataBinding } = deps;
    const buttonWidth = sideMenuButtonDimensions.width;
    const buttonHeight = sideMenuButtonDimensions.height;
    const buttonSpacing = GAPS.buttons;

    // Track cardId for onClick handler
    let currentCardId: string | null = null;
    const cardIdTracker = this.ui.Binding.derive(
      [cardIdBinding],
      (cardId: string | null) => {
        currentCardId = cardId;
        return cardId;
      }
    );

    // Hover state bindings for buttons
    const actionButtonHover = new this.ui.Binding(false);
    const closeButtonHover = new this.ui.Binding(false);

    return [
      // Add/Remove button
      this.ui.Pressable({
        onClick: () => {
          if (currentCardId && this.onCardSelect) {
            this.onCardSelect(currentCardId);
          }
        },
        onHoverIn: () => actionButtonHover.set(true),
        onHoverOut: () => actionButtonHover.set(false),
        style: {
          width: buttonWidth,
          height: buttonHeight,
          position: 'relative',
          marginBottom: buttonSpacing,
        },
        children: [
          // Button background
          this.ui.Image({
            source: this.ui.Binding.derive(
              [this.ui.assetsLoadedBinding, playerDataBinding, cardIdBinding],
              (...args: any[]) => {
                const assetsLoaded: boolean = args[0];
                const pd: any = args[1];
                const cardId: string | null = args[2];
                if (!assetsLoaded || !cardId) return null;
                const deckCardIds: string[] = pd?.cards?.deck || [];
                const isInDeck = deckCardIds.includes(cardId);
                return this.ui.assetIdToImageSource?.(isInDeck ? 'red-button' : 'green-button');
              }
            ),
            style: {
              position: 'absolute',
              width: buttonWidth,
              height: buttonHeight,
              top: 0,
              left: 0,
              opacity: this.ui.Binding.derive([actionButtonHover], (hover) => hover ? 0.8 : 1.0),
            },
          }),
          // Button text
          this.ui.View({
            style: {
              position: 'absolute',
              width: buttonWidth,
              height: buttonHeight,
              justifyContent: 'center',
              alignItems: 'center',
            },
            children: this.ui.Text({
              text: this.ui.Binding.derive(
                [playerDataBinding, cardIdBinding],
                (...args: any[]) => {
                  const pd: any = args[0];
                  const cardId: string | null = args[1];
                  if (!cardId) return '';
                  const deckCardIds: string[] = pd?.cards?.deck || [];
                  const isInDeck = deckCardIds.includes(cardId);
                  return isInDeck ? 'Remove' : 'Add';
                }
              ),
              style: {
                fontSize: DIMENSIONS.fontSize.md,
                color: COLORS.textPrimary,
                fontWeight: 'bold',
              },
            }),
          }),
        ],
      }),

      // Close button
      this.ui.Pressable({
        onClick: () => this.closePopup(),
        onHoverIn: () => closeButtonHover.set(true),
        onHoverOut: () => closeButtonHover.set(false),
        style: {
          width: buttonWidth,
          height: buttonHeight,
          position: 'relative',
        },
        children: [
          // Button background
          this.ui.Image({
            source: this.ui.Binding.derive(
              [this.ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('standard-button') : null
            ),
            style: {
              position: 'absolute',
              width: buttonWidth,
              height: buttonHeight,
              top: 0,
              left: 0,
              opacity: this.ui.Binding.derive([closeButtonHover], (hover) => hover ? 0.8 : 1.0),
            },
          }),
          // Button text
          this.ui.View({
            style: {
              position: 'absolute',
              width: buttonWidth,
              height: buttonHeight,
              justifyContent: 'center',
              alignItems: 'center',
            },
            children: this.ui.Text({
              text: new this.ui.Binding('Close'),
              style: {
                fontSize: DIMENSIONS.fontSize.md,
                color: COLORS.textPrimary,
                fontWeight: 'bold',
              },
            }),
          }),
        ],
      }),
    ];
  }

  dispose(): void {
    // Nothing to clean up
  }
}
