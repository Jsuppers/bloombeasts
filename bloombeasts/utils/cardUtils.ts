/**
 * Card utility functions for level/XP calculations and stat computation
 */

import type { BloomBeastCard, AnyCard } from '../engine/types/core';
import type { Level } from '../engine/types/leveling';
import type { CardInstance } from '../screens/cards/types';
import { getAllCards } from '../engine/cards';
import { getCardDescription } from '../engine/utils/cardDescriptionGenerator';

/**
 * Battle-specific card stats (runtime only, not persisted)
 * Created when a card enters battle, mutated during combat
 */
export interface CardBattleStats {
  baseAttack?: number;
  currentAttack?: number;
  baseHealth?: number;
  currentHealth?: number;
  counters?: Array<{ type: string; amount: number }>;
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
 */
export function getCardLevel(currentXP: number, card?: BloomBeastCard): number {
  // For Bloom beasts with custom XP requirements, use those
  if (card?.levelingConfig?.xpRequirements) {
    const customXP = card.levelingConfig.xpRequirements;
    let cumulativeXP = 0;

    for (let level = 2; level <= 9; level++) {
      const levelKey = level as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      cumulativeXP += customXP[levelKey] || CARD_XP_THRESHOLDS[level] - CARD_XP_THRESHOLDS[level - 1];

      if (currentXP < cumulativeXP) {
        return level - 1;
      }
    }
    return 9; // Max level
  }

  // Standard XP thresholds
  for (let level = 9; level >= 1; level--) {
    if (currentXP >= CARD_XP_THRESHOLDS[level - 1]) {
      return level;
    }
  }
  return 1;
}

/**
 * Calculate XP required for next level
 */
export function getXPRequired(currentLevel: number, currentXP: number, card?: BloomBeastCard): number {
  if (currentLevel >= 9) return 0; // Max level

  const nextLevel = currentLevel + 1;

  // For Bloom beasts with custom XP requirements
  if (card?.levelingConfig?.xpRequirements) {
    const customXP = card.levelingConfig.xpRequirements;
    const levelKey = nextLevel as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    const nextLevelXP = CARD_XP_THRESHOLDS[nextLevel - 1];
    return nextLevelXP - currentXP;
  }

  // Standard XP requirements
  const nextLevelXP = CARD_XP_THRESHOLDS[nextLevel - 1];
  return nextLevelXP - currentXP;
}

/**
 * Get card definition by ID
 */
export function getCardDefinition(cardId: string): AnyCard | undefined {
  const allCards = getAllCards();
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

  const level = getCardLevel(instance.currentXP, cardDef as BloomBeastCard);
  const xpRequired = getXPRequired(level, instance.currentXP, cardDef as BloomBeastCard);

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

  // Add type-specific data
  if (cardDef.type === 'Bloom' && 'baseAttack' in cardDef) {
    const bloomCard = cardDef as BloomBeastCard;

    // Apply levelingConfig stat gains if they exist
    let baseAttack = bloomCard.baseAttack;
    let baseHealth = bloomCard.baseHealth;

    if (bloomCard.levelingConfig?.statGains) {
      const statGain = bloomCard.levelingConfig.statGains[level as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9];
      if (statGain) {
        baseAttack = statGain.atk;
        baseHealth = statGain.hp;
      }
    }

    displayData.baseAttack = baseAttack;
    displayData.baseHealth = baseHealth;
  }

  // Add abilities (with level-based upgrades for Bloom cards)
  if ('abilities' in cardDef) {
    let abilities = cardDef.abilities as any[];

    // Apply ability upgrades for Bloom cards based on level
    if (cardDef.type === 'Bloom' && 'levelingConfig' in cardDef) {
      const bloomCard = cardDef as BloomBeastCard;
      const upgrades = bloomCard.levelingConfig?.abilityUpgrades;

      if (upgrades) {
        // Check upgrade levels in reverse order (9, 7, 4) to get the most recent applicable upgrade
        if (level >= 9 && upgrades[9]) {
          abilities = upgrades[9].abilities || abilities;
        } else if (level >= 7 && upgrades[7]) {
          abilities = upgrades[7].abilities || abilities;
        } else if (level >= 4 && upgrades[4]) {
          abilities = upgrades[4].abilities || abilities;
        }
      }
    }

    displayData.abilities = abilities;
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
