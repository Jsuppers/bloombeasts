/**
 * Asset Catalog Manager - Centralized Asset Management System
 *
 * This replaces the dynamic asset ID generation with a JSON-based catalog system.
 * All asset information (paths, Horizon IDs, metadata) is stored in JSON files
 * organized by affinity and category.
 */

export interface AssetReference {
  type: 'image' | 'audio' | 'animation';
  horizonAssetId?: string; // Optional - only for Horizon deployment
  path: string; // Relative path from project root
  description?: string; // Optional description for documentation
}

export interface CardAssetEntry {
  id: string;
  type: 'beast' | 'buff' | 'trap' | 'magic' | 'habitat';
  cardType?: 'Bloom' | 'Magic' | 'Trap' | 'Buff'; // Game engine card type
  affinity?: 'fire' | 'forest' | 'sky' | 'water'; // For beasts and habitats
  data: {
    id: string;
    name: string;
    displayName?: string; // Display name if different from name
    description?: string;
    cost?: number;
    attack?: number;
    health?: number;
    tier?: number;
    // Additional card properties can be added here
  };
  assets: AssetReference[];
}

export interface MissionAssetEntry {
  id: string;
  type: 'mission';
  affinity?: 'fire' | 'forest' | 'sky' | 'water' | 'boss';
  missionNumber: number;
  name: string;
  description: string;
  assets: AssetReference[];
}

export interface UIAssetEntry {
  id: string;
  type: 'ui';
  category: 'frame' | 'button' | 'background' | 'icon' | 'chest' | 'container' | 'other';
  name: string;
  description?: string;
  assets: AssetReference[];
}

export interface AssetCatalog {
  version: string;
  category: 'fire' | 'forest' | 'sky' | 'water' | 'buff' | 'trap' | 'magic' | 'common';
  description: string;
  data: (CardAssetEntry | MissionAssetEntry | UIAssetEntry)[];
}

/**
 * AssetCatalogManager - Manages loading and querying of asset catalogs
 */
export class AssetCatalogManager {
  private catalogs: Map<string, AssetCatalog> = new Map();
  private assetIndex: Map<string, CardAssetEntry | MissionAssetEntry | UIAssetEntry> = new Map();
  private pathToIdMap: Map<string, string> = new Map(); // Maps asset paths to IDs
  private horizonIdMap: Map<string, string> = new Map(); // Maps Horizon IDs to asset IDs

  /**
   * Load an asset catalog from JSON
   */
  async loadCatalog(catalogPath: string): Promise<void> {
    try {
      const response = await fetch(catalogPath);
      const catalog: AssetCatalog = await response.json();

      const catalogKey = catalog.category;
      this.catalogs.set(catalogKey, catalog);

      // Index all assets by ID for quick lookup
      catalog.data.forEach(entry => {
        this.assetIndex.set(entry.id, entry);

        // Create reverse mappings for quick lookups
        entry.assets.forEach(asset => {
          // Map path to entry ID
          this.pathToIdMap.set(asset.path, entry.id);

          // Map Horizon ID to entry ID (if available)
          if (asset.horizonAssetId) {
            this.horizonIdMap.set(asset.horizonAssetId, entry.id);
          }
        });
      });

      console.log(`Loaded ${catalog.category} catalog with ${catalog.data.length} entries`);
    } catch (error) {
      console.error(`Failed to load catalog ${catalogPath}:`, error);
      throw error;
    }
  }

  /**
   * Load catalog from JSON object (for testing or embedded catalogs)
   */
  loadCatalogFromJson(catalog: AssetCatalog): void {
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
   * Load all standard asset catalogs
   */
  async loadAllCatalogs(basePath: string = '/assets/catalogs'): Promise<void> {
    const catalogFiles = [
      'fireAssets.json',
      'forestAssets.json',
      'skyAssets.json',
      'waterAssets.json',
      'buffAssets.json',
      'trapAssets.json',
      'magicAssets.json',
      'commonAssets.json'
    ];

    await Promise.all(
      catalogFiles.map(file =>
        this.loadCatalog(`${basePath}/${file}`)
      )
    );
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
    type: 'beast' | 'buff' | 'trap' | 'magic' | 'habitat' | 'mission' | 'ui'
  ): T[] {
    const results: T[] = [];
    this.assetIndex.forEach(entry => {
      if (entry.type === type || (entry.type === 'ui' && type === 'ui')) {
        results.push(entry as T);
      } else if (type !== 'mission' && type !== 'ui' && (entry as CardAssetEntry).type === type) {
        results.push(entry as T);
      }
    });
    return results;
  }

  /**
   * Get all cards by affinity
   */
  getCardsByAffinity(affinity: 'fire' | 'forest' | 'sky' | 'water'): CardAssetEntry[] {
    const results: CardAssetEntry[] = [];
    this.assetIndex.forEach(entry => {
      if (entry.type === 'beast' || entry.type === 'habitat') {
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
  getHorizonAssetId(assetId: string, assetType: 'image' | 'audio' = 'image'): string | undefined {
    const asset = this.getAsset(assetId);
    if (!asset) return undefined;

    const assetRef = asset.assets.find(a => a.type === assetType);
    return assetRef?.horizonAssetId;
  }

  /**
   * Get local path for a given asset
   */
  getAssetPath(assetId: string, assetType: 'image' | 'audio' = 'image'): string | undefined {
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
        if (asset.type === 'image' && !images[id]) {
          images[id] = asset.path;
        } else if (asset.type === 'audio' && !sounds[id]) {
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
          if (asset.type === 'image' && !images[id]) {
            images[id] = asset.horizonAssetId;
          } else if (asset.type === 'audio' && !sounds[id]) {
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
   * Clear all loaded catalogs
   */
  clear(): void {
    this.catalogs.clear();
    this.assetIndex.clear();
    this.pathToIdMap.clear();
    this.horizonIdMap.clear();
  }
}

// Singleton instance
export const assetCatalogManager = new AssetCatalogManager();