/**
 * Catalog Builder - Eliminates duplication across asset catalog files
 *
 * This utility provides a clean API for building asset catalogs without
 * repeating the same wrapper structure in every file.
 */

import type { AssetCatalog, CardAssetEntry } from '../../AssetCatalogManager';
import { AssetReferenceType, AssetEntryType, CatalogCategory, AffinityLowercase } from '../../AssetCatalogManager';
import { CardType, Affinity } from '../engine/types/core';
import type { BloomBeastCard, MagicCard, TrapCard, BuffCard, HabitatCard } from '../engine/types/core';

/**
 * Simplified card definition - just the data without wrapper boilerplate
 */
export interface CardDefinition {
  id: string;
  cardData: BloomBeastCard | MagicCard | TrapCard | BuffCard | HabitatCard;
  imagePath: string;
  horizonAssetId?: string;
}

/**
 * Get catalog category from affinity
 */
function getCategoryFromAffinity(affinity: Affinity): CatalogCategory {
  const categoryMap: Partial<Record<Affinity, CatalogCategory>> = {
    [Affinity.Fire]: CatalogCategory.Fire,
    [Affinity.Water]: CatalogCategory.Water,
    [Affinity.Forest]: CatalogCategory.Forest,
    [Affinity.Sky]: CatalogCategory.Sky,
    [Affinity.Generic]: CatalogCategory.Common,
    [Affinity.Boss]: CatalogCategory.Boss,
  };
  return categoryMap[affinity] || CatalogCategory.Common;
}

/**
 * Get lowercase affinity string from Affinity enum
 */
function getAffinityLowercase(affinity: Affinity): AffinityLowercase {
  const affinityMap: Partial<Record<Affinity, AffinityLowercase>> = {
    [Affinity.Fire]: AffinityLowercase.Fire,
    [Affinity.Water]: AffinityLowercase.Water,
    [Affinity.Forest]: AffinityLowercase.Forest,
    [Affinity.Sky]: AffinityLowercase.Sky,
    [Affinity.Generic]: AffinityLowercase.Boss,
    [Affinity.Boss]: AffinityLowercase.Boss,
  };
  return affinityMap[affinity] || AffinityLowercase.Boss;
}

/**
 * Get asset entry type from card type
 */
function getAssetEntryType(cardType: CardType): AssetEntryType {
  const typeMap: Record<CardType, AssetEntryType> = {
    [CardType.Beast]: AssetEntryType.Beast,
    [CardType.Magic]: AssetEntryType.Magic,
    [CardType.Trap]: AssetEntryType.Trap,
    [CardType.Buff]: AssetEntryType.Buff,
    [CardType.Habitat]: AssetEntryType.Habitat,
  };
  return typeMap[cardType];
}

/**
 * Get card type string from CardType enum
 */
function getCardTypeString(cardType: CardType): string {
  return CardType[cardType];
}

/**
 * Build a catalog entry from a card definition
 */
function buildCatalogEntry(card: CardDefinition): CardAssetEntry {
  const cardData = card.cardData;
  // Get affinity - Beast cards have affinity, others might not
  const affinity = 'affinity' in cardData && cardData.affinity !== undefined
    ? getAffinityLowercase(cardData.affinity as Affinity)
    : undefined;

  return {
    id: card.id,
    type: getAssetEntryType(cardData.type),
    cardType: getCardTypeString(cardData.type),
    affinity,
    data: cardData,
    assets: [
      {
        type: AssetReferenceType.Image,
        ...(card.horizonAssetId ? { horizonAssetId: card.horizonAssetId } : {}),
        path: card.imagePath,
      }
    ]
  } as CardAssetEntry;
}

/**
 * Create an asset catalog from card definitions
 *
 * @param affinity - The affinity/category for this catalog
 * @param cards - Array of simplified card definitions
 * @param version - Catalog version (defaults to "1.0.0")
 * @returns Complete AssetCatalog ready to export
 *
 * @example
 * export const fireAssets = createCatalog(Affinity.Fire, [
 *   {
 *     id: "blazefinch",
 *     cardData: { ...card definition... },
 *     imagePath: "assets/images/cards_fire_blazefinch.png",
 *     horizonAssetId: "3218250765004566"
 *   },
 *   // ... more cards
 * ]);
 */
export function createCatalog(
  affinity: Affinity,
  cards: CardDefinition[],
  version: string = "1.0.0"
): AssetCatalog {
  const category = getCategoryFromAffinity(affinity);
  const affinityName = Affinity[affinity];

  return {
    version,
    category,
    description: (affinity === Affinity.Generic || affinity === Affinity.Boss)
      ? "Common cards and assets"
      : `${affinityName} affinity cards and assets`,
    data: cards.map(buildCatalogEntry)
  };
}

/**
 * Create a card definition helper
 * Reduces boilerplate when defining cards
 */
export function defineCard(
  id: string,
  cardData: BloomBeastCard | MagicCard | TrapCard | BuffCard | HabitatCard,
  imagePath: string,
  horizonAssetId?: string
): CardDefinition {
  return {
    id,
    cardData,
    imagePath,
    horizonAssetId
  };
}
