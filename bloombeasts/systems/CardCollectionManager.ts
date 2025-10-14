/**
 * CardCollectionManager - Manages card operations and transformations
 * Handles card display conversion, leveling, abilities, deck building, and XP awards
 */

import { CardCollection } from '../screens/cards/CardCollection';
import { CardInstance } from '../screens/cards/types';
import { LevelingSystem } from '../engine/systems/LevelingSystem';
import { BloomBeastCard, AnyCard } from '../engine/types/core';
import { getAllCards } from '../engine/cards';
import { getStarterDeck } from '../engine/utils/deckBuilder';
import { Logger } from '../engine/utils/Logger';
import { DECK_SIZE } from '../engine/constants/gameRules';

export interface CardDisplay {
  id: string;
  name: string;
  type: string;
  affinity?: string;
  cost?: number;
  level: number;
  experience: number;
  experienceRequired?: number;
  count: number;
  baseAttack?: number;
  currentAttack?: number;
  baseHealth?: number;
  currentHealth?: number;
  ability?: { name: string; description: string; };
  description?: string;
  counters?: Array<{ type: string; amount: number }>;
}

export class CardCollectionManager {
  private levelingSystem: LevelingSystem;

  constructor() {
    this.levelingSystem = new LevelingSystem();
  }

  /**
   * Convert a CardInstance to CardDisplay format
   * This centralizes all the logic for enriching card instances with definition data
   */
  cardInstanceToDisplay(card: CardInstance): CardDisplay {
    const allCardDefs = getAllCards();
    const cardDef = allCardDefs.find((c: any) => c && c.id === card.cardId);

    // Build base display card with common properties
    const displayCard: CardDisplay = this.buildBaseCardDisplay(card, cardDef);

    // Add type-specific fields
    this.addTypeSpecificFields(displayCard, card, cardDef);

    return displayCard;
  }

  /**
   * Build base card display with common properties
   */
  private buildBaseCardDisplay(card: CardInstance, cardDef: any): CardDisplay {
    const displayCard: CardDisplay = {
      id: card.id,
      name: card.name,
      type: card.type,
      affinity: card.affinity,
      cost: card.cost,
      level: card.level,
      experience: card.currentXP || 0,
      experienceRequired: this.calculateExperienceRequired(card, cardDef),
      count: 1,
    };

    // Copy titleColor from card definition if present (applies to all card types)
    if (cardDef && cardDef.titleColor) {
      (displayCard as any).titleColor = cardDef.titleColor;
    }

    return displayCard;
  }

  /**
   * Calculate experience required for next level
   */
  private calculateExperienceRequired(card: CardInstance, cardDef: any): number {
    if (!card.level) return 0;

    if (card.type === 'Bloom') {
      // For Bloom beasts, use the LevelingSystem
      return this.levelingSystem.getXPRequirement(card.level as any, cardDef as BloomBeastCard | undefined) || 0;
    } else {
      // For Magic/Trap/Habitat/Buff cards, use simple formula (level * 100)
      return card.level * 100;
    }
  }

  /**
   * Add type-specific fields to card display
   */
  private addTypeSpecificFields(displayCard: CardDisplay, card: CardInstance, cardDef: any): void {
    switch (card.type) {
      case 'Bloom':
        this.addBloomCardFields(displayCard, card);
        break;
      case 'Trap':
        this.addTrapCardFields(displayCard, card, cardDef);
        break;
      case 'Magic':
        this.addMagicCardFields(displayCard, card);
        break;
      case 'Habitat':
      case 'Buff':
        this.addHabitatBuffCardFields(displayCard, cardDef);
        break;
    }
  }

  /**
   * Add Bloom-specific fields to card display
   */
  private addBloomCardFields(displayCard: CardDisplay, card: CardInstance): void {
    displayCard.baseAttack = card.baseAttack;
    displayCard.currentAttack = card.currentAttack;
    displayCard.baseHealth = card.baseHealth;
    displayCard.currentHealth = card.currentHealth;
    displayCard.ability = card.ability;
  }

  /**
   * Add Trap-specific fields to card display
   */
  private addTrapCardFields(displayCard: CardDisplay, card: CardInstance, cardDef: any): void {
    if (cardDef && cardDef.description) {
      displayCard.ability = {
        name: 'Trap Card',
        description: cardDef.description
      };
    } else if (card.effects && card.effects.length > 0) {
      // Fallback to effects if no description found
      displayCard.ability = {
        name: 'Trap Card',
        description: card.effects.join('. ')
      };
    }
  }

  /**
   * Add Magic-specific fields to card display
   */
  private addMagicCardFields(displayCard: CardDisplay, card: CardInstance): void {
    const effectDescs = this.getEffectDescriptions(card);
    if (effectDescs.length > 0) {
      displayCard.ability = {
        name: card.type + ' Card',
        description: effectDescs.join('. ')
      };
    }
  }

  /**
   * Add Habitat/Buff-specific fields to card display
   */
  private addHabitatBuffCardFields(displayCard: CardDisplay, cardDef: any): void {
    if (cardDef && cardDef.description) {
      displayCard.description = cardDef.description;
    }
  }

  /**
   * Get abilities for a card based on its level
   */
  getAbilitiesForLevel(cardInstance: CardInstance): { ability: any} {
    // Get the base card definition
    const allCards = getAllCards();
    const cardDef = allCards.find((card: any) =>
      card && card.id === cardInstance.cardId
    ) as BloomBeastCard | undefined;

    if (!cardDef || cardDef.type !== 'Bloom') {
      return {
        ability: cardInstance.ability
      };
    }

    const level = cardInstance.level || 1;
    let ability = cardDef.ability;

    // Apply ability upgrades based on level
    if (cardDef.levelingConfig?.abilityUpgrades) {
      const upgrades = cardDef.levelingConfig.abilityUpgrades;

      // Check each upgrade level (4, 7, 9) up to current level
      if (level >= 4 && upgrades[4]) {
        ability = upgrades[4].ability || ability;
      }
      if (level >= 7 && upgrades[7]) {
        ability = upgrades[7].ability || ability;
      }
      if (level >= 9 && upgrades[9]) {
        ability = upgrades[9].ability || ability;
      }
    }

    return { ability };
  }

  /**
   * Get player's deck cards for battle
   */
  getPlayerDeckCards(playerDeck: string[], cardCollection: CardCollection): AnyCard[] {
    const deckCards: AnyCard[] = [];
    const allCardDefs = getAllCards();

    // Convert all cards from player's deck
    for (const cardId of playerDeck) {
      const cardInstance = cardCollection.getCard(cardId);

      if (cardInstance) {
        if (cardInstance.type === 'Bloom') {
          // Get the correct abilities for the card's level
          const abilities = this.getAbilitiesForLevel(cardInstance);

          // Convert CardInstance to BloomBeastCard format for battle
          const bloomCard: BloomBeastCard = {
            id: cardInstance.cardId,
            instanceId: cardInstance.id, // Used for unique identification in battle
            name: cardInstance.name,
            type: 'Bloom',
            affinity: cardInstance.affinity || 'Forest',
            cost: cardInstance.cost,
            baseAttack: cardInstance.baseAttack || 0,
            baseHealth: cardInstance.baseHealth || 0,
            ability: abilities.ability,
            level: cardInstance.level || 1, // Include level for beast instance
            levelingConfig: {} as any, // Not used in battle
          } as any;

          deckCards.push(bloomCard);
        } else {
          // For non-Bloom cards, find the original card definition
          const originalCard = allCardDefs.find((card: any) =>
            card && card.id === cardInstance.cardId
          );

          if (originalCard) {
            // Use the original card definition for battle
            deckCards.push(originalCard as AnyCard);
          } else {
            // Fallback: create a simple card structure
            Logger.warn(`Card definition not found for ${cardInstance.cardId}, creating fallback`);
            const fallbackCard: any = {
              id: cardInstance.cardId,
              name: cardInstance.name,
              type: cardInstance.type,
              cost: cardInstance.cost || 0,
              affinity: cardInstance.affinity,
            };

            // Add type-specific properties
            if (cardInstance.type === 'Magic' || cardInstance.type === 'Trap') {
              fallbackCard.effects = [];
            } else if (cardInstance.type === 'Habitat') {
              fallbackCard.onPlayEffects = [];
              fallbackCard.ongoingEffects = [];
            }

            deckCards.push(fallbackCard);
          }
        }
      }
    }

    return deckCards;
  }

  /**
   * Award experience to all cards in the player's deck after battle victory
   * Card XP is distributed evenly across all cards in the deck
   */
  awardDeckExperience(totalCardXP: number, playerDeck: string[], cardCollection: CardCollection): void {
    const allCardDefs = getAllCards();

    // Distribute XP evenly across all cards in deck
    const xpPerCard = Math.floor(totalCardXP / playerDeck.length);

    // Award XP to each card in the deck
    for (const cardId of playerDeck) {
      const cardInstance = cardCollection.getCard(cardId);

      if (!cardInstance) continue;

      // Add XP
      cardInstance.currentXP = (cardInstance.currentXP || 0) + xpPerCard;

      // Check for level up
      let leveledUp = false;

      if (cardInstance.type === 'Bloom') {
        // For Bloom beasts, use the LevelingSystem
        const cardDef = allCardDefs.find((c: any) => c && c.id === cardInstance.cardId) as BloomBeastCard | undefined;

        if (cardDef) {
          let currentLevel = cardInstance.level || 1;
          let currentXP = cardInstance.currentXP;

          // Keep leveling up while possible
          while (currentLevel < 9) {
            const nextLevel = (currentLevel + 1) as any;
            const xpRequired = this.levelingSystem.getXPRequirement(currentLevel as any, cardDef);

            if (xpRequired !== null && currentXP >= xpRequired) {
              // Level up!
              currentXP -= xpRequired;
              currentLevel = nextLevel;

              // Apply stat gains
              const statGain = this.levelingSystem.getStatGain(currentLevel as any, cardDef);
              cardInstance.currentAttack = (cardInstance.currentAttack || 0) + statGain.attackGain;
              cardInstance.currentHealth = (cardInstance.currentHealth || 0) + statGain.healthGain;
              cardInstance.baseAttack = (cardInstance.baseAttack || 0) + statGain.attackGain;
              cardInstance.baseHealth = (cardInstance.baseHealth || 0) + statGain.healthGain;

              leveledUp = true;
            } else {
              break;
            }
          }

          // Update the card instance
          cardInstance.level = currentLevel;
          cardInstance.currentXP = currentXP;

          // Update ability if there's an upgrade at this level
          if (leveledUp) {
            const abilities = this.getAbilitiesForLevel(cardInstance);
            cardInstance.ability = abilities.ability;
          }
        }
      } else {
        // For Magic/Trap/Habitat/Buff cards, use steep exponential leveling
        // Formula: XP = 20 * (2.0 ^ (level - 1))
        const nonBloomXPRequirements = [0, 20, 40, 80, 160, 320, 640, 1280, 2560];

        let currentLevel = cardInstance.level || 1;
        let currentXP = cardInstance.currentXP;

        // Keep leveling up while possible
        while (currentLevel < 9) {
          const xpRequired = nonBloomXPRequirements[currentLevel];

          if (currentXP >= xpRequired) {
            // Level up!
            currentXP -= xpRequired;
            currentLevel++;
            leveledUp = true;
          } else {
            break;
          }
        }

        // Update the card instance
        cardInstance.level = currentLevel;
        cardInstance.currentXP = currentXP;
      }

      if (leveledUp) {
        Logger.info(`${cardInstance.name} leveled up to level ${cardInstance.level}!`);
      }
    }
  }

  /**
   * Initialize starting collection
   */
  async initializeStartingCollection(cardCollection: CardCollection, playerDeck: string[]): Promise<string[]> {
    // Give player one starter deck worth of cards - default to Forest
    const starterDeck = getStarterDeck('Forest');

    starterDeck.cards.forEach((card, index) => {
      const baseId = `${card.id}-${Date.now()}-${index}`;

      if (card.type === 'Bloom') {
        // Process Bloom Beast cards
        const beastCard = card as BloomBeastCard;
        const cardInstance: CardInstance = {
          id: baseId,
          cardId: beastCard.id,
          name: beastCard.name,
          type: 'Bloom',
          affinity: beastCard.affinity,
          cost: beastCard.cost,
          level: 1,
          currentXP: 0,
          baseAttack: beastCard.baseAttack,
          currentAttack: beastCard.baseAttack,
          baseHealth: beastCard.baseHealth,
          currentHealth: beastCard.baseHealth,
          ability: beastCard.ability ? {
            name: (beastCard.ability as any).name || '',
            description: (beastCard.ability as any).description || ''
          } : undefined,
        };
        cardCollection.addCard(cardInstance);
        // Add to player's deck (up to DECK_SIZE cards)
        if (playerDeck.length < DECK_SIZE) {
          playerDeck.push(cardInstance.id);
        }
      } else {
        // Process Magic, Trap, and Habitat cards
        const cardInstance: CardInstance = {
          id: baseId,
          cardId: card.id,
          name: card.name,
          type: card.type,
          affinity: (card as any).affinity,
          cost: card.cost || 0,
          level: 1,           // All cards start at level 1
          currentXP: 0,       // All cards start with 0 XP
          // Add simplified effect descriptions for display
          effects: this.getEffectDescriptions(card),
          ability: undefined, // Non-Bloom cards use effects instead
        };
        cardCollection.addCard(cardInstance);
        // Add to player's deck (up to DECK_SIZE cards)
        if (playerDeck.length < DECK_SIZE) {
          playerDeck.push(cardInstance.id);
        }
      }
    });

    return playerDeck;
  }

  /**
   * Add card reward to collection
   */
  addCardReward(card: any, cardCollection: CardCollection, index: number): void {
    const baseId = `${card.id}-reward-${Date.now()}-${index}`;

    if (card.type === 'Bloom') {
      // Convert Bloom Beast card rewards to CardInstance for collection
      const beastCard = card as BloomBeastCard;
      const cardInstance: CardInstance = {
        id: baseId,
        cardId: beastCard.id,
        name: beastCard.name,
        type: 'Bloom',
        affinity: beastCard.affinity,
        cost: beastCard.cost,
        level: 1,
        currentXP: 0,
        baseAttack: beastCard.baseAttack,
        currentAttack: beastCard.baseAttack,
        baseHealth: beastCard.baseHealth,
        currentHealth: beastCard.baseHealth,
        ability: beastCard.ability ? {
          name: (beastCard.ability as any).name || '',
          description: (beastCard.ability as any).description || ''
        } : undefined,
      };
      cardCollection.addCard(cardInstance);
    } else {
      // Convert Magic, Trap, and Habitat card rewards to CardInstance
      const cardInstance: CardInstance = {
        id: baseId,
        cardId: card.id,
        name: card.name,
        type: card.type,
        affinity: card.affinity,
        cost: card.cost || 0,
        level: 1,           // All cards start at level 1
        currentXP: 0,       // All cards start with 0 XP
        effects: this.getEffectDescriptions(card),
        ability: undefined,
      };
      cardCollection.addCard(cardInstance);
    }
  }

  /**
   * Get simplified effect descriptions for Magic/Trap/Habitat cards
   */
  getEffectDescriptions(card: any): string[] {
    const allCardDefs = getAllCards();
    const lookupId = card.cardId || card.id;
    const cardDef = allCardDefs.find((c: any) => c && c.id === lookupId);

    let descriptions: string[] = [];

    switch (card.type) {
      case 'Magic':
        descriptions = this.getMagicCardDescriptions(card, cardDef);
        break;
      case 'Trap':
        descriptions = this.getTrapCardDescriptions(card, cardDef);
        break;
      case 'Habitat':
        descriptions = this.getHabitatCardDescriptions(card, cardDef);
        break;
    }

    return descriptions.length > 0 ? descriptions : ['Special card'];
  }

  /**
   * Get descriptions for Magic card effects
   */
  private getMagicCardDescriptions(card: any, cardDef: any): string[] {
    const descriptions: string[] = [];

    // Check if card definition has a description first (preferred method)
    if (cardDef && cardDef.description) {
      descriptions.push(cardDef.description);
      return descriptions;
    }

    // Fallback to parsing effects
    const effects = cardDef?.effects || card.effects || [];
    effects.forEach((effect: any) => {
      descriptions.push(this.getEffectDescription(effect));
    });

    return descriptions;
  }

  /**
   * Get descriptions for Trap card effects
   */
  private getTrapCardDescriptions(card: any, cardDef: any): string[] {
    const descriptions: string[] = [];

    // For trap cards, use the card's description if available
    if (cardDef && cardDef.description) {
      descriptions.push(cardDef.description);
      return descriptions;
    }

    // Fallback to parsing effects
    const effects = cardDef?.effects || card.effects || [];
    effects.forEach((effect: any) => {
      const effectType = effect.type || '';
      if (effectType === 'nullify-effect' || effectType === 'NullifyEffect') {
        descriptions.push('Counter and negate effect');
      } else if (effectType === 'damage' || effectType === 'Damage') {
        descriptions.push(`Deal ${effect.value || 0} damage`);
      } else {
        const typeStr = effectType.toString().replace(/([A-Z])/g, ' $1').trim();
        descriptions.push(typeStr || 'Trap effect');
      }
    });

    return descriptions;
  }

  /**
   * Get descriptions for Habitat card effects
   */
  private getHabitatCardDescriptions(card: any, cardDef: any): string[] {
    const descriptions: string[] = [];

    if (card.onPlayEffects || cardDef?.onPlayEffects) {
      descriptions.push('On Play: Field transformation');
    }
    if (card.ongoingEffects || cardDef?.ongoingEffects) {
      descriptions.push('Ongoing: Field bonuses');
    }

    return descriptions;
  }

  /**
   * Convert a single effect to a readable description
   */
  private getEffectDescription(effect: any): string {
    const effectType = effect.type || '';

    if (effectType === 'draw-cards' || effectType === 'DrawCards') {
      return `Draw ${effect.value || 1} card(s)`;
    } else if (effectType === 'heal' || effectType === 'Heal') {
      return `Heal ${effect.value || 0}`;
    } else if (effectType === 'deal-damage' || effectType === 'Damage') {
      return `Deal ${effect.value || 0} damage`;
    } else if (effectType === 'modify-stats' || effectType === 'ModifyStats') {
      return `Modify stats by ${effect.attack || 0}/${effect.health || 0}`;
    } else if (effectType === 'gain-resource' || effectType === 'GainResource') {
      return `Gain ${effect.value || 1} ${effect.resource || 'nectar'}`;
    } else if (effectType === 'remove-counter' || effectType === 'RemoveCounter') {
      return `Remove ${effect.counter || 'all'} counters`;
    } else if (effectType === 'destroy' || effectType === 'Destroy') {
      return `Destroy target`;
    } else {
      // Try to create a readable description from the effect type
      const typeStr = effectType.toString().replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').trim();
      return typeStr || 'Special effect';
    }
  }
}
