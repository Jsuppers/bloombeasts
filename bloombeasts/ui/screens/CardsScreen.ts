/**
 * Unified Cards Screen Component
 * Works on both Horizon and Web platforms
 * Matches the styling from cardsScreen.new.ts
 */

import { View, Text, Image, Pressable, Binding } from '../index';
import type { ValueBindingBase } from '../index';
import { COLORS } from '../../../shared/styles/colors';
import { DIMENSIONS, GAPS } from '../../../shared/styles/dimensions';
import { sideMenuButtonDimensions } from '../../../shared/constants/dimensions';
import { deckEmoji } from '../../../shared/constants/emojis';
import type { CardDisplay, MenuStats } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createTextRow } from './common/SideMenu';

export interface CardsScreenProps {
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
  private cards: any;
  private deckSize: any;
  private deckCardIds: any;
  private stats: any;
  private scrollOffset: any;
  private cardsPerRow = 4;
  private rowsPerPage = 2;
  private onCardSelect?: (cardId: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;

  constructor(props: CardsScreenProps) {
    this.cards = props.cards;
    this.deckSize = props.deckSize;
    this.deckCardIds = props.deckCardIds;
    this.stats = props.stats;
    this.onCardSelect = props.onCardSelect;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.scrollOffset = new Binding(0);
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
        disabled: Binding.derive(
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
        disabled: Binding.derive(
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

    return View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background
        Image({
          source: new Binding({ uri: 'background' }),
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
        }),
        // Main content - card grid
        View({
          style: {
            position: 'absolute',
            width: 1000,
            height: '100%',
            padding: 40,
          },
          children: [
            View({
              style: {
                padding: 30,
                backgroundColor: COLORS.cardBackground,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: COLORS.borderDefault,
                flex: 1,
              },
              children: Binding.derive(
                [this.cards, this.scrollOffset, this.deckCardIds],
                (cards: CardDisplay[], offset: number, deckIds: string[]) => {
                  if (cards.length === 0) {
                    return [
                      View({
                        style: {
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                        children: Text({
                          text: new Binding('No cards yet.'),
                          style: {
                            fontSize: DIMENSIONS.fontSize.xl,
                            color: COLORS.textSecondary,
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
                        View({
                          style: {
                            flexDirection: 'row',
                            marginBottom: row < this.rowsPerPage - 1 ? GAPS.cards : 0,
                          },
                          children: rowCards.map((card: CardDisplay, index: number) =>
                            View({
                              style: {
                                marginRight: index < rowCards.length - 1 ? GAPS.cards : 0,
                              },
                              children: this.createCardItem(card, deckIds.includes(card.id)),
                            })
                          ),
                        })
                      );
                    }
                  }

                  return [
                    View({
                      style: {
                        flexDirection: 'column',
                      },
                      children: rows,
                    })
                  ];
                }
              ) as any,
            }),
          ],
        }),
        // Sidebar with common side menu
        createSideMenu({
          title: 'Cards',
          customTextContent: [
            createTextRow(deckInfoText, 0),
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
      ],
    });
  }

  private createCardItem(card: CardDisplay, isInDeck: boolean): UINodeType {
    return Pressable({
      onClick: () => {
        if (this.onCardSelect) this.onCardSelect(card.id);
      },
      style: {
        width: 120,
        height: 160,
        backgroundColor: COLORS.panelBackground,
        borderRadius: 8,
        borderWidth: isInDeck ? 3 : 2,
        borderColor: isInDeck ? COLORS.borderSuccess : COLORS.borderDefault,
        padding: 8,
        position: 'relative',
      },
      children: [
        View({
          style: {
            width: '100%',
            height: 100,
            backgroundColor: '#3a3a4e',
            borderRadius: 4,
            marginBottom: 8,
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: Text({
            text: new Binding(card.type),
            style: {
              fontSize: DIMENSIONS.fontSize.sm,
              color: COLORS.textSecondary,
            },
          }),
        }),
        Text({
          text: new Binding(card.name),
          numberOfLines: 2,
          style: {
            fontSize: DIMENSIONS.fontSize.sm,
            color: COLORS.textPrimary,
            textAlign: 'center',
          },
        }),
      ],
    });
  }

  dispose(): void {
    // Cleanup
  }
}
