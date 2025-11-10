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

/**
 * Create a catalog for non-affinity cards (Magic, Trap, Buff)
 * These catalogs don't have an affinity but still need proper categorization
 */
export function createNonAffinityCatalog(
  category: CatalogCategory.Magic | CatalogCategory.Trap | CatalogCategory.Buff,
  cards: CardDefinition[],
  version: string = "1.0.0"
): AssetCatalog {
  const categoryNames = {
    [CatalogCategory.Magic]: 'Magic',
    [CatalogCategory.Trap]: 'Trap',
    [CatalogCategory.Buff]: 'Buff',
  };

  return {
    version,
    category,
    description: `${categoryNames[category]} cards`,
    data: cards.map(buildCatalogEntry)
  };
}

/**
 * UI Asset Helpers
 */

/**
 * Create affinity UI assets (chests, icons, habitats, missions)
 * Eliminates ~50 lines of boilerplate per affinity
 */
export function createAffinityUIAssets(
  affinity: Affinity.Fire | Affinity.Water | Affinity.Forest | Affinity.Sky,
  horizonIds: {
    mission: string;
    chestClosed: string;
    chestOpened: string;
    icon: string;
    habitatTemplate: string;
  }
): any[] {
  const affinityLower = getAffinityLowercase(affinity);
  const affinityName = Affinity[affinity];

  return [
    // Mission asset
    {
      id: `${affinityLower}-mission`,
      type: AssetEntryType.Mission,
      affinity: affinityLower,
      name: `${affinityName} Mission`,
      description: `${affinityName} affinity mission`,
      assets: [{
        type: AssetReferenceType.Image,
        horizonAssetId: horizonIds.mission,
        path: `assets/images/boss_${affinityLower}-boss.png`
      }]
    },
    // Chest closed
    {
      id: `${affinityLower}-chest-closed`,
      type: AssetEntryType.UI,
      category: 'chest' as any,
      name: `${affinityName} Chest Closed`,
      assets: [{
        type: AssetReferenceType.Image,
        horizonAssetId: horizonIds.chestClosed,
        path: `assets/images/chest_${affinityLower}-chest-closed.png`
      }]
    },
    // Chest opened
    {
      id: `${affinityLower}-chest-opened`,
      type: AssetEntryType.UI,
      category: 'chest' as any,
      name: `${affinityName} Chest Opened`,
      assets: [{
        type: AssetReferenceType.Image,
        horizonAssetId: horizonIds.chestOpened,
        path: `assets/images/chest_${affinityLower}-chest-opened.png`
      }]
    },
    // Icon
    {
      id: `${affinityLower}-icon`,
      type: AssetEntryType.UI,
      category: 'icon' as any,
      name: `${affinityName} Icon`,
      assets: [{
        type: AssetReferenceType.Image,
        horizonAssetId: horizonIds.icon,
        path: `assets/images/icon_${affinityLower}.png`
      }]
    },
    // Habitat template
    {
      id: `${affinityLower}-habitat`,
      type: AssetEntryType.UI,
      category: 'card-template' as any,
      name: `${affinityName} Habitat Card Template`,
      description: `Template overlay for ${affinityLower} habitat cards`,
      assets: [{
        type: AssetReferenceType.Image,
        horizonAssetId: horizonIds.habitatTemplate,
        path: `assets/images/cards_${affinityLower}_habitat-card.png`
      }]
    }
  ];
}
