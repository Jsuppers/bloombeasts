/**
 * Mission 02: Fire Trial
 * Learn to handle aggressive Fire deck strategies
 */

import { Mission } from '../types';
import { buildFireDeck } from '../../../engine/utils/deckBuilder';

export const mission02: Mission = {
  id: 'mission-02',
  name: 'Fire Trial',
  description: 'Face the heat of battle against an aggressive Fire affinity opponent.',
  storyText: 'The volcanic fields await. Can you withstand the scorching assault of the Fire Beasts?',
  difficulty: 'easy',
  level: 2,

  opponentDeck: buildFireDeck(),
  opponentAI: {
    name: 'Ember Apprentice',
    difficulty: 'easy',
    personality: 'aggressive',
    aggressiveness: 0.6,
    resourceManagement: 0.4,
    targetPriority: 'strongest',
    abilityUsage: 0.3,
    behaviors: [
      {
        trigger: 'high-nectar',
        condition: 5,
        action: 'summon-rush',
      },
    ],
  },

  objectives: [
    {
      type: 'defeat-opponent',
      description: 'Defeat the Ember Apprentice',
    },
    {
      type: 'maintain-health',
      target: 15,
      description: 'Win with at least 15 health remaining',
    },
  ],

  specialRules: [
    {
      id: 'burn-field',
      name: 'Scorched Earth',
      description: 'All Bloom Beasts take 1 burn damage at the end of each turn',
      effect: 'burn-damage',
    },
  ],

  rewards: {
    guaranteedXP: 75,
    bonusXPChance: 0.4,
    bonusXPAmount: 35,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.8,
      },
      {
        cardPool: 'affinity',
        affinity: 'Fire',
        minAmount: 1,
        maxAmount: 1,
        dropChance: 0.3,
      },
    ],
    nectarReward: 15,
  },

  timesCompleted: 0,
  unlocked: false,
};