/**
 * Mission 02: Fuzzlet
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

  opponentDeck: buildForestDeck(),

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
    nectarReward: 15,
  },

  timesCompleted: 0,
  unlocked: false,
};
