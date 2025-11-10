/**
 * Card utility functions for level/XP calculations and stat computation
 */

import type { BloomBeastCard, AnyCard } from '../engine/types/core';
import type { Level } from '../engine/types/leveling';
import type { CardInstance } from '../../screens/common/types';
import type { RuntimeCard, RuntimeBeast } from '../engine/types/runtime';
import { CardType } from '../engine/types/core';
import { CARD_XP_THRESHOLDS } from '../engine/constants/leveling';
import { Logger } from '../engine/utils/Logger';

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
 * Calculate card level from current XP
 * Works for all card types (Beast, Magic, Trap, Habitat, Buff)
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

export function getXPThreshold(level: number): number {
  return CARD_XP_THRESHOLDS[level - 1];
}

/**
 * Get XP threshold for progression display
 * Returns the XP needed to reach the NEXT level
 * For max level, returns the current level threshold
 *
 * @param currentLevel - Current card level (1-9)
 * @returns XP threshold for next level progression
 *
 * @example
 * // Level 2 card needs 300 XP to reach level 3
 * getXPProgressionThreshold(2) // returns 300
 *
 * // Level 9 card is at max, show max threshold
 * getXPProgressionThreshold(9) // returns 25500
 */
export function getXPProgressionThreshold(currentLevel: number): number {
  // For max level (9), show the threshold for level 9
  if (currentLevel >= 9) {
    return CARD_XP_THRESHOLDS[8]; // Level 9 threshold
  }

  // For levels 1-8, show the threshold for the NEXT level
  return CARD_XP_THRESHOLDS[currentLevel]; // Next level threshold (current level index in array)
}

/**
 * Get card definition by ID
 */
export function getCardDefinition(cardId: string): AnyCard | undefined {
  if (!_cardUtilsCatalogManager) {
    Logger.warn('[cardUtils] catalogManager not initialized');
    return undefined;
  }
  const allCards = _cardUtilsCatalogManager.getAllCardData();
  return allCards.find((c: any) => c && c.id === cardId);
}

/**
 * Extract base card ID (remove instance suffix)
 * e.g., "forest-beast-1-1" → "forest-beast"
 */
export function extractBaseCardId(instanceId: string): string {
  if (!instanceId) return '';
  return instanceId.replace(/-\d+-\d+$/, '');
}

// CardDisplay and computeCardDisplay have been removed.
// Use RuntimeCard directly (from engine/types/runtime).
// To convert CardInstance to RuntimeCard, use createBattleCard().

/**
 * Compute level-scaled stat value
 * Each level increases stats by 10% (Level 1 = 100%, Level 9 = 180%)
 *
 * @param baseStat - Base stat value at level 1
 * @param level - Current level (1-9)
 * @returns Scaled stat value
 */
export function computeLeveledStat(baseStat: number, level: number): number {
  if (level < 1) level = 1;
  if (level > 9) level = 9;

  const multiplier = 1.0 + ((level - 1) * 0.1); // 1.0 at level 1, 1.8 at level 9
  return Math.round(baseStat * multiplier);
}

/**
 * Create a RuntimeCard from a CardInstance
 * Transforms collection instance into battle-ready card with computed level and stats
 *
 * @param instance - CardInstance from player's collection
 * @param cardDef - Card definition from catalog
 * @returns RuntimeCard ready for battle (deck, hand, or field)
 */
export function createBattleCard(instance: CardInstance, cardDef: AnyCard): RuntimeCard {
  const level = getCardLevel(instance.currentXP);

  // For Beast cards, compute level-scaled stats
  if (cardDef.type === CardType.Beast && 'baseAttack' in cardDef && 'baseHealth' in cardDef) {
    const beastCard = cardDef as BloomBeastCard;
    const scaledAttack = computeLeveledStat(beastCard.baseAttack, level);
    const scaledHealth = computeLeveledStat(beastCard.baseHealth, level);

    const runtimeBeast: RuntimeBeast = {
      ...beastCard,
      instanceId: instance.id,
      currentXP: instance.currentXP,
      level,
      currentLevel: level as Level,  // Strongly-typed level (required by RuntimeBeast)
      currentAttack: scaledAttack,
      currentHealth: scaledHealth,
      maxHealth: scaledHealth,
      statusEffects: [],         // Initialize empty status effects (required by RuntimeBeast)
    };

    return runtimeBeast;
  }

  // For non-Beast cards, just add instance metadata
  const runtimeCard = {
    ...cardDef,
    instanceId: instance.id,
    currentXP: instance.currentXP,
    level,
  } as RuntimeCard;

  return runtimeCard;
}

/**
 * Get player's deck cards for battle
 * Converts minimal CardInstance to full battle cards using definitions
 */
export function getPlayerDeckCards(playerDeck: string[], cardInstances: CardInstance[]): RuntimeCard[] {
  if (!_cardUtilsCatalogManager) {
    Logger.warn('[cardUtils] catalogManager not initialized');
    return [];
  }

  const deckCards: RuntimeCard[] = [];
  const allCardDefs = _cardUtilsCatalogManager.getAllCardData();

  // Convert all cards from player's deck to RuntimeCards
  for (const cardId of playerDeck) {
    const cardInstance = cardInstances.find(c => c.id === cardId);

    if (cardInstance) {
      // Get the card definition
      const baseCardId = extractBaseCardId(cardInstance.cardId);
      const cardDef = allCardDefs.find((card: any) => card && card.id === baseCardId);

      if (!cardDef) {
        Logger.warn(`[cardUtils] Card definition not found for ${cardInstance.cardId}`);
        continue;
      }

      // Use createBattleCard to get level-scaled stats
      const battleCard = createBattleCard(cardInstance, cardDef as AnyCard);
      deckCards.push(battleCard);
    }
  }

  return deckCards;
}

/**
 * Award experience to all cards in the player's deck
 * Level is computed from XP on-demand, so we just add XP here
 */
export function awardDeckExperience(totalCardXP: number, playerDeck: string[], cardInstances: CardInstance[]): void {
  if (playerDeck.length === 0) return;

  // Distribute XP evenly across all cards in deck
  const xpPerCard = Math.floor(totalCardXP / playerDeck.length);

  // Award XP to each card in the deck
  for (const cardId of playerDeck) {
    const cardInstance = cardInstances.find(c => c.id === cardId);
    if (cardInstance) {
      cardInstance.currentXP += xpPerCard;
    }
  }
}

/**
 * Add card reward to collection (minimal format)
 */
export function addCardReward(card: any, cardInstances: CardInstance[], index: number): void {
  const instanceId = `${card.id}-reward-${Date.now()}-${index}`;

  // Create minimal card instance (all types use same format)
  const cardInstance: CardInstance = {
    id: instanceId,
    cardId: card.id,
    currentXP: 0, // New cards start at 0 XP (level 1)
  };

  cardInstances.push(cardInstance);
}
