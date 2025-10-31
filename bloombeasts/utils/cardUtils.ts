/**
 * Card utility functions for level/XP calculations and stat computation
 */

import type { BloomBeastCard, AnyCard } from '../engine/types/core';
import type { Level } from '../engine/types/leveling';
import type { CardInstance } from '../screens/cards/types';
import { getCardDescription } from '../engine/utils/cardDescriptionGenerator';

// Module-level catalog manager reference for card utils
// Set via setCatalogManagerForUtils() which is called by BloomBeastsGame
let _cardUtilsCatalogManager: any = null;

/**
 * Set the catalog manager instance for card utility functions
 * Called by BloomBeastsGame during construction
 */
export function setCatalogManagerForUtils(catalogManager: any): void {
  _cardUtilsCatalogManager = catalogManager;
}

/**
 * Battle-specific card stats (runtime only, not persisted)
 * Created when a card enters battle, mutated during combat
 */
export interface CardBattleStats {
  baseAttack?: number;
  currentAttack?: number;
  baseHealth?: number;
  currentHealth?: number;
  abilities?: any[];
}

/**
 * XP thresholds for card leveling (cumulative)
 * Level 2: 100 XP, Level 3: 300 XP, etc.
 */
const CARD_XP_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  700,    // Level 4
  1500,   // Level 5
  3100,   // Level 6
  6300,   // Level 7
  12700,  // Level 8
  25500,  // Level 9
];

/**
 * Calculate card level from current XP
 * Works for all card types (Bloom, Magic, Trap, Habitat, Buff)
 * Uses standard XP thresholds for all cards
 */
export function getCardLevel(currentXP: number): number {
  // Standard XP thresholds
  for (let level = 9; level >= 1; level--) {
    if (currentXP >= CARD_XP_THRESHOLDS[level - 1]) {
      return level;
    }
  }
  return 1;
}

/**
 * Calculate XP required for next level (uses standard progression)
 */
export function getXPRequired(currentLevel: number, currentXP: number): number {
  if (currentLevel >= 9) return 0; // Max level

  const nextLevel = currentLevel + 1;

  // Standard XP requirements
  const nextLevelXP = CARD_XP_THRESHOLDS[nextLevel - 1];
  return nextLevelXP - currentXP;
}

/**
 * Get card definition by ID
 */
export function getCardDefinition(cardId: string): AnyCard | undefined {
  if (!_cardUtilsCatalogManager) {
    console.warn('[cardUtils] catalogManager not initialized');
    return undefined;
  }
  const allCards = _cardUtilsCatalogManager.getAllCardData();
  return allCards.find((c: any) => c && c.id === cardId);
}

/**
 * Extract base card ID (remove instance suffix)
 * e.g., "forest-bloom-1-1" → "forest-bloom"
 */
export function extractBaseCardId(instanceId: string): string {
  return instanceId.replace(/-\d+-\d+$/, '');
}

/**
 * Compute display data for a card (for UI rendering)
 * This is NOT a stored type - computed on-demand
 */
export interface CardDisplayData {
  // Identity
  id: string;
  cardId: string;
  name: string;
  type: string;
  affinity?: string;
  cost: number;

  // Computed from XP
  level: number;
  experience: number;
  experienceRequired: number;

  // Stats (for Bloom beasts)
  baseAttack?: number;
  baseHealth?: number;

  // Abilities and effects
  abilities?: any[];
  description?: string;

  // Visual
  titleColor?: string;
}

/**
 * Compute display data from a CardInstance
 * Merges instance data + card definition + computed level/stats
 */
export function computeCardDisplay(instance: CardInstance): CardDisplayData {
  const baseCardId = extractBaseCardId(instance.cardId);
  const cardDef = getCardDefinition(baseCardId);

  if (!cardDef) {
    // Fallback for missing definition
    return {
      id: instance.id,
      cardId: instance.cardId,
      name: baseCardId,
      type: 'unknown',
      level: 1,
      experience: instance.currentXP,
      experienceRequired: 100,
      cost: 0,
    };
  }

  const level = getCardLevel(instance.currentXP);
  const xpRequired = getXPRequired(level, instance.currentXP);

  const displayData: CardDisplayData = {
    id: instance.id,
    cardId: instance.cardId,
    name: cardDef.name,
    type: cardDef.type,
    affinity: 'affinity' in cardDef ? cardDef.affinity : undefined,
    cost: cardDef.cost || 0,
    level,
    experience: instance.currentXP,
    experienceRequired: xpRequired,
  };

  // Add type-specific data (base stats only - level bonuses applied in battle)
  if (cardDef.type === 'Bloom' && 'baseAttack' in cardDef) {
    const bloomCard = cardDef as BloomBeastCard;
    displayData.baseAttack = bloomCard.baseAttack;
    displayData.baseHealth = bloomCard.baseHealth;
  }

  // Add abilities (abilities remain constant across all levels)
  if ('abilities' in cardDef) {
    displayData.abilities = cardDef.abilities as any[];
  }

  // Generate description from abilities using getCardDescription
  const cardWithAbilities = {
    ...cardDef,
    abilities: displayData.abilities
  };
  displayData.description = getCardDescription(cardWithAbilities);

  // Add visual properties
  if ('titleColor' in cardDef) {
    displayData.titleColor = cardDef.titleColor;
  }

  return displayData;
}
