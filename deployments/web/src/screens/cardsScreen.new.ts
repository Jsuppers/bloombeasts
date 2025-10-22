/**
 * Cards Screen - Refactored with UI Component System
 */

// Import from unified BloomBeasts UI system
import { View, Text, Image, Pressable, UINode, Binding } from '../ui';
import { COLORS } from '../../../../shared/styles/colors';
import { DIMENSIONS, GAPS } from '../../../../shared/styles/dimensions';

import { CardDisplay, MenuStats } from '../../../../bloombeasts/gameManager';
import { deckEmoji } from '../../../../shared/constants/emojis';
import { createSideMenu, createTextRow } from './common/sideMenu';
import { sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';

export class CardsScreenNew {
    // State bindings
    private cards: Binding<CardDisplay[]> = new Binding<CardDisplay[]>([]);
    private deckSize: Binding<number> = new Binding(0);
    private deckCardIds: Binding<string[]> = new Binding<string[]>([]);
    private stats: Binding<MenuStats | null> = new Binding<MenuStats | null>(null);
    private scrollOffset: Binding<number> = new Binding(0);

    // Configuration
    private cardsPerRow: number = 4;
    private rowsPerPage: number = 2;

    // Callbacks
    private onCardSelectCallback: ((cardId: string) => void) | null = null;
    private onBackCallback: (() => void) | null = null;
    private playSfxCallback: ((src: string) => void) | null = null;
    private renderCallback: (() => void) | null = null;

    constructor() {
        // Subscribe to scrollOffset changes to trigger re-renders
        this.scrollOffset.subscribe(() => {
            if (this.renderCallback) {
                this.renderCallback();
            }
        });
    }

    /**
     * Create the cards UI
     */
    createUI(): UINode {
        return View({
            style: {
                width: '100%',
                height: '100%',
                position: 'relative',
            },
            children: [
                // Background image (full screen)
                this.createBackground(),

                // Main content area with card grid
                this.createMainContent(),

                // Side menu with controls (absolutely positioned)
                this.createSideMenu(),
            ],
        });
    }

    /**
     * Create full-screen background image
     */
    private createBackground(): UINode {
        return Image({
            source: new Binding({ uri: 'background' }),
            style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
            },
        });
    }

    /**
     * Create main content area with card grid
     */
    private createMainContent(): UINode {
        return View({
            style: {
                position: 'absolute',
                width: 1100, // Don't overlap sidebar (1280 - 180 for sidebar and margins)
                height: '100%',
                padding: 40,
            },
            children: [
                // Cards container
                View({
                    style: {
                        padding: 30,
                        backgroundColor: COLORS.cardBackground,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: COLORS.borderDefault,
                        flex: 1,
                    },
                    children: this.cards.derive(cards => {
                        if (cards.length === 0) {
                            return [
                                View({
                                    style: {
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                    children: Text({
                                        text: new Binding('No cards in your collection yet.'),
                                        style: {
                                            fontSize: DIMENSIONS.fontSize.xl,
                                            color: COLORS.textSecondary,
                                        },
                                    }),
                                }),
                            ];
                        }

                        return [this.createCardGrid()];
                    }) as any,
                }),
            ],
        });
    }

    /**
     * Create the card grid
     */
    private createCardGrid(): UINode {
        return View({
            style: {
                flexDirection: 'column',
            },
            children: Binding.derive(
                [this.cards, this.scrollOffset, this.deckCardIds],
                (cards, offset, deckIds) => {
                    const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
                    const startIndex = offset * cardsPerPage;
                    const endIndex = Math.min(startIndex + cardsPerPage, cards.length);
                    const visibleCards = cards.slice(startIndex, endIndex);

                    // Create rows
                    const rows: UINode[] = [];
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
                                    children: rowCards.map((card, index) =>
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

                    return rows;
                }
            ) as any,
        });
    }

    /**
     * Create a single card item
     */
    private createCardItem(card: CardDisplay, isInDeck: boolean): UINode {
        return Pressable({
            onClick: () => {
                if (this.onCardSelectCallback) {
                    this.onCardSelectCallback(card.id);
                }
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
                // Card image placeholder
                // TODO: Replace with actual Image component when image loading is implemented
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

                // Card name
                Text({
                    text: new Binding(card.name),
                    numberOfLines: 2,
                    style: {
                        fontSize: DIMENSIONS.fontSize.sm,
                        color: COLORS.textPrimary,
                        textAlign: 'center',
                    },
                }),

                // Deck indicator
                UINode.if(
                    new Binding(isInDeck),
                    View({
                        style: {
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 20,
                            height: 20,
                            backgroundColor: COLORS.success,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        children: Text({
                            text: new Binding('✓'),
                            style: {
                                fontSize: 12,
                                color: '#ffffff',
                                fontWeight: 'bold',
                            },
                        }),
                    })
                ),
            ],
        });
    }

    /**
     * Create side menu with controls
     */
    private createSideMenu(): UINode {
        const deckInfoText = Binding.derive(
            [this.deckSize],
            (size) => `${deckEmoji} ${size}/30`
        );

        return createSideMenu({
            title: 'Cards',
            customTextContent: [
                createTextRow(deckInfoText as any, 0),
            ],
            buttons: [
                {
                    label: '↑',
                    onClick: () => {
                        const cards = this.cards.get();
                        const currentOffset = this.scrollOffset.get();
                        const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
                        const totalPages = Math.ceil(cards.length / cardsPerPage);

                        const newOffset = currentOffset - 1;
                        if (newOffset >= 0) {
                            if (this.playSfxCallback) {
                                this.playSfxCallback('sfx/menuButtonSelect.wav');
                            }
                            this.scrollOffset.set(newOffset);
                        }
                    },
                    disabled: Binding.derive(
                        [this.cards, this.scrollOffset],
                        (cards, offset) => offset <= 0
                    ) as any,
                    yOffset: 0,
                },
                {
                    label: '↓',
                    onClick: () => {
                        const cards = this.cards.get();
                        const currentOffset = this.scrollOffset.get();
                        const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
                        const totalPages = Math.ceil(cards.length / cardsPerPage);

                        const newOffset = currentOffset + 1;
                        if (newOffset < totalPages) {
                            if (this.playSfxCallback) {
                                this.playSfxCallback('sfx/menuButtonSelect.wav');
                            }
                            this.scrollOffset.set(newOffset);
                        }
                    },
                    disabled: Binding.derive(
                        [this.cards, this.scrollOffset],
                        (cards, offset) => {
                            const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
                            const totalPages = Math.ceil(cards.length / cardsPerPage);
                            return offset >= totalPages - 1;
                        }
                    ) as any,
                    yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
                },
            ],
            bottomButton: {
                label: 'Back',
                onClick: () => {
                    if (this.onBackCallback) {
                        this.onBackCallback();
                    }
                },
                disabled: false,
            },
            stats: this.stats,
        });
    }

    /**
     * Update the screen with new data
     */
    update(
        cards: CardDisplay[],
        deckSize: number,
        deckCardIds: string[],
        onCardSelect: (cardId: string) => void,
        onBack: () => void,
        stats?: MenuStats
    ): void {
        this.cards.set(cards);
        this.deckSize.set(deckSize);
        this.deckCardIds.set(deckCardIds);
        if (stats) {
            this.stats.set(stats);
        }
        this.onCardSelectCallback = onCardSelect;
        this.onBackCallback = onBack;
    }

    /**
     * Set play SFX callback
     */
    setPlaySfxCallback(callback: (src: string) => void): void {
        this.playSfxCallback = callback;
    }

    /**
     * Set render callback (called when screen needs to re-render)
     */
    setRenderCallback(callback: () => void): void {
        this.renderCallback = callback;
    }

    /**
     * Cleanup
     */
    destroy(): void {
        // No animations to clean up
    }
}
