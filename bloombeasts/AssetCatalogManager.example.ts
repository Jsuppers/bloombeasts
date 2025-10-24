/**
 * Example usage of the AssetCatalogManager
 *
 * This shows how to integrate the new asset catalog system
 * with both Web and Horizon deployments.
 */

import { AssetCatalogManager, CardAssetEntry } from './AssetCatalogManager';
import type { BloomBeastCard } from './engine/types/core';

// ============================================
// EXAMPLE 1: Web Deployment Usage
// ============================================

export class WebAssetLoader {
  private assetManager: AssetCatalogManager;

  constructor() {
    this.assetManager = new AssetCatalogManager();
  }

  /**
   * Load all asset catalogs for web
   */
  async initialize() {
    // Load all catalogs from the assets directory
    await this.assetManager.loadAllCatalogs('/assets/catalogs');

    console.log('Loaded categories:', this.assetManager.getLoadedCategories());
  }

  /**
   * Get image URL for a card
   */
  getCardImageUrl(cardId: string): string | undefined {
    return this.assetManager.getAssetPath(cardId, 'image');
  }

  /**
   * Get all image mappings for the platform
   */
  getAllImageMappings(): Record<string, string> {
    const { images } = this.assetManager.getWebAssetMappings();
    return images;
  }

  /**
   * Get card data with all properties
   */
  getCardData(cardId: string): BloomBeastCard | undefined {
    const asset = this.assetManager.getAsset(cardId) as CardAssetEntry;
    if (!asset || asset.type !== 'beast') {
      return undefined;
    }
    return asset.data as BloomBeastCard;
  }
}

// ============================================
// EXAMPLE 2: Horizon Deployment Usage
// ============================================

export class HorizonAssetLoader {
  private assetManager: AssetCatalogManager;
  private horizonAssets: Map<string, any> = new Map(); // Horizon asset references

  constructor() {
    this.assetManager = new AssetCatalogManager();
  }

  /**
   * Load catalogs and map to Horizon assets
   */
  async initialize(world: any) {
    // Load all catalogs
    await this.assetManager.loadAllCatalogs('/assets/catalogs');

    // Get Horizon asset mappings
    const { images, sounds } = this.assetManager.getHorizonAssetMappings();

    // Load actual Horizon assets (pseudo-code - replace with actual Horizon API)
    for (const [id, horizonId] of Object.entries(images)) {
      // In real Horizon code:
      // const asset = await world.assets.getAsset(horizonId);
      // this.horizonAssets.set(id, asset);
      console.log(`Loading Horizon asset ${horizonId} for ${id}`);
    }
  }

  /**
   * Get Horizon asset for a card
   */
  getHorizonAsset(cardId: string): any {
    const horizonId = this.assetManager.getHorizonAssetId(cardId, 'image');
    if (!horizonId) return undefined;

    // Return the loaded Horizon asset
    return this.horizonAssets.get(cardId);
  }
}

// ============================================
// EXAMPLE 3: Game Engine Integration
// ============================================

export class GameEngineAssetIntegration {
  private assetManager: AssetCatalogManager;

  constructor() {
    this.assetManager = new AssetCatalogManager();
  }

  /**
   * Load catalogs and create card instances
   */
  async initialize() {
    await this.assetManager.loadAllCatalogs('/assets/catalogs');
  }

  /**
   * Get all cards for a specific affinity
   */
  getAffinityCards(affinity: 'fire' | 'forest' | 'sky' | 'water'): BloomBeastCard[] {
    const cardAssets = this.assetManager.getCardsByAffinity(affinity);
    return cardAssets.map(asset => asset.data as BloomBeastCard);
  }

  /**
   * Get all beast cards
   */
  getAllBeastCards(): BloomBeastCard[] {
    const beasts = this.assetManager.getAssetsByType<CardAssetEntry>('beast');
    return beasts.map(beast => beast.data as BloomBeastCard);
  }

  /**
   * Create a card instance from catalog
   */
  createCardInstance(cardId: string): BloomBeastCard | undefined {
    const asset = this.assetManager.getAsset(cardId) as CardAssetEntry;
    if (!asset) return undefined;

    // The data property contains all the card properties
    return asset.data as BloomBeastCard;
  }
}

// ============================================
// EXAMPLE 4: Dynamic Asset Loading
// ============================================

export class DynamicAssetLoader {
  private assetManager: AssetCatalogManager;

  constructor() {
    this.assetManager = new AssetCatalogManager();
  }

  /**
   * Load only specific catalogs based on mission/level
   */
  async loadForMission(affinity: 'fire' | 'forest' | 'sky' | 'water') {
    // Load common assets
    await this.assetManager.loadCatalog('/assets/catalogs/commonAssets.json');

    // Load affinity-specific assets
    await this.assetManager.loadCatalog(`/assets/catalogs/${affinity}Assets.json`);

    // Load buff and trap assets (always needed)
    await this.assetManager.loadCatalog('/assets/catalogs/buffAssets.json');
    await this.assetManager.loadCatalog('/assets/catalogs/trapAssets.json');
    await this.assetManager.loadCatalog('/assets/catalogs/magicAssets.json');
  }

  /**
   * Unload assets to free memory
   */
  unloadAssets() {
    this.assetManager.clear();
  }
}

// ============================================
// EXAMPLE 5: Asset Validation
// ============================================

export class AssetValidator {
  private assetManager: AssetCatalogManager;

  constructor() {
    this.assetManager = new AssetCatalogManager();
  }

  /**
   * Validate that all required assets are present
   */
  async validateAssets(): Promise<{ valid: boolean; missing: string[] }> {
    await this.assetManager.loadAllCatalogs('/assets/catalogs');

    const missing: string[] = [];
    const requiredAssets = [
      'background',
      'menu',
      'base-card',
      'magic-card',
      'trap-card',
      'buff-card'
    ];

    for (const assetId of requiredAssets) {
      const asset = this.assetManager.getAsset(assetId);
      if (!asset) {
        missing.push(assetId);
      }
    }

    // Check that each card has at least one image asset
    const allCards = [
      ...this.assetManager.getAssetsByType<CardAssetEntry>('beast'),
      ...this.assetManager.getAssetsByType<CardAssetEntry>('buff'),
      ...this.assetManager.getAssetsByType<CardAssetEntry>('trap'),
      ...this.assetManager.getAssetsByType<CardAssetEntry>('magic')
    ];

    for (const card of allCards) {
      const hasImage = card.assets.some(a => a.type === 'image');
      if (!hasImage) {
        missing.push(`${card.id} (no image)`);
      }
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Web deployment
async function webExample() {
  const loader = new WebAssetLoader();
  await loader.initialize();

  // Get card image
  const rootlingImage = loader.getCardImageUrl('rootling');
  console.log('Rootling image:', rootlingImage);

  // Get all image mappings for platform config
  const imageMappings = loader.getAllImageMappings();
  console.log('All images:', imageMappings);

  // Get full card data
  const rootlingCard = loader.getCardData('rootling');
  console.log('Rootling card:', rootlingCard);
}

// Horizon deployment
async function horizonExample(world: any) {
  const loader = new HorizonAssetLoader();
  await loader.initialize(world);

  // Get Horizon asset reference
  const rootlingAsset = loader.getHorizonAsset('rootling');
  console.log('Rootling Horizon asset:', rootlingAsset);
}

// Game engine
async function gameEngineExample() {
  const integration = new GameEngineAssetIntegration();
  await integration.initialize();

  // Get all Forest cards
  const forestCards = integration.getAffinityCards('forest');
  console.log('Forest cards:', forestCards.map(c => c.name));

  // Create card instance
  const rootling = integration.createCardInstance('rootling');
  if (rootling) {
    console.log('Created Rootling:', {
      name: rootling.name,
      cost: rootling.cost,
      baseAttack: rootling.baseAttack,
      baseHealth: rootling.baseHealth
    });
  }
}

// Dynamic loading
async function dynamicLoadingExample() {
  const loader = new DynamicAssetLoader();

  // Load assets for Forest mission
  await loader.loadForMission('forest');
  console.log('Loaded Forest mission assets');

  // Later, unload and load different mission
  loader.unloadAssets();
  await loader.loadForMission('fire');
  console.log('Loaded Fire mission assets');
}

// Validation
async function validationExample() {
  const validator = new AssetValidator();
  const result = await validator.validateAssets();

  if (result.valid) {
    console.log('All assets are valid!');
  } else {
    console.log('Missing assets:', result.missing);
  }
}