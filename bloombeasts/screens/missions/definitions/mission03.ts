/**
 * Mission 03: Mosslet
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck } from '../../../engine/utils/deckBuilder';

export const mission03: Mission = {
  id: 'mission-03',
  name: 'Mosslet',
  description: 'Challenge the sturdy Mosslet in the mossy glen.',
  difficulty: 'easy',
  level: 3,
  affinity: 'Forest',
  beastId: 'Mosslet',

  opponentDeck: buildForestDeck(),

  rewards: {
    guaranteedXP: 70,
    bonusXPChance: 0.5,
    bonusXPAmount: 35,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.8,
      },
    ],
  },

  timesCompleted: 0,
  unlocked: false,
};
