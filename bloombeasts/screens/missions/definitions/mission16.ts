/**
 * Mission 16: Aero Moth
 * Sky Affinity Mission
 */

import { Mission } from '../types';
import { buildSkyDeck } from '../../../engine/utils/deckBuilder';

export const mission16: Mission = {
  id: 'mission-16',
  name: 'Aero Moth',
  description: 'Dance among the high winds with the elusive Aero Moth.',
  difficulty: 'expert',
  level: 16,
  affinity: 'Sky',
  beastId: 'Aero Moth',

  opponentDeck: buildSkyDeck(),

  rewards: {
    guaranteedXP: 200,
    bonusXPChance: 0.6,
    bonusXPAmount: 100,
    cardRewards: [
      {
        cardPool: 'uncommon',
        minAmount: 2,
        maxAmount: 2,
        dropChance: 0.7,
      },
      {
        cardPool: 'rare',
        minAmount: 1,
        maxAmount: 1,
        dropChance: 0.5,
      },
    ],
    nectarReward: 85,
  },

  timesCompleted: 0,
  unlocked: false,
};
