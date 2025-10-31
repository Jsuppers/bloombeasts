/**
 * Mission 01: Rootling
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck, DeckList } from '../../../engine/utils/deckBuilder';

export const mission01: Mission = {
  id: 'mission-01',
  name: 'Rootling',
  description: 'Battle the Rootling in the forest depths.',
  difficulty: 'beginner',
  level: 1,
  affinity: 'Forest',
  beastId: 'Rootling',

  // Use a function to build the deck on demand (after catalogs are loaded)
  opponentDeck: () => {
    // Get the catalog manager to access cards
    const game = (globalThis as any).bloomBeastsGame;
    if (!game?.catalogManager) {
      console.error('[mission01] Catalog manager not available');
      return { name: 'Rootling Deck', affinity: 'Forest', cards: [], totalCards: 0 };
    }

    // Get Rootling card
    const rootlingCard = game.catalogManager.getCard('rootling');
    if (!rootlingCard) {
      console.error('[mission01] Rootling card not found');
      return { name: 'Rootling Deck', affinity: 'Forest', cards: [], totalCards: 0 };
    }

    // Create a very simple deck for tutorial (3 weak Rootlings + 2 basic Sproutlings)
    const cards = [];

    // Add 3 Rootlings (weakened to 2/2 for tutorial)
    for (let i = 0; i < 3; i++) {
      cards.push({
        ...rootlingCard,
        baseAttack: 2,
        baseHealth: 2,
        instanceId: `rootling-${i + 1}`,
      });
    }

    // Add 2 Sproutlings if available (basic 1-cost cards)
    const sproutlingCard = game.catalogManager.getCard('sproutling');
    if (sproutlingCard) {
      for (let i = 0; i < 2; i++) {
        cards.push({
          ...sproutlingCard,
          instanceId: `sproutling-${i + 1}`,
        });
      }
    }

    return {
      name: 'Rootling (Tutorial)',
      affinity: 'Forest' as const,
      cards: cards,
      totalCards: cards.length,
    };
  },

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
    coinRewards: {
      minAmount: 50,
      maxAmount: 150,
      dropChance: 1.0,
    },
  },

  timesCompleted: 0,
  unlocked: true, // First mission is always unlocked
};
