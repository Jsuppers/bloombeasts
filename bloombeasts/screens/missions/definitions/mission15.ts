/**
 * Mission 15: Star Bloom
 * Sky Affinity Mission
 */

import { Mission } from '../types';
import { buildSkyDeck } from '../../../engine/utils/deckBuilder';

export const mission15: Mission = {
  id: 'mission-15',
  name: 'Star Bloom',
  description: 'Reach for the stars to challenge the mystical Star Bloom.',
  difficulty: 'expert',
  level: 15,
  affinity: 'Sky',
  beastId: 'Star Bloom',

  opponentDeck: () => buildSkyDeck(),

  rewards: {
    guaranteedXP: 190,
    bonusXPChance: 0.6,
    bonusXPAmount: 95,
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
        dropChance: 0.5,
      },
    ],
  },

  timesCompleted: 0,
  unlocked: false,
};
