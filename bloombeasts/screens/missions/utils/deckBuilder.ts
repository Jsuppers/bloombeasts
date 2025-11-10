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

// Module-level catalog manager reference
// Set via setCatalogManagerForMissions() which is called by CoreSystemsInitializer
let _missionDeckCatalogManager: any = null;

/**
 * Set the catalog manager instance for mission deck builder
 * Called during game initialization
 */
export function setCatalogManagerForMissions(catalogManager: any): void {
  _missionDeckCatalogManager = catalogManager;
  Logger.info('[MissionDeckBuilder] Catalog manager initialized');
}

/**
 * Get catalog manager (for internal use)
 */
function getCatalogManager(): any {
  if (!_missionDeckCatalogManager) {
    Logger.error('[MissionDeckBuilder] Catalog manager not available - was setCatalogManagerForMissions called?');
    return null;
  }
  return _missionDeckCatalogManager;
}

/**
 * Get catalog manager (for external use - e.g., mission17 Cluck Norris)
 * This allows mission definitions to access the catalog manager
 */
export function getCatalogManagerForMissions(): any {
  return _missionDeckCatalogManager;
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
    Logger.error(`[MissionDeckBuilder] CatalogManager is not available! Cannot build deck "${config.name}"`);
    return {
      name: config.name,
      affinity: config.affinity,
      cards: [],
      totalCards: 0,
    };
  }

  Logger.info(`[MissionDeckBuilder] Building deck "${config.name}" with ${config.cards.length} card types`);

  const deckCards: any[] = [];

  for (const spec of config.cards) {
    const cardDef = catalogManager.getCard(spec.cardId);

    if (!cardDef) {
      Logger.error(`[MissionDeckBuilder] Card not found in catalog: ${spec.cardId}`);
      continue;
    }

    Logger.debug(`[MissionDeckBuilder] Adding ${spec.count}x ${spec.cardId} to deck`);

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
