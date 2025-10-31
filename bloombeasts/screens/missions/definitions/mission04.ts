/**
 * Mission 04: Leaf Sprite
 * Forest Affinity Mission
 */

import { Mission } from '../types';
import { buildForestDeck } from '../../../engine/utils/deckBuilder';

export const mission04: Mission = {
  id: 'mission-04',
  name: 'Leaf Sprite',
  description: 'Test your skills against the agile Leaf Sprite.',
  difficulty: 'easy',
  level: 4,
  affinity: 'Forest',
  beastId: 'Leaf Sprite',

  opponentDeck: () => {
    // Get the catalog manager to access cards
    const game = (globalThis as any).bloomBeastsGame;
    if (!game?.catalogManager) {
      console.error('[mission04] Catalog manager not available');
      return { name: 'Leaf Sprite Deck', affinity: 'Forest', cards: [], totalCards: 0 };
    }

    // More advanced beginner deck with habitat
    const leafSpriteCard = game.catalogManager.getCard('leaf-sprite');
    const mushroomancerCard = game.catalogManager.getCard('mushroomancer');
    const nectarBlockCard = game.catalogManager.getCard('nectar-block');
    const ancientForestCard = game.catalogManager.getCard('ancient-forest');
    const powerUpCard = game.catalogManager.getCard('power-up');

    const cards = [];

    // Add 3 Leaf Sprites
    for (let i = 1; i <= 3; i++) {
      cards.push({ ...leafSpriteCard, instanceId: `leaf-sprite-${i}` });
    }

    // Add 2 Mushroomancers
    for (let i = 1; i <= 2; i++) {
      cards.push({ ...mushroomancerCard, instanceId: `mushroomancer-${i}` });
    }

    // Add 1 Ancient Forest habitat
    cards.push({ ...ancientForestCard, instanceId: 'ancient-forest-1' });

    // Add 5 Nectar Blocks
    for (let i = 1; i <= 5; i++) {
      cards.push({ ...nectarBlockCard, instanceId: `nectar-block-${i}` });
    }

    // Add 1 Power Up
    cards.push({ ...powerUpCard, instanceId: 'power-up-1' });

    return {
      name: 'Forest Advancement',
      affinity: 'Forest' as const,
      cards,
      totalCards: cards.length,
    };
  },

  rewards: {
    guaranteedXP: 80,
    bonusXPChance: 0.5,
    bonusXPAmount: 40,
    cardRewards: [
      {
        cardPool: 'common',
        minAmount: 1,
        maxAmount: 2,
        dropChance: 0.8,
      },
    ],
    coinRewards: {
      minAmount: 125,
      maxAmount: 225,
      dropChance: 1.0,
    },
  },

  timesCompleted: 0,
  unlocked: false,
};
