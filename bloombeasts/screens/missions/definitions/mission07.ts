/**
 * Mission 07: Inferno Gauntlet
 * Hard difficulty Fire challenge with aggressive AI
 */

import { Mission } from '../types';
import { buildFireDeck } from '../../../engine/utils/deckBuilder';

export const mission07: Mission = {
  id: 'mission-07',
  name: 'Inferno Gauntlet',
  description: 'Survive the relentless assault of a Fire master in this challenging battle.',
  storyText: 'The volcanic core erupts with fury! Only the strongest can withstand this inferno.',
  difficulty: 'hard',
  level: 7,

  opponentDeck: buildFireDeck(),
  opponentAI: {
    name: 'Pyroclastic Lord',
    difficulty: 'hard',
    personality: 'aggressive',
    aggressiveness: 0.8,
    resourceManagement: 0.7,
    targetPriority: 'strategic',
    abilityUsage: 0.8,
    behaviors: [
      {
        trigger: 'low-health',
        condition: 15,
        action: 'all-out-attack',
      },
      {
        trigger: 'high-nectar',
        condition: 6,
        action: 'ability-spam',
      },
    ],
  },

  objectives: [
    {
      type: 'defeat-opponent',
      description: 'Defeat the Pyroclastic Lord',
    },
    {
      type: 'deal-damage',
      target: 60,
      description: 'Deal 60 total damage',
    },
  ],

  turnLimit: 25,

  specialRules: [
    {
      id: 'intense-heat',
      name: 'Intense Heat',
      description: 'All units take 2 burn damage per turn',
      effect: 'burn-damage',
    },
    {
      id: 'fast-nectar',
      name: 'Molten Resources',
      description: 'Both players gain +1 nectar per turn',
      effect: 'fast-nectar',
    },
  ],

  rewards: {
    guaranteedXP: 250,
    bonusXPChance: 0.7,
    bonusXPAmount: 100,
    cardRewards: [
      {
        cardPool: 'uncommon',
        minAmount: 2,
        maxAmount: 3,
        dropChance: 0.7,
      },
      {
        cardPool: 'rare',
        minAmount: 1,
        maxAmount: 1,
        dropChance: 0.3,
      },
    ],
    nectarReward: 50,
  },

  timesCompleted: 0,
  unlocked: false,
};