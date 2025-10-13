/**
 * Mission 11: Charcoil
 * Fire Affinity Mission
 */

import { Mission } from '../types';
import { buildFireDeck } from '../../../engine/utils/deckBuilder';

export const mission11: Mission = {
  id: 'mission-11',
  name: 'Charcoil',
  description: 'Battle the smoldering Charcoil in the ember wastes.',
  difficulty: 'hard',
  level: 11,
  affinity: 'Fire',
  beastId: 'Charcoil',

  opponentDeck: buildFireDeck(),

  rewards: {
    guaranteedXP: 150,
    bonusXPChance: 0.6,
    bonusXPAmount: 75,
    cardRewards: [
      {
        cardPool: 'uncommon',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.7,
      },
    ],
    nectarReward: 60,
  },

  timesCompleted: 0,
  unlocked: false,
};
