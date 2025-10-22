/**
 * Main Entry Point for Web Deployment
 * Uses the new Unified UI System
 */

import { Platform, setPlatform, UIRenderer, Binding } from '../../../bloombeasts/ui';
import { BloomBeastsGame, type PlayerData } from '../../../bloombeasts/ui/screens';
import { GameManager, type PlatformCallbacks, type MenuStats, type CardDisplay, type MissionDisplay, type BattleDisplay, type CardDetailDisplay } from '../../../bloombeasts/gameManager';
import type { SoundSettings } from '../../../bloombeasts/systems/SoundManager';

// Set platform to Web
setPlatform(Platform.web);

/**
 * Web Game Application
 * Wraps the unified game with canvas rendering
 */
class WebGameApp {
    private canvas: HTMLCanvasElement;
    private renderer: UIRenderer;
    private game: BloomBeastsGame;
    private gameManager: GameManager;
    private playerData = new Binding(null);
    private uiTree: any = null; // Store the UI tree
    private gameCallbacks: {
        onButtonClick: ((buttonId: string) => void) | null;
        onCardSelect: ((cardId: string) => void) | null;
        onMissionSelect: ((missionId: string) => void) | null;
        onSettingsChange: ((settingId: string, value: any) => void) | null;
    };

    constructor() {
        // Get canvas element
        this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }

        // Initialize renderer with canvas and context
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }
        this.renderer = new UIRenderer(this.canvas, ctx);

        // Initialize the unified game
        this.game = new BloomBeastsGame({
            playerData: this.playerData,
            onRenderNeeded: () => this.render()
        });

        // Create the UI tree once
        this.uiTree = this.game.createUI();

        // Store reference to game for callback updates
        this.gameCallbacks = {
            onButtonClick: null,
            onCardSelect: null,
            onMissionSelect: null,
            onSettingsChange: null
        };

        // Create platform callbacks for GameManager
        const platformCallbacks: PlatformCallbacks = {
            // Player data
            setPlayerData: (data: any) => {
                // Update our player data binding when game state changes
                this.updatePlayerData();
            },

            // UI Rendering callbacks (these update our unified UI state)
            renderStartMenu: (options: string[], stats: MenuStats) => {
                const data = this.playerData.value || this.createDefaultPlayerData();
                data.currentScreen = 'menu';
                data.stats = stats;
                this.playerData.set(data);
            },

            renderMissionSelect: (missions: MissionDisplay[], stats: MenuStats) => {
                const data = this.playerData.value || this.createDefaultPlayerData();
                data.currentScreen = 'missions';
                data.missions = missions;
                data.stats = stats;
                this.playerData.set(data);
            },

            renderCards: (cards: CardDisplay[], deckSize: number, deckCardIds: string[], stats: MenuStats) => {
                const data = this.playerData.value || this.createDefaultPlayerData();
                data.currentScreen = 'cards';
                data.cards = {
                    collected: cards,
                    deck: deckCardIds
                };
                data.stats = stats;
                this.playerData.set(data);
            },

            renderBattle: (battleState: BattleDisplay) => {
                const data = this.playerData.value || this.createDefaultPlayerData();
                data.currentScreen = 'battle';
                // Simplified battle state for now
                data.battleState = {
                    state: 'in_progress',
                    message: 'Battle in progress'
                };
                this.playerData.set(data);
            },

            renderSettings: (settings: SoundSettings, stats: MenuStats) => {
                const data = this.playerData.value || this.createDefaultPlayerData();
                data.currentScreen = 'settings';
                data.settings = settings;
                data.stats = stats;
                this.playerData.set(data);
            },

            renderCardDetail: (cardDetail: CardDetailDisplay, stats: MenuStats) => {
                // Handle card detail view if needed
                console.log('Card detail:', cardDetail);
            },

            // Input handling callbacks
            onButtonClick: (callback: (buttonId: string) => void) => {
                // Store callback for later use
                this.gameCallbacks.onButtonClick = callback;
                // Recreate game with updated callbacks
                this.updateGameCallbacks();
            },

            onCardSelect: (callback: (cardId: string) => void) => {
                // Store callback for later use
                this.gameCallbacks.onCardSelect = callback;
                // Recreate game with updated callbacks
                this.updateGameCallbacks();
            },

            onMissionSelect: (callback: (missionId: string) => void) => {
                // Store callback for later use
                this.gameCallbacks.onMissionSelect = callback;
                // Recreate game with updated callbacks
                this.updateGameCallbacks();
            },

            onSettingsChange: (callback: (settingId: string, value: any) => void) => {
                // Store callback for later use
                this.gameCallbacks.onSettingsChange = callback;
                // Recreate game with updated callbacks
                this.updateGameCallbacks();
            },

            // Asset loading
            loadCardImage: async (cardId: string) => {
                // For now, return a placeholder
                return null;
            },

            loadBackground: async (backgroundId: string) => {
                console.log('Load background:', backgroundId);
                return null;
            },

            playSound: (soundId: string) => {
                console.log('Play sound:', soundId);
            },

            // Audio control
            playMusic: (src: string, loop: boolean, volume: number) => {
                console.log('Play music:', src, loop, volume);
            },

            stopMusic: () => {
                console.log('Stop music');
            },

            playSfx: (src: string, volume: number) => {
                console.log('Play SFX:', src, volume);
            },

            setMusicVolume: (volume: number) => {
                console.log('Music volume:', volume);
            },

            setSfxVolume: (volume: number) => {
                console.log('SFX volume:', volume);
            },

            // Storage - Use localStorage for web
            saveData: async (key: string, data: any): Promise<void> => {
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                } catch (error) {
                    console.error('Failed to save data:', error);
                    throw error;
                }
            },

            loadData: async (key: string): Promise<any> => {
                try {
                    const data = localStorage.getItem(key);
                    return data ? JSON.parse(data) : null;
                } catch (error) {
                    console.error('Failed to load data:', error);
                    return null;
                }
            },

            // Dialogs
            showDialog: async (title: string, message: string, buttons: string[] = ['OK']) => {
                return new Promise((resolve) => {
                    // Show HTML modal
                    this.showModal(title, message, buttons, resolve);
                });
            },

            showRewards: async (rewards: any) => {
                const message = `You earned: ${rewards.tokens || 0} tokens, ${rewards.diamonds || 0} diamonds`;
                await platformCallbacks.showDialog('Rewards!', message, ['Awesome!']);
            }
        };

        // Initialize game manager with platform callbacks
        this.gameManager = new GameManager(platformCallbacks);

        // Subscribe to player data changes to trigger re-renders
        this.playerData.subscribe(() => {
            this.render();
        });
    }

    private updateGameCallbacks(): void {
        // Recreate the game with updated callbacks
        this.game = new BloomBeastsGame({
            playerData: this.playerData,
            onButtonClick: this.gameCallbacks.onButtonClick || undefined,
            onCardSelect: this.gameCallbacks.onCardSelect || undefined,
            onMissionSelect: this.gameCallbacks.onMissionSelect || undefined,
            onSettingsChange: this.gameCallbacks.onSettingsChange || undefined,
            onRenderNeeded: () => this.render()
        });
        // Recreate the UI tree with the new game instance
        this.uiTree = this.game.createUI();
        // Trigger re-render with new game instance
        this.render();
    }

    async initialize(): Promise<void> {
        console.log('🎮 BloomBeasts - Unified UI Web Version');
        console.log('Platform:', Platform.web);

        try {
            // Initialize game manager
            await this.gameManager.initialize();

            // Hide loading screen
            const loadingDiv = document.getElementById('loading');
            if (loadingDiv) {
                loadingDiv.classList.add('hidden');
            }

            // Initial render will happen when GameManager calls renderStartMenu
            console.log('✅ Game initialized successfully with unified UI!');
        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
            this.showError(error);
        }
    }

    private createDefaultPlayerData(): PlayerData {
        return {
            currentScreen: 'menu',
            cards: {
                collected: [],
                deck: []
            },
            missions: [],
            stats: {
                playerLevel: 1,
                totalXP: 0,
                tokens: 100,
                diamonds: 10,
                serums: 3,
                level: '1',
                experience: '0/100',
                deckSize: 0,
                totalCards: 0
            } as any,
            settings: {
                musicVolume: 50,
                sfxVolume: 50,
                musicEnabled: true,
                sfxEnabled: true
            }
        };
    }

    private updatePlayerData(): void {
        // This would be called when game state changes
        // For now, just trigger a re-render
        const data = this.playerData.value;
        if (data) {
            this.playerData.set({ ...data });
        }
    }

    private render(): void {
        console.log('[WebGameApp] render() called');
        // Render the stored UI tree (it's reactive via bindings)
        if (this.uiTree) {
            this.renderer.render(this.uiTree);
        }
    }

    private showModal(title: string, message: string, buttons: string[], callback: (button: string) => void): void {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalButtons = document.getElementById('modal-buttons');

        if (modalOverlay && modalTitle && modalMessage && modalButtons) {
            modalOverlay.classList.add('active');
            modalTitle.textContent = title;
            modalMessage.textContent = message;

            modalButtons.innerHTML = '';
            buttons.forEach(button => {
                const btn = document.createElement('button');
                btn.className = 'modal-btn';
                btn.textContent = button;
                btn.onclick = () => {
                    modalOverlay.classList.remove('active');
                    callback(button);
                };
                modalButtons.appendChild(btn);
            });
        }
    }

    private showError(error: any): void {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.showModal('Error', 'Failed to start the game. Please refresh and try again.\n\nError: ' + errorMessage, ['Reload'], () => {
            location.reload();
        });
    }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('========================================');
    console.log('🌸 BloomBeasts - Starting Up 🌸');
    console.log('========================================');

    const app = new WebGameApp();
    await app.initialize();

    // Make app globally accessible for debugging
    (window as any).bloomBeastsApp = app;
});

// Export for module system
export { WebGameApp };