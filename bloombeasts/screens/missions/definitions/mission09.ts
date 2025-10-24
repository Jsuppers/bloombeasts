/**
 * Mission 09: Magmite
 * Fire Affinity Mission
 */

import { Mission } from '../types';
import { buildFireDeck } from '../../../engine/utils/deckBuilder';

export const mission09: Mission = {
  id: 'mission-09',
  name: 'Magmite',
  description: 'Brave the flames to challenge the fierce Magmite.',
  difficulty: 'hard',
  level: 9,
  affinity: 'Fire',
  beastId: 'Magmite',

  opponentDeck: () => buildFireDeck(),

  rewards: {
    guaranteedXP: 130,
    bonusXPChance: 0.5,
    bonusXPAmount: 65,
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
