/**
 * Mission 04: Leaf Sprite
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck } from '../../../engine/utils/deckBuilder';

export const mission04: Mission = {
  id: 'mission-04',
  name: 'Leaf Sprite',
  description: 'Test your skills against the agile Leaf Sprite.',
  difficulty: 'easy',
  level: 4,
  affinity: 'Forest',
  beastId: 'Leaf Sprite',

  opponentDeck: buildForestDeck(),

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
    nectarReward: 25,
  },

  timesCompleted: 0,
  unlocked: false,
};
