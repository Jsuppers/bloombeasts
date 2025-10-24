/**
 * Horizon Platform Implementation for BloomBeasts
 * Uses the unified BloomBeastsGame with platformConfig approach
 */

import * as hz from 'horizon/core';
import {
  UIComponent,
  UINode,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Binding,
  AnimatedBinding,
  Animation,
  Easing,
  ImageSource
} from 'horizon/ui';
import type { Player } from 'horizon/core';

// Import from standalone bundle
import { BloomBeasts } from './BloomBeasts-GameEngine-Standalone';

// Type aliases from the BloomBeasts namespace
type BloomBeastsGame = BloomBeasts.BloomBeastsGame;
type PlatformConfig = BloomBeasts.PlatformConfig;
type PlayerData = BloomBeasts.PlayerData;
type AssetCatalog = BloomBeasts.AssetCatalog;

// Access the class from the namespace
const BloomBeastsGame = BloomBeasts.BloomBeastsGame;
const AssetCatalogManager = BloomBeasts.AssetCatalogManager;

/**
 * Main Horizon UI Component
 * This is the entry point that Horizon Worlds will instantiate
 */
class BloomBeastsUI extends UIComponent {
  static propsDefinition = {
    // Asset Catalogs - Upload JSON files as Text assets and assign them here
    fireAssetsCatalog: { type: hz.PropTypes.Asset },
    forestAssetsCatalog: { type: hz.PropTypes.Asset },
    skyAssetsCatalog: { type: hz.PropTypes.Asset },
    waterAssetsCatalog: { type: hz.PropTypes.Asset },
    buffAssetsCatalog: { type: hz.PropTypes.Asset },
    trapAssetsCatalog: { type: hz.PropTypes.Asset },
    magicAssetsCatalog: { type: hz.PropTypes.Asset },
    commonAssetsCatalog: { type: hz.PropTypes.Asset },
  };

  panelWidth = 1280;
  panelHeight = 720;

  private game!: BloomBeastsGame;
  private currentPlayer: Player | null = null;
  private uiRoot: UINode | null = null;

  // Audio elements (if using Horizon audio)
  private musicAudio: any = null;
  private sfxAudio: any = null;

  async start() {
    super.start();
    console.log('[Horizon] BloomBeasts starting...');

    // Get local player
    try {
      this.currentPlayer = await this.world.getLocalPlayer();
      console.log('[Horizon] Local player obtained');
    } catch (e) {
      console.warn('[Horizon] Could not get local player:', e);
    }

    // Load asset catalogs before initializing game
    await this.loadAssetCatalogs();

    // Create platform config
    const platformConfig = this.createPlatformConfig();

    // Initialize game with platform config
    this.game = new BloomBeastsGame(platformConfig);
    await this.game.initialize();

    console.log('[Horizon] BloomBeasts initialized successfully');
  }

  /**
   * Load asset catalogs from Horizon Text assets
   * Upload JSON catalog files as Text assets and assign them in the Properties panel
   */
  private async loadAssetCatalogs(): Promise<void> {
    console.log('[Horizon] 📦 Loading asset catalogs...');

    const catalogManager = AssetCatalogManager.getInstance();

    // Helper function to load a single catalog
    const loadCatalog = async (textAsset: hz.Asset, catalogName: string): Promise<void> => {
      try {
        const assetData: any = textAsset;
        const output: hz.AssetContentData = await assetData.fetchAsData();

        const jsonObj = output.asJSON();
        if (jsonObj == null || jsonObj == undefined) {
          console.error(`[Horizon] Failed to parse JSON from ${catalogName}`);
          return;
        }

        const catalog: AssetCatalog = jsonObj as unknown as AssetCatalog;
        catalogManager.loadCatalog(catalog);
        console.log(`[Horizon] ✅ Loaded ${catalogName} (${catalog.category})`);
      } catch (error) {
        console.error(`[Horizon] ❌ Failed to load ${catalogName}:`, error);
      }
    };

    // Load all catalogs in parallel
    await Promise.all([
      loadCatalog((this.props as any).fireAssetsCatalog, 'fireAssets.json'),
      loadCatalog((this.props as any).forestAssetsCatalog, 'forestAssets.json'),
      loadCatalog((this.props as any).skyAssetsCatalog, 'skyAssets.json'),
      loadCatalog((this.props as any).waterAssetsCatalog, 'waterAssets.json'),
      loadCatalog((this.props as any).buffAssetsCatalog, 'buffAssets.json'),
      loadCatalog((this.props as any).trapAssetsCatalog, 'trapAssets.json'),
      loadCatalog((this.props as any).magicAssetsCatalog, 'magicAssets.json'),
      loadCatalog((this.props as any).commonAssetsCatalog, 'commonAssets.json'),
    ]);

    console.log('[Horizon] ✅ All catalogs loaded');
    console.log('[Horizon] Categories:', catalogManager.getLoadedCategories());
  }

  /**
   * Create the platform configuration for Horizon
   */
  private createPlatformConfig(): PlatformConfig {
    return {
      // Storage: Horizon Persistent Variables
      setPlayerData: (data: PlayerData) => {
        this.savePlayerData(data);
      },

      getPlayerData: () => {
        return this.loadPlayerData();
      },

      // Image assets: getter function that queries catalog manager
      getImageAsset: (assetId: string) => {
        const catalogManager = AssetCatalogManager.getInstance();
        const horizonId = catalogManager.getHorizonAssetId(assetId, 'image');
        if (!horizonId) {
          console.warn(`[Horizon] Image asset not found: ${assetId}`);
          return undefined;
        }
        // TODO: Convert Horizon asset ID to ImageSource
        // For now, return the horizon ID as a string
        return horizonId;
      },

      // Sound assets: getter function that queries catalog manager
      getSoundAsset: (assetId: string) => {
        const catalogManager = AssetCatalogManager.getInstance();
        const horizonId = catalogManager.getHorizonAssetId(assetId, 'audio');
        if (!horizonId) {
          console.warn(`[Horizon] Sound asset not found: ${assetId}`);
          return undefined;
        }
        // TODO: Convert Horizon asset ID to Audio asset
        // For now, return the horizon ID as a string
        return horizonId;
      },

      // UI methods: Horizon UI implementations from horizon/ui
      getUIMethodMappings: () => ({
        View,
        Text,
        Image,
        Pressable,
        Binding: Binding as any, // Horizon Binding is compatible but has slightly different types
        AnimatedBinding,
        Animation,
        Easing
      }),

      // Async methods: Horizon async API from component
      async: {
        setTimeout: (callback, timeout) => this.async.setTimeout(callback, timeout),
        clearTimeout: (id) => this.async.clearTimeout(id),
        setInterval: (callback, timeout) => this.async.setInterval(callback, timeout),
        clearInterval: (id) => this.async.clearInterval(id)
      },

      // Rendering: Update Horizon UI tree
      // Horizon automatically re-renders when bindings change
      render: (uiNode) => {
        this.uiRoot = uiNode;
        // Note: Horizon UI will re-render automatically via initializeUI()
      },

      // Audio: Horizon audio implementation
      playMusic: (src: any, loop: boolean, volume: number) => {
        // TODO: Implement Horizon music playback
        console.log('[Horizon] Play music:', src, loop, volume);
      },

      playSfx: (src: any, volume: number) => {
        // TODO: Implement Horizon SFX playback
        console.log('[Horizon] Play SFX:', src, volume);
      },

      stopMusic: () => {
        // TODO: Implement Horizon music stop
        console.log('[Horizon] Stop music');
      },

      setMusicVolume: (volume: number) => {
        console.log('[Horizon] Set music volume:', volume);
      },

      setSfxVolume: (volume: number) => {
        console.log('[Horizon] Set SFX volume:', volume);
      },
    };
  }

  /**
   * Save player data to Horizon Persistent Storage
   */
  private savePlayerData(data: PlayerData): void {
    if (!this.currentPlayer || !this.world.persistentStorage) {
      console.warn('[Horizon] Cannot save - no player or persistent storage');
      return;
    }

    try {
      const varKey = 'BloomBeastsData:playerData';
      this.world.persistentStorage.setPlayerVariable(
        this.currentPlayer,
        varKey,
        data as any // PlayerData is compatible with PersistentSerializableState
      );
      console.log('[Horizon] Player data saved');
    } catch (e) {
      console.error('[Horizon] Failed to save player data:', e);
    }
  }

  /**
   * Load player data from Horizon Persistent Storage
   */
  private loadPlayerData(): PlayerData | null {
    if (!this.currentPlayer || !this.world.persistentStorage) {
      console.warn('[Horizon] Cannot load - no player or persistent storage');
      return null;
    }

    try {
      const varKey = 'BloomBeastsData:playerData';
      const result = this.world.persistentStorage.getPlayerVariable(
        this.currentPlayer,
        varKey
      );

      // getPlayerVariable returns 0 if variable hasn't been set
      if (result === 0) {
        console.log('[Horizon] No saved data found');
        return null;
      }

      console.log('[Horizon] Player data loaded');
      return result as unknown as PlayerData;
    } catch (e) {
      console.error('[Horizon] Failed to load player data:', e);
      return null;
    }
  }

  /**
   * Horizon UI initialization
   * Required by UIComponent - returns the UI tree
   */
  initializeUI(): UINode {
    return this.uiRoot || View({});
  }

  /**
   * Cleanup when component is disposed
   */
  dispose() {
    console.log('[Horizon] BloomBeasts disposing...');
    // Cleanup if needed
  }
}

// Register the component with Horizon
UIComponent.register(BloomBeastsUI);
