/**
 * Mission 02: Mosslet
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck } from '../../../engine/utils/deckBuilder';

export const mission02: Mission = {
  id: 'mission-02',
  name: 'Mushroomancer',
  description: 'Face the mystical Mushroomancer among the trees.',
  difficulty: 'beginner',
  level: 2,
  affinity: 'Forest',
  beastId: 'Mushroomancer',

  opponentDeck: () => {
    // Get the catalog manager to access cards
    const game = (globalThis as any).bloomBeastsGame;
    if (!game?.catalogManager) {
      console.error('[mission02] Catalog manager not available');
      return { name: 'Mushroomancer Deck', affinity: 'Forest', cards: [], totalCards: 0 };
    }

    // Simple beginner deck: 3 Mushroomancers only
    const mushroomancerCard = game.catalogManager.getCard('mushroomancer');
    if (!mushroomancerCard) {
      console.error('[mission02] Mushroomancer card not found');
      return { name: 'Mushroomancer Deck', affinity: 'Forest', cards: [], totalCards: 0 };
    }

    const cards = [];
    for (let i = 1; i <= 20; i++) {
      cards.push({
        ...mushroomancerCard,
        instanceId: `mushroomancer-${i}`,
      });
    }

    return {
      name: 'Mushroomancer Pack',
      affinity: 'Forest' as const,
      cards,
      totalCards: cards.length,
    };
  },

  rewards: {
    guaranteedXP: 60,
    bonusXPChance: 0.5,
    bonusXPAmount: 30,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.9,
      },
    ],
    coinRewards: {
      minAmount: 75,
      maxAmount: 175,
      dropChance: 1.0,
    },
  },

  timesCompleted: 0,
  unlocked: false,
};
