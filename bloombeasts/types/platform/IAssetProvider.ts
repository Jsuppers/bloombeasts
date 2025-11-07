/**
 * Asset Provider Interface
 *
 * Handles asset loading and management.
 * Platform must implement these methods to provide game assets.
 */

/**
 * Asset provider for loading images, sounds, and other resources
 *
 * Examples:
 * - Web: Returns file paths as strings
 * - Horizon: Returns ImageSource objects
 */
export interface IAssetProvider {
  /**
   * Get an image asset by ID
   *
   * Platform queries AssetCatalogManager and returns the asset in platform format
   *
   * @param assetId - Unique identifier for the asset
   * @returns Platform-specific asset representation
   *
   * @example Web
   * ```ts
   * getImageAsset: (assetId) => {
   *   const catalog = catalogManager.getAsset(assetId);
   *   return catalog.webPath; // '/assets/cards/fire/beast.png'
   * }
   * ```
   *
   * @example Horizon
   * ```ts
   * getImageAsset: (assetId) => {
   *   const catalog = catalogManager.getAsset(assetId);
   *   return ImageSource.fromTextureAsset(new hz.Asset(BigInt(catalog.horizonAssetId)));
   * }
   * ```
   */
  getImageAsset: (assetId: string) => any;

  /**
   * Asset catalog manager instance
   *
   * Provides access to all game asset metadata and card definitions.
   * Platform should initialize this with the appropriate catalog data.
   */
  catalogManager: any; // AssetCatalogManager instance
}
