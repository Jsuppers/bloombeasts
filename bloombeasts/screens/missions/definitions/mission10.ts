/**
 * Mission 10: Cinder Pup
 * Fire Affinity Mission
 */

import { Mission } from '../types';
import { buildFireDeck } from '../../../engine/utils/deckBuilder';

export const mission10: Mission = {
  id: 'mission-10',
  name: 'Cinder Pup',
  description: 'Face the energetic Cinder Pup in volcanic fields.',
  difficulty: 'hard',
  level: 10,
  affinity: 'Fire',
  beastId: 'Cinder Pup',

  opponentDeck: buildFireDeck(),

  rewards: {
    guaranteedXP: 140,
    bonusXPChance: 0.5,
    bonusXPAmount: 70,
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
        dropChance: 0.5,
      },
    ],
  },

  timesCompleted: 0,
  unlocked: false,
};
