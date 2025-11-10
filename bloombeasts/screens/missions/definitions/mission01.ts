/**
 * Mission 01: Rootling
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck, DeckList } from '../../../common/engine/utils/deckBuilder';
import { Logger } from '../../../common/engine/utils/Logger';
import { Affinity } from '../../../common/engine';

export const mission01: Mission = {
  id: 'mission-01',
  name: 'Rootling',
  description: 'Battle the Rootling in the forest depths.',
  difficulty: 'beginner',
  level: 1,
  affinity: 'Forest',
  beastId: 'Rootling',

  // Use a function to build the deck on demand (after catalogs are loaded)
  opponentDeck: () => {
    // Use the proper Forest starter deck builder for a balanced deck
    const deck = buildForestDeck();

    // Safety check - return empty deck if builder failed
    if (!deck || deck.cards.length === 0) {
      Logger.error('[mission01] Failed to build Forest deck');
      return { name: 'Rootling Deck', affinity: 'Forest' as const, cards: [], totalCards: 0 };
    }

    // Override the name for tutorial context
    return {
      ...deck,
      name: 'Rootling (Tutorial Deck)',
    };
  },

  rewards: {
    guaranteedXP: 50,
    bonusXPChance: 0.5,
    bonusXPAmount: 25,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 1.0,
        affinity: Affinity.Forest,
      },
    ],
    coinRewards: {
      minAmount: 50,
      maxAmount: 150,
      dropChance: 1.0,
    },
  },

  timesCompleted: 0,
  unlocked: true, // First mission is always unlocked
};
