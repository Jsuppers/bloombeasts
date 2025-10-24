# Asset Catalog Loading in Horizon Worlds

## Overview

Horizon Worlds does not support the `fetch()` API, so we use a different approach to load JSON asset catalogs. Instead of fetching files over HTTP, we upload JSON files as **Text assets** in the Asset Library and load them using the `fetchAsData()` method.

The catalog loading is **built into the main game component** (`BloomBeasts-Game.ts`), so you only need to upload the JSON files and assign them in the Properties panel.

## Setup Instructions

### 1. Prepare JSON Catalog Files

Your asset catalogs should be in JSON format. Example structure:

```json
{
  "version": "1.0.0",
  "category": "fire",
  "description": "Fire affinity assets",
  "data": [
    {
      "id": "beast_fire_01",
      "type": "beast",
      "affinity": "fire",
      "data": {
        "id": "beast_fire_01",
        "name": "Flame Beast",
        "cost": 3,
        "attack": 4,
        "health": 3
      },
      "assets": [
        {
          "type": "image",
          "horizonAssetId": "1234567890",
          "path": "/assets/cards/fire/beast_01.png"
        }
      ]
    }
  ]
}
```

### 2. Upload Catalogs to Horizon Asset Library

1. Open your Horizon World in Edit mode
2. Go to the **Asset Library**
3. Click **Upload** and select your JSON files as **Text** assets:
   - `fireAssets.json`
   - `forestAssets.json`
   - `skyAssets.json`
   - `waterAssets.json`
   - `buffAssets.json`
   - `trapAssets.json`
   - `magicAssets.json`
   - `commonAssets.json`

### 3. Assign Catalogs to Game Component

1. Find the entity with the **BloomBeastsUI** component (your main game component)
2. In the entity's **Properties panel**, you'll see 8 catalog properties
3. Assign each uploaded JSON file to its corresponding property:
   - `fireAssetsCatalog` → Select your uploaded `fireAssets.json`
   - `forestAssetsCatalog` → Select your uploaded `forestAssets.json`
   - `skyAssetsCatalog` → Select your uploaded `skyAssets.json`
   - `waterAssetsCatalog` → Select your uploaded `waterAssets.json`
   - `buffAssetsCatalog` → Select your uploaded `buffAssets.json`
   - `trapAssetsCatalog` → Select your uploaded `trapAssets.json`
   - `magicAssetsCatalog` → Select your uploaded `magicAssets.json`
   - `commonAssetsCatalog` → Select your uploaded `commonAssets.json`

### 4. Start Your World

When the world starts:
- The game component's `loadAssetCatalogs()` method runs automatically
- All catalogs are loaded using `fetchAsData()`
- The catalogs are registered with the singleton `AssetCatalogManager`
- Your game can now query assets using the manager

## Usage in Game Code

Once catalogs are loaded, use the `AssetCatalogManager` to query assets:

```typescript
import { AssetCatalogManager } from '../../../bloombeasts/AssetCatalogManager';

// Get the singleton instance
const catalogManager = AssetCatalogManager.getInstance();

// Get an asset by ID
const beastAsset = catalogManager.getAsset('beast_fire_01');

// Get asset by Horizon ID
const assetByHorizonId = catalogManager.getAssetByHorizonId('1234567890');

// Get all beasts
const allBeasts = catalogManager.getAssetsByType('beast');

// Check which categories are loaded
console.log('Loaded categories:', catalogManager.getLoadedCategories());
```

## Key Differences from Web

| Aspect | Web | Horizon |
|--------|-----|---------|
| Loading Method | `fetch()` | `fetchAsData()` |
| File Location | HTTP server | Asset Library |
| Loading Code | `deployments/web/src/main.ts` | Built into `BloomBeasts-Game.ts` |
| Setup Required | Copy JSON to public folder | Upload as Text assets + Assign props |

## Troubleshooting

### Catalogs not loading
- Check the console for error messages
- Verify all 8 catalog files are uploaded and assigned in Properties
- Make sure the JSON files are valid (use a JSON validator)

### Assets not found
- Verify the Horizon Asset IDs in your JSON match the actual IDs in the Asset Library
- Check that catalogs loaded successfully: `catalogManager.getLoadedCategories()`

### Missing catalog properties
- If you don't see the 8 catalog properties, make sure you're looking at the entity with the `BloomBeastsUI` component
- The properties are defined in `BloomBeasts-Game.ts` in `propsDefinition`

## Example: Adding a New Catalog

1. Create `bossAssets.json`
2. Upload it to Asset Library
3. Update `BloomBeasts-Game.ts`:

```typescript
static propsDefinition = {
  // ... existing catalog props
  bossAssetsCatalog: { type: hz.PropTypes.Asset }, // Add this
};

private async loadAssetCatalogs(): Promise<void> {
  // ... existing code
  await Promise.all([
    // ... existing loads
    loadCatalog((this.props as any).bossAssetsCatalog, 'bossAssets.json'), // Add this
  ]);
}
```

4. Assign the uploaded file in the game component's Properties panel
