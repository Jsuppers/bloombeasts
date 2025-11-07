/**
 * Platform types barrel export
 *
 * Exports the main PlatformConfig interface and all provider interfaces.
 * Provider interfaces can be used for more granular platform implementations.
 */

// Main platform configuration (composes all providers)
export * from './PlatformConfig';

// Individual provider interfaces (for granular implementations)
export * from './IStorageProvider';
export * from './IAssetProvider';
export * from './IUIProvider';
export * from './IAudioProvider';
export * from './IWorldProvider';
