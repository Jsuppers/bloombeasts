/**
 * GameStateManager - Manages player data mutations and game state
 * Extracted from BloomBeastsGame to separate concerns
 */

import type { PlayerData, PlayerItem } from '../types';
import type { CardInstance } from '../screens/common/types';
import { getPlayerLevel, GAME_CONSTANTS } from './GameConstants';
import { Logger } from '../common/engine/utils/Logger';
import { getStarterDeck } from '../common/engine/utils/deckBuilder';

/**
 * Manages all player data state and mutations
 * Provides safe accessors to avoid null checks throughout the codebase
 */
export class GameStateManager {
  private playerData: PlayerData | null = null;
  private onLeaderboardScoreSubmit?: (type: 'experience' | 'cluckNorris', score: number) => void;

  constructor(onLeaderboardScoreSubmit?: (type: 'experience' | 'cluckNorris', score: number) => void) {
    this.onLeaderboardScoreSubmit = onLeaderboardScoreSubmit;
  }

  /**
   * Set player data
   */
  setPlayerData(data: PlayerData | null): void {
    this.playerData = data;
  }

  /**
   * Get player data (safely)
   * Throws error if data not loaded - forces explicit null handling
   */
  getPlayerData(): PlayerData {
    if (!this.playerData) {
      throw new Error('PlayerData not loaded - initialize game first');
    }
    return this.playerData;
  }

  /**
   * Get player data or null (for optional operations)
   */
  getPlayerDataOrNull(): PlayerData | null {
    return this.playerData;
  }

  /**
   * Check if player data is loaded
   */
  hasPlayerData(): boolean {
    return this.playerData !== null;
  }

  /**
   * Execute operation with player data (safe accessor pattern)
   * Returns undefined if player data is not loaded
   */
  withPlayerData<T>(fn: (data: PlayerData) => T): T | undefined {
    return this.playerData ? fn(this.playerData) : undefined;
  }

  /**
   * Get current player level (derived from totalXP)
   */
  getPlayerLevel(): number {
    return getPlayerLevel(this.playerData?.totalXP ?? 0);
  }

  /**
   * Add XP to player (level is automatically derived)
   */
  addXP(amount: number): void {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot add XP: player data not loaded');
      return;
    }

    this.playerData.totalXP += amount;
    Logger.debug(`[GameStateManager] Added ${amount} XP (total: ${this.playerData.totalXP}, level: ${this.getPlayerLevel()})`);

    // Submit experience to leaderboard
    this.onLeaderboardScoreSubmit?.('experience', this.playerData.totalXP);
  }

  /**
   * Submit Cluck Norris speed run time to leaderboard
   */
  submitCluckNorrisTime(timeInSeconds: number): void {
    if (!this.onLeaderboardScoreSubmit) {
      Logger.warn('[GameStateManager] Cannot submit Cluck Norris time: no leaderboard callback');
      return;
    }

    Logger.info(`[GameStateManager] Submitting Cluck Norris time: ${timeInSeconds}s`);
    this.onLeaderboardScoreSubmit('cluckNorris', timeInSeconds);
  }

  /**
   * Get the quantity of a specific item from player's items array
   */
  getItemQuantity(itemId: string): number {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot get item quantity: player data not loaded');
      return 0;
    }
    const item = this.playerData.items.find(i => i.itemId === itemId);
    return item ? item.quantity : 0;
  }

  /**
   * Track mission completion
   */
  trackMissionCompletion(missionId: string): void {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot track mission completion: player data not loaded');
      return;
    }

    const currentCount = this.playerData.missions.completedMissions[missionId] || 0;
    this.playerData.missions.completedMissions[missionId] = currentCount + 1;
    Logger.debug(`[GameStateManager] Mission ${missionId} completed ${currentCount + 1} times`);
  }

  /**
   * Add items to player's inventory
   */
  addItems(itemId: string, quantity: number): void {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot add items: player data not loaded');
      return;
    }

    const existingItem = this.playerData.items.find(i => i.itemId === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.playerData.items.push({
        itemId,
        quantity,
      });
    }
    Logger.debug(`[GameStateManager] Added ${quantity}x ${itemId} to inventory`);
  }

  /**
   * Add coins to player's balance
   */
  addCoins(amount: number): void {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot add coins: player data not loaded');
      return;
    }
    this.playerData.coins += amount;
  }

  /**
   * Deduct coins from player's balance
   * Returns false if insufficient coins
   */
  deductCoins(amount: number): boolean {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot deduct coins: player data not loaded');
      return false;
    }

    if (this.playerData.coins < amount) {
      Logger.warn(`[GameStateManager] Insufficient coins: need ${amount}, have ${this.playerData.coins}`);
      return false;
    }

    this.playerData.coins -= amount;
    return true;
  }

  /**
   * Get current boost level
   */
  getBoostLevel(boostId: string): number {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot get boost level: player data not loaded');
      return 0;
    }
    return this.playerData.boosts?.[boostId] || 0;
  }

  /**
   * Upgrade a boost
   * Returns true if upgrade successful
   */
  upgradeBoost(boostId: string): boolean {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot upgrade boost: player data not loaded');
      return false;
    }

    const currentLevel = this.getBoostLevel(boostId);

    if (currentLevel >= GAME_CONSTANTS.MAX_BOOST_LEVEL) {
      Logger.warn(`[GameStateManager] Boost ${boostId} already at max level ${GAME_CONSTANTS.MAX_BOOST_LEVEL}`);
      return false;
    }

    // Initialize boosts if not present
    if (!this.playerData.boosts) {
      this.playerData.boosts = {};
    }

    this.playerData.boosts[boostId] = currentLevel + 1;
    return true;
  }

  /**
   * Initialize a new game with starter cards
   */
  async initializeStartingCollection(): Promise<void> {
    if (!this.playerData) {
      Logger.error('[GameStateManager] Cannot initialize starting collection: player data not loaded');
      return;
    }

    // Get starter deck cards from deck builder
    const starterDeckList = getStarterDeck('Forest');
    const starterCards = starterDeckList.cards;

    Logger.info(`[GameStateManager] Initializing starter deck: ${starterDeckList.name} with ${starterCards.length} cards`);

    // Use const reference to avoid non-null assertions
    const playerData = this.playerData;

    // Create card instances and add to collection and deck
    starterCards.forEach((card: any, index: number) => {
      const instanceId = `${card.id}-${Date.now()}-${index}`;

      // Create minimal card instance
      const cardInstance: CardInstance = {
        id: instanceId,
        cardId: card.id,
        currentXP: 0, // Start at 0 XP (level 1)
      };

      playerData.cards.collected.push(cardInstance);
      playerData.cards.deck.push(cardInstance.id);
    });

    Logger.info(`[GameStateManager] Starter deck initialized with ${playerData.cards.deck.length} cards in deck and ${playerData.cards.collected.length} cards collected`);
  }

  /**
   * Add card to player's deck
   */
  addCardToDeck(cardId: string, maxDeckSize: number): boolean {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot add card to deck: player data not loaded');
      return false;
    }

    if (this.playerData.cards.deck.length >= maxDeckSize) {
      Logger.warn(`[GameStateManager] Deck is full (${maxDeckSize} cards)`);
      return false;
    }

    if (!this.playerData.cards.deck.includes(cardId)) {
      this.playerData.cards.deck.push(cardId);
      return true;
    }

    return false;
  }

  /**
   * Remove card from player's deck
   */
  removeCardFromDeck(cardId: string): boolean {
    if (!this.playerData) {
      Logger.warn('[GameStateManager] Cannot remove card from deck: player data not loaded');
      return false;
    }

    const index = this.playerData.cards.deck.indexOf(cardId);
    if (index > -1) {
      this.playerData.cards.deck.splice(index, 1);
      return true;
    }

    return false;
  }
}
