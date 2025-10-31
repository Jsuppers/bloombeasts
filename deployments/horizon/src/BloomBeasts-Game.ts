/**
 * Horizon Platform Implementation for BloomBeasts
 * Uses the unified BloomBeastsGame with platformConfig approach
 */

// Module loading logs disabled for production

import * as hz from 'horizon/core';
import {
  UIComponent,
  UINode,
  View,
  Text,
  Image,
  Pressable,
  Binding,
  AnimatedBinding,
  Animation,
  Easing,
  ImageSource
} from 'horizon/ui';
import { type Player, AudioGizmo, NetworkEvent } from 'horizon/core';

// Import from standalone bundle (includes catalogs as regular TypeScript!)
import { BloomBeasts } from './BloomBeasts-GameEngine-Standalone';

// Import types from the namespace
type BindingManager = BloomBeasts.BindingManager;
type AsyncMethods = BloomBeasts.AsyncMethods;

// Access class from the namespace
const BindingManager = BloomBeasts.BindingManager;

// Type aliases from the BloomBeasts namespace
type BloomBeastsGame = BloomBeasts.BloomBeastsGame;
type PlatformConfig = BloomBeasts.PlatformConfig;
type PlayerData = BloomBeasts.PlayerData;
type AssetCatalog = BloomBeasts.AssetCatalog;

// Access classes and data from the namespace
const BloomBeastsGame = BloomBeasts.BloomBeastsGame;
const AssetCatalogManager = BloomBeasts.AssetCatalogManager;
const allCatalogs = BloomBeasts.allCatalogs; // Catalogs bundled as TypeScript!

/**
 * NetworkEvent payload types for server communication
 * Note: Must have index signature to satisfy SerializableState constraint
 */
type SavePlayerDataPayload = {
  playerIndex: number;
  data: any; // Use 'any' to satisfy SerializableState (PlayerData will be serialized as JSON)
  [key: string]: any;
};

type LoadPlayerDataPayload = {
  playerIndex: number;
  [key: string]: any;
};

type LoadPlayerDataResponse = {
  playerIndex: number;
  data: any; // Use 'any' to satisfy SerializableState (PlayerData | null will be serialized as JSON)
  [key: string]: any;
};

// Simplified: No adapter needed - we just use Horizon's Binding directly!



/**
 * Main Horizon UI Component (Local Mode)
 * This is the entry point that Horizon Worlds will instantiate
 *
 * Ownership Flow:
 * 1. Server transfers ownership to player
 * 2. Script restarts on player's client
 * 3. receiveOwnership() is called
 * 4. Local Mode initializes with smooth UI
 */
class BloomBeastsUI extends UIComponent<{}, {}> {
  static propsDefinition = {
    serverEntity: { type: hz.PropTypes.Entity },

    // Audio Entities - Music (Entities with Audio Gizmo component)
    musicBackground: { type: hz.PropTypes.Entity },
    musicBattle: { type: hz.PropTypes.Entity },

    // Audio Entities - SFX (Entities with Audio Gizmo component)
    sfxMenuButtonSelect: { type: hz.PropTypes.Entity },
    sfxPlayCard: { type: hz.PropTypes.Entity },
    sfxAttack: { type: hz.PropTypes.Entity },
    sfxTrapCardActivated: { type: hz.PropTypes.Entity },
    sfxLowHealth: { type: hz.PropTypes.Entity },
    sfxWin: { type: hz.PropTypes.Entity },
    sfxLose: { type: hz.PropTypes.Entity },
    sfxUpgrade: { type: hz.PropTypes.Entity },
    sfxUpgradeRooster: { type: hz.PropTypes.Entity },
  };

  protected readonly panelWidth = 1280;
  protected readonly panelHeight = 720;

  // Properties inherited from UIComponent (declared for TypeScript)
  public props: any;
  public async: any;

  // Current player (NOT in a Binding - Player objects have circular references)
  private currentPlayer: Player | null = null;

  // Cached player data (loaded from server once, then used locally)
  private cachedPlayerData: PlayerData | null = null;

  // Reactive bindings - uses Horizon's Binding directly
  private assetsLoadedBinding!: Binding<boolean>;

  // Asset catalog manager - instance per UI component (not singleton)
  private catalogManager!: BloomBeasts.AssetCatalogManager;

  // Game instance - created early so uiTree is available immediately
  private game!: BloomBeastsGame;

  // NetworkEvents for server communication
  private saveDataEvent!: NetworkEvent<SavePlayerDataPayload>;
  private loadDataEvent!: NetworkEvent<LoadPlayerDataPayload>;
  private loadDataResponseEvent!: NetworkEvent<LoadPlayerDataResponse>;

  private currentMusicEntity: hz.Entity | null = null;
  private currentMusicVolume: number = 0.5;
  private currentSfxVolume: number = 0.5;
  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private isMusicPlaying: boolean = false;

  /**
   * Load assets and initialize game (called after player data is received)
   * Now synchronous - catalogs are imported directly!
   */
  private loadAssetsAndInitialize(): void {
    console.log('[Client] Loading assets (synchronous)...');

    // Load catalogs synchronously from TypeScript imports
    this.loadAssetCatalogs();

    console.log('[Client] ✅ All assets loaded successfully');
    console.log('[Client] Loaded categories:', this.catalogManager.getLoadedCategories());
    console.log('[Client] Total cards:', this.catalogManager.getAllCardData().length);

    // Set assetsLoadedBinding to true - this will trigger UI to render images
    this.assetsLoadedBinding.set(true);
    console.log('[Client] ✅ assetsLoadedBinding set to true');

    // Initialize game
    this.game.initialize().then(() => {
      console.log('[Client] ✅ Game initialized - menu should show');
    }).catch((error: any) => {
      console.error('[Client] ❌ Game initialization failed:', error);
    });
  }

  /**
   * Load asset catalogs from TypeScript imports (synchronous!)
   * No more async JSON fetching - catalogs are compiled into the code
   */
  private loadAssetCatalogs(): void {
    console.log('[Client] Loading catalogs from TypeScript imports...');

    // Load all catalogs synchronously
    allCatalogs.forEach(catalog => {
      this.catalogManager.loadCatalog(catalog);
    });

    console.log('[Client] ✅ All catalogs loaded synchronously');
  }

  /**
   * Create a minimal preload block for only the most essential UI assets
   * Reduced to save UI size - other assets will be loaded on-demand
   */
  private createAssetPreloadBlock(): UINode {
    console.log('[Client] Creating minimal asset preload block...');

    const essentialAssets = [
      'background',
      'base-card',
      'cards-container',
      'ui-container-side-menu',
      'ui-button-standard-default',
    ];

    const preloadImages: UINode[] = [];

    // Only preload essential UI assets
    essentialAssets.forEach(assetId => {
      const horizonId = this.catalogManager.getHorizonAssetId(assetId, 'image');
      if (horizonId && horizonId !== 'PLACEHOLDER_HORIZON_ID') {
        preloadImages.push(
          Image({
            source: ImageSource.fromTextureAsset(new hz.Asset(BigInt(horizonId))),
            style: { width: 1, height: 1, opacity: 0 }
          })
        );
      }
    });

    console.log(`[Client] Created preload block with ${preloadImages.length} essential images`);

    // Wrap in a hidden View
    return View({
      style: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0,
        top: -1000,
        left: -1000
      },
      children: preloadImages
    });
  }

  /**
   * Create the platform configuration for Horizon
   */
  private createPlatformConfig(): PlatformConfig {
    const asyncMethods: AsyncMethods = {
      setTimeout: (callback: (...args: any[]) => void, timeout?: number) => this.async.setTimeout(callback, timeout),
      clearTimeout: (id: number) => this.async.clearTimeout(id),
      setInterval: (callback: (...args: any[]) => void, timeout?: number) => this.async.setInterval(callback, timeout),
      clearInterval: (id: number) => this.async.clearInterval(id)
    };
    const bindingManager = new BindingManager(Binding, asyncMethods);

    return {
      // Storage: Horizon Persistent Variables
      setPlayerData: (data: PlayerData) => {
        this.savePlayerData(data);
      },

      getPlayerData: () => {
        // Return cached player data (loaded from server once in receiveOwnership)
        // Note: Server creates default data if none exists, so this always returns valid data
        console.log('[Client] getPlayerData called, returning cached data', this.cachedPlayerData);
        return this.cachedPlayerData;
      },

      // Image assets: Not used by Horizon - HorizonImage handles conversion
      getImageAsset: (assetId: string) => {
        // Horizon doesn't use this - just return the ID
        // HorizonImage wrapper handles the conversion to ImageSource
        return assetId;
      },

      // Catalog manager instance
      catalogManager: this.catalogManager,

      // UI methods: Horizon UI implementations from horizon/ui
      getUIMethodMappings: () => {
        // Cache for ImageSource objects (prevents duplicate creation)
        const imageSourceCache = new Map<string, any>();

        /**
         * Convert semantic asset ID to Horizon ImageSource
         * Returns null if asset not found (used for direct/non-binding image sources)
         * Cached to avoid recreating the same ImageSource repeatedly
         *
         * NOTE: This should ONLY be called from bindings that check assetsLoadedBinding first!
         */
        const assetIdToImageSource = (assetId: string): any => {
          // Check cache first
          if (imageSourceCache.has(assetId)) {
            return imageSourceCache.get(assetId);
          }
          const horizonId = this.catalogManager.getHorizonAssetId(assetId, 'image');
          if (!horizonId) {
            console.error(`[assetIdToImageSource] ❌ Asset not in catalog: ${assetId}`);
            console.error(`[assetIdToImageSource] Available categories:`, this.catalogManager.getLoadedCategories());
            console.error(`[assetIdToImageSource] Total indexed assets:`, this.catalogManager.getTotalIndexedAssets?.() || 'N/A');
            return null;
          }
          try {
            const imageSource = ImageSource.fromTextureAsset(new hz.Asset(BigInt(horizonId)));
            // Cache the result
            imageSourceCache.set(assetId, imageSource);
            return imageSource;
          } catch (error) {
            console.error(`[assetIdToImageSource] Failed to create ImageSource for ${assetId}:`, error);
            return null;
          }
        };

        /**
         * Transforms web-style props to Horizon format
         */
        const unwrapValue = (value: any): any => {
          // Skip null/undefined
          if (value === null || value === undefined) {
            return value;
          }

          // Filter out null/undefined from arrays and recursively unwrap
          if (Array.isArray(value)) {
            return value.filter(item => item !== null && item !== undefined).map(unwrapValue);
          }

          // Handle plain objects (e.g., style props)
          // Note: { uri: '...' } objects are handled by the Image component wrapper
          if (value && typeof value === 'object' && value.constructor === Object) {
            // Recursively unwrap objects
            const unwrapped: any = {};
            for (const key in value) {
              unwrapped[key] = unwrapValue(value[key]);
            }
            return unwrapped;
          }

          // Return primitives and other types unchanged
          return value;
        };

        /**
         * Just use Horizon's Binding directly - no adapters, no wrappers
         * We'll fix the code that uses .get() as needed
         */
        const PlatformBinding: any = Binding;

        // No wrapper - just pass through to Image component

        /**
         * Horizon View component wrapper
         * Filters null/undefined from direct children arrays
         * Bindings pass through (filtering happens in unwrapValue)
         */
        const HorizonView = (props: any) => {
          const processedProps = unwrapValue(props);

          // Additional safety: filter direct children arrays
          if (processedProps && processedProps.children) {
            // Only filter direct arrays, not bindings
            if (Array.isArray(processedProps.children)) {
              processedProps.children = processedProps.children.filter(
                (child: any) => child !== null && child !== undefined
              );
              // If array is now empty, set to undefined
              if (processedProps.children.length === 0) {
                processedProps.children = undefined;
              }
            }
          }

          return View(processedProps);
        };

        return {
          View: HorizonView,
          Text: (props: any) => Text(unwrapValue(props)),
          Image: (props: any) => Image(unwrapValue(props)), // Direct passthrough
          Pressable: (props: any) => Pressable(unwrapValue(props)),
          UINode: UINode,
          bindingManager: bindingManager,
          assetIdToImageSource, // Expose for explicit conversion
        };
      },

      // Async methods: Horizon async API from component
      async: asyncMethods,

      // Rendering: No-op for Horizon
      // Horizon uses reactive bindings - the UI tree is built once in initializeUI()
      // and updates automatically when bindings change
      render: (uiNode) => {
        // Do nothing - Horizon doesn't support replacing the UI tree
        // The game's internal bindings handle all updates
      },

      // Audio: Horizon audio implementation
      playSound: (assetId: string, loop: boolean, volume: number) => {
        this.playSound(assetId, loop, volume);
      },

      stopSound: (assetId?: string) => {
        this.stopSound(assetId);
      },

      setMusicVolume: (volume: number) => {
        this.setMusicVolumeImpl(volume);
      },

      setSfxVolume: (volume: number) => {
        this.setSfxVolumeImpl(volume);
      },

      setMusicEnabled: (enabled: boolean) => {
        this.setMusicEnabledImpl(enabled);
      },

      setSfxEnabled: (enabled: boolean) => {
        this.setSfxEnabledImpl(enabled);
      },
    };
  }

  /**
   * Save player data via NetworkEvent to server
   * In Local Mode, we can't access persistent storage directly
   * Send request to server which handles the actual storage
   */
  private savePlayerData(data: PlayerData): void {
    if (!this.currentPlayer) {
      console.error('[Client] Cannot save: no player');
      return;
    }

    // Update cached data immediately (optimistic update)
    this.cachedPlayerData = data;

    const playerIndex = this.currentPlayer.index.get();
    console.log('[Client] Sending save request to server for player index:', playerIndex);

    try {
      this.sendNetworkEvent(this.props.serverEntity, this.saveDataEvent, {
        playerIndex: playerIndex,
        data: data
      });
      console.log('[Client] ✅ Save request sent to server (cached locally)');
    } catch (error) {
      console.error('[Client] ❌ Failed to send save request:', error);
    }
  }

  /**
   * Load player data via NetworkEvent from server
   * In Local Mode, we can't access persistent storage directly
   * This is handled in initializeLocalMode() - we request data when client starts
   *
   * NOTE: This method is not called directly - data loading happens via
   * NetworkEvent request/response in initializeLocalMode()
   */
  private loadPlayerData(): PlayerData | null {
    // This method is not used in NetworkEvent-based architecture
    // Player data is loaded via NetworkEvent in initializeLocalMode()
    console.warn('[Client] loadPlayerData() called but should use NetworkEvent flow instead');
    return null;
  }

  /**
   * Horizon UI initialization
   * Required by UIComponent - returns the UI tree
   *
   * This is called immediately when the script starts, BEFORE receiveOwnership()
   * In Local Mode, this is where we set up everything since receiveOwnership() comes after
   */
  initializeUI(): UINode {
    console.log('[Client] initializeUI() called');

    // CRITICAL: Create assetsLoadedBinding FIRST before anything else
    console.log('[Client] Creating assetsLoadedBinding (starting as FALSE)');
    this.assetsLoadedBinding = new Binding(false);
    console.log('[Client] assetsLoadedBinding created');

    // Create a fresh AssetCatalogManager instance for this UI component
    // NOT a singleton - each client gets its own instance
    const AssetCatalogManager = BloomBeasts.AssetCatalogManager;
    this.catalogManager = new AssetCatalogManager();
    console.log('[Client] Created new AssetCatalogManager instance');

    // Create NetworkEvents for Local Mode (will be used after ownership transfer)
    this.saveDataEvent = new NetworkEvent<SavePlayerDataPayload>('bloombeasts:savePlayerData');
    this.loadDataEvent = new NetworkEvent<LoadPlayerDataPayload>('bloombeasts:loadPlayerData');
    this.loadDataResponseEvent = new NetworkEvent<LoadPlayerDataResponse>('bloombeasts:loadPlayerDataResponse');

    // Check if we should initialize Local Mode
    // This check will be false on the server, true on the client after ownership transfer
    const localPlayer = this.world.getLocalPlayer();
    const serverPlayer = this.world.getServerPlayer();

    console.log('[Client] Local player:', localPlayer?.name || 'null');
    console.log('[Client] Server player:', serverPlayer?.name || 'null');

    if (localPlayer && localPlayer !== serverPlayer) {
      // We're on a LOCAL client (after ownership transfer)
      console.log('[Client] ✅ Detected Local Mode - setting up');
      this.setupLocalMode(localPlayer);
    } else {
      console.log('[Client] Running on server, waiting for ownership transfer');
    }

    // Load catalogs synchronously BEFORE creating the game
    // This ensures the catalogManager is populated before createAssetPreloadBlock is called
    this.loadAssetCatalogs();

    // Create the game instance - constructor should NOT load any data
    // Just create the UI tree structure
    const platformConfig = this.createPlatformConfig();
    this.game = new BloomBeastsGame(platformConfig);

    // Create the asset preload block - CRITICAL for Horizon asset loading!
    // const preloadBlock = this.createAssetPreloadBlock();

    // Return both the game UI tree AND the preload block
    // The preload block is hidden but forces Horizon to load all assets
    return View({
      style: { width: '100%', height: '100%' },
      children: [
        this.game.uiTree,  // Main game UI
        // preloadBlock        // Hidden preload block (critical for asset loading!)
      ]
    });
  }

  /**
   * Set up Local Mode (called from initializeUI when on local client)
   */
  private setupLocalMode(player: Player): void {
    console.log('[Client] Setting up Local Mode for:', player.name);

    // Store player reference
    this.currentPlayer = player;
    const playerIndex = player.index.get();
    console.log('[Client] Player index:', playerIndex);

    // Listen for player data response from server
    this.connectNetworkEvent(this.entity, this.loadDataResponseEvent, (response: LoadPlayerDataResponse) => {
      console.log('[Client] Received player data response from server');

      // Cache the player data locally
      this.cachedPlayerData = response.data as PlayerData | null;

      // Apply settings if available
      if (response.data?.settings) {
        console.log('[Client] Applying saved audio settings:', response.data.settings);
        this.currentMusicVolume = response.data.settings.musicVolume / 100;
        this.currentSfxVolume = response.data.settings.sfxVolume / 100;
        this.musicEnabled = response.data.settings.musicEnabled;
        this.sfxEnabled = response.data.settings.sfxEnabled;
      } else {
        console.log('[Client] No saved settings - using defaults');
      }

      // Player data received - now load assets
      // TODO IS THIS NEEDED?
      this.loadAssetsAndInitialize();
    });

    // Request player data from server immediately
    console.log('[Client] Requesting player data from server...');
    this.sendNetworkEvent(this.props.serverEntity, this.loadDataEvent, {
      playerIndex: playerIndex
    });
  }

  /**
   * Audio entity map with type information
   */
  private audioEntityMap: Record<string, { propName: string; type: 'music' | 'sfx' }> = {
    'music-background': { propName: 'musicBackground', type: 'music' },
    'music-battle': { propName: 'musicBattle', type: 'music' },
    'sfx-menu-button-select': { propName: 'sfxMenuButtonSelect', type: 'sfx' },
    'sfx-play-card': { propName: 'sfxPlayCard', type: 'sfx' },
    'sfx-attack': { propName: 'sfxAttack', type: 'sfx' },
    'sfx-trap-card-activated': { propName: 'sfxTrapCardActivated', type: 'sfx' },
    'sfx-low-health': { propName: 'sfxLowHealth', type: 'sfx' },
    'sfx-win': { propName: 'sfxWin', type: 'sfx' },
    'sfx-lose': { propName: 'sfxLose', type: 'sfx' },
    'sfx-upgrade': { propName: 'sfxUpgrade', type: 'sfx' },
    'sfx-upgrade-rooster': { propName: 'sfxUpgradeRooster', type: 'sfx' },
  };

  /**
   * Map asset ID to prop name and get audio entity
   */
  private getAudioEntity(assetId: string): { entity: hz.Entity; type: 'music' | 'sfx' } | null {
    const entityInfo = this.audioEntityMap[assetId];
    if (!entityInfo) {
      console.warn(`[Horizon Audio] Unknown asset ID: ${assetId}`);
      return null;
    }

    const entity = this.props[entityInfo.propName];
    if (!entity) {
      console.warn(`[Horizon Audio] Entity not assigned in props: ${entityInfo.propName}`);
      return null;
    }

    return { entity, type: entityInfo.type };
  }

  /**
   * Play sound implementation
   * Handles both music and SFX with appropriate volume
   */
  private playSound(assetId: string, loop: boolean = false, volume: number = 1.0): void {
    const audioInfo = this.getAudioEntity(assetId);
    if (!audioInfo) {
      return;
    }

    const { entity, type } = audioInfo;

    // Check if this type of audio is enabled
    if (type === 'music' && !this.musicEnabled) {
      console.log(`[Horizon Audio] Music is disabled, not playing: ${assetId}`);
      return;
    }
    if (type === 'sfx' && !this.sfxEnabled) {
      console.log(`[Horizon Audio] SFX is disabled, not playing: ${assetId}`);
      return;
    }

    // Use the appropriate volume based on type
    const actualVolume = type === 'music' ? this.currentMusicVolume : this.currentSfxVolume;

    console.log(`[Horizon Audio] Play ${type}: ${assetId}, loop: ${loop}, volume: ${actualVolume}`);

    if (type === 'music') {
      // Stop existing music before playing new music
      if (this.currentMusicEntity) {
        const currentAudioGizmo = this.currentMusicEntity.as(AudioGizmo);
        if (currentAudioGizmo) {
          currentAudioGizmo.stop();
        }
      }

      this.currentMusicEntity = entity;
      this.isMusicPlaying = true;
    }

    const audioGizmo = entity.as(AudioGizmo);
    if (audioGizmo) {
      audioGizmo.volume.set(actualVolume);
      audioGizmo.play();
    }
  }

  /**
   * Stop sound implementation
   */
  private stopSound(assetId?: string): void {
    if (!assetId) {
      return;
    }

    const audioInfo = this.getAudioEntity(assetId);
    if (!audioInfo) {
      return;
    }

    const { entity, type } = audioInfo;
    console.log('[Horizon Audio] Stop sound');

    if (!assetId || this.audioEntityMap[assetId]?.type === 'music') {
      this.isMusicPlaying = false;
      this.currentMusicEntity = null;
    }

    const audioGizmo = entity.as(AudioGizmo);
    if (audioGizmo) {
      audioGizmo.stop();
    }
  }

  /**
   * Set music volume implementation
   */
  private setMusicVolumeImpl(volume: number): void {
    console.log('[Horizon Audio] Set music volume:', volume);
    this.currentMusicVolume = volume;

    // If music is currently playing, update its volume
    if (this.currentMusicEntity) {
      const audioGizmo = this.currentMusicEntity.as(AudioGizmo);
      if (audioGizmo) {
        audioGizmo.volume.set(volume);
      }
    }
  }

  /**
   * Set SFX volume implementation
   */
  private setSfxVolumeImpl(volume: number): void {
    console.log('[Horizon Audio] Set SFX volume:', volume);
    this.currentSfxVolume = volume;

    // TODO: If Horizon adds audio playback API, implement here
  }

  /**
   * Set music enabled/disabled
   */
  private setMusicEnabledImpl(enabled: boolean): void {
    console.log('[Horizon Audio] Set music enabled:', enabled);
    this.musicEnabled = enabled;

    // If disabling music, stop currently playing music
    if (!enabled && this.currentMusicEntity) {
      const audioGizmo = this.currentMusicEntity.as(AudioGizmo);
      if (audioGizmo) {
        audioGizmo.stop();
      }
      this.isMusicPlaying = false;
    }
  }

  /**
   * Set SFX enabled/disabled
   */
  private setSfxEnabledImpl(enabled: boolean): void {
    console.log('[Horizon Audio] Set SFX enabled:', enabled);
    this.sfxEnabled = enabled;
  }

  /**
   * Cleanup when component is disposed
   */
  dispose() {
    // console.log('[Horizon] BloomBeasts disposing...');
    // Stop any playing music
    if (this.isMusicPlaying && this.currentMusicEntity) {
      const audioGizmo = this.currentMusicEntity.as(AudioGizmo);
      if (audioGizmo) {
        audioGizmo.stop();
      }
    }
  }
}

// Register the component with Horizon
// console.log('[Horizon] ========================================');
// console.log('[Horizon] Registering BloomBeastsUI component...');
// console.log('[Horizon] ========================================');
UIComponent.register(BloomBeastsUI);
// console.log('[Horizon] ✅ BloomBeastsUI registered successfully');
// console.log('[Horizon] ========================================');
