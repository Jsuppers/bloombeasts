/**
 * Mission 12: Blazefinch
 * Fire Affinity Mission
 */

import { Mission } from '../types';
import { buildFireDeck } from '../../../engine/utils/deckBuilder';

export const mission12: Mission = {
  id: 'mission-12',
  name: 'Blazefinch',
  description: 'Soar through the flames to face the swift Blazefinch.',
  difficulty: 'expert',
  level: 12,
  affinity: 'Fire',
  beastId: 'Blazefinch',

  opponentDeck: buildFireDeck(),

  rewards: {
    guaranteedXP: 160,
    bonusXPChance: 0.6,
    bonusXPAmount: 80,
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
    nectarReward: 65,
  },

  timesCompleted: 0,
  unlocked: false,
};
