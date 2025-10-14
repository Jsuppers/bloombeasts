/**
 * Cards System - Manage and view player's card collection
 */

import { CardsUI } from './CardsUI';
import { CardCollection } from './CardCollection';
import { InventoryFilters } from './InventoryFilters';

export class Cards {
  private ui: CardsUI;
  private collection: CardCollection;
  private filters: InventoryFilters;

  constructor() {
    this.ui = new CardsUI();
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
   * Initialize and display the cards screen
   * Note: Cards should be set via collection.setCards() before calling initialize
   */
  public async initialize(): Promise<void> {
    await this.ui.render(this.collection.getFilteredCards(this.filters));
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for cards interactions
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
      this.closeCards();
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
   * Refresh the cards display
   */
  private refreshDisplay(): void {
    const filteredCards = this.collection.getFilteredCards(this.filters);
    this.ui.render(filteredCards);
  }

  /**
   * Close cards screen and return to previous screen
   */
  private closeCards(): void {
    console.log('Closing cards...');
    // Note: Navigation integration point - return to previous screen (menu or game)
    // Future: Implement screen stack or navigation manager
  }
}

export { CardsUI } from './CardsUI';
export { CardCollection } from './CardCollection';
export { InventoryFilters } from './InventoryFilters';