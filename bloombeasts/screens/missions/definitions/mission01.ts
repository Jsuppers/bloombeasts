/**
 * Mission 01: Rootling
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck } from '../../../engine/utils/deckBuilder';

export const mission01: Mission = {
  id: 'mission-01',
  name: 'Rootling',
  description: 'Battle the Rootling in the forest depths.',
  difficulty: 'beginner',
  level: 1,
  affinity: 'Forest',
  beastId: 'Rootling',

  opponentDeck: buildForestDeck(),

  rewards: {
    guaranteedXP: 50,
    bonusXPChance: 0.5,
    bonusXPAmount: 25,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 1.0,
      },
    ],
    nectarReward: 10,
  },

  timesCompleted: 0,
  unlocked: true, // First mission is always unlocked
};
