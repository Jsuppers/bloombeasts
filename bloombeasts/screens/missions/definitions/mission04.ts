/**
 * Mission 04: Sky Supremacy
 * Face mobility and utility challenges from Sky affinity
 */

import { Mission } from '../types';
import { buildSkyDeck } from '../../../engine/utils/deckBuilder';

export const mission04: Mission = {
  id: 'mission-04',
  name: 'Sky Supremacy',
  description: 'Battle in the clouds against swift and elusive Sky Beasts.',
  storyText: 'High above the garden, where the winds never rest, aerial supremacy awaits those brave enough to ascend.',
  difficulty: 'normal',
  level: 4,

  opponentDeck: buildSkyDeck(),
  opponentAI: {
    name: 'Wind Dancer',
    difficulty: 'normal',
    personality: 'strategic',
    aggressiveness: 0.5,
    resourceManagement: 0.7,
    targetPriority: 'strategic',
    abilityUsage: 0.6,
    behaviors: [
      {
        trigger: 'empty-field',
        action: 'summon-rush',
      },
      {
        trigger: 'turn-count',
        condition: 10,
        action: 'all-out-attack',
      },
    ],
  },

  objectives: [
    {
      type: 'defeat-opponent',
      description: 'Defeat the Wind Dancer',
    },
    {
      type: 'deal-damage',
      target: 40,
      description: 'Deal at least 40 total damage',
    },
  ],

  specialRules: [
    {
      id: 'high-winds',
      name: 'High Winds',
      description: 'All Bloom Beasts gain +1 attack but -1 health',
      effect: 'random-effects',
    },
  ],

  rewards: {
    guaranteedXP: 125,
    bonusXPChance: 0.5,
    bonusXPAmount: 50,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 2,
        maxAmount: 3,
        dropChance: 0.7,
      },
      {
        cardPool: 'uncommon',
        minAmount: 1,
        maxAmount: 1,
        dropChance: 0.4,
      },
    ],
    nectarReward: 25,
  },

  timesCompleted: 0,
  unlocked: false,
};