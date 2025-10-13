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
    MenuStats,
} from '../../../bloombeasts/gameManager';

import { SoundSettings } from '../../../bloombeasts/systems/SoundManager';
import { CanvasRenderer } from './utils/canvasRenderer';
import { AssetLoader } from './utils/assetLoader';
import { ClickRegionManager } from './utils/clickRegionManager';
import { MenuScreen } from './screens/menuScreen';
import { MissionScreen } from './screens/missionScreen';
import { InventoryScreen } from './screens/inventoryScreen';
import { BattleScreen } from './screens/battleScreen';
import { SettingsScreen } from './screens/settingsScreen';

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
    private settingsScreen: SettingsScreen;

    // Audio
    private musicAudio: HTMLAudioElement | null = null;
    private sfxAudioPool: HTMLAudioElement[] = [];
    private autoplayPromptShown: boolean = false;
    private pendingMusic: { src: string; loop: boolean; volume: number } | null = null;

    // Callbacks
    private buttonClickCallback: ((buttonId: string) => void) | null = null;
    private cardSelectCallback: ((cardId: string) => void) | null = null;
    private missionSelectCallback: ((missionId: string) => void) | null = null;
    private settingsChangeCallback: ((settingId: string, value: any) => void) | null = null;

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
        this.settingsScreen = new SettingsScreen(this.renderer, this.clickManager, this.assets);

        // Initialize audio
        this.initializeAudio();
    }

    private initializeAudio(): void {
        // Create music audio element
        this.musicAudio = new Audio();
        this.musicAudio.loop = true;

        // Pre-create SFX audio elements pool (reusable)
        for (let i = 0; i < 5; i++) {
            const sfxAudio = new Audio();
            this.sfxAudioPool.push(sfxAudio);
        }
    }

    async initialize(): Promise<void> {
        // Load all assets before the game starts
        await this.assets.loadAllAssets();
    }

    /**
     * Set the SFX callback for inventory screen scroll buttons
     */
    setInventorySfxCallback(callback: (src: string) => void): void {
        this.inventoryScreen.setPlaySfxCallback(callback);
    }

    // UI Rendering Methods
    renderStartMenu(options: string[], stats: MenuStats): void {
        // Cleanup battle screen if switching from battle
        if (this.currentScreen === 'battle') {
            this.battleScreen.cleanup();
        }

        this.currentScreen = 'start-menu';
        this.menuScreen.render(options, stats, (buttonId) => {
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

    renderSettings(settings: SoundSettings): void {
        // Cleanup battle screen if switching from battle
        if (this.currentScreen === 'battle') {
            this.battleScreen.cleanup();
        }

        this.currentScreen = 'settings';
        // Use async render but don't block (fire and forget)
        this.settingsScreen.render(
            settings,
            (settingId, value) => {
                // Trigger callback to game manager
                if (this.settingsChangeCallback) {
                    this.settingsChangeCallback(settingId, value);
                }
                // Re-render with updated settings (will come from game manager)
            },
            () => {
                if (this.buttonClickCallback) {
                    this.buttonClickCallback('btn-back');
                }
            }
        ).catch(error => {
            console.error('Error rendering settings:', error);
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

    onSettingsChange(callback: (settingId: string, value: any) => void): void {
        this.settingsChangeCallback = callback;
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

    // Audio Methods
    playMusic(src: string, loop: boolean, volume: number): void {
        if (!this.musicAudio) return;

        // Set source if different
        if (this.musicAudio.src !== src) {
            this.musicAudio.src = `/shared/audio/${src}`;
        }

        this.musicAudio.loop = loop;
        this.musicAudio.volume = Math.max(0, Math.min(1, volume));

        // Play and handle potential autoplay restrictions
        this.musicAudio.play().catch(error => {
            console.warn('Music autoplay blocked. User interaction required:', error);

            // Show prompt only once
            if (!this.autoplayPromptShown) {
                this.autoplayPromptShown = true;
                this.pendingMusic = { src, loop, volume };

                // Show dialog to enable music
                this.showDialog(
                    'Enable Music?',
                    'Click "Play Music" to enable background music for the game.',
                    ['Play Music', 'No Thanks']
                ).then(response => {
                    if (response === 'Play Music' && this.pendingMusic && this.musicAudio) {
                        // Retry playing music with stored settings
                        this.musicAudio.src = `/shared/audio/${this.pendingMusic.src}`;
                        this.musicAudio.loop = this.pendingMusic.loop;
                        this.musicAudio.volume = Math.max(0, Math.min(1, this.pendingMusic.volume));
                        this.musicAudio.play().catch(err => {
                            console.error('Failed to play music after user interaction:', err);
                        });
                    }
                    this.pendingMusic = null;
                });
            }
        });
    }

    stopMusic(): void {
        if (!this.musicAudio) return;
        this.musicAudio.pause();
        this.musicAudio.currentTime = 0;
    }

    playSfx(src: string, volume: number): void {
        // Find an available audio element from the pool
        let sfxAudio = this.sfxAudioPool.find(audio => audio.paused || audio.ended);

        // If all are busy, use the first one (will interrupt it)
        if (!sfxAudio && this.sfxAudioPool.length > 0) {
            sfxAudio = this.sfxAudioPool[0];
        }

        if (!sfxAudio) return;

        sfxAudio.src = `/shared/audio/${src}`;
        sfxAudio.volume = Math.max(0, Math.min(1, volume));
        sfxAudio.play().catch(error => {
            console.warn('SFX playback failed:', error);
        });
    }

    setMusicVolume(volume: number): void {
        if (!this.musicAudio) return;
        this.musicAudio.volume = Math.max(0, Math.min(1, volume));
    }

    setSfxVolume(volume: number): void {
        // Note: This sets the base volume, but individual SFX calls will use their own volume
        // For now, we'll just log it since SFX volumes are set per-play
        console.log(`SFX volume set to: ${volume}`);
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
