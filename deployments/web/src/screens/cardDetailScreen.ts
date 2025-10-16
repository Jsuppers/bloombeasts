/**
 * Card Detail Screen Renderer
 */

import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { CardDetailDisplay, MenuStats } from '../../../../bloombeasts/gameManager';
import { gameDimensions, sideMenuButtonDimensions, standardCardDimensions } from '../../../../shared/constants/dimensions';
import { sideMenuPositions } from '../../../../shared/constants/positions';
import { DIMENSIONS, GAPS } from '../../../../shared/styles/dimensions';
import { COLORS } from '../../../../shared/styles/colors';

export class CardDetailScreen {
    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    async render(
        cardDetail: CardDetailDisplay,
        stats: MenuStats,
        onButtonClick: (buttonId: string) => void
    ): Promise<void> {
        // Don't clear - we want to render on top of existing screen

        // Draw semi-transparent black backdrop
        this.renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.renderer.ctx.fillRect(0, 0, gameDimensions.panelWidth, gameDimensions.panelHeight);

        // Calculate card position (center of screen)
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;
        const cardX = gameDimensions.panelWidth / 2 - cardWidth / 2;
        const cardY = gameDimensions.panelHeight / 2 - cardHeight / 2;

        // Load all card assets using the unified method (same as inventory)
        const assets = await this.assets.loadCardAssets(cardDetail.card, 'default');

        // Render the card using the same method as inventory based on card type
        if (cardDetail.card.type === 'Bloom') {
            const experienceBarImg = this.assets.getImage('experienceBar');
            this.renderer.drawBeastCard(cardX, cardY, cardDetail.card, assets.mainImage, assets.baseCardImage, assets.affinityIcon, undefined, undefined, experienceBarImg);
        } else if (cardDetail.card.type === 'Magic') {
            this.renderer.drawMagicCard(cardX, cardY, cardDetail.card, assets.mainImage, assets.templateImage, assets.baseCardImage);
        } else if (cardDetail.card.type === 'Trap') {
            this.renderer.drawTrapCard(cardX, cardY, cardDetail.card, assets.mainImage, assets.templateImage, assets.baseCardImage);
        } else if (cardDetail.card.type === 'Buff') {
            this.renderer.drawBuffCard(cardX, cardY, cardDetail.card, assets.mainImage, assets.templateImage, assets.baseCardImage);
        } else if (cardDetail.card.type === 'Habitat') {
            this.renderer.drawHabitatCard(cardX, cardY, cardDetail.card, assets.mainImage, assets.templateImage, assets.baseCardImage);
        } else {
            // Other card types (fallback)
            this.renderer.drawInventoryCard(cardX, cardY, cardWidth, cardHeight, cardDetail.card, assets.mainImage, false);
        }

        // Draw counters if present
        if (cardDetail.card.counters && cardDetail.card.counters.length > 0) {
            const counterY = cardY + cardHeight + 10; // 10px below card
            const counterX = cardX;
            const counterSpacing = 5;
            let currentX = counterX;

            // Draw each counter
            cardDetail.card.counters.forEach((counter: { type: string; amount: number }) => {
                if (counter.amount > 0) {
                    // Draw counter background
                    this.renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    this.renderer.ctx.fillRect(currentX, counterY, 60, 20);

                    // Draw counter border
                    this.renderer.ctx.strokeStyle = COLORS.textPrimary;
                    this.renderer.ctx.lineWidth = 1;
                    this.renderer.ctx.strokeRect(currentX, counterY, 60, 20);

                    // Draw counter text
                    const counterText = `${counter.type}: ${counter.amount}`;
                    this.renderer.drawText(counterText, currentX + 30, counterY + 10, 10, COLORS.textPrimary, 'center');

                    currentX += 60 + counterSpacing;
                }
            });
        }

        // Setup click regions
        this.clickManager.clearRegions();

        // Add click region for backdrop FIRST (so buttons are checked before backdrop in reverse order)
        this.clickManager.addRegion({
            id: 'backdrop',
            x: 0,
            y: 0,
            width: gameDimensions.panelWidth,
            height: gameDimensions.panelHeight,
            callback: () => {
                // Close the popup when clicking outside
                onButtonClick('btn-card-close');
            },
        });

        // Draw buttons to the right of the card
        const buttonWidth = sideMenuButtonDimensions.width;
        const buttonHeight = sideMenuButtonDimensions.height;
        const buttonSpacing = GAPS.buttons;
        const buttonX = cardX + cardWidth + DIMENSIONS.spacing.xl; // spacing to the right of card
        let buttonY = cardY;

        // Get button images
        const greenButtonImg = this.assets.getImage('greenButton');
        const redButtonImg = this.assets.getImage('redButton');
        const standardButtonImg = this.assets.getImage('standardButton');

        // Draw each button and add click regions
        cardDetail.buttons.forEach((buttonText, index) => {
            const y = buttonY + index * (buttonHeight + buttonSpacing);

            // Choose button image based on button text
            let buttonImg = standardButtonImg;
            if (buttonText === 'Add' && greenButtonImg) {
                buttonImg = greenButtonImg;
            } else if (buttonText === 'Remove' && redButtonImg) {
                buttonImg = redButtonImg;
            }

            // Draw button using appropriate button image
            if (buttonImg) {
                this.renderer.drawStandardButton(buttonText, buttonX, y, buttonImg);
            }

            // Add click region (these are added AFTER backdrop, so they'll be checked FIRST)
            this.clickManager.addRegion({
                id: `card-action-${buttonText}`,
                x: buttonX,
                y,
                width: buttonWidth,
                height: buttonHeight,
                callback: () => onButtonClick(`btn-card-${buttonText.toLowerCase().replace(/ /g, '-')}`),
            });
        });
    }
}
