/**
 * Mission Select Screen Renderer
 */

import { MissionDisplay } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { uiSafeZoneButtons, uiSafeZoneText, sideMenuPositions } from '../../../../shared/constants/positions';
import { sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';

export class MissionScreen {
    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    render(
        missions: MissionDisplay[],
        onMissionSelect: (missionId: string) => void,
        onBack: () => void
    ): void {
        this.clickManager.clearRegions();
        this.renderer.clear();

        // Draw background
        const bgImg = this.assets.getImage('background');
        if (bgImg) {
            this.renderer.drawImage(bgImg);
        }

        // Draw side menu background
        const sideMenuImg = this.assets.getImage('sideMenu');
        if (sideMenuImg) {
            this.renderer.drawSideMenuBackground(sideMenuImg);
        }

        // Calculate mission completion count
        const completedCount = missions.filter(m => m.isCompleted).length;
        const totalCount = missions.length;

        // Draw title and completion count on side menu
        const textPos = sideMenuPositions.textStartPosition;
        this.renderer.drawText('Missions', textPos.x, textPos.y, 20, '#fff', 'left');
        this.renderer.drawText(`M: ${completedCount}/${totalCount}`, textPos.x, textPos.y + 25, 18, '#fff', 'left');

        // Draw missions as cards
        const cardWidth = 350;
        const cardHeight = 120;
        const startX = 50;
        const startY = 100;
        const spacing = 140;

        missions.forEach((mission, index) => {
            const x = startX;
            const y = startY + index * spacing;

            this.renderer.drawMissionCard(x, y, cardWidth, cardHeight, mission);

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
        });

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
