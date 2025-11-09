/**
 * Utilities for screen components
 * Provides type-safe ways to work with dynamic UI components
 */

import type { RuntimeCard } from '../engine/types/runtime';

/**
 * Type annotation for UINode - since UINode is dynamically loaded, we use 'any' type
 */
export type UINodeType<T = any> = any;

/**
 * UI wrapper for RuntimeCard with additional UI properties
 * These are properties used in the UI but not in the core game model
 */
export interface UICardDisplay {
  // The runtime card data
  card: RuntimeCard;
  // Add emoji based on affinity
  emoji?: string;
  // Use level as rarity indicator
  rarityLevel?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  // Map attack/defense/health for display
  attack?: number;
  defense?: number;
  health?: number;
}

/**
 * Convert RuntimeCard to UICardDisplay with additional UI properties
 */
export function toUICard(card: RuntimeCard): UICardDisplay {
  const uiCard: UICardDisplay = {
    card: card,
    attack: 'baseAttack' in card ? card.baseAttack : undefined,
    defense: 0, // Not in RuntimeCard - using 0 as default
    health: 'baseHealth' in card ? card.baseHealth : undefined,
    emoji: getCardEmoji(card),
    rarityLevel: getCardRarity(card)
  };
  return uiCard;
}

/**
 * Get emoji based on card affinity
 */
function getCardEmoji(card: RuntimeCard): string {
  // Check if card has affinity property (Beast, Buff, Habitat cards)
  const affinity = 'affinity' in card ? (card as any).affinity : undefined;
  switch (affinity?.toLowerCase()) {
    case 'fire':
      return '🔥';
    case 'water':
      return '💧';
    case 'forest':
      return '🌿';
    case 'sky':
      return '☁️';
    default:
      return '✨';
  }
}

/**
 * Determine rarity based on card level
 */
function getCardRarity(card: RuntimeCard): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
  const level = card.level || 1;
  if (level >= 10) return 'legendary';
  if (level >= 7) return 'epic';
  if (level >= 5) return 'rare';
  if (level >= 3) return 'uncommon';
  return 'common';
}

/**
 * Extend MissionDisplay with UI properties
 */
export interface UIMissionDisplay {
  id: string;
  name: string;
  level: number;
  difficulty: string;
  isAvailable: boolean;
  isCompleted: boolean;
  description: string;
  affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky' | 'Boss';
  beastId?: string;
  // Additional UI properties
  progress?: number;
  requirement?: number;
  rewards?: {
    coins?: number;
  };
}