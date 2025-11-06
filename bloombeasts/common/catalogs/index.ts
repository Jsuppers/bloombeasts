/**
 * Catalogs - Re-exports all card definitions
 */

export * from './bossAssets';
export * from './buffAssets';
export * from './commonAssets';
export * from './fireAssets';
export * from './forestAssets';
export * from './magicAssets';
export * from './skyAssets';
export * from './trapAssets';
export * from './waterAssets';

// Import all catalogs
import { bossAssets } from './bossAssets';
import { buffAssets } from './buffAssets';
import { commonAssets } from './commonAssets';
import { fireAssets } from './fireAssets';
import { forestAssets } from './forestAssets';
import { magicAssets } from './magicAssets';
import { skyAssets } from './skyAssets';
import { trapAssets } from './trapAssets';
import { waterAssets } from './waterAssets';

// Export array of all catalogs for easy iteration
export const allCatalogs = [
  bossAssets,
  buffAssets,
  commonAssets,
  fireAssets,
  forestAssets,
  magicAssets,
  skyAssets,
  trapAssets,
  waterAssets,
];
