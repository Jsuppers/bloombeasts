/**
 * GameManager - Main orchestrator for the Bloom Beasts game
 * Platform-independent game manager that uses callbacks for platform-specific functionality
 */

import { StartMenuUI } from './screens/startmenu/StartMenuUI';
import { MenuController } from './screens/startmenu/MenuController';
import { CardCollection } from './screens/cards/CardCollection';
import { CardsUI } from './screens/cards/CardsUI';
import { CardInstance } from './screens/cards/types';
import { MissionManager } from './screens/missions/MissionManager';
import { MissionSelectionUI } from './screens/missions/MissionSelectionUI';
import { MissionBattleUI } from './screens/missions/MissionBattleUI';
import { GameEngine } from './engine/systems/GameEngine';
import {
  buildFireDeck,
  buildWaterDeck,
  buildForestDeck,
  buildSkyDeck,
  DeckList
} from './engine/utils/deckBuilder';
import { AnyCard } from './engine/types/core';
import { Mission } from './screens/missions/types';
import { getAllCards } from './engine/cards';
import { SoundManager, SoundSettings } from './systems/SoundManager';
import { SaveLoadManager, PlayerData as SaveLoadPlayerData, PlayerItem as SaveLoadPlayerItem } from './systems/SaveLoadManager';
import { CardCollectionManager } from './systems/CardCollectionManager';
import { BattleDisplayManager } from './systems/BattleDisplayManager';
import { Logger } from './engine/utils/Logger';
import { DECK_SIZE, STARTING_HEALTH, TURN_TIME_LIMIT, FIELD_SIZE } from './engine/constants/gameRules';

export interface MenuStats {
  playerLevel: number;
  totalXP: number;
  tokens: number;
  diamonds: number;
  serums: number;
}

/**
 * Platform callbacks interface - implement these for your specific platform
 */
export interface PlatformCallbacks {
  // UI Rendering
  renderStartMenu(options: string[], stats: MenuStats): void;
  renderMissionSelect(missions: MissionDisplay[], stats: MenuStats): void;
  renderCards(cards: CardDisplay[], deckSize: number, deckCardIds: string[], stats: MenuStats): void;
  renderBattle(battleState: BattleDisplay): void;
  renderSettings(settings: SoundSettings, stats: MenuStats): void;
  renderCardDetail(cardDetail: CardDetailDisplay, stats: MenuStats): void;

  // Input handling
  onButtonClick(callback: (buttonId: string) => void): void;
  onCardSelect(callback: (cardId: string) => void): void;
  onMissionSelect(callback: (missionId: string) => void): void;
  onSettingsChange(callback: (settingId: string, value: any) => void): void;

  // Asset loading
  loadCardImage(cardId: string): Promise<any>;
  loadBackground(backgroundId: string): Promise<any>;
  playSound(soundId: string): void;

  // Audio control
  playMusic(src: string, loop: boolean, volume: number): void;
  stopMusic(): void;
  playSfx(src: string, volume: number): void;
  setMusicVolume(volume: number): void;
  setSfxVolume(volume: number): void;
  setCardsSfxCallback?(callback: (src: string) => void): void;

  // Storage
  saveData(key: string, data: any): Promise<void>;
  loadData(key: string): Promise<any>;

  // Dialogs
  showDialog(title: string, message: string, buttons?: string[]): Promise<string>;
  showRewards(rewards: RewardDisplay): Promise<void>;
}

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
  abilities?: any[]; // Array of all abilities for Bloom cards (used for description generation)
  effects?: any[]; // For Magic/Trap/Buff cards
  ongoingEffects?: any[]; // For Buff/Habitat cards
  onPlayEffects?: any[]; // For Habitat cards
  activation?: any; // For Trap cards
  description?: string; // Description for Magic/Trap/Habitat/Buff cards
  counters?: Array<{ type: string; amount: number }>; // Counters on the card
  titleColor?: string; // Custom title color (hex color)
}

export interface CardDetailDisplay {
  card: CardDisplay;
  buttons: string[];
  isInDeck: boolean;
}

export interface BattleDisplay {
  playerHealth: number;
  playerMaxHealth: number;
  playerDeckCount: number;
  playerNectar: number;
  playerHand: any[];
  playerTrapZone: any[]; // Player's trap cards (face-down)
  playerBuffZone: any[]; // Player's active buff cards
  opponentHealth: number;
  opponentMaxHealth: number;
  opponentDeckCount: number;
  opponentNectar: number;
  opponentField: any[];
  opponentTrapZone: any[]; // Opponent's trap cards (face-down)
  opponentBuffZone: any[]; // Opponent's active buff cards
  playerField: any[];
  currentTurn: number;
  turnPlayer: string;
  turnTimeRemaining: number;
  objectives: ObjectiveDisplay[];
  habitatZone: any | null; // Current habitat card
  selectedBeastIndex: number | null; // Track selected beast for attacking
  attackAnimation?: { // Attack animation state
    attackerPlayer: 'player' | 'opponent';
    attackerIndex: number;
    targetPlayer: 'player' | 'opponent' | 'health';
    targetIndex?: number; // undefined if targeting health
  } | null;
  cardPopup?: { // Card popup display (for magic/trap/buff cards)
    card: any;
    player: 'player' | 'opponent';
    showCloseButton?: boolean; // Show close button for manual popups
  } | null;
}

export interface ObjectiveDisplay {
  description: string;
  progress: number;
  target: number;
  isComplete: boolean;
}

export interface RewardDisplay {
  xp: number;
  cards: CardDisplay[];
  message: string;
}

export type GameScreen = 'start-menu' | 'missions' | 'cards' | 'battle' | 'deck-builder' | 'settings' | 'card-detail' | 'mission-complete';

/**
 * Main game manager class
 */
export class GameManager {
  // Core systems
  private startMenuUI: StartMenuUI;
  private menuController: MenuController;
  private cardCollection: CardCollection;
  private cardsUI: CardsUI;
  private missionManager: MissionManager;
  private missionUI: MissionSelectionUI;
  private battleUI: MissionBattleUI;
  private gameEngine: GameEngine;
  private soundManager: SoundManager;

  // Manager instances
  private saveLoadManager: SaveLoadManager;
  private cardCollectionManager: CardCollectionManager;
  private battleDisplayManager: BattleDisplayManager;

  // Platform callbacks
  private platform: PlatformCallbacks;

  // Game state
  private currentScreen: GameScreen = 'start-menu';
  private playerData: PlayerData;
  private selectedDeck: DeckList | null = null;
  private currentBattleId: string | null = null;
  private playerDeck: string[] = []; // Track player's custom deck (card IDs)
  private selectedBeastIndex: number | null = null; // Track selected beast in battle
  private currentCardDetailId: string | null = null; // Track current card being viewed in detail
  private currentCardPopup: { card: any; player: 'player' | 'opponent'; showCloseButton?: boolean } | null = null; // Track active card popup

  constructor(platformCallbacks: PlatformCallbacks) {
    this.platform = platformCallbacks;

    // Initialize systems
    this.startMenuUI = new StartMenuUI();
    this.menuController = new MenuController();
    this.cardCollection = new CardCollection();
    this.cardsUI = new CardsUI();
    this.missionManager = new MissionManager();
    this.missionUI = new MissionSelectionUI(this.missionManager);
    this.gameEngine = new GameEngine();
    this.battleUI = new MissionBattleUI(this.missionManager, this.gameEngine);

    // Initialize managers
    this.saveLoadManager = new SaveLoadManager(this.platform);
    this.cardCollectionManager = new CardCollectionManager();
    this.battleDisplayManager = new BattleDisplayManager();

    // Initialize sound manager
    this.soundManager = new SoundManager({
      playMusic: (src, loop, volume) => this.platform.playMusic(src, loop, volume),
      stopMusic: () => this.platform.stopMusic(),
      playSfx: (src, volume) => this.platform.playSfx(src, volume),
      setMusicVolume: (volume) => this.platform.setMusicVolume(volume),
      setSfxVolume: (volume) => this.platform.setSfxVolume(volume),
    });

    // Set up SFX callback for cards screen (if platform supports it)
    if (this.platform.setCardsSfxCallback) {
      this.platform.setCardsSfxCallback((src: string) => this.soundManager.playSfx(src));
    }

    // Initialize player data
    this.playerData = {
      name: 'Player',
      level: 1,
      totalXP: 0,
      cards: {
        collected: [],
        deck: []
      },
      missions: {
        completedMissions: {}  // Track completed missions
      },
      items: []  // Start with no items
    };

    // Setup input callbacks
    this.setupInputCallbacks();
  }

  /**
   * Initialize the game
   */
  async initialize(): Promise<void> {
    Logger.info('Initializing Bloom Beasts...');

    // Load saved data
    await this.loadGameData();

    // Initialize starting cards if first time
    if (this.playerData.cards.collected.length === 0) {
      await this.initializeStartingCollection();
    }

    // Show start menu
    await this.showStartMenu();
  }

  /**
   * Setup input callbacks from platform
   */
  private setupInputCallbacks(): void {
    // Button clicks
    this.platform.onButtonClick((buttonId: string) => {
      this.handleButtonClick(buttonId);
    });

    // Card selection
    this.platform.onCardSelect((cardId: string) => {
      this.handleCardSelect(cardId);
    });

    // Mission selection
    this.platform.onMissionSelect((missionId: string) => {
      this.handleMissionSelect(missionId);
    });

    // Settings changes
    this.platform.onSettingsChange((settingId: string, value: any) => {
      this.handleSettingsChange(settingId, value);
    });
  }

  /**
   * Handle button clicks
   */
  private async handleButtonClick(buttonId: string): Promise<void> {
    Logger.debug(`Button clicked: ${buttonId}`);

    // Determine if this button should play a sound
    const shouldPlaySound = this.shouldPlayButtonSound(buttonId);
    if (shouldPlaySound) {
      this.soundManager.playSfx('sfx/menuButtonSelect.wav');
    }

    switch (buttonId) {
      case 'btn-missions':
        await this.showMissionSelect();
        break;

      case 'btn-cards':
        await this.showCards();
        break;

      case 'btn-settings':
        await this.showSettings();
        break;

      case 'btn-back':
        await this.handleBackButton();
        break;

      case 'btn-start-battle':
        await this.startSelectedBattle();
        break;

      case 'btn-end-turn':
        await this.handleEndTurn();
        break;

      case 'btn-card-add':
        if (this.currentCardDetailId) {
          await this.addCardToDeck(this.currentCardDetailId);
        }
        break;

      case 'btn-card-remove':
        if (this.currentCardDetailId) {
          await this.removeCardFromDeck(this.currentCardDetailId);
        }
        break;

      case 'btn-card-close':
        // Close the card detail overlay based on current screen
        if (this.currentScreen === 'battle') {
          // Close card popup if one is open
          this.closeCardPopup();
        } else {
          // In cards screen, refresh to remove the overlay
          await this.showCards();
          this.currentCardDetailId = null;
        }
        break;

      default:
        // Handle counter info dialogs
        if (buttonId.startsWith('show-counter-info:')) {
          // Parse format: show-counter-info:title:message
          const parts = buttonId.substring('show-counter-info:'.length).split(':');
          if (parts.length >= 2) {
            const title = parts[0];
            const message = parts.slice(1).join(':'); // Rejoin in case message contains colons
            await this.platform.showDialog(title, message, ['OK']);
          }
        }
        // Handle deck selection buttons
        else if (buttonId.startsWith('deck-')) {
          this.selectDeck(buttonId.substring(5));
        }
        // Handle viewing hand cards in battle
        else if (buttonId.startsWith('view-hand-card-')) {
          const index = parseInt(buttonId.substring(15));
          await this.handleViewHandCard(index);
        }
        // Handle viewing field cards in battle
        else if (buttonId.startsWith('view-field-card-')) {
          const parts = buttonId.substring(16).split('-');
          const player = parts[0]; // 'player' or 'opponent'
          const index = parseInt(parts[1]);
          await this.handleViewFieldCard(player, index);
        }
        // Handle viewing trap cards in battle
        else if (buttonId.startsWith('view-trap-card-')) {
          const parts = buttonId.substring(15).split('-');
          const player = parts[0]; // 'player' or 'opponent'
          const index = parseInt(parts[1]);
          await this.handleViewTrapCard(player, index);
        }
        // Handle viewing habitat card in battle
        else if (buttonId === 'view-habitat-card') {
          await this.handleViewHabitatCard();
        }
        // Handle viewing buff cards in battle
        else if (buttonId.startsWith('view-buff-card-')) {
          const parts = buttonId.substring(15).split('-');
          const player = parts[0]; // 'player' or 'opponent'
          const index = parseInt(parts[1]);
          await this.handleViewBuffCard(player, index);
        }
        // Handle action buttons in battle
        else if (buttonId.startsWith('action-')) {
          await this.handleBattleAction(buttonId.substring(7));
        }
    }
  }

  /**
   * Determine if a button should play the menu button sound
   */
  private shouldPlayButtonSound(buttonId: string): boolean {
    // Don't play sound for battle card interactions
    if (buttonId.startsWith('view-hand-card-') ||
        buttonId.startsWith('view-field-card-') ||
        buttonId.startsWith('view-trap-card-') ||
        buttonId.startsWith('view-buff-card-') ||
        buttonId === 'view-habitat-card' ||
        buttonId.startsWith('action-')) {
      return false;
    }

    // Play sound for all other buttons (main menu, back, end turn, hand toggle, etc.)
    return true;
  }

  /**
   * Get the quantity of a specific item from player's items array
   */
  private getItemQuantity(itemId: string): number {
    return this.saveLoadManager.getItemQuantity(itemId);
  }

  /**
   * Calculate the current mission level based on completed missions
   * The current level is the highest completed mission level + 1
   * Returns 1 if no missions have been completed
   */
  private getCurrentMissionLevel(): number {
    let highestCompletedLevel = 0;

    // Check all completed missions to find the highest level
    for (const missionId in this.playerData.missions.completedMissions) {
      if (this.playerData.missions.completedMissions[missionId] > 0) {
        // Extract level from mission ID (e.g., "mission-05" -> 5)
        const match = missionId.match(/mission-(\d+)/);
        if (match) {
          const level = parseInt(match[1], 10);
          if (level > highestCompletedLevel) {
            highestCompletedLevel = level;
          }
        }
      }
    }

    // Current level is one higher than the highest completed
    return highestCompletedLevel + 1;
  }

  /**
   * Show the start menu
   */
  async showStartMenu(): Promise<void> {
    this.currentScreen = 'start-menu';

    const menuOptions = [
      'missions',
      'cards',
      'settings',
    ];

    const stats: MenuStats = {
      playerLevel: this.playerData.level,
      totalXP: this.playerData.totalXP,
      tokens: this.getItemQuantity('token'),
      diamonds: this.getItemQuantity('diamond'),
      serums: this.getItemQuantity('serum'),
    };

    this.platform.renderStartMenu(menuOptions, stats);
    // Start playing background music
    this.soundManager.playMusic('BackgroundMusic.mp3', true);
  }

  /**
   * Show mission selection screen
   */
  async showMissionSelect(): Promise<void> {
    this.currentScreen = 'missions';

    // Set player level for mission filtering
    this.missionUI.setPlayerLevel(this.playerData.level);

    // Get available missions
    const missionList = this.missionUI.getMissionList();

    // Convert to display format
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

    // Get stats for side menu
    const stats: MenuStats = {
      playerLevel: this.playerData.level,
      totalXP: this.playerData.totalXP,
      tokens: this.getItemQuantity('token'),
      diamonds: this.getItemQuantity('diamond'),
      serums: this.getItemQuantity('serum'),
    };

    this.platform.renderMissionSelect(displayMissions, stats);
    this.platform.loadBackground('mission-select-bg');
  }

  /**
   * Convert a CardInstance to CardDisplay format
   * This centralizes all the logic for enriching card instances with definition data
   */
  private cardInstanceToDisplay(card: CardInstance): CardDisplay {
    return this.cardCollectionManager.cardInstanceToDisplay(card);
  }

  /**
   * Show cards screen
   */
  async showCards(): Promise<void> {
    this.currentScreen = 'cards';

    // Get player's cards
    const cards = this.cardCollection.getAllCards();

    // Convert to display format using centralized helper
    const displayCards: CardDisplay[] = cards.map(card => this.cardInstanceToDisplay(card));

    // Get stats for side menu
    const stats: MenuStats = {
      playerLevel: this.playerData.level,
      totalXP: this.playerData.totalXP,
      tokens: this.getItemQuantity('token'),
      diamonds: this.getItemQuantity('diamond'),
      serums: this.getItemQuantity('serum'),
    };

    this.platform.renderCards(displayCards, this.playerDeck.length, this.playerDeck, stats);
    this.platform.loadBackground('cards-bg');
  }

  /**
   * Show deck builder screen
   */
  async showDeckBuilder(): Promise<void> {
    this.currentScreen = 'deck-builder';

    // Show available starter decks
    const deckOptions = [
      { id: 'fire', name: 'Fire Deck', description: 'Aggressive burn damage' },
      { id: 'water', name: 'Water Deck', description: 'Defensive and control' },
      { id: 'forest', name: 'Forest Deck', description: 'Growth and synergy' },
      { id: 'sky', name: 'Sky Deck', description: 'Speed and utility' },
    ];

    await this.platform.showDialog(
      'Select Your Deck',
      'Choose a starter deck for battle:',
      deckOptions.map(d => d.name)
    ).then(selection => {
      const deck = deckOptions.find(d => d.name === selection);
      if (deck) {
        this.selectDeck(deck.id);
      }
    });
  }

  /**
   * Show settings screen
   */
  async showSettings(): Promise<void> {
    this.currentScreen = 'settings';
    const settings = this.soundManager.getSettings();

    // Get stats for side menu
    const stats: MenuStats = {
      playerLevel: this.playerData.level,
      totalXP: this.playerData.totalXP,
      tokens: this.getItemQuantity('token'),
      diamonds: this.getItemQuantity('diamond'),
      serums: this.getItemQuantity('serum'),
    };

    this.platform.renderSettings(settings, stats);
  }

  /**
   * Handle settings changes
   */
  private handleSettingsChange(settingId: string, value: any): void {
    // Play menu button sound for settings toggles (but not for sliders)
    if (settingId === 'music-enabled' || settingId === 'sfx-enabled') {
      this.soundManager.playSfx('sfx/menuButtonSelect.wav');
    }

    switch (settingId) {
      case 'music-volume':
        this.soundManager.setMusicVolume(value);
        break;
      case 'sfx-volume':
        this.soundManager.setSfxVolume(value);
        break;
      case 'music-enabled':
        this.soundManager.toggleMusic(value);
        break;
      case 'sfx-enabled':
        this.soundManager.toggleSfx(value);
        break;
    }
    // Save settings
    this.saveGameData();
    // Re-render settings screen to update UI
    this.showSettings();
  }

  /**
   * Get player's deck cards for battle
   */
  private getPlayerDeckCards(): AnyCard[] {
    return this.cardCollectionManager.getPlayerDeckCards(
      this.playerDeck,
      this.cardCollection
    );
  }

  /**
   * Handle mission selection
   */
  private async handleMissionSelect(missionId: string): Promise<void> {
    Logger.info(`Mission selected: ${missionId}`);

    // Play menu button sound
    this.soundManager.playSfx('sfx/menuButtonSelect.wav');

    // Check if player has a deck with at least some cards
    if (this.playerDeck.length === 0) {
      await this.platform.showDialog(
        'No Cards in Deck',
        'You need to add cards to your deck before starting a mission.',
        ['OK']
      );
      await this.showCards();
      return;
    }

    // Get player's deck cards
    const playerDeckCards = this.getPlayerDeckCards();

    if (playerDeckCards.length === 0) {
      await this.platform.showDialog(
        'Deck Error',
        'Failed to load your deck cards. Please check your cards.',
        ['OK']
      );
      return;
    }

    // Start the mission
    const success = this.missionUI.startMission(missionId);

    if (success) {
      // Initialize battle with player's deck cards
      const battleState = this.battleUI.initializeBattle(playerDeckCards);

      if (battleState) {
        // Set up render callback for opponent AI actions
        this.battleUI.setRenderCallback(() => {
          // Only update if we're still in battle screen
          if (this.currentScreen === 'battle') {
            this.updateBattleDisplay();
          }
        });

        // Set up action callback for opponent sound effects and animations
        this.battleUI.setOpponentActionCallback(async (action: string) => {
          if (action.startsWith('attack-beast-opponent-')) {
            // Parse: attack-beast-opponent-{attackerIndex}-player-{targetIndex}
            const parts = action.substring('attack-beast-opponent-'.length).split('-player-');
            const attackerIndex = parseInt(parts[0], 10);
            const targetIndex = parseInt(parts[1], 10);

            // Play sound
            this.soundManager.playSfx('sfx/attack.wav');

            // Play animation
            await this.playAttackAnimation('opponent', attackerIndex, 'player', targetIndex);
          } else if (action.startsWith('attack-player-opponent-')) {
            // Parse: attack-player-opponent-{attackerIndex}
            const attackerIndex = parseInt(action.substring('attack-player-opponent-'.length), 10);

            // Play sound
            this.soundManager.playSfx('sfx/attack.wav');

            // Play animation (opponent attacks player health)
            await this.playAttackAnimation('opponent', attackerIndex, 'health', undefined);
          } else if (action.startsWith('play-magic-card:')) {
            // Parse: play-magic-card:{cardJSON}
            const cardJSON = action.substring('play-magic-card:'.length);
            try {
              const card = JSON.parse(cardJSON);
              this.soundManager.playSfx('sfx/playCard.wav');
              await this.showCardPopup(card, 'opponent');
            } catch (error) {
              Logger.error('Failed to parse magic card JSON:', error);
            }
          } else if (action.startsWith('play-trap-card:')) {
            // Trap cards are face-down, so don't show popup when opponent plays them
            // Just play the sound effect
            this.soundManager.playSfx('sfx/playCard.wav');
          } else if (action.startsWith('play-habitat-card:')) {
            // Parse: play-habitat-card:{cardJSON}
            const cardJSON = action.substring('play-habitat-card:'.length);
            try {
              const card = JSON.parse(cardJSON);
              this.soundManager.playSfx('sfx/playCard.wav');
              await this.showCardPopup(card, 'opponent');
            } catch (error) {
              Logger.error('Failed to parse habitat card JSON:', error);
            }
          } else if (action === 'play-card') {
            this.soundManager.playSfx('sfx/playCard.wav');
          } else if (action === 'player-low-health') {
            this.soundManager.playSfx('sfx/lowHealthSound.wav');
          } else if (action === 'trap-activated') {
            this.soundManager.playSfx('sfx/trapCardActivated.wav');
          }
        });

        this.currentScreen = 'battle';
        this.currentBattleId = missionId;
        // Play battle music
        this.soundManager.playMusic('BattleMusic.mp3', true);
        await this.updateBattleDisplay();
        this.platform.playSound('battle-start');
      }
    } else {
      await this.platform.showDialog(
        'Mission Unavailable',
        'This mission is not available yet.',
        ['OK']
      );
    }
  }

  /**
   * Handle card selection in cards screen
   */
  private async handleCardSelect(cardId: string): Promise<void> {
    // Play menu button sound
    this.soundManager.playSfx('sfx/menuButtonSelect.wav');

    const cardEntry = this.cardCollection.getCard(cardId);

    if (cardEntry) {
      // Convert to CardDisplay format
      const cardDisplay = this.cardInstanceToDisplay(cardEntry);

      // Check if card is in deck
      const isInDeck = this.playerDeck.includes(cardId);
      const buttons = isInDeck ? ['Remove', 'Close'] : ['Add', 'Close'];

      // Create CardDetailDisplay object
      const cardDetailDisplay: CardDetailDisplay = {
        card: cardDisplay,
        buttons: buttons,
        isInDeck: isInDeck,
      };

      // Get current stats
      const stats: MenuStats = {
        playerLevel: this.playerData.level,
        totalXP: this.playerData.totalXP,
        tokens: this.getItemQuantity('token'),
        diamonds: this.getItemQuantity('diamond'),
        serums: this.getItemQuantity('serum'),
      };

      // Store the current card ID for button handling
      this.currentCardDetailId = cardId;

      // Render card detail view (as overlay on top of current screen)
      this.platform.renderCardDetail(cardDetailDisplay, stats);
    }
  }

  /**
   * Add card to player's deck
   */
  private async addCardToDeck(cardId: string): Promise<void> {
    if (this.playerDeck.length >= DECK_SIZE) {
      await this.platform.showDialog('Deck Full', `Your deck already has ${DECK_SIZE} cards. Remove a card first.`, ['OK']);
      return;
    }

    if (!this.playerDeck.includes(cardId)) {
      this.playerDeck.push(cardId);
      await this.saveGameData();

      // If we're in card detail screen, refresh that view
      if (this.currentScreen === 'card-detail') {
        await this.handleCardSelect(cardId);
      } else {
        // Otherwise refresh cards screen
        await this.showCards();
      }
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

      // If we're in card detail screen, refresh that view
      if (this.currentScreen === 'card-detail') {
        await this.handleCardSelect(cardId);
      } else {
        // Otherwise refresh cards screen
        await this.showCards();
      }
    }
  }

  /**
   * Select a deck for battle
   */
  private selectDeck(deckId: string): void {
    switch (deckId) {
      case 'fire':
        this.selectedDeck = buildFireDeck();
        break;
      case 'water':
        this.selectedDeck = buildWaterDeck();
        break;
      case 'forest':
        this.selectedDeck = buildForestDeck();
        break;
      case 'sky':
        this.selectedDeck = buildSkyDeck();
        break;
    }

    if (this.selectedDeck) {
      this.platform.showDialog(
        'Deck Selected',
        `You have selected the ${deckId} deck.`,
        ['OK']
      );
    }
  }

  /**
   * Start the selected battle
   */
  private async startSelectedBattle(): Promise<void> {
    if (!this.currentBattleId || !this.selectedDeck) {
      return;
    }

    // Battle is already initialized, just update display
    await this.updateBattleDisplay();
  }

  /**
   * Update battle display
   */
  private async updateBattleDisplay(attackAnimation?: {
    attackerPlayer: 'player' | 'opponent';
    attackerIndex: number;
    targetPlayer: 'player' | 'opponent' | 'health';
    targetIndex?: number;
  } | null): Promise<void> {
    const battleState = this.battleUI.getCurrentBattle();

    // Check if battle ended FIRST - never render after completion
    if (battleState && battleState.isComplete && !attackAnimation) {
      await this.handleBattleComplete(battleState);
      return;
    }

    const display = this.battleDisplayManager.createBattleDisplay(
      battleState,
      this.selectedBeastIndex,
      attackAnimation
    );

    if (!display) return;

    // Add current popup if one is active (preserves popup during timer refreshes)
    if (this.currentCardPopup) {
      display.cardPopup = this.currentCardPopup;
    }

    this.platform.renderBattle(display);
  }

  /**
   * Handle viewing a card in player's hand
   */
  private async handleViewHandCard(index: number): Promise<void> {
    const battleState = this.battleUI.getCurrentBattle();
    if (!battleState || !battleState.gameState) return;

    const player = battleState.gameState.players[0];
    const card = player.hand[index];

    // Debug: Check hand card data
    Logger.debug('Hand card:', card);

    if (!card) return;

    // Check if card is affordable
    const canAfford = card.cost <= player.currentNectar;

    if (canAfford) {
      // Play the card directly if affordable
      await this.handleBattleAction(`play-card-${index}`);
    }
    // If can't afford, simply ignore the click (no dialog)
  }

  /**
   * Handle viewing a card on the battle field
   */
  private async handleViewFieldCard(player: string, index: number): Promise<void> {
    const battleState = this.battleUI.getCurrentBattle();
    if (!battleState || !battleState.gameState) return;

    const playerObj = player === 'player' ? battleState.gameState.players[0] : battleState.gameState.players[1];
    const beast = playerObj.field[index];

    if (!beast) return;

    if (player === 'player') {
      // Player's own beast - directly select for attacking if it's player's turn and no summoning sickness
      const isPlayerTurn = battleState.gameState.activePlayer === 0;

      if (isPlayerTurn && !beast.summoningSickness) {
        // Select this beast for attacking
        this.selectedBeastIndex = index;
        await this.updateBattleDisplay(); // Refresh to show selection
      }
      // If can't select (not player's turn or has summoning sickness), ignore the click
    } else {
      // Opponent's beast - if we have a selected beast, attack directly
      if (this.selectedBeastIndex !== null) {
        await this.handleBattleAction(`attack-beast-${this.selectedBeastIndex}-${index}`);
        this.selectedBeastIndex = null; // Clear selection after attack
      }
      // If no selected beast, ignore the click
    }
  }

  /**
   * Handle viewing a trap card in the trap zone
   */
  private async handleViewTrapCard(player: string, index: number): Promise<void> {
    const battleState = this.battleUI.getCurrentBattle();
    if (!battleState || !battleState.gameState) return;

    // Only show trap cards for the player, not the opponent (traps are face-down)
    if (player !== 'player') {
      return; // Ignore clicks on opponent's trap cards
    }

    const playerObj = battleState.gameState.players[0];
    const trapZone = playerObj.trapZone || [];

    // Check if trap exists at this index
    if (index < 0 || index >= trapZone.length || !trapZone[index]) {
      return;
    }

    const trapCard: any = trapZone[index];

    // Get the full card definition to include effects and activation
    const allCardDefs = getAllCards();
    const cardDef = allCardDefs.find((c: any) => c && c.id === trapCard.id);

    // Merge the trap card with its definition to ensure all fields are present
    const fullCard = {
      ...trapCard,
      ...(cardDef || {}),
    };

    // Show popup that stays open until user clicks elsewhere
    await this.showCardPopup(fullCard, 'player', false);
  }

  /**
   * Handle viewing the habitat card in the habitat zone
   */
  private async handleViewHabitatCard(): Promise<void> {
    const battleState = this.battleUI.getCurrentBattle();
    if (!battleState || !battleState.gameState) return;

    const habitatCard = battleState.gameState.habitatZone;

    if (!habitatCard) {
      return; // No habitat card currently played
    }

    // Get the full card definition to include effects
    const allCardDefs = getAllCards();
    const cardDef = allCardDefs.find((c: any) => c && c.id === habitatCard.id);

    // Merge the habitat card with its definition to ensure all fields are present
    const fullCard = {
      ...habitatCard,
      ...(cardDef || {}),
    };

    // Show popup that stays open until user clicks elsewhere
    await this.showCardPopup(fullCard, 'player', false);
  }

  /**
   * Handle viewing a buff card in the buff zone
   */
  private async handleViewBuffCard(player: string, index: number): Promise<void> {
    const battleState = this.battleUI.getCurrentBattle();
    if (!battleState || !battleState.gameState) return;

    const playerObj = player === 'player' ? battleState.gameState.players[0] : battleState.gameState.players[1];
    const buffZone = playerObj.buffZone || [];

    // Check if buff exists at this index
    if (index < 0 || index >= buffZone.length || !buffZone[index]) {
      return;
    }

    const buffCard: any = buffZone[index];

    // Get the full card definition to include ongoingEffects
    const allCardDefs = getAllCards();
    const cardDef = allCardDefs.find((c: any) => c && c.id === buffCard.id);

    // Merge the buff card with its definition to ensure all fields are present
    const fullCard = {
      ...buffCard,
      ...(cardDef || {}),
    };

    // Show popup that stays open until user clicks elsewhere
    await this.showCardPopup(fullCard, player as 'player' | 'opponent', false);
  }

  /**
   * Handle battle actions
   */
  private async handleBattleAction(action: string): Promise<void> {
    // Handle attack actions with animation
    if (action.startsWith('attack-')) {
      this.soundManager.playSfx('sfx/attack.wav');

      // Parse attack action to get attacker and target info
      let attackerPlayer: 'player' | 'opponent' = 'player';
      let attackerIndex: number = 0;
      let targetPlayer: 'player' | 'opponent' | 'health' = 'opponent';
      let targetIndex: number | undefined = undefined;

      if (action.startsWith('attack-beast-')) {
        // Format: attack-beast-{attackerIndex}-{targetIndex}
        const parts = action.substring('attack-beast-'.length).split('-');
        attackerIndex = parseInt(parts[0], 10);
        targetIndex = parseInt(parts[1], 10);
        targetPlayer = 'opponent';
      } else if (action.startsWith('attack-player-')) {
        // Format: attack-player-{attackerIndex}
        attackerIndex = parseInt(action.substring('attack-player-'.length), 10);
        targetPlayer = 'health';
        targetIndex = undefined;
      }

      // Run attack animation
      await this.playAttackAnimation(attackerPlayer, attackerIndex, targetPlayer, targetIndex);

      // Clear selection
      this.selectedBeastIndex = null;

      // Process action through battle UI
      await this.battleUI.processPlayerAction(action, {});
    }
    // Play card sound when playing a card
    else if (action.startsWith('play-card-')) {
      this.soundManager.playSfx('sfx/playCard.wav');

      // Get the card being played
      const cardIndex = parseInt(action.substring('play-card-'.length), 10);
      const battleState = this.battleUI.getCurrentBattle();

      if (battleState && battleState.gameState) {
        const player = battleState.gameState.players[0];
        const card = player.hand[cardIndex];

        // Check if it's a Magic, Trap, or Habitat card
        if (card && (card.type === 'Magic' || card.type === 'Trap' || card.type === 'Habitat')) {
          // Show popup for magic/trap/habitat cards
          await this.showCardPopup(card, 'player');
        }
      }

      // Process action through battle UI
      await this.battleUI.processPlayerAction(action, {});
    }
    // Other actions
    else {
      // Process action through battle UI
      await this.battleUI.processPlayerAction(action, {});
    }

    // Update display (without animation)
    await this.updateBattleDisplay();
  }

  /**
   * Play attack animation showing attacker blinking green and target blinking red
   */
  private async playAttackAnimation(
    attackerPlayer: 'player' | 'opponent',
    attackerIndex: number,
    targetPlayer: 'player' | 'opponent' | 'health',
    targetIndex?: number
  ): Promise<void> {
    const animationState = {
      attackerPlayer,
      attackerIndex,
      targetPlayer,
      targetIndex,
    };

    // Blink 3 times (on/off/on/off/on/off)
    const blinkCount = 3;
    const blinkDuration = 150; // 150ms per blink

    for (let i = 0; i < blinkCount * 2; i++) {
      // Show animation on even iterations (0, 2, 4)
      const showAnimation = i % 2 === 0;

      if (showAnimation) {
        await this.updateBattleDisplay(animationState);
      } else {
        await this.updateBattleDisplay(null);
      }

      // Wait for blink duration
      await new Promise(resolve => setTimeout(resolve, blinkDuration));
    }
  }

  /**
   * Show a card popup for magic/trap/habitat/buff cards
   * @param card - The card to display
   * @param player - Which player's side to show the popup on
   * @param autoDismiss - If true, auto-close after 2 seconds. If false, stay open until manually closed.
   */
  private async showCardPopup(card: any, player: 'player' | 'opponent', autoDismiss: boolean = true): Promise<void> {
    const battleState = this.battleUI.getCurrentBattle();
    if (!battleState || !battleState.gameState) return;

    // Store the popup state (this will be picked up by updateBattleDisplay)
    this.currentCardPopup = {
      card,
      player,
      showCloseButton: !autoDismiss, // Show close button for manual popups
    };

    // Render with popup
    await this.updateBattleDisplay();

    // Only auto-dismiss if requested (for when cards are played)
    if (autoDismiss) {
      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear popup state (only if it hasn't been changed)
      if (this.currentCardPopup?.card === card) {
        this.currentCardPopup = null;
        // Re-render without popup
        await this.updateBattleDisplay();
      }
    }
    // If not auto-dismiss, popup stays open until manually closed by user action
  }

  /**
   * Close the current card popup (for manual popups)
   */
  private closeCardPopup(): void {
    if (this.currentCardPopup) {
      this.currentCardPopup = null;
      this.updateBattleDisplay();
    }
  }

  /**
   * Handle end turn
   */
  private async handleEndTurn(): Promise<void> {
    // Clear beast selection when ending turn
    this.selectedBeastIndex = null;

    await this.battleUI.processPlayerAction('end-turn', {});
    await this.updateBattleDisplay();
  }

  /**
   * Award experience to all cards in the player's deck after battle victory
   * Card XP is distributed evenly across all cards in the deck
   */
  private awardDeckExperience(totalCardXP: number): void {
    this.cardCollectionManager.awardDeckExperience(
      totalCardXP,
      this.playerDeck,
      this.cardCollection
    );
  }

  /**
   * Handle battle completion
   */
  private async handleBattleComplete(battleState: any): Promise<void> {
    // STOP EVERYTHING IMMEDIATELY
    // 1. Stop the platform's turn timer (visual countdown)
    if ((this.platform as any).battleScreen) {
      (this.platform as any).battleScreen.stopTurnTimer();
    }

    // 2. Clear the battle logic (stops AI, clears callbacks)
    this.battleUI.clearBattle();
    this.currentBattleId = null;
    this.selectedBeastIndex = null;
    this.currentCardPopup = null; // Clear any active popup

    if (battleState.rewards) {
      // Get the mission object
      const mission = battleState.mission || this.missionManager.getCurrentMission();

      // Check if platform has new showMissionComplete method
      if (mission && (this.platform as any).showMissionComplete) {
        // Change screen state
        this.currentScreen = 'mission-complete';

        // Use new popup system - show popup first, then apply rewards after user claims
        await (this.platform as any).showMissionComplete(mission, battleState.rewards);

        // Now apply rewards (after user has clicked through popup)
        this.saveLoadManager.addXP(battleState.rewards.xpGained);

        // Award card XP
        const cardXP = battleState.rewards.beastXP || battleState.rewards.xpGained;
        this.awardDeckExperience(cardXP);

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
        if (this.currentBattleId) {
          this.saveLoadManager.trackMissionCompletion(this.currentBattleId);
        }

        // Play win sound
        this.soundManager.playSfx('sfx/win.wav');

        // Save game data
        await this.saveGameData();
      } else {
        // Fallback to old dialog system
        this.saveLoadManager.addXP(battleState.rewards.xpGained);
        const cardXP = battleState.rewards.cardXPGained || (battleState.rewards.xpGained / 2);
        this.awardDeckExperience(cardXP);

        battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
          this.cardCollectionManager.addCardReward(card, this.cardCollection, index);
        });

        if (this.currentBattleId) {
          this.saveLoadManager.trackMissionCompletion(this.currentBattleId);
        }

        const rewardDisplay: RewardDisplay = {
          xp: battleState.rewards.xpGained,
          cards: battleState.rewards.cardsReceived.map((card: any) => ({
            id: card.id,
            name: card.name,
            type: card.type,
            affinity: card.affinity,
            level: 1,
            experience: 0,
            count: 1,
          })),
          message: 'Mission Complete!',
        };

        await this.platform.showRewards(rewardDisplay);
        this.soundManager.playSfx('sfx/win.wav');
        await this.saveGameData();
      }
    } else {
      // Mission failed
      this.soundManager.playSfx('sfx/lose.wav');

      // Get the mission object
      const mission = battleState.mission || this.missionManager.getCurrentMission();

      // Check if platform has new showMissionComplete method
      if (mission && (this.platform as any).showMissionComplete) {
        // Change screen state
        this.currentScreen = 'mission-complete';

        // Show mission failed popup with null rewards (triggers fail state)
        await (this.platform as any).showMissionComplete(mission, null);
      } else {
        // Fallback to old dialog system
        await this.platform.showDialog(
          'Mission Failed',
          'Better luck next time!',
          ['OK']
        );
      }
    }

    // Resume background music
    this.soundManager.playMusic('BackgroundMusic.mp3', true);

    // Return to mission select
    await this.showMissionSelect();
  }

  /**
   * Handle back button
   */
  private async handleBackButton(): Promise<void> {
    switch (this.currentScreen) {
      case 'missions':
      case 'cards':
      case 'deck-builder':
      case 'settings':
        await this.showStartMenu();
        break;

      case 'card-detail':
        // Go back to cards screen
        await this.showCards();
        this.currentCardDetailId = null;
        break;

      case 'battle':
        // Confirm before leaving battle
        const result = await this.platform.showDialog(
          'Leave Battle?',
          'Are you sure you want to leave the battle?',
          ['Yes', 'No']
        );

        if (result === 'Yes') {
          this.battleUI.clearBattle();
          this.currentBattleId = null;
          this.selectedBeastIndex = null; // Clear selection
          this.currentCardPopup = null; // Clear any active popup
          // Play lose sound for forfeit
          this.soundManager.playSfx('sfx/lose.wav');
          // Resume background music
          this.soundManager.playMusic('BackgroundMusic.mp3', true);
          await this.showMissionSelect();
        }
        break;
    }
  }

  /**
   * Initialize starting collection
   */
  private async initializeStartingCollection(): Promise<void> {
    this.playerDeck = await this.cardCollectionManager.initializeStartingCollection(
      this.cardCollection,
      this.playerDeck
    );

    // Update cards in player data
    this.playerData.cards.collected = this.cardCollection.getAllCards();
    this.playerData.cards.deck = this.playerDeck;

    await this.saveGameData();
  }

  /**
   * Save game data
   */
  private async saveGameData(): Promise<void> {
    await this.saveLoadManager.saveGameData(this.cardCollection, this.playerDeck);
  }

  /**
   * Load game data
   */
  private async loadGameData(): Promise<void> {
    this.playerDeck = await this.saveLoadManager.loadGameData(
      this.cardCollection,
      this.missionManager
    );
    // Get the loaded player data reference
    this.playerData = this.saveLoadManager.getPlayerData();
  }

  /**
   * Update player level based on XP
   * Player leveling uses steep exponential scaling
   * Formula: XP = 100 * (2.0 ^ (level - 1))
   */
  private updatePlayerLevel(): void {
    this.saveLoadManager.updatePlayerLevel();
  }

  /**
   * Get player info for UI display (name, level, XP progress)
   * Returns current XP within level and XP required for next level
   */
  getPlayerInfo(): { name: string; level: number; currentXP: number; xpForNextLevel: number } {
    // Same thresholds as updatePlayerLevel
    const xpThresholds = [
      0,      // Level 1
      100,    // Level 2
      300,    // Level 3
      700,    // Level 4
      1500,   // Level 5
      3100,   // Level 6
      6300,   // Level 7
      12700,  // Level 8
      25500,  // Level 9
    ];

    const currentLevel = this.playerData.level;
    const totalXP = this.playerData.totalXP;

    // Calculate XP within current level
    const xpForCurrentLevel = xpThresholds[currentLevel - 1];
    const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
    const currentXP = totalXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;

    return {
      name: this.playerData.name,
      level: currentLevel,
      currentXP: currentXP,
      xpForNextLevel: xpNeeded,
    };
  }
}

/**
 * Player item instance
 */
export interface PlayerItem {
  itemId: string;  // Reference to the item definition ID
  quantity: number;  // How many of this item the player has
}

/**
 * Player data interface
 */
export interface PlayerData {
  name: string;
  level: number;
  totalXP: number;
  cards: {
    collected: any[];  // All cards the player has collected
    deck: string[];    // Card IDs in the player's deck
  };
  missions: {
    completedMissions: { [missionId: string]: number };  // Track how many times each mission has been completed
  };
  items: PlayerItem[];  // All items the player has collected
}