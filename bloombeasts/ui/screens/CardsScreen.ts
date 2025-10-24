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
          source: new this.ui.Binding({ uri: 'background' }),
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
          source: new this.ui.Binding({ uri: 'cards-container' }),
          style: {
            position: 'absolute',
            left: 40,
            top: 40,
            width: 980,
            height: 640,
          },
        }),
        // Main content - card grid
        this.ui.View({
          style: {
            position: 'absolute',
            left: 70,
            top: 70,
            width: 920,
            height: 580,
          },
          children: this.ui.Binding.derive(
            [this.cards, this.scrollOffset, this.deckCardIds],
            (cards: CardDisplay[], offset: number, deckIds: string[]) => {
              if (cards.length === 0) {
                return [
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
                  }),
                ];
              }

              // Create card grid inline for reactivity
              const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
              const startIndex = offset * cardsPerPage;
              const endIndex = Math.min(startIndex + cardsPerPage, cards.length);
              const visibleCards = cards.slice(startIndex, endIndex);

              const rows: UINodeType[] = [];
              for (let row = 0; row < this.rowsPerPage; row++) {
                const rowCards = visibleCards.slice(
                  row * this.cardsPerRow,
                  (row + 1) * this.cardsPerRow
                );

                if (rowCards.length > 0) {
                  rows.push(
                    this.ui.View({
                      style: {
                        flexDirection: 'row',
                        marginBottom: row < this.rowsPerPage - 1 ? GAPS.cards : 0,
                      },
                      children: rowCards
                        .filter((card: CardDisplay) => card && card.id)
                        .map((card: CardDisplay, index: number) =>
                          this.ui.View({
                            style: {
                              marginRight: index < rowCards.length - 1 ? GAPS.cards : 0,
                            },
                            children: createCardComponent(this.ui, {
                              card,
                              isInDeck: deckIds.includes(card.id),
                              onClick: (cardId: string) => this.handleCardClick(cardId),
                              showDeckIndicator: true,
                            }),
                          })
                        ),
                    })
                  );
                }
              }

              return [
                this.ui.View({
                  style: {
                    flexDirection: 'column',
                  },
                  children: rows.filter(r => r),
                })
              ];
            }
          ) as any,
        }),
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

        // Card detail popup overlay container (always present)
        this.ui.View({
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
          children: this.selectedCardDetail.derive((cardDetail: CardDetailDisplay | null) => {
            if (!cardDetail) {
              return []; // No popup
            }

            return [createCardDetailPopup(this.ui, {
              cardDetail,
              onButtonClick: (buttonId: string) => this.handlePopupButtonClick(buttonId),
            })];
          }) as any,
        }),
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
