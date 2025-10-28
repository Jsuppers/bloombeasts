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
  ScrollView,
  Binding,
  AnimatedBinding,
  Animation,
  Easing,
  ImageSource
} from 'horizon/ui';
import { type Player, AudioGizmo, AudioOptions } from 'horizon/core';

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

// Simplified: No adapter needed - we just use Horizon's Binding directly!

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
  };

  panelWidth = 1280;
  panelHeight = 720;

  // Properties inherited from UIComponent (declared for TypeScript)
  public world: any;
  public props: any;
  public async: any;

  // Reactive bindings with imperative API (get/set/addListener)
  private currentPlayerBinding = this.createReactiveBinding<Player | null>(null);
  private assetsLoadedBinding = this.createReactiveBinding<boolean>(false);

  // Raw Horizon Binding for UI usage (compatible with Binding.derive)
  // In Horizon, UI is pre-rendered, so we set this to true immediately
  // Assets will be loaded before game.initialize() is called
  // private assetsLoadedBindingRaw: Binding<boolean> = new Binding<boolean>(true);

  // Game instance - created early so uiTree is available immediately
  private game!: BloomBeastsGame;

  // Audio state tracking
  private currentMusicSrc: any = null;
  private currentMusicEntity: hz.Entity | null = null;
  private currentMusicVolume: number = 0.5;
  private currentSfxVolume: number = 0.5;
  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private isMusicPlaying: boolean = false;

  /**
   * Create a reactive binding with imperative API support
   * Wraps Horizon's Binding to add .get() and .addListener() methods
   */
  private createReactiveBinding<T>(initialValue: T) {
    let currentValue = initialValue;
    const binding = new Binding(initialValue);
    const listeners: Set<(value: T) => void> = new Set();

    // Wrap set to track current value and notify listeners
    const originalSet = binding.set.bind(binding);
    (binding as any).set = (value: T) => {
      currentValue = value;
      originalSet(value);
      listeners.forEach(listener => listener(value));
    };

    // Add get method
    (binding as any).get = () => currentValue;

    // Add listener support
    (binding as any).addListener = (listener: (value: T) => void) => {
      listeners.add(listener);
    };

    (binding as any).removeListener = (listener: (value: T) => void) => {
      listeners.delete(listener);
    };

    return binding as Binding<T> & {
      get(): T;
      set(value: T): void;
      addListener(listener: (value: T) => void): void;
      removeListener(listener: (value: T) => void): void;
    };
  }

  start() {
    this.connectCodeBlockEvent(
      this.entity,
      hz.CodeBlockEvents.OnPlayerEnterWorld,
      async (player: Player) => {
        console.log('[Horizon] Player entered world', player);
        this.currentPlayerBinding.set(player);

        // Load player data and apply audio settings
        const playerData = this.loadPlayerData();
        if (playerData?.settings) {
          console.log('[Horizon] Applying saved audio settings:', playerData.settings);
          this.currentMusicVolume = playerData.settings.musicVolume / 100;
          this.currentSfxVolume = playerData.settings.sfxVolume / 100;
          this.musicEnabled = playerData.settings.musicEnabled;
          this.sfxEnabled = playerData.settings.sfxEnabled;
        }
      }
    );

    // Load assets if not already loaded
    this.loadAssetCatalogs().then(() => {
      console.log('[Horizon] Assets loaded');
      this.assetsLoadedBinding.set(true);
      // Note: assetsLoadedBindingRaw is always true in Horizon (set during initialization)
    });

    // Listen for current player and assets loaded then initialize game
    [this.currentPlayerBinding, this.assetsLoadedBinding].forEach(binding => {
      binding.addListener(() => {
        const currentPlayer = this.currentPlayerBinding.get();
        const assetsLoaded = this.assetsLoadedBinding.get();
        // Only initialize game if both current player and assets loaded
        if (currentPlayer && assetsLoaded) {
          console.log('[Horizon] Player and assets ready - initializing game');
          this.game.initialize().then(() => {
            console.log('[Horizon] Game initialized');
          });
        }
      });
    });
  }

  /**
   * Load asset catalogs from Horizon Text assets (async version)
   * Upload JSON catalog files as Text assets and assign them in the Properties panel
   */
  private async loadAssetCatalogs(): Promise<void> {
    // console.log('[Horizon] 📦 Loading asset catalogs...');
    // Check if any catalogs are assigned
    const props = this.props as any;
    const catalogsAssigned = !!(
      props.fireAssetsCatalog ||
      props.forestAssetsCatalog ||
      props.skyAssetsCatalog ||
      props.waterAssetsCatalog ||
      props.buffAssetsCatalog ||
      props.trapAssetsCatalog ||
      props.magicAssetsCatalog ||
      props.commonAssetsCatalog
    );

    if (!catalogsAssigned) {
      console.error('[Horizon] No asset catalogs assigned - check component properties');
      return;
    }

    const catalogManager = AssetCatalogManager.getInstance();
    // Helper function to load a single catalog
    const loadCatalog = async (textAsset: hz.Asset | undefined, catalogName: string): Promise<void> => {
      // Skip if asset is not assigned
      if (!textAsset) {
        // console.warn(`[Horizon] ⚠️ ${catalogName} not assigned - skipping`);
        return;
      }

      try {
        // Minimal logging - only log on errors
        const assetData: any = textAsset;

        // Try to fetch with detailed error catching
        let output: hz.AssetContentData;
        try {
          output = await assetData.fetchAsData();
        } catch (fetchError) {
          console.error(`[Horizon] fetchAsData() failed for ${catalogName}:`, fetchError);
          throw fetchError; // Re-throw to be caught by outer try-catch
        }

        // Try to parse JSON
        let jsonObj: any;
        try {
          jsonObj = output.asJSON();
        } catch (jsonError) {
          console.error(`[Horizon] JSON parse failed for ${catalogName}:`, jsonError);
          throw jsonError;
        }

        if (jsonObj == null || jsonObj == undefined) {
          console.error(`[Horizon] Parsed JSON is null/undefined for ${catalogName}`);
          return;
        }

        const catalog: AssetCatalog = jsonObj as unknown as AssetCatalog;
        catalogManager.loadCatalog(catalog);
        // console.log(`[Horizon] ✅ Loaded ${catalogName} (${catalog.category})`);
      } catch (error) {
        console.error(`[Horizon] Failed to load ${catalogName}:`, error);
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

    // console.log('[Horizon] ✅ All catalogs loaded');
    // console.log('[Horizon] Categories:', catalogManager.getLoadedCategories());
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

      // Image assets: Not used by Horizon - HorizonImage handles conversion
      getImageAsset: (assetId: string) => {
        // Horizon doesn't use this - just return the ID
        // HorizonImage wrapper handles the conversion to ImageSource
        return assetId;
      },

      // UI methods: Horizon UI implementations from horizon/ui
      getUIMethodMappings: () => {
        // Get asset catalog manager for looking up Horizon asset IDs
        const catalogManager = AssetCatalogManager.getInstance();

        /**
         * Convert semantic asset ID to Horizon ImageSource
         * Returns null if asset not found (used for direct/non-binding image sources)
         */
        const assetIdToImageSource = (assetId: string): any => {
          const horizonId = catalogManager.getHorizonAssetId(assetId, 'image');
          if (!horizonId) {
            // Asset not found in catalog
            // console.error(`[assetIdToImageSource] Asset not in catalog: ${assetId}`);
            return null;
          }
          try {
            const imageSource = ImageSource.fromTextureAsset(new hz.Asset(BigInt(horizonId)));
            console.log(`[assetIdToImageSource] Created ImageSource for ${assetId} -> ${horizonId}`);
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

        /**
         * Helper to create card image bindings without chaining
         * Creates a single derived binding that goes directly from source bindings to ImageSource
         */
        const createCardImageBinding = (cardsBinding: any, scrollOffsetBinding: any, slotIndex: number, cardsPerPage: number) => {
          const unwrappedCards = cardsBinding.horizonBinding || cardsBinding;
          const unwrappedScroll = scrollOffsetBinding.horizonBinding || scrollOffsetBinding;

          return Binding.derive([unwrappedCards, unwrappedScroll], (cards: any[], offset: number) => {
            const pageStart = offset * cardsPerPage;
            const cardIndex = pageStart + slotIndex;
            if (cardIndex < cards.length) {
              const card = cards[cardIndex];
              // Extract base ID from card.id (remove timestamp suffix)
              const baseId = card.id.replace(/-\d+-\d+$/, '');
              console.log(`[createCardImageBinding] Slot ${slotIndex} converting "${baseId}" to ImageSource`);
              return assetIdToImageSource(baseId);
            }
            console.log(`[createCardImageBinding] Slot ${slotIndex} no card, returning null`);
            return null; // No card at this slot
          });
        };

        return {
          View: HorizonView,
          Text: (props: any) => Text(unwrapValue(props)),
          Image: (props: any) => Image(unwrapValue(props)), // Direct passthrough
          Pressable: (props: any) => Pressable(unwrapValue(props)),
          UINode: UINode,
          Binding: PlatformBinding,
          AnimatedBinding,
          Animation,
          Easing,
          assetIdToImageSource, // Expose for explicit conversion
          assetsLoadedBinding: this.assetsLoadedBinding, // Expose raw binding (compatible with Binding.derive)
        };
      },

      // Async methods: Horizon async API from component
      async: {
        setTimeout: (callback, timeout) => this.async.setTimeout(callback, timeout),
        clearTimeout: (id) => this.async.clearTimeout(id),
        setInterval: (callback, timeout) => this.async.setInterval(callback, timeout),
        clearInterval: (id) => this.async.clearInterval(id)
      },

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
   * Save player data to Horizon Persistent Storage
   * Uses player-specific storage for multiplayer support
   */
  private savePlayerData(data: PlayerData): void {
    const player = this.currentPlayerBinding.get();
    if (!player || !this.world.persistentStorage) {
      console.error('[Horizon] Failed to save player data: no player or persistent storage', player, this.world.persistentStorage);
      // This is normal during initialization - no warnings needed
      return;
    }

    try {
      // Variable name following Horizon best practices: variableGroup:variableName
      const varKey = 'BloomBeastsData:playerData';
      // console.log('[Horizon] Saving player data for player:', this.currentPlayer.id);
      // console.log('[Horizon] Variable key:', varKey);

      // Use setPlayerVariable for player-specific storage (multiplayer support)
      this.world.persistentStorage.setPlayerVariable(
        player,
        varKey,
        data as any // PlayerData is compatible with PersistentSerializableState
      );

      console.log('[Horizon] Player data saved:', data);
      // console.log('[Horizon] Player data saved successfully');
    } catch (e) {
      console.error('[Horizon] Failed to save player data:', e);
    }
  }

  /**
   * Load player data from Horizon Persistent Storage
   * Uses player-specific storage for multiplayer support
   */
  private loadPlayerData(): PlayerData | null {
    const player = this.currentPlayerBinding.get();
    if (!player || !this.world.persistentStorage) {
      console.error('[Horizon] Failed to load player data: no player or persistent storage', player, this.world.persistentStorage);
      // This is normal during initialization - no warnings needed
      return null;
    }

    try {
      // Variable name following Horizon best practices: variableGroup:variableName
      const varKey = 'BloomBeastsData:playerData';

      // Use getPlayerVariable for player-specific storage (multiplayer support)
      // Note: Don't use type arguments - Horizon doesn't support them
      const result = this.world.persistentStorage.getPlayerVariable(
        player,
        varKey
      );

      console.log('[Horizon] Player data:', result);

      // Per Horizon docs: getPlayerVariable returns null for uninitialized object-type variables
      // It may also return 0 for number-type variables, but we're using object-type
      if (result === null || result === 0 || result === undefined) {
        console.log('[Horizon] No player data');
        return null;
      }

      // Type guard: ensure result is an object before casting
      if (typeof result !== 'object') {
        console.error('[Horizon] Invalid data type returned:', typeof result);
        return null;
      }

      // Check if it's an empty object (Horizon might return {} for uninitialized)
      if (Object.keys(result).length === 0) {
        console.log('[Horizon] Empty player data');
        return null;
      }

      console.log('[Horizon] Loaded player data:', result);

      return result as unknown as PlayerData;
    } catch (e) {
      // Only log real errors, not empty objects
      if (e && typeof e === 'object' && Object.keys(e).length > 0) {
        console.error('[Horizon] Failed to load player data:', e);
      }
      return null;
    }
  }

  /**
   * Horizon UI initialization
   * Required by UIComponent - returns the UI tree
   *
   * This is called BEFORE start() executes
   * We try to load assets synchronously here so images are available immediately
   * If synchronous loading fails, assets will be loaded in start() instead
   */
  initializeUI(): UINode {
    // Create the game instance - constructor should NOT load any data
    // Just create the UI tree structure
    const platformConfig = this.createPlatformConfig();
    this.game = new BloomBeastsGame(platformConfig);

    // Return the game's UI tree - it will show loading screen until initialize() is called
    return this.game.uiTree;
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

      this.currentMusicSrc = entity;
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
      this.currentMusicSrc = null;
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
