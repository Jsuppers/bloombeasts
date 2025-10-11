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
import { LevelingSystem } from './engine/systems/LevelingSystem';
import {
  buildFireDeck,
  buildWaterDeck,
  buildForestDeck,
  buildSkyDeck,
  DeckList
} from './engine/utils/deckBuilder';
import { BloomBeastCard, AnyCard } from './engine/types/core';
import { Mission } from './screens/missions/types';
import { getAllCards } from './engine/cards';

export interface MenuStats {
  totalCards: number;
  missionsCompleted: number;
  totalMissions: number;
  nectar: number;
  playerLevel: number;
  totalXP: number;
}

/**
 * Platform callbacks interface - implement these for your specific platform
 */
export interface PlatformCallbacks {
  // UI Rendering
  renderStartMenu(options: string[], stats: MenuStats): void;
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
  experienceRequired?: number;
  count: number;
  baseAttack?: number;
  currentAttack?: number;
  baseHealth?: number;
  currentHealth?: number;
  ability?: { name: string; description: string; };
}

export interface BattleDisplay {
  playerHealth: number;
  playerMaxHealth: number;
  playerDeckCount: number;
  playerNectar: number;
  playerHand: any[];
  playerTrapZone: any[]; // Player's trap cards (face-down)
  opponentHealth: number;
  opponentMaxHealth: number;
  opponentDeckCount: number;
  opponentNectar: number;
  opponentField: any[];
  opponentTrapZone: any[]; // Opponent's trap cards (face-down)
  playerField: any[];
  currentTurn: number;
  turnPlayer: string;
  turnTimeRemaining: number;
  objectives: ObjectiveDisplay[];
  habitatZone: any | null; // Current habitat card
  selectedBeastIndex: number | null; // Track selected beast for attacking
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
  private selectedBeastIndex: number | null = null; // Track selected beast in battle

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

    // Gather game stats for menu display
    const totalCards = this.cardCollection.getAllCards().length;
    const completedMissionIds = Object.keys(this.playerData.completedMissions);
    const missionsCompleted = completedMissionIds.length;

    // Get total available missions
    this.missionUI.setPlayerLevel(this.playerData.playerLevel);
    const totalMissions = this.missionUI.getMissionList().length;

    const stats: MenuStats = {
      totalCards,
      missionsCompleted,
      totalMissions,
      nectar: this.playerData.nectar,
      playerLevel: this.playerData.playerLevel,
      totalXP: this.playerData.totalXP,
    };

    this.platform.renderStartMenu(menuOptions, stats);
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
    const displayCards: CardDisplay[] = cards.map(card => {
      // Calculate experience requirements for all card types
      let expRequired = 0;
      if (card.type === 'Bloom' && card.level) {
        // For Bloom beasts, use the LevelingSystem
        const allCardDefs = getAllCards();
        const cardDef = allCardDefs.find((c: any) => c && c.id === card.cardId) as BloomBeastCard | undefined;
        expRequired = LevelingSystem.getXPRequirement(card.level as any, cardDef) || 0;
      } else if (card.level) {
        // For Magic/Trap/Habitat cards, use simple formula (level * 100)
        expRequired = card.level * 100;
      }

      // Build display card
      const displayCard: CardDisplay = {
        id: card.id,
        name: card.name,
        type: card.type,
        affinity: card.affinity,
        cost: card.cost,
        level: card.level, // All cards have levels now
        experience: card.currentXP || 0,
        experienceRequired: expRequired,
        count: 1, // Each CardInstance is a single card
      };

      // Add Bloom-specific fields if available
      if (card.type === 'Bloom') {
        displayCard.baseAttack = card.baseAttack;
        displayCard.currentAttack = card.currentAttack;
        displayCard.baseHealth = card.baseHealth;
        displayCard.currentHealth = card.currentHealth;
        displayCard.ability = card.ability;
      } else {
        // For Magic/Trap/Habitat cards, show effects as ability description
        if (card.effects && card.effects.length > 0) {
          displayCard.ability = {
            name: card.type + ' Card',
            description: card.effects.join('. ')
          };
        }
      }

      return displayCard;
    });

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
   * Get abilities for a card based on its level
   */
  private getAbilitiesForLevel(cardInstance: CardInstance): { ability: any } {
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
      const details: string[] = [
        `Name: ${cardEntry.name}`,
        `Type: ${cardEntry.type}`,
      ];

      // Add affinity if present
      if (cardEntry.affinity) {
        details.push(`Affinity: ${cardEntry.affinity}`);
      }

      // Add cost
      details.push(`Cost: ${cardEntry.cost}`);

      // Add level and XP for all card types
      details.push(`Level: ${cardEntry.level}`);
      details.push(`XP: ${cardEntry.currentXP || 0}`);

      // Add Bloom-specific details
      if (cardEntry.type === 'Bloom') {
        if (cardEntry.currentAttack !== undefined) {
          details.push(`Attack: ${cardEntry.currentAttack}`);
        }
        if (cardEntry.currentHealth !== undefined) {
          details.push(`Health: ${cardEntry.currentHealth}`);
        }
      }

      // Add abilities/effects
      if (cardEntry.ability) {
        details.push(`Ability: ${cardEntry.ability.name}`);
        details.push(`  ${cardEntry.ability.description}`);
      } else if (cardEntry.effects && cardEntry.effects.length > 0) {
        details.push('Effects:');
        cardEntry.effects.forEach(effect => {
          details.push(`  • ${effect}`);
        });
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
   * Enrich field beasts with card definition data for display
   */
  private enrichFieldBeasts(field: any[]): any[] {
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

      // Merge instance data with card definition data
      // Only add abilities if they're not already present
      return {
        ...beast,
        name: beast.name || cardDef.name,
        affinity: beast.affinity || cardDef.affinity,
        cost: beast.cost || cardDef.cost,
        ability: beast.ability || cardDef.ability,
      };
    });
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
      playerTrapZone: player.trapZone || [null, null, null],
      opponentHealth: opponent.health,
      opponentMaxHealth: opponent.maxHealth || 30, // Default to 30 if undefined
      opponentDeckCount: opponent.deck.length,
      opponentNectar: opponent.currentNectar,
      opponentField: this.enrichFieldBeasts(opponent.field),
      opponentTrapZone: opponent.trapZone || [null, null, null],
      playerField: this.enrichFieldBeasts(player.field),
      currentTurn: battleState.gameState.turn,
      turnPlayer: battleState.gameState.activePlayer === 0 ? 'player' : 'opponent',
      turnTimeRemaining: 60, // TODO: Implement actual timer
      objectives: this.getObjectiveDisplay(battleState),
      habitatZone: battleState.gameState.habitatZone,
      selectedBeastIndex: this.selectedBeastIndex,
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

    // Format card details
    const details = [
      `Name: ${card.name}`,
      `Cost: ${card.cost}`,
    ];

    // Type guard for Bloom Beast cards
    const isBloomCard = (card as any).type === 'Bloom' || (card as any).affinity !== undefined;

    if (isBloomCard) {
      details.push(`Affinity: ${(card as any).affinity}`);
      details.push(`Attack: ${(card as any).baseAttack || 0}`);
      details.push(`Health: ${(card as any).baseHealth || 0}`);
    }

    if ((card as any).ability) {
      const ability = (card as any).ability as any;
      details.push(`Ability: ${ability.name}`);

      // Show trigger type
      const trigger = ability.trigger || 'Passive';
      if (trigger === 'Activated') {
        // Show cost if it exists
        if (ability.cost) {
          if (ability.cost.type === 'nectar') {
            details.push(`  Cost: ${ability.cost.value || 1} Nectar`);
          } else if (ability.cost.type === 'discard') {
            details.push(`  Cost: Discard ${ability.cost.value || 1} card(s)`);
          } else if (ability.cost.type === 'remove-counter') {
            details.push(`  Cost: Remove ${ability.cost.value || 1} ${ability.cost.counter} counter(s)`);
          }
        } else {
          details.push(`  Cost: Free`);
        }
      } else {
        details.push(`  Trigger: ${trigger}`);
      }

      details.push(`  ${ability.description}`);
    }

    // Check if card is affordable
    const canAfford = card.cost <= player.currentNectar;
    const buttons = canAfford ? ['Play to Battle', 'Close'] : ['Close'];

    const result = await this.platform.showDialog('Card Details', details.join('\n'), buttons);

    if (result === 'Play to Battle' && canAfford) {
      // Play the card
      await this.handleBattleAction(`play-card-${index}`);
    }
  }

  /**
   * Handle viewing a card on the battle field
   */
  private async handleViewFieldCard(player: string, index: number): Promise<void> {
    const battleState = this.battleUI.getCurrentBattle();
    if (!battleState || !battleState.gameState) return;

    const playerObj = player === 'player' ? battleState.gameState.players[0] : battleState.gameState.players[1];

    // Debug: Check raw field data
    console.log('Raw field beast:', playerObj.field[index]);

    const field = player === 'player' ? this.enrichFieldBeasts(playerObj.field) : this.enrichFieldBeasts(playerObj.field);
    const beast = field[index];

    // Debug: Check enriched data
    console.log('Enriched beast:', beast);

    if (!beast) return;

    // Format card details
    const details = [
      `Name: ${beast.name}`,
      `Affinity: ${beast.affinity}`,
      `Level: ${beast.currentLevel || 1}`,
      `Attack: ${beast.currentAttack}`,
      `Health: ${beast.currentHealth}/${beast.maxHealth}`,
    ];

    if (beast.ability) {
      const ability = beast.ability as any;
      details.push(`Ability: ${ability.name}`);

      // Show trigger type
      const trigger = ability.trigger || 'Passive';
      if (trigger === 'Activated') {
        // Show cost if it exists
        if (ability.cost) {
          if (ability.cost.type === 'nectar') {
            details.push(`  Cost: ${ability.cost.value || 1} Nectar`);
          } else if (ability.cost.type === 'discard') {
            details.push(`  Cost: Discard ${ability.cost.value || 1} card(s)`);
          } else if (ability.cost.type === 'remove-counter') {
            details.push(`  Cost: Remove ${ability.cost.value || 1} ${ability.cost.counter} counter(s)`);
          }
        } else {
          details.push(`  Cost: Free`);
        }
      } else {
        details.push(`  Trigger: ${trigger}`);
      }

      details.push(`  ${ability.description}`);
    }

    // Show summoning sickness if applicable
    if (beast.summoningSickness) {
      details.push('Status: Summoning Sickness');
    }

    // Different buttons based on which player's card it is
    let buttons: string[] = ['Close'];
    let canUseAbility = false;

    if (player === 'player') {
      // Player's own beast - can select for attacking or use ability
      const isPlayerTurn = battleState.gameState.activePlayer === 0;
      const hasAbility = beast.ability !== undefined;

      if (isPlayerTurn && !beast.summoningSickness) {
        buttons = ['Select'];

        // Add ability button only for ACTIVATED abilities
        if (hasAbility) {
          const ability = beast.ability as any;
          const trigger = ability.trigger || 'Passive';

          // Only show Use Ability for Activated abilities
          if (trigger === 'Activated') {
            const player = battleState.gameState.players[0];
            canUseAbility = true;

            if (ability.cost) {
              if (ability.cost.type === 'nectar') {
                const required = ability.cost.value || 1;
                canUseAbility = player.currentNectar >= required;
                // Add affordability info to details
                if (!canUseAbility) {
                  details.push(`  [Need ${required} nectar, have ${player.currentNectar}]`);
                }
              } else if (ability.cost.type === 'discard') {
                const required = ability.cost.value || 1;
                canUseAbility = player.hand.length >= required;
                // Add affordability info to details
                if (!canUseAbility) {
                  details.push(`  [Need ${required} card(s) in hand, have ${player.hand.length}]`);
                }
              } else if (ability.cost.type === 'remove-counter') {
                // Check habitat zone for counters
                const habitat = battleState.gameState.habitatZone;
                const required = ability.cost.value || 1;
                const counterType = ability.cost.counter;

                // TODO: Check actual counter amounts on habitat
                // For now, assume can't afford if no habitat
                canUseAbility = habitat !== null;
                if (!canUseAbility) {
                  details.push(`  [Need ${required} ${counterType} counter(s) on habitat]`);
                }
              }
            }

            // Always show the button, but indicate if it can't be used
            if (canUseAbility) {
              buttons.push('Use Ability');
            } else {
              buttons.push('Use Ability (Can\'t Afford)');
            }
          }
        }
        buttons.push('Close');
      } else {
        buttons = ['Close'];
      }
    } else {
      // Opponent's beast - check if we have a selected beast
      if (this.selectedBeastIndex !== null) {
        buttons = ['Attack', 'Close'];
      }
    }

    const result = await this.platform.showDialog('Card Details', details.join('\n'), buttons);

    if (result === 'Select') {
      // Select this beast for attacking
      this.selectedBeastIndex = index;
      await this.updateBattleDisplay(); // Refresh to show selection
    } else if (result === 'Attack') {
      // Attack this opponent beast with selected beast
      if (this.selectedBeastIndex !== null) {
        await this.handleBattleAction(`attack-beast-${this.selectedBeastIndex}-${index}`);
        this.selectedBeastIndex = null; // Clear selection after attack
      }
    } else if (result === 'Use Ability' && canUseAbility) {
      // Activate ability (only if affordable)
      await this.handleBattleAction(`use-ability-${index}`);
    } else if (result === 'Use Ability (Can\'t Afford)') {
      // Show message explaining why they can't use it
      await this.platform.showDialog('Cannot Use Ability', 'You do not have enough resources to use this ability.', ['OK']);
      // Re-show the card details
      await this.handleViewFieldCard(player, index);
    }
  }

  /**
   * Handle battle actions
   */
  private async handleBattleAction(action: string): Promise<void> {
    // Clear selection after attack actions
    if (action.startsWith('attack-')) {
      this.selectedBeastIndex = null;
    }

    // Process action through battle UI
    await this.battleUI.processPlayerAction(action, {});

    // Update display
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
   * Handle battle completion
   */
  private async handleBattleComplete(battleState: any): Promise<void> {
    if (battleState.rewards) {
      // Apply rewards
      this.playerData.totalXP += battleState.rewards.xpGained;
      this.playerData.nectar += battleState.rewards.nectarGained;

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
    this.selectedBeastIndex = null; // Clear selection

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
          this.selectedBeastIndex = null; // Clear selection
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

    this.playerData.cardInventory = this.cardCollection.getAllCards();

    await this.saveGameData();
  }

  /**
   * Get simplified effect descriptions for Magic/Trap/Habitat cards
   */
  private getEffectDescriptions(card: any): string[] {
    const descriptions: string[] = [];

    if (card.type === 'Magic' && card.effects) {
      card.effects.forEach((effect: any) => {
        if (effect.type === 'draw-cards') {
          descriptions.push(`Draw ${effect.value || 1} card(s)`);
        } else if (effect.type === 'heal') {
          descriptions.push(`Heal ${effect.value || 0}`);
        } else if (effect.type === 'modify-stats') {
          descriptions.push(`Modify stats by ${effect.attack || 0}/${effect.health || 0}`);
        } else if (effect.type === 'gain-nectar') {
          descriptions.push(`Gain ${effect.value || 1} nectar`);
        } else {
          descriptions.push(effect.description || 'Special effect');
        }
      });
    } else if (card.type === 'Trap' && card.effects) {
      card.effects.forEach((effect: any) => {
        descriptions.push(effect.description || 'Trap effect');
      });
    } else if (card.type === 'Habitat') {
      if (card.onPlayEffects) {
        descriptions.push('On Play: Special effects');
      }
      if (card.ongoingEffects) {
        descriptions.push('Ongoing: Field effects');
      }
    }

    return descriptions.length > 0 ? descriptions : ['Special card'];
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