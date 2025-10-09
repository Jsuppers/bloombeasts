/**
 * Menu Screen Renderer
 */

import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { gameDimensions } from '../../../../shared/constants/dimensions';

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

        // Draw menu options as buttons centered on screen
        const buttonWidth = 300;
        const buttonHeight = 60;
        const startY = 380;
        const spacing = 80;

        options.forEach((option, index) => {
            const x = (gameDimensions.panelWidth - buttonWidth) / 2;
            const y = startY + index * spacing;
            const label = this.getMenuLabel(option);

            this.renderer.drawButton(label, x, y, buttonWidth, buttonHeight);

            this.clickManager.addRegion({
                id: option,
                x,
                y,
                width: buttonWidth,
                height: buttonHeight,
                callback: () => onButtonClick(`btn-${option}`),
            });
        });
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
