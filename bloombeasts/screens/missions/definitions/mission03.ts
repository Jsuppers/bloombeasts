/**
 * Mission 03: Tidal Defense
 * Master defensive Water strategies and control tactics
 */

import { Mission } from '../types';
import { buildWaterDeck } from '../../../engine/utils/deckBuilder';

export const mission03: Mission = {
  id: 'mission-03',
  name: 'Tidal Defense',
  description: 'Learn the art of defense and control against a Water affinity master.',
  storyText: 'The deep waters hide ancient strategies. Can you weather the storm and turn the tide?',
  difficulty: 'easy',
  level: 3,

  opponentDeck: buildWaterDeck(),
  opponentAI: {
    name: 'Tide Keeper',
    difficulty: 'easy',
    personality: 'defensive',
    aggressiveness: 0.3,
    resourceManagement: 0.6,
    targetPriority: 'weakest',
    abilityUsage: 0.5,
    behaviors: [
      {
        trigger: 'low-health',
        condition: 10,
        action: 'play-defensive',
      },
    ],
  },

  objectives: [
    {
      type: 'defeat-opponent',
      description: 'Defeat the Tide Keeper',
    },
    {
      type: 'survive-turns',
      target: 15,
      description: 'Survive at least 15 turns',
    },
  ],

  turnLimit: 30,

  rewards: {
    guaranteedXP: 100,
    bonusXPChance: 0.5,
    bonusXPAmount: 40,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 3,
        dropChance: 0.7,
      },
      {
        cardPool: 'affinity',
        affinity: 'Water',
        minAmount: 1,
        maxAmount: 1,
        dropChance: 0.35,
      },
    ],
    nectarReward: 20,
  },

  timesCompleted: 0,
  unlocked: false,
};