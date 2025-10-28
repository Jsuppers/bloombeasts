/**
 * Utilities for screen components
 * Provides type-safe ways to work with dynamic UI components
 */

import type { CardDisplayData } from '../../utils/cardUtils';

/**
 * Type annotation for UINode - since UINode is dynamically loaded, we use 'any' type
 */
export type UINodeType<T = any> = any;

/**
 * Extend CardDisplayData with additional UI properties
 * These are properties used in the UI but not in the core game model
 */
export interface UICardDisplay extends CardDisplayData {
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
 * Convert CardDisplayData to UICardDisplay with additional UI properties
 */
export function toUICard(card: CardDisplayData): UICardDisplay {
  const uiCard: UICardDisplay = {
    ...card,
    attack: card.baseAttack || 0,
    defense: 0, // Not in CardDisplayData - using 0 as default
    health: card.baseHealth || 0,
    emoji: getCardEmoji(card),
    rarityLevel: getCardRarity(card)
  };
  return uiCard;
}

/**
 * Get emoji based on card affinity
 */
function getCardEmoji(card: CardDisplayData): string {
  switch (card.affinity?.toLowerCase()) {
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
function getCardRarity(card: CardDisplayData): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
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
    tokens?: number;
    diamonds?: number;
  };
}