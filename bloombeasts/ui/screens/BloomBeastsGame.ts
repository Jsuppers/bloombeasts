/**
 * Unified BloomBeasts Game Component
 * Main game container that works on both Horizon and Web platforms
 */

import { View, Binding, UIComponent, isHorizon, getPlatform } from '../index';
import { UINodeType } from './ScreenUtils';
import { MenuScreen } from './MenuScreen';
import { CardsScreen } from './CardsScreen';
import { MissionScreen } from './MissionScreen';
import { BattleScreen } from './BattleScreen';
import { SettingsScreen } from './SettingsScreen';

import type {
  CardDisplay,
  MissionDisplay,
  MenuStats
} from '../../../bloombeasts/gameManager';
import type { SoundSettings } from '../../../bloombeasts/systems/SoundManager';

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

export interface BloomBeastsGameProps {
  playerData?: any;
  gameManager?: any;
  onButtonClick?: (buttonId: string) => void;
  onCardSelect?: (cardId: string) => void;
  onMissionSelect?: (missionId: string) => void;
  onSettingsChange?: (settingId: string, value: any) => void;
  onBattleAction?: (action: string) => void;
  onRenderNeeded?: () => void;
}

/**
 * Main unified game component that orchestrates all screens
 * This replaces the separate UI implementations in both Horizon and Web
 */
export class BloomBeastsGame {
  // Core state
  private playerData: any;
  private currentScreen: any;

  // Screen state bindings
  private cardsBinding: any;
  private deckSizeBinding: any;
  private deckCardIdsBinding: any;
  private missionsBinding: any;
  private statsBinding: any;
  private settingsBinding: any;
  private battleStateBinding: any;
  private battleMessageBinding: any;

  // Screen instances
  private menuScreen: MenuScreen;
  private cardsScreen: CardsScreen;
  private missionScreen: MissionScreen;
  private battleScreen: BattleScreen;
  private settingsScreen: SettingsScreen;

  // Callbacks
  private onButtonClick?: (buttonId: string) => void;
  private onCardSelect?: (cardId: string) => void;
  private onMissionSelect?: (missionId: string) => void;
  private onSettingsChange?: (settingId: string, value: any) => void;
  private onBattleAction?: (action: string) => void;
  private onRenderNeeded?: () => void;

  // Platform-specific properties (for Horizon)
  panelWidth?: number = 1280;
  panelHeight?: number = 720;

  constructor(props: BloomBeastsGameProps = {}) {
    console.log('[BloomBeastsGame] constructor called, props.onRenderNeeded:', props.onRenderNeeded ? 'defined' : 'undefined');

    // Initialize player data
    this.playerData = props.playerData || new Binding(null);

    // Initialize screen bindings
    this.currentScreen = new Binding('menu');
    this.cardsBinding = new Binding([]);
    this.deckSizeBinding = new Binding(0);
    this.deckCardIdsBinding = new Binding([]);
    this.missionsBinding = new Binding([]);
    this.statsBinding = new Binding(null);
    this.settingsBinding = new Binding({
      musicVolume: 50,
      sfxVolume: 50,
      musicEnabled: true,
      sfxEnabled: true
    });
    this.battleStateBinding = new Binding('initializing');
    this.battleMessageBinding = new Binding('Preparing for battle...');

    // Set callbacks
    this.onButtonClick = props.onButtonClick;
    this.onCardSelect = props.onCardSelect;
    this.onMissionSelect = props.onMissionSelect;
    this.onSettingsChange = props.onSettingsChange;
    this.onBattleAction = props.onBattleAction;
    this.onRenderNeeded = props.onRenderNeeded;

    console.log('[BloomBeastsGame] After setting callbacks, this.onRenderNeeded:', this.onRenderNeeded ? 'defined' : 'undefined');

    // Subscribe to player data changes
    this.playerData.subscribe(() => {
      const data = this.playerData.get ? this.playerData.get() : this.playerData.value;
      console.log('[BloomBeastsGame] Player data changed:', data);
      if (data) {
        this.updateFromPlayerData(data);
      }
    });

    // Create screen instances
    this.menuScreen = new MenuScreen({
      stats: this.statsBinding,
      onButtonClick: this.handleButtonClick.bind(this),
      onNavigate: this.navigate.bind(this)
    });

    this.cardsScreen = new CardsScreen({
      cards: this.cardsBinding,
      deckSize: this.deckSizeBinding,
      deckCardIds: this.deckCardIdsBinding,
      stats: this.statsBinding,
      onCardSelect: this.handleCardSelect.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.onRenderNeeded
    });

    this.missionScreen = new MissionScreen({
      missions: this.missionsBinding,
      stats: this.statsBinding,
      onMissionSelect: this.handleMissionSelect.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.onRenderNeeded
    });

    this.battleScreen = new BattleScreen({
      battleState: this.battleStateBinding,
      message: this.battleMessageBinding,
      onAction: this.handleBattleAction.bind(this),
      onNavigate: this.navigate.bind(this)
    });

    this.settingsScreen = new SettingsScreen({
      settings: this.settingsBinding,
      stats: this.statsBinding,
      onSettingChange: this.handleSettingsChange.bind(this),
      onNavigate: this.navigate.bind(this),
      onRenderNeeded: this.onRenderNeeded
    });

    console.log('[BloomBeastsGame] Created screens with onRenderNeeded:', this.onRenderNeeded ? 'defined' : 'undefined');
  }

  /**
   * Update bindings from player data
   */
  private updateFromPlayerData(data: PlayerData): void {
    console.log('[BloomBeastsGame] updateFromPlayerData called with:', data);

    // Update screen
    if (data.currentScreen) {
      console.log('[BloomBeastsGame] Setting screen to:', data.currentScreen);
      this.currentScreen.set(data.currentScreen);
    }

    // Update cards
    if (data.cards) {
      this.cardsBinding.set(data.cards.collected || []);
      this.deckCardIdsBinding.set(data.cards.deck || []);
      this.deckSizeBinding.set(data.cards.deck?.length || 0);
    }

    // Update missions
    if (data.missions) {
      this.missionsBinding.set(data.missions);
    }

    // Update stats
    if (data.stats) {
      console.log('[BloomBeastsGame] Setting stats to:', data.stats);
      this.statsBinding.set(data.stats);
    }

    // Update settings
    if (data.settings) {
      this.settingsBinding.set(data.settings);
    }

    // Update battle state
    if (data.battleState) {
      this.battleStateBinding.set(data.battleState.state);
      this.battleMessageBinding.set(data.battleState.message);
    }
  }

  /**
   * Navigate to a screen
   */
  private navigate(screen: string): void {
    this.currentScreen.set(screen);

    // Update player data
    const data = this.playerData.value;
    if (data) {
      data.currentScreen = screen;
      this.playerData.set(data);
    }
  }

  /**
   * Handle button clicks
   */
  private handleButtonClick(buttonId: string): void {
    // Handle navigation buttons
    switch (buttonId) {
      case 'play':
        this.navigate('battle');
        break;
      case 'cards':
        this.navigate('cards');
        break;
      case 'missions':
        this.navigate('missions');
        break;
      case 'settings':
        this.navigate('settings');
        break;
      case 'shop':
        // Shop not implemented yet
        console.log('Shop coming soon!');
        break;
    }

    // Pass to external handler
    this.onButtonClick?.(buttonId);
  }

  /**
   * Handle card selection
   */
  private handleCardSelect(cardId: string): void {
    this.onCardSelect?.(cardId);
  }

  /**
   * Handle mission selection
   */
  private handleMissionSelect(missionId: string): void {
    this.onMissionSelect?.(missionId);
  }

  /**
   * Handle settings change
   */
  private handleSettingsChange(settingId: string, value: any): void {
    if (settingId === 'reset') {
      // Reset all settings
      this.settingsBinding.set(value);
    } else {
      // Update individual setting
      const settings = { ...this.settingsBinding.value };
      (settings as any)[settingId] = value;
      this.settingsBinding.set(settings);
    }

    this.onSettingsChange?.(settingId, value);
  }

  /**
   * Handle battle action
   */
  private handleBattleAction(action: string): void {
    this.onBattleAction?.(action);
  }

  /**
   * Create the main UI
   * This is the main method that returns the UI tree
   */
  createUI(): UINodeType {
    // Create a derived binding for the current screen UI
    const screenUI = this.currentScreen.derive((screen) => {
      switch (screen) {
        case 'menu':
          return this.menuScreen.createUI();
        case 'cards':
          return this.cardsScreen.createUI();
        case 'missions':
          return this.missionScreen.createUI();
        case 'battle':
          return this.battleScreen.createUI();
        case 'settings':
          return this.settingsScreen.createUI();
        default:
          return this.menuScreen.createUI();
      }
    });

    // Return the main container with dynamic screen content
    return View({
      style: {
        width: 1280,
        height: 720
      },
      children: screenUI
    });
  }

  /**
   * Initialize UI (for Horizon platform)
   * This method is called by Horizon's UIComponent
   */
  initializeUI(): UINodeType {
    return this.createUI();
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.menuScreen.dispose();
  }
}

/**
 * Helper to create component for Horizon platform
 * Wraps BloomBeastsGame in UIComponent for Horizon compatibility
 */
export function createHorizonComponent(): any {
  if (isHorizon()) {
    // For Horizon, extend UIComponent
    class BloomBeastsUIComponent extends (UIComponent as any) {
      panelWidth = 1280;
      panelHeight = 720;

      private game: BloomBeastsGame;
      private playerData = new Binding(null);

      // Define props for Horizon assets
      static propsDefinition = {};

      constructor() {
        super();
        this.game = new BloomBeastsGame({
          playerData: this.playerData
        });
      }

      initializeUI(): UINodeType {
        return this.game.createUI();
      }

      setPlayerData(data: PlayerData): void {
        this.playerData.set(data);
      }
    }

    return BloomBeastsUIComponent;
  }

  // For Web, return the game class directly
  return BloomBeastsGame;
}