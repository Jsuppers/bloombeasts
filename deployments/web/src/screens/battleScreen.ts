/**
 * Battle Screen Renderer
 */

import { BattleDisplay } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { battleBoardAssetPositions } from '../../../../shared/constants/positions';

export class BattleScreen {
    private showHand: boolean = true;
    private turnTimer: number = 60;
    private timerInterval: number | null = null;
    private currentBattleState: BattleDisplay | null = null;
    private currentButtonCallback: ((buttonId: string) => void) | null = null;
    private selectedBeastIndex: number | null = null;

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

        // Draw turn info
        this.renderer.drawText(
            `Turn ${battleState.currentTurn} - ${
                battleState.turnPlayer === 'player' ? 'Your Turn' : "Opponent's Turn"
            }`,
            480,
            10,
            20,
            '#fff'
        );

        // Get positions from constants
        const opponentInfoPos = battleBoardAssetPositions.playOneInfoPosition;
        const playerInfoPos = battleBoardAssetPositions.playerTwoInfoPosition;

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
            `HP ${battleState.opponentHealth}/${battleState.opponentMaxHealth}`,
            opponentInfoPos.x,
            opponentInfoPos.y + 25,
            18,
            '#fff',
            'left'
        );
        this.renderer.drawText(
            `Nectar ${battleState.opponentNectar}/10`,
            opponentInfoPos.x,
            opponentInfoPos.y + 50,
            18,
            '#fff',
            'left'
        );
        this.renderer.drawText(
            `Deck ${battleState.opponentDeckCount}/30`,
            opponentInfoPos.x,
            opponentInfoPos.y + 75,
            18,
            '#fff',
            'left'
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
            `HP ${battleState.playerHealth}/${battleState.playerMaxHealth}`,
            playerInfoPos.x,
            playerInfoPos.y + 25,
            18,
            '#fff',
            'left'
        );
        this.renderer.drawText(
            `Nectar ${battleState.playerNectar}/10`,
            playerInfoPos.x,
            playerInfoPos.y + 50,
            18,
            '#fff',
            'left'
        );
        this.renderer.drawText(
            `Deck ${battleState.playerDeckCount}/30`,
            playerInfoPos.x,
            playerInfoPos.y + 75,
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

        // Start timer if it's player's turn
        if (battleState.turnPlayer === 'player' && !this.timerInterval) {
            this.startTurnTimer(onButtonClick);
        } else if (battleState.turnPlayer !== 'player' && this.timerInterval) {
            this.stopTurnTimer();
        }

        // Action buttons with consistent positioning (x=1149, width=120)
        const btnX = 1149;
        const btnWidth = 120;
        const btnHeight = 50;

        // Toggle Hand button
        this.renderer.drawButton(this.showHand ? 'Hide Hand' : 'Show Hand', btnX, 131, btnWidth, btnHeight);
        this.clickManager.addRegion({
            id: 'toggle-hand',
            x: btnX,
            y: 131,
            width: btnWidth,
            height: btnHeight,
            callback: () => {
                this.showHand = !this.showHand;
                this.render(battleState, onButtonClick);
            },
        });

        // Forfeit button
        this.renderer.drawButton('Forfeit', btnX, 191, btnWidth, btnHeight);
        this.clickManager.addRegion({
            id: 'forfeit',
            x: btnX,
            y: 191,
            width: btnWidth,
            height: btnHeight,
            callback: () => onButtonClick('btn-back'),
        });

        // End Turn button with timer
        const endTurnText = battleState.turnPlayer === 'player'
            ? `End Turn (${this.turnTimer})`
            : 'End Turn';
        this.renderer.drawButton(endTurnText, btnX, 251, btnWidth, btnHeight);
        this.clickManager.addRegion({
            id: 'end-turn',
            x: btnX,
            y: 251,
            width: btnWidth,
            height: btnHeight,
            callback: () => {
                this.stopTurnTimer();
                onButtonClick('btn-end-turn');
            },
        });

        // Render player's hand if toggled on
        if (this.showHand && battleState.playerHand.length > 0) {
            await this.renderPlayerHand(battleState.playerHand, battleState.playerNectar, onButtonClick);
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
                if (player === 'player' && this.selectedBeastIndex === index) {
                    this.renderer.ctx.strokeStyle = '#FFD700'; // Gold highlight
                    this.renderer.ctx.lineWidth = 5;
                    this.renderer.ctx.strokeRect(pos.x - 3, pos.y - 3, cardWidth + 6, cardHeight + 6);
                }

                // Draw the card with the image
                this.renderer.drawBeastCard(pos.x, pos.y, beast, cardImage);

                // Add click regions
                if (player === 'player') {
                    // Player beasts - click to select for attacking
                    this.clickManager.addRegion({
                        id: `select-beast-${index}`,
                        x: pos.x,
                        y: pos.y,
                        width: cardWidth,
                        height: cardHeight,
                        callback: () => {
                            if (this.currentBattleState?.turnPlayer === 'player' && !beast.summoningSickness) {
                                this.selectedBeastIndex = index;
                                if (this.currentBattleState && this.currentButtonCallback) {
                                    this.render(this.currentBattleState, this.currentButtonCallback);
                                }
                            }
                        },
                    });
                } else {
                    // Opponent beasts - click to attack with selected beast
                    this.clickManager.addRegion({
                        id: `attack-beast-${index}`,
                        x: pos.x,
                        y: pos.y,
                        width: cardWidth,
                        height: cardHeight,
                        callback: () => {
                            if (this.selectedBeastIndex !== null && this.currentButtonCallback) {
                                this.currentButtonCallback(`action-attack-beast-${this.selectedBeastIndex}-${index}`);
                                this.selectedBeastIndex = null;
                            }
                        },
                    });
                }
            }
        }

        // If player has selected a beast, allow direct attack on opponent
        if (player === 'opponent' && this.selectedBeastIndex !== null && beasts.length === 0) {
            // Add click region for opponent's player area (direct attack)
            const opponentInfoPos = battleBoardAssetPositions.playOneInfoPosition;
            this.clickManager.addRegion({
                id: 'attack-opponent-direct',
                x: opponentInfoPos.x - 50,
                y: opponentInfoPos.y - 20,
                width: 200,
                height: 100,
                callback: () => {
                    if (this.selectedBeastIndex !== null && this.currentButtonCallback) {
                        this.currentButtonCallback(`action-attack-player-${this.selectedBeastIndex}`);
                        this.selectedBeastIndex = null;
                    }
                },
            });
        }
    }

    private async renderPlayerHand(hand: any[], playerNectar: number, onButtonClick: (buttonId: string) => void): Promise<void> {
        // Render hand in bottom area
        const startX = 100;
        const startY = 550;
        const cardWidth = 150;
        const cardHeight = 200;
        const spacing = 10;

        // Draw semi-transparent background for hand area
        this.renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.renderer.ctx.fillRect(50, 530, 1000, 230);

        // First, add blocking click region for empty space to prevent clicking through
        // Added FIRST so when checking in reverse order, card regions (added after) have priority
        this.clickManager.addRegion({
            id: 'hand-background-blocker',
            x: 50,
            y: 530,
            width: 1000,
            height: 230,
            callback: () => {
                // Do nothing - just block clicks to battlefield below
            },
        });

        // Then add all card click regions
        for (let i = 0; i < hand.length && i < 5; i++) {
            const card = hand[i];
            const x = startX + i * (cardWidth + spacing);
            const y = startY;

            // Load card image (scaled down)
            const cardImage = await this.assets.loadCardImage(card.name, card.affinity);

            // Draw card
            if (cardImage) {
                this.renderer.ctx.drawImage(cardImage, x, y, cardWidth, cardHeight);
            }

            // Highlight if affordable
            const canAfford = card.cost <= playerNectar;
            if (canAfford) {
                this.renderer.ctx.strokeStyle = '#43e97b';
                this.renderer.ctx.lineWidth = 3;
                this.renderer.ctx.strokeRect(x, y, cardWidth, cardHeight);
            }

            // Draw cost
            this.renderer.ctx.fillStyle = '#fff';
            this.renderer.ctx.font = 'bold 20px Arial';
            this.renderer.ctx.textAlign = 'center';
            this.renderer.ctx.strokeStyle = '#000';
            this.renderer.ctx.lineWidth = 2;
            this.renderer.ctx.strokeText(`${card.cost}`, x + 20, y + 30);
            this.renderer.ctx.fillText(`${card.cost}`, x + 20, y + 30);

            // Add click region to play card
            this.clickManager.addRegion({
                id: `play-card-${i}`,
                x,
                y,
                width: cardWidth,
                height: cardHeight,
                callback: () => {
                    if (canAfford) {
                        onButtonClick(`action-play-card-${i}`);
                    }
                },
            });
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
        this.selectedBeastIndex = null;
        this.showHand = true; // Reset to default (shown)

        // Clear regions
        this.clickManager.clearRegions();

        // Clear canvas to prevent artifacts
        this.renderer.clear();
    }
}
