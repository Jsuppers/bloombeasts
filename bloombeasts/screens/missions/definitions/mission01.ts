/**
 * Mission 01: Rootling
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck } from '../../../engine/utils/deckBuilder';

// test deck just has Rootling
const testDeck = buildForestDeck();
testDeck.cards = testDeck.cards.filter((card) => card.id === 'Rootling');
testDeck.totalCards = testDeck.cards.length;
console.log('testDeck', testDeck);

export const mission01: Mission = {
  id: 'mission-01',
  name: 'Rootling',
  description: 'Battle the Rootling in the forest depths.',
  difficulty: 'beginner',
  level: 1,
  affinity: 'Forest',
  beastId: 'Rootling',

  opponentDeck: testDeck, //buildForestDeck(),

  rewards: {
    guaranteedXP: 50,
    bonusXPChance: 0.5,
    bonusXPAmount: 25,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 1.0,
      },
    ],
    itemRewards: [
      {
        itemId: 'token',
        minAmount: 5,
        maxAmount: 15,
        dropChance: 0.8,
      },
      {
        itemId: 'diamond',
        minAmount: 1,
        maxAmount: 3,
        dropChance: 0.3,
      },
    ],
    nectarReward: 10,
  },

  timesCompleted: 0,
  unlocked: true, // First mission is always unlocked
};
