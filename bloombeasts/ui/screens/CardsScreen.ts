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
import type { CardDisplay, MenuStats, CardDetailDisplay } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createTextRow } from './common/SideMenu';
import { createCardComponent, CARD_DIMENSIONS } from './common/CardRenderer';
import { createCardDetailPopup } from './common/CardDetailPopup';

export interface CardsScreenProps {
  ui: UIMethodMappings;
  cards: any;
  deckSize: any;
  deckCardIds: any;
  stats: any;
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

  private cards: any;
  private deckSize: any;
  private deckCardIds: any;
  private stats: any;
  private scrollOffset: any;
  private selectedCardDetail: any;
  private cardsPerRow = 4;
  private rowsPerPage = 2;
  private onCardSelect?: (cardId: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;

  constructor(props: CardsScreenProps) {
    this.ui = props.ui;
    this.selectedCardDetail = new this.ui.Binding<CardDetailDisplay | null>(null);
    this.cards = props.cards;
    this.deckSize = props.deckSize;
    this.deckCardIds = props.deckCardIds;
    this.stats = props.stats;
    this.onCardSelect = props.onCardSelect;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.scrollOffset = new this.ui.Binding(0);

    // Subscribe to selectedCardDetail changes to trigger re-renders
    this.selectedCardDetail.subscribe(() => {
      if (this.onRenderNeeded) {
        this.onRenderNeeded();
      }
    });
  }

  /**
   * Create card grid with reactive bindings
   * The PlatformBinding.derive wrapper handles unwrapping automatically
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
        // Empty state
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.Binding.derive(
            [this.cards],
            (cards: CardDisplay[]) => {
              console.log('[CardsScreen] Empty state check - cards.length:', cards.length);
              return cards.length === 0;
            }
          ),
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

        // Card grid - pre-create 8 slots
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

                // Create reactive bindings for card at this slot
                const cardOpacity = this.ui.Binding.derive(
                  [this.cards, this.scrollOffset],
                  (cards: CardDisplay[], offset: number) => {
                    const pageStart = offset * cardsPerPage;
                    const cardIndex = pageStart + slotIndex;
                    const exists = cardIndex < cards.length;
                    console.log(`[CardsScreen] Slot ${slotIndex} hasCard:`, exists, 'cards.length:', cards.length, 'cardIndex:', cardIndex);
                    return exists ? 1 : 0;  // Convert boolean to number for opacity
                  }
                );

                // Create image binding
                // For Horizon: Use helper to create ImageSource binding directly (avoids chaining)
                // For Web: Use traditional imageId approach
                const useHelper = !!(this.ui as any).createCardImageBinding;
                const cardImageSource = useHelper
                  ? (this.ui as any).createCardImageBinding(this.cards, this.scrollOffset, slotIndex, cardsPerPage)
                  : null;

                const cardImageId = !useHelper ? this.ui.Binding.derive(
                  [this.cards, this.scrollOffset],
                  (cards: CardDisplay[], offset: number) => {
                    const pageStart = offset * cardsPerPage;
                    const cardIndex = pageStart + slotIndex;
                    if (cardIndex < cards.length) {
                      const card = cards[cardIndex];
                      const baseId = card.id.replace(/-\d+-\d+$/, '');
                      return baseId;
                    }
                    return '';
                  }
                ) : null;

                // Always render card slot, but make it invisible when empty
                return this.ui.View({
                  style: {
                    width: CARD_DIMENSIONS.width,
                    height: CARD_DIMENSIONS.height,
                    marginRight: colIndex < this.cardsPerRow - 1 ? GAPS.cards : 0,
                    opacity: cardOpacity,  // 1 when card exists, 0 when empty - makes it invisible but preserves layout
                  },
                  onClick: () => {
                    const cards = this.cards.get();
                    const offset = this.scrollOffset.get();
                    const pageStart = offset * cardsPerPage;
                    const cardIndex = pageStart + slotIndex;
                    if (cardIndex < cards.length) {
                      this.handleCardClick(cards[cardIndex].id);
                    }
                  },
                  children: this.ui.Image(useHelper ? {
                    source: cardImageSource,  // Horizon: ImageSource binding
                    style: {
                      width: CARD_DIMENSIONS.width,
                      height: CARD_DIMENSIONS.height,
                    },
                  } : {
                    imageId: cardImageId,  // Web: string imageId
                    style: {
                      width: CARD_DIMENSIONS.width,
                      height: CARD_DIMENSIONS.height,
                    },
                  }),
                });
              }),
            })
          ),
        }),
      ],
    });
  }

  createUI(): UINodeType {
    // Create scroll buttons for the side menu
    const scrollButtons = [
      {
        label: '↑',
        onClick: () => {
          const current = this.scrollOffset.get();
          const cards = this.cards.get();
          const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
          const totalPages = Math.ceil(cards.length / cardsPerPage);

          const newOffset = current - 1;
          if (newOffset >= 0) {
            console.log('[CardsScreen] Scrolling up, newOffset:', newOffset);
            this.scrollOffset.set(newOffset);
            // Trigger re-render after updating scroll position
            if (this.onRenderNeeded) {
              console.log('[CardsScreen] Calling onRenderNeeded');
              this.onRenderNeeded();
            }
          }
        },
        disabled: this.ui.Binding.derive(
          [this.cards, this.scrollOffset],
          (cards: any[], offset: number) => offset <= 0
        ) as any,
        yOffset: 0,
      },
      {
        label: '↓',
        onClick: () => {
          const current = this.scrollOffset.get();
          const cards = this.cards.get();
          const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
          const totalPages = Math.ceil(cards.length / cardsPerPage);

          const newOffset = current + 1;
          if (newOffset < totalPages) {
            console.log('[CardsScreen] Scrolling down, newOffset:', newOffset);
            this.scrollOffset.set(newOffset);
            // Trigger re-render after updating scroll position
            if (this.onRenderNeeded) {
              console.log('[CardsScreen] Calling onRenderNeeded');
              this.onRenderNeeded();
            }
          }
        },
        disabled: this.ui.Binding.derive(
          [this.cards, this.scrollOffset],
          (cards: any[], offset: number) => {
            const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(cards.length / cardsPerPage);
            return offset >= totalPages - 1;
          }
        ) as any,
        yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
      },
    ];

    // Deck info text
    const deckInfoText = this.deckSize.derive((size: number) => `${deckEmoji} ${size}/30`);

    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background
        this.ui.Image({
          imageId: 'background',
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
          imageId: 'cards-container',
          style: {
            position: 'absolute',
            left: 40,
            top: 40,
            width: 980,
            height: 640,
          },
        }),
        // Main content - card grid
        // Card grid view with Horizon-compatible pattern
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
          stats: this.stats,
        }),

        // Card detail popup overlay container (conditionally rendered)
        // Uses UINode.if() for proper conditional rendering per Horizon docs
        ...(this.ui.UINode && this.selectedCardDetail.get() ? [this.ui.UINode.if(
          this.selectedCardDetail.derive((cd: CardDetailDisplay | null) => cd !== null),
          this.ui.View({
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
            children: [createCardDetailPopup(this.ui, {
              cardDetail: this.selectedCardDetail.get()!,
              onButtonClick: (buttonId: string) => this.handlePopupButtonClick(buttonId),
            })],
          })
        )] : []),
      ],
    });
  }

  /**
   * Handle card click - show popup with Add/Remove options
   */
  private handleCardClick(cardId: string): void {
    const cards = this.cards.get();
    const deckIds = this.deckCardIds.get();

    const card = cards.find((c: CardDisplay) => c.id === cardId);
    if (!card) return;

    const isInDeck = deckIds.includes(cardId);
    const buttons = isInDeck ? ['Remove', 'Close'] : ['Add', 'Close'];

    this.selectedCardDetail.set({
      card,
      buttons,
      isInDeck,
    });
  }

  /**
   * Handle popup button clicks
   */
  private handlePopupButtonClick(buttonId: string): void {
    const cardDetail = this.selectedCardDetail.get();
    if (!cardDetail) return;

    if (buttonId === 'btn-card-add') {
      // Add card to deck
      if (this.onCardSelect) {
        this.onCardSelect(cardDetail.card.id);
      }
      // Close popup
      this.selectedCardDetail.set(null);
    } else if (buttonId === 'btn-card-remove') {
      // Remove card from deck
      if (this.onCardSelect) {
        this.onCardSelect(cardDetail.card.id);
      }
      // Close popup
      this.selectedCardDetail.set(null);
    } else if (buttonId === 'btn-card-close') {
      // Just close popup
      this.selectedCardDetail.set(null);
    }
  }

  dispose(): void {
    // Cleanup
  }
}
