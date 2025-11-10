/**
 * Asset Catalog Manager - Centralized Asset Management System
 *
 * This replaces the dynamic asset ID generation with a JSON-based catalog system.
 * All asset information (paths, Horizon IDs, metadata) is stored in JSON files
 * organized by affinity and category.
 *
 * PLATFORM-SPECIFIC LOADING:
 * - Web: See deployments/web/src/main.ts for fetch()-based loading
 * - Horizon: See deployments/horizon/src/AssetCatalogLoader.ts for fetchAsData()-based loading
 */

import { Affinity } from "./common/engine";

/**
 * Type of asset reference (image, audio, animation)
 */
export enum AssetReferenceType {
  Image = 'image',
  Audio = 'audio',
  Animation = 'animation'
}

/**
 * Type of asset entry (beast, buff, trap, magic, habitat, mission, ui)
 */
export enum AssetEntryType {
  Beast = 'beast',
  Buff = 'buff',
  Trap = 'trap',
  Magic = 'magic',
  Habitat = 'habitat',
  Mission = 'mission',
  UI = 'ui'
}

/**
 * UI asset category types
 */
export enum UICategory {
  Frame = 'frame',
  Button = 'button',
  Background = 'background',
  Icon = 'icon',
  Chest = 'chest',
  Container = 'container',
  CardTemplate = 'card-template',
  Upgrade = 'upgrade',
  Other = 'other'
}

/**
 * Catalog category types (for organizing asset catalogs)
 */
export enum CatalogCategory {
  Fire = 'fire',
  Forest = 'forest',
  Sky = 'sky',
  Water = 'water',
  Buff = 'buff',
  Trap = 'trap',
  Magic = 'magic',
  Common = 'common',
  Boss = 'boss'
}

/**
 * Affinity types (lowercase for JSON compatibility)
 * Maps to engine/types/core.ts Affinity enum
 */
export enum AffinityLowercase {
  Fire = 'fire',
  Forest = 'forest',
  Sky = 'sky',
  Water = 'water',
  Boss = 'boss'
}

export interface AssetReference {
  type: AssetReferenceType;
  horizonAssetId?: string; // Optional - only for Horizon deployment
  path: string; // Relative path from project root
  description?: string; // Optional description for documentation
}

export interface CardAssetEntry {
  id: string;
  type: AssetEntryType.Beast | AssetEntryType.Buff | AssetEntryType.Trap | AssetEntryType.Magic | AssetEntryType.Habitat;
  cardType?: 'Beast' | 'Magic' | 'Trap' | 'Buff'; // Game engine card type
  affinity?: AffinityLowercase; // For beasts and habitats
  data: {
    id: string;
    name: string;
    displayName?: string; // Display name if different from name
    description?: string;
    cost?: number;
    attack?: number;
    health?: number;
    tier?: number;
    // Allow any additional properties from card data
    [key: string]: any;
  };
  assets: AssetReference[];
}

export interface MissionAssetEntry {
  id: string;
  type: AssetEntryType.Mission;
  affinity?: AffinityLowercase;
  name: string;
  description: string;
  assets: AssetReference[];
}

export interface UIAssetEntry {
  id: string;
  type: AssetEntryType.UI;
  category: UICategory;
  name: string;
  description?: string;
  assets: AssetReference[];
}

export interface AssetCatalog {
  version: string;
  category: CatalogCategory;
  description: string;
  data: (CardAssetEntry | MissionAssetEntry | UIAssetEntry)[];
}

// Note: AssetCatalogManager now uses enums for type safety while maintaining
// compatibility with JSON catalog files through string enum values.
// The catalogs use lowercase enums that map to the JSON structure.

/**
 * AssetCatalogManager - Manages loading and querying of asset catalogs
 * NOT a singleton - create instances as needed
 */
export class AssetCatalogManager {
  private catalogs: Map<string, AssetCatalog> = new Map();
  private assetIndex: Map<string, CardAssetEntry | MissionAssetEntry | UIAssetEntry> = new Map();
  private pathToIdMap: Map<string, string> = new Map(); // Maps asset paths to IDs
  private horizonIdMap: Map<string, string> = new Map(); // Maps Horizon IDs to asset IDs

  /**
   * Load catalog from JSON object
   * Platform-specific code should fetch/load the JSON and pass it here
   */
  loadCatalog(catalog: AssetCatalog): void {
    const catalogKey = catalog.category;
    this.catalogs.set(catalogKey, catalog);

    // Index all assets by ID for quick lookup
    catalog.data.forEach(entry => {
      this.assetIndex.set(entry.id, entry);

      // Create reverse mappings
      entry.assets.forEach(asset => {
        this.pathToIdMap.set(asset.path, entry.id);
        if (asset.horizonAssetId) {
          this.horizonIdMap.set(asset.horizonAssetId, entry.id);
        }
      });
    });
  }

  /**
   * Get asset entry by ID
   */
  getAsset(id: string): CardAssetEntry | MissionAssetEntry | UIAssetEntry | undefined {
    return this.assetIndex.get(id);
  }

  /**
   * Get asset entry by path
   */
  getAssetByPath(path: string): CardAssetEntry | MissionAssetEntry | UIAssetEntry | undefined {
    const id = this.pathToIdMap.get(path);
    return id ? this.assetIndex.get(id) : undefined;
  }

  /**
   * Get asset entry by Horizon ID
   */
  getAssetByHorizonId(horizonId: string): CardAssetEntry | MissionAssetEntry | UIAssetEntry | undefined {
    const id = this.horizonIdMap.get(horizonId);
    return id ? this.assetIndex.get(id) : undefined;
  }

  /**
   * Get all assets of a specific type
   */
  getAssetsByType<T extends CardAssetEntry | MissionAssetEntry | UIAssetEntry>(
    type: AssetEntryType
  ): T[] {
    const results: T[] = [];
    this.assetIndex.forEach(entry => {
      if (entry.type === type || (entry.type === AssetEntryType.UI && type === AssetEntryType.UI)) {
        results.push(entry as T);
      } else if (type !== AssetEntryType.Mission && type !== AssetEntryType.UI && (entry as CardAssetEntry).type === type) {
        results.push(entry as T);
      }
    });
    return results;
  }

  /**
   * Get all cards by affinity
   */
  getCardsByAffinity(affinity: AffinityLowercase): CardAssetEntry[] {
    const results: CardAssetEntry[] = [];
    this.assetIndex.forEach(entry => {
      if (entry.type === AssetEntryType.Beast || entry.type === AssetEntryType.Habitat) {
        const card = entry as CardAssetEntry;
        if (card.affinity === affinity) {
          results.push(card);
        }
      }
    });
    return results;
  }

  /**
   * Get Horizon asset ID for a given asset
   */
  getHorizonAssetId(assetId: string, assetType: AssetReferenceType = AssetReferenceType.Image): string | undefined {
    const asset = this.getAsset(assetId);
    if (!asset) return undefined;

    const assetRef = asset.assets.find(a => a.type === assetType);
    return assetRef?.horizonAssetId;
  }

  /**
   * Get local path for a given asset
   */
  getAssetPath(assetId: string, assetType: AssetReferenceType = AssetReferenceType.Image): string | undefined {
    const asset = this.getAsset(assetId);
    if (!asset) return undefined;

    const assetRef = asset.assets.find(a => a.type === assetType);
    return assetRef?.path;
  }

  /**
   * Get all assets for a catalog category
   */
  getCatalog(category: string): AssetCatalog | undefined {
    return this.catalogs.get(category);
  }

  /**
   * Build asset mappings for web platform
   */
  getWebAssetMappings(): {
    images: Record<string, string>,
    sounds: Record<string, string>
  } {
    const images: Record<string, string> = {};
    const sounds: Record<string, string> = {};

    this.assetIndex.forEach((entry, id) => {
      entry.assets.forEach(asset => {
        // Only use the first asset of each type for the entry
        if (asset.type === AssetReferenceType.Image && !images[id]) {
          images[id] = asset.path;
        } else if (asset.type === AssetReferenceType.Audio && !sounds[id]) {
          sounds[id] = asset.path;
        }
      });
    });

    return { images, sounds };
  }

  /**
   * Build asset mappings for Horizon platform
   */
  getHorizonAssetMappings(): {
    images: Record<string, string>,
    sounds: Record<string, string>
  } {
    const images: Record<string, string> = {};
    const sounds: Record<string, string> = {};

    this.assetIndex.forEach((entry, id) => {
      entry.assets.forEach(asset => {
        if (asset.horizonAssetId) {
          // Only use the first asset of each type for the entry
          if (asset.type === AssetReferenceType.Image && !images[id]) {
            images[id] = asset.horizonAssetId;
          } else if (asset.type === AssetReferenceType.Audio && !sounds[id]) {
            sounds[id] = asset.horizonAssetId;
          }
        }
      });
    });

    return { images, sounds };
  }

  /**
   * Get all loaded catalog categories
   */
  getLoadedCategories(): string[] {
    return Array.from(this.catalogs.keys());
  }

  /**
   * Get total number of indexed assets (for debugging)
   */
  getTotalIndexedAssets(): number {
    return this.assetIndex.size;
  }

  /**
   * Get all card data from loaded catalogs
   * Returns the actual card definitions (data property) from all card entries
   */
  getAllCardData(): any[] {
    const cards: any[] = [];

    this.assetIndex.forEach(entry => {
      // Only include card entries (beast, magic, trap, buff, habitat)
      const isCardEntry = entry.type === AssetEntryType.Beast || entry.type === AssetEntryType.Magic ||
          entry.type === AssetEntryType.Trap || entry.type === AssetEntryType.Buff || entry.type === AssetEntryType.Habitat;

      if (isCardEntry) {
        const cardEntry = entry as CardAssetEntry;
        // Add rarity for reward system (same logic as old getAllCards)
        const cardData: any = { ...cardEntry.data };

        if (cardEntry.type === AssetEntryType.Beast) {
          // Assign rarity based on energy cost
          const cost = cardData.cost || 0;
          if (cardData.affinity === Affinity.Boss) {
            cardData.rarity = 'boss';
          } else if (cost >= 5) {
            cardData.rarity = 'rare';
          } else if (cost >= 3) {
            cardData.rarity = 'uncommon';
          } else {
            cardData.rarity = 'common';
          }
        } else {
          // Non-beast cards are common by default
          cardData.rarity = 'common';
        }

        cards.push(cardData);
      }
    });

    return cards;
  }

  /**
   * Get a specific card by ID
   */
  getCard<T = any>(cardId: string): T | undefined {
    const allCards = this.getAllCardData();
    return allCards.find((card: any) => card.id === cardId) as T | undefined;
  }

  /**
   * Get all buff cards from the catalog
   */
  getAllBuffCards(): any[] {
    const buffEntries = this.getAssetsByType(AssetEntryType.Buff);
    return buffEntries.map((entry: any) => entry.data);
  }

  /**
   * Clear all loaded catalogs
   */
  clear(): void {
    this.catalogs.clear();
    this.assetIndex.clear();
    this.pathToIdMap.clear();
    this.horizonIdMap.clear();
  }
}