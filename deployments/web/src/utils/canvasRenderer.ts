/**
 * Canvas Rendering Utilities
 * Provides drawing functions for buttons, text, cards, health bars, etc.
 */

import {
    gameDimensions,
    standardCardDimensions,
    standardCardBeastImageDimensions,
    buffCardDimensions,
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

    drawBeastCard(x: number, y: number, beast: any, beastImage?: HTMLImageElement | null, baseCardImage?: HTMLImageElement | null, affinityImage?: HTMLImageElement | null, attackIcon?: HTMLImageElement | null, abilityIcon?: HTMLImageElement | null, experienceBarImage?: HTMLImageElement | null): void {
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;
        const beastImageWidth = standardCardBeastImageDimensions.width;
        const beastImageHeight = standardCardBeastImageDimensions.height;
        const positions = standardCardPositions;

        // Layered rendering approach:
        // 1. Draw beast artwork in the beast image area
        // 2. Draw base card frame on top
        // 3. Draw affinity icon
        // 4. Draw experience bar (if applicable)
        // 5. Draw text overlay
        // 6. Draw action icons (attack/ability)

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

        // Step 4: Draw experience bar (between level text and card image)
        if (experienceBarImage) {
            const level = beast.currentLevel || beast.level || 1;
            const currentExp = beast.currentXP || beast.experience || 0;
            const expNeeded = beast.experienceRequired || (level * 100);
            const expPercentage = Math.min(1, currentExp / expNeeded);
            const maxBarWidth = 122;

            // Calculate how much of the source image to use (based on percentage)
            const sourceWidth = experienceBarImage.width * expPercentage;
            // Calculate display width (based on max bar width and percentage)
            const displayWidth = maxBarWidth * expPercentage;

            // Draw the experience bar with dynamic width
            this.ctx.drawImage(
                experienceBarImage,
                0, 0, // Source x, y (start from left edge of source image)
                sourceWidth, experienceBarImage.height, // Source width, height (crop based on percentage)
                x + positions.experienceBar.x, // Destination x
                y + positions.experienceBar.y, // Destination y
                displayWidth, experienceBarImage.height // Destination width, height
            );
        }

        // Step 5: Draw text overlay for dynamic values
        this.drawCardTextOverlay(x, y, beast);

        // Step 6: Draw action icons if beast can perform actions
        // Attack icon - show when beast can attack (no summoning sickness)
        if (attackIcon && beast.summoningSickness === false) {
            this.ctx.drawImage(
                attackIcon,
                x + positions.icons.attack.x,
                y + positions.icons.attack.y,
                positions.icons.attack.size,
                positions.icons.attack.size
            );
        }

        // Ability icon - show when beast has an activated ability and hasn't used it this turn
        if (abilityIcon && beast.ability && beast.ability.trigger === 'Activated' && !beast.usedAbilityThisTurn) {
            this.ctx.drawImage(
                abilityIcon,
                x + positions.icons.ability.x,
                y + positions.icons.ability.y,
                positions.icons.ability.size,
                positions.icons.ability.size
            );
        }
    }

    drawMissionCard(
        x: number,
        y: number,
        width: number,
        height: number,
        mission: any,
        cardsContainerImage?: HTMLImageElement | null,
        missionImage?: HTMLImageElement | null,
        beastImage?: HTMLImageElement | null
    ): void {
        // Only draw CardsContainer background if provided (for backwards compatibility)
        // When cardsContainerImage is null, we assume it's already drawn at container level
        if (cardsContainerImage) {
            this.ctx.drawImage(cardsContainerImage, x, y, width, height);
        }

        // Draw mission-specific background image (ForestMission, WaterMission, etc.) as FULL card background
        if (missionImage) {
            this.ctx.drawImage(missionImage, x, y, width, height);
        }

        // Draw text using missionCardPositions
        const namePos = {x: 97, y: 10}; // From missionCardPositions
        const levelPos = {x: 97, y: 43};
        const difficultyPos = {x: 97, y: 66};
        const descriptionPos = {x: 13, y: 98};

        // Mission name
        this.drawTextWithFont(
            mission.name,
            x + namePos.x,
            y + namePos.y,
            24,
            DEFAULT_TEXT_COLOR,
            'left',
            'top',
            true
        );

        // Level
        this.drawTextWithFont(
            `Level ${mission.level}`,
            x + levelPos.x,
            y + levelPos.y,
            12,
            DEFAULT_TEXT_COLOR,
            'left',
            'top',
            false
        );

        // Difficulty
        const difficultyColor = this.getDifficultyColor(mission.difficulty);
        this.drawTextWithFont(
            mission.difficulty.toUpperCase(),
            x + difficultyPos.x,
            y + difficultyPos.y,
            12,
            difficultyColor,
            'left',
            'top',
            false
        );

        // Description (word-wrapped to 4 lines)
        const maxDescWidth = width - 26; // Account for padding
        this.drawWrappedText(
            mission.description,
            x + descriptionPos.x,
            y + descriptionPos.y,
            maxDescWidth,
            12, // Smaller font for multi-line
            DEFAULT_TEXT_COLOR,
            'left'
        );

        // Show completed checkmark
        if (mission.isCompleted) {
            this.drawTextWithFont(
                '✅',
                x + width - 30,
                y + 10,
                20,
                DEFAULT_TEXT_COLOR,
                'left',
                'top',
                false
            );
        }

        // Draw beast image (70x70) LAST so it appears on top of everything
        if (beastImage) {
            const imagePos = {x: 16, y: 16};  // From missionCardPositions
            const beastSize = 70; // Beast image size (70x70)

            // Apply opacity if mission is locked
            if (!mission.isAvailable) {
                this.ctx.globalAlpha = 0.4;
            }

            this.ctx.drawImage(beastImage, x + imagePos.x, y + imagePos.y, beastSize, beastSize);

            // Reset alpha
            if (!mission.isAvailable) {
                this.ctx.globalAlpha = 1.0;
            }
        }

        // Add dark overlay for locked missions
        if (!mission.isAvailable) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.fillRect(x, y, width, height);

            // Draw lock icon
            this.drawTextWithFont(
                '🔒',
                x + width / 2 - 15,
                y + height / 2 - 15,
                30,
                DEFAULT_TEXT_COLOR,
                'center',
                'middle',
                false
            );
        }
    }

    private getDifficultyColor(difficulty: string): string {
        const colors: Record<string, string> = {
            'beginner': '#90EE90',
            'easy': '#87CEEB',
            'normal': '#FFD700',
            'hard': '#FF6347',
            'expert': '#8B008B',
        };
        return colors[difficulty.toLowerCase()] || DEFAULT_TEXT_COLOR;
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
     * Draw Buff card with layered rendering (for inventory/hand)
     */
    drawBuffCard(x: number, y: number, card: any, buffImage?: HTMLImageElement | null, templateImage?: HTMLImageElement | null, baseCardImage?: HTMLImageElement | null): void {
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;

        // Layered rendering:
        // 1. Draw buff artwork (185x185)
        // 2. Draw BaseCard frame
        // 3. Draw BuffCard template overlay
        // 4. Draw text overlay

        // Step 1: Draw buff image if available
        if (buffImage) {
            // Buff images are 185x185, positioned at offset (12, 13)
            const buffImageSize = 185;
            const imageX = x + 12;
            const imageY = y + 13;
            this.ctx.drawImage(buffImage, imageX, imageY, buffImageSize, buffImageSize);
        }

        // Step 2: Draw base card frame
        if (baseCardImage) {
            this.ctx.drawImage(baseCardImage, x, y, cardWidth, cardHeight);
        }

        // Step 3: Draw BuffCard template overlay
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
     * Draw Buff card for playboard (smaller size with centered image)
     */
    drawBuffCardPlayboard(x: number, y: number, width: number, height: number, card: any, buffImage?: HTMLImageElement | null, playboardTemplate?: HTMLImageElement | null): void {
        // Draw playboard template background
        if (playboardTemplate) {
            this.ctx.drawImage(playboardTemplate, x, y, width, height);
        }

        // Draw buff image centered and resized to 100x100
        if (buffImage) {
            const imageSize = 100;
            const imageX = x + (width - imageSize) / 2;
            const imageY = y + (height - imageSize) / 2;
            this.ctx.drawImage(buffImage, imageX, imageY, imageSize, imageSize);
        }

        // No text overlay needed for buff cards on playboard
    }

    /**
     * Draw Habitat card with layered rendering (for inventory/hand)
     */
    drawHabitatCard(x: number, y: number, card: any, habitatImage?: HTMLImageElement | null, templateImage?: HTMLImageElement | null, baseCardImage?: HTMLImageElement | null): void {
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;

        // Layered rendering:
        // 1. Draw habitat artwork (185x185)
        // 2. Draw BaseCard frame
        // 3. Draw HabitatCard template overlay
        // 4. Draw text overlay

        // Step 1: Draw habitat image if available
        if (habitatImage) {
            // Habitat images are 185x185, positioned at offset (12, 13)
            const habitatImageSize = 185;
            const imageX = x + 12;
            const imageY = y + 13;
            this.ctx.drawImage(habitatImage, imageX, imageY, habitatImageSize, habitatImageSize);
        }

        // Step 2: Draw base card frame
        if (baseCardImage) {
            this.ctx.drawImage(baseCardImage, x, y, cardWidth, cardHeight);
        }

        // Step 3: Draw HabitatCard template overlay
        if (templateImage) {
            this.ctx.drawImage(templateImage, x, y, cardWidth, cardHeight);
        }

        // Step 4: Draw text overlay
        this.drawCardTextOverlay(x, y, card);
    }

    /**
     * Draw Habitat card for playboard
     */
    drawHabitatCardPlayboard(x: number, y: number, width: number, height: number, habitatImage?: HTMLImageElement | null, playboardTemplate?: HTMLImageElement | null): void {
        // Draw playboard template background
        if (playboardTemplate) {
            this.ctx.drawImage(playboardTemplate, x, y, width, height);
        }

        // Draw habitat image centered and resized (70x70 on 100x100 template)
        if (habitatImage) {
            const imageSize = Math.min(width - 30, height - 30);
            const imageX = x + (width - imageSize) / 2;
            const imageY = y + (height - imageSize) / 2;
            this.ctx.drawImage(habitatImage, imageX, imageY, imageSize, imageSize);
        }
    }

    /**
     * Helper: Draw card text overlay (used by both beast and inventory cards)
     * Handles both card definitions (level, baseAttack) and beast instances (currentLevel, currentAttack)
     */
    private drawCardTextOverlay(x: number, y: number, card: any): void {
        const positions = standardCardPositions;
        this.ctx.fillStyle = DEFAULT_TEXT_COLOR;

        // Cost (top left) - beast instances may not have cost, so only show if available
        if (card.cost !== undefined) {
            this.drawTextWithFont(
                `${card.cost}`,
                x + positions.cost.x,
                y + positions.cost.y,
                positions.cost.size,
                DEFAULT_TEXT_COLOR,
                positions.cost.textAlign || 'center',
                positions.cost.textBaseline || 'alphabetic',
                true
            );
        }

        // Check if this is a Bloom beast - ONLY check type, not level properties
        // (Magic/Trap/Habitat cards should never show level/attack/health)
        const isBloomBeast = card.type === 'Bloom';

        // Show level for ALL card types (Bloom, Magic, Trap, Buff, Habitat)
        // Level - check both currentLevel (beast instance) and level (card definition)
        const level = card.currentLevel || card.level || 1;

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

        // Name (bottom left area) - truncate if too long
        // Use custom titleColor if provided, otherwise use default
        const titleColor = card.titleColor || DEFAULT_TEXT_COLOR;
        this.setFont(positions.name.size, true);
        this.ctx.fillStyle = titleColor;
        this.ctx.textAlign = positions.name.textAlign || 'left';
        this.ctx.textBaseline = positions.name.textBaseline || 'alphabetic';
        const maxNameWidth = 115;
        const truncatedName = this.truncateText(`${card.name}`, maxNameWidth);
        this.ctx.fillText(truncatedName, x + positions.name.x, y + positions.name.y);

        // Ability/Description - show full text with wrapping
        // For Bloom beasts, show ability. For Magic/Trap/Habitat/Buff, show description
        const hasAbility = card.ability;
        const hasDescription = card.description;

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
        } else if (hasDescription) {
            // For Magic, Trap, and Habitat cards, show description
            this.drawWrappedText(
                card.description,
                x + positions.ability.x,
                y + positions.ability.y,
                180, // Max width for text wrapping
                positions.ability.size,
                DEFAULT_TEXT_COLOR,
                positions.ability.textAlign || 'left'
            );
        }

        // Only show attack/health for Bloom beasts (not for Magic, Trap, or Habitat cards)
        if (isBloomBeast) {
            // Attack (bottom left) - prioritize current values for beast instances
            const attack = card.currentAttack ?? card.baseAttack ?? card.attack ?? 0;
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

            // Health (bottom right) - prioritize current values for beast instances
            const health = card.currentHealth ?? card.baseHealth ?? card.health ?? 0;
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

        // Draw counters on beast instances (if any)
        if (card.counters && Array.isArray(card.counters) && card.counters.length > 0) {
            this.drawCounterBadges(x, y, card.counters);
        }
    }

    /**
     * Draw counter badges on cards (e.g., Burn, Freeze, XP, etc.)
     */
    private drawCounterBadges(x: number, y: number, counters: any[]): void {
        // Group counters by type and sum their amounts
        const counterMap = new Map<string, number>();
        counters.forEach(counter => {
            const current = counterMap.get(counter.type) || 0;
            counterMap.set(counter.type, current + counter.amount);
        });

        // Counter display configuration
        const counterIcons: Record<string, { emoji: string; color: string }> = {
            'Burn': { emoji: '🔥', color: '#ff6b6b' },
            'Freeze': { emoji: '❄️', color: '#4dabf7' },
            'XP': { emoji: '⭐', color: '#ffd700' },
            'Spore': { emoji: '🍄', color: '#51cf66' },
            'Soot': { emoji: '💨', color: '#868e96' },
            'Entangle': { emoji: '🌿', color: '#37b24d' },
        };

        // Draw counter badges in a row at the top right of the card
        let badgeX = x + 155; // Start from right side
        const badgeY = y + 5;
        const badgeSize = 28;
        const badgeSpacing = 32;

        let index = 0;
        counterMap.forEach((amount, type) => {
            if (amount > 0) {
                const config = counterIcons[type] || { emoji: '●', color: '#868e96' };
                const offsetX = badgeX - (index * badgeSpacing);

                // Draw badge background circle
                this.ctx.fillStyle = config.color;
                this.ctx.beginPath();
                this.ctx.arc(offsetX + badgeSize / 2, badgeY + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
                this.ctx.fill();

                // Draw border
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Draw emoji icon
                this.drawTextWithFont(
                    config.emoji,
                    offsetX + badgeSize / 2,
                    badgeY + badgeSize / 2 - 8,
                    14,
                    '#fff',
                    'center',
                    'middle',
                    false
                );

                // Draw amount
                this.drawTextWithFont(
                    `${amount}`,
                    offsetX + badgeSize / 2,
                    badgeY + badgeSize / 2 + 4,
                    11,
                    '#fff',
                    'center',
                    'middle',
                    true
                );

                index++;
            }
        });
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
     * Draw common UI elements: background, side menu, and optional player info
     * Call this at the start of each screen render
     * Returns the experience bar bounds if player info was drawn
     */
    drawCommonUI(
        backgroundImg?: HTMLImageElement | null,
        sideMenuImg?: HTMLImageElement | null,
        playerInfo?: { name: string; level: number; currentXP: number; xpForNextLevel: number },
        experienceBarImg?: HTMLImageElement | null
    ): { expBarBounds?: { x: number; y: number; width: number; height: number } } {
        // Draw background image (full screen)
        if (backgroundImg) {
            this.drawImage(backgroundImg);
        }

        // Draw side menu background
        if (sideMenuImg) {
            this.drawSideMenuBackground(sideMenuImg);
        }

        // Draw player info if provided
        let expBarBounds = undefined;
        if (playerInfo) {
            expBarBounds = this.drawSideMenuPlayerInfo(
                playerInfo.name,
                playerInfo.level,
                playerInfo.currentXP,
                playerInfo.xpForNextLevel,
                experienceBarImg
            );
        }

        return { expBarBounds };
    }

    /**
     * Draw a selection highlight around a card
     * This draws the border outside the card boundaries to avoid cutting off card content
     */
    drawCardSelectionHighlight(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string = '#FFD700',
        lineWidth: number = 5
    ): void {
        // Calculate the offset needed to draw the border outside the card
        const offset = Math.ceil(lineWidth / 2);

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        // Draw the border outside by offsetting position and increasing size
        this.ctx.strokeRect(
            x - offset,
            y - offset,
            width + lineWidth,
            height + lineWidth
        );
    }

    /**
     * Draw a colored overlay on a card for animation effects
     * Used for attack animations (green for attacker, red for target)
     */
    drawCardBlinkOverlay(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        opacity: number = 0.4
    ): void {
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.globalAlpha = 1.0; // Reset alpha
    }

    /**
     * Draw a semi-transparent overlay for the entire screen
     * Used for card popups and modal displays
     */
    drawScreenOverlay(opacity: number = 0.7): void {
        this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        this.ctx.fillRect(0, 0, gameDimensions.panelWidth, gameDimensions.panelHeight);
    }

    /**
     * Draw a centered card popup with full details
     * Used when magic/trap cards are played/activated
     */
    async drawCenteredCardPopup(card: any, assets: any, experienceBarImage?: HTMLImageElement | null): Promise<void> {
        // Draw dark overlay first
        this.drawScreenOverlay(0.7);

        // Calculate centered position for the card
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;
        const x = (gameDimensions.panelWidth - cardWidth) / 2;
        const y = (gameDimensions.panelHeight - cardHeight) / 2;

        // Render the card based on its type
        if (card.type === 'Magic') {
            this.drawMagicCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
        } else if (card.type === 'Trap') {
            this.drawTrapCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
        } else if (card.type === 'Buff') {
            this.drawBuffCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
        } else if (card.type === 'Habitat') {
            this.drawHabitatCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
        } else if (card.type === 'Bloom') {
            // Don't show action icons in popup (this is just for viewing)
            this.drawBeastCard(x, y, card, assets.mainImage, assets.baseCardImage, assets.affinityIcon, null, null, experienceBarImage);
        } else {
            // Fallback for any other card type
            this.drawInventoryCard(x, y, cardWidth, cardHeight, card, assets.mainImage, false);
        }
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

    /**
     * Draw player info on side menu (name, level, experience bar)
     * This should be called after drawing the side menu background
     * Returns the bounds of the experience bar for click handling
     */
    drawSideMenuPlayerInfo(playerName: string, playerLevel: number, currentXP: number, xpForNextLevel: number, experienceBarImage?: HTMLImageElement | null): { x: number; y: number; width: number; height: number } {
        const baseX = sideMenuPositions.x;
        const baseY = sideMenuPositions.y;

        // Player Name
        const namePos = sideMenuPositions.playerName;
        this.drawTextWithFont(
            playerName,
            baseX + namePos.x,
            baseY + namePos.y,
            namePos.size,
            DEFAULT_TEXT_COLOR,
            namePos.textAlign || 'left',
            namePos.textBaseline || 'top',
            false
        );

        // Experience Bar (draw BEFORE level text so text appears on top)
        const expBarPos = sideMenuPositions.playerExperienceBar;
        const expBarX = baseX + expBarPos.x;
        const expBarY = baseY + expBarPos.y;
        const maxBarWidth = expBarPos.maxWidth;
        let barHeight = 4;

        if (experienceBarImage) {
            // Calculate XP percentage for current level
            const expPercentage = Math.min(1, currentXP / xpForNextLevel);

            // Calculate how much of the source image to use (based on percentage)
            const sourceWidth = experienceBarImage.width * expPercentage;
            // Calculate display width (based on max bar width and percentage)
            const displayWidth = maxBarWidth * expPercentage;

            // Draw the experience bar with dynamic width
            this.ctx.drawImage(
                experienceBarImage,
                0, 0, // Source x, y
                sourceWidth, experienceBarImage.height, // Source width, height (crop based on percentage)
                expBarX, // Destination x
                expBarY, // Destination y
                displayWidth, experienceBarImage.height // Destination width, height
            );
            barHeight = experienceBarImage.height;
        } else {
            // Fallback: draw simple bar
            const expPercentage = Math.min(1, currentXP / xpForNextLevel);
            barHeight = 4;

            // Background
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(expBarX, expBarY, maxBarWidth, barHeight);

            // Progress fill
            const fillWidth = maxBarWidth * expPercentage;
            this.ctx.fillStyle = '#43e97b';
            this.ctx.fillRect(expBarX, expBarY, fillWidth, barHeight);
        }

        // Player Level (draw AFTER experience bar so it appears on top)
        const levelPos = sideMenuPositions.playerLevel;
        this.drawTextWithFont(
            `Level ${playerLevel}`,
            baseX + levelPos.x,
            baseY + levelPos.y,
            levelPos.size,
            DEFAULT_TEXT_COLOR,
            levelPos.textAlign || 'center',
            levelPos.textBaseline || 'top',
            true
        );

        // Return bounds for click handling
        return {
            x: expBarX,
            y: expBarY,
            width: maxBarWidth,
            height: barHeight
        };
    }
}
