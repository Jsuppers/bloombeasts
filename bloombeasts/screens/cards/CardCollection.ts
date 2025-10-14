/**
 * Card Collection - Manages the player's collection of cards
 */

import { CardInstance, CollectionStats } from './types';
import { InventoryFilters } from './InventoryFilters';

export type SortOption = 'name' | 'level' | 'affinity' | 'attack' | 'health' | 'xp' | 'recent';

export class CardCollection {
  private cards: CardInstance[] = [];
  private sortBy: SortOption = 'name';
  private sortAscending: boolean = true;

  constructor() {
    // Initialize with empty collection
  }

  /**
   * Set the player's card collection (called by platform layer)
   */
  public setCards(cards: CardInstance[]): void {
    this.cards = cards;
  }

  /**
   * Get all cards in collection
   */
  public getAllCards(): CardInstance[] {
    return this.cards;
  }

  /**
   * Get a specific card by ID
   */
  public getCard(id: string): CardInstance | undefined {
    return this.cards.find(card => card.id === id);
  }

  /**
   * Get cards filtered by criteria
   */
  public getFilteredCards(filters: InventoryFilters): CardInstance[] {
    let filtered = [...this.cards];

    // Apply affinity filter
    const affinityFilter = filters.getFilter('affinity');
    if (affinityFilter && affinityFilter !== 'all') {
      filtered = filtered.filter(card => card.affinity === affinityFilter);
    }

    // Apply level filter
    const levelFilter = filters.getFilter('minLevel');
    if (levelFilter) {
      filtered = filtered.filter(card => card.level >= levelFilter);
    }

    // Apply search filter
    const searchFilter = filters.getFilter('search');
    if (searchFilter) {
      const search = searchFilter.toLowerCase();
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(search) ||
        (card.affinity && card.affinity.toLowerCase().includes(search))
      );
    }

    // Apply sorting
    this.applySorting(filtered);

    return filtered;
  }

  /**
   * Sort cards by specified criteria
   */
  public sortCards(sortBy: SortOption, ascending: boolean = true): void {
    this.sortBy = sortBy;
    this.sortAscending = ascending;
    this.applySorting(this.cards);
  }

  /**
   * Apply sorting to a card array
   */
  private applySorting(cards: CardInstance[]): void {
    cards.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'level':
          comparison = a.level - b.level;
          break;
        case 'affinity':
          comparison = (a.affinity || '').localeCompare(b.affinity || '');
          break;
        case 'attack':
          comparison = (a.currentAttack || 0) - (b.currentAttack || 0);
          break;
        case 'health':
          comparison = (a.currentHealth || 0) - (b.currentHealth || 0);
          break;
        case 'xp':
          comparison = a.currentXP - b.currentXP;
          break;
      }

      return this.sortAscending ? comparison : -comparison;
    });
  }

  /**
   * Get collection statistics
   */
  public getStats(): CollectionStats {
    const stats: CollectionStats = {
      totalCards: this.cards.length,
      uniqueCards: new Set(this.cards.map(c => c.cardId)).size,
      cardsByAffinity: {
        Forest: 0,
        Fire: 0,
        Water: 0,
        Sky: 0,
        Generic: 0,
      },
      averageLevel: 0,
      totalXP: 0,
    };

    let totalLevel = 0;
    for (const card of this.cards) {
      if (card.affinity) {
        stats.cardsByAffinity[card.affinity]++;
      }
      totalLevel += card.level;
      stats.totalXP += card.currentXP;
    }

    stats.averageLevel = this.cards.length > 0 ? totalLevel / this.cards.length : 0;

    return stats;
  }

  /**
   * Add a new card to collection
   */
  public addCard(card: CardInstance): void {
    this.cards.push(card);
  }

  /**
   * Remove a card from collection
   */
  public removeCard(id: string): boolean {
    const index = this.cards.findIndex(card => card.id === id);
    if (index !== -1) {
      this.cards.splice(index, 1);
      return true;
    }
    return false;
  }
}