/**
 * Menu Screen Renderer
 */

import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { gameDimensions, sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { sideMenuPositions } from '../../../../shared/constants/positions';
import { MenuStats } from '../../../../bloombeasts/gameManager';
import { playerLevelEmoji, playerExperienceEmoji, missionEmoji } from '../../../../shared/constants/emojis';

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

    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    render(options: string[], stats: MenuStats, onButtonClick: (buttonId: string) => void): void {
        // Store stats for rendering
        this.stats = stats;

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
        const standardButtonImg = this.assets.getImage('sideMenuStandardButton');

        if (standardButtonImg) {
            // Close button at header position (disabled for now)
            const closeBtnX = sideMenuPositions.headerStartPosition.x;
            const closeBtnY = sideMenuPositions.headerStartPosition.y;
            this.renderer.drawSideMenuDisabledButton('Close', closeBtnX, closeBtnY, standardButtonImg);

            // Draw menu option buttons on side menu
            const buttonX = sideMenuPositions.buttonStartPosition.x;
            const buttonSpacing = 10;

            // Filter to only show missions, inventory, and settings
            const menuOptions = options.filter(opt => opt === 'missions' || opt === 'inventory' || opt === 'settings');

            menuOptions.forEach((option, index) => {
                const y = sideMenuPositions.buttonStartPosition.y + index * (sideMenuButtonDimensions.height + buttonSpacing);
                const label = this.getMenuLabel(option);

                this.renderer.drawSideMenuStandardButton(label, buttonX, y, standardButtonImg);

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

        // Draw common UI (background and side menu)
        const bgImg = this.assets.getImage('background');
        const sideMenuImg = this.assets.getImage('sideMenu');
        this.renderer.drawCommonUI(bgImg, sideMenuImg);

        // Draw current animation frame at original size at position (143, 25)
        const frameImg = this.assets.getImage(`menuFrame${this.currentFrame}`);
        if (frameImg) {
            this.renderer.ctx.drawImage(frameImg, 143, 25);
        }

        // Draw text on side menu
        const textPos = sideMenuPositions.textStartPosition;
        const lineHeight = 25;

        // Lines 1-3: Scrolling quote (typing animation across three lines)
        this.drawQuoteWithWordWrap(this.displayedText, textPos.x, textPos.y);

        // Line 4: Blank (spacing)

        // Draw static stats with emojis if available
        if (this.stats) {
            // Line 5: Player level
            const line5Text = `${playerLevelEmoji} ${this.stats.playerLevel}`;
            const truncatedLine5 = this.truncateToWidth(line5Text, this.MAX_TEXT_WIDTH);
            this.renderer.drawText(
                truncatedLine5,
                textPos.x,
                textPos.y + lineHeight * 4,
                this.TEXT_SIZE,
                '#fff',
                'left'
            );

            // Line 6: Player experience
            const line6Text = `${playerExperienceEmoji} ${this.stats.totalXP}`;
            const truncatedLine6 = this.truncateToWidth(line6Text, this.MAX_TEXT_WIDTH);
            this.renderer.drawText(
                truncatedLine6,
                textPos.x,
                textPos.y + lineHeight * 5,
                this.TEXT_SIZE,
                '#fff',
                'left'
            );

            // Line 7: Missions completed
            const line7Text = `${missionEmoji} ${this.stats.missionsCompleted}`;
            const truncatedLine7 = this.truncateToWidth(line7Text, this.MAX_TEXT_WIDTH);
            this.renderer.drawText(
                truncatedLine7,
                textPos.x,
                textPos.y + lineHeight * 6,
                this.TEXT_SIZE,
                '#fff',
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
            const standardButtonImg = this.assets.getImage('sideMenuStandardButton');
            if (standardButtonImg) {
                // Close button
                const closeBtnX = sideMenuPositions.headerStartPosition.x;
                const closeBtnY = sideMenuPositions.headerStartPosition.y;
                this.renderer.drawSideMenuDisabledButton('Close', closeBtnX, closeBtnY, standardButtonImg);

                // Menu buttons
                const buttonX = sideMenuPositions.buttonStartPosition.x;
                const buttonSpacing = 10;
                const menuOptions = options.filter(opt => opt === 'missions' || opt === 'inventory' || opt === 'settings');

                menuOptions.forEach((option, index) => {
                    const y = sideMenuPositions.buttonStartPosition.y + index * (sideMenuButtonDimensions.height + buttonSpacing);
                    const label = this.getMenuLabel(option);

                    this.renderer.drawSideMenuStandardButton(label, buttonX, y, standardButtonImg);

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
        const standardButtonImg = this.assets.getImage('sideMenuStandardButton');
        if (standardButtonImg) {
            // Close button
            const closeBtnX = sideMenuPositions.headerStartPosition.x;
            const closeBtnY = sideMenuPositions.headerStartPosition.y;
            this.renderer.drawSideMenuDisabledButton('Close', closeBtnX, closeBtnY, standardButtonImg);

            // Menu buttons
            const buttonX = sideMenuPositions.buttonStartPosition.x;
            const buttonSpacing = 10;
            const menuOptions = options.filter(opt => opt === 'missions' || opt === 'inventory' || opt === 'settings');

            menuOptions.forEach((option, index) => {
                const y = sideMenuPositions.buttonStartPosition.y + index * (sideMenuButtonDimensions.height + buttonSpacing);
                const label = this.getMenuLabel(option);

                this.renderer.drawSideMenuStandardButton(label, buttonX, y, standardButtonImg);
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
        const lineHeight = 25;
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            this.renderer.drawText(lines[i], x, y + (i * lineHeight), this.TEXT_SIZE, '#fff', 'left');
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
            inventory: 'Inventory',
            'deck-builder': 'Deck Builder',
            settings: 'Settings',
            quit: 'Quit',
        };
        return labels[option] || option;
    }
}
