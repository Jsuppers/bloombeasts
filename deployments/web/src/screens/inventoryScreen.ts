/**
 * Inventory Screen Renderer
 */

import { CardDisplay } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { standardCardDimensions, sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { uiSafeZoneButtons, uiSafeZoneText, sideMenuPositions } from '../../../../shared/constants/positions';
import { deckEmoji } from '../../../../shared/constants/emojis';

export class InventoryScreen {
    private scrollOffset: number = 0;
    private cardsPerRow: number = 5;
    private rowsPerPage: number = 2; // Show 2 rows at a time

    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    async render(
        cards: CardDisplay[],
        deckSize: number,
        deckCardIds: string[],
        onCardSelect: (cardId: string) => void,
        onBack: () => void
    ): Promise<void> {
        this.clickManager.clearRegions();
        this.renderer.clear();

        // Draw background
        const bgImg = this.assets.getImage('background');
        if (bgImg) {
            this.renderer.drawImage(bgImg);
        }

        // Draw side menu background
        const sideMenuImg = this.assets.getImage('sideMenu');
        if (sideMenuImg) {
            this.renderer.drawSideMenuBackground(sideMenuImg);
        }

        // Draw title and deck info on side menu
        const textPos = sideMenuPositions.textStartPosition;
        this.renderer.drawText('Inventory', textPos.x, textPos.y, 20, '#fff', 'left');
        this.renderer.drawText(`${deckEmoji} ${deckSize}/30`, textPos.x, textPos.y + 25, 18, '#fff', 'left');

        if (cards.length === 0) {
            this.renderer.drawText('No cards in your collection yet.', 400, 350, 24, '#fff', 'center');
        } else {
            // Draw cards in a grid using standardCardDimensions
            const cardWidth = standardCardDimensions.width;
            const cardHeight = standardCardDimensions.height;
            const startX = 40;
            const startY = 100;
            const spacingX = cardWidth + 10;  // 10px gap between cards
            const spacingY = cardHeight + 10;

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

                // Load card images separately for layered rendering
                const beastImage = card.type === 'Bloom' ? await this.assets.loadBeastImage(card.name, card.affinity) : null;
                const baseCardImage = await this.assets.loadBaseCardImage(card.affinity);
                const affinityIcon = card.affinity ? await this.assets.loadAffinityIcon(card.affinity) : null;

                // For Magic/Trap cards, load the specific image and template
                const magicCardTemplate = card.type === 'Magic' ? await this.assets.loadMagicCardTemplate() : null;
                const trapCardTemplate = card.type === 'Trap' ? await this.assets.loadTrapCardTemplate() : null;
                const cardImage = card.type !== 'Bloom' ? await this.assets.loadCardImage(card.name, card.affinity, card.type) : null;

                // Check if card is in deck
                const isInDeck = deckCardIds.includes(card.id);

                // Use appropriate rendering method based on card type
                if (card.type === 'Bloom') {
                    this.renderer.drawBeastCard(x, y, card, beastImage, baseCardImage, affinityIcon);
                } else if (card.type === 'Magic') {
                    this.renderer.drawMagicCard(x, y, card, cardImage, magicCardTemplate, baseCardImage);
                } else if (card.type === 'Trap') {
                    this.renderer.drawTrapCard(x, y, card, cardImage, trapCardTemplate, baseCardImage);
                } else {
                    // Habitat or other card types
                    this.renderer.drawInventoryCard(x, y, cardWidth, cardHeight, card, cardImage, false);
                }

                // Draw deck indicator if in deck
                if (isInDeck) {
                    this.renderer.ctx.strokeStyle = '#43e97b'; // Green border for cards in deck
                    this.renderer.ctx.lineWidth = 4;
                    this.renderer.ctx.strokeRect(x, y, cardWidth, cardHeight);
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
            const standardButtonImg = this.assets.getImage('sideMenuStandardButton');

            // Button positions on side menu
            const buttonX = sideMenuPositions.buttonStartPosition.x;
            const buttonSpacing = 10;
            const upBtnY = sideMenuPositions.buttonStartPosition.y;
            const downBtnY = upBtnY + sideMenuButtonDimensions.height + buttonSpacing;

            if (standardButtonImg) {
                // Up arrow button (always visible, disabled if can't scroll up)
                const canScrollUp = this.scrollOffset > 0;
                if (canScrollUp) {
                    this.renderer.drawSideMenuStandardButton('↑', buttonX, upBtnY, standardButtonImg);
                    this.clickManager.addRegion({
                        id: 'scroll-up',
                        x: buttonX,
                        y: upBtnY,
                        width: sideMenuButtonDimensions.width,
                        height: sideMenuButtonDimensions.height,
                        callback: () => {
                            this.scrollOffset = Math.max(0, this.scrollOffset - 1);
                            // Re-render with new offset
                            this.render(cards, deckSize, deckCardIds, onCardSelect, onBack);
                        },
                    });
                } else {
                    this.renderer.drawSideMenuDisabledButton('↑', buttonX, upBtnY, standardButtonImg);
                }

                // Down arrow button (always visible, disabled if can't scroll down)
                const canScrollDown = this.scrollOffset < totalPages - 1;
                if (canScrollDown) {
                    this.renderer.drawSideMenuStandardButton('↓', buttonX, downBtnY, standardButtonImg);
                    this.clickManager.addRegion({
                        id: 'scroll-down',
                        x: buttonX,
                        y: downBtnY,
                        width: sideMenuButtonDimensions.width,
                        height: sideMenuButtonDimensions.height,
                        callback: () => {
                            this.scrollOffset = Math.min(totalPages - 1, this.scrollOffset + 1);
                            // Re-render with new offset
                            this.render(cards, deckSize, deckCardIds, onCardSelect, onBack);
                        },
                    });
                } else {
                    this.renderer.drawSideMenuDisabledButton('↓', buttonX, downBtnY, standardButtonImg);
                }
            }
        }

        // Get button image
        const standardButtonImg = this.assets.getImage('sideMenuStandardButton');

        // Back button at header position
        const backBtnX = sideMenuPositions.headerStartPosition.x;
        const backBtnY = sideMenuPositions.headerStartPosition.y;
        if (standardButtonImg) {
            this.renderer.drawSideMenuStandardButton('Back', backBtnX, backBtnY, standardButtonImg);
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
