/**
 * Card Helper Utilities - Query and filter cards
 */

import { AnyCard, BloomBeastCard, Affinity, CardType } from '../types/core';

/**
 * Check if a card is a Bloom Beast
 */
export function isBloomBeast(card: AnyCard): card is BloomBeastCard {
  return card.type === 'Bloom';
}

/**
 * Filter cards by type
 */
export function filterByType<T extends CardType>(cards: AnyCard[], type: T): Extract<AnyCard, { type: T }>[] {
  return cards.filter((card) => card.type === type) as Extract<AnyCard, { type: T }>[];
}

/**
 * Filter Bloom Beasts by affinity
 */
export function filterByAffinity(cards: AnyCard[], affinity: Affinity): BloomBeastCard[] {
  return cards.filter((card): card is BloomBeastCard => isBloomBeast(card) && card.affinity === affinity);
}

/**
 * Get all Bloom Beasts from a card list
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

/**
 * Group cards by type
 */
export function groupByType(cards: AnyCard[]): Record<CardType, AnyCard[]> {
  const grouped: Partial<Record<CardType, AnyCard[]>> = {};

  for (const card of cards) {
    if (!grouped[card.type]) {
      grouped[card.type] = [];
    }
    grouped[card.type]!.push(card);
  }

  return grouped as Record<CardType, AnyCard[]>;
}

/**
 * Get cards by cost range
 */
export function filterByCost(cards: AnyCard[], minCost: number, maxCost: number): AnyCard[] {
  return cards.filter((card) => card.cost >= minCost && card.cost <= maxCost);
}

/**
 * Calculate total deck cost (for analytics)
 */
export function calculateTotalCost(cards: AnyCard[]): number {
  return cards.reduce((sum, card) => sum + card.cost, 0);
}

/**
 * Calculate average card cost
 */
export function calculateAverageCost(cards: AnyCard[]): number {
  if (cards.length === 0) return 0;
  return calculateTotalCost(cards) / cards.length;
}

/**
 * Get cost distribution
 */
export function getCostDistribution(cards: AnyCard[]): Record<number, number> {
  const distribution: Record<number, number> = {};

  for (const card of cards) {
    distribution[card.cost] = (distribution[card.cost] || 0) + 1;
  }

  return distribution;
}
