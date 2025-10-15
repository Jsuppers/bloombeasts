/**
 * Mission 06: Dewdrop Drake
 * Water Affinity Mission
 */

import { Mission } from '../types';
import { buildWaterDeck } from '../../../engine/utils/deckBuilder';

export const mission06: Mission = {
  id: 'mission-06',
  name: 'Dewdrop Drake',
  description: 'Confront the serene Dewdrop Drake by the waterfall.',
  difficulty: 'normal',
  level: 6,
  affinity: 'Water',
  beastId: 'Dewdrop Drake',

  opponentDeck: buildWaterDeck(),

  rewards: {
    guaranteedXP: 100,
    bonusXPChance: 0.5,
    bonusXPAmount: 50,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.7,
      },
    ],
  },

  timesCompleted: 0,
  unlocked: false,
};
