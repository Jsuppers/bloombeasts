/**
 * Web Platform Implementation - New UI System
 * Uses the new Horizon-like component system
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
import { UIRenderer, GenericDialog, RewardsDialog, View } from './ui';

// Import new screens
import { LoadingScreen } from './screens/loadingScreen';
import { MenuScreenNew } from './screens/menuScreen.new';
import { SettingsScreenNew } from './screens/settingsScreen.new';
import { CardsScreenNew } from './screens/cardsScreen.new';
import { MissionScreenNew } from './screens/missionScreen.new';
import { BattleScreenNew } from './screens/battleScreen.new';

// Keep legacy imports for compatibility
import { AssetLoader } from './utils/assetLoader';
import { CardDetailScreen } from './screens/cardDetailScreen';
import { MissionCompletePopup } from '../../../bloombeasts/screens/missions/MissionCompletePopup';

export class WebPlatformNew implements PlatformCallbacks {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // UI System
    private uiRenderer: UIRenderer;
    private assets: AssetLoader;

    // Dialogs
    private genericDialog: GenericDialog;
    private rewardsDialog: RewardsDialog;

    // New screen implementations
    private loadingScreen: LoadingScreen;
    private menuScreen: MenuScreenNew;
    private settingsScreen: SettingsScreenNew;
    private cardsScreen: CardsScreenNew;
    private missionScreen: MissionScreenNew;
    public battleScreen: BattleScreenNew; // Public for gameManager access

    // Legacy screens (to be refactored)
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
    private currentUI: any = null; // Current UI tree

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

        // Initialize UI system
        this.uiRenderer = new UIRenderer(this.canvas, this.ctx);
        this.assets = new AssetLoader();

        // Initialize dialogs
        this.genericDialog = new GenericDialog();
        this.rewardsDialog = new RewardsDialog();

        // Initialize player data
        this.playerData = this.getDefaultPlayerData();

        // Initialize new screens
        this.loadingScreen = new LoadingScreen();
        this.menuScreen = new MenuScreenNew();
        this.settingsScreen = new SettingsScreenNew();
        this.cardsScreen = new CardsScreenNew();
        this.missionScreen = new MissionScreenNew();
        this.battleScreen = new BattleScreenNew();

        // Initialize legacy screens (temporary)
        this.cardDetailScreen = new CardDetailScreen(
            null as any,
            null as any,
            this.assets
        );
        this.missionCompletePopup = new MissionCompletePopup();

        // Initialize audio
        this.initializeAudio();

        // Setup popup render callback
        this.missionCompletePopup.setRenderCallback(() => {
            this.renderMissionCompletePopupInternal();
        });

        // Setup SFX callback for cards screen
        this.cardsScreen.setPlaySfxCallback((src: string) => {
            this.playSoundEffect(src);
        });
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
        // Show loading screen
        this.showLoadingScreen();

        // Load all assets
        await this.assets.loadAllAssets();

        // Pass loaded images to UIRenderer
        const images = new Map<string, HTMLImageElement>();
        const allImages = this.assets.getAllImages();
        Object.keys(allImages).forEach(key => {
            images.set(key, allImages[key]);
        });
        this.uiRenderer.setImages(images);

        this.loadingScreen.setProgress(100);
    }

    private showLoadingScreen(): void {
        const ui = this.loadingScreen.createUI();
        this.currentUI = ui;
        this.uiRenderer.render(ui);
    }

    private initializeAudio(): void {
        this.musicAudio = new Audio();
        this.musicAudio.loop = true;

        for (let i = 0; i < 5; i++) {
            const sfxAudio = new Audio();
            this.sfxAudioPool.push(sfxAudio);
        }
    }

    // ============= Screen Rendering Methods =============

    renderStartMenu(options: string[], stats: MenuStats): void {
        console.log('renderStartMenu called with:', { options, stats });
        this.currentScreen = 'start-menu';

        // Update menu screen with data
        this.menuScreen.update(options, stats, (buttonId: string) => {
            if (this.buttonClickCallback) {
                this.buttonClickCallback(buttonId);
            }
        });

        // Create and render UI
        const ui = this.menuScreen.createUI(options);
        console.log('Menu UI created:', ui);
        this.currentUI = ui;
        this.renderCurrentScreenWithDialogs();
        console.log('Menu rendered!');
    }

    renderMissionSelect(missions: MissionDisplay[], stats: MenuStats): void {
        this.currentScreen = 'missions';

        // Update mission screen
        this.missionScreen.update(
            missions,
            (missionId: string) => {
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

        // Set up render callback for scroll updates
        this.missionScreen.setRenderCallback(() => {
            this.currentUI = this.missionScreen.createUI();
            this.renderCurrentScreenWithDialogs();
        });

        // Create and render UI
        const ui = this.missionScreen.createUI();
        this.currentUI = ui;
        this.renderCurrentScreenWithDialogs();
    }

    renderCards(cards: CardDisplay[], deckSize: number, deckCardIds: string[], stats: MenuStats): void {
        this.currentScreen = 'cards';

        // Update cards data in playerData
        this.playerData.cards.deck = deckCardIds;

        // Update cards screen
        this.cardsScreen.update(
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
        );

        // Set up render callback for scroll updates
        this.cardsScreen.setRenderCallback(() => {
            this.currentUI = this.cardsScreen.createUI();
            this.renderCurrentScreenWithDialogs();
        });

        // Create and render UI
        const ui = this.cardsScreen.createUI();
        this.currentUI = ui;
        this.renderCurrentScreenWithDialogs();
    }

    renderSettings(settings: SoundSettings, stats: MenuStats): void {
        this.currentScreen = 'settings';

        // Update settings screen
        this.settingsScreen.update(
            settings,
            (settingId: string, value: any) => {
                if (this.settingsChangeCallback) {
                    this.settingsChangeCallback(settingId, value);
                }
            },
            () => {
                if (this.buttonClickCallback) {
                    this.buttonClickCallback('btn-back');
                }
            },
            stats
        );

        // Set up render callback for slider updates
        this.settingsScreen.setRenderCallback(() => {
            this.currentUI = this.settingsScreen.createUI();
            this.renderCurrentScreenWithDialogs();
        });

        // Create and render UI
        const ui = this.settingsScreen.createUI();
        this.currentUI = ui;
        this.renderCurrentScreenWithDialogs();
    }

    renderBattle(battleData: BattleDisplay): void {
        console.log('[Platform] renderBattle called with data:', {
            playerHealth: battleData.playerHealth,
            opponentHealth: battleData.opponentHealth,
            currentTurn: battleData.currentTurn,
            turnPlayer: battleData.turnPlayer
        });

        if (this.currentScreen === 'cards') {
            // Cleanup cards screen animations if needed
        }

        this.currentScreen = 'battle';

        // Update battle screen
        this.battleScreen.update(battleData, (action: string) => {
            console.log('[Platform] Battle action:', action);
            // Forward action to game manager via button click callback
            if (this.buttonClickCallback) {
                this.buttonClickCallback(action);
            }
        });

        // Create and render UI
        console.log('[Platform] Creating battle UI...');
        try {
            const ui = this.battleScreen.createUI();
            console.log('[Platform] Battle UI created:', ui ? 'Success' : 'Failed');
            this.currentUI = ui;
            console.log('[Platform] Calling renderCurrentScreenWithDialogs...');
            this.renderCurrentScreenWithDialogs();
            console.log('[Platform] renderBattle complete');
        } catch (error) {
            console.error('[Platform] Error creating battle UI:', error);
            // Show error dialog
            this.showDialog(
                'Battle Error',
                `Failed to create battle screen: ${error instanceof Error ? error.message : String(error)}`,
                ['OK']
            );
        }
    }

    // Legacy methods for compatibility
    renderCardDetail(cardDetail: CardDetailDisplay, stats: MenuStats): void {
        this.currentScreen = 'card-detail';
        // TODO: Implement with new UI system
        console.warn('Card detail screen not yet implemented with new UI system');
    }

    renderMissionCompletePopup(
        mission: any,
        rewards: any
    ): void {
        this.missionCompletePopup.show(mission, rewards);
    }

    private renderMissionCompletePopupInternal(): void {
        if (this.missionCompletePopup.isVisible()) {
            const images = {}; // TODO: Load proper images
            this.missionCompletePopup.render(this.ctx, images);
        }
    }

    hideMissionCompletePopup(): void {
        this.missionCompletePopup.hide();
    }

    // ============= Callback Registration =============

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

    // ============= Asset Loading Methods =============

    async loadCardImage(cardId: string): Promise<any> {
        return this.assets.loadCardAssets({ id: cardId } as any, 'default');
    }

    async loadBackground(backgroundId: string): Promise<any> {
        return this.assets.getImage(backgroundId);
    }

    playSound(soundId: string): void {
        this.playSoundEffect(soundId);
    }

    // ============= Audio Methods =============

    playMusic(src: string, loop: boolean = true, volume: number = 0.5): void {
        if (!this.musicAudio) return;

        if (this.autoplayPromptShown) {
            this.musicAudio.src = src;
            this.musicAudio.loop = loop;
            this.musicAudio.volume = volume;
            this.musicAudio.play().catch(err => {
                console.warn('Music autoplay blocked:', err);
            });
        } else {
            this.pendingMusic = { src, loop, volume };
        }
    }

    stopMusic(): void {
        if (this.musicAudio) {
            this.musicAudio.pause();
            this.musicAudio.currentTime = 0;
        }
    }

    playSoundEffect(src: string, volume: number = 0.5): void {
        const availableAudio = this.sfxAudioPool.find(audio => audio.paused);
        if (availableAudio) {
            availableAudio.src = src;
            availableAudio.volume = volume;
            availableAudio.play().catch(err => {
                console.warn('SFX play failed:', err);
            });
        }
    }

    playSfx(src: string, volume: number = 0.5): void {
        this.playSoundEffect(src, volume);
    }

    setMusicVolume(volume: number): void {
        if (this.musicAudio) {
            this.musicAudio.volume = volume / 100;
        }
    }

    setSfxVolume(volume: number): void {
        // Store for future SFX plays
        // SFX volume is applied when playing
    }

    setCardsSfxCallback(callback: (src: string) => void): void {
        this.cardsScreen.setPlaySfxCallback(callback);
    }

    enableAudioAfterUserInteraction(): void {
        if (!this.autoplayPromptShown) {
            this.autoplayPromptShown = true;

            if (this.pendingMusic && this.musicAudio) {
                this.musicAudio.src = this.pendingMusic.src;
                this.musicAudio.loop = this.pendingMusic.loop;
                this.musicAudio.volume = this.pendingMusic.volume;
                this.musicAudio.play().catch(err => {
                    console.warn('Pending music play failed:', err);
                });
                this.pendingMusic = null;
            }
        }
    }

    // ============= Player Data Methods =============

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

        const XP_THRESHOLDS = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
        let newLevel = 1;
        for (let i = 1; i < XP_THRESHOLDS.length; i++) {
            if (this.playerData.totalXP >= XP_THRESHOLDS[i]) {
                newLevel = i + 1;
            } else {
                break;
            }
        }

        this.playerData.level = Math.min(newLevel, 9);
    }

    updatePlayerStats(playerData: any): void {
        this.setPlayerData(playerData);
    }

    // ============= Data Persistence =============

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

    // ============= UI Dialogs =============

    async showDialog(title: string, message: string, buttons?: string[]): Promise<string> {
        // Show dialog and wait for user interaction
        const result = await this.genericDialog.show(title, message, buttons);

        // Re-render with dialog overlay
        this.renderCurrentScreenWithDialogs();

        return result;
    }

    async showRewards(rewards: RewardDisplay): Promise<void> {
        // Show rewards and wait for user to continue
        await this.rewardsDialog.show(rewards);

        // Re-render after dialog is closed
        this.renderCurrentScreenWithDialogs();
    }

    /**
     * Re-render the current screen with any active dialogs
     */
    private renderCurrentScreenWithDialogs(): void {
        console.log('renderCurrentScreenWithDialogs called, currentUI:', this.currentUI);
        if (this.currentUI) {
            // Create a composite UI with dialogs overlayed
            const compositeUI = View({
                style: {
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                },
                children: [
                    this.currentUI,
                    this.genericDialog.createUI(),
                    this.rewardsDialog.createUI(),
                ],
            });

            console.log('About to render composite UI:', compositeUI);
            this.uiRenderer.render(compositeUI);
            console.log('Composite UI rendered!');
        } else {
            console.warn('No currentUI to render!');
        }
    }

    // ============= Cleanup =============

    destroy(): void {
        this.menuScreen.destroy();
        this.settingsScreen.destroy();
        this.cardsScreen.destroy();
        this.missionScreen.destroy();
        this.battleScreen.destroy();
        this.uiRenderer.destroy();
    }
}
