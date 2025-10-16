/**
 * Menu Screen Renderer
 */

import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { gameDimensions, sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { sideMenuPositions } from '../../../../shared/constants/positions';
import { MenuStats } from '../../../../bloombeasts/gameManager';
import { tokenEmoji, diamondEmoji, serumEmoji } from '../../../../shared/constants/emojis';
import { DIMENSIONS, GAPS } from '../../../../shared/styles/dimensions';
import { COLORS } from '../../../../shared/styles/colors';

export class MenuScreen {
    private currentFrame: number = 1;
    private animationInterval: number | null = null;
    private textAnimationInterval: number | null = null;
    private currentMessageIndex: number = 0;
    private displayedText: string = '';
    private currentCharIndex: number = 0;
    private quotes: string[] = [];
    private isTyping: boolean = false;
    private readonly MAX_TEXT_WIDTH = 95;
    private readonly TEXT_SIZE = 18;
    private stats: MenuStats | null = null;
    private onButtonClick: ((buttonId: string) => void) | null = null;

    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    render(options: string[], stats: MenuStats, onButtonClick: (buttonId: string) => void): void {
        // Store stats for rendering and button callback
        this.stats = stats;
        this.onButtonClick = onButtonClick;

        // Generate inspirational quotes/greetings for scrolling text (can be longer now)
        this.quotes = [
            'Welcome back, Trainer!',
            'Ready to battle?',
            'Keep blooming strong!',
            'Victory awaits!',
            'Train hard, win harder!',
            'Believe in your beasts!',
            'Never give ups!',
            'You are a Champion!',
        ];

        this.clickManager.clearRegions();
        this.renderFrame();

        // Wrap the callback to stop animations before navigation
        const wrappedCallback = (buttonId: string) => {
            this.stopAnimation();
            onButtonClick(buttonId);
        };

        // Get button image
        const standardButtonImg = this.assets.getImage('standardButton');

        if (standardButtonImg) {
            // Close button at header position (disabled for now)
            const closeBtnX = sideMenuPositions.headerStartPosition.x;
            const closeBtnY = sideMenuPositions.headerStartPosition.y;
            this.renderer.drawSideMenuDisabledButton('Close', closeBtnX, closeBtnY, standardButtonImg);

            // Draw menu option buttons on side menu
            const buttonX = sideMenuPositions.buttonStartPosition.x;
            const buttonSpacing = GAPS.buttons;

            // Filter to only show missions, cards, and settings
            const menuOptions = options.filter(opt => opt === 'missions' || opt === 'cards' || opt === 'settings');

            menuOptions.forEach((option, index) => {
                const y = sideMenuPositions.buttonStartPosition.y + index * (sideMenuButtonDimensions.height + buttonSpacing);
                const label = this.getMenuLabel(option);

                this.renderer.drawStandardButton(label, buttonX, y, standardButtonImg);

                this.clickManager.addRegion({
                    id: option,
                    x: buttonX,
                    y,
                    width: sideMenuButtonDimensions.width,
                    height: sideMenuButtonDimensions.height,
                    callback: () => wrappedCallback(`btn-${option}`),
                });
            });
        }

        // Start animations if not already running
        if (!this.animationInterval) {
            this.startAnimation(options, stats, wrappedCallback);
        }
        if (!this.textAnimationInterval) {
            this.startTextAnimation(options, stats, wrappedCallback);
        }
    }

    private renderFrame(): void {
        this.renderer.clear();

        // Calculate player info for display
        let playerInfo = undefined;
        if (this.stats) {
            const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
            const currentLevel = this.stats.playerLevel;
            const totalXP = this.stats.totalXP;
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
        if (expBarBounds && playerInfo && this.stats && this.onButtonClick) {
            this.clickManager.addRegion({
                id: 'player-xp-bar',
                x: expBarBounds.x,
                y: expBarBounds.y,
                width: expBarBounds.width,
                height: Math.max(expBarBounds.height, 20), // Make it easier to click
                callback: () => {
                    // Format the XP information and trigger button callback
                    const title = `Level ${playerInfo.level}`;
                    const message = `Current XP: ${playerInfo.currentXP} / ${playerInfo.xpForNextLevel}\n\nTotal XP: ${this.stats?.totalXP || 0}`;

                    // Use the same pattern as counter info: show-counter-info:title:message
                    if (this.onButtonClick) {
                        this.onButtonClick(`show-counter-info:${title}:${message}`);
                    }
                },
            });
        }

        // Draw current animation frame at original size at position (143, 25)
        const frameImg = this.assets.getImage(`menuFrame${this.currentFrame}`);
        if (frameImg) {
            this.renderer.ctx.drawImage(frameImg, 143, 25);
        }

        // Draw text on side menu
        const textPos = sideMenuPositions.textStartPosition;
        const lineHeight = DIMENSIONS.fontSize.lg + 5; // fontSize + spacing

        // Lines 1-3: Scrolling quote (typing animation across three lines)
        this.drawQuoteWithWordWrap(this.displayedText, textPos.x, textPos.y);

        // Line 4: Blank (spacing)

        // Draw static stats with emojis if available
        if (this.stats) {
            // Line 5: Tokens
            const line5Text = `${tokenEmoji} ${this.stats.tokens}`;
            const truncatedLine5 = this.truncateToWidth(line5Text, this.MAX_TEXT_WIDTH);
            this.renderer.drawText(
                truncatedLine5,
                textPos.x,
                textPos.y + lineHeight * 4,
                this.TEXT_SIZE,
                COLORS.textPrimary,
                'left'
            );

            // Line 6: Diamonds
            const line6Text = `${diamondEmoji} ${this.stats.diamonds}`;
            const truncatedLine6 = this.truncateToWidth(line6Text, this.MAX_TEXT_WIDTH);
            this.renderer.drawText(
                truncatedLine6,
                textPos.x,
                textPos.y + lineHeight * 5,
                this.TEXT_SIZE,
                COLORS.textPrimary,
                'left'
            );

            // Line 7: Serums
            const line7Text = `${serumEmoji} ${this.stats.serums}`;
            const truncatedLine7 = this.truncateToWidth(line7Text, this.MAX_TEXT_WIDTH);
            this.renderer.drawText(
                truncatedLine7,
                textPos.x,
                textPos.y + lineHeight * 6,
                this.TEXT_SIZE,
                COLORS.textPrimary,
                'left'
            );
        }
    }

    private startAnimation(options: string[], stats: MenuStats, onButtonClick: (buttonId: string) => void): void {
        this.animationInterval = window.setInterval(() => {
            // Update frame
            this.currentFrame = (this.currentFrame % 10) + 1;

            // Re-render
            this.clickManager.clearRegions();
            this.renderFrame();

            // Re-add buttons
            const standardButtonImg = this.assets.getImage('standardButton');
            if (standardButtonImg) {
                // Close button
                const closeBtnX = sideMenuPositions.headerStartPosition.x;
                const closeBtnY = sideMenuPositions.headerStartPosition.y;
                this.renderer.drawSideMenuDisabledButton('Close', closeBtnX, closeBtnY, standardButtonImg);

                // Menu buttons
                const buttonX = sideMenuPositions.buttonStartPosition.x;
                const buttonSpacing = GAPS.buttons;
                const menuOptions = options.filter(opt => opt === 'missions' || opt === 'cards' || opt === 'settings');

                menuOptions.forEach((option, index) => {
                    const y = sideMenuPositions.buttonStartPosition.y + index * (sideMenuButtonDimensions.height + buttonSpacing);
                    const label = this.getMenuLabel(option);

                    this.renderer.drawStandardButton(label, buttonX, y, standardButtonImg);

                    this.clickManager.addRegion({
                        id: option,
                        x: buttonX,
                        y,
                        width: sideMenuButtonDimensions.width,
                        height: sideMenuButtonDimensions.height,
                        callback: () => onButtonClick(`btn-${option}`),
                    });
                });
            }
        }, 200);
    }

    private startTextAnimation(options: string[], stats: MenuStats, onButtonClick: (buttonId: string) => void): void {
        // Start with first quote
        this.currentMessageIndex = 0;
        this.displayedText = '';
        this.currentCharIndex = 0;
        this.isTyping = true;

        this.textAnimationInterval = window.setInterval(() => {
            if (this.isTyping) {
                // Typing out current quote
                const currentQuote = this.quotes[this.currentMessageIndex];

                if (this.currentCharIndex < currentQuote.length) {
                    this.displayedText += currentQuote[this.currentCharIndex];
                    this.currentCharIndex++;
                    this.renderFrame();
                    this.redrawButtons(options, onButtonClick);
                } else {
                    // Finished typing, wait before next quote
                    this.isTyping = false;
                    setTimeout(() => {
                        // Move to next quote
                        this.currentMessageIndex = (this.currentMessageIndex + 1) % this.quotes.length;
                        this.displayedText = '';
                        this.currentCharIndex = 0;
                        this.isTyping = true;
                    }, 2000); // Wait 2 seconds before next quote
                }
            }
        }, 100); // Type one character every 100ms
    }

    private redrawButtons(options: string[], onButtonClick: (buttonId: string) => void): void {
        // Re-add buttons without clearing the canvas
        const standardButtonImg = this.assets.getImage('standardButton');
        if (standardButtonImg) {
            // Close button
            const closeBtnX = sideMenuPositions.headerStartPosition.x;
            const closeBtnY = sideMenuPositions.headerStartPosition.y;
            this.renderer.drawSideMenuDisabledButton('Close', closeBtnX, closeBtnY, standardButtonImg);

            // Menu buttons
            const buttonX = sideMenuPositions.buttonStartPosition.x;
            const buttonSpacing = GAPS.buttons;
            const menuOptions = options.filter(opt => opt === 'missions' || opt === 'cards' || opt === 'settings');

            menuOptions.forEach((option, index) => {
                const y = sideMenuPositions.buttonStartPosition.y + index * (sideMenuButtonDimensions.height + buttonSpacing);
                const label = this.getMenuLabel(option);

                this.renderer.drawStandardButton(label, buttonX, y, standardButtonImg);
            });
        }
    }

    private drawQuoteWithWordWrap(text: string, x: number, y: number): void {
        if (!text) return;

        // Set font for measurement
        this.renderer.ctx.font = `${this.TEXT_SIZE}px monospace`;

        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = this.renderer.ctx.measureText(testLine);

            if (metrics.width > this.MAX_TEXT_WIDTH && currentLine) {
                // Current line is full, push it and start new line
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }

        // Push the last line
        if (currentLine) {
            lines.push(currentLine);
        }

        // Draw only first 3 lines for quotes
        const lineHeight = DIMENSIONS.fontSize.lg + 5;
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            this.renderer.drawText(lines[i], x, y + (i * lineHeight), this.TEXT_SIZE, COLORS.textPrimary, 'left');
        }
    }

    private truncateToWidth(text: string, maxWidth: number): string {
        // Set font for measurement
        this.renderer.ctx.font = `${this.TEXT_SIZE}px monospace`;

        const metrics = this.renderer.ctx.measureText(text);
        if (metrics.width <= maxWidth) {
            return text;
        }

        // Truncate with ellipsis
        let truncated = text;
        while (truncated.length > 0) {
            truncated = truncated.slice(0, -1);
            const testText = truncated + '...';
            const testMetrics = this.renderer.ctx.measureText(testText);
            if (testMetrics.width <= maxWidth) {
                return testText;
            }
        }

        return '...';
    }

    stopAnimation(): void {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.textAnimationInterval) {
            clearInterval(this.textAnimationInterval);
            this.textAnimationInterval = null;
        }
    }

    private getMenuLabel(option: string): string {
        const labels: Record<string, string> = {
            missions: 'Missions',
            cards: 'Cards',
            'deck-builder': 'Deck Builder',
            settings: 'Settings',
            quit: 'Quit',
        };
        return labels[option] || option;
    }
}
