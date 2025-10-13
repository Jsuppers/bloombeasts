/**
 * Settings Screen Renderer
 */

import { SoundSettings } from '../../../../bloombeasts/systems/SoundManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { sideMenuPositions } from '../../../../shared/constants/positions';

export class SettingsScreen {
    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    async render(
        settings: SoundSettings,
        onSettingChange: (settingId: string, value: any) => void,
        onBack: () => void
    ): Promise<void> {
        this.clickManager.clearRegions();
        this.renderer.clear();

        // Draw common UI (background and side menu)
        const bgImg = this.assets.getImage('background');
        const sideMenuImg = this.assets.getImage('sideMenu');
        this.renderer.drawCommonUI(bgImg, sideMenuImg);

        // Get button images
        const standardButtonImg = this.assets.getImage('sideMenuStandardButton');
        const greenButtonImg = this.assets.getImage('sideMenuGreenButton');

        // Draw title on side menu
        const textPos = sideMenuPositions.textStartPosition;
        this.renderer.drawText('Settings', textPos.x, textPos.y, 20, '#fff', 'left');

        // Settings content area
        const contentX = 100;
        let contentY = 150;
        const lineHeight = 80;

        // Music Volume
        this.renderer.drawText('Music Volume', contentX, contentY, 24, '#fff', 'left');
        this.renderer.drawText(`${settings.musicVolume}%`, contentX + 400, contentY, 24, '#43e97b', 'right');

        // Volume slider background
        const sliderX = contentX;
        const sliderY = contentY + 30;
        const sliderWidth = 400;
        const sliderHeight = 10;
        this.renderer.ctx.fillStyle = '#333';
        this.renderer.ctx.fillRect(sliderX, sliderY, sliderWidth, sliderHeight);

        // Volume slider fill
        const fillWidth = (settings.musicVolume / 100) * sliderWidth;
        this.renderer.ctx.fillStyle = '#43e97b';
        this.renderer.ctx.fillRect(sliderX, sliderY, fillWidth, sliderHeight);

        // Add clickable region for music volume slider
        this.clickManager.addRegion({
            id: 'music-volume-slider',
            x: sliderX,
            y: sliderY - 10,
            width: sliderWidth,
            height: sliderHeight + 20,
            callback: (clickX?: number) => {
                if (clickX === undefined) return;
                const relativeX = clickX - sliderX;
                const newVolume = Math.round((relativeX / sliderWidth) * 100);
                const clampedVolume = Math.max(0, Math.min(100, newVolume));
                onSettingChange('music-volume', clampedVolume);
            },
        });

        contentY += lineHeight;

        // Music Toggle
        this.renderer.drawText('Music', contentX, contentY, 24, '#fff', 'left');
        if (standardButtonImg && greenButtonImg) {
            const toggleButtonX = contentX + 300;
            const toggleButtonY = contentY - 20;

            if (settings.musicEnabled) {
                this.renderer.drawSideMenuGreenButton('ON', toggleButtonX, toggleButtonY, greenButtonImg);
            } else {
                this.renderer.drawSideMenuStandardButton('OFF', toggleButtonX, toggleButtonY, standardButtonImg);
            }

            this.clickManager.addRegion({
                id: 'music-toggle',
                x: toggleButtonX,
                y: toggleButtonY,
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                callback: () => onSettingChange('music-enabled', !settings.musicEnabled),
            });
        }

        contentY += lineHeight;

        // SFX Volume
        this.renderer.drawText('SFX Volume', contentX, contentY, 24, '#fff', 'left');
        this.renderer.drawText(`${settings.sfxVolume}%`, contentX + 400, contentY, 24, '#43e97b', 'right');

        // Volume slider background
        const sfxSliderX = contentX;
        const sfxSliderY = contentY + 30;
        this.renderer.ctx.fillStyle = '#333';
        this.renderer.ctx.fillRect(sfxSliderX, sfxSliderY, sliderWidth, sliderHeight);

        // Volume slider fill
        const sfxFillWidth = (settings.sfxVolume / 100) * sliderWidth;
        this.renderer.ctx.fillStyle = '#43e97b';
        this.renderer.ctx.fillRect(sfxSliderX, sfxSliderY, sfxFillWidth, sliderHeight);

        // Add clickable region for SFX volume slider
        this.clickManager.addRegion({
            id: 'sfx-volume-slider',
            x: sfxSliderX,
            y: sfxSliderY - 10,
            width: sliderWidth,
            height: sliderHeight + 20,
            callback: (clickX?: number) => {
                if (clickX === undefined) return;
                const relativeX = clickX - sfxSliderX;
                const newVolume = Math.round((relativeX / sliderWidth) * 100);
                const clampedVolume = Math.max(0, Math.min(100, newVolume));
                onSettingChange('sfx-volume', clampedVolume);
            },
        });

        contentY += lineHeight;

        // SFX Toggle
        this.renderer.drawText('Sound Effects', contentX, contentY, 24, '#fff', 'left');
        if (standardButtonImg && greenButtonImg) {
            const sfxToggleButtonX = contentX + 300;
            const sfxToggleButtonY = contentY - 20;

            if (settings.sfxEnabled) {
                this.renderer.drawSideMenuGreenButton('ON', sfxToggleButtonX, sfxToggleButtonY, greenButtonImg);
            } else {
                this.renderer.drawSideMenuStandardButton('OFF', sfxToggleButtonX, sfxToggleButtonY, standardButtonImg);
            }

            this.clickManager.addRegion({
                id: 'sfx-toggle',
                x: sfxToggleButtonX,
                y: sfxToggleButtonY,
                width: sideMenuButtonDimensions.width,
                height: sideMenuButtonDimensions.height,
                callback: () => onSettingChange('sfx-enabled', !settings.sfxEnabled),
            });
        }

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
