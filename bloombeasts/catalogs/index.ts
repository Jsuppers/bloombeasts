/**
 * Asset Catalog Index
 * Source of truth for all game assets
 */

import type { AssetCatalog } from '../AssetCatalogManager';

export { bossAssets } from './bossAssets';
export { buffAssets } from './buffAssets';
export { commonAssets } from './commonAssets';
export { fireAssets } from './fireAssets';
export { forestAssets } from './forestAssets';
export { magicAssets } from './magicAssets';
export { skyAssets } from './skyAssets';
export { trapAssets } from './trapAssets';
export { waterAssets } from './waterAssets';

// Export all catalogs as array for easy loading
import { bossAssets } from './bossAssets';
import { buffAssets } from './buffAssets';
import { commonAssets } from './commonAssets';
import { fireAssets } from './fireAssets';
import { forestAssets } from './forestAssets';
import { magicAssets } from './magicAssets';
import { skyAssets } from './skyAssets';
import { trapAssets } from './trapAssets';
import { waterAssets } from './waterAssets';

export const allCatalogs: AssetCatalog[] = [
  bossAssets,
  buffAssets,
  commonAssets,
  fireAssets,
  forestAssets,
  magicAssets,
  skyAssets,
  trapAssets,
  waterAssets
];
