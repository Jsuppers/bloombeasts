/**
 * Settings Screen Renderer
 */

import { SoundSettings } from '../../../../bloombeasts/systems/SoundManager';
import { MenuStats } from '../../../../bloombeasts/gameManager';
import { CanvasRenderer } from '../utils/canvasRenderer';
import { ClickRegionManager } from '../utils/clickRegionManager';
import { AssetLoader } from '../utils/assetLoader';
import { cardsUIContainerDimensions, sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { sideMenuPositions, cardsUIContainerPosition } from '../../../../shared/constants/positions';
import { DIMENSIONS, GAPS } from '../../../../shared/styles/dimensions';
import { COLORS } from '../../../../shared/styles/colors';

export class SettingsScreen {
    constructor(
        private renderer: CanvasRenderer,
        private clickManager: ClickRegionManager,
        private assets: AssetLoader
    ) {}

    async render(
        settings: SoundSettings,
        onSettingChange: (settingId: string, value: any) => void,
        onBack: () => void,
        stats?: MenuStats
    ): Promise<void> {
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
                    const clickCallback = (this.clickManager as any).buttonCallback;
                    if (clickCallback) {
                        clickCallback(`show-counter-info:${title}:${message}`);
                    }
                },
            });
        }

        // Draw CardsContainer.png
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

        // Get button images
        const standardButtonImg = this.assets.getImage('standardButton');
        const greenButtonImg = this.assets.getImage('greenButton');

        // Draw title on side menu
        const textPos = sideMenuPositions.textStartPosition;
        this.renderer.drawText('Settings', textPos.x, textPos.y, DIMENSIONS.fontSize.lg, COLORS.textPrimary, 'left');

        // Settings content area
        const contentX = 180;
        let contentY = 180;
        const lineHeight = 80;

        // Music Volume
        this.renderer.drawText('Music Volume', contentX, contentY, DIMENSIONS.fontSize.xl, COLORS.textPrimary, 'left');
        this.renderer.drawText(`${settings.musicVolume}%`, contentX + 400, contentY, DIMENSIONS.fontSize.xl, COLORS.success, 'right');

        // Volume slider background
        const sliderX = contentX;
        const sliderY = contentY + 30;
        const sliderWidth = 400;
        const sliderHeight = 10;
        this.renderer.ctx.fillStyle = '#333';
        this.renderer.ctx.fillRect(sliderX, sliderY, sliderWidth, sliderHeight);

        // Volume slider fill
        const fillWidth = (settings.musicVolume / 100) * sliderWidth;
        this.renderer.ctx.fillStyle = COLORS.success;
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
        this.renderer.drawText('Music', contentX, contentY, DIMENSIONS.fontSize.xl, COLORS.textPrimary, 'left');
        if (standardButtonImg && greenButtonImg) {
            const toggleButtonX = contentX + 300;
            const toggleButtonY = contentY - 20;

            if (settings.musicEnabled) {
                this.renderer.drawGreenButton('ON', toggleButtonX, toggleButtonY, greenButtonImg);
            } else {
                this.renderer.drawStandardButton('OFF', toggleButtonX, toggleButtonY, standardButtonImg);
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
        this.renderer.drawText('SFX Volume', contentX, contentY, DIMENSIONS.fontSize.xl, COLORS.textPrimary, 'left');
        this.renderer.drawText(`${settings.sfxVolume}%`, contentX + 400, contentY, DIMENSIONS.fontSize.xl, COLORS.success, 'right');

        // Volume slider background
        const sfxSliderX = contentX;
        const sfxSliderY = contentY + 30;
        this.renderer.ctx.fillStyle = '#333';
        this.renderer.ctx.fillRect(sfxSliderX, sfxSliderY, sliderWidth, sliderHeight);

        // Volume slider fill
        const sfxFillWidth = (settings.sfxVolume / 100) * sliderWidth;
        this.renderer.ctx.fillStyle = COLORS.success;
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
        this.renderer.drawText('Sound Effects', contentX, contentY, DIMENSIONS.fontSize.xl, COLORS.textPrimary, 'left');
        if (standardButtonImg && greenButtonImg) {
            const sfxToggleButtonX = contentX + 300;
            const sfxToggleButtonY = contentY - 20;

            if (settings.sfxEnabled) {
                this.renderer.drawGreenButton('ON', sfxToggleButtonX, sfxToggleButtonY, greenButtonImg);
            } else {
                this.renderer.drawStandardButton('OFF', sfxToggleButtonX, sfxToggleButtonY, standardButtonImg);
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
            this.renderer.drawStandardButton('Back', backBtnX, backBtnY, standardButtonImg);
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
