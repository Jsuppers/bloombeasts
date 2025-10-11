/**
 * Canvas Rendering Utilities
 * Provides drawing functions for buttons, text, cards, health bars, etc.
 */

import {
    gameDimensions,
    standardCardDimensions,
    standardCardBeastImageDimensions,
    magicCardDimensions,
    trapCardDimensions,
    sideMenuDimensions,
    sideMenuButtonDimensions,
} from '../../../../shared/constants/dimensions';
import { standardCardPositions, sideMenuPositions } from '../../../../shared/constants/positions';

// Font constants
const FONT_FAMILY = 'monospace';
const DEFAULT_TEXT_COLOR = '#fff';
const DISABLED_TEXT_COLOR = '#888';

export class CanvasRenderer {
    constructor(public ctx: CanvasRenderingContext2D) {}

    clear(): void {
        this.ctx.clearRect(0, 0, gameDimensions.panelWidth, gameDimensions.panelHeight);
    }

    drawImage(img: HTMLImageElement): void {
        this.ctx.drawImage(img, 0, 0, gameDimensions.panelWidth, gameDimensions.panelHeight);
    }

    /**
     * Helper: Set font with consistent family
     */
    private setFont(size: number, bold: boolean = false): void {
        this.ctx.font = `${bold ? 'bold ' : ''}${size}px ${FONT_FAMILY}`;
    }

    /**
     * Helper: Draw text with font setup
     */
    private drawTextWithFont(
        text: string,
        x: number,
        y: number,
        size: number,
        color: string = DEFAULT_TEXT_COLOR,
        align: CanvasTextAlign = 'left',
        baseline: CanvasTextBaseline = 'top',
        bold: boolean = false
    ): void {
        this.ctx.fillStyle = color;
        this.setFont(size, bold);
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.fillText(text, x, y);
    }

    drawButton(text: string, x: number, y: number, width: number, height: number): void {
        // Disable image smoothing for pixelated look
        this.ctx.imageSmoothingEnabled = false;

        // Draw outer shadow/border (dark)
        this.ctx.fillStyle = '#2c5f8d';
        this.ctx.fillRect(x + 4, y + 4, width, height);

        // Draw button background
        this.ctx.fillStyle = '#3a7bb5';
        this.ctx.fillRect(x, y, width, height);

        // Draw inner highlight (top-left for 3D effect)
        this.ctx.fillStyle = '#5fa3d0';
        this.ctx.fillRect(x + 4, y + 4, width - 8, height - 8);

        // Draw main button face
        this.ctx.fillStyle = '#4a8ec2';
        this.ctx.fillRect(x + 6, y + 6, width - 12, height - 12);

        // Draw thick outer border
        this.ctx.strokeStyle = '#1a3a52';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(x, y, width, height);

        // Draw inner border for more depth
        this.ctx.strokeStyle = '#7cbce8';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + 6, y + 6, width - 12, height - 12);

        // Draw button text with pixelated style
        this.ctx.fillStyle = '#e94560';
        this.ctx.font = 'bold 24px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        // Text shadow for depth
        this.ctx.fillStyle = '#1a3a52';
        this.ctx.fillText(text, x + width / 2 + 2, y + height / 2 + 2);
        // Main text
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(text, x + width / 2, y + height / 2);

        // Re-enable image smoothing
        this.ctx.imageSmoothingEnabled = true;
    }

    drawDisabledButton(text: string, x: number, y: number, width: number, height: number): void {
        // Disable image smoothing for pixelated look
        this.ctx.imageSmoothingEnabled = false;

        // Draw outer shadow/border (dark) - grayed out
        this.ctx.fillStyle = '#404040';
        this.ctx.fillRect(x + 4, y + 4, width, height);

        // Draw button background - grayed out
        this.ctx.fillStyle = '#555555';
        this.ctx.fillRect(x, y, width, height);

        // Draw inner highlight (top-left for 3D effect) - grayed out
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(x + 4, y + 4, width - 8, height - 8);

        // Draw main button face - grayed out
        this.ctx.fillStyle = '#5a5a5a';
        this.ctx.fillRect(x + 6, y + 6, width - 12, height - 12);

        // Draw thick outer border
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(x, y, width, height);

        // Draw inner border for more depth
        this.ctx.strokeStyle = '#777777';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + 6, y + 6, width - 12, height - 12);

        // Draw button text with pixelated style - grayed out
        this.ctx.fillStyle = '#e94560';
        this.ctx.font = 'bold 24px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        // Text shadow for depth
        this.ctx.fillStyle = '#333333';
        this.ctx.fillText(text, x + width / 2 + 2, y + height / 2 + 2);
        // Main text - grayed out
        this.ctx.fillStyle = '#888888';
        this.ctx.fillText(text, x + width / 2, y + height / 2);

        // Re-enable image smoothing
        this.ctx.imageSmoothingEnabled = true;
    }

    drawGreenButton(text: string, x: number, y: number, width: number, height: number): void {
        // Disable image smoothing for pixelated look
        this.ctx.imageSmoothingEnabled = false;

        // Draw outer shadow/border (dark green)
        this.ctx.fillStyle = '#2d5016';
        this.ctx.fillRect(x + 4, y + 4, width, height);

        // Draw button background (green)
        this.ctx.fillStyle = '#3d7524';
        this.ctx.fillRect(x, y, width, height);

        // Draw inner highlight (light green)
        this.ctx.fillStyle = '#5fa349';
        this.ctx.fillRect(x + 4, y + 4, width - 8, height - 8);

        // Draw main button face (medium green)
        this.ctx.fillStyle = '#4a8c2a';
        this.ctx.fillRect(x + 6, y + 6, width - 12, height - 12);

        // Draw thick outer border
        this.ctx.strokeStyle = '#1a3a10';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(x, y, width, height);

        // Draw inner border for more depth
        this.ctx.strokeStyle = '#7bc850';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + 6, y + 6, width - 12, height - 12);

        // Draw button text with pixelated style
        this.ctx.font = 'bold 24px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        // Text shadow for depth
        this.ctx.fillStyle = '#1a3a10';
        this.ctx.fillText(text, x + width / 2 + 2, y + height / 2 + 2);
        // Main text
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(text, x + width / 2, y + height / 2);

        // Re-enable image smoothing
        this.ctx.imageSmoothingEnabled = true;
    }

    drawText(
        text: string,
        x: number,
        y: number,
        size: number = 24,
        color: string = DEFAULT_TEXT_COLOR,
        align: CanvasTextAlign = 'left'
    ): void {
        this.drawTextWithFont(text, x, y, size, color, align, 'top', false);
    }

    drawHealthBar(x: number, y: number, current: number, max: number, label: string): void {
        const width = 200;
        const height = 20;

        // Label
        this.drawTextWithFont(label, x, y - 5, 16, DEFAULT_TEXT_COLOR, 'left', 'top', true);

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x, y + 20, width, height);

        // Health fill
        const percentage = Math.max(0, current / max);
        const fillWidth = width * percentage;

        if (percentage > 0.6) {
            this.ctx.fillStyle = '#43e97b';
        } else if (percentage > 0.3) {
            this.ctx.fillStyle = '#ffd700';
        } else {
            this.ctx.fillStyle = '#ff6b6b';
        }
        this.ctx.fillRect(x, y + 20, fillWidth, height);

        // Border
        this.ctx.strokeStyle = DEFAULT_TEXT_COLOR;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y + 20, width, height);

        // Text
        this.drawTextWithFont(`${current}/${max}`, x + width / 2, y + 33, 14, DEFAULT_TEXT_COLOR, 'center', 'top', false);
    }

    drawCard(x: number, y: number, width: number, height: number, affinity: string): void {
        // Card background
        this.ctx.fillStyle = this.getAffinityColor(affinity);
        this.ctx.fillRect(x, y, width, height);

        // Border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawBeastCard(x: number, y: number, beast: any, beastImage?: HTMLImageElement | null, baseCardImage?: HTMLImageElement | null, affinityImage?: HTMLImageElement | null): void {
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;
        const beastImageWidth = standardCardBeastImageDimensions.width;
        const beastImageHeight = standardCardBeastImageDimensions.height;
        const positions = standardCardPositions;

        // Layered rendering approach:
        // 1. Draw beast artwork in the beast image area
        // 2. Draw base card frame on top
        // 3. Draw affinity icon
        // 4. Draw text overlay

        // Step 1: Draw beast image as background artwork
        if (beastImage) {
            this.ctx.drawImage(
                beastImage,
                x + positions.beastImage.x,
                y + positions.beastImage.y,
                beastImageWidth,
                beastImageHeight
            );
        }

        // Step 2: Draw base card frame on top
        if (baseCardImage) {
            this.ctx.drawImage(baseCardImage, x, y, cardWidth, cardHeight);
        } else if (!beastImage) {
            // Fallback: draw colored card background only if no beast image
            this.drawCard(x, y, cardWidth, cardHeight, beast.affinity || '');
        }

        // Step 3: Draw affinity icon if available
        if (affinityImage) {
            this.ctx.drawImage(
                affinityImage,
                x + positions.affinity.x,
                y + positions.affinity.y,
                30, // Affinity icon width
                30  // Affinity icon height
            );
        }

        // Step 4: Draw text overlay for dynamic values
        this.drawCardTextOverlay(x, y, beast);
    }

    drawMissionCard(
        x: number,
        y: number,
        width: number,
        height: number,
        mission: any
    ): void {
        // Mission card background
        if (mission.isAvailable) {
            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
        } else {
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        }
        this.ctx.fillRect(x, y, width, height);

        // Border
        this.ctx.strokeStyle = mission.isCompleted ? '#43e97b' : DEFAULT_TEXT_COLOR;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Mission info
        this.drawTextWithFont(mission.name, x + 15, y + 15, 20, DEFAULT_TEXT_COLOR, 'left', 'top', true);
        this.drawTextWithFont(`Level ${mission.level} - ${mission.difficulty}`, x + 15, y + 45, 14, DEFAULT_TEXT_COLOR, 'left', 'top', false);
        this.drawTextWithFont(mission.description.substring(0, 40) + '...', x + 15, y + 70, 14, DEFAULT_TEXT_COLOR, 'left', 'top', false);

        if (mission.isCompleted) {
            this.drawTextWithFont('✅ Completed', x + 15, y + 95, 14, DEFAULT_TEXT_COLOR, 'left', 'top', false);
        }
    }

    drawInventoryCard(
        x: number,
        y: number,
        width: number,
        height: number,
        card: any,
        cardImage?: HTMLImageElement | null,
        isInDeck: boolean = false
    ): void {
        if (cardImage) {
            // Draw the card image
            this.ctx.drawImage(cardImage, x, y, width, height);
        } else {
            // Fallback: draw colored card background
            this.drawCard(x, y, width, height, card.affinity || '');
        }

        // Draw border if card is in deck
        if (isInDeck) {
            this.ctx.strokeStyle = '#43e97b'; // Green border for cards in deck
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(x, y, width, height);
        }

        // Draw text overlay
        this.drawCardTextOverlay(x, y, card);
    }

    drawObjectives(objectives: any[], startX: number, startY: number): void {
        if (!objectives || objectives.length === 0) return;

        this.drawTextWithFont('Objectives:', startX, startY, 18, DEFAULT_TEXT_COLOR, 'left', 'top', true);

        objectives.forEach((obj, index) => {
            const y = startY + 30 + index * 25;
            const icon = obj.isComplete ? '✅' : '⬜';
            this.drawTextWithFont(`${icon} ${obj.description}`, startX, y, 14, DEFAULT_TEXT_COLOR, 'left', 'top', false);

            if (obj.target) {
                this.drawTextWithFont(`(${obj.progress}/${obj.target})`, startX + 200, y, 14, DEFAULT_TEXT_COLOR, 'left', 'top', false);
            }
        });
    }

    /**
     * Draw Magic card with layered rendering (for inventory/hand)
     */
    drawMagicCard(x: number, y: number, card: any, magicImage?: HTMLImageElement | null, templateImage?: HTMLImageElement | null, baseCardImage?: HTMLImageElement | null): void {
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;

        // Layered rendering:
        // 1. Draw magic artwork (185x185)
        // 2. Draw BaseCard frame
        // 3. Draw MagicCard template overlay
        // 4. Draw text overlay

        // Step 1: Draw magic image if available
        if (magicImage) {
            // Magic images are 185x185, positioned at offset (12, 13)
            const magicImageSize = 185;
            const imageX = x + 12;
            const imageY = y + 13;
            this.ctx.drawImage(magicImage, imageX, imageY, magicImageSize, magicImageSize);
        }

        // Step 2: Draw base card frame
        if (baseCardImage) {
            this.ctx.drawImage(baseCardImage, x, y, cardWidth, cardHeight);
        }

        // Step 3: Draw MagicCard template overlay
        if (templateImage) {
            this.ctx.drawImage(templateImage, x, y, cardWidth, cardHeight);
        }

        // Step 4: Draw text overlay
        this.drawCardTextOverlay(x, y, card);
    }

    /**
     * Draw Magic card for playboard (smaller size with centered image)
     */
    drawMagicCardPlayboard(x: number, y: number, width: number, height: number, card: any, magicImage?: HTMLImageElement | null, playboardTemplate?: HTMLImageElement | null): void {
        // Draw playboard template background
        if (playboardTemplate) {
            this.ctx.drawImage(playboardTemplate, x, y, width, height);
        }

        // Draw magic image centered and resized to 100x100
        if (magicImage) {
            const imageSize = 100;
            const imageX = x + (width - imageSize) / 2;
            const imageY = y + (height - imageSize) / 2;
            this.ctx.drawImage(magicImage, imageX, imageY, imageSize, imageSize);
        }

        // Minimal text overlay for playboard
        // Just show cost
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${card.cost || 0}`, x + 15, y + 20);
    }

    /**
     * Draw Trap card with layered rendering (for inventory/hand)
     */
    drawTrapCard(x: number, y: number, card: any, trapImage?: HTMLImageElement | null, templateImage?: HTMLImageElement | null, baseCardImage?: HTMLImageElement | null): void {
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;

        // Layered rendering:
        // 1. Draw trap artwork (185x185)
        // 2. Draw BaseCard frame
        // 3. Draw TrapCard template overlay
        // 4. Draw text overlay

        // Step 1: Draw trap image if available
        if (trapImage) {
            // Trap images are 185x185, positioned at offset (12, 13)
            const trapImageSize = 185;
            const imageX = x + 12;
            const imageY = y + 13;
            this.ctx.drawImage(trapImage, imageX, imageY, trapImageSize, trapImageSize);
        }

        // Step 2: Draw base card frame
        if (baseCardImage) {
            this.ctx.drawImage(baseCardImage, x, y, cardWidth, cardHeight);
        }

        // Step 3: Draw TrapCard template overlay
        if (templateImage) {
            this.ctx.drawImage(templateImage, x, y, cardWidth, cardHeight);
        }

        // Step 4: Draw text overlay
        this.drawCardTextOverlay(x, y, card);
    }

    /**
     * Draw Trap card for playboard (face-down)
     */
    drawTrapCardPlayboard(x: number, y: number, width: number, height: number, trapTemplate?: HTMLImageElement | null): void {
        if (trapTemplate) {
            // Draw the TrapCardPlayboard template (face-down trap card)
            this.ctx.drawImage(trapTemplate, x, y, width, height);
        } else {
            // Fallback: Draw purple card back
            this.ctx.fillStyle = '#4a148c';
            this.ctx.fillRect(x, y, width, height);
            this.ctx.strokeStyle = '#7b1fa2';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, width, height);
            this.drawText('TRAP', x + width / 2, y + height / 2 - 5, 14, '#fff', 'center');
        }
    }

    /**
     * Helper: Draw card text overlay (used by both beast and inventory cards)
     */
    private drawCardTextOverlay(x: number, y: number, card: any): void {
        const positions = standardCardPositions;
        this.ctx.fillStyle = DEFAULT_TEXT_COLOR;

        // Cost (top left)
        this.drawTextWithFont(
            `${card.cost || 0}`,
            x + positions.cost.x,
            y + positions.cost.y,
            positions.cost.size,
            DEFAULT_TEXT_COLOR,
            positions.cost.textAlign || 'center',
            positions.cost.textBaseline || 'alphabetic',
            true
        );

        // Only show level/experience for Bloom beasts
        if (card.type === 'Bloom' || card.level !== undefined) {
            // Level and Experience
            const level = card.level || 1;
            const currentExp = card.experience || 0;
            const expNeeded = card.experienceRequired || (level * 100); // Default exp formula if not provided

            // Draw "Level X" text
            this.drawTextWithFont(
                `Level ${level}`,
                x + positions.level.x,
                y + positions.level.y,
                positions.level.size,
                DEFAULT_TEXT_COLOR,
                positions.level.textAlign || 'center',
                positions.level.textBaseline || 'alphabetic',
                false
            );

            // Draw experience below level (smaller text)
            this.drawTextWithFont(
                `${currentExp}/${expNeeded}`,
                x + positions.level.x,
                y + positions.level.y + 14,
                positions.level.size - 2,
                '#aaa',
                positions.level.textAlign || 'center',
                positions.level.textBaseline || 'alphabetic',
                false
            );
        } else if (card.type) {
            // For non-Bloom cards, show the card type
            this.drawTextWithFont(
                card.type,
                x + positions.level.x,
                y + positions.level.y,
                positions.level.size + 2,
                DEFAULT_TEXT_COLOR,
                positions.level.textAlign || 'center',
                positions.level.textBaseline || 'alphabetic',
                true
            );
        }

        // Name (bottom left area) - truncate if too long
        this.setFont(positions.name.size, true);
        this.ctx.textAlign = positions.name.textAlign || 'left';
        this.ctx.textBaseline = positions.name.textBaseline || 'alphabetic';
        const maxNameWidth = 115;
        const truncatedName = this.truncateText(`${card.name}`, maxNameWidth);
        this.ctx.fillText(truncatedName, x + positions.name.x, y + positions.name.y);

        // Ability - show full text with wrapping
        const hasAbility = card.ability;
        if (hasAbility) {
            const abilityText = typeof card.ability === 'object' ?
                card.ability.description || card.ability.name || '' :
                card.ability.toString();

            if (abilityText) {
                this.drawWrappedText(
                    abilityText,
                    x + positions.ability.x,
                    y + positions.ability.y,
                    180, // Max width for text wrapping
                    positions.ability.size,
                    DEFAULT_TEXT_COLOR,
                    positions.ability.textAlign || 'left'
                );
            }
        }

        // Only show attack/health for Bloom beasts
        if (card.type === 'Bloom' || card.baseAttack !== undefined || card.currentAttack !== undefined) {
            // Attack (bottom left)
            const attack = card.currentAttack || card.baseAttack || card.attack || 0;
            this.drawTextWithFont(
                `${attack}`,
                x + positions.attack.x,
                y + positions.attack.y,
                positions.attack.size,
                DEFAULT_TEXT_COLOR,
                positions.attack.textAlign || 'center',
                positions.attack.textBaseline || 'alphabetic',
                true
            );

            // Health (bottom right)
            const health = card.currentHealth || card.baseHealth || card.health || 0;
            this.drawTextWithFont(
                `${health}`,
                x + positions.health.x,
                y + positions.health.y,
                positions.health.size,
                DEFAULT_TEXT_COLOR,
                positions.health.textAlign || 'center',
                positions.health.textBaseline || 'alphabetic',
                true
            );
        }
    }

    /**
     * Draw text with word wrapping
     */
    private drawWrappedText(
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        fontSize: number,
        color: string = DEFAULT_TEXT_COLOR,
        align: CanvasTextAlign = 'left'
    ): void {
        this.ctx.fillStyle = color;
        this.setFont(fontSize, false);
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'top';

        const words = text.split(' ');
        let line = '';
        let currentY = y;
        const lineHeight = fontSize + 2; // Add some spacing between lines

        for (let i = 0; i < words.length; i++) {
            const testLine = line + (line ? ' ' : '') + words[i];
            const metrics = this.ctx.measureText(testLine);

            if (metrics.width > maxWidth && line) {
                // Draw current line and start a new one
                this.ctx.fillText(line, x, currentY);
                line = words[i];
                currentY += lineHeight;

                // Stop if we're going too far down the card
                if (currentY > y + 50) break;
            } else {
                line = testLine;
            }
        }

        // Draw the last line if there's space
        if (line && currentY <= y + 50) {
            this.ctx.fillText(line, x, currentY);
        }
    }

    /**
     * Truncate text with ellipsis if it exceeds max width
     */
    private truncateText(text: string, maxWidth: number): string {
        const textWidth = this.ctx.measureText(text).width;

        if (textWidth <= maxWidth) {
            return text;
        }

        // Binary search for the right length
        let left = 0;
        let right = text.length;
        let result = text;

        while (left < right) {
            const mid = Math.floor((left + right + 1) / 2);
            const truncated = text.substring(0, mid) + '...';
            const width = this.ctx.measureText(truncated).width;

            if (width <= maxWidth) {
                result = truncated;
                left = mid;
            } else {
                right = mid - 1;
            }
        }

        return result;
    }

    private getAffinityColor(affinity: string): string {
        const colors: Record<string, string> = {
            Forest: 'rgba(76, 175, 80, 0.7)',
            Fire: 'rgba(244, 67, 54, 0.7)',
            Water: 'rgba(33, 150, 243, 0.7)',
            Sky: 'rgba(156, 39, 176, 0.7)',
        };
        return colors[affinity] || 'rgba(158, 158, 158, 0.7)';
    }

    /**
     * Draw the side menu background
     */
    drawSideMenuBackground(sideMenuImg: HTMLImageElement): void {
        this.ctx.drawImage(
            sideMenuImg,
            sideMenuPositions.x,
            sideMenuPositions.y,
            sideMenuDimensions.width,
            sideMenuDimensions.height
        );
    }

    /**
     * Helper: Draw button text centered on side menu button
     */
    private drawSideMenuButtonText(text: string, x: number, y: number, color: string = DEFAULT_TEXT_COLOR): void {
        this.drawTextWithFont(
            text,
            x + sideMenuButtonDimensions.width / 2,
            y + sideMenuButtonDimensions.height / 2,
            18,
            color,
            'center',
            'middle',
            true
        );
    }

    /**
     * Draw a green button on the side menu (for active End Turn button)
     */
    drawSideMenuGreenButton(text: string, x: number, y: number, buttonImg: HTMLImageElement): void {
        this.ctx.drawImage(buttonImg, x, y, sideMenuButtonDimensions.width, sideMenuButtonDimensions.height);
        this.drawSideMenuButtonText(text, x, y);
    }

    /**
     * Draw a standard button on the side menu
     */
    drawSideMenuStandardButton(text: string, x: number, y: number, buttonImg: HTMLImageElement): void {
        this.ctx.drawImage(buttonImg, x, y, sideMenuButtonDimensions.width, sideMenuButtonDimensions.height);
        this.drawSideMenuButtonText(text, x, y);
    }

    /**
     * Draw a disabled button on the side menu
     */
    drawSideMenuDisabledButton(text: string, x: number, y: number, buttonImg: HTMLImageElement): void {
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(buttonImg, x, y, sideMenuButtonDimensions.width, sideMenuButtonDimensions.height);
        this.ctx.globalAlpha = 1.0;
        this.drawSideMenuButtonText(text, x, y, DISABLED_TEXT_COLOR);
    }
}
