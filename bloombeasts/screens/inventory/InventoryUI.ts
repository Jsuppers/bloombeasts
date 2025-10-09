/**
 * Inventory UI - Visual presentation of the card collection
 */

import { CardInstance } from './types';
import { SimpleMap } from '../../utils/polyfills';

export interface DisplayOptions {
  viewMode: 'grid' | 'list' | 'detailed';
  cardsPerPage: number;
  currentPage: number;
}

export class InventoryUI {
  private displayOptions: DisplayOptions;
  private callbacks: SimpleMap<string, Function> = new SimpleMap();
  private selectedCardIndex: number = 0;

  constructor() {
    this.displayOptions = {
      viewMode: 'grid',
      cardsPerPage: 12,
      currentPage: 1,
    };
  }

  /**
   * Render the inventory UI with cards
   */
  public async render(cards: CardInstance[]): Promise<void> {
    // Print newlines to simulate clearing (console.clear not available in ES3)
    console.log('\n\n\n\n\n');
    console.log('===========================================');
    console.log('         📦 CARD INVENTORY 📦              ');
    console.log('===========================================');
    console.log(`Total Cards: ${cards.length} | View: ${this.displayOptions.viewMode}`);
    console.log('-------------------------------------------');

    if (this.displayOptions.viewMode === 'grid') {
      this.renderGrid(cards);
    } else if (this.displayOptions.viewMode === 'list') {
      this.renderList(cards);
    } else {
      this.renderDetailed(cards);
    }

    console.log('-------------------------------------------');
    console.log('Controls: [↑↓←→] Navigate | [Enter] Select | [F] Filter | [S] Sort | [V] View Mode | [B] Back');
  }

  /**
   * Render cards in grid view
   */
  private renderGrid(cards: CardInstance[]): void {
    const startIdx = (this.displayOptions.currentPage - 1) * this.displayOptions.cardsPerPage;
    const endIdx = Math.min(startIdx + this.displayOptions.cardsPerPage, cards.length);
    const pageCards = cards.slice(startIdx, endIdx);

    // Display in 4x3 grid
    for (let row = 0; row < 3; row++) {
      let rowStr = '';
      for (let col = 0; col < 4; col++) {
        const idx = row * 4 + col;
        if (idx < pageCards.length) {
          const card = pageCards[idx];
          const selected = idx === this.selectedCardIndex ? '[*]' : '   ';
          const lvl = card.level > 1 ? `Lv${card.level}` : '';
          rowStr += `${selected} ${card.name.substring(0, 10).padEnd(10)} ${lvl.padEnd(4)} | `;
        }
      }
      console.log(rowStr);
    }
  }

  /**
   * Render cards in list view
   */
  private renderList(cards: CardInstance[]): void {
    const startIdx = (this.displayOptions.currentPage - 1) * this.displayOptions.cardsPerPage;
    const endIdx = Math.min(startIdx + this.displayOptions.cardsPerPage, cards.length);
    const pageCards = cards.slice(startIdx, endIdx);

    pageCards.forEach((card, idx) => {
      const selected = idx === this.selectedCardIndex ? '>' : ' ';
      const stats = `ATK: ${card.currentAttack}/${card.baseAttack} | HP: ${card.currentHealth}/${card.baseHealth}`;
      const xp = card.currentXP > 0 ? `| XP: ${card.currentXP}` : '';
      console.log(`${selected} ${card.name.padEnd(20)} ${card.affinity.padEnd(8)} Lv${card.level} ${stats} ${xp}`);
    });
  }

  /**
   * Render detailed card view
   */
  private renderDetailed(cards: CardInstance[]): void {
    if (cards.length === 0) {
      console.log('No cards to display');
      return;
    }

    const card = cards[this.selectedCardIndex];
    console.log(`╔════════════════════════════════════════╗`);
    console.log(`║ ${card.name.padEnd(38)} ║`);
    console.log(`║ ${card.affinity.padEnd(38)} ║`);
    console.log(`╠════════════════════════════════════════╣`);
    console.log(`║ Level: ${String(card.level).padEnd(31)} ║`);
    console.log(`║ XP: ${String(card.currentXP).padEnd(34)} ║`);
    console.log(`║ Attack: ${card.currentAttack}/${card.baseAttack}`.padEnd(39) + '║');
    console.log(`║ Health: ${card.currentHealth}/${card.baseHealth}`.padEnd(39) + '║');
    console.log(`╠════════════════════════════════════════╣`);
    if (card.passiveAbility) {
      console.log(`║ Passive: ${card.passiveAbility.name.padEnd(29)} ║`);
    }
    if (card.bloomAbility) {
      console.log(`║ Bloom: ${card.bloomAbility.name.padEnd(31)} ║`);
    }
    console.log(`╚════════════════════════════════════════╝`);
  }

  /**
   * Show detailed view of a single card
   */
  public showCardDetails(card: CardInstance): void {
    this.renderDetailed([card]);
  }

  /**
   * Handle card selection
   */
  public onCardSelect(callback: (cardId: string) => void): void {
    this.callbacks.set('cardSelect', callback);
  }

  /**
   * Handle filter changes
   */
  public onFilterChange(callback: (filterType: any, value: any) => void): void {
    this.callbacks.set('filterChange', callback);
  }

  /**
   * Handle sort changes
   */
  public onSortChange(callback: (sortBy: any) => void): void {
    this.callbacks.set('sortChange', callback);
  }

  /**
   * Handle back button
   */
  public onBackClick(callback: () => void): void {
    this.callbacks.set('back', callback);
  }

  /**
   * Change view mode
   */
  public changeViewMode(mode: 'grid' | 'list' | 'detailed'): void {
    this.displayOptions.viewMode = mode;
  }

  /**
   * Navigate to next page
   */
  public nextPage(): void {
    this.displayOptions.currentPage++;
  }

  /**
   * Navigate to previous page
   */
  public previousPage(): void {
    if (this.displayOptions.currentPage > 1) {
      this.displayOptions.currentPage--;
    }
  }
}