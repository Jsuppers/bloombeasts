/**
 * Main Entry Point for Web Deployment
 * Minimal wrapper using the new unified BloomBeastsGame architecture with centralized asset catalog
 */

import { BloomBeastsGame, PlatformConfig, type PlayerData } from '../../../bloombeasts/BloomBeastsGame';
import { assetCatalogManager, AssetCatalogManager } from '../../../bloombeasts/AssetCatalogManager';
import { UIRenderer } from './ui/UIRenderer';
import { View, Text, Image, Pressable, Binding } from './ui';
import { AnimatedBinding, Animation, Easing } from './ui';

/**
 * Initialize and load all asset catalogs using the singleton instance
 * Web-specific: Uses fetch to load JSON files
 */
async function initializeAssetCatalogs() {
    console.log('📦 Initializing Asset Catalogs...');

    const catalogFiles = [
        'fireAssets.json',
        'forestAssets.json',
        'skyAssets.json',
        'waterAssets.json',
        'buffAssets.json',
        'trapAssets.json',
        'magicAssets.json',
        'commonAssets.json'
    ];

    const basePath = '/assets/catalogs';

    try {
        await Promise.all(
            catalogFiles.map(async file => {
                const response = await fetch(`${basePath}/${file}`);
                const catalog = await response.json();
                assetCatalogManager.loadCatalog(catalog);
            })
        );
        console.log('✅ Asset catalogs loaded successfully');
        console.log('   Categories:', assetCatalogManager.getLoadedCategories());
    } catch (error) {
        console.error('❌ Failed to load asset catalogs:', error);
        throw error;
    }

    return assetCatalogManager;
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
                    return stored ? JSON.parse(stored) : null;
                } catch (error) {
                    console.error('Failed to load player data:', error);
                    return null;
                }
            },

            // Image assets: getter function that queries catalog manager
            getImageAsset: (assetId: string) => {
                const path = manager.getAssetPath(assetId, 'image');
                if (!path) return undefined;
                // Add leading slash for web server absolute paths
                return path.startsWith('/') ? path : `/${path}`;
            },

            // Sound assets: getter function that queries catalog manager
            getSoundAsset: (assetId: string) => {
                const path = manager.getAssetPath(assetId, 'audio');
                if (!path) return undefined;
                // Add leading slash for web server absolute paths
                return path.startsWith('/') ? path : `/${path}`;
            },

            // UI methods: web implementations
            getUIMethodMappings: () => ({
                View,
                Text,
                Image,
                Pressable,
                Binding,
                AnimatedBinding,
                Animation,
                Easing
            }),

            // Async methods: standard browser APIs
            async: {
                setTimeout: (callback, timeout) => window.setTimeout(callback, timeout ?? 0),
                clearTimeout: (id) => window.clearTimeout(id),
                setInterval: (callback, timeout) => window.setInterval(callback, timeout ?? 0),
                clearInterval: (id) => window.clearInterval(id)
            },

            // Rendering: canvas renderer
            render: (uiNode) => {
                this.renderer.render(uiNode);
            },

            // Audio: web audio implementation
            playMusic: (src: string, loop: boolean, volume: number) => {
                if (!this.musicAudio) return;

                try {
                    // Don't restart if already playing the same music
                    if (this.musicAudio.src.endsWith(src)) {
                        return;
                    }

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
                } catch (error) {
                    console.error('Failed to play music:', error);
                }
            },

            playSfx: (src: string, volume: number) => {
                try {
                    // Find an available audio element from the pool
                    const availableAudio = this.sfxAudioPool.find(audio => audio.paused);
                    if (availableAudio) {
                        availableAudio.src = src;
                        availableAudio.volume = volume;
                        this.currentSfxVolume = volume;
                        availableAudio.play().catch(() => {});
                    }
                } catch (error) {
                    console.error('Failed to play SFX:', error);
                }
            },

            stopMusic: () => {
                if (this.musicAudio) {
                    this.musicAudio.pause();
                    this.musicAudio.currentTime = 0;
                }
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
            this.assetManager = await initializeAssetCatalogs();

            // Step 2: Create game with platform config
            console.log('🎮 Step 2: Creating game instance...');
            const platformConfig = this.createPlatformConfig(this.assetManager);
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
