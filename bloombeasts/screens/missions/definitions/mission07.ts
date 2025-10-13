/**
 * Mission 07: Kelp Cub
 * Water Affinity Mission
 */

import { Mission } from '../types';
import { buildWaterDeck } from '../../../engine/utils/deckBuilder';

export const mission07: Mission = {
  id: 'mission-07',
  name: 'Kelp Cub',
  description: 'Navigate the kelp forest to face the Kelp Cub.',
  difficulty: 'normal',
  level: 7,
  affinity: 'Water',
  beastId: 'Kelp Cub',

  opponentDeck: buildWaterDeck(),

  rewards: {
    guaranteedXP: 110,
    bonusXPChance: 0.5,
    bonusXPAmount: 55,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.7,
      },
    ],
    nectarReward: 40,
  },

  timesCompleted: 0,
  unlocked: false,
};
