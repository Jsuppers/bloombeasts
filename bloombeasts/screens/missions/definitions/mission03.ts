/**
 * Mission 03: Mosslet
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { createMissionDeck } from '../utils/deckBuilder';

export const mission03: Mission = {
  id: 'mission-03',
  name: 'Mosslet',
  description: 'Challenge the sturdy Mosslet in the mossy glen.',
  difficulty: 'easy',
  level: 3,
  affinity: 'Forest',
  beastId: 'Mosslet',

  opponentDeck: () =>
    createMissionDeck({
      name: 'Forest Basics',
      affinity: 'Forest' as const,
      cards: [
        { cardId: 'mosslet', count: 5 },
        { cardId: 'rootling', count: 5 },
        { cardId: 'nectar-block', count: 5 },
      ],
    }),

  rewards: {
    guaranteedXP: 70,
    bonusXPChance: 0.5,
    bonusXPAmount: 35,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.8,
      },
    ],
    coinRewards: {
      minAmount: 100,
      maxAmount: 200,
      dropChance: 1.0,
    },
  },

  timesCompleted: 0,
  unlocked: false,
};
