/**
 * Mission 01: Rootling
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck, DeckList } from '../../../engine/utils/deckBuilder';

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
    // Get the catalog manager to access cards
    const game = (globalThis as any).bloomBeastsGame;
    if (!game?.catalogManager) {
      console.error('[mission01] Catalog manager not available');
      return { name: 'Rootling Deck', affinity: 'Forest', cards: [], totalCards: 0 };
    }

    // Get Rootling card and create a weakened version with only 1 HP
    const rootlingCard = game.catalogManager.getCard('rootling');
    if (!rootlingCard) {
      console.error('[mission01] Rootling card not found');
      return { name: 'Rootling Deck', affinity: 'Forest', cards: [], totalCards: 0 };
    }

    // Create a single Rootling with 1 HP (tutorial difficulty)
    const weakRootling = {
      ...rootlingCard,
      baseHealth: 1,
      instanceId: 'rootling-1',
    };

    return {
      name: 'Rootling (Tutorial)',
      affinity: 'Forest' as const,
      cards: [weakRootling],
      totalCards: 1,
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
