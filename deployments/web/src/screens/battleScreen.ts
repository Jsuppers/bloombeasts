/**
 * Battle Screen Renderer
 */

import { BattleDisplay } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { battleBoardAssetPositions, uiSafeZoneButtons, uiSafeZoneText, sideMenuPositions } from '../../../../shared/constants/positions';
import { standardCardDimensions, sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { nectarEmoji, deckEmoji } from '../../../../shared/constants/emojis';

export class BattleScreen {
    private showHand: boolean = true;
    private turnTimer: number = 60;
    private timerInterval: number | null = null;
    private currentBattleState: BattleDisplay | null = null;
    private currentButtonCallback: ((buttonId: string) => void) | null = null;
    private handScrollOffset: number = 0;

    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    async render(battleState: BattleDisplay, onButtonClick: (buttonId: string) => void): Promise<void> {
        // Store references for timer updates
        this.currentBattleState = battleState;
        this.currentButtonCallback = onButtonClick;

        // Clear any existing state
        this.clickManager.clearRegions();
        this.renderer.clear();

        // Draw playboard background
        const playboardImg = this.assets.getImage('playboard');
        if (playboardImg) {
            this.renderer.drawImage(playboardImg);
        }

        // Draw side menu background
        const sideMenuImg = this.assets.getImage('sideMenu');
        if (sideMenuImg) {
            this.renderer.drawSideMenuBackground(sideMenuImg);
        }

        // Draw battle info text on side menu
        const textPos = sideMenuPositions.textStartPosition;
        this.renderer.drawText('Battle', textPos.x, textPos.y, 20, '#fff', 'left');
        this.renderer.drawText(`Turn ${battleState.currentTurn}`, textPos.x, textPos.y + 25, 18, '#fff', 'left');

        // Get positions from constants
        const opponentInfoPos = battleBoardAssetPositions.playOneInfoPosition;
        const playerInfoPos = battleBoardAssetPositions.playerTwoInfoPosition;
        const opponentHealthPos = battleBoardAssetPositions.playerOne.health;
        const playerHealthPos = battleBoardAssetPositions.playerTwo.health;

        this.renderer.drawText(
            `${battleState.opponentHealth}/${battleState.opponentMaxHealth}`,
            opponentHealthPos.x,
            opponentHealthPos.y,
            20,
            '#fff',
            'center'
        );

        // Draw opponent info (top)
        this.renderer.drawText(
            `Opponent`,
            opponentInfoPos.x,
            opponentInfoPos.y,
            20,
            '#fff',
            'left'
        );
        this.renderer.drawText(
            `${nectarEmoji} ${battleState.opponentNectar}/10`,
            opponentInfoPos.x,
            opponentInfoPos.y + 25,
            18,
            '#fff',
            'left'
        );
        this.renderer.drawText(
            `${deckEmoji} ${battleState.opponentDeckCount}/30`,
            opponentInfoPos.x,
            opponentInfoPos.y + 50,
            18,
            '#fff',
            'left'
        );

        this.renderer.drawText(
            `${battleState.playerHealth}/${battleState.playerMaxHealth}`,
            playerHealthPos.x,
            playerHealthPos.y,
            20,
            '#fff',
            'center'
        );

        // Draw player info (bottom)
        this.renderer.drawText(
            `Player`,
            playerInfoPos.x,
            playerInfoPos.y,
            20,
            '#fff',
            'left'
        );
        this.renderer.drawText(
            `${nectarEmoji} ${battleState.playerNectar}/10`,
            playerInfoPos.x,
            playerInfoPos.y + 25,
            18,
            '#fff',
            'left'
        );
        this.renderer.drawText(
            `${deckEmoji} ${battleState.playerDeckCount}/30`,
            playerInfoPos.x,
            playerInfoPos.y + 50,
            18,
            '#fff',
            'left'
        );

        // Render player's field (bottom)
        await this.renderBattleField('player', battleState.playerField);
        if (!this.currentBattleState) return; // Cleaned up during async operation

        // Render opponent's field (top)
        await this.renderBattleField('opponent', battleState.opponentField);
        if (!this.currentBattleState) return; // Cleaned up during async operation

        // Render trap zones
        this.renderTrapZone('player', battleState.playerTrapZone);
        this.renderTrapZone('opponent', battleState.opponentTrapZone);

        // Render habitat zone
        if (battleState.habitatZone) {
            await this.renderHabitatZone(battleState.habitatZone);
        }

        // Add click region for opponent health (for direct attacks)
        if (battleState.selectedBeastIndex !== null) {
            this.clickManager.addRegion({
                id: 'attack-opponent-health',
                x: opponentHealthPos.x - 40,
                y: opponentHealthPos.y - 10,
                width: 80,
                height: 30,
                callback: () => {
                    if (battleState.selectedBeastIndex !== null && this.currentButtonCallback) {
                        this.currentButtonCallback(`action-attack-player-${battleState.selectedBeastIndex}`);
                    }
                },
            });
        }

        // Start timer if it's player's turn
        if (battleState.turnPlayer === 'player' && !this.timerInterval) {
            this.startTurnTimer(onButtonClick);
        } else if (battleState.turnPlayer !== 'player' && this.timerInterval) {
            this.stopTurnTimer();
        }

        // Get button images
        const greenButtonImg = this.assets.getImage('sideMenuGreenButton');
        const standardButtonImg = this.assets.getImage('sideMenuStandardButton');

        // Forfeit button (at header position)
        const forfeitBtnX = sideMenuPositions.headerStartPosition.x;
        const forfeitBtnY = sideMenuPositions.headerStartPosition.y;
        if (standardButtonImg) {
            this.renderer.drawSideMenuStandardButton('Forfeit', forfeitBtnX, forfeitBtnY, standardButtonImg);
            this.clickManager.addRegion({
                id: 'forfeit',
                x: forfeitBtnX,
                y: forfeitBtnY,
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                callback: () => onButtonClick('btn-back'),
            });
        }

        // End Turn button with timer (at button start position, green when active)
        const buttonX = sideMenuPositions.buttonStartPosition.x;
        const buttonStartY = sideMenuPositions.buttonStartPosition.y;
        const isPlayerTurn = battleState.turnPlayer === 'player';
        const endTurnText = isPlayerTurn ? `(${this.turnTimer})` : 'End Turn';

        if (isPlayerTurn && greenButtonImg) {
            this.renderer.drawSideMenuGreenButton(endTurnText, buttonX, buttonStartY, greenButtonImg);
            this.clickManager.addRegion({
                id: 'end-turn',
                x: buttonX,
                y: buttonStartY,
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                callback: () => {
                    this.stopTurnTimer();
                    onButtonClick('btn-end-turn');
                },
            });
        } else if (standardButtonImg) {
            this.renderer.drawSideMenuDisabledButton(endTurnText, buttonX, buttonStartY, standardButtonImg);
        }

        // Always render player's hand (just change height based on showHand)
        if (battleState.playerHand.length > 0) {
            await this.renderPlayerHand(battleState.playerHand, battleState.playerNectar, onButtonClick, this.showHand);
        }
    }

    private async renderBattleField(player: 'player' | 'opponent', beasts: any[], onButtonClick?: (buttonId: string) => void): Promise<void> {
        const positions =
            player === 'player'
                ? battleBoardAssetPositions.playerTwo  // Player beasts at bottom
                : battleBoardAssetPositions.playerOne; // Opponent beasts at top
        const slots = [positions.beastOne, positions.beastTwo, positions.beastThree];

        for (let index = 0; index < beasts.length; index++) {
            const beast = beasts[index];
            if (beast && slots[index]) {
                const pos = slots[index];
                const cardWidth = 210;
                const cardHeight = 260;

                // Load card image
                const cardImage = await this.assets.loadCardImage(beast.name, beast.affinity);

                // Highlight if selected (player beasts only)
                if (player === 'player' && this.currentBattleState && this.currentBattleState.selectedBeastIndex === index) {
                    this.renderer.ctx.strokeStyle = '#FFD700'; // Gold highlight
                    this.renderer.ctx.lineWidth = 5;
                    this.renderer.ctx.strokeRect(pos.x - 3, pos.y - 3, cardWidth + 6, cardHeight + 6);
                }

                // Draw the card with the image
                this.renderer.drawBeastCard(pos.x, pos.y, beast, cardImage);

                // Add click regions - show card details
                this.clickManager.addRegion({
                    id: `view-field-card-${player}-${index}`,
                    x: pos.x,
                    y: pos.y,
                    width: cardWidth,
                    height: cardHeight,
                    callback: () => {
                        if (this.currentButtonCallback) {
                            this.currentButtonCallback(`view-field-card-${player}-${index}`);
                        }
                    },
                });
            }
        }

    }

    private renderTrapZone(player: 'player' | 'opponent', traps: any[]): void {
        const positions =
            player === 'player'
                ? battleBoardAssetPositions.playerTwo
                : battleBoardAssetPositions.playerOne;
        const trapSlots = [positions.trapOne, positions.trapTwo, positions.trapThree];

        const trapWidth = 75;
        const trapHeight = 95;

        for (let index = 0; index < trapSlots.length; index++) {
            const pos = trapSlots[index];
            const trap = traps[index];

            if (trap) {
                // Draw face-down trap card (purple/dark background)
                this.renderer.ctx.fillStyle = '#4a148c'; // Dark purple
                this.renderer.ctx.fillRect(pos.x, pos.y, trapWidth, trapHeight);

                // Add border
                this.renderer.ctx.strokeStyle = '#7b1fa2';
                this.renderer.ctx.lineWidth = 2;
                this.renderer.ctx.strokeRect(pos.x, pos.y, trapWidth, trapHeight);

                // Draw "TRAP" text
                this.renderer.drawText('TRAP', pos.x + trapWidth / 2, pos.y + trapHeight / 2 - 5, 14, '#fff', 'center');
            } else {
                // Draw empty trap slot (dashed outline)
                this.renderer.ctx.strokeStyle = '#666';
                this.renderer.ctx.lineWidth = 1;
                this.renderer.ctx.setLineDash([5, 5]);
                this.renderer.ctx.strokeRect(pos.x, pos.y, trapWidth, trapHeight);
                this.renderer.ctx.setLineDash([]); // Reset dash pattern
            }
        }
    }

    private async renderHabitatZone(habitat: any): Promise<void> {
        const pos = battleBoardAssetPositions.habitatZone;
        const habitatWidth = 150;
        const habitatHeight = 90;

        // Draw habitat card background
        this.renderer.ctx.fillStyle = '#1b5e20'; // Dark green
        this.renderer.ctx.fillRect(pos.x, pos.y, habitatWidth, habitatHeight);

        // Add border
        this.renderer.ctx.strokeStyle = '#2e7d32';
        this.renderer.ctx.lineWidth = 3;
        this.renderer.ctx.strokeRect(pos.x, pos.y, habitatWidth, habitatHeight);

        // Draw habitat name
        if (habitat.name) {
            this.renderer.drawText(habitat.name, pos.x + habitatWidth / 2, pos.y + 20, 16, '#fff', 'center');
        }

        // Draw "HABITAT" label
        this.renderer.drawText('HABITAT', pos.x + habitatWidth / 2, pos.y + habitatHeight - 15, 12, '#aed581', 'center');
    }

    private async renderPlayerHand(hand: any[], playerNectar: number, onButtonClick: (buttonId: string) => void, showFull: boolean = true): Promise<void> {
        // Use full card dimensions
        const cardWidth = standardCardDimensions.width;
        const cardHeight = standardCardDimensions.height;
        const cardsPerRow = 5;
        const rowsPerPage = 1; // Show only 1 row at a time
        const spacing = 10;
        const startX = 50;

        // Calculate overlay dimensions based on show/hide state
        const overlayWidth = 1210; // Wider overlay
        const overlayHeight = showFull ? 300 : 60; // Full height or 60px peek
        const overlayY = 720 - overlayHeight; // Always at bottom
        const startY = overlayY + 10; // Position cards just inside overlay

        // Draw semi-transparent background for hand area
        this.renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.renderer.ctx.fillRect(40, overlayY, overlayWidth, overlayHeight);

        // Add border
        this.renderer.ctx.strokeStyle = '#4a8ec2';
        this.renderer.ctx.lineWidth = 3;
        this.renderer.ctx.strokeRect(40, overlayY, overlayWidth, overlayHeight);

        // First, add blocking click region
        this.clickManager.addRegion({
            id: 'hand-background-blocker',
            x: 40,
            y: overlayY,
            width: overlayWidth,
            height: overlayHeight,
            callback: () => {
                // Do nothing - just block clicks to battlefield below
            },
        });

        // Calculate visible cards based on scroll
        const cardsPerPage = cardsPerRow * rowsPerPage;
        const startIndex = this.handScrollOffset * cardsPerPage;
        const endIndex = Math.min(startIndex + cardsPerPage, hand.length);
        const visibleCards = hand.slice(startIndex, endIndex);

        // Render cards in grid (always render, even when minimized to show peek)
        for (let i = 0; i < visibleCards.length; i++) {
            const card = visibleCards[i];
            const actualIndex = startIndex + i;
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            const x = startX + col * (cardWidth + spacing);
            const y = startY + row * (cardHeight + spacing);

            // Load card image
            const cardImage = await this.assets.loadCardImage(card.name, card.affinity);

            // Check if affordable
            const canAfford = card.cost <= playerNectar;

            // Draw card with full text using drawInventoryCard
            this.renderer.drawInventoryCard(x, y, cardWidth, cardHeight, card, cardImage, false);

            // Highlight if affordable
            if (canAfford) {
                this.renderer.ctx.strokeStyle = '#43e97b';
                this.renderer.ctx.lineWidth = 4;
                this.renderer.ctx.strokeRect(x, y, cardWidth, cardHeight);
            } else {
                // Dim if not affordable
                this.renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.renderer.ctx.fillRect(x, y, cardWidth, cardHeight);
            }

            // Add click regions (always clickable, even when minimized)
            this.clickManager.addRegion({
                id: `play-card-${actualIndex}`,
                x,
                y,
                width: cardWidth,
                height: cardHeight,
                callback: () => {
                    // Show card details dialog
                    onButtonClick(`view-hand-card-${actualIndex}`);
                },
            });
        }

        // Add toggle button inside hand overlay
        const toggleBtnWidth = 60;
        const toggleBtnHeight = 50;
        const toggleBtnX = overlayWidth - 50;
        const toggleBtnY = overlayY + 10;
        const toggleText = showFull ? 'X' : '↑';

        this.renderer.drawButton(toggleText, toggleBtnX, toggleBtnY, toggleBtnWidth, toggleBtnHeight);
        this.clickManager.addRegion({
            id: 'toggle-hand',
            x: toggleBtnX,
            y: toggleBtnY,
            width: toggleBtnWidth,
            height: toggleBtnHeight,
            callback: () => {
                this.showHand = !this.showHand;
                if (this.currentBattleState && this.currentButtonCallback) {
                    this.render(this.currentBattleState, this.currentButtonCallback);
                }
            },
        });

        // Only render scroll buttons if showing full hand
        if (showFull) {
            // Add scroll buttons (positioned below toggle button)
            const totalPages = Math.ceil(hand.length / cardsPerPage);
            const scrollBtnX = overlayWidth - 50; // Position relative to overlay width
            const scrollBtnY = toggleBtnY + toggleBtnHeight + 10; // Below toggle button
            const scrollBtnWidth = 60;
            const scrollBtnHeight = 50;

            // Up button - always visible, disabled when can't scroll up
            const canScrollUp = this.handScrollOffset > 0;
            if (canScrollUp) {
                this.renderer.drawButton('⬆', scrollBtnX, scrollBtnY, scrollBtnWidth, scrollBtnHeight);
                this.clickManager.addRegion({
                    id: 'hand-scroll-up',
                    x: scrollBtnX,
                    y: scrollBtnY,
                    width: scrollBtnWidth,
                    height: scrollBtnHeight,
                    callback: () => {
                        this.handScrollOffset = Math.max(0, this.handScrollOffset - 1);
                        if (this.currentBattleState && this.currentButtonCallback) {
                            this.render(this.currentBattleState, this.currentButtonCallback);
                        }
                    },
                });
            } else {
                this.renderer.drawDisabledButton('⬆', scrollBtnX, scrollBtnY, scrollBtnWidth, scrollBtnHeight);
            }

            // Down button - always visible, disabled when can't scroll down
            const canScrollDown = this.handScrollOffset < totalPages - 1 && hand.length > cardsPerPage;
            if (canScrollDown) {
                this.renderer.drawButton('↓', scrollBtnX, scrollBtnY + scrollBtnHeight + 10, scrollBtnWidth, scrollBtnHeight);
                this.clickManager.addRegion({
                    id: 'hand-scroll-down',
                    x: scrollBtnX,
                    y: scrollBtnY + scrollBtnHeight + 10,
                    width: scrollBtnWidth,
                    height: scrollBtnHeight,
                    callback: () => {
                        this.handScrollOffset = Math.min(totalPages - 1, this.handScrollOffset + 1);
                        if (this.currentBattleState && this.currentButtonCallback) {
                            this.render(this.currentBattleState, this.currentButtonCallback);
                        }
                    },
                });
            } else {
                this.renderer.drawDisabledButton('↓', scrollBtnX, scrollBtnY + scrollBtnHeight + 10, scrollBtnWidth, scrollBtnHeight);
            }
        }
    }

    private startTurnTimer(onButtonClick: (buttonId: string) => void): void {
        this.turnTimer = 60;
        this.timerInterval = window.setInterval(() => {
            this.turnTimer--;
            if (this.turnTimer <= 0) {
                this.stopTurnTimer();
                onButtonClick('btn-end-turn');
            } else if (this.currentBattleState && this.currentButtonCallback) {
                // Redraw to update timer display
                this.render(this.currentBattleState, this.currentButtonCallback);
            }
        }, 1000);
    }

    private stopTurnTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    public cleanup(): void {
        // Stop timer
        this.stopTurnTimer();

        // Clear state
        this.currentBattleState = null;
        this.currentButtonCallback = null;
        this.showHand = true; // Reset to default (shown)
        this.handScrollOffset = 0; // Reset hand scroll

        // Clear regions
        this.clickManager.clearRegions();

        // Clear canvas to prevent artifacts
        this.renderer.clear();
    }
}
