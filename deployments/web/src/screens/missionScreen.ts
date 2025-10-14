/**
 * Mission Select Screen Renderer
 */

import { MissionDisplay, MenuStats } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { uiSafeZoneButtons, uiSafeZoneText, sideMenuPositions, cardsUIContainerPosition } from '../../../../shared/constants/positions';
import { sideMenuButtonDimensions, missionCardDimensions, cardsUIContainerDimensions } from '../../../../shared/constants/dimensions';
import { missionEmoji } from '../../../../shared/constants/emojis';

export class MissionScreen {
    private scrollOffset: number = 0;
    private missionsPerRow: number = 3;
    private rowsPerPage: number = 3; // Show 3 rows at a time
    private currentMissions: MissionDisplay[] = [];
    private currentOnMissionSelect: ((missionId: string) => void) | null = null;
    private currentOnBack: (() => void) | null = null;
    private currentStats: MenuStats | undefined = undefined;

    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    render(
        missions: MissionDisplay[],
        onMissionSelect: (missionId: string) => void,
        onBack: () => void,
        stats?: MenuStats
    ): void {
        // Store current state for re-renders (e.g., when scrolling)
        this.currentMissions = missions;
        this.currentOnMissionSelect = onMissionSelect;
        this.currentOnBack = onBack;
        this.currentStats = stats;

        this.clickManager.clearRegions();
        this.renderer.clear();

        // Calculate player info for display
        let playerInfo = undefined;
        if (stats) {
            const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
            const currentLevel = stats.playerLevel;
            const totalXP = stats.totalXP;
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
        if (expBarBounds && playerInfo && stats) {
            this.clickManager.addRegion({
                id: 'player-xp-bar',
                x: expBarBounds.x,
                y: expBarBounds.y,
                width: expBarBounds.width,
                height: Math.max(expBarBounds.height, 20),
                callback: () => {
                    const title = `Level ${playerInfo.level}`;
                    const message = `Current XP: ${playerInfo.currentXP} / ${playerInfo.xpForNextLevel}\n\nTotal XP: ${stats.totalXP}`;
                    // This will be handled through the click manager's button callback
                    const clickCallback = (this.clickManager as any).buttonCallback;
                    if (clickCallback) {
                        clickCallback(`show-counter-info:${title}:${message}`);
                    }
                },
            });
        }

        // Draw CardsContainer.png once as the main container
        const cardsContainerImg = this.assets.getImage('cardsContainer');
        if (cardsContainerImg) {
            this.renderer.ctx.drawImage(
                cardsContainerImg,
                cardsUIContainerPosition.x,
                cardsUIContainerPosition.y,
                cardsUIContainerDimensions.width,
                cardsUIContainerDimensions.height
            );
        }

        // Calculate mission completion count
        const completedCount = missions.filter(m => m.isCompleted).length;
        const totalCount = missions.length;

        // Draw title and completion count on side menu
        const textPos = sideMenuPositions.textStartPosition;
        this.renderer.drawText('Missions', textPos.x, textPos.y, 20, '#fff', 'left');
        this.renderer.drawText(`${missionEmoji} ${completedCount}/${totalCount}`, textPos.x, textPos.y + 25, 18, '#fff', 'left');

        if (missions.length === 0) {
            const centerX = cardsUIContainerPosition.x + cardsUIContainerDimensions.width / 2;
            const centerY = cardsUIContainerPosition.y + cardsUIContainerDimensions.height / 2;
            this.renderer.drawText('No missions available yet.', centerX, centerY, 24, '#fff', 'center');
        } else {
            // Draw missions in a grid within the container (3 missions per row, 3 rows)
            const cardWidth = missionCardDimensions.width;
            const cardHeight = missionCardDimensions.height;
            const marginX = 30; // Left/right margin inside container
            const marginY = 30; // Top/bottom margin inside container
            const gapX = 15; // Gap between cards horizontally
            const gapY = 15; // Gap between cards vertically
            const startX = cardsUIContainerPosition.x + marginX;
            const startY = cardsUIContainerPosition.y + marginY;
            const spacingX = cardWidth + gapX;
            const spacingY = cardHeight + gapY;

            // Calculate visible mission range based on scroll (show 3 rows at a time = 9 missions)
            const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
            const startIndex = this.scrollOffset * missionsPerPage;
            const endIndex = Math.min(startIndex + missionsPerPage, missions.length);
            const visibleMissions = missions.slice(startIndex, endIndex);

            for (let i = 0; i < visibleMissions.length; i++) {
                const mission = visibleMissions[i];
                const row = Math.floor(i / this.missionsPerRow);
                const col = i % this.missionsPerRow;
                const x = startX + col * spacingX;
                const y = startY + row * spacingY;

                // Load mission-specific background image based on affinity
                let missionImageName = 'ForestMission'; // Default
                if (mission.affinity === 'Water') missionImageName = 'WaterMission';
                else if (mission.affinity === 'Fire') missionImageName = 'FireMission';
                else if (mission.affinity === 'Sky') missionImageName = 'SkyMission';
                else if (mission.affinity === 'Boss') missionImageName = 'BossMission';

                const missionImg = this.assets.getImage(missionImageName);

                // Load beast image if beastId is provided
                let beastImg = null;
                if (mission.beastId) {
                    beastImg = this.assets.getImage(mission.beastId);
                }

                // Draw mission card (without CardsContainer background)
                this.renderer.drawMissionCard(x, y, cardWidth, cardHeight, mission, null, missionImg, beastImg);

                // Add clickable region if available
                if (mission.isAvailable) {
                    this.clickManager.addRegion({
                        id: mission.id,
                        x,
                        y,
                        width: cardWidth,
                        height: cardHeight,
                        callback: () => onMissionSelect(mission.id),
                    });
                }
            }

            // Calculate total pages needed
            const totalPages = Math.ceil(missions.length / missionsPerPage);

            // Get button images
            const standardButtonImg = this.assets.getImage('sideMenuStandardButton');

            // Button positions on side menu
            const buttonX = sideMenuPositions.buttonStartPosition.x;
            const buttonSpacing = 10;
            const upBtnY = sideMenuPositions.buttonStartPosition.y;
            const downBtnY = upBtnY + sideMenuButtonDimensions.height + buttonSpacing;

            if (standardButtonImg) {
                // Up arrow button (always visible, disabled if can't scroll up)
                const canScrollUp = this.scrollOffset > 0;
                if (canScrollUp) {
                    this.renderer.drawSideMenuStandardButton('↑', buttonX, upBtnY, standardButtonImg);
                    this.clickManager.addRegion({
                        id: 'scroll-up',
                        x: buttonX,
                        y: upBtnY,
                        width: sideMenuButtonDimensions.width,
                        height: sideMenuButtonDimensions.height,
                        callback: () => {
                            this.scrollOffset = Math.max(0, this.scrollOffset - 1);
                            // Re-render with new offset
                            this.render(this.currentMissions, this.currentOnMissionSelect!, this.currentOnBack!, this.currentStats);
                        },
                    });
                } else {
                    this.renderer.drawSideMenuDisabledButton('↑', buttonX, upBtnY, standardButtonImg);
                }

                // Down arrow button (always visible, disabled if can't scroll down)
                const canScrollDown = this.scrollOffset < totalPages - 1;
                if (canScrollDown) {
                    this.renderer.drawSideMenuStandardButton('↓', buttonX, downBtnY, standardButtonImg);
                    this.clickManager.addRegion({
                        id: 'scroll-down',
                        x: buttonX,
                        y: downBtnY,
                        width: sideMenuButtonDimensions.width,
                        height: sideMenuButtonDimensions.height,
                        callback: () => {
                            this.scrollOffset = Math.min(totalPages - 1, this.scrollOffset + 1);
                            // Re-render with new offset
                            this.render(this.currentMissions, this.currentOnMissionSelect!, this.currentOnBack!, this.currentStats);
                        },
                    });
                } else {
                    this.renderer.drawSideMenuDisabledButton('↓', buttonX, downBtnY, standardButtonImg);
                }
            }
        }

        // Get button image
        const standardButtonImg = this.assets.getImage('sideMenuStandardButton');

        // Back button at header position
        const backBtnX = sideMenuPositions.headerStartPosition.x;
        const backBtnY = sideMenuPositions.headerStartPosition.y;
        if (standardButtonImg) {
            this.renderer.drawSideMenuStandardButton('Back', backBtnX, backBtnY, standardButtonImg);
            this.clickManager.addRegion({
                id: 'back',
                x: backBtnX,
                y: backBtnY,
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                callback: onBack,
            });
        }
    }
}
