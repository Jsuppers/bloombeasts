/**
 * BloomBeastsGame - Unified Game Controller
 *
 * This is the main entry point for the game that works across all platforms (web, horizon).
 * Platform-specific code should be minimal - just implement the PlatformConfig callbacks.
 *
 * The game is fully platform-agnostic - it doesn't even import UI methods directly,
 * but receives them from the platform configuration.
 */

// Screen imports now in ScreenFactory
// Popup imports now in UIBuilder
import { BindingManager, BindingType } from './common/ui/types/types/BindingManager';
// Mission and Battle systems now imported via CoreSystemsInitializer
import { Logger } from './common/engine/utils/Logger';
import type { AsyncMethods } from './common/ui/types/types/bindings';
// Core managers now imported via CoreSystemsInitializer
import { getPlayerLevel, GAME_CONSTANTS, SOUND_EFFECTS, MUSIC_TRACKS } from './core/GameConstants';
import { ScreenFactory, type GameScreens } from './core/ScreenFactory';
import { CoreSystemsInitializer, type CoreSystems } from './core/CoreSystemsInitializer';
import { ValidationHelpers } from './core/ValidationHelpers';
import { ActionHandler } from './core/ActionHandler';
import { DataManager } from './core/DataManager';
import { UIBuilder } from './core/UIBuilder';

// Import and re-export all types from organized type directory
import type {
  UINode,
  UIElement,
  ConditionalUINode,
  ReadonlyBindingInterface,
  BindingInterface,
  BindingConstructor,
  StyleProps,
  BaseUIProps,
  ViewProps,
  TextProps,
  ImageProps,
  PressableProps,
  ScrollViewProps,
  UIMethodMappings,
  PlayerData,
  PlayerItem,
  PlatformConfig,
} from './types';

// Export types for regular module bundling (web deployment)
// Note: These exports are fine for namespace bundling too
export type {
  // UI types
  UINode,
  UIElement,
  ConditionalUINode,
  ReadonlyBindingInterface,
  BindingInterface,
  BindingConstructor,
  StyleProps,
  BaseUIProps,
  ViewProps,
  TextProps,
  ImageProps,
  PressableProps,
  ScrollViewProps,
  UIMethodMappings,
  // Game types
  PlayerData,
  PlayerItem,
  // Platform types
  PlatformConfig,
} from './types';

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

  // Core game systems - initialized via CoreSystemsInitializer
  private systems: CoreSystems;

  // Game state
  private isInitializing: boolean = true;  // Prevent renders during initialization


  // Screen instances - created via ScreenFactory
  private screens: GameScreens;

  // Action handler - centralizes all user action handling
  private actionHandler: ActionHandler;

  // Data manager - handles save/load/bindings/leaderboards
  private dataManager: DataManager;

  // UI builder - creates the main UI tree structure
  private uiBuilder: UIBuilder;

  // UI tree (created once, updated reactively)
  // Public so platform wrappers can access it (needed for Horizon's initializeUI)
  public uiTree: UINode | null = null;

  constructor(config: PlatformConfig) {
    this.platform = config;

    // Get platform-specific async methods
    this.asyncMethods = config.async;

    // Store platform-provided asset getters
    this.platformGetImageAsset = config.getImageAsset;

    // Get platform-specific UI methods and add bindingManager to them
    this.UI = config.getUIMethodMappings() as UIMethodMappings;

    // Initialize all core systems using CoreSystemsInitializer
    this.systems = CoreSystemsInitializer.initializeSystems(
      this.platform,
      this.UI,
      this.asyncMethods,
      (type, score) => this.submitLeaderboardScore(type, score),
      () => this.triggerRender()
    );

    // Initialize data manager (before actionHandler, as actionHandler uses its methods)
    this.dataManager = new DataManager({
      platform: this.platform,
      systems: this.systems,
      bindingManager: this.UI.bindingManager,
      validatePlayerData: this.validatePlayerData.bind(this),
    });

    // Initialize action handler (before screens, as screens use its methods)
    this.actionHandler = new ActionHandler({
      systems: this.systems,
      asyncMethods: this.asyncMethods,
      navigate: this.navigate.bind(this),
      saveGameData: this.dataManager.saveGameData.bind(this.dataManager),
      updateBindingsFromGameState: this.dataManager.updateBindingsFromGameState.bind(this.dataManager),
    });

    // Create all screens using ScreenFactory
    this.screens = ScreenFactory.createScreens({
      ui: this.UI,
      asyncMethods: this.asyncMethods,
      onButtonClick: this.actionHandler.handleButtonClick.bind(this.actionHandler),
      onCardSelect: this.actionHandler.handleCardSelect.bind(this.actionHandler),
      onMissionSelect: this.actionHandler.handleMissionSelect.bind(this.actionHandler),
      onSettingChange: this.actionHandler.handleSettingsChange.bind(this.actionHandler),
      onUpgrade: this.actionHandler.handleUpgrade.bind(this.actionHandler),
      onBattleAction: (action: string) => this.actionHandler.handleBattleAction(action, this.screens.battleScreen),
      onNavigate: this.navigate.bind(this),
      onShowCardDetail: this.actionHandler.showCardDetailPopup.bind(this.actionHandler),
      onRenderNeeded: () => this.systems.uiCoordinator.triggerRender(),
      playSfx: (sfxId: string) => this.systems.soundManager.playSfx(sfxId),
    });

    // Initialize UI builder (after screens are created)
    this.uiBuilder = new UIBuilder({
      ui: this.UI,
      screens: this.screens,
    });

    // All screens are now created, enable rendering
    this.isInitializing = false;

    // Create UI tree once (it's reactive via bindings)
    this.uiTree = this.uiBuilder.createUI();
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
    await this.dataManager.loadGameData();

    // Update bindings from loaded data
    await this.dataManager.updateBindingsFromGameState();

    // Trigger initial render
    this.triggerRender();

    // Start menu music
    this.systems.soundManager.playMusic(MUSIC_TRACKS.BACKGROUND, true);
    this.navigate('menu');
  }

  /**
   * Validate player data structure
   */
  private validatePlayerData(data: any): data is PlayerData {
    const result = ValidationHelpers.validatePlayerData(data);
    return result.valid;
  }

  /**
   * Navigate to a different screen
   */
  private navigate(screen: string): void {
    this.systems.uiCoordinator.navigate(screen, () => this.dataManager.loadLeaderboardData());
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
    this.platform.render(this.uiTree);
  }

  /**
   * Submit player score to leaderboard via network event
   * Delegates to DataManager
   */
  private submitLeaderboardScore(type: 'experience' | 'cluckNorris', score: number): void {
    this.dataManager.submitLeaderboardScore(type, score);
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.screens.menuScreen.dispose();
  }
}
