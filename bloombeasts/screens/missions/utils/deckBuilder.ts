/**
 * Mission Deck Builder Utilities
 * Centralized deck construction for mission definitions
 */

import { Logger } from '../../../common/engine/utils/Logger';
import type { DeckList, DeckType } from '../../../common/engine/utils/deckBuilder';

/**
 * Card specification for deck building
 */
export interface CardSpec {
  cardId: string;
  count: number;
}

/**
 * Get catalog manager from global game instance
 */
function getCatalogManager(): any {
  const game = (globalThis as any).bloomBeastsGame;
  if (!game?.catalogManager) {
    Logger.error('[MissionDeckBuilder] Catalog manager not available');
    return null;
  }
  return game.catalogManager;
}

/**
 * Create a mission deck with specified cards
 *
 * @example
 * createMissionDeck({
 *   name: 'Mushroomancer Pack',
 *   affinity: 'Forest',
 *   cards: [{ cardId: 'mushroomancer', count: 20 }]
 * })
 */
export function createMissionDeck(config: {
  name: string;
  affinity: DeckType;
  cards: CardSpec[];
}): DeckList {
  const catalogManager = getCatalogManager();

  if (!catalogManager) {
    return {
      name: config.name,
      affinity: config.affinity,
      cards: [],
      totalCards: 0,
    };
  }

  const deckCards: any[] = [];

  for (const spec of config.cards) {
    const cardDef = catalogManager.getCard(spec.cardId);

    if (!cardDef) {
      Logger.error(`[MissionDeckBuilder] Card not found: ${spec.cardId}`);
      continue;
    }

    // Create multiple instances of this card
    for (let i = 1; i <= spec.count; i++) {
      deckCards.push({
        ...cardDef,
        instanceId: `${spec.cardId}-${i}`,
      });
    }
  }

  return {
    name: config.name,
    affinity: config.affinity,
    cards: deckCards,
    totalCards: deckCards.length,
  };
}

/**
 * Create a simple deck with just one card type (common for early missions)
 */
export function createSimpleDeck(
  deckName: string,
  affinity: DeckType,
  cardId: string,
  count: number
): DeckList {
  return createMissionDeck({
    name: deckName,
    affinity,
    cards: [{ cardId, count }],
  });
}
