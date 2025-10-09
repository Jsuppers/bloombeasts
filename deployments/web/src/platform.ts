/**
 * Web Platform Implementation for Bloom Beasts
 * Implements PlatformCallbacks interface using Canvas-based rendering
 */

import {
    PlatformCallbacks,
    MissionDisplay,
    CardDisplay,
    BattleDisplay,
    RewardDisplay,
} from '../../../bloombeasts/gameManager';

import { CanvasRenderer } from './utils/canvasRenderer';
import { AssetLoader } from './utils/assetLoader';
import { ClickRegionManager } from './utils/clickRegionManager';
import { MenuScreen } from './screens/menuScreen';
import { MissionScreen } from './screens/missionScreen';
import { InventoryScreen } from './screens/inventoryScreen';
import { BattleScreen } from './screens/battleScreen';

export class WebPlatform implements PlatformCallbacks {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // Utilities
    private renderer: CanvasRenderer;
    private assets: AssetLoader;
    private clickManager: ClickRegionManager;

    // Screen renderers
    private menuScreen: MenuScreen;
    private missionScreen: MissionScreen;
    private inventoryScreen: InventoryScreen;
    private battleScreen: BattleScreen;

    // Callbacks
    private buttonClickCallback: ((buttonId: string) => void) | null = null;
    private cardSelectCallback: ((cardId: string) => void) | null = null;
    private missionSelectCallback: ((missionId: string) => void) | null = null;

    private currentScreen: string = 'start-menu';

    constructor() {
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        this.canvas = canvas;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = ctx;

        // Initialize utilities
        this.renderer = new CanvasRenderer(this.ctx);
        this.assets = new AssetLoader();
        this.clickManager = new ClickRegionManager(this.canvas);

        // Initialize screen renderers
        this.menuScreen = new MenuScreen(this.renderer, this.clickManager, this.assets);
        this.missionScreen = new MissionScreen(this.renderer, this.clickManager, this.assets);
        this.inventoryScreen = new InventoryScreen(this.renderer, this.clickManager, this.assets);
        this.battleScreen = new BattleScreen(this.renderer, this.clickManager, this.assets);
    }

    async initialize(): Promise<void> {
        // Load all assets before the game starts
        await this.assets.loadAllAssets();
    }

    // UI Rendering Methods
    renderStartMenu(options: string[]): void {
        // Cleanup battle screen if switching from battle
        if (this.currentScreen === 'battle') {
            this.battleScreen.cleanup();
        }

        this.currentScreen = 'start-menu';
        this.menuScreen.render(options, (buttonId) => {
            if (this.buttonClickCallback) {
                this.buttonClickCallback(buttonId);
            }
        });
    }

    renderMissionSelect(missions: MissionDisplay[]): void {
        // Cleanup battle screen if switching from battle
        if (this.currentScreen === 'battle') {
            this.battleScreen.cleanup();
        }

        this.currentScreen = 'missions';
        this.missionScreen.render(
            missions,
            (missionId) => {
                if (this.missionSelectCallback) {
                    this.missionSelectCallback(missionId);
                }
            },
            () => {
                if (this.buttonClickCallback) {
                    this.buttonClickCallback('btn-back');
                }
            }
        );
    }

    renderInventory(cards: CardDisplay[], deckSize: number, deckCardIds: string[]): void {
        // Cleanup battle screen if switching from battle
        if (this.currentScreen === 'battle') {
            this.battleScreen.cleanup();
        }

        this.currentScreen = 'inventory';
        // Use async render but don't block (fire and forget)
        this.inventoryScreen.render(
            cards,
            deckSize,
            deckCardIds,
            (cardId) => {
                if (this.cardSelectCallback) {
                    this.cardSelectCallback(cardId);
                }
            },
            () => {
                if (this.buttonClickCallback) {
                    this.buttonClickCallback('btn-back');
                }
            }
        ).catch(error => {
            console.error('Error rendering inventory:', error);
        });
    }

    renderBattle(battleState: BattleDisplay): void {
        this.currentScreen = 'battle';
        // Use async render but don't block (fire and forget)
        this.battleScreen.render(battleState, (buttonId) => {
            if (this.buttonClickCallback) {
                this.buttonClickCallback(buttonId);
            }
        }).catch(error => {
            console.error('Error rendering battle:', error);
        });
    }

    // Input Handling
    onButtonClick(callback: (buttonId: string) => void): void {
        this.buttonClickCallback = callback;
    }

    onCardSelect(callback: (cardId: string) => void): void {
        this.cardSelectCallback = callback;
    }

    onMissionSelect(callback: (missionId: string) => void): void {
        this.missionSelectCallback = callback;
    }

    // Asset Loading
    async loadCardImage(cardId: string): Promise<any> {
        return `/shared/images/cards/${cardId}.png`;
    }

    async loadBackground(backgroundId: string): Promise<any> {
        return `/shared/images/backgrounds/${backgroundId}.png`;
    }

    playSound(soundId: string): void {
        console.log(`Playing sound: ${soundId}`);
    }

    // Storage
    async saveData(key: string, data: any): Promise<void> {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    }

    async loadData(key: string): Promise<any> {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load data:', error);
            return null;
        }
    }

    // Dialogs
    async showDialog(title: string, message: string, buttons: string[] = ['OK']): Promise<string> {
        return new Promise((resolve) => {
            const modal = document.getElementById('modal-overlay');
            const titleEl = document.getElementById('modal-title');
            const messageEl = document.getElementById('modal-message');
            const buttonsEl = document.getElementById('modal-buttons');

            if (!modal || !titleEl || !messageEl || !buttonsEl) {
                resolve('OK');
                return;
            }

            titleEl.textContent = title;
            messageEl.textContent = message;
            buttonsEl.innerHTML = '';

            buttons.forEach((buttonText) => {
                const btn = document.createElement('button');
                btn.className = 'modal-btn';
                btn.textContent = buttonText;
                btn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    resolve(buttonText);
                });
                buttonsEl.appendChild(btn);
            });

            modal.classList.add('active');
        });
    }

    showRewards(rewards: RewardDisplay): void {
        let message = `🎉 Rewards Earned! 🎉\n\n`;
        message += `XP: +${rewards.xp}\n`;

        if (rewards.nectar) {
            message += `Nectar: +${rewards.nectar}\n`;
        }

        if (rewards.cards && rewards.cards.length > 0) {
            message += `\nCards Received:\n`;
            rewards.cards.forEach((card) => {
                message += `• ${card.name}\n`;
            });
        }

        if (rewards.message) {
            message += `\n${rewards.message}`;
        }

        this.showDialog('Mission Complete!', message, ['Awesome!']);
    }

    updatePlayerStats(playerData: any): void {
        // Could draw this on canvas if needed, for now we'll skip
        console.log('Player stats:', playerData);
    }
}
