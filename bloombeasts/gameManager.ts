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
  DeckList,
  getStarterDeck
} from './engine/utils/deckBuilder';
import { BloomBeastCard, AnyCard } from './engine/types/core';
import { Mission } from './screens/missions/types';
import { getAllCards } from './engine/cards';
import { SoundManager, SoundSettings } from './systems/SoundManager';

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
  renderSettings(settings: SoundSettings): void;

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
  setInventorySfxCallback?(callback: (src: string) => void): void;

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
  description?: string; // Description for Magic/Trap/Habitat/Buff cards
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

export type GameScreen = 'start-menu' | 'missions' | 'inventory' | 'battle' | 'deck-builder' | 'settings';

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

    // Initialize sound manager
    this.soundManager = new SoundManager({
      playMusic: (src, loop, volume) => this.platform.playMusic(src, loop, volume),
      stopMusic: () => this.platform.stopMusic(),
      playSfx: (src, volume) => this.platform.playSfx(src, volume),
      setMusicVolume: (volume) => this.platform.setMusicVolume(volume),
      setSfxVolume: (volume) => this.platform.setSfxVolume(volume),
    });

    // Set up SFX callback for inventory screen (if platform supports it)
    if (this.platform.setInventorySfxCallback) {
      this.platform.setInventorySfxCallback((src: string) => this.soundManager.playSfx(src));
    }

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

      case 'btn-inventory':
        await this.showInventory();
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
   * Show the start menu
   */
  async showStartMenu(): Promise<void> {
    this.currentScreen = 'start-menu';

    const menuOptions = [
      'missions',
      'inventory',
      'settings',
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
    // Start playing background music
    this.soundManager.playMusic('BackgroundMusic.mp3', true);
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
      } else if (card.type === 'Trap') {
        // For Trap cards, find the original card definition to get the description
        const allCardDefs = getAllCards();
        const trapDef = allCardDefs.find((c: any) => c && c.id === card.cardId);
        if (trapDef && (trapDef as any).description) {
          displayCard.ability = {
            name: 'Trap Card',
            description: (trapDef as any).description
          };
        } else if (card.effects && card.effects.length > 0) {
          // Fallback to effects if no description found
          displayCard.ability = {
            name: 'Trap Card',
            description: card.effects.join('. ')
          };
        }
      } else if (card.type === 'Magic' || card.type === 'Habitat') {
        // For Magic/Habitat cards, convert effects to readable descriptions
        const effectDescs = this.getEffectDescriptions(card);
        if (effectDescs.length > 0) {
          displayCard.ability = {
            name: card.type + ' Card',
            description: effectDescs.join('. ')
          };
        }
      } else if (card.type === 'Buff') {
        // For Buff cards, find the original card definition to get the description
        const allCardDefs = getAllCards();
        const buffDef = allCardDefs.find((c: any) => c && c.id === card.cardId);
        if (buffDef && (buffDef as any).description) {
          displayCard.description = (buffDef as any).description;
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
   * Show settings screen
   */
  async showSettings(): Promise<void> {
    this.currentScreen = 'settings';
    const settings = this.soundManager.getSettings();
    this.platform.renderSettings(settings);
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
   * Handle card selection in inventory
   */
  private async handleCardSelect(cardId: string): Promise<void> {
    // Play menu button sound
    this.soundManager.playSfx('sfx/menuButtonSelect.wav');

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
   * Calculate stat bonuses for a beast from habitat and buff zones
   */
  private calculateStatBonuses(beast: any, gameState: any): { attackBonus: number; healthBonus: number } {
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

    // Process buff zones for both players (need to determine which player this beast belongs to)
    // For now, we'll process all buff zones since buffs typically only affect their own player
    if (gameState.players) {
      gameState.players.forEach((player: any) => {
        if (player.buffZone && Array.isArray(player.buffZone)) {
          player.buffZone.forEach((buff: any) => {
            if (buff && buff.ongoingEffects) {
              processOngoingEffects(buff.ongoingEffects);
            }
          });
        }
      });
    }

    return { attackBonus, healthBonus };
  }

  /**
   * Enrich field beasts with card definition data and apply bonuses for display
   */
  private enrichFieldBeasts(field: any[], gameState?: any): any[] {
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

      // Calculate stat bonuses from habitat and buffs
      const bonuses = gameState ? this.calculateStatBonuses(beast, gameState) : { attackBonus: 0, healthBonus: 0 };

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
      opponentField: this.enrichFieldBeasts(opponent.field, battleState.gameState),
      opponentTrapZone: opponent.trapZone || [null, null, null],
      opponentBuffZone: opponent.buffZone || [null, null],
      playerField: this.enrichFieldBeasts(player.field, battleState.gameState),
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

    // Handle different card types
    const cardType = (card as any).type;

    if (cardType === 'Bloom') {
      // Beast cards
      details.push(`Type: Beast`);
      details.push(`Affinity: ${(card as any).affinity}`);
      details.push(`Attack: ${(card as any).baseAttack || 0}`);
      details.push(`Health: ${(card as any).baseHealth || 0}`);

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
    } else if (cardType === 'Magic') {
      // Magic cards
      details.push(`Type: Magic`);

      // Try multiple ways to get the description
      let description = (card as any).description;

      // If no description on card instance, look up original card definition
      if (!description && (card as any).id) {
        const allCardDefs = getAllCards();
        const cardDef = allCardDefs.find((c: any) => c && c.id === (card as any).id);
        if (cardDef && (cardDef as any).description) {
          description = (cardDef as any).description;
        }
      }

      if (description) {
        details.push(`Effect: ${description}`);
      } else if ((card as any).effects) {
        // Fallback to parsing effects
        details.push(`Effects:`);
        (card as any).effects.forEach((effect: any) => {
          const effectType = effect.type || '';
          if (effectType === 'draw-cards' || effectType === 'DrawCards') {
            details.push(`  • Draw ${effect.value || 1} card(s)`);
          } else if (effectType === 'heal' || effectType === 'Heal') {
            details.push(`  • Heal ${effect.value || 0}`);
          } else if (effectType === 'deal-damage' || effectType === 'Damage') {
            details.push(`  • Deal ${effect.value || 0} damage`);
          } else if (effectType === 'modify-stats' || effectType === 'ModifyStats') {
            details.push(`  • Modify stats by ${effect.attack || effect.value || 0}/${effect.health || effect.value || 0}`);
          } else if (effectType === 'gain-resource' || effectType === 'GainResource') {
            details.push(`  • Gain ${effect.value || 1} ${effect.resource || 'nectar'}`);
          } else if (effectType === 'remove-counter' || effectType === 'RemoveCounter') {
            details.push(`  • Remove ${effect.counter || 'all'} counters`);
          } else if (effectType === 'destroy' || effectType === 'Destroy') {
            details.push(`  • Destroy target`);
          } else {
            const typeStr = effectType.toString().replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').trim();
            details.push(`  • ${typeStr}`);
          }
        });
      }
    } else if (cardType === 'Trap') {
      // Trap cards
      details.push(`Type: Trap`);
      if ((card as any).description) {
        details.push(`Effect: ${(card as any).description}`);
      } else if ((card as any).effects) {
        details.push(`Effects:`);
        (card as any).effects.forEach((effect: any) => {
          if (effect.type === 'NullifyEffect') {
            details.push(`  • Counter and negate effect`);
          } else if (effect.type === 'Damage') {
            details.push(`  • Deal ${effect.value || 0} damage`);
          } else {
            const typeStr = (effect.type || '').toString().replace(/([A-Z])/g, ' $1').trim();
            details.push(`  • ${typeStr}`);
          }
        });
      }
    } else if (cardType === 'Habitat') {
      // Habitat cards
      details.push(`Type: Habitat`);
      if ((card as any).affinity) {
        details.push(`Affinity: ${(card as any).affinity}`);
      }
      details.push(`Effect: Transforms the battlefield`);
      if ((card as any).onPlayEffects) {
        details.push(`  • On Play: Field transformation`);
      }
      if ((card as any).ongoingEffects) {
        details.push(`  • Ongoing: Field bonuses`);
      }
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

    const field = player === 'player' ? this.enrichFieldBeasts(playerObj.field, battleState.gameState) : this.enrichFieldBeasts(playerObj.field, battleState.gameState);
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
   * Handle viewing a trap card in the trap zone
   */
  private async handleViewTrapCard(player: string, index: number): Promise<void> {
    const battleState = this.battleUI.getCurrentBattle();
    if (!battleState || !battleState.gameState) return;

    const playerObj = player === 'player' ? battleState.gameState.players[0] : battleState.gameState.players[1];
    const trapZone = playerObj.trapZone || [];

    // Check if trap exists at this index
    if (index < 0 || index >= trapZone.length || !trapZone[index]) {
      return;
    }

    const trapCard: any = trapZone[index];

    // Format trap card details
    const details = [
      `Name: ${trapCard.name}`,
      `Type: Trap`,
      `Cost: ${trapCard.cost || 0}`,
    ];

    // Add trap description
    if (trapCard.description) {
      details.push(`Effect: ${trapCard.description}`);
    } else if (trapCard.effects && Array.isArray(trapCard.effects)) {
      details.push('Effects:');
      trapCard.effects.forEach((effect: any) => {
        if (typeof effect === 'string') {
          details.push(`  • ${effect}`);
        } else if (effect.type) {
          if (effect.type === 'NullifyEffect' || effect.type === 'nullify-effect') {
            details.push(`  • Counter and negate effect`);
          } else if (effect.type === 'Damage' || effect.type === 'damage') {
            details.push(`  • Deal ${effect.value || 0} damage`);
          } else {
            const typeStr = (effect.type || '').toString().replace(/([A-Z])/g, ' $1').trim();
            details.push(`  • ${typeStr}`);
          }
        }
      });
    }

    // Only show Close button (traps are face-down, no actions available)
    await this.platform.showDialog('Trap Card', details.join('\n'), ['Close']);
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

    // Format habitat card details
    const details = [
      `Name: ${habitatCard.name}`,
      `Type: Habitat`,
      `Cost: ${habitatCard.cost || 0}`,
    ];

    // Add affinity if present
    if (habitatCard.affinity) {
      details.push(`Affinity: ${habitatCard.affinity}`);
    }

    // Add habitat description if available
    if (habitatCard.description) {
      details.push(`Effect: ${habitatCard.description}`);
    } else {
      // Try to get description from card definition
      const allCardDefs = getAllCards();
      const habitatDef = allCardDefs.find((c: any) => c && c.id === habitatCard.id);
      if (habitatDef && (habitatDef as any).description) {
        details.push(`Effect: ${(habitatDef as any).description}`);
      } else {
        // Fallback to effect descriptions
        if (habitatCard.onPlayEffects && Array.isArray(habitatCard.onPlayEffects)) {
          details.push('On Play Effects:');
          habitatCard.onPlayEffects.forEach((effect: any) => {
            if (typeof effect === 'string') {
              details.push(`  • ${effect}`);
            } else if (effect.type) {
              const typeStr = (effect.type || '').toString().replace(/([A-Z])/g, ' $1').trim();
              details.push(`  • ${typeStr}`);
            }
          });
        }
        if (habitatCard.ongoingEffects && Array.isArray(habitatCard.ongoingEffects)) {
          details.push('Ongoing Effects:');
          habitatCard.ongoingEffects.forEach((effect: any) => {
            if (typeof effect === 'string') {
              details.push(`  • ${effect}`);
            } else if (effect.type) {
              const typeStr = (effect.type || '').toString().replace(/([A-Z])/g, ' $1').trim();
              details.push(`  • ${typeStr}`);
            }
          });
        }
      }
    }

    // Only show Close button (habitat cards are informational only once played)
    await this.platform.showDialog('Habitat Card', details.join('\n'), ['Close']);
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

    // Format buff card details
    const details = [
      `Name: ${buffCard.name}`,
      `Type: Buff`,
      `Cost: ${buffCard.cost || 0}`,
    ];

    // Add buff description if available
    if (buffCard.description) {
      details.push(`Effect: ${buffCard.description}`);
    } else {
      // Try to get description from card definition
      const allCardDefs = getAllCards();
      const buffDef = allCardDefs.find((c: any) => c && c.id === buffCard.id);
      if (buffDef && (buffDef as any).description) {
        details.push(`Effect: ${(buffDef as any).description}`);
      } else {
        // Fallback to effect descriptions
        if (buffCard.ongoingEffects && Array.isArray(buffCard.ongoingEffects)) {
          details.push('Ongoing Effects:');
          buffCard.ongoingEffects.forEach((effect: any) => {
            if (typeof effect === 'string') {
              details.push(`  • ${effect}`);
            } else if (effect.type) {
              const typeStr = (effect.type || '').toString().replace(/([A-Z])/g, ' $1').trim();
              details.push(`  • ${typeStr}`);
            }
          });
        }
      }
    }

    // Only show Close button (buff cards are informational only once played)
    await this.platform.showDialog('Buff Card', details.join('\n'), ['Close']);
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
      opponentField: this.enrichFieldBeasts(opponent.field, battleState.gameState),
      opponentTrapZone: opponent.trapZone || [null, null, null],
      opponentBuffZone: opponent.buffZone || [null, null],
      playerField: this.enrichFieldBeasts(playerObj.field, battleState.gameState),
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
   */
  private awardDeckExperience(xpAmount: number = 10): void {
    const allCardDefs = getAllCards();

    // Award XP to each card in the deck
    for (const cardId of this.playerDeck) {
      const cardInstance = this.cardCollection.getCard(cardId);

      if (!cardInstance) continue;

      // Add XP
      cardInstance.currentXP = (cardInstance.currentXP || 0) + xpAmount;

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
        // For Magic/Trap/Habitat/Buff cards, use simple leveling (level * 100 XP required)
        let currentLevel = cardInstance.level || 1;
        let currentXP = cardInstance.currentXP;

        // Keep leveling up while possible
        while (currentLevel < 9) {
          const xpRequired = currentLevel * 100;

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
      // Apply rewards
      this.playerData.totalXP += battleState.rewards.xpGained;
      this.playerData.nectar += battleState.rewards.nectarGained;

      // Award experience to all cards in the player's deck
      this.awardDeckExperience(10); // Award 10 XP per victory

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
      case 'inventory':
      case 'deck-builder':
      case 'settings':
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

    this.playerData.cardInventory = this.cardCollection.getAllCards();

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
        // Already handled in showInventory, but include here for completeness
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