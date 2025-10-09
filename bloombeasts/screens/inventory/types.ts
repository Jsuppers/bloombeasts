/**
 * Type definitions for the inventory system
 */

import type { Affinity } from '../../engine/types/core';

/**
 * Instance of a card in the player's collection
 */
export interface CardInstance {
  id: string;                    // Unique instance ID
  cardId: string;                 // Base card ID
  name: string;
  affinity: Affinity;
  cost: number;                   // Card cost
  level: number;
  currentXP: number;
  baseAttack: number;
  currentAttack: number;
  baseHealth: number;
  currentHealth: number;
  passiveAbility?: {
    name: string;
    description: string;
  };
  bloomAbility?: {
    name: string;
    description: string;
  };
  obtainedDate?: Date;
  lastUsedDate?: Date;
  battleCount?: number;
  winCount?: number;
}

/**
 * Statistics for the card collection
 */
export interface CollectionStats {
  totalCards: number;
  uniqueCards: number;
  cardsByAffinity: Record<Affinity, number>;
  averageLevel: number;
  totalXP: number;
}

/**
 * Deck configuration in inventory
 */
export interface DeckConfiguration {
  id: string;
  name: string;
  cards: string[];                // Array of card instance IDs
  affinity: Affinity;
  isValid: boolean;
  lastModified: Date;
}

/**
 * Player inventory data
 */
export interface PlayerInventory {
  playerId: string;
  cards: CardInstance[];
  decks: DeckConfiguration[];
  currency: {
    nectar: number;
    crystals?: number;
  };
  unlockedCards: string[];         // Base card IDs that have been unlocked
  achievements?: string[];
}