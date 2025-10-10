/**
 * Canvas Rendering Utilities
 * Provides drawing functions for buttons, text, cards, health bars, etc.
 */

import {
    gameDimensions,
    standardCardDimensions,
    magicCardDimensions,
    trapCardDimensions,
    sideMenuDimensions,
    sideMenuButtonDimensions,
} from '../../../../shared/constants/dimensions';
import { standardCardTextPositions, sideMenuPositions } from '../../../../shared/constants/positions';

export class CanvasRenderer {
    constructor(public ctx: CanvasRenderingContext2D) {}

    clear(): void {
        this.ctx.clearRect(0, 0, gameDimensions.panelWidth, gameDimensions.panelHeight);
    }

    drawImage(img: HTMLImageElement): void {
        this.ctx.drawImage(img, 0, 0, gameDimensions.panelWidth, gameDimensions.panelHeight);
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
        color: string = '#fff',
        align: CanvasTextAlign = 'left'
    ): void {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px Arial`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(text, x, y);
    }

    drawHealthBar(x: number, y: number, current: number, max: number, label: string): void {
        const width = 200;
        const height = 20;

        // Label
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(label, x, y - 5);

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
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y + 20, width, height);

        // Text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${current}/${max}`, x + width / 2, y + 33);
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

    drawBeastCard(x: number, y: number, beast: any, cardImage?: HTMLImageElement | null): void {
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;

        if (cardImage) {
            // Draw the card image
            this.ctx.drawImage(cardImage, x, y, cardWidth, cardHeight);
        } else {
            // Fallback: draw colored card background
            this.drawCard(x, y, cardWidth, cardHeight, beast.affinity || '');
        }

        // Draw text overlay using standardCardTextPositions
        const positions = standardCardTextPositions;

        // Setup common fill style
        this.ctx.fillStyle = '#fff';

        // Cost (top left)
        this.ctx.font = `bold ${positions.cost.size}px Arial`;
        this.ctx.textAlign = positions.cost.textAlign || 'center';
        this.ctx.textBaseline = positions.cost.textBaseline || 'alphabetic';
        this.ctx.fillText(`${beast.cost || 0}`, x + positions.cost.x, y + positions.cost.y);

        // Level (top middle area)
        this.ctx.font = `bold ${positions.level.size}px Arial`;
        this.ctx.textAlign = positions.level.textAlign || 'center';
        this.ctx.textBaseline = positions.level.textBaseline || 'alphabetic';
        this.ctx.fillText(`${beast.level || 1}`, x + positions.level.x, y + positions.level.y);

        // Name (bottom left area) - truncate if too long
        this.ctx.font = `bold ${positions.name.size}px Arial`;
        this.ctx.textAlign = positions.name.textAlign || 'left';
        this.ctx.textBaseline = positions.name.textBaseline || 'alphabetic';
        const maxNameWidth = 115; // Max width to avoid overlapping with special indicator
        const truncatedName = this.truncateText(`${beast.name}`, maxNameWidth);
        this.ctx.fillText(truncatedName, x + positions.name.x, y + positions.name.y);

        // Special (bottom right area) - show "?" if card has abilities
        this.ctx.font = `bold ${positions.special.size}px Arial`;
        this.ctx.textAlign = positions.special.textAlign || 'right';
        this.ctx.textBaseline = positions.special.textBaseline || 'alphabetic';
        // Check if card has passive or bloom ability
        const hasAbility = beast.passiveAbility || beast.bloomAbility;
        const special = hasAbility ? '?' : '';
        this.ctx.fillText(special, x + positions.special.x, y + positions.special.y);

        // Attack (bottom left)
        const attack = beast.currentAttack || beast.baseAttack || beast.attack || 0;
        this.ctx.font = `bold ${positions.attack.size}px Arial`;
        this.ctx.textAlign = positions.attack.textAlign || 'center';
        this.ctx.textBaseline = positions.attack.textBaseline || 'alphabetic';
        this.ctx.fillText(`${attack}`, x + positions.attack.x, y + positions.attack.y);

        // Health (bottom right)
        const health = beast.currentHealth || beast.baseHealth || beast.health || 0;
        this.ctx.font = `bold ${positions.health.size}px Arial`;
        this.ctx.textAlign = positions.health.textAlign || 'center';
        this.ctx.textBaseline = positions.health.textBaseline || 'alphabetic';
        this.ctx.fillText(`${health}`, x + positions.health.x, y + positions.health.y);
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
        this.ctx.strokeStyle = mission.isCompleted ? '#43e97b' : '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Mission info
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(mission.name, x + 15, y + 15);

        this.ctx.font = '14px Arial';
        this.ctx.fillText(`Level ${mission.level} - ${mission.difficulty}`, x + 15, y + 45);
        this.ctx.fillText(mission.description.substring(0, 40) + '...', x + 15, y + 70);

        if (mission.isCompleted) {
            this.ctx.fillText('✅ Completed', x + 15, y + 95);
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

        // Draw text overlay using standardCardTextPositions
        const positions = standardCardTextPositions;

        // Setup common fill style
        this.ctx.fillStyle = '#fff';

        // Cost (top left)
        this.ctx.font = `bold ${positions.cost.size}px Arial`;
        this.ctx.textAlign = positions.cost.textAlign || 'center';
        this.ctx.textBaseline = positions.cost.textBaseline || 'alphabetic';
        this.ctx.fillText(`${card.cost || 0}`, x + positions.cost.x, y + positions.cost.y);

        // Level (top middle area)
        this.ctx.font = `bold ${positions.level.size}px Arial`;
        this.ctx.textAlign = positions.level.textAlign || 'center';
        this.ctx.textBaseline = positions.level.textBaseline || 'alphabetic';
        this.ctx.fillText(`${card.level || 1}`, x + positions.level.x, y + positions.level.y);

        // Name (bottom left area) - truncate if too long
        this.ctx.font = `bold ${positions.name.size}px Arial`;
        this.ctx.textAlign = positions.name.textAlign || 'left';
        this.ctx.textBaseline = positions.name.textBaseline || 'alphabetic';
        const maxNameWidth = 115; // Max width to avoid overlapping with special indicator
        const truncatedName = this.truncateText(`${card.name}`, maxNameWidth);
        this.ctx.fillText(truncatedName, x + positions.name.x, y + positions.name.y);

        // Special (bottom right area) - show "?" if card has abilities
        this.ctx.font = `bold ${positions.special.size}px Arial`;
        this.ctx.textAlign = positions.special.textAlign || 'right';
        this.ctx.textBaseline = positions.special.textBaseline || 'alphabetic';
        // Check if card has passive or bloom ability
        const hasAbility = card.passiveAbility || card.bloomAbility;
        const special = hasAbility ? '?' : '';
        this.ctx.fillText(special, x + positions.special.x, y + positions.special.y);

        // Attack (bottom left)
        const attack = card.currentAttack || card.baseAttack || 0;
        this.ctx.font = `bold ${positions.attack.size}px Arial`;
        this.ctx.textAlign = positions.attack.textAlign || 'center';
        this.ctx.textBaseline = positions.attack.textBaseline || 'alphabetic';
        this.ctx.fillText(`${attack}`, x + positions.attack.x, y + positions.attack.y);

        // Health (bottom right)
        const health = card.currentHealth || card.baseHealth || 0;
        this.ctx.font = `bold ${positions.health.size}px Arial`;
        this.ctx.textAlign = positions.health.textAlign || 'center';
        this.ctx.textBaseline = positions.health.textBaseline || 'alphabetic';
        this.ctx.fillText(`${health}`, x + positions.health.x, y + positions.health.y);
    }

    drawObjectives(objectives: any[], startX: number, startY: number): void {
        if (!objectives || objectives.length === 0) return;

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Objectives:', startX, startY);

        objectives.forEach((obj, index) => {
            const y = startY + 30 + index * 25;
            const icon = obj.isComplete ? '✅' : '⬜';
            this.ctx.font = '14px Arial';
            this.ctx.fillText(`${icon} ${obj.description}`, startX, y);

            if (obj.target) {
                this.ctx.fillText(`(${obj.progress}/${obj.target})`, startX + 200, y);
            }
        });
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
     * Draw a green button on the side menu (for active End Turn button)
     */
    drawSideMenuGreenButton(text: string, x: number, y: number, buttonImg: HTMLImageElement): void {
        // Draw button image
        this.ctx.drawImage(
            buttonImg,
            x,
            y,
            sideMenuButtonDimensions.width,
            sideMenuButtonDimensions.height
        );

        // Draw button text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + sideMenuButtonDimensions.width / 2, y + sideMenuButtonDimensions.height / 2);
    }

    /**
     * Draw a standard button on the side menu
     */
    drawSideMenuStandardButton(text: string, x: number, y: number, buttonImg: HTMLImageElement): void {
        // Draw button image
        this.ctx.drawImage(
            buttonImg,
            x,
            y,
            sideMenuButtonDimensions.width,
            sideMenuButtonDimensions.height
        );

        // Draw button text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + sideMenuButtonDimensions.width / 2, y + sideMenuButtonDimensions.height / 2);
    }

    /**
     * Draw a disabled button on the side menu
     */
    drawSideMenuDisabledButton(text: string, x: number, y: number, buttonImg: HTMLImageElement): void {
        // Draw button image with reduced opacity
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(
            buttonImg,
            x,
            y,
            sideMenuButtonDimensions.width,
            sideMenuButtonDimensions.height
        );
        this.ctx.globalAlpha = 1.0;

        // Draw button text (grayed out)
        this.ctx.fillStyle = '#888';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + sideMenuButtonDimensions.width / 2, y + sideMenuButtonDimensions.height / 2);
    }
}
