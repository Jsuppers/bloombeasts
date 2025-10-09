/**
 * Mission 06: Elemental Chaos
 * Face random affinity challenges
 */

import { Mission } from '../types';
import { getAllStarterDecks } from '../../../engine/utils/deckBuilder';

export const mission06: Mission = {
  id: 'mission-06',
  name: 'Elemental Chaos',
  description: 'Battle against unpredictable elemental forces that shift between affinities.',
  storyText: 'The garden\'s energies are in chaos! Face an opponent who commands all elements with equal mastery.',
  difficulty: 'normal',
  level: 6,

  // Random deck selection for variety
  opponentDeck: getAllStarterDecks()[Math.floor(Math.random() * 4)],
  opponentAI: {
    name: 'Chaos Wielder',
    difficulty: 'normal',
    personality: 'chaotic',
    aggressiveness: Math.random() * 0.7 + 0.3, // Random between 0.3-1.0
    resourceManagement: 0.5,
    targetPriority: 'random',
    abilityUsage: 0.6,
    behaviors: [
      {
        trigger: 'turn-count',
        condition: 5,
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
      description: 'Defeat the Chaos Wielder',
    },
    {
      type: 'survive-turns',
      target: 10,
      description: 'Survive the chaos for 10 turns',
    },
  ],

  specialRules: [
    {
      id: 'chaos-field',
      name: 'Chaotic Energy',
      description: 'Random effects occur each turn',
      effect: 'random-effects',
    },
  ],

  rewards: {
    guaranteedXP: 175,
    bonusXPChance: 0.6,
    bonusXPAmount: 75,
    cardRewards: [
      {
        cardPool: 'any',
        minAmount: 2,
        maxAmount: 4,
        dropChance: 0.8,
      },
    ],
    nectarReward: 35,
  },

  timesCompleted: 0,
  unlocked: false,
};