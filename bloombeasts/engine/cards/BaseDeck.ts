/**
 * Base class for all deck types
 */

import { BloomBeastCard, HabitatCard, AnyCard } from '../types/core';

export interface DeckCardEntry<T extends AnyCard> {
  card: T;
  quantity: number;
}

export interface DeckContents {
  beasts: DeckCardEntry<BloomBeastCard>[];
  habitats: DeckCardEntry<HabitatCard>[];
}

/**
 * Abstract base class for deck builders
 */
export abstract class BaseDeck {
  abstract readonly deckName: string;
  abstract readonly affinity: 'Forest' | 'Fire' | 'Water' | 'Sky';

  /**
   * Get the beast cards for this deck
   */
  protected abstract getBeasts(): DeckCardEntry<BloomBeastCard>[];

  /**
   * Get the habitat cards for this deck
   */
  protected abstract getHabitats(): DeckCardEntry<HabitatCard>[];

  /**
   * Get the complete deck contents
   */
  public getDeckCards(): DeckContents {
    return {
      beasts: this.getBeasts(),
      habitats: this.getHabitats(),
    };
  }

  /**
   * Get all cards as a flat array
   */
  public getAllCards(): AnyCard[] {
    const contents = this.getDeckCards();
    const cards: AnyCard[] = [];

    // Add beast cards
    contents.beasts.forEach(entry => {
      for (let i = 0; i < entry.quantity; i++) {
        cards.push(entry.card);
      }
    });

    // Add habitat cards
    contents.habitats.forEach(entry => {
      for (let i = 0; i < entry.quantity; i++) {
        cards.push(entry.card);
      }
    });

    return cards;
  }

  /**
   * Get total card count (excluding shared cards)
   */
  public getAffinityCardCount(): number {
    const contents = this.getDeckCards();
    const beastCount = contents.beasts.reduce((sum, entry) => sum + entry.quantity, 0);
    const habitatCount = contents.habitats.reduce((sum, entry) => sum + entry.quantity, 0);
    return beastCount + habitatCount;
  }
}