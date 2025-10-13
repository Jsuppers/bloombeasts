/**
 * Battle Screen Renderer
 */

import { BattleDisplay } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { battleBoardAssetPositions, uiSafeZoneButtons, uiSafeZoneText, sideMenuPositions, playboardImagePositions } from '../../../../shared/constants/positions';
import { standardCardDimensions, sideMenuButtonDimensions, habitatShiftCardDimensions } from '../../../../shared/constants/dimensions';
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

        // Draw background image (full screen)
        const backgroundImg = this.assets.getImage('background');
        if (backgroundImg) {
            this.renderer.drawImage(backgroundImg);
        }

        // Draw playboard on top at specific position
        const playboardImg = this.assets.getImage('playboard');
        if (playboardImg) {
            this.renderer.ctx.drawImage(
                playboardImg,
                playboardImagePositions.x,
                playboardImagePositions.y,
                1073,
                572
            );
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

        // Show "Deathmatch!" warning after turn 30 with escalating damage
        if (battleState.currentTurn >= 30) {
            const deathmatchDamage = Math.floor((battleState.currentTurn - 30) / 5) + 1;
            this.renderer.drawText(`Deathmatch! -${deathmatchDamage} HP`, textPos.x, textPos.y + 50, 16, '#ff6b6b', 'left');
        }

        // Get positions from constants
        const opponentInfoPos = battleBoardAssetPositions.playOneInfoPosition;
        const playerInfoPos = battleBoardAssetPositions.playerTwoInfoPosition;
        const opponentHealthPos = battleBoardAssetPositions.playerOne.health;
        const playerHealthPos = battleBoardAssetPositions.playerTwo.health;

        // Draw opponent health
        const opponentHealthText = `${battleState.opponentHealth}/${battleState.opponentMaxHealth}`;
        this.renderer.drawText(
            opponentHealthText,
            opponentHealthPos.x,
            opponentHealthPos.y,
            20,
            '#fff',
            'center'
        );

        // Draw red blink overlay if opponent health is being attacked by player
        if (battleState.attackAnimation &&
            battleState.attackAnimation.targetPlayer === 'health' &&
            battleState.attackAnimation.attackerPlayer === 'player') {
            const textWidth = this.renderer.ctx.measureText(opponentHealthText).width;
            const overlayX = opponentHealthPos.x - textWidth / 2 - 10;
            const overlayY = opponentHealthPos.y - 10;
            this.renderer.drawCardBlinkOverlay(overlayX, overlayY, textWidth + 20, 30, 'rgba(255, 0, 0, 0.4)');
        }

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

        // Draw player health
        const playerHealthText = `${battleState.playerHealth}/${battleState.playerMaxHealth}`;
        this.renderer.drawText(
            playerHealthText,
            playerHealthPos.x,
            playerHealthPos.y,
            20,
            '#fff',
            'center'
        );

        // Draw red blink overlay if player health is being attacked by opponent
        if (battleState.attackAnimation &&
            battleState.attackAnimation.targetPlayer === 'health' &&
            battleState.attackAnimation.attackerPlayer === 'opponent') {
            const textWidth = this.renderer.ctx.measureText(playerHealthText).width;
            const overlayX = playerHealthPos.x - textWidth / 2 - 10;
            const overlayY = playerHealthPos.y - 10;
            this.renderer.drawCardBlinkOverlay(overlayX, overlayY, textWidth + 20, 30, 'rgba(255, 0, 0, 0.4)');
        }

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
        await this.renderTrapZone('player', battleState.playerTrapZone);
        await this.renderTrapZone('opponent', battleState.opponentTrapZone);

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

        // Render card popup if present (should be last so it's on top)
        if (battleState.cardPopup) {
            const card = battleState.cardPopup.card;
            const assets = await this.assets.loadCardAssets(card, 'default');
            await this.renderer.drawCenteredCardPopup(card, assets);
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
                const cardWidth = standardCardDimensions.width;
                const cardHeight = standardCardDimensions.height;

                // Load card assets using the unified method (beasts are always Bloom type)
                const beastCard = { ...beast, type: 'Bloom' }; // Ensure type is set
                const assets = await this.assets.loadCardAssets(beastCard, 'default');

                // Draw the card with layered images (without icons yet)
                this.renderer.drawBeastCard(pos.x, pos.y, beast, assets.mainImage, assets.baseCardImage, assets.affinityIcon, null, null);

                // Highlight if selected (player beasts only)
                if (player === 'player' && this.currentBattleState && this.currentBattleState.selectedBeastIndex === index) {
                    this.renderer.drawCardSelectionHighlight(pos.x, pos.y, cardWidth, cardHeight, '#FFD700', 5);
                }

                // Draw attack animation overlay if this card is attacking or being attacked
                if (this.currentBattleState && this.currentBattleState.attackAnimation) {
                    const anim = this.currentBattleState.attackAnimation;

                    // Check if this is the attacker (green overlay)
                    if (anim.attackerPlayer === player && anim.attackerIndex === index) {
                        this.renderer.drawCardBlinkOverlay(pos.x, pos.y, cardWidth, cardHeight, 'rgba(0, 255, 0, 0.4)');
                    }
                    // Check if this is the target (red overlay)
                    else if (anim.targetPlayer === player && anim.targetIndex === index) {
                        this.renderer.drawCardBlinkOverlay(pos.x, pos.y, cardWidth, cardHeight, 'rgba(255, 0, 0, 0.4)');
                    }
                }

                // Draw action icons on top of everything (for both player and opponent beasts)
                const attackIcon = this.assets.getImage('attackIcon');
                const abilityIcon = this.assets.getImage('abilityIcon');

                // Draw attack icon if beast can attack
                if (attackIcon && beast.summoningSickness === false) {
                    this.renderer.ctx.drawImage(
                        attackIcon,
                        pos.x + 17,
                        pos.y + 44,
                        26,
                        26
                    );
                }

                // Draw ability icon if beast has activated ability available
                if (abilityIcon && beast.ability && beast.ability.trigger === 'Activated' && !beast.usedAbilityThisTurn) {
                    this.renderer.ctx.drawImage(
                        abilityIcon,
                        pos.x + 157,
                        pos.y + 44,
                        26,
                        26
                    );
                }

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

    private async renderTrapZone(player: 'player' | 'opponent', traps: any[]): Promise<void> {
        const positions =
            player === 'player'
                ? battleBoardAssetPositions.playerTwo
                : battleBoardAssetPositions.playerOne;
        const trapSlots = [positions.trapOne, positions.trapTwo, positions.trapThree];

        const trapWidth = 85;
        const trapHeight = 85;

        // Load trap card template once for all trap cards (face-down cards)
        const dummyTrap = { type: 'Trap', name: 'Unknown' };
        const trapAssets = await this.assets.loadCardAssets(dummyTrap, 'battle');
        const trapTemplate = trapAssets.templateImage;

        for (let index = 0; index < trapSlots.length; index++) {
            const pos = trapSlots[index];
            const trap = traps[index];

            if (trap) {
                // Use the TrapCardPlayboard template for face-down trap cards
                this.renderer.drawTrapCardPlayboard(pos.x, pos.y, trapWidth, trapHeight, trapTemplate);

                // Add click region for player's own trap cards only
                if (player === 'player') {
                    this.clickManager.addRegion({
                        id: `view-trap-card-${player}-${index}`,
                        x: pos.x,
                        y: pos.y,
                        width: trapWidth,
                        height: trapHeight,
                        callback: () => {
                            if (this.currentButtonCallback) {
                                this.currentButtonCallback(`view-trap-card-${player}-${index}`);
                            }
                        },
                    });
                }
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
        const habitatWidth = habitatShiftCardDimensions.width;
        const habitatHeight = habitatShiftCardDimensions.height;

        // Load the habitat card assets using unified method
        const habitatCard = { ...habitat, type: 'Habitat', affinity: habitat.affinity || 'Forest' };
        const habitatAssets = await this.assets.loadCardAssets(habitatCard, 'battle');
        const habitatImage = habitatAssets.mainImage;
        const playboardTemplate = habitatAssets.templateImage;

        // Use the new drawHabitatCardPlayboard method
        this.renderer.drawHabitatCardPlayboard(pos.x, pos.y, habitatWidth, habitatHeight, habitatImage, playboardTemplate);

        // Add glowing border to indicate active habitat
        this.renderer.ctx.strokeStyle = '#4caf50'; // Green glow
        this.renderer.ctx.lineWidth = 4;
        this.renderer.ctx.shadowColor = '#4caf50';
        this.renderer.ctx.shadowBlur = 10;
        this.renderer.ctx.strokeRect(pos.x, pos.y, habitatWidth, habitatHeight);

        // Reset shadow
        this.renderer.ctx.shadowColor = 'transparent';
        this.renderer.ctx.shadowBlur = 0;

        // Add "HABITAT ACTIVE" label below the card
        this.renderer.drawText('HABITAT ACTIVE', pos.x + habitatWidth / 2, pos.y + habitatHeight + 15, 12, '#4caf50', 'center');

        // Add click region to view habitat details
        this.clickManager.addRegion({
            id: 'view-habitat',
            x: pos.x,
            y: pos.y,
            width: habitatWidth,
            height: habitatHeight,
            callback: () => {
                if (this.currentButtonCallback) {
                    this.currentButtonCallback('view-habitat-card');
                }
            },
        });
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

            // Load all card assets using the unified method
            const assets = await this.assets.loadCardAssets(card, 'default');

            // Check if affordable
            const canAfford = card.cost <= playerNectar;

            // Use appropriate rendering method based on card type
            if (card.type === 'Bloom') {
                // Load action icons for beast cards in hand
                const attackIcon = this.assets.getImage('attackIcon');
                const abilityIcon = this.assets.getImage('abilityIcon');
                this.renderer.drawBeastCard(x, y, card, assets.mainImage, assets.baseCardImage, assets.affinityIcon, attackIcon, abilityIcon);
            } else if (card.type === 'Magic') {
                this.renderer.drawMagicCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
            } else if (card.type === 'Trap') {
                this.renderer.drawTrapCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
            } else if (card.type === 'Habitat') {
                this.renderer.drawHabitatCard(x, y, card, assets.mainImage, assets.templateImage, assets.baseCardImage);
            } else {
                // Other card types (fallback)
                this.renderer.drawInventoryCard(x, y, cardWidth, cardHeight, card, assets.mainImage, false);
            }

            // Highlight if affordable or dim if not
            if (canAfford) {
                this.renderer.drawCardSelectionHighlight(x, y, cardWidth, cardHeight, '#43e97b', 4);
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
