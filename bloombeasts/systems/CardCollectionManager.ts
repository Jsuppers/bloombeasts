/**
 * CardCollectionManager - Manages card operations and transformations
 * Handles card display conversion, leveling, abilities, deck building, and XP awards
 */

import { CardInstance } from '../screens/cards/types';
import { LevelingSystem } from '../engine/systems/LevelingSystem';
import { BloomBeastCard, AnyCard } from '../engine/types/core';
import { getStarterDeck } from '../engine/utils/deckBuilder';
import { Logger } from '../engine/utils/Logger';
import { DECK_SIZE } from '../engine/constants/gameRules';
import { getCardLevel } from '../utils/cardUtils';

export class CardCollectionManager {
  private levelingSystem: LevelingSystem;
  private catalogManager: any;

  constructor(catalogManager: any) {
    this.levelingSystem = new LevelingSystem();
    this.catalogManager = catalogManager;
  }

  /**
   * Extract base card ID from instance ID
   * Card IDs may have timestamp suffixes (e.g., "nectar-block-1761200302194-0")
   * We need to extract the base ID (e.g., "nectar-block") to match catalog IDs
   */
  private extractBaseCardId(cardId: string): string {
    // Remove timestamp pattern: -digits-digits at the end
    return cardId.replace(/-\d+-\d+$/, '');
  }

  /**
   * Get abilities for a card based on its level
   */
  getAbilitiesForLevel(cardInstance: CardInstance): { abilities: any[] } {
    // Get the base card definition
    const allCards = this.catalogManager.getAllCardData();
    const baseCardId = this.extractBaseCardId(cardInstance.cardId);
    const cardDef = allCards.find((card: any) =>
      card && card.id === baseCardId
    ) as BloomBeastCard | undefined;

    if (!cardDef || cardDef.type !== 'Bloom') {
      return {
        abilities: []
      };
    }

    // Abilities remain constant across all levels
    const abilities = [...cardDef.abilities];

    return { abilities };
  }

  /**
   * Get player's deck cards for battle
   * Converts minimal CardInstance to full battle cards using definitions
   */
  getPlayerDeckCards(playerDeck: string[], cardInstances: CardInstance[]): AnyCard[] {
    const deckCards: AnyCard[] = [];
    const allCardDefs = this.catalogManager.getAllCardData();

    // Convert all cards from player's deck
    for (const cardId of playerDeck) {
      const cardInstance = cardInstances.find(c => c.id === cardId);

      if (cardInstance) {
        // Get the card definition
        const baseCardId = this.extractBaseCardId(cardInstance.cardId);
        const cardDef = allCardDefs.find((card: any) =>
          card && card.id === baseCardId
        );

        if (!cardDef) {
          Logger.warn(`Card definition not found for ${cardInstance.cardId}`);
          continue;
        }

        // For Bloom cards, apply level-based upgrades
        if (cardDef.type === 'Bloom') {
          const level = getCardLevel(cardInstance.currentXP);
          const abilities = this.getAbilitiesForLevel(cardInstance);

          // Convert to BloomBeastCard format for battle
          const bloomCard: BloomBeastCard = {
            id: cardDef.id,
            instanceId: cardInstance.id, // Used for unique identification in battle
            name: cardDef.name,
            type: 'Bloom',
            affinity: cardDef.affinity || 'Forest',
            cost: cardDef.cost,
            baseAttack: cardDef.baseAttack || 0,
            baseHealth: cardDef.baseHealth || 0,
            abilities: abilities.abilities,
            level: level, // Include computed level for beast instance (added to Card interface)
          };

          deckCards.push(bloomCard);
        } else {
          // For non-Bloom cards, use the card definition directly
          deckCards.push(cardDef as AnyCard);
        }
      }
    }

    return deckCards;
  }

  /**
   * Award experience to all cards in the player's deck (simplified)
   * Level is computed from XP on-demand, so we just add XP here
   */
  awardDeckExperience(totalCardXP: number, playerDeck: string[], cardInstances: CardInstance[]): void {
    // Distribute XP evenly across all cards in deck
    const xpPerCard = Math.floor(totalCardXP / playerDeck.length);

    // Award XP to each card in the deck
    for (const cardId of playerDeck) {
      const cardInstance = cardInstances.find(c => c.id === cardId);

      if (!cardInstance) continue;

      const oldXP = cardInstance.currentXP;
      cardInstance.currentXP += xpPerCard;

      // Log XP gain (level is computed from XP using cardUtils)
      Logger.debug(`Card ${cardId} gained ${xpPerCard} XP (${oldXP} → ${cardInstance.currentXP})`);
    }
  }

  /**
   * Initialize starting collection with minimal CardInstance format
   */
  async initializeStartingCollection(cardInstances: CardInstance[], playerDeck: string[]): Promise<string[]> {
    // Give player the first 30 cards from the card catalog as the default deck
    const allCards = this.catalogManager.getAllCardData();
    const starterCards = allCards.slice(0, 30);

    starterCards.forEach((card: any, index: number) => {
      const instanceId = `${card.id}-${Date.now()}-${index}`;

      // Create minimal card instance (all types use same format now)
      const cardInstance: CardInstance = {
        id: instanceId,
        cardId: card.id,
        currentXP: 0, // Start at 0 XP (level 1)
      };

      cardInstances.push(cardInstance);

      // Add to player's deck (up to DECK_SIZE cards)
      if (playerDeck.length < DECK_SIZE) {
        playerDeck.push(cardInstance.id);
      }
    });

    return playerDeck;
  }

  /**
   * Add card reward to collection (minimal format)
   */
  addCardReward(card: any, cardInstances: CardInstance[], index: number): void {
    const instanceId = `${card.id}-reward-${Date.now()}-${index}`;

    // Create minimal card instance (all types use same format)
    const cardInstance: CardInstance = {
      id: instanceId,
      cardId: card.id,
      currentXP: 0, // New cards start at 0 XP (level 1)
    };

    cardInstances.push(cardInstance);
  }

}
