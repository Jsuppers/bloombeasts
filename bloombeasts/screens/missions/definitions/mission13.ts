/**
 * Mission 13: Cirrus Floof
 * Sky Affinity Mission
 */

import { Mission } from '../types';
import { buildSkyDeck } from '../../../engine/utils/deckBuilder';

export const mission13: Mission = {
  id: 'mission-13',
  name: 'Cirrus Floof',
  description: 'Ascend to the clouds to meet the gentle Cirrus Floof.',
  difficulty: 'expert',
  level: 13,
  affinity: 'Sky',
  beastId: 'Cirrus Floof',

  opponentDeck: () => buildSkyDeck(),

  rewards: {
    guaranteedXP: 170,
    bonusXPChance: 0.6,
    bonusXPAmount: 85,
    cardRewards: [
      {
        cardPool: 'uncommon',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.7,
      },
      {
        cardPool: 'rare',
        minAmount: 1,
        maxAmount: 1,
        dropChance: 0.4,
      },
    ],
  },

  timesCompleted: 0,
  unlocked: false,
};
