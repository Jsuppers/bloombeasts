/**
 * Type definitions for the inventory system
 */

import type { Affinity, CardType } from '../../engine/types/core';

/**
 * Instance of a card in the player's collection
 */
export interface CardInstance {
  id: string;                    // Unique instance ID
  cardId: string;                 // Base card ID
  name: string;
  type: CardType;                 // Card type: Bloom, Magic, Trap, Habitat
  affinity?: Affinity;            // Optional - not all cards have affinity
  cost: number;                   // Card cost
  // Level and XP for ALL card types
  level: number;                  // All cards can level up
  currentXP: number;              // All cards can gain experience
  // Bloom Beast specific fields
  baseAttack?: number;            // Only for Bloom beasts
  currentAttack?: number;         // Only for Bloom beasts
  baseHealth?: number;            // Only for Bloom beasts
  currentHealth?: number;         // Only for Bloom beasts
  // General fields
  ability?: {
    name: string;
    description: string;
  };
  effects?: string[];             // For Magic/Trap cards - simplified effect descriptions
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