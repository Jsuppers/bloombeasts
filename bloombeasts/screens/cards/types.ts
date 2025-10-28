/**
 * Type definitions for the card collection system
 */

import type { Affinity, CardType } from '../../engine/types/core';

/**
 * Minimal card instance in player's collection
 * All other data (level, stats, etc.) is computed on-demand from currentXP and card definition
 */
export interface CardInstance {
  id: string;                    // Unique instance ID (e.g., "forest-bloom-1-1")
  cardId: string;                 // Base card ID (e.g., "forest-bloom")
  currentXP: number;              // Only persistent data - everything else is derived
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