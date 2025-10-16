/**
 * Cards Screen Renderer
 */

import { CardDisplay, MenuStats } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { standardCardDimensions, sideMenuButtonDimensions, cardsUIContainerDimensions } from '../../../../shared/constants/dimensions';
import { uiSafeZoneButtons, uiSafeZoneText, sideMenuPositions, cardsUIContainerPosition } from '../../../../shared/constants/positions';
import { deckEmoji } from '../../../../shared/constants/emojis';
import { DIMENSIONS, GAPS } from '../../../../shared/styles/dimensions';
import { COLORS } from '../../../../shared/styles/colors';

export class CardsScreen {
    private scrollOffset: number = 0;
    private cardsPerRow: number = 4; // Changed from 5 to 4
    private rowsPerPage: number = 2; // Show 2 rows at a time
    private playSfx: (src: string) => void = () => {};
    private currentCards: CardDisplay[] = [];
    private currentDeckSize: number = 0;
    private currentDeckCardIds: string[] = [];
    private currentOnCardSelect: ((cardId: string) => void) | null = null;
    private currentOnBack: (() => void) | null = null;
    private currentStats: MenuStats | undefined = undefined;

    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    setPlaySfxCallback(callback: (src: string) => void): void {
        this.playSfx = callback;
    }

    async render(
        cards: CardDisplay[],
        deckSize: number,
        deckCardIds: string[],
        onCardSelect: (cardId: string) => void,
        onBack: () => void,
        stats?: MenuStats
    ): Promise<void> {
        // Store current state for re-renders (e.g., when scrolling)
        this.currentCards = cards;
        this.currentDeckSize = deckSize;
        this.currentDeckCardIds = deckCardIds;
        this.currentOnCardSelect = onCardSelect;
        this.currentOnBack = onBack;
        this.currentStats = stats;

        this.clickManager.clearRegions();
        this.renderer.clear();

        // Calculate player info for display
        let playerInfo = undefined;
        if (stats) {
            const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
            const currentLevel = stats.playerLevel;
            const totalXP = stats.totalXP;
            const xpForCurrentLevel = xpThresholds[currentLevel - 1];
            const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
            const currentXP = totalXP - xpForCurrentLevel;
            const xpNeeded = xpForNextLevel - xpForCurrentLevel;

            playerInfo = {
                name: 'Player',
                level: currentLevel,
                currentXP: currentXP,
                xpForNextLevel: xpNeeded
            };
        }

        // Draw common UI (background, side menu, and player info)
        const bgImg = this.assets.getImage('background');
        const sideMenuImg = this.assets.getImage('sideMenu');
        const experienceBarImg = this.assets.getImage('experienceBar');
        const { expBarBounds } = this.renderer.drawCommonUI(bgImg, sideMenuImg, playerInfo, experienceBarImg);

        // Add click region for experience bar if it was drawn
        if (expBarBounds && playerInfo && stats) {
            this.clickManager.addRegion({
                id: 'player-xp-bar',
                x: expBarBounds.x,
                y: expBarBounds.y,
                width: expBarBounds.width,
                height: Math.max(expBarBounds.height, 20),
                callback: () => {
                    const title = `Level ${playerInfo.level}`;
                    const message = `Current XP: ${playerInfo.currentXP} / ${playerInfo.xpForNextLevel}\n\nTotal XP: ${stats.totalXP}`;
                    const clickCallback = (this.clickManager as any).buttonCallback;
                    if (clickCallback) {
                        clickCallback(`show-counter-info:${title}:${message}`);
                    }
                },
            });
        }

        // Draw CardsContainer.png
        const cardsContainerImg = this.assets.getImage('cardsContainer');
        if (cardsContainerImg) {
            this.renderer.ctx.drawImage(
                cardsContainerImg,
                cardsUIContainerPosition.x,
                cardsUIContainerPosition.y,
                cardsUIContainerDimensions.width,
                cardsUIContainerDimensions.height
            );
        }

        // Draw title and deck info on side menu
        const textPos = sideMenuPositions.textStartPosition;
        this.renderer.drawText('Cards', textPos.x, textPos.y, DIMENSIONS.fontSize.lg, COLORS.textPrimary, 'left');
        this.renderer.drawText(`${deckEmoji} ${deckSize}/30`, textPos.x, textPos.y + DIMENSIONS.fontSize.lg + 5, DIMENSIONS.fontSize.md, COLORS.textPrimary, 'left');

        if (cards.length === 0) {
            const centerX = cardsUIContainerPosition.x + cardsUIContainerDimensions.width / 2;
            const centerY = cardsUIContainerPosition.y + cardsUIContainerDimensions.height / 2;
            this.renderer.drawText('No cards in your collection yet.', centerX, centerY, DIMENSIONS.fontSize.xl, COLORS.textPrimary, 'center');
        } else {
            // Draw cards in a grid within the container (4 cards per row)
            const cardWidth = standardCardDimensions.width;
            const cardHeight = standardCardDimensions.height;
            const marginX = DIMENSIONS.spacing.xl; // Left/right margin inside container
            const marginY = DIMENSIONS.spacing.xl; // Top/bottom margin inside container
            const gapX = GAPS.cards; // Gap between cards horizontally
            const gapY = GAPS.cards; // Gap between cards vertically
            const startX = cardsUIContainerPosition.x + marginX;
            const startY = cardsUIContainerPosition.y + marginY;
            const spacingX = cardWidth + gapX;
            const spacingY = cardHeight + gapY;

            // Calculate visible card range based on scroll (show 2 rows at a time)
            const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
            const startIndex = this.scrollOffset * cardsPerPage;
            const endIndex = Math.min(startIndex + cardsPerPage, cards.length);
            const visibleCards = cards.slice(startIndex, endIndex);

            for (let i = 0; i < visibleCards.length; i++) {
                const card = visibleCards[i];
                const row = Math.floor(i / this.cardsPerRow);
                const col = i % this.cardsPerRow;
                const x = startX + col * spacingX;
                const y = startY + row * spacingY;

                // Load all card assets using the unified method
                const assets = await this.assets.loadCardAssets(card, 'default');

                // Check if card is in deck
                const isInDeck = deckCardIds.includes(card.id);

                // Use appropriate rendering method based on card type
                if (card.type === 'Bloom') {
                    const experienceBarImg = this.assets.getImage('experienceBar');
                    this.renderer.drawBeastCard(x, y, card, assets.mainImage, assets.baseCardImage, assets.affinityIcon, undefined, undefined, experienceBarImg);
                } else if (card.type === 'Magic') {
                    this.renderer.drawMagicCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
                } else if (card.type === 'Trap') {
                    this.renderer.drawTrapCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
                } else if (card.type === 'Buff') {
                    this.renderer.drawBuffCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
                } else if (card.type === 'Habitat') {
                    this.renderer.drawHabitatCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
                } else {
                    // Other card types (fallback)
                    this.renderer.drawInventoryCard(x, y, cardWidth, cardHeight, card, assets.mainImage, false);
                }

                // Draw deck indicator if in deck
                if (isInDeck) {
                    this.renderer.drawCardSelectionHighlight(x, y, cardWidth, cardHeight, COLORS.success, 4);
                }

                // Add clickable region
                this.clickManager.addRegion({
                    id: card.id,
                    x,
                    y,
                    width: cardWidth,
                    height: cardHeight,
                    callback: () => onCardSelect(card.id),
                });
            }

            // Calculate total pages needed
            const totalPages = Math.ceil(cards.length / cardsPerPage);

            // Get button images
            const standardButtonImg = this.assets.getImage('standardButton');

            // Button positions on side menu
            const buttonX = sideMenuPositions.buttonStartPosition.x;
            const buttonSpacing = GAPS.buttons;
            const upBtnY = sideMenuPositions.buttonStartPosition.y;
            const downBtnY = upBtnY + sideMenuButtonDimensions.height + buttonSpacing;

            if (standardButtonImg) {
                // Up arrow button (always visible, disabled if can't scroll up)
                const canScrollUp = this.scrollOffset > 0;
                if (canScrollUp) {
                    this.renderer.drawStandardButton('↑', buttonX, upBtnY, standardButtonImg);
                    this.clickManager.addRegion({
                        id: 'scroll-up',
                        x: buttonX,
                        y: upBtnY,
                        width: sideMenuButtonDimensions.width,
                        height: sideMenuButtonDimensions.height,
                        callback: () => {
                            this.playSfx('sfx/menuButtonSelect.wav');
                            this.scrollOffset = Math.max(0, this.scrollOffset - 1);
                            // Re-render with new offset
                            this.render(this.currentCards, this.currentDeckSize, this.currentDeckCardIds, this.currentOnCardSelect!, this.currentOnBack!, this.currentStats);
                        },
                    });
                } else {
                    this.renderer.drawSideMenuDisabledButton('↑', buttonX, upBtnY, standardButtonImg);
                }

                // Down arrow button (always visible, disabled if can't scroll down)
                const canScrollDown = this.scrollOffset < totalPages - 1;
                if (canScrollDown) {
                    this.renderer.drawStandardButton('↓', buttonX, downBtnY, standardButtonImg);
                    this.clickManager.addRegion({
                        id: 'scroll-down',
                        x: buttonX,
                        y: downBtnY,
                        width: sideMenuButtonDimensions.width,
                        height: sideMenuButtonDimensions.height,
                        callback: () => {
                            this.playSfx('sfx/menuButtonSelect.wav');
                            this.scrollOffset = Math.min(totalPages - 1, this.scrollOffset + 1);
                            // Re-render with new offset
                            this.render(this.currentCards, this.currentDeckSize, this.currentDeckCardIds, this.currentOnCardSelect!, this.currentOnBack!, this.currentStats);
                        },
                    });
                } else {
                    this.renderer.drawSideMenuDisabledButton('↓', buttonX, downBtnY, standardButtonImg);
                }
            }
        }

        // Get button image
        const standardButtonImg = this.assets.getImage('standardButton');

        // Back button at header position
        const backBtnX = sideMenuPositions.headerStartPosition.x;
        const backBtnY = sideMenuPositions.headerStartPosition.y;
        if (standardButtonImg) {
            this.renderer.drawStandardButton('Back', backBtnX, backBtnY, standardButtonImg);
            this.clickManager.addRegion({
                id: 'back',
                x: backBtnX,
                y: backBtnY,
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                callback: onBack,
            });
        }
    }
}
