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
import { LevelingSystem } from './engine/systems/LevelingSystem';
import {
  buildFireDeck,
  buildWaterDeck,
  buildForestDeck,
  buildSkyDeck,
  DeckList,
  getStarterDeck
} from './engine/utils/deckBuilder';
import { BloomBeastCard, AnyCard } from './engine/types/core';
import { Mission } from './screens/missions/types';
import { getAllCards } from './engine/cards';
import { SoundManager, SoundSettings } from './systems/SoundManager';

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
  ability?: { name: string; description: string; };
  description?: string; // Description for Magic/Trap/Habitat/Buff cards
  counters?: Array<{ type: string; amount: number }>; // Counters on the card
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
  nectar: number;
  message: string;
}

export type GameScreen = 'start-menu' | 'missions' | 'cards' | 'battle' | 'deck-builder' | 'settings' | 'card-detail';

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
    console.log('Initializing Bloom Beasts...');

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
    console.log(`Button clicked: ${buttonId}`);

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
          // Just refresh the battle display to remove the overlay
          await this.updateBattleDisplay();
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
    const item = this.playerData.items.find(i => i.itemId === itemId);
    return item ? item.quantity : 0;
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
    // Get all card definitions once
    const allCardDefs = getAllCards();
    const cardDef = allCardDefs.find((c: any) => c && c.id === card.cardId);

    // Calculate experience requirements for all card types
    let expRequired = 0;
    if (card.type === 'Bloom' && card.level) {
      // For Bloom beasts, use the LevelingSystem
      expRequired = LevelingSystem.getXPRequirement(card.level as any, cardDef as BloomBeastCard | undefined) || 0;
    } else if (card.level) {
      // For Magic/Trap/Habitat/Buff cards, use simple formula (level * 100)
      expRequired = card.level * 100;
    }

    // Build display card with common properties
    const displayCard: CardDisplay = {
      id: card.id,
      name: card.name,
      type: card.type,
      affinity: card.affinity,
      cost: card.cost,
      level: card.level,
      experience: card.currentXP || 0,
      experienceRequired: expRequired,
      count: 1,
    };

    // Copy titleColor from card definition if present (applies to all card types)
    if (cardDef && (cardDef as any).titleColor) {
      (displayCard as any).titleColor = (cardDef as any).titleColor;
    }

    // Add type-specific fields
    if (card.type === 'Bloom') {
      displayCard.baseAttack = card.baseAttack;
      displayCard.currentAttack = card.currentAttack;
      displayCard.baseHealth = card.baseHealth;
      displayCard.currentHealth = card.currentHealth;
      displayCard.ability = card.ability;
    } else if (card.type === 'Trap') {
      // For Trap cards, get description from card definition
      if (cardDef && (cardDef as any).description) {
        displayCard.ability = {
          name: 'Trap Card',
          description: (cardDef as any).description
        };
      } else if (card.effects && card.effects.length > 0) {
        // Fallback to effects if no description found
        displayCard.ability = {
          name: 'Trap Card',
          description: card.effects.join('. ')
        };
      }
    } else if (card.type === 'Magic') {
      // For Magic cards, convert effects to readable descriptions
      const effectDescs = this.getEffectDescriptions(card);
      if (effectDescs.length > 0) {
        displayCard.ability = {
          name: card.type + ' Card',
          description: effectDescs.join('. ')
        };
      }
    } else if (card.type === 'Habitat' || card.type === 'Buff') {
      // For Habitat/Buff cards, get description from card definition
      if (cardDef && (cardDef as any).description) {
        displayCard.description = (cardDef as any).description;
      }
    }

    return displayCard;
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
   * Get abilities for a card based on its level
   */
  private getAbilitiesForLevel(cardInstance: CardInstance): { ability: any} {
    // Get the base card definition
    const allCards = getAllCards();
    const cardDef = allCards.find((card: any) =>
      card && card.id === cardInstance.cardId
    ) as BloomBeastCard | undefined;

    if (!cardDef || cardDef.type !== 'Bloom') {
      return {
        ability: cardInstance.ability
      };
    }

    const level = cardInstance.level || 1;
    let ability = cardDef.ability;

    // Apply ability upgrades based on level
    if (cardDef.levelingConfig?.abilityUpgrades) {
      const upgrades = cardDef.levelingConfig.abilityUpgrades;

      // Check each upgrade level (4, 7, 9) up to current level
      if (level >= 4 && upgrades[4]) {
        ability = upgrades[4].ability || ability;
      }
      if (level >= 7 && upgrades[7]) {
        ability = upgrades[7].ability || ability;
      }
      if (level >= 9 && upgrades[9]) {
        ability = upgrades[9].ability || ability;
      }
    }

    return { ability };
  }

  /**
   * Get player's deck cards for battle
   */
  private getPlayerDeckCards(): AnyCard[] {
    const deckCards: AnyCard[] = [];
    const allCardDefs = getAllCards();

    // Convert all cards from player's deck
    for (const cardId of this.playerDeck) {
      const cardInstance = this.cardCollection.getCard(cardId);

      if (cardInstance) {
        if (cardInstance.type === 'Bloom') {
          // Get the correct abilities for the card's level
          const abilities = this.getAbilitiesForLevel(cardInstance);

          // Convert CardInstance to BloomBeastCard format for battle
          const bloomCard: BloomBeastCard = {
            id: cardInstance.cardId,
            instanceId: cardInstance.id, // Used for unique identification in battle
            name: cardInstance.name,
            type: 'Bloom',
            affinity: cardInstance.affinity || 'Forest',
            cost: cardInstance.cost,
            baseAttack: cardInstance.baseAttack || 0,
            baseHealth: cardInstance.baseHealth || 0,
            ability: abilities.ability,
            level: cardInstance.level || 1, // Include level for beast instance
            levelingConfig: {} as any, // Not used in battle
          } as any;

          deckCards.push(bloomCard);
        } else {
          // For non-Bloom cards, find the original card definition
          const originalCard = allCardDefs.find((card: any) =>
            card && card.id === cardInstance.cardId
          );

          if (originalCard) {
            // Use the original card definition for battle
            deckCards.push(originalCard as AnyCard);
          } else {
            // Fallback: create a simple card structure
            console.warn(`Card definition not found for ${cardInstance.cardId}, creating fallback`);
            const fallbackCard: any = {
              id: cardInstance.cardId,
              name: cardInstance.name,
              type: cardInstance.type,
              cost: cardInstance.cost || 0,
              affinity: cardInstance.affinity,
            };

            // Add type-specific properties
            if (cardInstance.type === 'Magic' || cardInstance.type === 'Trap') {
              fallbackCard.effects = [];
            } else if (cardInstance.type === 'Habitat') {
              fallbackCard.onPlayEffects = [];
              fallbackCard.ongoingEffects = [];
            }

            deckCards.push(fallbackCard);
          }
        }
      }
    }

    return deckCards;
  }

  /**
   * Handle mission selection
   */
  private async handleMissionSelect(missionId: string): Promise<void> {
    console.log(`Mission selected: ${missionId}`);

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
              console.error('Failed to parse magic card JSON:', error);
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
              console.error('Failed to parse habitat card JSON:', error);
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
    if (this.playerDeck.length >= 30) {
      await this.platform.showDialog('Deck Full', 'Your deck already has 30 cards. Remove a card first.', ['OK']);
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
   * Calculate stat bonuses for a beast from habitat and buff zones
   */
  private calculateStatBonuses(beast: any, gameState: any, playerIndex: number): { attackBonus: number; healthBonus: number } {
    let attackBonus = 0;
    let healthBonus = 0;

    // Helper to check if effect applies to this beast
    const checkCondition = (condition: any): boolean => {
      if (!condition) return true; // No condition means applies to all

      switch (condition.type) {
        case 'affinity-matches':
        case 'AffinityMatches':
          return beast.affinity === condition.value;
        // Add more condition types as needed
        default:
          return true;
      }
    };

    // Helper to process ongoing effects
    const processOngoingEffects = (effects: any[]) => {
      if (!effects || !Array.isArray(effects)) return;

      effects.forEach((effect: any) => {
        // Only process stat modification effects with WhileOnField duration
        if (effect.type === 'modify-stats' || effect.type === 'ModifyStats') {
          if (effect.duration === 'while-on-field' || effect.duration === 'WhileOnField') {
            // Check if effect applies to this beast
            if (checkCondition(effect.condition)) {
              // Apply the bonus based on stat type
              if (effect.stat === 'attack' || effect.stat === 'Attack') {
                attackBonus += effect.value || 0;
              } else if (effect.stat === 'health' || effect.stat === 'Health') {
                healthBonus += effect.value || 0;
              } else if (effect.stat === 'both' || effect.stat === 'Both') {
                attackBonus += effect.value || 0;
                healthBonus += effect.value || 0;
              }
            }
          }
        }
      });
    };

    // Process habitat zone ongoing effects
    if (gameState.habitatZone && gameState.habitatZone.ongoingEffects) {
      processOngoingEffects(gameState.habitatZone.ongoingEffects);
    }

    // Process buff zones ONLY for the player who owns this beast
    if (gameState.players && gameState.players[playerIndex]) {
      const player = gameState.players[playerIndex];
      if (player.buffZone && Array.isArray(player.buffZone)) {
        player.buffZone.forEach((buff: any) => {
          if (buff && buff.ongoingEffects) {
            processOngoingEffects(buff.ongoingEffects);
          }
        });
      }
    }

    return { attackBonus, healthBonus };
  }

  /**
   * Enrich field beasts with card definition data and apply bonuses for display
   */
  private enrichFieldBeasts(field: any[], gameState?: any, playerIndex?: number): any[] {
    // Create a card lookup map from all card definitions
    const cardMap = new Map<string, BloomBeastCard>();
    const allCards = getAllCards();
    allCards.forEach((card: any) => {
      if (card && card.type === 'Bloom') {
        cardMap.set(card.id, card as BloomBeastCard);
      }
    });

    return field.map(beast => {
      if (!beast) return null;

      // Get the card definition
      const cardDef = cardMap.get(beast.cardId);

      if (!cardDef) return beast; // Return as-is if card not found

      // Calculate stat bonuses from habitat and buffs (only if we have gameState and playerIndex)
      const bonuses = (gameState && playerIndex !== undefined)
        ? this.calculateStatBonuses(beast, gameState, playerIndex)
        : { attackBonus: 0, healthBonus: 0 };

      // Merge instance data with card definition data and apply bonuses
      // Only add abilities if they're not already present
      return {
        ...beast,
        name: beast.name || cardDef.name,
        affinity: beast.affinity || cardDef.affinity,
        cost: beast.cost || cardDef.cost,
        ability: beast.ability || cardDef.ability,
        // Apply bonuses to display stats (don't modify the actual beast in game engine)
        currentAttack: (beast.currentAttack || 0) + bonuses.attackBonus,
        currentHealth: (beast.currentHealth || 0) + bonuses.healthBonus,
        maxHealth: (beast.maxHealth || 0) + bonuses.healthBonus,
      };
    });
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

    if (!battleState || !battleState.gameState) {
      return;
    }

    // Players is a tuple [Player, Player] where index 0 is typically the player
    const player = battleState.gameState.players[0];
    const opponent = battleState.gameState.players[1];

    if (!player || !opponent) return;

    // Convert to display format
    const display: BattleDisplay = {
      playerHealth: player.health,
      playerMaxHealth: player.maxHealth || 30, // Default to 30 if undefined
      playerDeckCount: player.deck.length,
      playerNectar: player.currentNectar,
      playerHand: player.hand,
      playerTrapZone: player.trapZone || [null, null, null],
      playerBuffZone: player.buffZone || [null, null],
      opponentHealth: opponent.health,
      opponentMaxHealth: opponent.maxHealth || 30, // Default to 30 if undefined
      opponentDeckCount: opponent.deck.length,
      opponentNectar: opponent.currentNectar,
      opponentField: this.enrichFieldBeasts(opponent.field, battleState.gameState, 1), // Opponent is player index 1
      opponentTrapZone: opponent.trapZone || [null, null, null],
      opponentBuffZone: opponent.buffZone || [null, null],
      playerField: this.enrichFieldBeasts(player.field, battleState.gameState, 0), // Player is player index 0
      currentTurn: battleState.gameState.turn,
      turnPlayer: battleState.gameState.activePlayer === 0 ? 'player' : 'opponent',
      turnTimeRemaining: 60, // TODO: Implement actual timer
      objectives: this.getObjectiveDisplay(battleState),
      habitatZone: battleState.gameState.habitatZone,
      selectedBeastIndex: this.selectedBeastIndex,
      attackAnimation: attackAnimation,
    };

    this.platform.renderBattle(display);

    // Check if battle ended (only if no animation is running)
    if (battleState.isComplete && !attackAnimation) {
      await this.handleBattleComplete(battleState);
    }
  }

  /**
   * Get objective display for current battle
   */
  private getObjectiveDisplay(battleState: any): ObjectiveDisplay[] {
    if (!battleState.mission || !battleState.progress) {
      return [];
    }

    // Check if mission has objectives defined
    if (!battleState.mission.objectives || !Array.isArray(battleState.mission.objectives)) {
      return [];
    }

    return battleState.mission.objectives.map((obj: any) => {
      const key = `${obj.type}-${obj.target || 0}`;
      const progress = battleState.progress.objectiveProgress.get(key) || 0;
      const target = obj.target || 1;

      return {
        description: obj.description,
        progress: Math.min(progress, target),
        target: target,
        isComplete: progress >= target,
      };
    });
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
    console.log('Hand card:', card);

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

    // Determine player index: 0 for player, 1 for opponent
    const playerIndex = player === 'player' ? 0 : 1;
    const field = this.enrichFieldBeasts(playerObj.field, battleState.gameState, playerIndex);
    const beast = field[index];

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

    // Convert to CardDisplay format (similar to inventory)
    const allCardDefs = getAllCards();
    const cardDef = allCardDefs.find((c: any) => c && c.id === trapCard.id);

    const cardDisplay: CardDisplay = {
      id: trapCard.id,
      name: trapCard.name,
      type: 'Trap',
      affinity: trapCard.affinity,
      cost: trapCard.cost || 0,
      level: 1,
      experience: 0,
      count: 1,
      counters: trapCard.counters || [],
    };

    // Add description
    if (cardDef && (cardDef as any).description) {
      cardDisplay.ability = {
        name: 'Trap Card',
        description: (cardDef as any).description
      };
    }

    // Create CardDetailDisplay object with just Close button
    const cardDetailDisplay: CardDetailDisplay = {
      card: cardDisplay,
      buttons: ['Close'],
      isInDeck: false,
    };

    // Get current stats
    const stats: MenuStats = {
      playerLevel: this.playerData.level,
      totalXP: this.playerData.totalXP,
      tokens: this.getItemQuantity('token'),
      diamonds: this.getItemQuantity('diamond'),
      serums: this.getItemQuantity('serum'),
    };

    // Render card detail view (as overlay on top of battle screen)
    this.platform.renderCardDetail(cardDetailDisplay, stats);
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

    // Convert to CardDisplay format (similar to inventory)
    const allCardDefs = getAllCards();
    const cardDef = allCardDefs.find((c: any) => c && c.id === habitatCard.id);

    const cardDisplay: CardDisplay = {
      id: habitatCard.id,
      name: habitatCard.name,
      type: 'Habitat',
      affinity: habitatCard.affinity,
      cost: habitatCard.cost || 0,
      level: 1,
      experience: 0,
      count: 1,
      counters: habitatCard.counters || [],
    };

    // Add description
    if (cardDef && (cardDef as any).description) {
      cardDisplay.description = (cardDef as any).description;
    }

    // Create CardDetailDisplay object with just Close button
    const cardDetailDisplay: CardDetailDisplay = {
      card: cardDisplay,
      buttons: ['Close'],
      isInDeck: false,
    };

    // Get current stats
    const stats: MenuStats = {
      playerLevel: this.playerData.level,
      totalXP: this.playerData.totalXP,
      tokens: this.getItemQuantity('token'),
      diamonds: this.getItemQuantity('diamond'),
      serums: this.getItemQuantity('serum'),
    };

    // Render card detail view (as overlay on top of battle screen)
    this.platform.renderCardDetail(cardDetailDisplay, stats);
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

    // Convert to CardDisplay format (similar to inventory)
    const allCardDefs = getAllCards();
    const cardDef = allCardDefs.find((c: any) => c && c.id === buffCard.id);

    const cardDisplay: CardDisplay = {
      id: buffCard.id,
      name: buffCard.name,
      type: 'Buff',
      affinity: buffCard.affinity,
      cost: buffCard.cost || 0,
      level: 1,
      experience: 0,
      count: 1,
      counters: buffCard.counters || [],
    };

    // Add description
    if (cardDef && (cardDef as any).description) {
      cardDisplay.description = (cardDef as any).description;
    }

    // Create CardDetailDisplay object with just Close button
    const cardDetailDisplay: CardDetailDisplay = {
      card: cardDisplay,
      buttons: ['Close'],
      isInDeck: false,
    };

    // Get current stats
    const stats: MenuStats = {
      playerLevel: this.playerData.level,
      totalXP: this.playerData.totalXP,
      tokens: this.getItemQuantity('token'),
      diamonds: this.getItemQuantity('diamond'),
      serums: this.getItemQuantity('serum'),
    };

    // Render card detail view (as overlay on top of battle screen)
    this.platform.renderCardDetail(cardDetailDisplay, stats);
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
   * Show a card popup for magic/trap cards
   * Display for 3 seconds then dismiss
   */
  private async showCardPopup(card: any, player: 'player' | 'opponent'): Promise<void> {
    // Get current battle state without animation
    const battleState = this.battleUI.getCurrentBattle();
    if (!battleState || !battleState.gameState) return;

    // Build display with cardPopup
    const playerObj = battleState.gameState.players[0];
    const opponent = battleState.gameState.players[1];

    const display: BattleDisplay = {
      playerHealth: playerObj.health,
      playerMaxHealth: playerObj.maxHealth || 30,
      playerDeckCount: playerObj.deck.length,
      playerNectar: playerObj.currentNectar,
      playerHand: playerObj.hand,
      playerTrapZone: playerObj.trapZone || [null, null, null],
      playerBuffZone: playerObj.buffZone || [null, null],
      opponentHealth: opponent.health,
      opponentMaxHealth: opponent.maxHealth || 30,
      opponentDeckCount: opponent.deck.length,
      opponentNectar: opponent.currentNectar,
      opponentField: this.enrichFieldBeasts(opponent.field, battleState.gameState, 1), // Opponent is player index 1
      opponentTrapZone: opponent.trapZone || [null, null, null],
      opponentBuffZone: opponent.buffZone || [null, null],
      playerField: this.enrichFieldBeasts(playerObj.field, battleState.gameState, 0), // Player is player index 0
      currentTurn: battleState.gameState.turn,
      turnPlayer: battleState.gameState.activePlayer === 0 ? 'player' : 'opponent',
      turnTimeRemaining: 60,
      objectives: this.getObjectiveDisplay(battleState),
      habitatZone: battleState.gameState.habitatZone,
      selectedBeastIndex: this.selectedBeastIndex,
      attackAnimation: null,
      cardPopup: {
        card,
        player,
      },
    };

    // Show popup
    this.platform.renderBattle(display);

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear popup (re-render without popup)
    await this.updateBattleDisplay();
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
    const allCardDefs = getAllCards();

    // Distribute XP evenly across all cards in deck
    const xpPerCard = Math.floor(totalCardXP / this.playerDeck.length);

    // Award XP to each card in the deck
    for (const cardId of this.playerDeck) {
      const cardInstance = this.cardCollection.getCard(cardId);

      if (!cardInstance) continue;

      // Add XP
      cardInstance.currentXP = (cardInstance.currentXP || 0) + xpPerCard;

      // Check for level up
      let leveledUp = false;

      if (cardInstance.type === 'Bloom') {
        // For Bloom beasts, use the LevelingSystem
        const cardDef = allCardDefs.find((c: any) => c && c.id === cardInstance.cardId) as BloomBeastCard | undefined;

        if (cardDef) {
          let currentLevel = cardInstance.level || 1;
          let currentXP = cardInstance.currentXP;

          // Keep leveling up while possible
          while (currentLevel < 9) {
            const nextLevel = (currentLevel + 1) as any;
            const xpRequired = LevelingSystem.getXPRequirement(currentLevel as any, cardDef);

            if (xpRequired !== null && currentXP >= xpRequired) {
              // Level up!
              currentXP -= xpRequired;
              currentLevel = nextLevel;

              // Apply stat gains
              const statGain = LevelingSystem.getStatGain(currentLevel as any, cardDef);
              cardInstance.currentAttack = (cardInstance.currentAttack || 0) + statGain.attackGain;
              cardInstance.currentHealth = (cardInstance.currentHealth || 0) + statGain.healthGain;
              cardInstance.baseAttack = (cardInstance.baseAttack || 0) + statGain.attackGain;
              cardInstance.baseHealth = (cardInstance.baseHealth || 0) + statGain.healthGain;

              leveledUp = true;
            } else {
              break;
            }
          }

          // Update the card instance
          cardInstance.level = currentLevel;
          cardInstance.currentXP = currentXP;

          // Update ability if there's an upgrade at this level
          if (leveledUp) {
            const abilities = this.getAbilitiesForLevel(cardInstance);
            cardInstance.ability = abilities.ability;
          }
        }
      } else {
        // For Magic/Trap/Habitat/Buff cards, use steep exponential leveling
        // Formula: XP = 20 * (2.0 ^ (level - 1))
        const nonBloomXPRequirements = [0, 20, 40, 80, 160, 320, 640, 1280, 2560];

        let currentLevel = cardInstance.level || 1;
        let currentXP = cardInstance.currentXP;

        // Keep leveling up while possible
        while (currentLevel < 9) {
          const xpRequired = nonBloomXPRequirements[currentLevel];

          if (currentXP >= xpRequired) {
            // Level up!
            currentXP -= xpRequired;
            currentLevel++;
            leveledUp = true;
          } else {
            break;
          }
        }

        // Update the card instance
        cardInstance.level = currentLevel;
        cardInstance.currentXP = currentXP;
      }

      if (leveledUp) {
        console.log(`${cardInstance.name} leveled up to level ${cardInstance.level}!`);
      }
    }
  }

  /**
   * Handle battle completion
   */
  private async handleBattleComplete(battleState: any): Promise<void> {
    if (battleState.rewards) {
      // Apply player XP (for player leveling)
      this.playerData.totalXP += battleState.rewards.xpGained;
      // Note: Nectar is no longer persistent - it's only tracked during battle

      // Award card XP (distributed evenly across all cards in deck)
      // Card XP is separate from player XP and comes from mission cardXP reward
      const cardXP = battleState.rewards.cardXPGained || (battleState.rewards.xpGained / 2);
      this.awardDeckExperience(cardXP);

      // Add cards to collection
      battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
        const baseId = `${card.id}-reward-${Date.now()}-${index}`;

        if (card.type === 'Bloom') {
          // Convert Bloom Beast card rewards to CardInstance for collection
          const beastCard = card as BloomBeastCard;
          const cardInstance: CardInstance = {
            id: baseId,
            cardId: beastCard.id,
            name: beastCard.name,
            type: 'Bloom',
            affinity: beastCard.affinity,
            cost: beastCard.cost,
            level: 1,
            currentXP: 0,
            baseAttack: beastCard.baseAttack,
            currentAttack: beastCard.baseAttack,
            baseHealth: beastCard.baseHealth,
            currentHealth: beastCard.baseHealth,
            ability: beastCard.ability ? {
              name: (beastCard.ability as any).name || '',
              description: (beastCard.ability as any).description || ''
            } : undefined,
          };
          this.cardCollection.addCard(cardInstance);
        } else {
          // Convert Magic, Trap, and Habitat card rewards to CardInstance
          const cardInstance: CardInstance = {
            id: baseId,
            cardId: card.id,
            name: card.name,
            type: card.type,
            affinity: card.affinity,
            cost: card.cost || 0,
            level: 1,           // All cards start at level 1
            currentXP: 0,       // All cards start with 0 XP
            effects: this.getEffectDescriptions(card),
            ability: undefined,
          };
          this.cardCollection.addCard(cardInstance);
        }
      });

      // Track mission completion
      if (this.currentBattleId) {
        // Track mission completion count
        const currentCount = this.playerData.missions.completedMissions[this.currentBattleId] || 0;
        this.playerData.missions.completedMissions[this.currentBattleId] = currentCount + 1;
      }

      // Show rewards
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
        nectar: battleState.rewards.nectarGained,
        message: 'Mission Complete!',
      };

      // Show rewards and wait for user to dismiss dialog
      await this.platform.showRewards(rewardDisplay);

      // Play win sound
      this.soundManager.playSfx('sfx/win.ogg');

      // Save game data
      await this.saveGameData();
    } else {
      // Mission failed - play lose sound before showing dialog
      this.soundManager.playSfx('sfx/lose.wav');

      await this.platform.showDialog(
        'Mission Failed',
        'Better luck next time!',
        ['OK']
      );
    }

    // Clear battle
    this.battleUI.clearBattle();
    this.currentBattleId = null;
    this.selectedBeastIndex = null; // Clear selection

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
    // Give player one starter deck worth of cards - default to Forest
    const starterDeck = getStarterDeck('Forest');

    starterDeck.cards.forEach((card, index) => {
      const baseId = `${card.id}-${Date.now()}-${index}`;

      if (card.type === 'Bloom') {
        // Process Bloom Beast cards
        const beastCard = card as BloomBeastCard;
        const cardInstance: CardInstance = {
          id: baseId,
          cardId: beastCard.id,
          name: beastCard.name,
          type: 'Bloom',
          affinity: beastCard.affinity,
          cost: beastCard.cost,
          level: 1,
          currentXP: 0,
          baseAttack: beastCard.baseAttack,
          currentAttack: beastCard.baseAttack,
          baseHealth: beastCard.baseHealth,
          currentHealth: beastCard.baseHealth,
          ability: beastCard.ability ? {
            name: (beastCard.ability as any).name || '',
            description: (beastCard.ability as any).description || ''
          } : undefined,
        };
        this.cardCollection.addCard(cardInstance);
        // Add to player's deck (up to 30 cards)
        if (this.playerDeck.length < 30) {
          this.playerDeck.push(cardInstance.id);
        }
      } else {
        // Process Magic, Trap, and Habitat cards
        const cardInstance: CardInstance = {
          id: baseId,
          cardId: card.id,
          name: card.name,
          type: card.type,
          affinity: (card as any).affinity,
          cost: card.cost || 0,
          level: 1,           // All cards start at level 1
          currentXP: 0,       // All cards start with 0 XP
          // Add simplified effect descriptions for display
          effects: this.getEffectDescriptions(card),
          ability: undefined, // Non-Bloom cards use effects instead
        };
        this.cardCollection.addCard(cardInstance);
        // Add to player's deck (up to 30 cards)
        if (this.playerDeck.length < 30) {
          this.playerDeck.push(cardInstance.id);
        }
      }
    });

    // Update cards in player data
    this.playerData.cards.collected = this.cardCollection.getAllCards();
    this.playerData.cards.deck = this.playerDeck;

    await this.saveGameData();
  }

  /**
   * Get simplified effect descriptions for Magic/Trap/Habitat cards
   */
  private getEffectDescriptions(card: any): string[] {
    const descriptions: string[] = [];

    // Try to get the actual card definition for more accurate info
    const allCardDefs = getAllCards();
    // card.cardId exists if this is a CardInstance, card.id exists if it's the original definition
    const lookupId = card.cardId || card.id;
    const cardDef = allCardDefs.find((c: any) => c && c.id === lookupId);

    if (card.type === 'Magic') {
      // Check if card definition has a description first (preferred method)
      if (cardDef && (cardDef as any).description) {
        descriptions.push((cardDef as any).description);
      } else {
        // Fallback to parsing effects
        const effects = (cardDef as any)?.effects || card.effects || [];
        effects.forEach((effect: any) => {
          const effectType = effect.type || '';
          if (effectType === 'draw-cards' || effectType === 'DrawCards') {
            descriptions.push(`Draw ${effect.value || 1} card(s)`);
          } else if (effectType === 'heal' || effectType === 'Heal') {
            descriptions.push(`Heal ${effect.value || 0}`);
          } else if (effectType === 'deal-damage' || effectType === 'Damage') {
            descriptions.push(`Deal ${effect.value || 0} damage`);
          } else if (effectType === 'modify-stats' || effectType === 'ModifyStats') {
            descriptions.push(`Modify stats by ${effect.attack || 0}/${effect.health || 0}`);
          } else if (effectType === 'gain-resource' || effectType === 'GainResource') {
            descriptions.push(`Gain ${effect.value || 1} ${effect.resource || 'nectar'}`);
          } else if (effectType === 'remove-counter' || effectType === 'RemoveCounter') {
            descriptions.push(`Remove ${effect.counter || 'all'} counters`);
          } else if (effectType === 'destroy' || effectType === 'Destroy') {
            descriptions.push(`Destroy target`);
          } else {
            // Try to create a readable description from the effect type
            const typeStr = effectType.toString().replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').trim();
            descriptions.push(typeStr || 'Special effect');
          }
        });
      }
    } else if (card.type === 'Trap') {
      // For trap cards, use the card's description if available
      if (cardDef && (cardDef as any).description) {
        // Already handled in showCards, but include here for completeness
        descriptions.push((cardDef as any).description);
      } else {
        const effects = (cardDef as any)?.effects || card.effects || [];
        effects.forEach((effect: any) => {
          if (effect.type === 'nullify-effect' || effect.type === 'NullifyEffect') {
            descriptions.push('Counter and negate effect');
          } else if (effect.type === 'damage' || effect.type === 'Damage') {
            descriptions.push(`Deal ${effect.value || 0} damage`);
          } else {
            const typeStr = (effect.type || '').toString().replace(/([A-Z])/g, ' $1').trim();
            descriptions.push(typeStr || 'Trap effect');
          }
        });
      }
    } else if (card.type === 'Habitat') {
      if (card.onPlayEffects || (cardDef as any)?.onPlayEffects) {
        descriptions.push('On Play: Field transformation');
      }
      if (card.ongoingEffects || (cardDef as any)?.ongoingEffects) {
        descriptions.push('Ongoing: Field bonuses');
      }
    }

    return descriptions.length > 0 ? descriptions : ['Special card'];
  }

  /**
   * Save game data
   */
  private async saveGameData(): Promise<void> {
    // Update cards in playerData before saving
    this.playerData.cards.collected = this.cardCollection.getAllCards();
    this.playerData.cards.deck = this.playerDeck;

    await this.platform.saveData('bloom-beasts-save', {
      playerData: this.playerData,
    });
  }

  /**
   * Load game data
   */
  private async loadGameData(): Promise<void> {
    const savedData = await this.platform.loadData('bloom-beasts-save');

    if (savedData && savedData.playerData) {
      const data = savedData.playerData;

      // Check if this is the new format or old format
      if (data.cards && data.missions) {
        // New format - direct assignment
        this.playerData = data;

        // Ensure items array exists (for saves created before items feature)
        if (!this.playerData.items) {
          this.playerData.items = [];
        }

        // Ensure completedMissions object exists (for saves created before mission tracking feature)
        if (!this.playerData.missions.completedMissions) {
          this.playerData.missions.completedMissions = {};
        }

        // Load cards into collection
        if (data.cards.collected) {
          data.cards.collected.forEach((cardInstance: CardInstance) => {
            this.cardCollection.addCard(cardInstance);
          });
        }

        // Load deck
        this.playerDeck = data.cards.deck || [];
      } else {
        // Old format - migrate to new format
        this.playerData = {
          name: data.playerName || 'Player',
          level: data.playerLevel || 1,
          totalXP: data.totalXP || 0,
          cards: {
            collected: data.cardInventory || savedData.collection || [],
            deck: savedData.playerDeck || []
          },
          missions: {
            completedMissions: {}  // Initialize empty for old saves
          },
          items: []  // Initialize items for old saves
        };

        // Load old collection format
        if (savedData.collection) {
          savedData.collection.forEach((cardInstance: CardInstance) => {
            this.cardCollection.addCard(cardInstance);
          });
        } else if (data.cardInventory) {
          data.cardInventory.forEach((cardInstance: CardInstance) => {
            this.cardCollection.addCard(cardInstance);
          });
        }

        // Load old deck format
        if (savedData.playerDeck) {
          this.playerDeck = savedData.playerDeck;
        }

        // Save in new format
        await this.saveGameData();
      }

      // Update player level based on XP
      this.updatePlayerLevel();

      // Load completed missions into MissionManager
      if (this.playerData.missions.completedMissions) {
        this.missionManager.loadCompletedMissions(this.playerData.missions.completedMissions);
      }
    }
  }

  /**
   * Update player level based on XP
   * Player leveling uses steep exponential scaling
   * Formula: XP = 100 * (2.0 ^ (level - 1))
   */
  private updatePlayerLevel(): void {
    // Cumulative XP thresholds for each level (total XP needed to reach that level)
    const xpThresholds = [
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

    for (let level = 9; level >= 1; level--) {
      if (this.playerData.totalXP >= xpThresholds[level - 1]) {
        this.playerData.level = level;
        break;
      }
    }
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
interface PlayerData {
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