/**
 * Mission 01: Training Grounds
 * Beginner mission to teach basic mechanics
 */

import { Mission } from '../types';
import { buildForestDeck } from '../../../engine/utils/deckBuilder';

export const mission01: Mission = {
  id: 'mission-01',
  name: 'Training Grounds',
  description: 'Learn the basics of Bloom Beast battles in this introductory mission.',
  storyText: 'Welcome to the Garden! Your first opponent awaits in the training grounds. Show them what you\'ve learned!',
  difficulty: 'beginner',
  level: 1,

  opponentDeck: buildForestDeck(),
  opponentAI: {
    name: 'Training Dummy',
    difficulty: 'beginner',
    personality: 'defensive',
    aggressiveness: 0.2,
    resourceManagement: 0.3,
    targetPriority: 'random',
    abilityUsage: 0.1,
  },

  objectives: [
    {
      type: 'defeat-opponent',
      description: 'Defeat the training dummy',
    },
  ],

  rewards: {
    guaranteedXP: 50,
    bonusXPChance: 0.5,
    bonusXPAmount: 25,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 1.0, // Guaranteed for first mission
      },
    ],
    nectarReward: 10,
  },

  firstTimeBonus: {
    guaranteedXP: 100,
    bonusXPChance: 1.0,
    bonusXPAmount: 50,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 3,
        maxAmount: 3,
        dropChance: 1.0,
      },
    ],
    nectarReward: 25,
  },

  timesCompleted: 0,
  unlocked: true, // First mission is always unlocked
};