/**
 * GameManager - Main orchestrator for the Bloom Beasts game
 * Platform-independent game manager that uses callbacks for platform-specific functionality
 */

import { StartMenuUI } from './screens/startmenu/StartMenuUI';
import { MenuController } from './screens/startmenu/MenuController';
import { CardCollection } from './screens/inventory/CardCollection';
import { InventoryUI } from './screens/inventory/InventoryUI';
import { CardInstance } from './screens/inventory/types';
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
import { BloomBeastCard } from './engine/types/core';
import { Mission } from './screens/missions/types';

/**
 * Platform callbacks interface - implement these for your specific platform
 */
export interface PlatformCallbacks {
  // UI Rendering
  renderStartMenu(options: string[]): void;
  renderMissionSelect(missions: MissionDisplay[]): void;
  renderInventory(cards: CardDisplay[], deckSize: number, deckCardIds: string[]): void;
  renderBattle(battleState: BattleDisplay): void;

  // Input handling
  onButtonClick(callback: (buttonId: string) => void): void;
  onCardSelect(callback: (cardId: string) => void): void;
  onMissionSelect(callback: (missionId: string) => void): void;

  // Asset loading
  loadCardImage(cardId: string): Promise<any>;
  loadBackground(backgroundId: string): Promise<any>;
  playSound(soundId: string): void;

  // Storage
  saveData(key: string, data: any): Promise<void>;
  loadData(key: string): Promise<any>;

  // Dialogs
  showDialog(title: string, message: string, buttons?: string[]): Promise<string>;
  showRewards(rewards: RewardDisplay): void;
}

export interface MissionDisplay {
  id: string;
  name: string;
  level: number;
  difficulty: string;
  isAvailable: boolean;
  isCompleted: boolean;
  description: string;
}

export interface CardDisplay {
  id: string;
  name: string;
  type: string;
  affinity?: string;
  cost?: number;
  level: number;
  experience: number;
  count: number;
  baseAttack?: number;
  currentAttack?: number;
  baseHealth?: number;
  currentHealth?: number;
  passiveAbility?: { name: string; description: string; };
  bloomAbility?: { name: string; description: string; };
}

export interface BattleDisplay {
  playerHealth: number;
  playerMaxHealth: number;
  playerDeckCount: number;
  playerNectar: number;
  playerHand: any[];
  opponentHealth: number;
  opponentMaxHealth: number;
  opponentDeckCount: number;
  opponentNectar: number;
  playerField: any[];
  opponentField: any[];
  currentTurn: number;
  turnPlayer: string;
  turnTimeRemaining: number;
  objectives: ObjectiveDisplay[];
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

export type GameScreen = 'start-menu' | 'missions' | 'inventory' | 'battle' | 'deck-builder';

/**
 * Main game manager class
 */
export class GameManager {
  // Core systems
  private startMenuUI: StartMenuUI;
  private menuController: MenuController;
  private cardCollection: CardCollection;
  private inventoryUI: InventoryUI;
  private missionManager: MissionManager;
  private missionUI: MissionSelectionUI;
  private battleUI: MissionBattleUI;
  private gameEngine: GameEngine;

  // Platform callbacks
  private platform: PlatformCallbacks;

  // Game state
  private currentScreen: GameScreen = 'start-menu';
  private playerData: PlayerData;
  private selectedDeck: DeckList | null = null;
  private currentBattleId: string | null = null;
  private playerDeck: string[] = []; // Track player's custom deck (card IDs)

  constructor(platformCallbacks: PlatformCallbacks) {
    this.platform = platformCallbacks;

    // Initialize systems
    this.startMenuUI = new StartMenuUI();
    this.menuController = new MenuController();
    this.cardCollection = new CardCollection();
    this.inventoryUI = new InventoryUI();
    this.missionManager = new MissionManager();
    this.missionUI = new MissionSelectionUI(this.missionManager);
    this.gameEngine = new GameEngine();
    this.battleUI = new MissionBattleUI(this.missionManager, this.gameEngine);

    // Initialize player data
    this.playerData = {
      playerName: 'Player',
      playerLevel: 1,
      totalXP: 0,
      nectar: 100,
      unlockedMissions: ['mission-01'],
      completedMissions: {},
      cardInventory: [],
      decks: [],
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
    if (this.playerData.cardInventory.length === 0) {
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
  }

  /**
   * Handle button clicks
   */
  private async handleButtonClick(buttonId: string): Promise<void> {
    console.log(`Button clicked: ${buttonId}`);

    switch (buttonId) {
      case 'btn-missions':
        await this.showMissionSelect();
        break;

      case 'btn-inventory':
        await this.showInventory();
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

      default:
        // Handle deck selection buttons
        if (buttonId.startsWith('deck-')) {
          this.selectDeck(buttonId.substring(5));
        }
        // Handle action buttons in battle
        else if (buttonId.startsWith('action-')) {
          await this.handleBattleAction(buttonId.substring(7));
        }
    }
  }

  /**
   * Show the start menu
   */
  async showStartMenu(): Promise<void> {
    this.currentScreen = 'start-menu';

    const menuOptions = [
      'missions',
      'inventory',
    ];

    this.platform.renderStartMenu(menuOptions);
    this.platform.playSound('menu-music');
  }

  /**
   * Show mission selection screen
   */
  async showMissionSelect(): Promise<void> {
    this.currentScreen = 'missions';

    // Set player level for mission filtering
    this.missionUI.setPlayerLevel(this.playerData.playerLevel);

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
    }));

    this.platform.renderMissionSelect(displayMissions);
    this.platform.loadBackground('mission-select-bg');
  }

  /**
   * Show inventory screen
   */
  async showInventory(): Promise<void> {
    this.currentScreen = 'inventory';

    // Get player's cards
    const cards = this.cardCollection.getAllCards();

    // Convert to display format
    const displayCards: CardDisplay[] = cards.map(card => ({
      id: card.id,
      name: card.name,
      type: 'Bloom' as any, // CardInstance doesn't have type, but all inventory cards are Bloom Beasts
      affinity: card.affinity,
      cost: card.cost,
      level: card.level,
      experience: card.currentXP,
      count: 1, // Each CardInstance is a single card
      baseAttack: card.baseAttack,
      currentAttack: card.currentAttack,
      baseHealth: card.baseHealth,
      currentHealth: card.currentHealth,
      passiveAbility: card.passiveAbility,
      bloomAbility: card.bloomAbility,
    }));

    this.platform.renderInventory(displayCards, this.playerDeck.length, this.playerDeck);
    this.platform.loadBackground('inventory-bg');
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
   * Get player's deck cards for battle
   */
  private getPlayerDeckCards(): BloomBeastCard[] {
    const deckCards: BloomBeastCard[] = [];

    // Convert card IDs to actual card objects
    for (const cardId of this.playerDeck) {
      const cardInstance = this.cardCollection.getCard(cardId);

      if (cardInstance) {
        // Convert CardInstance to BloomBeastCard format for battle
        const bloomCard: any = {
          id: cardInstance.cardId,
          instanceId: cardInstance.id, // Used for unique identification in battle
          name: cardInstance.name,
          type: 'Bloom',
          affinity: cardInstance.affinity,
          cost: cardInstance.cost,
          baseAttack: cardInstance.baseAttack,
          baseHealth: cardInstance.baseHealth,
          passiveAbility: cardInstance.passiveAbility,
          bloomAbility: cardInstance.bloomAbility,
          levelingConfig: {} as any, // Not used in battle
        };

        deckCards.push(bloomCard as BloomBeastCard);
      }
    }

    return deckCards;
  }

  /**
   * Handle mission selection
   */
  private async handleMissionSelect(missionId: string): Promise<void> {
    console.log(`Mission selected: ${missionId}`);

    // Check if player has a deck with at least some cards
    if (this.playerDeck.length === 0) {
      await this.platform.showDialog(
        'No Cards in Deck',
        'You need to add cards to your deck before starting a mission.',
        ['OK']
      );
      await this.showInventory();
      return;
    }

    // Get player's deck cards
    const playerDeckCards = this.getPlayerDeckCards();

    if (playerDeckCards.length === 0) {
      await this.platform.showDialog(
        'Deck Error',
        'Failed to load your deck cards. Please check your inventory.',
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

        this.currentScreen = 'battle';
        this.currentBattleId = missionId;
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
   * Handle card selection in inventory
   */
  private async handleCardSelect(cardId: string): Promise<void> {
    const cardEntry = this.cardCollection.getCard(cardId);

    if (cardEntry) {
      // Create simple card details display
      const details = [
        `Name: ${cardEntry.name}`,
        `Affinity: ${cardEntry.affinity}`,
        `Level: ${cardEntry.level}`,
        `XP: ${cardEntry.currentXP}`,
        `Attack: ${cardEntry.currentAttack}`,
        `Health: ${cardEntry.currentHealth}`,
      ];
      if (cardEntry.passiveAbility) {
        details.push(`Passive: ${cardEntry.passiveAbility.name}`);
      }
      if (cardEntry.bloomAbility) {
        details.push(`Bloom: ${cardEntry.bloomAbility.name}`);
      }

      // Check if card is in deck
      const isInDeck = this.playerDeck.includes(cardId);
      const buttons = isInDeck ? ['Remove from Deck', 'Close'] : ['Add to Deck', 'Close'];

      const result = await this.platform.showDialog('Card Details', details.join('\n'), buttons);

      if (result === 'Add to Deck') {
        await this.addCardToDeck(cardId);
      } else if (result === 'Remove from Deck') {
        await this.removeCardFromDeck(cardId);
      }
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
      await this.platform.showDialog('Card Added', 'Card added to your deck!', ['OK']);
      // Refresh inventory to update deck size display
      await this.showInventory();
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
      await this.platform.showDialog('Card Removed', 'Card removed from your deck.', ['OK']);
      // Refresh inventory to update deck size display
      await this.showInventory();
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
  private async updateBattleDisplay(): Promise<void> {
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
      opponentHealth: opponent.health,
      opponentMaxHealth: opponent.maxHealth || 30, // Default to 30 if undefined
      opponentDeckCount: opponent.deck.length,
      opponentNectar: opponent.currentNectar,
      playerField: player.field,
      opponentField: opponent.field,
      currentTurn: battleState.gameState.turn,
      turnPlayer: battleState.gameState.activePlayer === 0 ? 'player' : 'opponent',
      turnTimeRemaining: 60, // TODO: Implement actual timer
      objectives: this.getObjectiveDisplay(battleState),
    };

    this.platform.renderBattle(display);

    // Check if battle ended
    if (battleState.isComplete) {
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
   * Handle battle actions
   */
  private async handleBattleAction(action: string): Promise<void> {
    // Process action through battle UI
    await this.battleUI.processPlayerAction(action, {});

    // Update display
    await this.updateBattleDisplay();
  }

  /**
   * Handle end turn
   */
  private async handleEndTurn(): Promise<void> {
    await this.battleUI.processPlayerAction('end-turn', {});
    await this.updateBattleDisplay();
  }

  /**
   * Handle battle completion
   */
  private async handleBattleComplete(battleState: any): Promise<void> {
    if (battleState.rewards) {
      // Apply rewards
      this.playerData.totalXP += battleState.rewards.xpGained;
      this.playerData.nectar += battleState.rewards.nectarGained;

      // Add cards to collection
      battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
        // Convert card rewards to CardInstance for collection
        if (card.type === 'Bloom') {
          const beastCard = card as BloomBeastCard;
          const cardInstance: CardInstance = {
            id: `${beastCard.id}-reward-${Date.now()}-${index}`,
            cardId: beastCard.id,
            name: beastCard.name,
            affinity: beastCard.affinity,
            cost: beastCard.cost,
            level: 1,
            currentXP: 0,
            baseAttack: beastCard.baseAttack,
            currentAttack: beastCard.baseAttack,
            baseHealth: beastCard.baseHealth,
            currentHealth: beastCard.baseHealth,
            passiveAbility: beastCard.passiveAbility,
            bloomAbility: beastCard.bloomAbility,
          };
          this.cardCollection.addCard(cardInstance);
        }
      });

      // Update mission completion
      if (this.currentBattleId) {
        if (!this.playerData.completedMissions[this.currentBattleId]) {
          this.playerData.completedMissions[this.currentBattleId] = 0;
        }
        this.playerData.completedMissions[this.currentBattleId]++;
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

      this.platform.showRewards(rewardDisplay);
      this.platform.playSound('victory');

      // Save game data
      await this.saveGameData();
    } else {
      // Mission failed
      await this.platform.showDialog(
        'Mission Failed',
        'Better luck next time!',
        ['OK']
      );
      this.platform.playSound('defeat');
    }

    // Clear battle
    this.battleUI.clearBattle();
    this.currentBattleId = null;

    // Return to mission select
    await this.showMissionSelect();
  }

  /**
   * Handle back button
   */
  private async handleBackButton(): Promise<void> {
    switch (this.currentScreen) {
      case 'missions':
      case 'inventory':
      case 'deck-builder':
        await this.showStartMenu();
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
    const starterDeck = buildForestDeck();

    starterDeck.cards.forEach((card, index) => {
      // Only process BloomBeastCard type cards for the collection
      if (card.type === 'Bloom') {
        const beastCard = card as BloomBeastCard;
        const cardInstance: CardInstance = {
          id: `${beastCard.id}-${Date.now()}-${index}`,
          cardId: beastCard.id,
          name: beastCard.name,
          affinity: beastCard.affinity,
          cost: beastCard.cost,
          level: 1,
          currentXP: 0,
          baseAttack: beastCard.baseAttack,
          currentAttack: beastCard.baseAttack,
          baseHealth: beastCard.baseHealth,
          currentHealth: beastCard.baseHealth,
          passiveAbility: beastCard.passiveAbility,
          bloomAbility: beastCard.bloomAbility,
        };
        this.cardCollection.addCard(cardInstance);
        // Add to player's deck (up to 30 cards)
        if (this.playerDeck.length < 30) {
          this.playerDeck.push(cardInstance.id);
        }
      }
    });

    this.playerData.cardInventory = this.cardCollection.getAllCards();

    await this.saveGameData();
  }

  /**
   * Save game data
   */
  private async saveGameData(): Promise<void> {
    await this.platform.saveData('bloom-beasts-save', {
      playerData: this.playerData,
      collection: this.cardCollection.getAllCards(),
      playerDeck: this.playerDeck,
      missions: {
        completed: this.playerData.completedMissions,
        unlocked: this.playerData.unlockedMissions,
      },
    });
  }

  /**
   * Load game data
   */
  private async loadGameData(): Promise<void> {
    const savedData = await this.platform.loadData('bloom-beasts-save');

    if (savedData) {
      this.playerData = savedData.playerData || this.playerData;

      // Load collection
      if (savedData.collection) {
        savedData.collection.forEach((cardInstance: CardInstance) => {
          this.cardCollection.addCard(cardInstance);
        });
      }

      // Load player deck
      if (savedData.playerDeck) {
        this.playerDeck = savedData.playerDeck;
      }

      // Update player level based on XP
      this.updatePlayerLevel();
    }
  }

  /**
   * Update player level based on XP
   */
  private updatePlayerLevel(): void {
    const xpThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

    for (let level = 9; level >= 1; level--) {
      if (this.playerData.totalXP >= xpThresholds[level - 1]) {
        this.playerData.playerLevel = level;
        break;
      }
    }
  }
}

/**
 * Player data interface
 */
interface PlayerData {
  playerName: string;
  playerLevel: number;
  totalXP: number;
  nectar: number;
  unlockedMissions: string[];
  completedMissions: Record<string, number>;
  cardInventory: any[];
  decks: any[];
}