/**
 * Mission 05: Nature's Balance
 * Master resource generation and growth strategies
 */

import { Mission } from '../types';
import { buildForestDeck } from '../../../engine/utils/deckBuilder';

export const mission05: Mission = {
  id: 'mission-05',
  name: "Nature's Balance",
  description: 'Face a master of growth and resource generation in the ancient forest.',
  storyText: 'Deep in the oldest parts of the garden, where spores and roots intertwine, a master of growth awaits.',
  difficulty: 'normal',
  level: 5,

  opponentDeck: buildForestDeck(),
  opponentAI: {
    name: 'Grove Guardian',
    difficulty: 'normal',
    personality: 'balanced',
    aggressiveness: 0.4,
    resourceManagement: 0.8,
    targetPriority: 'strategic',
    abilityUsage: 0.7,
    behaviors: [
      {
        trigger: 'high-nectar',
        condition: 7,
        action: 'ability-spam',
      },
    ],
  },

  objectives: [
    {
      type: 'defeat-opponent',
      description: 'Defeat the Grove Guardian',
    },
    {
      type: 'summon-beasts',
      target: 8,
      description: 'Summon at least 8 Bloom Beasts',
    },
    {
      type: 'use-abilities',
      target: 5,
      description: 'Activate 5 bloom abilities',
    },
  ],

  specialRules: [
    {
      id: 'rapid-growth',
      name: 'Rapid Growth',
      description: 'All Bloom Beasts gain +1 HP at the start of each turn',
      effect: 'heal-per-turn',
    },
  ],

  rewards: {
    guaranteedXP: 150,
    bonusXPChance: 0.6,
    bonusXPAmount: 60,
    cardRewards: [
      {
        cardPool: 'uncommon',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.6,
      },
      {
        cardPool: 'affinity',
        affinity: 'Forest',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.4,
      },
    ],
    nectarReward: 30,
  },

  timesCompleted: 0,
  unlocked: false,
};