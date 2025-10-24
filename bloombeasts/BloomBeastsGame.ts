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
import { GameEngine } from './engine/systems/GameEngine';
import { SoundManager, SoundSettings } from './systems/SoundManager';
import { CardCollectionManager } from './systems/CardCollectionManager';
import { BattleDisplayManager, type BattleDisplay } from './systems/BattleDisplayManager';
import { SaveLoadManager } from './systems/SaveLoadManager';
import { MissionManager } from './screens/missions/MissionManager';
import { MissionSelectionUI } from './screens/missions/MissionSelectionUI';
import { MissionBattleUI } from './screens/missions/MissionBattleUI';
import { CardCollection } from './screens/cards/CardCollection';
import { CardInstance } from './screens/cards/types';
import { getAllCards } from './engine/cards';
import { DECK_SIZE } from './engine/constants/gameRules';
import { Logger } from './engine/utils/Logger';
import { type ImageAssetMap, type SoundAssetMap, normalizeSoundId } from './AssetCatalog';
import type { MenuStats } from './gameManager';

/**
 * UI Node type - platform-agnostic UI tree structure
 */
export type UINode = any;

/**
 * Binding interface - platform-agnostic reactive data binding
 * Each platform provides its own implementation
 */
export interface BindingInterface<T> {
  get(): T;
  set(value: T): void;
  subscribe(callback: () => void): void;
  derive?<U>(fn: (value: T) => U): BindingInterface<U>;
}

/**
 * Binding constructor type
 */
export type BindingConstructor = {
  new <T>(value: T): BindingInterface<T>;
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
  source: any; // Platform-specific: string for web, ImageSource for Horizon
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
 */
export interface UIMethodMappings {
  View: (props: any) => UINode;
  Text: (props: any) => UINode;
  Image: (props: any) => UINode;
  Pressable: (props: any) => UINode;
  Binding: any; // Platform-specific binding implementation
}

/**
 * Player data structure that flows through the game
 */
export interface PlayerData {
  currentScreen: string;
  cards: {
    collected: CardDisplay[];
    deck: string[];
  };
  missions: MissionDisplay[];
  stats: MenuStats;
  settings: SoundSettings;
  battleState?: {
    state: string;
    message: string;
  };
}

/**
 * Card display data for UI
 */
export interface CardDisplay {
  id: string;
  name: string;
  type: string;
  affinity?: string;
  cost?: number;
  level: number;
  experience: number;
  experienceRequired?: number;
  count: number;
  baseAttack?: number;
  currentAttack?: number;
  baseHealth?: number;
  currentHealth?: number;
  abilities?: any[];
  effects?: any[];
  ongoingEffects?: any[];
  onPlayEffects?: any[];
  activation?: any;
  description?: string;
  counters?: Array<{ type: string; amount: number }>;
  titleColor?: string;
}

/**
 * Mission display data for UI
 */
export interface MissionDisplay {
  id: string;
  name: string;
  level: number;
  difficulty: string;
  isAvailable: boolean;
  isCompleted: boolean;
  description: string;
  affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky' | 'Boss';
  beastId?: string;
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
   * Complete mapping of all image assets
   * TypeScript ensures all assets from ImageAssetIds are provided
   *
   * For web: Map asset IDs to file paths
   * For horizon: Map asset IDs to ImageSource objects
   */
  imageAssets: ImageAssetMap;

  /**
   * Complete mapping of all sound assets
   * TypeScript ensures all assets from SoundAssetIds are provided
   *
   * For web: Map asset IDs to file paths
   * For horizon: Map asset IDs to hz.Asset objects
   */
  soundAssets: SoundAssetMap;

  /**
   * Get platform-specific UI method implementations
   *
   * For web: Returns web-specific View, Text, Image, Pressable, Binding
   * For horizon: Returns hz.View, hz.Text, hz.Image, hz.Pressable, hz.Binding
   */
  getUIMethodMappings: () => UIMethodMappings;

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
  playMusic?: (src: any, loop: boolean, volume: number) => void;
  playSfx?: (src: any, volume: number) => void;
  stopMusic?: () => void;
  setMusicVolume?: (volume: number) => void;
  setSfxVolume?: (volume: number) => void;
}

/**
 * Main game class - handles all game logic and UI orchestration
 */
export class BloomBeastsGame {
  // Platform configuration
  private platform: PlatformConfig;

  // Platform-specific UI methods
  private UI: UIMethodMappings;

  // Platform-provided asset maps
  private imageAssets: ImageAssetMap;
  private soundAssets: SoundAssetMap;

  // Core game systems
  private gameEngine: GameEngine;
  private soundManager: SoundManager;
  private missionManager: MissionManager;
  private missionUI: MissionSelectionUI;
  private battleUI: MissionBattleUI;
  private cardCollection: CardCollection;
  private cardCollectionManager: CardCollectionManager;
  private battleDisplayManager: BattleDisplayManager;
  private saveLoadManager: SaveLoadManager;

  // Game state
  private currentScreen: string = 'menu';
  private playerDeck: string[] = []; // Array of card IDs in player's deck
  private currentBattleId: string | null = null;
  private selectedBeastIndex: number | null = null;
  private currentCardDetailId: string | null = null;
  private currentCardPopup: { card: any; player: 'player' | 'opponent'; showCloseButton?: boolean } | null = null;
  private showForfeitPopup: boolean = false;

  // UI State bindings
  private playerData: BindingInterface<PlayerData | null>;
  private currentScreenBinding: BindingInterface<string>;
  private cardsBinding: BindingInterface<CardDisplay[]>;
  private deckSizeBinding: BindingInterface<number>;
  private deckCardIdsBinding: BindingInterface<string[]>;
  private missionsBinding: BindingInterface<MissionDisplay[]>;
  private statsBinding: BindingInterface<MenuStats>;
  private settingsBinding: BindingInterface<SoundSettings>;
  private battleStateBinding: BindingInterface<string>;
  private battleMessageBinding: BindingInterface<string>;
  private battleDisplayBinding: BindingInterface<BattleDisplay | null>;
  private missionCompletePopupBinding: BindingInterface<any>;
  private forfeitPopupBinding: BindingInterface<any>;

  // Screen instances
  private menuScreen: MenuScreen;
  private cardsScreen: CardsScreen;
  private missionScreen: MissionScreen;
  private battleScreen: BattleScreen;
  private settingsScreen: SettingsScreen;

  // UI tree (created once, updated reactively)
  private uiTree: UINode | null = null;

  constructor(config: PlatformConfig) {
    this.platform = config;

    // Get platform-specific UI methods
    this.UI = config.getUIMethodMappings();

    // Store platform-provided asset maps
    this.imageAssets = config.imageAssets;
    this.soundAssets = config.soundAssets;

    // Initialize core systems
    this.gameEngine = new GameEngine();
    this.missionManager = new MissionManager();
    this.missionUI = new MissionSelectionUI(this.missionManager);
    this.battleUI = new MissionBattleUI(this.missionManager, this.gameEngine);

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
          console.log('[BloomBeastsGame] renderCallback: Updating battleDisplayBinding with turnPlayer:', updatedDisplay.turnPlayer);
          this.battleDisplayBinding.set(updatedDisplay);
          this.triggerRender();
        }
      }
    };

    this.cardCollection = new CardCollection();
    this.cardCollectionManager = new CardCollectionManager();
    this.battleDisplayManager = new BattleDisplayManager();

    // Initialize save/load manager with platform storage callbacks
    this.saveLoadManager = new SaveLoadManager({
      saveData: async (key: string, data: any) => {
        // For now, we're just using the platform's setPlayerData directly
        // SaveLoadManager saves to 'playerData' key
        if (key === 'playerData') {
          // Note: This will need mapping from SaveLoadManager's PlayerData to our PlayerData format
          // For now we just save it as-is
        }
      },
      loadData: async (key: string) => {
        // SaveLoadManager loads from 'playerData' key
        if (key === 'playerData') {
          // Return null for now - will load properly in initialize()
          return null;
        }
        return null;
      }
    });

    // Initialize sound manager
    this.soundManager = new SoundManager({
      playMusic: (src, loop, volume) => {
        const resolvedAsset = this.getSoundAsset(src);
        if (resolvedAsset) {
          this.platform.playMusic?.(resolvedAsset, loop, volume);
        }
      },
      stopMusic: () => this.platform.stopMusic?.(),
      playSfx: (src, volume) => {
        const resolvedAsset = this.getSoundAsset(src);
        if (resolvedAsset) {
          this.platform.playSfx?.(resolvedAsset, volume);
        }
      },
      setMusicVolume: (volume) => this.platform.setMusicVolume?.(volume),
      setSfxVolume: (volume) => this.platform.setSfxVolume?.(volume),
    });

    // Initialize bindings using platform's Binding class
    const BindingClass = this.UI.Binding as any;
    this.playerData = new BindingClass(null);
    this.currentScreenBinding = new BindingClass('menu');
    this.cardsBinding = new BindingClass([]);
    this.deckSizeBinding = new BindingClass(0);
    this.deckCardIdsBinding = new BindingClass([]);
    this.missionsBinding = new BindingClass([]);
    this.statsBinding = new BindingClass({
      playerLevel: 1,
      totalXP: 0,
      tokens: 100,
      diamonds: 10,
      serums: 5
    });
    this.settingsBinding = new BindingClass({
      musicEnabled: true,
      musicVolume: 80,
      sfxEnabled: true,
      sfxVolume: 80
    });
    this.battleStateBinding = new BindingClass('initializing');
    this.battleMessageBinding = new BindingClass('Preparing for battle...');
    this.battleDisplayBinding = new BindingClass<BattleDisplay | null>(null);
    this.missionCompletePopupBinding = new BindingClass<any>(null);
    this.forfeitPopupBinding = new BindingClass<any>(null);

    // No need to subscribe to playerData - we manage state via updateBindingsFromGameState()

    // Create screen instances
    this.menuScreen = new MenuScreen({
      stats: this.statsBinding,
      onButtonClick: this.handleButtonClick.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    this.cardsScreen = new CardsScreen({
      cards: this.cardsBinding,
      deckSize: this.deckSizeBinding,
      deckCardIds: this.deckCardIdsBinding,
      stats: this.statsBinding,
      onCardSelect: this.handleCardSelect.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    this.missionScreen = new MissionScreen({
      missions: this.missionsBinding,
      stats: this.statsBinding,
      onMissionSelect: this.handleMissionSelect.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    this.battleScreen = new BattleScreen({
      battleDisplay: this.battleDisplayBinding,
      message: this.battleMessageBinding,
      onAction: this.handleBattleAction.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    this.settingsScreen = new SettingsScreen({
      settings: this.settingsBinding,
      stats: this.statsBinding,
      onSettingChange: this.handleSettingsChange.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.triggerRender.bind(this)
    });

    // Create UI tree once (it's reactive via bindings)
    this.uiTree = this.createUI();
  }

  /**
   * Get an image asset by ID
   */
  getImageAsset(assetId: string): any {
    return this.imageAssets[assetId as keyof ImageAssetMap];
  }

  /**
   * Get a sound asset by ID
   * Supports both new catalog IDs and legacy string IDs
   */
  getSoundAsset(assetId: string): any {
    // Normalize legacy IDs to new catalog IDs
    const normalizedId = normalizeSoundId(assetId);
    const asset = this.soundAssets[normalizedId as keyof SoundAssetMap];

    if (!asset) {
      console.warn(`⚠️  Sound asset not found for ID: "${assetId}"`);
    }

    return asset;
  }

  /**
   * Initialize the game
   * Call this after construction to load data and show initial screen
   */
  async initialize(): Promise<void> {
    Logger.info('[BloomBeastsGame] Initializing...');

    // Load saved game data
    await this.loadGameData();

    // Initialize starting cards if first time
    if (this.cardCollection.getAllCards().length === 0) {
      await this.initializeStartingCollection();
    }

    // Update bindings from loaded data
    await this.updateBindingsFromGameState();

    // Trigger initial render
    this.triggerRender();

    // Start menu music
    this.soundManager.playMusic('BackgroundMusic.mp3', true);

    Logger.info('[BloomBeastsGame] Initialization complete!');
  }

  /**
   * Load game data from platform storage
   */
  private async loadGameData(): Promise<void> {
    this.playerDeck = await this.saveLoadManager.loadGameData(
      this.cardCollection,
      this.missionManager
    );
  }

  /**
   * Save game data to platform storage
   */
  private async saveGameData(): Promise<void> {
    await this.saveLoadManager.saveGameData(this.cardCollection, this.playerDeck);
  }

  /**
   * Initialize a new game with starter cards
   */
  private async initializeStartingCollection(): Promise<void> {
    this.playerDeck = await this.cardCollectionManager.initializeStartingCollection(
      this.cardCollection,
      this.playerDeck
    );
    await this.saveGameData();
  }

  /**
   * Update bindings from current game state
   * This syncs the UI bindings with the actual game state
   */
  private async updateBindingsFromGameState(): Promise<void> {
    // Get all cards and convert to display format
    const cards = this.cardCollection.getAllCards();
    const displayCards = cards.map(card => this.cardInstanceToDisplay(card));

    // Get available missions
    this.missionUI.setPlayerLevel(this.saveLoadManager.getPlayerData().level);
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

    // Get player data from SaveLoadManager
    const playerData = this.saveLoadManager.getPlayerData();

    // Get stats
    const stats: MenuStats = {
      playerLevel: playerData.level,
      totalXP: playerData.totalXP,
      tokens: this.getItemQuantity('token'),
      diamonds: this.getItemQuantity('diamond'),
      serums: this.getItemQuantity('serum'),
    };

    // Update all bindings
    this.cardsBinding.set(displayCards);
    this.deckCardIdsBinding.set(this.playerDeck);
    this.deckSizeBinding.set(this.playerDeck.length);
    this.missionsBinding.set(displayMissions);
    this.statsBinding.set(stats);
    this.settingsBinding.set(this.soundManager.getSettings());
  }

  /**
   * Get quantity of a specific item
   */
  private getItemQuantity(itemId: string): number {
    return this.saveLoadManager.getItemQuantity(itemId);
  }

  /**
   * Convert CardInstance to CardDisplay for UI
   */
  private cardInstanceToDisplay(card: CardInstance): CardDisplay {
    return this.cardCollectionManager.cardInstanceToDisplay(card);
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
   * Recreates the UI tree to ensure all values are up-to-date
   */
  private triggerRender(): void {
    // Recreate the UI tree to get fresh values from bindings
    this.uiTree = this.createUI();
    this.platform.render(this.uiTree);
  }

  /**
   * Handle button clicks
   */
  private async handleButtonClick(buttonId: string): Promise<void> {
    console.log('[BloomBeastsGame] Button clicked:', buttonId);

    // Play button sound
    this.soundManager.playSfx('menuButtonSelect');

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
        console.log('Shop coming soon!');
        break;
      case 'btn-back':
        this.navigate('menu');
        break;
      case 'forfeit':
        // Show forfeit confirmation popup
        this.showForfeitConfirmation();
        break;
      default:
        console.log('Unhandled button:', buttonId);
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
    this.soundManager.playSfx('sfx/lose.wav');

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
    console.log('[BloomBeastsGame] Card selected:', cardId);

    // Play menu button sound
    this.soundManager.playSfx('sfx/menuButtonSelect.wav');

    const cardEntry = this.cardCollection.getCard(cardId);

    if (!cardEntry) {
      return;
    }

    // Check if card is in deck
    const isInDeck = this.playerDeck.includes(cardId);

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
    if (this.playerDeck.length >= DECK_SIZE) {
      Logger.warn(`Deck is full (${DECK_SIZE} cards)`);
      return;
    }

    if (!this.playerDeck.includes(cardId)) {
      this.playerDeck.push(cardId);
      await this.saveGameData();
      await this.updateBindingsFromGameState();
    }
  }

  /**
   * Remove card from player's deck
   */
  private async removeCardFromDeck(cardId: string): Promise<void> {
    const index = this.playerDeck.indexOf(cardId);
    if (index > -1) {
      this.playerDeck.splice(index, 1);
      await this.saveGameData();
      await this.updateBindingsFromGameState();
    }
  }

  /**
   * Handle mission selection
   */
  private async handleMissionSelect(missionId: string): Promise<void> {
    Logger.info(`Mission selected: ${missionId}`);

    // Reset battle state
    this.selectedBeastIndex = null;

    // Play menu button sound
    this.soundManager.playSfx('sfx/menuButtonSelect.wav');

    // Check if player has cards in deck
    if (this.playerDeck.length === 0) {
      Logger.warn('No cards in deck');
      // TODO: Show dialog or message to user
      return;
    }

    // Get player's deck cards
    const playerDeckCards = this.cardCollectionManager.getPlayerDeckCards(
      this.playerDeck,
      this.cardCollection
    );

    if (playerDeckCards.length === 0) {
      Logger.error('Failed to load deck cards');
      return;
    }

    // Start the mission
    const success = this.missionUI.startMission(missionId);

    if (success) {
      console.log('[BloomBeastsGame] Mission started successfully');
      // Initialize battle with player's deck cards
      const battleState = this.battleUI.initializeBattle(playerDeckCards);
      console.log('[BloomBeastsGame] battleState:', battleState);

      if (battleState) {
        console.log('[BloomBeastsGame] Battle state is valid, initializing...');
        this.currentScreen = 'battle';
        this.currentBattleId = missionId;

        // Create battle display from battle state
        const battleDisplay = this.battleDisplayManager.createBattleDisplay(
          battleState,
          null, // No selected beast initially
          null  // No attack animation
        );
        console.log('[BloomBeastsGame] battleDisplay:', battleDisplay);

        // Update battle display binding
        if (battleDisplay) {
          console.log('[BloomBeastsGame] ==========================================');
          console.log('[BloomBeastsGame] BEFORE set() - battleDisplayBinding.get():', this.battleDisplayBinding.get());
          console.log('[BloomBeastsGame] Setting battle display binding with data:', {
            turnPlayer: battleDisplay.turnPlayer,
            currentTurn: battleDisplay.currentTurn,
            playerHealth: battleDisplay.playerHealth,
            keys: Object.keys(battleDisplay)
          });
          console.log('[BloomBeastsGame] Calling battleDisplayBinding.set()...');
          this.battleDisplayBinding.set(battleDisplay);
          console.log('[BloomBeastsGame] AFTER set() - battleDisplayBinding.get():', this.battleDisplayBinding.get());
          console.log('[BloomBeastsGame] ==========================================');
        } else {
          console.error('[BloomBeastsGame] battleDisplay is null!');
        }

        // Navigate to battle screen
        console.log('[BloomBeastsGame] Navigating to battle screen');
        this.currentScreenBinding.set('battle');

        // Trigger re-render to show battle screen
        console.log('[BloomBeastsGame] Triggering re-render');
        this.triggerRender();

        // Play battle music
        this.soundManager.playMusic('BattleMusic.mp3', true);

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

    // Play button sound for toggles (not sliders)
    if (settingId === 'musicEnabled' || settingId === 'sfxEnabled') {
      this.soundManager.playSfx('sfx/menuButtonSelect.wav');
    }

    // Apply settings via sound manager
    switch (settingId) {
      case 'musicVolume':
        this.soundManager.setMusicVolume(value);
        break;
      case 'sfxVolume':
        this.soundManager.setSfxVolume(value);
        break;
      case 'musicEnabled':
        this.soundManager.toggleMusic(value);
        break;
      case 'sfxEnabled':
        this.soundManager.toggleSfx(value);
        break;
    }

    // Save settings
    this.saveGameData();

    // Update binding
    this.settingsBinding.set(this.soundManager.getSettings());
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
      this.soundManager.playSfx('sfx/attack.wav');
      // Animation already shown above
      this.selectedBeastIndex = null; // Clear selection after attacking
    } else if (action.startsWith('attack-player-')) {
      this.soundManager.playSfx('sfx/attack.wav');
      // Extract attacker index and show animation for direct health attack
      const attackerIndex = parseInt(action.substring('attack-player-'.length), 10);
      await this.showAttackAnimation('player', attackerIndex, 'health', undefined);
      this.selectedBeastIndex = null; // Clear selection after attacking
    } else if (action.startsWith('play-card-')) {
      this.soundManager.playSfx('sfx/playCard.wav');
    } else if (action.startsWith('activate-trap-')) {
      this.soundManager.playSfx('sfx/trapCardActivated.wav');
    } else if (action === 'end-turn') {
      this.soundManager.playSfx('sfx/menuButtonSelect.wav');
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
        console.log('[BloomBeastsGame] Updating battle display with health:', {
          playerHealth: updatedDisplay.playerHealth,
          opponentHealth: updatedDisplay.opponentHealth
        });
        this.battleDisplayBinding.set(updatedDisplay);
        this.triggerRender();
      }
    }
  }

  /**
   * Handle battle completion (victory or defeat)
   */
  private async handleBattleComplete(battleState: any): Promise<void> {
    console.log('[BloomBeastsGame] Handling battle completion...');

    // Stop all timers immediately
    if (this.battleScreen) {
      this.battleScreen.cleanup();
    }

    // Keep battle visible in background while popup shows
    // Battle display will be cleared when user clicks Continue
    const battleId = this.currentBattleId; // Save before clearing
    this.currentBattleId = null;

    console.log('[BloomBeastsGame] Battle complete, checking rewards:', {
      hasRewards: !!battleState.rewards,
      rewards: battleState.rewards
    });

    if (battleState.rewards) {
      // Victory!
      console.log('[BloomBeastsGame] Mission victory!', battleState.rewards);

      // Award XP
      this.saveLoadManager.addXP(battleState.rewards.xpGained);

      // Award card XP
      const cardXP = battleState.rewards.beastXP || battleState.rewards.xpGained;
      this.cardCollectionManager.awardDeckExperience(
        cardXP,
        this.playerDeck,
        this.cardCollection
      );

      // Add cards to collection
      battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
        this.cardCollectionManager.addCardReward(card, this.cardCollection, index);
      });

      // Add items to inventory
      if (battleState.rewards.itemsReceived) {
        battleState.rewards.itemsReceived.forEach((itemReward: any) => {
          this.saveLoadManager.addItems(itemReward.itemId, itemReward.quantity);
        });
      }

      // Track mission completion
      if (battleId) {
        this.saveLoadManager.trackMissionCompletion(battleId);
      }

      // Play win sound
      this.soundManager.playSfx('sfx/win.wav');

      // Save game data
      await this.saveGameData();

      // Show mission complete popup
      console.log('[BloomBeastsGame] Setting victory popup...');
      this.missionCompletePopupBinding.set({
        mission: battleState.mission,
        rewards: battleState.rewards,
        chestOpened: false,
        onClaimRewards: () => {
          console.log('[BloomBeastsGame] Claim rewards clicked');
          // Chest animation could go here
          const current = this.missionCompletePopupBinding.get();
          if (current) {
            this.missionCompletePopupBinding.set({
              ...current,
              chestOpened: true
            });
            console.log('[BloomBeastsGame] Chest opened, triggering render');
            this.triggerRender();
          }
        },
        onContinue: () => {
          console.log('[BloomBeastsGame] Victory continue clicked');
          // Clear battle display and close popup
          this.battleDisplayBinding.set(null);
          this.missionCompletePopupBinding.set(null);
          this.navigate('missions');
        }
      });
      console.log('[BloomBeastsGame] Victory popup set, binding value:', this.missionCompletePopupBinding.get());
      this.triggerRender();
      console.log('[BloomBeastsGame] Render triggered after victory popup');
    } else {
      // Defeat
      console.log('[BloomBeastsGame] Mission failed!');

      // Play lose sound
      this.soundManager.playSfx('sfx/lose.wav');

      // Show mission failed popup
      const failedPopupProps = {
        mission: battleState.mission,
        rewards: null, // null indicates failure
        chestOpened: false,
        onContinue: () => {
          // Clear battle display and close popup
          this.battleDisplayBinding.set(null);
          this.missionCompletePopupBinding.set(null);
          this.navigate('missions');
        }
      };
      console.log('[BloomBeastsGame] Setting mission failed popup:', failedPopupProps);
      this.missionCompletePopupBinding.set(failedPopupProps);
      console.log('[BloomBeastsGame] After set, binding value:', this.missionCompletePopupBinding.get());
      this.triggerRender();
      console.log('[BloomBeastsGame] Render triggered after mission failed');
    }

    // Resume background music
    this.soundManager.playMusic('BackgroundMusic.mp3', true);

    // Note: Navigation happens when user clicks Continue in the popup
  }

  /**
   * Create the main UI tree
   * This is created once and updated reactively via bindings
   */
  private createUI(): UINode {
    const { View } = this.UI;

    // Create a derived binding for the current screen UI
    const screenUI = this.currentScreenBinding.derive((screen) => {
      console.log('[BloomBeastsGame] Screen changed to:', screen);
      switch (screen) {
        case 'menu':
          return this.menuScreen.createUI();
        case 'cards':
          return this.cardsScreen.createUI();
        case 'missions':
          return this.missionScreen.createUI();
        case 'battle':
          console.log('[BloomBeastsGame] Calling battleScreen.createUI(), battleScreen instance:', this.battleScreen);
          console.log('[BloomBeastsGame] battleDisplayBinding current value:', this.battleDisplayBinding.get());
          return this.battleScreen.createUI();
        case 'settings':
          return this.settingsScreen.createUI();
        default:
          return this.menuScreen.createUI();
      }
    });

    // Create mission complete popup overlay (conditionally rendered when binding has value)
    const missionCompleteOverlay = this.missionCompletePopupBinding.derive((popupProps) => {
      if (!popupProps) return null;
      return createMissionCompletePopup(popupProps);
    });

    // Create forfeit popup overlay (conditionally rendered when binding has value)
    const forfeitOverlay = this.forfeitPopupBinding.derive((popupProps) => {
      if (!popupProps) return null;
      return createButtonPopup(popupProps);
    });

    // Return the main container with dynamic screen content and popup overlays
    return View({
      style: {
        width: 1280,
        height: 720
      },
      children: [
        screenUI,
        missionCompleteOverlay,
        forfeitOverlay
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
    await new Promise(resolve => setTimeout(resolve, 500));

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
