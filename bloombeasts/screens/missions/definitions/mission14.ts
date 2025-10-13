/**
 * Mission 14: Gale Glider
 * Sky Affinity Mission
 */

import { Mission } from '../types';
import { buildSkyDeck } from '../../../engine/utils/deckBuilder';

export const mission14: Mission = {
  id: 'mission-14',
  name: 'Gale Glider',
  description: 'Race through the windstorm against the agile Gale Glider.',
  difficulty: 'expert',
  level: 14,
  affinity: 'Sky',
  beastId: 'Gale Glider',

  opponentDeck: buildSkyDeck(),

  rewards: {
    guaranteedXP: 180,
    bonusXPChance: 0.6,
    bonusXPAmount: 90,
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
    nectarReward: 75,
  },

  timesCompleted: 0,
  unlocked: false,
};
