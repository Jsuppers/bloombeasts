/**
 * BloomBeastsGame - Unified Game Controller
 *
 * This is the main entry point for the game that works across all platforms (web, horizon).
 * Platform-specific code should be minimal - just implement the PlatformConfig callbacks.
 *
 * The game is fully platform-agnostic - it doesn't even import UI methods directly,
 * but receives them from the platform configuration.
 */

import { MenuScreen } from './ui/screens/MenuScreen';
import { CardsScreen } from './ui/screens/CardsScreen';
import { MissionScreen } from './ui/screens/MissionScreen';
import { BattleScreen } from './ui/screens/BattleScreen';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { createMissionCompletePopup } from './ui/screens/common/MissionCompletePopup';
import { createButtonPopup } from './ui/screens/common/ButtonPopup';
import { createCardDetailPopup } from './ui/screens/common/CardDetailPopup';
import { GameEngine } from './engine/systems/GameEngine';
import { CardCollectionManager } from './systems/CardCollectionManager';
import { BattleDisplayManager } from './systems/BattleDisplayManager';
import { MissionManager } from './screens/missions/MissionManager';
import { MissionSelectionUI } from './screens/missions/MissionSelectionUI';
import { MissionBattleUI } from './screens/missions/MissionBattleUI';
import { CardInstance } from './screens/cards/types';
import { getAllCards } from './engine/cards';
import { DECK_SIZE } from './engine/constants/gameRules';
import { Logger } from './engine/utils/Logger';
import type { AsyncMethods } from './ui/types/bindings';
import { normalizeSoundId } from './AssetCatalog';
import type { MenuStats, MissionDisplay, BattleDisplay, ObjectiveDisplay, CardDetailDisplay, SoundSettings } from './gameManager';

/**
 * XP thresholds for player leveling (cumulative)
 * Formula: XP = 100 * (2.0 ^ (level - 1))
 */
const XP_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2: 100 XP
  300,    // Level 3: 300 XP total
  700,    // Level 4: 700 XP total
  1500,   // Level 5: 1500 XP total
  3100,   // Level 6: 3100 XP total
  6300,   // Level 7: 6300 XP total
  12700,  // Level 8: 12700 XP total
  25500,  // Level 9: 25500 XP total
];

/**
 * Calculate player level from total XP (derived data)
 */
function getPlayerLevel(totalXP: number): number {
  for (let level = 9; level >= 1; level--) {
    if (totalXP >= XP_THRESHOLDS[level - 1]) {
      return level;
    }
  }
  return 1;
}

// UINode type - represents a UI node returned by UI components
export type UINode = any;

/**
 * Read-only binding interface (for derived bindings)
 */
export interface ReadonlyBindingInterface<T> {
  get(): T;
  subscribe(callback: () => void): void;
}

/**
 * Binding interface - platform-agnostic reactive data binding
 * Each platform provides its own implementation
 */
export interface BindingInterface<T> {
  get(): T;
  set(value: T): void;
  subscribe(callback: () => void): void;
  derive<U>(fn: (value: T) => U): ReadonlyBindingInterface<U>;
}

/**
 * Binding constructor type
 */
export type BindingConstructor = {
  new <T>(value: T): BindingInterface<T>;
  derive<T extends any[], R>(
    bindings: any[],
    deriveFn: (...values: T) => R
  ): ReadonlyBindingInterface<R>;
};

/**
 * Style properties - platform-agnostic style definitions
 * These match Horizon's styling but work on web too
 */
export interface StyleProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  position?: 'relative' | 'absolute';
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  opacity?: number;
  // Add more as needed
}

/**
 * Common props for all UI components
 */
export interface BaseUIProps {
  style?: StyleProps;
  children?: UINode | UINode[];
}

/**
 * View component props
 */
export interface ViewProps extends BaseUIProps {}

/**
 * Text component props
 */
export interface TextProps extends BaseUIProps {
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Image component props
 */
export interface ImageProps extends BaseUIProps {
  imageId?: string | any; // Single image asset ID (or binding)
  binding?: any; // BaseBinding<string> for animations, derived values, etc.
  width?: number;
  height?: number;
}

/**
 * Pressable (button) component props
 */
export interface PressableProps extends BaseUIProps {
  onPress?: () => void;
  id?: string;
}

/**
 * Platform-specific UI method mappings
 * Each platform provides its own implementation of these methods
 * Screens receive this object and use it to create UI elements
 */
export interface UIMethodMappings {
  // Core UI components
  View: (props: any) => any;
  Text: (props: any) => any;
  Image: (props: any) => any;
  Pressable: (props: any) => any;
  ScrollView?: (props: any) => any;

  // UINode utilities for conditional rendering
  // Matches Horizon's actual signature
  UINode?: any;

  // Data binding
  Binding: BindingConstructor;
  AnimatedBinding?: any;

  // Animation
  Animation?: any;
  Easing?: any;

  // Platform-specific helpers
  assetIdToImageSource?: (assetId: string) => any; // Convert asset ID to ImageSource (Horizon) or string (Web)
  assetsLoadedBinding?: any; // Binding<boolean> - true when assets are loaded (prevents race conditions)
}

/**
 * Player item in inventory
 */
export interface PlayerItem {
  itemId: string;
  quantity: number;
}

/**
 * Player data structure - persisted to platform storage
 * This is the canonical save data format
 *
 * Note: Player level is derived from totalXP and not stored directly
 */
export interface PlayerData {
  // Identity and progression
  name: string;
  totalXP: number; // Level is derived from this via getPlayerLevel()

  // Card collection and deck (SINGLE SOURCE OF TRUTH)
  cards: {
    collected: CardInstance[]; // All owned card instances
    deck: string[]; // Card instance IDs in player's deck
  };

  // Mission tracking
  missions: {
    completedMissions: { [missionId: string]: number }; // Mission ID -> completion count
  };

  // Item inventory
  items: PlayerItem[];

  // UI preferences (not persisted on all platforms)
  settings?: SoundSettings;
}

/**
 * Platform configuration - implement these callbacks for your platform
 *
 * TypeScript ensures ALL assets from the catalog are provided!
 *
 * Example for Web:
 * {
 *   setPlayerData: (data) => localStorage.setItem('playerData', JSON.stringify(data)),
 *   getPlayerData: () => JSON.parse(localStorage.getItem('playerData') || 'null'),
 *   imageAssets: {
 *     [ImageAssetIds.CARD_ROOTLING]: '/shared/images/cards/Forest/Rootling.png',
 *     [ImageAssetIds.CARD_EMBERLING]: '/shared/images/cards/Fire/Emberling.png',
 *     // ... TypeScript enforces all assets are provided!
 *   },
 *   soundAssets: {
 *     [SoundAssetIds.MUSIC_BACKGROUND]: '/shared/sounds/BackgroundMusic.mp3',
 *     // ... TypeScript enforces all assets are provided!
 *   },
 *   getUIMethodMappings: () => ({ View, Text, Image, Pressable, Binding }),
 *   render: (uiNode) => renderer.render(uiNode)
 * }
 *
 * Example for Horizon:
 * {
 *   setPlayerData: (data) => persistentVar.set(data),
 *   getPlayerData: () => persistentVar.get(),
 *   imageAssets: {
 *     [ImageAssetIds.CARD_ROOTLING]: ImageSource.fromTextureAsset(new hz.Asset(BigInt('123'))),
 *     [ImageAssetIds.CARD_EMBERLING]: ImageSource.fromTextureAsset(new hz.Asset(BigInt('456'))),
 *     // ... TypeScript enforces all assets are provided!
 *   },
 *   soundAssets: {
 *     [SoundAssetIds.MUSIC_BACKGROUND]: new hz.Asset(BigInt('789')),
 *     // ... TypeScript enforces all assets are provided!
 *   },
 *   getUIMethodMappings: () => ({ View: hz.View, Text: hz.Text, ... }),
 *   render: (uiNode) => horizonComponent.update(uiNode)
 * }
 */
export interface PlatformConfig {
  /**
   * Save player data to persistent storage
   * For web: localStorage
   * For horizon: Persistent Variables API
   */
  setPlayerData: (data: PlayerData) => void;

  /**
   * Load player data from persistent storage
   * Return null if no data exists
   */
  getPlayerData: () => PlayerData | null;

  /**
   * Get an image asset by ID
   * Platform queries AssetCatalogManager and returns the asset in platform format
   *
   * For web: Returns string path from catalog (e.g., '/assets/cards/fire/beast.png')
   * For horizon: Converts catalog horizonAssetId to ImageSource object
   */
  getImageAsset: (assetId: string) => any;

  /**
   * Get platform-specific UI method implementations
   *
   * For web: Returns web-specific View, Text, Image, Pressable, Binding
   * For horizon: Returns hz.View, hz.Text, hz.Image, hz.Pressable, hz.Binding
   */
  getUIMethodMappings: () => UIMethodMappings;

  /**
   * Platform-specific async methods (setTimeout, setInterval, etc.)
   *
   * For web: Standard window.setTimeout, window.setInterval, etc.
   * For horizon: component.async.setTimeout, component.async.setInterval, etc.
   */
  async: AsyncMethods;

  /**
   * Render the UI tree
   * Called whenever the UI needs to be updated
   *
   * For web: renderer.render(uiNode)
   * For horizon: component.update(uiNode) or similar
   */
  render: (uiNode: UINode) => void;

  /**
   * Audio callbacks (optional)
   * Implement if your platform supports audio
   */
  playSound?: (assetId: string, loop: boolean, volume: number) => void;
  stopSound?: (assetId?: string) => void;
  setMusicVolume?: (volume: number) => void;
  setSfxVolume?: (volume: number) => void;
  setMusicEnabled?: (enabled: boolean) => void;
  setSfxEnabled?: (enabled: boolean) => void;
}

/**
 * Main game class - handles all game logic and UI orchestration
 */
export class BloomBeastsGame {
  // Platform configuration
  private platform: PlatformConfig;

  // Platform-specific UI methods
  private UI: UIMethodMappings;

  // Platform-specific async methods
  private asyncMethods: AsyncMethods;

  // Platform-provided asset getters
  private platformGetImageAsset: (assetId: string) => any;

  // Core game systems
  private gameEngine: GameEngine;
  private missionManager: MissionManager;
  private missionUI: MissionSelectionUI;
  private battleUI: MissionBattleUI;
  private cardCollectionManager: CardCollectionManager;

  // Sound and display state
  private currentMusic: string | null = null;
  private battleDisplayManager: BattleDisplayManager;

  // Player data state - SINGLE SOURCE OF TRUTH (no duplicates!)
  // Starts as null to indicate data hasn't loaded yet (prevents race conditions)
  private playerData: PlayerData | null = null;

  // Game state
  private isInitializing: boolean = true;  // Prevent renders during initialization
  private currentScreen: string = 'loading';  // Current active screen
  private currentBattleId: string | null = null;
  private selectedBeastIndex: number | null = null;

  // UI State bindings
  private playerDataBinding: BindingInterface<PlayerData | null>;
  private currentScreenBinding: BindingInterface<string>;
  private missionsBinding: BindingInterface<MissionDisplay[]>;

  // Battle-specific UI bindings (UI-only state)
  private battleStateBinding: BindingInterface<string>;
  private battleMessageBinding: BindingInterface<string>;
  private battleDisplayBinding: BindingInterface<BattleDisplay | null>;

  // Popup bindings (UI-only state)
  private missionCompletePopupBinding: BindingInterface<any>;
  private forfeitPopupBinding: BindingInterface<any>;
  private cardDetailPopupBinding: BindingInterface<any>;

  // Track binding values separately (as per Horizon docs - no .get() method)
  private missionCompletePopupValue: any = null;
  private forfeitPopupValue: any = null;
  private cardDetailPopupValue: any = null;

  // Screen instances
  private menuScreen: MenuScreen;
  private cardsScreen: CardsScreen;
  private missionScreen: MissionScreen;
  private battleScreen: BattleScreen;
  private settingsScreen: SettingsScreen;

  // UI tree (created once, updated reactively)
  // Public so platform wrappers can access it (needed for Horizon's initializeUI)
  public uiTree: UINode | null = null;

  constructor(config: PlatformConfig) {
    this.platform = config;

    // Get platform-specific UI methods
    this.UI = config.getUIMethodMappings();

    // Get platform-specific async methods
    this.asyncMethods = config.async;

    // Store platform-provided asset getters
    this.platformGetImageAsset = config.getImageAsset;

    // Initialize core systems
    this.gameEngine = new GameEngine();
    this.missionManager = new MissionManager();
    this.missionUI = new MissionSelectionUI(this.missionManager);
    this.battleUI = new MissionBattleUI(this.missionManager, this.gameEngine, this.asyncMethods);

    // Set up render callback for battle UI to update display during opponent turns
    (this.battleUI as any).renderCallback = () => {
      const currentState = this.battleUI.getCurrentBattle();
      if (currentState && !currentState.isComplete) {
        const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
          currentState,
          this.selectedBeastIndex,
          null
        );
        if (updatedDisplay) {
          // console.log('[BloomBeastsGame] renderCallback: Updating battleDisplayBinding with turnPlayer:', updatedDisplay.turnPlayer);
          this.battleDisplayBinding.set(updatedDisplay);
          this.triggerRender();
        }
      }
    };

    this.cardCollectionManager = new CardCollectionManager();
    this.battleDisplayManager = new BattleDisplayManager();

    // Initialize bindings using platform's Binding class
    const BindingClass = this.UI.Binding as any;
    this.playerDataBinding = new BindingClass(null);  // Start null - data loads in initialize()
    this.currentScreenBinding = new BindingClass('loading');  // Start with loading
    this.missionsBinding = new BindingClass([]);

    // Battle UI bindings
    this.battleStateBinding = new BindingClass('initializing');
    this.battleMessageBinding = new BindingClass('Preparing for battle...');
    this.battleDisplayBinding = new BindingClass(null);

    // Popup bindings
    this.missionCompletePopupBinding = new BindingClass(null);
    this.forfeitPopupBinding = new BindingClass(null);
    this.cardDetailPopupBinding = new BindingClass(null);

    // Create screen instances (pass UI methods and playerData binding)
    this.menuScreen = new MenuScreen({
      ui: this.UI,
      async: this.asyncMethods,
      playerDataBinding: this.playerDataBinding,
      onButtonClick: this.handleButtonClick.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    this.cardsScreen = new CardsScreen({
      ui: this.UI,
      playerDataBinding: this.playerDataBinding,
      onCardSelect: this.handleCardSelect.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    this.missionScreen = new MissionScreen({
      ui: this.UI,
      missions: this.missionsBinding,
      playerDataBinding: this.playerDataBinding,
      onMissionSelect: this.handleMissionSelect.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    this.battleScreen = new BattleScreen({
      ui: this.UI,
      async: this.asyncMethods,
      battleDisplay: this.battleDisplayBinding,
      message: this.battleMessageBinding,
      onAction: this.handleBattleAction.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    this.settingsScreen = new SettingsScreen({
      ui: this.UI,
      playerDataBinding: this.playerDataBinding,
      onSettingChange: this.handleSettingsChange.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    // All screens are now created, enable rendering
    this.isInitializing = false;

    // Create UI tree once (it's reactive via bindings)
    this.uiTree = this.createUI();
  }

  /**
   * Get an image asset by ID
   * Delegates to platform-specific implementation
   */
  getImageAsset(assetId: string): any {
    return this.platformGetImageAsset(assetId);
  }

  /**
   * Get platform async methods (setTimeout, setInterval, etc.)
   * Screens can use this to access platform-specific async operations
   */
  get async(): AsyncMethods {
    return this.asyncMethods;
  }

  /**
   * Initialize the game
   * Call this after construction to load data and show initial screen
   */
  async initialize(): Promise<void> {
    console.log('[BloomBeastsGame] Initializing...');

    // Load saved game data (initializes starting cards if needed)
    await this.loadGameData();

    // Update bindings from loaded data
    console.log('[BloomBeastsGame] About to call updateBindingsFromGameState...');
    await this.updateBindingsFromGameState();
    console.log('[BloomBeastsGame] updateBindingsFromGameState completed');

    // Trigger initial render
    console.log('[BloomBeastsGame] About to trigger render...');
    this.triggerRender();

    // Start menu music
    console.log('[BloomBeastsGame] Starting menu music...');
    this.playMusic('music-background', true);
    console.log('[BloomBeastsGame] Navigating to menu...');
    this.navigate('menu');
    console.log('[BloomBeastsGame] Initialize complete!');
  }

  /**
   * Get current player level (derived from totalXP)
   */
  private get playerLevel(): number {
    return getPlayerLevel(this.playerData?.totalXP ?? 0);
  }

  /**
   * Create default player data structure
   */
  private createDefaultPlayerData(): PlayerData {
    return {
      name: 'Player',
      totalXP: 0,
      items: [],
      cards: {
        collected: [],
        deck: []
      },
      missions: {
        completedMissions: {}
      },
      settings: {
        musicVolume: 10,
        sfxVolume: 50,
        musicEnabled: true,
        sfxEnabled: true
      }
    };
  }

  /**
   * Load game data from platform storage
   * Creates default data if none exists
   */
  private async loadGameData(): Promise<void> {
    try {
      const savedData = this.platform.getPlayerData?.();

      if (savedData && Object.keys(savedData).length > 0) {
        // Use saved data directly
        this.playerData = savedData;
        Logger.info(`[BloomBeastsGame] Loaded player data with ${savedData.cards.collected.length} cards`);
      } else {
        // Create default player data
        this.playerData = this.createDefaultPlayerData();
        Logger.info('[BloomBeastsGame] Created default player data');
      }
    } catch (error) {
      Logger.error('[BloomBeastsGame] Error loading player data:', error);
      // Create default player data on error
      this.playerData = this.createDefaultPlayerData();
      Logger.info('[BloomBeastsGame] Using default player data');
    }

    Logger.info(`[BloomBeastsGame] Restored deck with ${this.playerData.cards.deck.length} cards`);

    // Apply sound settings to platform
    if (this.playerData.settings) {
      this.platform.setMusicVolume?.(this.playerData.settings!.musicVolume / 100);
      this.platform.setSfxVolume?.(this.playerData.settings!.sfxVolume / 100);
      this.platform.setMusicEnabled?.(this.playerData.settings!.musicEnabled);
      this.platform.setSfxEnabled?.(this.playerData.settings!.sfxEnabled);
    }

    // Load completed missions into MissionManager
    this.missionManager.loadCompletedMissions(this.playerData.missions.completedMissions);

    // Initialize starting cards if collection is empty
    if (this.playerData.cards.collected.length === 0) {
      Logger.info('[BloomBeastsGame] Initializing starting card collection');
      await this.initializeStartingCollection();
    }

    // Save to ensure data persists
    await this.saveGameData();
  }

  /**
   * Save game data to platform storage
   */
  private async saveGameData(): Promise<void> {
    if (!this.playerData) {
      Logger.warn('[BloomBeastsGame] Cannot save null player data');
      return;
    }
    this.platform.setPlayerData?.(this.playerData);
    Logger.debug('[BloomBeastsGame] Player data saved');
  }

  /**
   * Update player data (single update method)
   * This is the ONLY way to update playerData - ensures binding stays in sync
   */
  private async updatePlayerData(updates: Partial<PlayerData> | ((current: PlayerData) => PlayerData)): Promise<void> {
    // Data must be loaded before updates
    if (!this.playerData) {
      Logger.error('[BloomBeastsGame] Cannot update player data before it is loaded');
      return;
    }

    // Support both object updates and function updates
    if (typeof updates === 'function') {
      this.playerData = updates(this.playerData);
    } else {
      this.playerData = { ...this.playerData, ...updates };
    }

    // Update binding
    this.playerDataBinding.set(this.playerData);

    // Auto-save
    await this.saveGameData();
  }

  /**
   * Play background music
   */
  private playMusic(musicId: string, loop: boolean = true): void {
    // Don't restart music if it's already playing
    if (this.currentMusic === musicId) {
      return;
    }

    this.currentMusic = musicId;

    if (this.playerData?.settings?.musicEnabled) {
      const volume = this.playerData.settings.musicVolume / 100;
      this.platform.playSound?.(musicId, loop, volume);
    }
  }

  /**
   * Stop background music
   */
  private stopMusic(): void {
    this.currentMusic = null;
    this.platform.stopSound?.();
  }

  /**
   * Play sound effect
   */
  private playSfx(sfxId: string): void {
    if (this.playerData?.settings?.sfxEnabled) {
      const volume = this.playerData.settings.sfxVolume / 100;
      this.platform.playSound?.(sfxId, false, volume);
    }
  }

  /**
   * Set music volume (0-100)
   */
  private setMusicVolume(volume: number): void {
    if (!this.playerData?.settings) return;
    this.playerData.settings.musicVolume = Math.max(0, Math.min(100, volume));
    if (this.playerData.settings.musicEnabled) {
      this.platform.setMusicVolume?.(this.playerData.settings.musicVolume / 100);
    }
  }

  /**
   * Set SFX volume (0-100)
   */
  private setSfxVolume(volume: number): void {
    if (!this.playerData?.settings) return;
    this.playerData.settings.sfxVolume = Math.max(0, Math.min(100, volume));
    if (this.playerData.settings.sfxEnabled) {
      this.platform.setSfxVolume?.(this.playerData.settings.sfxVolume / 100);
    }
  }

  /**
   * Toggle music on/off
   */
  private toggleMusic(enabled: boolean): void {
    console.log('[BloomBeastsGame] toggleMusic called:', { enabled, currentMusic: this.currentMusic });
    if (!this.playerData?.settings) return;
    this.playerData.settings.musicEnabled = enabled;

    // Notify platform
    this.platform.setMusicEnabled?.(enabled);

    if (enabled && this.currentMusic) {
      // Resume music - force replay even if it's the same track
      const musicToResume = this.currentMusic;
      const volume = this.playerData.settings.musicVolume / 100;
      console.log('[BloomBeastsGame] Resuming music:', { musicToResume, volume, platformHasPlaySound: !!this.platform.playSound });
      this.platform.playSound?.(musicToResume, true, volume);
    } else if (!enabled) {
      // Stop music playback but keep track of current music for resume
      // Don't call stopMusic() as it clears this.currentMusic
      console.log('[BloomBeastsGame] Stopping music, keeping currentMusic:', this.currentMusic);
      this.platform.stopSound?.();
    } else {
      console.log('[BloomBeastsGame] Music enabled but no currentMusic set');
    }
  }

  /**
   * Toggle SFX on/off
   */
  private toggleSfx(enabled: boolean): void {
    if (!this.playerData?.settings) return;
    this.playerData.settings.sfxEnabled = enabled;

    // Notify platform
    this.platform.setSfxEnabled?.(enabled);
  }

  /**
   * Add XP to player (level is automatically derived)
   */
  private addXP(amount: number): void {
    if (!this.playerData) return;
    this.playerData.totalXP += amount;
    Logger.debug(`[BloomBeastsGame] Added ${amount} XP (total: ${this.playerData.totalXP}, level: ${this.playerLevel})`);
  }

  /**
   * Get the quantity of a specific item from player's items array
   */
  private getItemQuantity(itemId: string): number {
    if (!this.playerData) return 0;
    const item = this.playerData.items.find(i => i.itemId === itemId);
    return item ? item.quantity : 0;
  }

  /**
   * Track mission completion
   */
  private trackMissionCompletion(missionId: string): void {
    if (!this.playerData) return;
    const currentCount = this.playerData.missions.completedMissions[missionId] || 0;
    this.playerData.missions.completedMissions[missionId] = currentCount + 1;
    Logger.debug(`[BloomBeastsGame] Mission ${missionId} completed ${currentCount + 1} times`);
  }

  /**
   * Add items to player's inventory
   */
  private addItems(itemId: string, quantity: number): void {
    if (!this.playerData) return;
    const existingItem = this.playerData.items.find(i => i.itemId === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.playerData.items.push({
        itemId,
        quantity,
      });
    }
    Logger.debug(`[BloomBeastsGame] Added ${quantity}x ${itemId} to inventory`);
  }

  /**
   * Initialize a new game with starter cards
   */
  private async initializeStartingCollection(): Promise<void> {
    if (!this.playerData) return;
    this.playerData.cards.deck = await this.cardCollectionManager.initializeStartingCollection(
      this.playerData.cards.collected,
      this.playerData.cards.deck
    );
    await this.saveGameData();
  }

  /**
   * Update bindings from current game state
   * This syncs the UI bindings with the actual game state
   */
  private async updateBindingsFromGameState(): Promise<void> {
    // Update player data binding (screens derive what they need from this)
    this.playerDataBinding.set(this.playerData);

    // Update missions binding (still separate as it includes availability logic)
    this.missionUI.setPlayerLevel(this.playerLevel);
    const missionList = this.missionUI.getMissionList();
    const displayMissions: MissionDisplay[] = missionList.map(m => ({
      id: m.mission.id,
      name: m.mission.name,
      level: m.mission.level,
      difficulty: m.mission.difficulty,
      isAvailable: m.isAvailable,
      isCompleted: m.completionCount > 0,
      description: m.mission.description,
      affinity: m.mission.affinity,
      beastId: m.mission.beastId,
    }));
    this.missionsBinding.set(displayMissions);
  }

  /**
   * Navigate to a different screen
   */
  private navigate(screen: string): void {
    this.currentScreen = screen;
    this.currentScreenBinding.set(screen);
    this.triggerRender();
  }

  /**
   * Trigger a render
   * Notifies the platform to render (bindings update automatically)
   */
  private triggerRender(): void {
    // Skip rendering during initialization to prevent errors
    if (this.isInitializing) {
      return;
    }

    // Just notify platform - UI tree is reactive via bindings
    // No need to recreate the entire tree!
    this.platform.render(this.uiTree);
  }

  /**
   * Handle button clicks
   */
  private async handleButtonClick(buttonId: string): Promise<void> {
    // console.log('[BloomBeastsGame] Button clicked:', buttonId);

    // Play button sound
    this.playSfx('sfx-menu-button-select');

    // Handle navigation buttons
    switch (buttonId) {
      case 'play':
      case 'btn-missions':
        this.navigate('missions');
        break;
      case 'cards':
      case 'btn-cards':
        this.navigate('cards');
        break;
      case 'missions':
        this.navigate('missions');
        break;
      case 'settings':
      case 'btn-settings':
        this.navigate('settings');
        break;
      case 'shop':
        // console.log('Shop coming soon!');
        break;
      case 'btn-back':
        this.navigate('menu');
        break;
      case 'forfeit':
        // Show forfeit confirmation popup
        this.showForfeitConfirmation();
        break;
      default:
        // console.log('Unhandled button:', buttonId);
    }
  }

  /**
   * Show forfeit confirmation popup
   */
  private showForfeitConfirmation(): void {
    this.forfeitPopupBinding.set({
      title: 'Forfeit Battle?',
      message: 'Are you sure you want to give up? You will lose this battle.',
      buttons: [
        {
          text: 'Forfeit',
          onClick: () => {
            this.handleForfeit();
          },
          color: '#DC2626', // Red color
        },
        {
          text: 'Cancel',
          onClick: () => {
            this.forfeitPopupBinding.set(null);
          },
          color: '#6B7280', // Gray color
        },
      ],
    });
  }

  /**
   * Handle forfeit - player gives up
   */
  private handleForfeit(): void {
    // Close popup
    this.forfeitPopupBinding.set(null);

    // Play lose sound
    this.playSfx('sfx-lose');

    // End battle as a loss
    const currentBattle = this.battleUI.getCurrentBattle();
    if (currentBattle) {
      const defeatState = {
        ...currentBattle,
        isComplete: true,
        rewards: null, // No rewards for forfeit
        mission: currentBattle.mission,
      };
      this.handleBattleComplete(defeatState);
    }
  }

  /**
   * Handle card selection
   */
  private async handleCardSelect(cardId: string): Promise<void> {
    // console.log('[BloomBeastsGame] Card selected:', cardId);
    if (!this.playerData) return;

    // Play menu button sound
    this.playSfx('sfx-menu-button-select');

    const cardEntry = this.playerData.cards.collected.find(c => c.id === cardId);

    if (!cardEntry) {
      return;
    }

    // Check if card is in deck
    const isInDeck = this.playerData.cards.deck.includes(cardId);

    // Toggle card in/out of deck
    if (isInDeck) {
      await this.removeCardFromDeck(cardId);
    } else {
      await this.addCardToDeck(cardId);
    }
  }

  /**
   * Add card to player's deck
   */
  private async addCardToDeck(cardId: string): Promise<void> {
    if (!this.playerData) return;
    if (this.playerData.cards.deck.length >= DECK_SIZE) {
      Logger.warn(`Deck is full (${DECK_SIZE} cards)`);
      return;
    }

    if (!this.playerData.cards.deck.includes(cardId)) {
      this.playerData.cards.deck.push(cardId);
      await this.saveGameData();
      await this.updateBindingsFromGameState();
    }
  }

  /**
   * Remove card from player's deck
   */
  private async removeCardFromDeck(cardId: string): Promise<void> {
    if (!this.playerData) return;
    const index = this.playerData.cards.deck.indexOf(cardId);
    if (index > -1) {
      this.playerData.cards.deck.splice(index, 1);
      await this.saveGameData();
      await this.updateBindingsFromGameState();
    }
  }

  /**
   * Handle mission selection
   */
  private async handleMissionSelect(missionId: string): Promise<void> {
    Logger.info(`Mission selected: ${missionId}`);
    if (!this.playerData) return;

    // Reset battle state
    this.selectedBeastIndex = null;

    // Play menu button sound
    this.playSfx('sfx-menu-button-select');

    // Check if player has cards in deck
    if (this.playerData.cards.deck.length === 0) {
      Logger.warn('No cards in deck');
      // TODO: Show dialog or message to user
      return;
    }

    // Get player's deck cards
    const playerDeckCards = this.cardCollectionManager.getPlayerDeckCards(
      this.playerData.cards.deck,
      this.playerData.cards.collected
    );

    if (playerDeckCards.length === 0) {
      Logger.error('Failed to load deck cards');
      return;
    }

    // Start the mission
    const success = this.missionUI.startMission(missionId);

    if (success) {
      // console.log('[BloomBeastsGame] Mission started successfully');
      // Initialize battle with player's deck cards
      const battleState = this.battleUI.initializeBattle(playerDeckCards);
      // console.log('[BloomBeastsGame] battleState:', battleState);

      if (battleState) {
        // console.log('[BloomBeastsGame] Battle state is valid, initializing...');
        this.currentScreen = 'battle';
        this.currentBattleId = missionId;

        // Create battle display from battle state
        const battleDisplay = this.battleDisplayManager.createBattleDisplay(
          battleState,
          null, // No selected beast initially
          null  // No attack animation
        );
        // console.log('[BloomBeastsGame] battleDisplay:', battleDisplay);

        // Update battle display binding
        if (battleDisplay) {
          // console.log('[BloomBeastsGame] Setting battle display binding...');
          this.battleDisplayBinding.set(battleDisplay);
        } else {
          console.error('[BloomBeastsGame] battleDisplay is null!');
        }

        // Navigate to battle screen
        // console.log('[BloomBeastsGame] Navigating to battle screen');
        this.currentScreenBinding.set('battle');

        // Trigger re-render to show battle screen
        // console.log('[BloomBeastsGame] Triggering re-render');
        this.triggerRender();

        // Play battle music
        this.playMusic('music-battle', true);

        Logger.info('Battle initialized successfully');
      } else {
        console.error('[BloomBeastsGame] battleState is null or undefined!');
      }
    } else {
      Logger.warn('Mission is not available');
    }
  }

  /**
   * Handle settings changes
   */
  private handleSettingsChange(settingId: string, value: any): void {
    console.log('[BloomBeastsGame] Settings changed:', settingId, value);
    if (!this.playerData) return;
    console.log('[BloomBeastsGame] Current soundSettings before change:', this.playerData.settings);

    // Play button sound for toggles (not sliders)
    if (settingId === 'musicEnabled' || settingId === 'sfxEnabled') {
      this.playSfx('sfx-menu-button-select');
    }

    // Apply settings via sound manager
    switch (settingId) {
      case 'musicVolume':
        console.log('[BloomBeastsGame] Matched case: musicVolume');
        this.setMusicVolume(value);
        break;
      case 'sfxVolume':
        console.log('[BloomBeastsGame] Matched case: sfxVolume');
        this.setSfxVolume(value);
        break;
      case 'musicEnabled':
        console.log('[BloomBeastsGame] Matched case: musicEnabled');
        this.toggleMusic(value);
        break;
      case 'sfxEnabled':
        console.log('[BloomBeastsGame] Matched case: sfxEnabled');
        this.toggleSfx(value);
        break;
    }

    console.log('[BloomBeastsGame] Current soundSettings after change:', this.playerData.settings);

    // Save settings and update binding
    this.playerDataBinding.set(this.playerData);
    this.saveGameData();

    // Trigger re-render to update UI
    this.triggerRender();
  }

  /**
   * Handle battle actions
   */
  private async handleBattleAction(action: string): Promise<void> {
    // Handle forfeit button - show confirmation popup
    if (action === 'btn-forfeit' || action === 'forfeit') {
      this.showForfeitConfirmation();
      return;
    }

    // Handle back button - navigate to menu
    if (action === 'btn-back') {
      this.navigate('menu');
      return;
    }

    // Process the action through the battle UI
    if (!this.battleUI) {
      Logger.warn('Battle UI not initialized');
      return;
    }

    // Handle beast selection (UI-only action, doesn't go to battleUI)
    if (action.startsWith('view-field-card-player-')) {
      const index = parseInt(action.substring('view-field-card-player-'.length), 10);

      // Toggle selection: if already selected, deselect; otherwise select
      if (this.selectedBeastIndex === index) {
        this.selectedBeastIndex = null;
      } else {
        this.selectedBeastIndex = index;
      }

      // Update display with new selection
      const currentState = this.battleUI.getCurrentBattle();
      if (currentState) {
        const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
          currentState,
          this.selectedBeastIndex,
          null
        );
        if (updatedDisplay) {
          this.battleDisplayBinding.set(updatedDisplay);
        }
        this.triggerRender();
      }
      return;
    }

    // Handle opponent beast clicks - attack if you have a beast selected
    if (action.startsWith('view-field-card-opponent-')) {
      const targetIndex = parseInt(action.substring('view-field-card-opponent-'.length), 10);

      // If you have a beast selected, attack the opponent beast
      if (this.selectedBeastIndex !== null) {
        const attackAction = `attack-beast-${this.selectedBeastIndex}-${targetIndex}`;

        // Show attack animation
        await this.showAttackAnimation('player', this.selectedBeastIndex, 'opponent', targetIndex);

        // Clear selection
        this.selectedBeastIndex = null;

        // Don't return - continue to process the attack below
        action = attackAction;
      } else {
        // No beast selected - just show detail view
        return;
      }
    }

    // Play sound effects and show animations based on action type
    if (action.startsWith('attack-beast-')) {
      this.playSfx('sfx-attack');
      // Animation already shown above
      this.selectedBeastIndex = null; // Clear selection after attacking
    } else if (action.startsWith('attack-player-')) {
      this.playSfx('sfx-attack');
      // Extract attacker index and show animation for direct health attack
      const attackerIndex = parseInt(action.substring('attack-player-'.length), 10);
      await this.showAttackAnimation('player', attackerIndex, 'health', undefined);
      this.selectedBeastIndex = null; // Clear selection after attacking
    } else if (action.startsWith('play-card-')) {
      this.playSfx('sfx-play-card');
    } else if (action.startsWith('activate-trap-')) {
      this.playSfx('sfx-trap-card-activated');
    } else if (action === 'end-turn') {
      this.playSfx('sfx-menu-button-select');
    }

    // Process action
    await this.battleUI.processPlayerAction(action, {});

    // Get updated battle state
    const updatedState = this.battleUI.getCurrentBattle();
    if (updatedState) {
      // Check if battle ended FIRST - never render after completion
      if (updatedState.isComplete) {
        await this.handleBattleComplete(updatedState);
        return;
      }

      // Create updated battle display with fresh state
      const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
        updatedState,
        this.selectedBeastIndex,
        null  // No attack animation
      );

      // Update battle display binding - this should trigger UI refresh
      if (updatedDisplay) {
        // console.log('[BloomBeastsGame] Updating battle display with health:', {
        //   playerHealth: updatedDisplay.playerHealth,
        //   opponentHealth: updatedDisplay.opponentHealth
        // });
        this.battleDisplayBinding.set(updatedDisplay);
        this.triggerRender();
      }
    }
  }

  /**
   * Handle battle completion (victory or defeat)
   */
  private async handleBattleComplete(battleState: any): Promise<void> {
    // console.log('[BloomBeastsGame] Handling battle completion...');
    if (!this.playerData) return;

    // Capture playerData in local const for TypeScript null safety in callbacks
    const playerData = this.playerData;

    // Stop all timers immediately
    if (this.battleScreen) {
      this.battleScreen.cleanup();
    }

    // Keep battle visible in background while popup shows
    // Battle display will be cleared when user clicks Continue
    const battleId = this.currentBattleId; // Save before clearing
    this.currentBattleId = null;

    // console.log('[BloomBeastsGame] Battle complete, checking rewards:', {
    //   hasRewards: !!battleState.rewards,
    //   rewards: battleState.rewards
    // });

    if (battleState.rewards) {
      // Victory!
      // console.log('[BloomBeastsGame] Mission victory!', battleState.rewards);

      // Award XP
      this.addXP(battleState.rewards.xpGained);

      // Award card XP
      const cardXP = battleState.rewards.beastXP || battleState.rewards.xpGained;
      this.cardCollectionManager.awardDeckExperience(
        cardXP,
        playerData.cards.deck,
        playerData.cards.collected
      );

      // Add cards to collection
      battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
        this.cardCollectionManager.addCardReward(card, playerData.cards.collected, index);
      });

      // Add items to inventory
      if (battleState.rewards.itemsReceived) {
        battleState.rewards.itemsReceived.forEach((itemReward: any) => {
          this.addItems(itemReward.itemId, itemReward.quantity);
        });
      }

      // Track mission completion
      if (battleId) {
        this.trackMissionCompletion(battleId);
      }

      // Play win sound
      this.playSfx('sfx-win');

      // Save game data
      await this.saveGameData();

      // Show mission complete popup
      // console.log('[BloomBeastsGame] Setting victory popup...');
      const popupData = {
        mission: battleState.mission,
        rewards: battleState.rewards,
        chestOpened: false,
        onClaimRewards: () => {
          // console.log('[BloomBeastsGame] Claim rewards clicked');
          // Chest animation could go here
          const current = this.missionCompletePopupValue;
          if (current) {
            const updatedData = {
              ...current,
              chestOpened: true
            };
            this.missionCompletePopupValue = updatedData;
            this.missionCompletePopupBinding.set(updatedData);
            // console.log('[BloomBeastsGame] Chest opened, triggering render');
            this.triggerRender();
          }
        },
        onContinue: () => {
          // console.log('[BloomBeastsGame] Victory continue clicked');
          // Clear battle display and close popup
          this.battleDisplayBinding.set(null);
          this.missionCompletePopupValue = null;
          this.missionCompletePopupBinding.set(null);
          this.navigate('missions');
        }
      };

      // Set both tracked value and binding
      this.missionCompletePopupValue = popupData;
      this.missionCompletePopupBinding.set(popupData);
      // console.log('[BloomBeastsGame] Victory popup set');
      this.triggerRender();
      // console.log('[BloomBeastsGame] Render triggered after victory popup');
    } else {
      // Defeat
      // console.log('[BloomBeastsGame] Mission failed!');

      // Play lose sound
      this.playSfx('sfx-lose');

      // Show mission failed popup
      const failedPopupProps = {
        mission: battleState.mission,
        rewards: null, // null indicates failure
        chestOpened: false,
        onContinue: () => {
          // Clear battle display and close popup
          this.battleDisplayBinding.set(null);
          this.missionCompletePopupValue = null;
          this.missionCompletePopupBinding.set(null);
          this.navigate('missions');
        }
      };
      // console.log('[BloomBeastsGame] Setting mission failed popup:', failedPopupProps);
      this.missionCompletePopupValue = failedPopupProps;
      this.missionCompletePopupBinding.set(failedPopupProps);
      // console.log('[BloomBeastsGame] After set, mission failed popup set');
      this.triggerRender();
      // console.log('[BloomBeastsGame] Render triggered after mission failed');
    }

    // Resume background music
    this.playMusic('music-background', true);

    // Note: Navigation happens when user clicks Continue in the popup
  }

  /**
   * Create the main UI tree
   * This is created once and updated reactively via bindings
   */
  private createUI(): UINode {
    const { View } = this.UI;

    // Create all screens upfront
    const loadingScreen = this.createLoadingScreen();
    const menuScreen = this.menuScreen.createUI();
    const cardsScreen = this.cardsScreen.createUI();
    const missionsScreen = this.missionScreen.createUI();
    const battleScreen = this.battleScreen.createUI();
    const settingsScreen = this.settingsScreen.createUI();

    // Use conditional rendering to show the right screen based on currentScreenBinding
    const createConditionalScreen = (screenName: string, screenUI: UINode) => {
      if (this.UI.UINode && this.UI.UINode.if) {
        return this.UI.UINode.if(
          this.currentScreenBinding.derive((current: string) => current === screenName),
          screenUI
        );
      }
      return screenUI;
    };

    // Build main UI with conditional screens
    const children: any[] = [
      createConditionalScreen('loading', loadingScreen),
      createConditionalScreen('menu', menuScreen),
      createConditionalScreen('cards', cardsScreen),
      createConditionalScreen('missions', missionsScreen),
      createConditionalScreen('battle', battleScreen),
      createConditionalScreen('settings', settingsScreen),
    ];

    // Add popups (these already use UINode.if)
    if (this.UI.UINode) {
      children.push(
        this.UI.UINode.if(
          this.UI.Binding.derive(
            [this.missionCompletePopupBinding],
            (props) => {
              // Update tracked value
              this.missionCompletePopupValue = props;
              return props !== null;
            }
          ),
          createMissionCompletePopup(this.UI, this.missionCompletePopupValue || {
            mission: {
              id: 'fallback-mission',
              name: 'Loading...',
              affinity: 'Forest'
            },
            rewards: null,
            chestOpened: false,
            onContinue: () => {}
          })
        )
      );
    }

    if (this.UI.UINode) {
      children.push(
        this.UI.UINode.if(
          this.UI.Binding.derive(
            [this.forfeitPopupBinding],
            (props) => {
              // Update tracked value
              this.forfeitPopupValue = props;
              return props !== null;
            }
          ),
          createButtonPopup(this.UI, this.forfeitPopupValue || {
            title: '',
            message: '',
            buttons: [],
            onButtonClick: () => {}
          })
        )
      );
    }

    if (this.UI.UINode) {
      children.push(
        this.UI.UINode.if(
          this.UI.Binding.derive(
            [this.cardDetailPopupBinding],
            (props: any) => {
              // Update tracked value
              this.cardDetailPopupValue = props;
              return props !== null;
            }
          ),
          createCardDetailPopup(this.UI, this.cardDetailPopupValue || {
            cardDetail: {
              card: {
                id: 'empty-card-fallback',
                name: 'Loading...',
                type: 'Bloom',
                level: 1,
                experience: 0,
                count: 0,
                description: ''
              },
              buttons: [],
              isInDeck: false
            },
            onButtonClick: () => {}
          })
        )
      );
    }

    return View({
      style: {
        width: '100%',
        height: '100%',
      },
      children,
    });
  }

  /**
   * Create the loading screen UI
   */
  private createLoadingScreen(): UINode {
    const { View } = this.UI;

    return View({
      style: {
        flex: 1,
        backgroundColor: '#1a1a2e', // Dark background as fallback
      },
      children: [
        // Note: Background image removed since assets aren't loaded during initialization
        // The loading screen is only shown briefly before assets load anyway

        // Loading text centered
        View({
          style: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: this.UI.Text({
            text: this.UI.Binding ? new this.UI.Binding('Loading...') : 'Loading...',
            style: {
              fontSize: 32,
              color: '#ffffff',
              fontWeight: 'bold',
              textShadowColor: '#000000',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 4,
            }
          })
        })
      ]
    });
  }


  /**
   * Show attack animation
   */
  private async showAttackAnimation(
    attackerPlayer: 'player' | 'opponent',
    attackerIndex: number,
    targetPlayer: 'player' | 'opponent' | 'health',
    targetIndex?: number
  ): Promise<void> {
    const currentState = this.battleUI.getCurrentBattle();
    if (!currentState) return;

    // Show animation (attacker glows green, target glows red)
    const displayWithAnimation = this.battleDisplayManager.createBattleDisplay(
      currentState,
      this.selectedBeastIndex,
      {
        attackerPlayer,
        attackerIndex,
        targetPlayer,
        targetIndex
      }
    );

    if (displayWithAnimation) {
      this.battleDisplayBinding.set(displayWithAnimation);
      this.triggerRender();
    }

    // Wait for animation duration
    await new Promise(resolve => this.asyncMethods.setTimeout(resolve, 500));

    // Clear animation
    const displayWithoutAnimation = this.battleDisplayManager.createBattleDisplay(
      currentState,
      null, // Clear selection after attack
      null  // No animation
    );

    if (displayWithoutAnimation) {
      this.battleDisplayBinding.set(displayWithoutAnimation);
      this.triggerRender();
    }
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.menuScreen.dispose();
    // TODO: Dispose other resources
  }
}
