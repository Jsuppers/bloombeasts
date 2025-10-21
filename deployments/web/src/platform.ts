/**
 * Web Platform Implementation for Bloom Beasts
 * Implements PlatformCallbacks interface using Canvas-based rendering
 */

import {
    PlatformCallbacks,
    MissionDisplay,
    CardDisplay,
    CardDetailDisplay,
    BattleDisplay,
    RewardDisplay,
    MenuStats,
    PlayerData,
} from '../../../bloombeasts/gameManager';

import { SoundSettings } from '../../../bloombeasts/systems/SoundManager';
import { CanvasRenderer } from './utils/canvasRenderer';
import { AssetLoader } from './utils/assetLoader';
import { ClickRegionManager } from './utils/clickRegionManager';
import { MenuScreen } from './screens/menuScreen';
import { MissionScreen } from './screens/missionScreen';
import { CardsScreen } from './screens/cardsScreen';
import { BattleScreen } from './screens/battleScreen';
import { SettingsScreen } from './screens/settingsScreen';
import { CardDetailScreen } from './screens/cardDetailScreen';
import { MissionCompletePopup } from '../../../bloombeasts/screens/missions/MissionCompletePopup';
import { Mission } from '../../../bloombeasts/screens/missions/types';
import { RewardResult } from '../../../bloombeasts/screens/missions/MissionManager';

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
    private cardsScreen: CardsScreen;
    public battleScreen: BattleScreen; // Make public so gameManager can access it
    private settingsScreen: SettingsScreen;
    private cardDetailScreen: CardDetailScreen;
    private missionCompletePopup: MissionCompletePopup;

    // Player Data
    private playerData: PlayerData;

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

        // Initialize player data with defaults (will be overwritten if saved data exists)
        this.playerData = this.getDefaultPlayerData();

        // Initialize screen renderers
        this.menuScreen = new MenuScreen(this.renderer, this.clickManager, this.assets);
        this.missionScreen = new MissionScreen(this.renderer, this.clickManager, this.assets);
        this.cardsScreen = new CardsScreen(this.renderer, this.clickManager, this.assets);
        this.battleScreen = new BattleScreen(this.renderer, this.clickManager, this.assets);
        this.settingsScreen = new SettingsScreen(this.renderer, this.clickManager, this.assets);
        this.cardDetailScreen = new CardDetailScreen(this.renderer, this.clickManager, this.assets);
        this.missionCompletePopup = new MissionCompletePopup();

        // Initialize audio
        this.initializeAudio();

        // Setup popup render callback
        this.missionCompletePopup.setRenderCallback(() => {
            this.renderMissionCompletePopupInternal();
        });
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

    private getDefaultPlayerData(): PlayerData {
        return {
            name: 'Player',
            level: 1,
            totalXP: 0,
            cards: {
                collected: [],
                deck: []
            },
            missions: {
                completedMissions: {}
            },
            items: []
        };
    }

    async initialize(): Promise<void> {
        // Load all assets before the game starts
        await this.assets.loadAllAssets();
    }

    /**
     * Set the SFX callback for cards screen scroll buttons
     */
    setCardsSfxCallback(callback: (src: string) => void): void {
        this.cardsScreen.setPlaySfxCallback(callback);
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

    renderMissionSelect(missions: MissionDisplay[], stats: MenuStats): void {
        // Cleanup battle screen if switching from battle
        if (this.currentScreen === 'battle') {
            this.battleScreen.cleanup();
        }

        this.currentScreen = 'missions';

        // Clear canvas before rendering new screen to prevent artifacts
        this.renderer.clear();

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
            },
            stats
        );
    }

    renderCards(cards: CardDisplay[], deckSize: number, deckCardIds: string[], stats: MenuStats): void {
        // Cleanup battle screen if switching from battle
        if (this.currentScreen === 'battle') {
            this.battleScreen.cleanup();
        }

        // Update cards data in playerData
        this.playerData.cards.deck = deckCardIds;

        this.currentScreen = 'cards';
        // Use async render but don't block (fire and forget)
        this.cardsScreen.render(
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
            },
            stats
        ).catch(error => {
            console.error('Error rendering cards:', error);
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

    renderSettings(settings: SoundSettings, stats: MenuStats): void {
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
            },
            stats
        ).catch(error => {
            console.error('Error rendering settings:', error);
        });
    }

    renderCardDetail(cardDetail: CardDetailDisplay, stats: MenuStats): void {
        // Don't change currentScreen - we want to render on top of the current screen
        // Use async render but don't block (fire and forget)
        this.cardDetailScreen.render(
            cardDetail,
            stats,
            (buttonId) => {
                if (this.buttonClickCallback) {
                    this.buttonClickCallback(buttonId);
                }
            }
        ).catch(error => {
            console.error('Error rendering card detail:', error);
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

    async showRewards(rewards: RewardDisplay): Promise<void> {
        // This method is now deprecated in favor of showMissionComplete
        // Keep it for backwards compatibility, but use old dialog approach
        let message = `🎉 Rewards Earned! 🎉\n\n`;
        message += `XP: +${rewards.xp}\n`;

        if (rewards.cards && rewards.cards.length > 0) {
            message += `\nCards Received:\n`;
            rewards.cards.forEach((card) => {
                message += `• ${card.name}\n`;
            });
        }

        if (rewards.message) {
            message += `\n${rewards.message}`;
        }

        await this.showDialog('Mission Complete!', message, ['Awesome!']);
    }

    /**
     * Show mission complete popup with chest animation
     */
    async showMissionComplete(mission: Mission, rewards: RewardResult): Promise<void> {
        return new Promise((resolve) => {
            // Stop the battle timer but DON'T cleanup/clear the canvas
            // We want the battle screen to remain visible behind the popup backdrop
            if (this.currentScreen === 'battle') {
                // Just stop the timer, don't clear anything
                this.battleScreen.stopTurnTimer();
            }
            this.currentScreen = 'mission-complete';

            // Don't clear click regions yet - we'll set them up when rendering the popup
            // this.clickManager.clearRegions();

            // Setup click handler for popup
            const clickHandler = (event: MouseEvent) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const shouldClose = this.missionCompletePopup.handleClick(x, y);

                if (shouldClose) {
                    // Remove click handler
                    this.canvas.removeEventListener('click', clickHandler);

                    // Hide popup
                    this.missionCompletePopup.hide();

                    // Resolve promise
                    resolve();
                }
            };

            // Add click handler
            this.canvas.addEventListener('click', clickHandler);

            // Show the popup (this will trigger renderMissionCompletePopupInternal via callback)
            this.missionCompletePopup.show(mission, rewards);
        });
    }

    /**
     * Internal method to render the mission complete popup
     */
    private renderMissionCompletePopupInternal(): void {
        if (!this.missionCompletePopup.isVisible()) return;

        // DON'T clear the canvas - we want the battle board to remain visible behind the popup!
        // The popup will draw its own semi-transparent backdrop over the existing battle screen

        // Clear click regions before rendering popup
        this.clickManager.clearRegions();

        // Render the popup on top of the existing battle screen
        this.missionCompletePopup.render(this.ctx, this.assets.getAllImages());
    }

    setPlayerData(data: PlayerData): void {
        console.log('Platform.setPlayerData called with:', {
            cardsCollected: data.cards.collected.length,
            deckSize: data.cards.deck.length,
            itemsCount: data.items.length
        });
        this.playerData = data;
    }

    getPlayerData(): PlayerData {
        return this.playerData;
    }

    async addXP(amount: number): Promise<void> {
        this.playerData.totalXP += amount;

        // Calculate new level based on XP thresholds
        const XP_THRESHOLDS = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
        let newLevel = 1;
        for (let i = 1; i < XP_THRESHOLDS.length; i++) {
            if (this.playerData.totalXP >= XP_THRESHOLDS[i]) {
                newLevel = i + 1;
            } else {
                break;
            }
        }

        this.playerData.level = Math.min(newLevel, 9); // Max level 9
    }

    updatePlayerStats(playerData: any): void {
        // Deprecated - use setPlayerData instead
        this.setPlayerData(playerData);
    }
}
