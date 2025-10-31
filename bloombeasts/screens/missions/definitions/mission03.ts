/**
 * Mission 03: Mosslet
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck } from '../../../engine/utils/deckBuilder';

export const mission03: Mission = {
  id: 'mission-03',
  name: 'Mosslet',
  description: 'Challenge the sturdy Mosslet in the mossy glen.',
  difficulty: 'easy',
  level: 3,
  affinity: 'Forest',
  beastId: 'Mosslet',

  opponentDeck: () => {
    // Get the catalog manager to access cards
    const game = (globalThis as any).bloomBeastsGame;
    if (!game?.catalogManager) {
      console.error('[mission03] Catalog manager not available');
      return { name: 'Mosslet Deck', affinity: 'Forest', cards: [], totalCards: 0 };
    }

    // Beginner deck: 2 Mosslets + 2 Rootlings + 3 Nectar Blocks
    const mossletCard = game.catalogManager.getCard('mosslet');
    const rootlingCard = game.catalogManager.getCard('rootling');
    const nectarBlockCard = game.catalogManager.getCard('nectar-block');

    const cards = [];

    // Add 2 Mosslets
    for (let i = 1; i <= 5; i++) {
      cards.push({ ...mossletCard, instanceId: `mosslet-${i}` });
    }

    // Add 2 Rootlings
    for (let i = 1; i <= 5; i++) {
      cards.push({ ...rootlingCard, instanceId: `rootling-${i}` });
    }

    // Add 3 Nectar Blocks
    for (let i = 1; i <= 5; i++) {
      cards.push({ ...nectarBlockCard, instanceId: `nectar-block-${i}` });
    }

    return {
      name: 'Forest Basics',
      affinity: 'Forest' as const,
      cards,
      totalCards: cards.length,
    };
  },

  rewards: {
    guaranteedXP: 70,
    bonusXPChance: 0.5,
    bonusXPAmount: 35,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.8,
      },
    ],
    coinRewards: {
      minAmount: 100,
      maxAmount: 200,
      dropChance: 1.0,
    },
  },

  timesCompleted: 0,
  unlocked: false,
};
