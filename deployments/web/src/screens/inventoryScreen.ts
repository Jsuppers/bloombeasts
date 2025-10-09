/**
 * Inventory Screen Renderer
 */

import { CardDisplay } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { standardCardDimensions } from '../../../../shared/constants/dimensions';

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

        // Draw title
        this.renderer.drawText('Card Inventory', 50, 30, 36, '#fff');

        // Draw deck size on top right
        this.renderer.drawText(`Deck: ${deckSize}/30`, 1050, 30, 32, '#fff', 'left');

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

                // Load card image
                const cardImage = await this.assets.loadCardImage(card.name, card.affinity);

                // Check if card is in deck
                const isInDeck = deckCardIds.includes(card.id);

                this.renderer.drawInventoryCard(x, y, cardWidth, cardHeight, card, cardImage, isInDeck);

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

            // Button positions (Back, Up, Down from top to bottom)
            const btnX = 1149;
            const btnWidth = 120;
            const btnHeight = 50;
            const upBtnY = 191;
            const downBtnY = 251;

            // Up arrow button (always visible, disabled if can't scroll up)
            const canScrollUp = this.scrollOffset > 0;
            if (canScrollUp) {
                this.renderer.drawButton('↑', btnX, upBtnY, btnWidth, btnHeight);
                this.clickManager.addRegion({
                    id: 'scroll-up',
                    x: btnX,
                    y: upBtnY,
                    width: btnWidth,
                    height: btnHeight,
                    callback: () => {
                        this.scrollOffset = Math.max(0, this.scrollOffset - 1);
                        // Re-render with new offset
                        this.render(cards, deckSize, deckCardIds, onCardSelect, onBack);
                    },
                });
            } else {
                this.renderer.drawDisabledButton('↑', btnX, upBtnY, btnWidth, btnHeight);
            }

            // Down arrow button (always visible, disabled if can't scroll down)
            const canScrollDown = this.scrollOffset < totalPages - 1;
            if (canScrollDown) {
                this.renderer.drawButton('↓', btnX, downBtnY, btnWidth, btnHeight);
                this.clickManager.addRegion({
                    id: 'scroll-down',
                    x: btnX,
                    y: downBtnY,
                    width: btnWidth,
                    height: btnHeight,
                    callback: () => {
                        this.scrollOffset = Math.min(totalPages - 1, this.scrollOffset + 1);
                        // Re-render with new offset
                        this.render(cards, deckSize, deckCardIds, onCardSelect, onBack);
                    },
                });
            } else {
                this.renderer.drawDisabledButton('↓', btnX, downBtnY, btnWidth, btnHeight);
            }
        }

        // Back button at top (1. Back, 2. Up, 3. Down)
        const backBtnX = 1149;
        const backBtnY = 131;
        const backBtnWidth = 120;
        const backBtnHeight = 50;
        this.renderer.drawButton('← Back', backBtnX, backBtnY, backBtnWidth, backBtnHeight);
        this.clickManager.addRegion({
            id: 'back',
            x: backBtnX,
            y: backBtnY,
            width: backBtnWidth,
            height: backBtnHeight,
            callback: onBack,
        });
    }
}
