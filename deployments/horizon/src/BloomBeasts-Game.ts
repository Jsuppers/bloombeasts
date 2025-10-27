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

  // Audio elements (if using Horizon audio)
  private musicAudio: any = null;
  private sfxAudio: any = null;

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

      // Sound assets: getter function that queries catalog manager
      getSoundAsset: (assetId: string) => {
        const catalogManager = AssetCatalogManager.getInstance();
        const horizonId = catalogManager.getHorizonAssetId(assetId, 'audio');
        if (!horizonId) {
          // console.warn(`[Horizon] Sound asset not found: ${assetId}`);
          return null;  // Return null instead of undefined
        }
        // TODO: Convert Horizon asset ID to Audio asset
        // For now, return the horizon ID as a string
        return horizonId;
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
      playMusic: (src: any, loop: boolean, volume: number) => {
        // TODO: Implement Horizon music playback
        // console.log('[Horizon] Play music:', src, loop, volume);
      },

      playSfx: (src: any, volume: number) => {
        // TODO: Implement Horizon SFX playback
        // console.log('[Horizon] Play SFX:', src, volume);
      },

      stopMusic: () => {
        // TODO: Implement Horizon music stop
        // console.log('[Horizon] Stop music');
      },

      setMusicVolume: (volume: number) => {
        // console.log('[Horizon] Set music volume:', volume);
      },

      setSfxVolume: (volume: number) => {
        // console.log('[Horizon] Set SFX volume:', volume);
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
   * Cleanup when component is disposed
   */
  dispose() {
    // console.log('[Horizon] BloomBeasts disposing...');
    // Cleanup if needed
  }
}

// Register the component with Horizon
// console.log('[Horizon] ========================================');
// console.log('[Horizon] Registering BloomBeastsUI component...');
// console.log('[Horizon] ========================================');
UIComponent.register(BloomBeastsUI);
// console.log('[Horizon] ✅ BloomBeastsUI registered successfully');
// console.log('[Horizon] ========================================');
