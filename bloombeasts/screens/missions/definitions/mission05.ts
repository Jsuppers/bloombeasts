/**
 * Mission 05: Bubblefin
 * Water Affinity Mission
 */

import { Mission } from '../types';
import { buildWaterDeck } from '../../../engine/utils/deckBuilder';

export const mission05: Mission = {
  id: 'mission-05',
  name: 'Bubblefin',
  description: 'Dive deep to battle the nimble Bubblefin.',
  difficulty: 'normal',
  level: 5,
  affinity: 'Water',
  beastId: 'Bubblefin',

  opponentDeck: buildWaterDeck(),

  rewards: {
    guaranteedXP: 90,
    bonusXPChance: 0.5,
    bonusXPAmount: 45,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.7,
      },
    ],
    nectarReward: 30,
  },

  timesCompleted: 0,
  unlocked: false,
};
