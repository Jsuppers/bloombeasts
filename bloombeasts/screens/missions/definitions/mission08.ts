/**
 * Mission 08: Dual Elements
 * Face a master who wields two affinities
 */

import { Mission } from '../types';
import { buildFireDeck, buildWaterDeck } from '../../../engine/utils/deckBuilder';

// Mix fire and water cards for a unique challenge
const getDualDeck = () => {
  const fireDeck = buildFireDeck();
  const waterDeck = buildWaterDeck();

  // Take half from each deck
  const cards = [
    ...fireDeck.cards.slice(0, 15),
    ...waterDeck.cards.slice(0, 15),
  ];

  return {
    name: 'Dual Elements Deck',
    affinity: 'Fire' as const, // Primary affinity
    cards: cards,
    totalCards: cards.length,
  };
};

export const mission08: Mission = {
  id: 'mission-08',
  name: 'Dual Elements',
  description: 'Battle a master who has learned to harness both Fire and Water affinities.',
  storyText: 'Steam rises where fire meets water. Face an opponent who has mastered the impossible balance between opposing elements.',
  difficulty: 'hard',
  level: 8,

  opponentDeck: getDualDeck(),
  opponentAI: {
    name: 'Steam Master',
    difficulty: 'hard',
    personality: 'strategic',
    aggressiveness: 0.6,
    resourceManagement: 0.8,
    targetPriority: 'strategic',
    abilityUsage: 0.8,
    behaviors: [
      {
        trigger: 'turn-count',
        condition: 3,
        action: 'play-defensive',
      },
      {
        trigger: 'high-nectar',
        condition: 7,
        action: 'ability-spam',
      },
      {
        trigger: 'low-health',
        condition: 20,
        action: 'all-out-attack',
      },
    ],
  },

  objectives: [
    {
      type: 'defeat-opponent',
      description: 'Defeat the Steam Master',
    },
    {
      type: 'survive-turns',
      target: 20,
      description: 'Win before turn 20',
    },
    {
      type: 'maintain-health',
      target: 10,
      description: 'Keep at least 10 health',
    },
  ],

  turnLimit: 30,

  specialRules: [
    {
      id: 'elemental-flux',
      name: 'Elemental Flux',
      description: 'Fire and Water Beasts gain +1/+1 every 3 turns',
      effect: 'random-effects',
    },
    {
      id: 'steam-field',
      name: 'Steam Field',
      description: 'All abilities cost 1 less nectar',
      effect: 'fast-nectar',
    },
  ],

  rewards: {
    guaranteedXP: 300,
    bonusXPChance: 0.75,
    bonusXPAmount: 120,
    cardRewards: [
      {
        cardPool: 'uncommon',
        minAmount: 2,
        maxAmount: 3,
        dropChance: 0.8,
      },
      {
        cardPool: 'rare',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.4,
      },
    ],
    nectarReward: 60,
  },

  timesCompleted: 0,
  unlocked: false,
};