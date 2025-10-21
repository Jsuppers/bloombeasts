/**
 * SaveLoadManager - Handles game data persistence
 * Manages saving and loading player data, including cards, missions, and progress
 */

import { CardCollection } from '../screens/cards/CardCollection';
import { CardInstance } from '../screens/cards/types';
import { MissionManager } from '../screens/missions/MissionManager';

export interface PlayerItem {
  itemId: string;
  quantity: number;
}

export interface PlayerData {
  name: string;
  level: number;
  totalXP: number;
  cards: {
    collected: any[];
    deck: string[];
  };
  missions: {
    completedMissions: { [missionId: string]: number };
  };
  items: PlayerItem[];
}

interface PlatformStorage {
  saveData(key: string, data: any): Promise<void>;
  loadData(key: string): Promise<any>;
}

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

export class SaveLoadManager {
  private platform: PlatformStorage;
  private playerData: PlayerData;

  constructor(platform: PlatformStorage) {
    this.platform = platform;

    // Initialize default player data
    this.playerData = {
      name: 'Player',
      level: 1,
      totalXP: 0,
      cards: {
        collected: [],
        deck: []
      },
      missions: {
        completedMissions: {}
      },
      items: []
    };
  }

  /**
   * Get player data
   */
  getPlayerData(): PlayerData {
    return this.playerData;
  }

  /**
   * Set player data (used for updating from other systems)
   */
  setPlayerData(data: PlayerData): void {
    this.playerData = data;
  }

  /**
   * Save game data
   */
  async saveGameData(cardCollection: CardCollection, playerDeck: string[]): Promise<void> {
    // Update cards in playerData before saving
    this.playerData.cards.collected = cardCollection.getAllCards();
    this.playerData.cards.deck = playerDeck;

    await this.platform.saveData('bloom-beasts-save', {
      playerData: this.playerData,
    });
  }

  /**
   * Load game data
   */
  async loadGameData(
    cardCollection: CardCollection,
    missionManager: MissionManager
  ): Promise<string[]> {
    const savedData = await this.platform.loadData('bloom-beasts-save');
    let playerDeck: string[] = [];

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

        // Ensure localState exists (for Horizon deployment - UI navigation state)
        if (!(this.playerData as any).localState) {
          (this.playerData as any).localState = {
            currentScreen: 'menu',
            volume: 80,
            sfxVolume: 80,
            cardsPageOffset: 0
          };
        }

        // Load cards into collection
        if (data.cards.collected) {
          data.cards.collected.forEach((cardInstance: CardInstance) => {
            cardCollection.addCard(cardInstance);
          });
        }

        // Load deck
        playerDeck = data.cards.deck || [];
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
            cardCollection.addCard(cardInstance);
          });
        } else if (data.cardInventory) {
          data.cardInventory.forEach((cardInstance: CardInstance) => {
            cardCollection.addCard(cardInstance);
          });
        }

        // Load old deck format
        if (savedData.playerDeck) {
          playerDeck = savedData.playerDeck;
        }

        // Save in new format
        await this.saveGameData(cardCollection, playerDeck);
      }

      // Update player level based on XP
      this.updatePlayerLevel();

      // Load completed missions into MissionManager
      if (this.playerData.missions.completedMissions) {
        missionManager.loadCompletedMissions(this.playerData.missions.completedMissions);
      }
    }

    return playerDeck;
  }

  /**
   * Update player level based on XP
   * Player leveling uses steep exponential scaling
   */
  updatePlayerLevel(): void {
    for (let level = 9; level >= 1; level--) {
      if (this.playerData.totalXP >= XP_THRESHOLDS[level - 1]) {
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
    const currentLevel = this.playerData.level;
    const totalXP = this.playerData.totalXP;

    // Calculate XP within current level
    const xpForCurrentLevel = XP_THRESHOLDS[currentLevel - 1];
    const xpForNextLevel = currentLevel < 9 ? XP_THRESHOLDS[currentLevel] : XP_THRESHOLDS[8];
    const currentXP = totalXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;

    return {
      name: this.playerData.name,
      level: currentLevel,
      currentXP: currentXP,
      xpForNextLevel: xpNeeded,
    };
  }

  /**
   * Add XP to player
   */
  addXP(amount: number): void {
    this.playerData.totalXP += amount;
    this.updatePlayerLevel();
  }

  /**
   * Get the quantity of a specific item from player's items array
   */
  getItemQuantity(itemId: string): number {
    const item = this.playerData.items.find(i => i.itemId === itemId);
    return item ? item.quantity : 0;
  }

  /**
   * Track mission completion
   */
  trackMissionCompletion(missionId: string): void {
    const currentCount = this.playerData.missions.completedMissions[missionId] || 0;
    this.playerData.missions.completedMissions[missionId] = currentCount + 1;
  }

  /**
   * Add items to player's inventory
   */
  addItems(itemId: string, quantity: number): void {
    const existingItem = this.playerData.items.find(i => i.itemId === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.playerData.items.push({
        itemId,
        quantity,
      });
    }
  }
}
