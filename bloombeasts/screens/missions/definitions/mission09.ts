/**
 * Mission 09: The Ancient Guardian
 * Expert difficulty challenge against a powerful ancient beast
 */

import { Mission } from '../types';
import { buildForestDeck, buildSkyDeck } from '../../../engine/utils/deckBuilder';

// Create a powerful mixed deck
const getAncientDeck = () => {
  const forestDeck = buildForestDeck();
  const skyDeck = buildSkyDeck();

  // Cherry-pick the best cards from both decks
  const cards = [
    ...forestDeck.cards.slice(0, 15),
    ...skyDeck.cards.slice(0, 15),
  ];

  return {
    name: 'Ancient Guardian Deck',
    affinity: 'Forest' as const, // Primary affinity
    cards: cards,
    totalCards: cards.length,
  };
};

export const mission09: Mission = {
  id: 'mission-09',
  name: 'The Ancient Guardian',
  description: 'Challenge the ancient guardian who has protected the garden for centuries.',
  storyText: 'Deep within the oldest part of the garden stands a guardian as old as time itself. Its mastery of nature and sky is unmatched. Are you ready for the ultimate test?',
  difficulty: 'expert',
  level: 9,

  opponentDeck: getAncientDeck(),
  opponentAI: {
    name: 'Ancient Guardian',
    difficulty: 'expert',
    personality: 'strategic',
    aggressiveness: 0.7,
    resourceManagement: 0.9,
    targetPriority: 'strategic',
    abilityUsage: 0.9,
    behaviors: [
      {
        trigger: 'turn-count',
        condition: 5,
        action: 'summon-rush',
      },
      {
        trigger: 'high-nectar',
        condition: 5,
        action: 'ability-spam',
      },
      {
        trigger: 'low-health',
        condition: 25,
        action: 'play-defensive',
      },
      {
        trigger: 'low-health',
        condition: 15,
        action: 'all-out-attack',
      },
    ],
  },

  objectives: [
    {
      type: 'defeat-opponent',
      description: 'Defeat the Ancient Guardian',
    },
    {
      type: 'deal-damage',
      target: 80,
      description: 'Deal 80 total damage',
    },
    {
      type: 'survive-turns',
      target: 8,
      description: 'Survive at least 8 turns against the Guardian',
    },
  ],

  turnLimit: 25,

  specialRules: [
    {
      id: 'ancient-wisdom',
      name: 'Ancient Wisdom',
      description: 'The Guardian draws an extra card each turn',
      effect: 'random-effects',
    },
    {
      id: 'guardian-blessing',
      name: "Guardian's Blessing",
      description: 'All Guardian Beasts have +2 HP',
      effect: 'random-effects',
    },
    {
      id: 'natural-cycle',
      name: 'Natural Cycle',
      description: 'Both players regenerate 1 HP per turn',
      effect: 'heal-per-turn',
    },
  ],

  rewards: {
    guaranteedXP: 400,
    bonusXPChance: 0.8,
    bonusXPAmount: 150,
    cardRewards: [
      {
        cardPool: 'rare',
        minAmount: 2,
        maxAmount: 3,
        dropChance: 0.7,
      },
      {
        cardPool: 'rare',
        minAmount: 1,
        maxAmount: 1,
        dropChance: 0.15,
      },
    ],
    nectarReward: 80,
  },

  timesCompleted: 0,
  unlocked: false,
};