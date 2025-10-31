/**
 * Mission 17: Cluck Norris
 * Boss Mission
 */

import { Mission } from '../types';
import { DeckList } from '../../../engine/utils/deckBuilder';
import { BloomBeastCard } from '../../../engine/types/core';

// Get Cluck Norris deck - 3 level 9 Cluck Norris beasts
const getCluckNorrisDeck = (): DeckList => {
  // This function will be called after catalogs are loaded
  // Access the catalog manager through the global game instance
  const game = (globalThis as any).bloomBeastsGame;
  if (!game?.catalogManager) {
    console.error('[mission17] Catalog manager not available');
    return {
      name: 'Cluck Norris Deck',
      affinity: 'Forest',
      cards: [],
      totalCards: 0,
    };
  }

  // Get the Cluck Norris card from the boss catalog
  const cluckNorrisCard = game.catalogManager.getCard('cluck-norris') as BloomBeastCard;

  if (!cluckNorrisCard) {
    console.error('[mission17] Cluck Norris card not found in catalog');
    return {
      name: 'Cluck Norris Deck',
      affinity: 'Forest',
      cards: [],
      totalCards: 0,
    };
  }

  // Create 3 instances of Cluck Norris at level 9
  const cluckNorrisCards: BloomBeastCard[] = [];
  for (let i = 1; i <= 3; i++) {
    cluckNorrisCards.push({
      ...cluckNorrisCard,
      instanceId: `cluck-norris-${i}`,
      // Keep base stats at 99/99 as defined in the catalog
    });
  }

  return {
    name: 'Cluck Norris Deck',
    affinity: 'Forest',
    cards: cluckNorrisCards,
    totalCards: cluckNorrisCards.length,
  };
};

export const mission17: Mission = {
  id: 'mission-17',
  name: 'Cluck Norris',
  description: 'Face the legendary Cluck Norris, the ultimate rooster warrior!',
  difficulty: 'expert',
  level: 17,
  affinity: 'Boss',
  beastId: 'Cluck Norris',

  opponentDeck: () => getCluckNorrisDeck(),

  rewards: {
    guaranteedXP: 500,
    bonusXPChance: 0.9,
    bonusXPAmount: 250,
    cardRewards: [
      {
        cardPool: 'rare',
        minAmount: 3,
        maxAmount: 4,
        dropChance: 0.9,
      },
      {
        cardPool: 'rare',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.5,
      },
    ],
  },

  timesCompleted: 0,
  unlocked: false,
};
