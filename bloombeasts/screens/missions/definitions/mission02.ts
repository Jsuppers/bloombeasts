/**
 * Mission 02: Mosslet
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { createSimpleDeck } from '../utils/deckBuilder';

export const mission02: Mission = {
  id: 'mission-02',
  name: 'Mushroomancer',
  description: 'Face the mystical Mushroomancer among the trees.',
  difficulty: 'beginner',
  level: 2,
  affinity: 'Forest',
  beastId: 'Mushroomancer',

  opponentDeck: () => createSimpleDeck('Mushroomancer Pack', 'Forest' as const, 'mushroomancer', 20),

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
