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
import { BloomBeastsGame, PlatformConfig, type PlayerData } from '../../../bloombeasts/BloomBeastsGame';
import type { ImageAssetMap, SoundAssetMap } from '../../../bloombeasts/AssetCatalog';

/**
 * Main Horizon UI Component
 * This is the entry point that Horizon Worlds will instantiate
 */
class BloomBeastsUI extends UIComponent {
  static propsDefinition = {
    // Define any Horizon props/assets here if needed
  };

  panelWidth = 1280;
  panelHeight = 720;

  private game!: BloomBeastsGame;
  private world: any;
  private currentPlayer: Player | null = null;
  private uiRoot: UINode | null = null;

  // Audio elements (if using Horizon audio)
  private musicAudio: any = null;
  private sfxAudio: any = null;

  async start() {
    super.start();
    console.log('[Horizon] BloomBeasts starting...');

    this.world = this.getWorld();

    // Get local player
    try {
      this.currentPlayer = await this.world.getLocalPlayer();
      console.log('[Horizon] Local player obtained');
    } catch (e) {
      console.warn('[Horizon] Could not get local player:', e);
    }

    // Create platform config
    const platformConfig = this.createPlatformConfig();

    // Initialize game with platform config
    this.game = new BloomBeastsGame(platformConfig);
    await this.game.initialize();

    console.log('[Horizon] BloomBeasts initialized successfully');
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

      // Image assets: Horizon asset mappings
      // TODO: Create proper Horizon asset catalog
      imageAssets: this.createHorizonImageAssets(),

      // Sound assets: Horizon audio mappings
      // TODO: Create proper Horizon sound catalog
      soundAssets: this.createHorizonSoundAssets(),

      // UI methods: Horizon UI implementations from horizon/ui
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

      // Rendering: Update Horizon UI tree
      // Horizon uses UIComponent.update() to trigger re-renders
      render: (uiNode) => {
        this.uiRoot = uiNode;
        // Trigger re-render by calling update (inherited from UIComponent)
        this.update();
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
   * Create Horizon image asset mappings
   */
  private createHorizonImageAssets(): ImageAssetMap {
    // TODO: Map asset IDs to Horizon ImageSource objects
    // For now, return empty mappings - this needs to be filled in based on your Horizon assets
    return {} as ImageAssetMap;
  }

  /**
   * Create Horizon sound asset mappings
   */
  private createHorizonSoundAssets(): SoundAssetMap {
    // TODO: Map sound IDs to Horizon audio assets
    // For now, return empty mappings - this needs to be filled in based on your Horizon audio
    return {} as SoundAssetMap;
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
        data
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
      return result as PlayerData;
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
