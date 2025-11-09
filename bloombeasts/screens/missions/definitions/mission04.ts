/**
 * Mission 04: Leaf Sprite
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { createMissionDeck } from '../utils/deckBuilder';

export const mission04: Mission = {
  id: 'mission-04',
  name: 'Leaf Sprite',
  description: 'Test your skills against the agile Leaf Sprite.',
  difficulty: 'easy',
  level: 4,
  affinity: 'Forest',
  beastId: 'Leaf Sprite',

  opponentDeck: () =>
    createMissionDeck({
      name: 'Forest Advancement',
      affinity: 'Forest' as const,
      cards: [
        { cardId: 'leaf-sprite', count: 6 },
        { cardId: 'mushroomancer', count: 6 },
        { cardId: 'ancient-forest', count: 1 },
        { cardId: 'nectar-block', count: 6 },
        { cardId: 'power-up', count: 1 },
      ],
    }),

  rewards: {
    guaranteedXP: 80,
    bonusXPChance: 0.5,
    bonusXPAmount: 40,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.8,
      },
    ],
    coinRewards: {
      minAmount: 125,
      maxAmount: 225,
      dropChance: 1.0,
    },
  },

  timesCompleted: 0,
  unlocked: false,
};
