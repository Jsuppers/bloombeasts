/**
 * Mission Select Screen Renderer
 */

import { MissionDisplay } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';

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

        // Draw title
        this.renderer.drawText('Select Mission', 50, 30, 36, '#fff');

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

        // Back button
        this.renderer.drawButton('← Back', 1149, 131, 120, 50);
        this.clickManager.addRegion({
            id: 'back',
            x: 1149,
            y: 131,
            width: 120,
            height: 50,
            callback: onBack,
        });
    }
}
