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
import { UpgradeScreen } from './ui/screens/UpgradeScreen';
import { MissionScreen } from './ui/screens/MissionScreen';
import { BattleScreen } from './ui/screens/BattleScreen';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { LeaderboardScreen, type LeaderboardData } from './ui/screens/LeaderboardScreen';
import { UPGRADE_COSTS, COIN_BOOST, EXP_BOOST, LUCK_BOOST, ROOSTER } from './constants/upgrades';
import { createMissionCompletePopup } from './ui/screens/common/MissionCompletePopup';
import { createButtonPopup } from './ui/screens/common/ButtonPopup';
import { createCardDetailPopup } from './ui/screens/common/CardDetailPopup';
import { GameEngine } from './engine/systems/GameEngine';
import { CardCollectionManager } from './systems/CardCollectionManager';
import { BattleDisplayManager } from './systems/BattleDisplayManager';
import { BindingManager, BindingType, UIState } from './ui/types/BindingManager';
import { MissionManager } from './screens/missions/MissionManager';
import { MissionSelectionUI } from './screens/missions/MissionSelectionUI';
import { MissionBattleUI } from './screens/missions/MissionBattleUI';
import { CardInstance } from './screens/cards/types';
import { setCatalogManagerForUtils } from './utils/cardUtils';
import { setCatalogManagerForDeckBuilder } from './engine/utils/deckBuilder';
import { DECK_SIZE } from './engine/constants/gameRules';
import { Logger } from './engine/utils/Logger';
import type { AsyncMethods } from './ui/types/bindings';
import { normalizeSoundId } from './AssetCatalog';
import type { MenuStats, MissionDisplay, BattleDisplay, ObjectiveDisplay, CardDetailDisplay, SoundSettings } from './gameManager';
import { gameDimensions } from './ui/screens/battle';

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

  // Centralized binding manager - ONLY way to create/access bindings
  bindingManager: BindingManager;

  // Platform-specific helpers
  assetIdToImageSource?: (assetId: string) => any; // Convert asset ID to ImageSource (Horizon) or string (Web)
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

  // Currency
  coins: number;

  // Card collection and deck (SINGLE SOURCE OF TRUTH)
  cards: {
    collected: CardInstance[]; // All owned card instances
    deck: string[]; // Card instance IDs in player's deck
  };

  // Mission tracking
  missions: {
    completedMissions: { [missionId: string]: number }; // Mission ID -> completion count
  };

  // Item inventory (only special items like serums)
  items: PlayerItem[];

  // Boost upgrades (0-6 levels per boost)
  boosts: {
    [boostId: string]: number; // Boost ID -> upgrade level (0-6)
  };

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
   * Platform must ensure valid PlayerData is returned (create default if none exists)
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
   * Asset catalog manager instance
   * Provides access to all game asset metadata and card definitions
   */
  catalogManager: any; // AssetCatalogManager instance

  /**
   * Get platform-specific UI method implementations
   *
   * For web: Returns web-specific View, Text, Image, Pressable
   * For horizon: Returns hz.View, hz.Text, hz.Image, hz.Pressable
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

  /**
   * World Variables (optional)
   * Implement if your platform supports world variables (e.g., Horizon)
   *
   * For Horizon: Use world.getVariable() and world.setVariable()
   * For web: Use mock data or skip
   */
  getWorldVariable?: (variableGroup: string, variableName: string) => any;
  setWorldVariable?: (variableGroup: string, variableName: string, value: any) => void;

  /**
   * Network Events (optional)
   * Implement if your platform supports network events (e.g., Horizon)
   *
   * For Horizon: Use world.sendNetworkEvent()
   * For web: Use mock/skip
   */
  sendNetworkEvent?: (eventName: string, data: any) => void;
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
  private currentBattleId: string | null = null;
  private battleStartTime: number | null = null;  // Track battle start time for leaderboard


  // Screen instances
  private menuScreen: MenuScreen;
  private cardsScreen: CardsScreen;
  private upgradeScreen: UpgradeScreen;
  private missionScreen: MissionScreen;
  private battleScreen: BattleScreen;
  private settingsScreen: SettingsScreen;
  private leaderboardScreen: LeaderboardScreen;

  // UI tree (created once, updated reactively)
  // Public so platform wrappers can access it (needed for Horizon's initializeUI)
  public uiTree: UINode | null = null;

  constructor(config: PlatformConfig) {
    this.platform = config;

    // Get platform-specific async methods
    this.asyncMethods = config.async;

    // Store platform-provided asset getters
    this.platformGetImageAsset = config.getImageAsset;

    // Initialize card utils and deck builder with catalog manager
    setCatalogManagerForUtils(config.catalogManager);
    setCatalogManagerForDeckBuilder(config.catalogManager);

    // Initialize core systems
    this.gameEngine = new GameEngine(config.catalogManager);
    this.missionManager = new MissionManager(config.catalogManager);
    this.missionUI = new MissionSelectionUI(this.missionManager);
    this.battleUI = new MissionBattleUI(this.missionManager, this.gameEngine, this.asyncMethods);
    this.cardCollectionManager = new CardCollectionManager(config.catalogManager);
    this.battleDisplayManager = new BattleDisplayManager(config.catalogManager);

    // Get platform-specific UI methods and add bindingManager to them
    this.UI = config.getUIMethodMappings() as UIMethodMappings;

    // Create screen instances (pass UI methods and playerData binding)
    this.menuScreen = new MenuScreen({
      ui: this.UI,
      onButtonClick: this.handleButtonClick.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this),
      playSfx: this.playSfx.bind(this)
    });

    this.cardsScreen = new CardsScreen({
      ui: this.UI,
      onCardSelect: this.handleCardSelect.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this),
      playSfx: this.playSfx.bind(this)
    });

    this.upgradeScreen = new UpgradeScreen({
      ui: this.UI,
      onNavigate: this.navigate.bind(this),
      onUpgrade: this.handleUpgrade.bind(this),
      playSfx: this.playSfx.bind(this)
    });

    this.missionScreen = new MissionScreen({
      ui: this.UI,
      onMissionSelect: this.handleMissionSelect.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this),
      playSfx: this.playSfx.bind(this)
    });

    this.battleScreen = new BattleScreen({
      ui: this.UI,
      async: this.asyncMethods,
      onAction: this.handleBattleAction.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this),
      onShowCardDetail: this.showCardDetailPopup.bind(this),
      playSfx: this.playSfx.bind(this)
    });

    this.settingsScreen = new SettingsScreen({
      ui: this.UI,
      onSettingChange: this.handleSettingsChange.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this),
      playSfx: this.playSfx.bind(this)
    });

    this.leaderboardScreen = new LeaderboardScreen({
      ui: this.UI,
      onNavigate: this.navigate.bind(this),
      playSfx: this.playSfx.bind(this)
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
    // Load saved game data (initializes starting cards if needed)
    await this.loadGameData();

    // Update bindings from loaded data
    await this.updateBindingsFromGameState();

    // Trigger initial render
    this.triggerRender();

    // Start menu music
    this.playMusic('music-background', true);
    this.navigate('menu');
  }

  /**
   * Get current player level (derived from totalXP)
   */
  private get playerLevel(): number {
    return getPlayerLevel(this.playerData?.totalXP ?? 0);
  }

  /**
   * Load game data from platform storage
   * Platform is responsible for creating default data if none exists
   */
  private async loadGameData(): Promise<void> {
    const savedData = this.platform.getPlayerData?.();

    if (!savedData || Object.keys(savedData).length === 0) {
      throw new Error('Platform must provide valid PlayerData (either loaded or newly created)');
    }

    // Use platform-provided data directly
    this.playerData = savedData;
    Logger.info(`[BloomBeastsGame] Loaded player data for "${this.playerData.name}" with ${savedData.cards.collected.length} cards`);

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
    if (!this.playerData?.settings) return;
    this.playerData.settings.musicEnabled = enabled;

    // Notify platform
    this.platform.setMusicEnabled?.(enabled);

    if (enabled && this.currentMusic) {
      // Resume music - force replay even if it's the same track
      const musicToResume = this.currentMusic;
      const volume = this.playerData.settings.musicVolume / 100;
      this.platform.playSound?.(musicToResume, true, volume);
    } else if (!enabled) {
      // Stop music playback but keep track of current music for resume
      // Don't call stopMusic() as it clears this.currentMusic
      this.platform.stopSound?.();
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

    // Submit experience to leaderboard
    this.submitLeaderboardScore('experience', this.playerData.totalXP);
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
    this.UI.bindingManager.setBinding(BindingType.PlayerData, this.playerData);

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

    this.UI.bindingManager.setBinding(BindingType.Missions, displayMissions);
  }

  /**
   * Navigate to a different screen
   */
  private navigate(screen: string): void {
    this.UI.bindingManager.setBinding(BindingType.CurrentScreen, screen);

    // Load leaderboard data when navigating to leaderboard screen
    if (screen === 'leaderboard') {
      this.loadLeaderboardData();
    }

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
      case 'upgrades':
      case 'btn-upgrades':
        this.navigate('upgrades');
        break;
      case 'missions':
        this.navigate('missions');
        break;
      case 'settings':
      case 'btn-settings':
        this.navigate('settings');
        break;
      case 'shop':
        break;
      case 'btn-back':
        this.navigate('menu');
        break;
      case 'forfeit':
        // Show forfeit confirmation popup
        this.showForfeitConfirmation();
        break;
      default:
    }
  }

  /**
   * Show forfeit confirmation popup
   */
  private showForfeitConfirmation(): void {
    this.UI.bindingManager.setBinding(BindingType.ForfeitPopup, {
      title: 'Are you sure?',
      message: 'You will lose this battle.',
      buttons: [
        {
          text: 'Yes',
          onClick: () => {
            this.handleForfeit();
          },
          color: 'red',
        },
        {
          text: 'No',
          onClick: () => {
            this.UI.bindingManager.setBinding(BindingType.ForfeitPopup, null);
          },
          color: 'default',
        },
      ],
      playSfx: this.playSfx.bind(this),
    });
  }

  /**
   * Show card detail popup for a duration, then close and execute callback
   */
  private showCardDetailPopup(card: any, durationMs: number, callback?: () => void): void {
    // Set the card detail popup
    this.UI.bindingManager.setBinding(BindingType.CardDetailPopup, {
      cardDetail: {
        card: card,
        stats: null,
      },
      onButtonClick: () => {
        // Close button clicked
        this.UI.bindingManager.setBinding(BindingType.CardDetailPopup, null);
      },
      playSfx: this.playSfx.bind(this)
    });
    this.triggerRender();

    // After duration, close the popup and execute callback
    this.asyncMethods.setTimeout(() => {
      this.UI.bindingManager.setBinding(BindingType.CardDetailPopup, null);
      this.triggerRender();
      callback?.();
    }, durationMs);
  }

  /**
   * Handle forfeit - player gives up
   */
  private handleForfeit(): void {
    // Close popup
    this.UI.bindingManager.setBinding(BindingType.ForfeitPopup, null);

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
      // Initialize battle with player's deck cards and name
      const battleState = this.battleUI.initializeBattle(playerDeckCards, this.playerData.name);

      if (battleState) {
        this.currentBattleId = missionId;
        this.battleStartTime = Date.now();  // Track start time for leaderboard

        // Create battle display from battle state
        const battleDisplay = this.battleDisplayManager.createBattleDisplay(
          battleState,
          null  // No attack animation
        );

        // Update battle display binding
        if (battleDisplay) {
          this.UI.bindingManager.setBinding(BindingType.BattleDisplay, battleDisplay);
        } else {
          console.error('[BloomBeastsGame] battleDisplay is null!');
        }

        // Navigate to battle screen
        this.UI.bindingManager.setBinding(BindingType.CurrentScreen, 'battle');

        // Trigger re-render to show battle screen
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
    if (!this.playerData) return;

    // Play button sound for toggles (not sliders)
    if (settingId === 'musicEnabled' || settingId === 'sfxEnabled') {
      this.playSfx('sfx-menu-button-select');
    }

    // Apply settings via sound manager
    switch (settingId) {
      case 'musicVolume':
        this.setMusicVolume(value);
        break;
      case 'sfxVolume':
        this.setSfxVolume(value);
        break;
      case 'musicEnabled':
        this.toggleMusic(value);
        break;
      case 'sfxEnabled':
        this.toggleSfx(value);
        break;
    }

    // Save settings and update binding
    this.UI.bindingManager.setBinding(BindingType.PlayerData, this.playerData);
    this.saveGameData();

    // Trigger re-render to update UI
    this.triggerRender();
  }

  /**
   * Handle upgrade purchase
   */
  private handleUpgrade(boostId: string): void {
    if (!this.playerData) return;

    // Get current boost level
    const currentLevel = this.playerData.boosts?.[boostId] || 0;

    // Check if already at max level
    if (currentLevel >= 6) {
      return;
    }

    // Get cost for next level based on current level
    const costs = UPGRADE_COSTS[boostId];
    if (!costs) {
      return;
    }

    const cost = costs[currentLevel];

    // Check if player has enough coins
    if (this.playerData.coins < cost) {
      return;
    }

    // Deduct coins
    this.playerData.coins -= cost;

    // Initialize boosts if not present
    if (!this.playerData.boosts) {
      this.playerData.boosts = {
        [COIN_BOOST.id]: 0,
        [EXP_BOOST.id]: 0,
        [LUCK_BOOST.id]: 0,
        [ROOSTER.id]: 0
      };
    }

    // Increment boost level
    this.playerData.boosts[boostId] = currentLevel + 1;

    // Play upgrade sound (special sound for rooster)
    if (boostId === ROOSTER.id) {
      this.playSfx('sfx-upgrade-rooster');
    } else {
      this.playSfx('sfx-upgrade');
    }

    // Save and update
    this.UI.bindingManager.setBinding(BindingType.PlayerData, this.playerData);
    this.saveGameData();
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

    // Beast and opponent clicks are now just for viewing details (no selection)
    if (action.startsWith('view-field-card-player-') || action.startsWith('view-field-card-opponent-')) {
      // Just return - card details will be shown by the UI layer if needed
      return;
    }

    // Play sound effects and show animations based on action type
    if (action === 'auto-attack-all') {
      // Handle auto-attack with animations
      this.playSfx('sfx-attack');

      // Process action with animation callback
      await this.battleUI.processPlayerAction(action, {
        onAttackAnimation: async (attackerIndex: number, targetType: 'beast' | 'health', targetIndex?: number) => {
          if (targetType === 'beast' && targetIndex !== undefined) {
            await this.showAttackAnimation('player', attackerIndex, 'opponent', targetIndex);
          } else {
            await this.showAttackAnimation('player', attackerIndex, 'health', undefined);
          }
        }
      });

      // Get updated state and render
      const updatedState = this.battleUI.getCurrentBattle();
      if (updatedState) {
        if (updatedState.isComplete) {
          await this.handleBattleComplete(updatedState);
          return;
        }

        const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
          updatedState,
          null
        );
        if (updatedDisplay) {
          this.UI.bindingManager.setBinding(BindingType.BattleDisplay, updatedDisplay);
          this.triggerRender();
        }
      }
      return;
    } else if (action.startsWith('attack-beast-')) {
      this.playSfx('sfx-attack');
      // Animation already shown above
    } else if (action.startsWith('attack-player-')) {
      this.playSfx('sfx-attack');
      // Extract attacker index and show animation for direct health attack
      const attackerIndex = parseInt(action.substring('attack-player-'.length), 10);
      await this.showAttackAnimation('player', attackerIndex, 'health', undefined);
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
        null  // No attack animation
      );

      // Update battle display binding - this should trigger UI refresh
      if (updatedDisplay) {
        //   playerHealth: updatedDisplay.playerHealth,
        //   opponentHealth: updatedDisplay.opponentHealth
        // });
        this.UI.bindingManager.setBinding(BindingType.BattleDisplay, updatedDisplay);
        this.triggerRender();
      }
    }
  }

  /**
   * Handle battle completion (victory or defeat)
   */
  private async handleBattleComplete(battleState: any): Promise<void> {
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

    //   hasRewards: !!battleState.rewards,
    //   rewards: battleState.rewards
    // });

    if (battleState.rewards) {
      // Victory!

      // Apply boost multipliers to rewards
      const coinBoostLevel = playerData.boosts?.[COIN_BOOST.id] || 0;
      const expBoostLevel = playerData.boosts?.[EXP_BOOST.id] || 0;
      const luckBoostLevel = playerData.boosts?.[LUCK_BOOST.id] || 0;

      let coinBoostPercent = 0;
      let expBoostPercent = 0;
      let luckBoostPercent = 0;

      // Calculate and apply coin boost
      if (coinBoostLevel > 0 && COIN_BOOST.values && battleState.rewards.coinsReceived) {
        coinBoostPercent = COIN_BOOST.values[coinBoostLevel - 1];
        const multiplier = (coinBoostPercent / 100) + 1;
        const boostedCoins = Math.floor(battleState.rewards.coinsReceived * multiplier);
        battleState.rewards.coinsReceived = boostedCoins;
      }

      // Calculate and apply exp boost
      if (expBoostLevel > 0 && EXP_BOOST.values) {
        expBoostPercent = EXP_BOOST.values[expBoostLevel - 1];
        const multiplier = (expBoostPercent / 100) + 1;
        const boostedXP = Math.floor(battleState.rewards.xpGained * multiplier);
        const boostedBeastXP = Math.floor(battleState.rewards.beastXP * multiplier);
        battleState.rewards.xpGained = boostedXP;
        battleState.rewards.beastXP = boostedBeastXP;
      }

      // Calculate luck boost (affects drop chances - already rolled, so no effect on this implementation)
      if (luckBoostLevel > 0 && LUCK_BOOST.values) {
        luckBoostPercent = LUCK_BOOST.values[luckBoostLevel - 1];
        // Luck boost would affect drop chances, but rewards are already generated
        // This is shown for informational purposes
      }

      // Add boost info to rewards for display
      if (!battleState.rewards.bonusRewards) {
        battleState.rewards.bonusRewards = [];
      }
      if (coinBoostPercent > 0) {
        battleState.rewards.bonusRewards.push(`Coin Boost: +${coinBoostPercent}%`);
      }
      if (expBoostPercent > 0) {
        battleState.rewards.bonusRewards.push(`EXP Boost: +${expBoostPercent}%`);
      }
      if (luckBoostPercent > 0) {
        battleState.rewards.bonusRewards.push(`Luck Boost: +${luckBoostPercent}%`);
      }

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

      // Add coins
      if (battleState.rewards.coinsReceived) {
        playerData.coins += battleState.rewards.coinsReceived;
      }

      // Add items to inventory
      if (battleState.rewards.itemsReceived) {
        battleState.rewards.itemsReceived.forEach((itemReward: any) => {
          this.addItems(itemReward.itemId, itemReward.quantity);
        });
      }

      // Track mission completion
      if (battleId) {
        this.trackMissionCompletion(battleId);

        // If this is Cluck Norris mission, submit time to leaderboard
        if (battleId === 'mission17' && this.battleStartTime) {
          const completionTime = (Date.now() - this.battleStartTime) / 1000; // Convert to seconds
          this.submitLeaderboardScore('cluckNorris', completionTime);
        }
      }

      // Reset battle start time
      this.battleStartTime = null;

      // Play win sound
      this.playSfx('sfx-win');

      // Save game data
      await this.saveGameData();

      // Show mission complete popup
      const popupData = {
        mission: battleState.mission,
        rewards: battleState.rewards,
        chestOpened: false,
        onClaimRewards: () => {
          // Chest animation could go here
          const current = this.UI.bindingManager.getSnapshot(BindingType.MissionCompletePopup);
          if (current) {
            const updatedData = {
              ...current,
              chestOpened: true
            };
            this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, updatedData);
            this.triggerRender();
          }
        },
        onContinue: () => {
          // Clear battle display and close popup
          this.UI.bindingManager.setBinding(BindingType.BattleDisplay, null);
          this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, null);
          this.navigate('missions');
        },
        playSfx: this.playSfx.bind(this)
      };

      // Set both tracked value and binding
      this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, popupData);
      this.triggerRender();
    } else {
      // Defeat

      // Reset battle start time
      this.battleStartTime = null;

      // Play lose sound
      this.playSfx('sfx-lose');

      // Show mission failed popup
      const failedPopupProps = {
        mission: battleState.mission,
        rewards: null, // null indicates failure
        chestOpened: false,
        onContinue: () => {
          // Clear battle display and close popup
          this.UI.bindingManager.setBinding(BindingType.BattleDisplay, null);
          this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, null);
          this.navigate('missions');
        },
        playSfx: this.playSfx.bind(this)
      };
      this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, failedPopupProps);
      this.triggerRender();
    }

    // Resume background music
    this.playMusic('music-background', true);

    // Note: Navigation happens when user clicks Continue in the popup
  }

  /**
   * Load leaderboard data from world variables
   */
  private loadLeaderboardData(): void {
    if (!this.platform.getWorldVariable) {
      // World variables not supported on this platform, use mock data
      this.UI.bindingManager.setBinding(BindingType.LeaderboardData, {
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
      });
      return;
    }

    try {
      // Get leaderboard data from world variable
      const leaderboardData = this.platform.getWorldVariable('BloomBeastsData', 'leaderboard');

      if (leaderboardData) {
        this.UI.bindingManager.setBinding(BindingType.LeaderboardData, leaderboardData);
      } else {
        // No data yet, set empty arrays
        this.UI.bindingManager.setBinding(BindingType.LeaderboardData, {
          topExperience: [],
          fastestCluckNorris: [],
        });
      }
    } catch (error) {
      console.error('[BloomBeastsGame] Failed to load leaderboard data:', error);
      this.UI.bindingManager.setBinding(BindingType.LeaderboardData, {
        topExperience: [],
        fastestCluckNorris: [],
      });
    }
  }

  /**
   * Submit player score to leaderboard via network event
   */
  private submitLeaderboardScore(type: 'experience' | 'cluckNorris', score: number): void {
    if (!this.platform.sendNetworkEvent) {
      // Network events not supported on this platform
      return;
    }

    if (!this.playerData) {
      console.warn('[BloomBeastsGame] Cannot submit score: player data not loaded');
      return;
    }

    try {
      const playerName = this.playerData.name || 'Unknown Player';
      const eventData = {
        playerName,
        type,
        score,
        level: type === 'experience' ? getPlayerLevel(this.playerData.totalXP) : undefined,
      };

      this.platform.sendNetworkEvent('leaderboard_score_submit', eventData);
    } catch (error) {
      console.error('[BloomBeastsGame] Failed to submit leaderboard score:', error);
    }
  }

  /**
   * Create the main UI tree
   * This is created once and updated reactively via bindings
   */
  private createUI(): UINode {
    const { View } = this.UI;

    // Build main UI with conditional screens
    const children: any[] = [
      this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'loading'), this.createLoadingScreen()) : null,
      this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'menu'), this.menuScreen.createUI()) : null,
      this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'cards'), this.cardsScreen.createUI()) : null,
      this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'upgrades'), this.upgradeScreen.createUI()) : null,
      this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'missions'), this.missionScreen.createUI()) : null,
      this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'battle'), this.battleScreen.createUI()) : null,
      this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'settings'), this.settingsScreen.createUI()) : null,
      this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'leaderboard'), this.leaderboardScreen.createUI()) : null,
    ];

    // Add popups (these already use UINode.if)
    // Mission Complete Popup - static structure with derived content
    if (this.UI.UINode) {
      children.push(
        this.UI.UINode.if(
          this.UI.bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
            return props !== null;
          }),
          createMissionCompletePopup(this.UI, this.UI.bindingManager)
        )
      );
    }

    // Forfeit Popup - static structure with derived content
    if (this.UI.UINode) {
      children.push(
        this.UI.UINode.if(
          this.UI.bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
            return props !== null;
          }),
          createButtonPopup(this.UI, this.UI.bindingManager)
        )
      );
    }

    if (this.UI.UINode) {
      children.push(
        this.UI.UINode.if(
          this.UI.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
            return props !== null;
          }),
          createCardDetailPopup(this.UI, this.UI.bindingManager.getSnapshot(BindingType.CardDetailPopup) || {
            cardDetail: {
              card: {
                id: null, // No ID so CardRenderer returns null for images
                name: '',
                type: 'Bloom',
                level: 1,
                experience: 0,
                count: 0,
                description: ''
              },
              buttons: [],
              isInDeck: false
            },
            onButtonClick: () => {},
            playSfx: this.playSfx.bind(this)
          })
        )
      );
    }

    return View({
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: [
        // Inner container with aspect ratio that scales content
        View({
          style: {
            width: '100%',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            position: 'relative',
            aspectRatio: `${gameDimensions.panelWidth}/${gameDimensions.panelHeight}`
          },
          children,
        })
      ],
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
            text: 'Loading...',
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
      {
        attackerPlayer,
        attackerIndex,
        targetPlayer,
        targetIndex
      }
    );

    if (displayWithAnimation) {
      this.UI.bindingManager.setBinding(BindingType.BattleDisplay, displayWithAnimation);
      this.triggerRender();
    }

    // Wait for animation duration
    await new Promise(resolve => this.asyncMethods.setTimeout(resolve, 500));

    // Clear animation
    const displayWithoutAnimation = this.battleDisplayManager.createBattleDisplay(
      currentState,
      null  // No animation
    );

    if (displayWithoutAnimation) {
      this.UI.bindingManager.setBinding(BindingType.BattleDisplay, displayWithoutAnimation);
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
