/**
 * Mission 02: Mushroomancer
 * Forest Affinity Mission
 */

import { Affinity } from '../../../common/engine';
import { Mission } from '../types';
import { createMissionDeck } from '../utils/deckBuilder';

export const mission02: Mission = {
  id: 'mission-02',
  name: 'Mushroomancer',
  description: 'Face the mystical Mushroomancer among the trees.',
  difficulty: 'beginner',
  level: 2,
  affinity: 'Forest',
  beastId: 'Mushroomancer',

  opponentDeck: () =>
    createMissionDeck({
      name: 'Mushroom Grove',
      affinity: 'Forest' as const,
      cards: [
        { cardId: 'mushroomancer', count: 6 },
        { cardId: 'rootling', count: 4 },
        { cardId: 'nectar-block', count: 5 },
      ],
    }),

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
        affinity: Affinity.Forest,
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
