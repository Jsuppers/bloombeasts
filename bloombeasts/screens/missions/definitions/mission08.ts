/**
 * Mission 08: Aqua Pebble
 * Water Affinity Mission
 */

import { Mission } from '../types';
import { buildWaterDeck } from '../../../engine/utils/deckBuilder';

export const mission08: Mission = {
  id: 'mission-08',
  name: 'Aqua Pebble',
  description: 'Test your might against the resilient Aqua Pebble.',
  difficulty: 'hard',
  level: 8,
  affinity: 'Water',
  beastId: 'Aqua Pebble',

  opponentDeck: buildWaterDeck(),

  rewards: {
    guaranteedXP: 120,
    bonusXPChance: 0.5,
    bonusXPAmount: 60,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.7,
      },
      {
        cardPool: 'uncommon',
        minAmount: 1,
        maxAmount: 1,
        dropChance: 0.4,
      },
    ],
    nectarReward: 45,
  },

  timesCompleted: 0,
  unlocked: false,
};
