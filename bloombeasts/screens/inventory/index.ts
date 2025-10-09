/**
 * Inventory System - Manage and view player's card collection
 */

import { InventoryUI } from './InventoryUI';
import { CardCollection } from './CardCollection';
import { InventoryFilters } from './InventoryFilters';

export class Inventory {
  private ui: InventoryUI;
  private collection: CardCollection;
  private filters: InventoryFilters;

  constructor() {
    this.ui = new InventoryUI();
    this.collection = new CardCollection();
    this.filters = new InventoryFilters();
  }

  /**
   * Get the card collection (for platform to set cards)
   */
  public getCollection(): CardCollection {
    return this.collection;
  }

  /**
   * Initialize and display the inventory
   * Note: Cards should be set via collection.setCards() before calling initialize
   */
  public async initialize(): Promise<void> {
    await this.ui.render(this.collection.getFilteredCards(this.filters));
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for inventory interactions
   */
  private setupEventHandlers(): void {
    // Handle card selection
    this.ui.onCardSelect((cardId: string) => {
      this.displayCardDetails(cardId);
    });

    // Handle filter changes
    this.ui.onFilterChange((filterType: any, value: any) => {
      this.filters.updateFilter(filterType, value);
      this.refreshDisplay();
    });

    // Handle sorting
    this.ui.onSortChange((sortBy: any) => {
      this.collection.sortCards(sortBy);
      this.refreshDisplay();
    });

    // Handle back button
    this.ui.onBackClick(() => {
      this.closeInventory();
    });
  }

  /**
   * Display detailed view of a specific card
   */
  private displayCardDetails(cardId: string): void {
    const card = this.collection.getCard(cardId);
    if (card) {
      this.ui.showCardDetails(card);
    }
  }

  /**
   * Refresh the inventory display
   */
  private refreshDisplay(): void {
    const filteredCards = this.collection.getFilteredCards(this.filters);
    this.ui.render(filteredCards);
  }

  /**
   * Close inventory and return to previous screen
   */
  private closeInventory(): void {
    console.log('Closing inventory...');
    // TODO: Return to main menu or game
  }
}

export { InventoryUI } from './InventoryUI';
export { CardCollection } from './CardCollection';
export { InventoryFilters } from './InventoryFilters';