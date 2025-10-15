/**
 * Mission 17: The Bloom Master
 * Final Boss Mission
 */

import { Mission } from '../types';
import { getAllStarterDecks } from '../../../engine/utils/deckBuilder';

// Create the ultimate deck with cards from all affinities
const getMasterDeck = () => {
  const allDecks = getAllStarterDecks();
  const masterCards: any[] = [];

  // Take the best 7-8 cards from each affinity
  allDecks.forEach(deck => {
    masterCards.push(...deck.cards.slice(0, 8));
  });

  // Shuffle and limit to 30 cards
  const finalCards = masterCards.sort(() => Math.random() - 0.5).slice(0, 30);

  return {
    name: 'Bloom Master Deck',
    affinity: 'Forest' as const, // Uses all affinities but default to Forest
    cards: finalCards,
    totalCards: finalCards.length,
  };
};

export const mission17: Mission = {
  id: 'mission-17',
  name: 'Bloom Master',
  description: 'Face the legendary Bloom Master who commands all four affinities.',
  difficulty: 'expert',
  level: 17,
  affinity: 'Boss',
  beastId: 'The Bloom Master',

  opponentDeck: getMasterDeck(),

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
