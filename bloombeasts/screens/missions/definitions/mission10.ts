/**
 * Mission 10: The Bloom Master
 * Ultimate challenge - Face the legendary Bloom Master
 */

import { Mission } from '../types';
import { getAllStarterDecks } from '../../../engine/utils/deckBuilder';

// Create the ultimate deck with cards from all affinities
const getMasterDeck = () => {
  const allDecks = getAllStarterDecks();
  const masterCards: any[] = [];

  // Take the best 7-8 cards from each affinity
  allDecks.forEach(deck => {
    masterCards.push(...deck.cards.slice(0, 8));
  });

  // Shuffle and limit to 30 cards
  const finalCards = masterCards.sort(() => Math.random() - 0.5).slice(0, 30);

  return {
    name: 'Bloom Master Deck',
    affinity: 'Forest' as const, // Uses all affinities but default to Forest
    cards: finalCards,
    totalCards: finalCards.length,
  };
};

export const mission10: Mission = {
  id: 'mission-10',
  name: 'The Bloom Master',
  description: 'Face the legendary Bloom Master who commands all four affinities with perfect harmony.',
  storyText: 'At the heart of the Eternal Garden dwells the Bloom Master, keeper of all affinities. No one has ever defeated this legendary guardian. Will you be the first to claim victory and earn the title of Champion?',
  difficulty: 'expert',
  level: 10,

  opponentDeck: getMasterDeck(),
  opponentAI: {
    name: 'Bloom Master',
    difficulty: 'expert',
    personality: 'strategic',
    aggressiveness: 0.75,
    resourceManagement: 0.95,
    targetPriority: 'strategic',
    abilityUsage: 0.95,
    behaviors: [
      {
        trigger: 'turn-count',
        condition: 1,
        action: 'all-out-attack',
      },
      {
        trigger: 'turn-count',
        condition: 3,
        action: 'ability-spam',
      },
      {
        trigger: 'high-nectar',
        condition: 4,
        action: 'summon-rush',
      },
      {
        trigger: 'low-health',
        condition: 20,
        action: 'all-out-attack',
      },
      {
        trigger: 'low-health',
        condition: 30,
        action: 'play-defensive',
      },
    ],
  },

  objectives: [
    {
      type: 'defeat-opponent',
      description: 'Defeat the Bloom Master - The Ultimate Challenge',
    },
    {
      type: 'maintain-health',
      target: 15,
      description: 'Optional: Win with at least 15 health remaining',
    },
  ],

  turnLimit: 30,

  specialRules: [
    {
      id: 'masters-domain',
      name: "Master's Domain",
      description: 'The Bloom Master starts with 40 health instead of 30',
      effect: 'random-effects',
    },
    {
      id: 'affinity-mastery',
      name: 'Affinity Mastery',
      description: 'All Bloom Master cards have +1/+1',
      effect: 'random-effects',
    },
    {
      id: 'eternal-garden',
      name: 'Eternal Garden',
      description: 'The Bloom Master gains +1 nectar per turn',
      effect: 'fast-nectar',
    },
    {
      id: 'champions-trial',
      name: "Champion's Trial",
      description: 'If you win, gain double rewards',
      effect: 'double-xp',
    },
  ],

  rewards: {
    guaranteedXP: 500,
    bonusXPChance: 0.9,
    bonusXPAmount: 250,
    cardRewards: [
      {
        cardPool: 'rare',
        minAmount: 3,
        maxAmount: 4,
        dropChance: 0.9,
      },
      {
        cardPool: 'rare',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.3,
      },
      {
        cardPool: 'rare',
        minAmount: 1,
        maxAmount: 1,
        dropChance: 0.1, // Special champion-tier card for first victory
      },
    ],
    nectarReward: 100,
  },

  timesCompleted: 0,
  unlocked: false,
};