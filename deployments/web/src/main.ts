/**
 * Main Entry Point for Web Deployment
 * Minimal wrapper using the new unified BloomBeastsGame architecture with centralized asset catalog
 */

import { BloomBeastsGame, PlatformConfig, type PlayerData } from '../../../bloombeasts/BloomBeastsGame';
import { AssetCatalogManager } from '../../../bloombeasts/AssetCatalogManager';
import { allCatalogs } from '../../../bloombeasts/catalogs';
import { createDefaultPlayerData } from '../../../bloombeasts/utils/createDefaultPlayerData';
import { UIRenderer } from './ui/UIRenderer';
import { View, Text, Image, Pressable, Binding, DerivedBinding, ValueBindingBase, UINode } from './ui';
import { AnimatedBinding, Animation, Easing } from './ui';
import { AsyncMethods } from '../../../bloombeasts/ui/types/bindings';
import { BindingManager } from '../../../bloombeasts/ui/types/BindingManager';

/**
 * Initialize and load all asset catalogs
 * Web-specific: Uses TypeScript imports for catalogs
 */
function initializeAssetCatalogs(): AssetCatalogManager {
    console.log('📦 Initializing Asset Catalogs...');

    const manager = new AssetCatalogManager();

    try {
        // Load all catalogs from TypeScript modules
        allCatalogs.forEach(catalog => {
            manager.loadCatalog(catalog);
        });

        console.log('✅ Asset catalogs loaded successfully');
        console.log('   Categories:', manager.getLoadedCategories());
    } catch (error) {
        console.error('❌ Failed to load asset catalogs:', error);
        throw error;
    }

    return manager;
}

/**
 * Web Game Application
 * Minimal platform-specific wrapper
 */
class WebGameApp {
    private game: BloomBeastsGame | null = null;
    private renderer: UIRenderer;
    private canvas: HTMLCanvasElement;
    private assetManager: AssetCatalogManager | null = null;

    // Audio system
    private musicAudio: HTMLAudioElement | null = null;
    private sfxAudioPool: HTMLAudioElement[] = [];
    private currentMusicVolume: number = 0.5;
    private currentSfxVolume: number = 0.5;
    private musicEnabled: boolean = true;
    private sfxEnabled: boolean = true;

    // Audio asset type map
    private audioAssetTypes: Record<string, 'music' | 'sfx'> = {
        'music-background': 'music',
        'music-battle': 'music',
        'sfx-menu-button-select': 'sfx',
        'sfx-play-card': 'sfx',
        'sfx-attack': 'sfx',
        'sfx-trap-card-activated': 'sfx',
        'sfx-low-health': 'sfx',
        'sfx-win': 'sfx',
        'sfx-lose': 'sfx',
    };

    constructor() {
        console.log('🎮 WebGameApp: Constructor started');

        // Get canvas element
        this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!this.canvas) {
            console.error('❌ Canvas element not found!');
            throw new Error('Canvas element not found');
        }
        console.log('✅ Canvas element found');

        // Initialize renderer
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            console.error('❌ Failed to get 2D context from canvas!');
            throw new Error('Failed to get 2D context from canvas');
        }
        console.log('✅ Canvas 2D context created');
        this.renderer = new UIRenderer(this.canvas, ctx);
        console.log('✅ UIRenderer created');

        // Initialize audio system
        this.initializeAudio();
        console.log('✅ Audio system initialized');
    }

    /**
     * Initialize audio system
     */
    private initializeAudio(): void {
        // Create music audio element
        this.musicAudio = new Audio();
        this.musicAudio.loop = true;
        this.musicAudio.volume = this.currentMusicVolume;

        // Create SFX audio pool (5 concurrent sounds)
        for (let i = 0; i < 5; i++) {
            const sfxAudio = new Audio();
            sfxAudio.volume = this.currentSfxVolume;
            this.sfxAudioPool.push(sfxAudio);
        }
    }

    /**
     * Create platform configuration with asset mappings
     */
    private createPlatformConfig(manager: AssetCatalogManager): PlatformConfig {
        const asyncMethods: AsyncMethods = {
            setTimeout: (callback, timeout) => window.setTimeout(callback, timeout ?? 0),
            clearTimeout: (id) => window.clearTimeout(id),
            setInterval: (callback, timeout) => window.setInterval(callback, timeout ?? 0),
            clearInterval: (id) => window.clearInterval(id)
        };
        const bindingManager = new BindingManager(Binding, asyncMethods);
        return {
            // Storage: localStorage
            setPlayerData: (data: PlayerData) => {
                try {
                    localStorage.setItem('bloombeasts_playerData', JSON.stringify(data));
                } catch (error) {
                    console.error('Failed to save player data:', error);
                }
            },

            getPlayerData: () => {
                try {
                    const stored = localStorage.getItem('bloombeasts_playerData');
                    if (stored) {
                        return JSON.parse(stored);
                    }

                    // No saved data - create default with "Web Player" name
                    console.log('No saved data found - creating default player data');
                    const defaultData = createDefaultPlayerData('Web Player');

                    // Save it immediately
                    localStorage.setItem('bloombeasts_playerData', JSON.stringify(defaultData));
                    console.log('Default player data created and saved');

                    return defaultData;
                } catch (error) {
                    console.error('Failed to load/create player data:', error);
                    // Return default data even on error to prevent game crash
                    return createDefaultPlayerData('Web Player');
                }
            },

            // Image assets: getter function that queries catalog manager
            getImageAsset: (assetId: string) => {
                const path = manager.getAssetPath(assetId, 'image');
                if (!path) return undefined;
                // Add leading slash for web server absolute paths
                return path.startsWith('/') ? path : `/${path}`;
            },

            // Asset catalog manager
            catalogManager: manager,

            // UI methods: web implementations with asset transformation
            getUIMethodMappings: () => {
                return {
                    View,
                    Text,
                    Image,
                    Pressable,
                    UINode,
                    bindingManager: bindingManager,
                    // Web just returns the asset ID as-is (string path)
                    assetIdToImageSource: (assetId: string) => assetId,
                };
            },

            // Async methods: standard browser APIs
            async: asyncMethods,

            // Rendering: canvas renderer
            render: (uiNode) => {
                this.renderer.render(uiNode);
            },

            // Audio: web audio implementation
            playSound: (assetId: string, loop: boolean, volume: number) => {
                const type = this.audioAssetTypes[assetId];
                if (!type) {
                    console.warn(`[Web Audio] Unknown asset ID: ${assetId}`);
                    return;
                }

                console.log(`[Web Audio] playSound called:`, { assetId, type, loop, volume, musicEnabled: this.musicEnabled, sfxEnabled: this.sfxEnabled });

                // Check if this type of audio is enabled
                if (type === 'music' && !this.musicEnabled) {
                    console.log(`[Web Audio] Music is disabled, not playing: ${assetId}`);
                    return;
                }
                if (type === 'sfx' && !this.sfxEnabled) {
                    console.log(`[Web Audio] SFX is disabled, not playing: ${assetId}`);
                    return;
                }

                try {
                    // Convert asset ID to path using catalog manager
                    const path = manager.getAssetPath(assetId, 'audio');
                    if (!path) {
                        console.warn(`[Web Audio] Asset not found: ${assetId}`);
                        return;
                    }
                    const src = path.startsWith('/') ? path : `/${path}`;

                    if (type === 'music') {
                        if (!this.musicAudio) return;

                        // Don't restart if already playing the same music
                        if (this.musicAudio.src.endsWith(src)) {
                            return;
                        }

                        console.log(`[Web Audio] Playing music: ${assetId} -> ${src}`);
                        this.musicAudio.src = src;
                        this.musicAudio.loop = loop;
                        this.musicAudio.volume = volume;
                        this.currentMusicVolume = volume;

                        this.musicAudio.play().catch(err => {
                            console.warn('Music autoplay blocked - will play on interaction');
                            // Try playing on next user interaction
                            const playOnInteraction = () => {
                                this.musicAudio?.play().catch(() => {});
                                document.removeEventListener('click', playOnInteraction);
                                document.removeEventListener('keydown', playOnInteraction);
                            };
                            document.addEventListener('click', playOnInteraction);
                            document.addEventListener('keydown', playOnInteraction);
                        });
                    } else {
                        // SFX
                        console.log(`[Web Audio] Playing SFX: ${assetId} -> ${src}`);

                        // Find an available audio element from the pool
                        const availableAudio = this.sfxAudioPool.find(audio => audio.paused);
                        if (availableAudio) {
                            availableAudio.src = src;
                            availableAudio.volume = volume;
                            this.currentSfxVolume = volume;
                            availableAudio.play().catch(() => {});
                        }
                    }
                } catch (error) {
                    console.error(`Failed to play ${type}:`, error);
                }
            },

            stopSound: (assetId?: string) => {
                // If no assetId provided or it's a music asset, stop music
                if (!assetId || this.audioAssetTypes[assetId] === 'music') {
                    if (this.musicAudio) {
                        this.musicAudio.pause();
                        this.musicAudio.currentTime = 0;
                    }
                }
                // Note: We don't stop individual SFX sounds as they're short-lived
            },

            setMusicVolume: (volume: number) => {
                this.currentMusicVolume = volume;
                if (this.musicAudio) {
                    this.musicAudio.volume = volume;
                }
            },

            setSfxVolume: (volume: number) => {
                this.currentSfxVolume = volume;
                // Volume will be applied on next SFX play
            },

            setMusicEnabled: (enabled: boolean) => {
                console.log('[Web Audio] setMusicEnabled called:', { enabled, wasMusicEnabled: this.musicEnabled });
                this.musicEnabled = enabled;
                console.log('[Web Audio] musicEnabled is now:', this.musicEnabled);

                // If disabling music, stop currently playing music
                if (!enabled && this.musicAudio) {
                    console.log('[Web Audio] Stopping music audio');
                    this.musicAudio.pause();
                    this.musicAudio.currentTime = 0;
                }
            },

            setSfxEnabled: (enabled: boolean) => {
                console.log('[Web Audio] Set SFX enabled:', enabled);
                this.sfxEnabled = enabled;
            },

            // World Variables: Mock implementation for web
            getWorldVariable: (variableGroup: string, variableName: string) => {
                console.log(`[Web] getWorldVariable called: ${variableGroup}.${variableName}`);

                // Mock leaderboard data for web testing
                if (variableGroup === 'BloomBeastsData' && variableName === 'leaderboard') {
                    return {
                        topExperience: [
                            { playerName: 'Player 1', score: 10000, level: 7 },
                            { playerName: 'Player 2', score: 5000, level: 6 },
                            { playerName: 'Player 3', score: 3000, level: 5 },
                        ],
                        fastestCluckNorris: [
                            { playerName: 'Speed Runner', score: 45 },
                            { playerName: 'Fast Player', score: 60 },
                            { playerName: 'Quick Win', score: 75 },
                        ],
                    };
                }

                return null;
            },

            setWorldVariable: (variableGroup: string, variableName: string, value: any) => {
                console.log(`[Web] setWorldVariable called: ${variableGroup}.${variableName}`, value);
                // Web doesn't persist world variables - just log for debugging
            },

            // Network Events: Mock implementation for web
            sendNetworkEvent: (eventName: string, data: any) => {
                console.log(`[Web] sendNetworkEvent called: ${eventName}`, data);
                // Web doesn't send network events - just log for debugging
            }
        };
    }

    /**
     * Load an image from a path
     */
    private async loadImage(path: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
            img.src = path;
        });
    }

    /**
     * Load all images into the renderer
     */
    private async loadAllImages(manager: AssetCatalogManager): Promise<void> {
        console.log('📦 Loading image assets...');

        // Get all asset IDs from the catalog manager
        const mappings = manager.getWebAssetMappings();
        const assetIds = Object.keys(mappings.images);

        let loaded = 0;
        let failed = 0;

        for (const assetId of assetIds) {
            const relativePath = mappings.images[assetId];
            // Add leading slash for web server absolute paths
            const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

            try {
                const img = await this.loadImage(path);
                this.renderer.setImage(assetId, img);
                loaded++;
                if (loaded % 10 === 0) {
                    console.log(`  Loaded ${loaded}/${assetIds.length} images...`);
                }
            } catch (error) {
                console.warn(`  ⚠️  Failed to load ${assetId} from ${path}`);
                failed++;
            }
        }

        console.log(`✅ Loaded ${loaded} images (${failed} failed)`);
    }

    /**
     * Initialize the game
     */
    async initialize(): Promise<void> {
        console.log('========================================');
        console.log('🌸 BloomBeasts - Starting Up 🌸');
        console.log('========================================');
        console.log('🎮 Web Platform - JSON Asset Catalogs');
        console.log('========================================');

        try {
            // Step 1: Load asset catalogs
            console.log('📦 Step 1: Loading asset catalogs...');
            this.assetManager = initializeAssetCatalogs();

            // Step 2: Create game with platform config
            console.log('🎮 Step 2: Creating game instance...');
            const platformConfig = this.createPlatformConfig(this.assetManager);

            // Load saved audio settings from localStorage
            try {
                const stored = localStorage.getItem('bloombeasts_playerData');
                if (stored) {
                    const playerData = JSON.parse(stored);
                    if (playerData?.settings) {
                        console.log('[Web] Applying saved audio settings:', playerData.settings);
                        this.currentMusicVolume = playerData.settings.musicVolume / 100;
                        this.currentSfxVolume = playerData.settings.sfxVolume / 100;
                        this.musicEnabled = playerData.settings.musicEnabled;
                        this.sfxEnabled = playerData.settings.sfxEnabled;
                    }
                }
            } catch (error) {
                console.warn('[Web] Failed to load audio settings:', error);
            }

            this.game = new BloomBeastsGame(platformConfig);

            // Step 3: Load all images
            console.log('🖼️  Step 3: Loading images...');
            await this.loadAllImages(this.assetManager);

            // Step 4: Initialize the game
            console.log('🎲 Step 4: Initializing game...');
            await this.game.initialize();

            // Hide loading screen
            const loadingDiv = document.getElementById('loading');
            if (loadingDiv) {
                loadingDiv.classList.add('hidden');
            }

            console.log('✅ Game initialized successfully!');
            console.log('========================================');
        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
            this.showError(error);
        }
    }

    /**
     * Show error modal
     */
    private showError(error: any): void {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : '';

        const modalOverlay = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalButtons = document.getElementById('modal-buttons');

        if (modalOverlay && modalTitle && modalMessage && modalButtons) {
            modalOverlay.classList.add('active');
            modalTitle.textContent = 'Error';
            modalMessage.textContent = `Failed to start the game.\n\nError: ${errorMessage}\n\n${stack}`;

            modalButtons.innerHTML = '';
            const btn = document.createElement('button');
            btn.className = 'modal-btn';
            btn.textContent = 'Reload';
            btn.onclick = () => location.reload();
            modalButtons.appendChild(btn);
        }
    }

    /**
     * Dispose resources
     */
    dispose(): void {
        if (this.game) {
            this.game.dispose();
        }
    }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new WebGameApp();
    await app.initialize();

    // Make app globally accessible for debugging
    (window as any).bloomBeastsApp = app;
});

// Export for module system
export { WebGameApp };
