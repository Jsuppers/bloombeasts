/**
 * Card Helper Utilities - Query and filter cards
 */

import { AnyCard, BloomBeastCard, Affinity, CardType } from '../types/core';

/**
 * Check if a card is a Beast
 */
export function isBloomBeast(card: AnyCard): card is BloomBeastCard {
  return card.type === CardType.Beast;
}

/**
 * Filter cards by type (simplified)
 */
export function filterByType(cards: AnyCard[], type: CardType): AnyCard[] {
  return cards.filter((card) => card.type === type);
}

/**
 * Filter Beasts by affinity
 */
export function filterByAffinity(cards: AnyCard[], affinity: Affinity): BloomBeastCard[] {
  return cards.filter((card): card is BloomBeastCard => isBloomBeast(card) && card.affinity === affinity);
}

/**
 * Get all Beasts from a card list
 */
export function getBloomBeasts(cards: AnyCard[]): BloomBeastCard[] {
  return cards.filter(isBloomBeast);
}

/**
 * Find a card by ID
 */
export function findCardById(cards: AnyCard[], id: string): AnyCard | undefined {
  return cards.find((card) => card.id === id);
}

/**
 * Get card by name
 */
export function findCardByName(cards: AnyCard[], name: string): AnyCard | undefined {
  return cards.find((card) => card.name.toLowerCase() === name.toLowerCase());
}
