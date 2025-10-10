/**
 * Menu Screen Renderer
 */

import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { gameDimensions, sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { sideMenuPositions } from '../../../../shared/constants/positions';

export class MenuScreen {
    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    render(options: string[], onButtonClick: (buttonId: string) => void): void {
        this.clickManager.clearRegions();
        this.renderer.clear();

        // Draw menu background
        const menuImg = this.assets.getImage('menu');
        if (menuImg) {
            this.renderer.drawImage(menuImg);
        }

        // Draw side menu background
        const sideMenuImg = this.assets.getImage('sideMenu');
        if (sideMenuImg) {
            this.renderer.drawSideMenuBackground(sideMenuImg);
        }

        // Draw "Hello!" on side menu
        const textPos = sideMenuPositions.textStartPosition;
        this.renderer.drawText('Hello!', textPos.x, textPos.y, 20, '#fff', 'left');

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

            // Filter to only show missions and inventory
            const menuOptions = options.filter(opt => opt === 'missions' || opt === 'inventory');

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
