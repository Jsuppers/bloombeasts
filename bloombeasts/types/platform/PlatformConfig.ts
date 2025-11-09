/**
 * Platform configuration interface
 *
 * Platform-agnostic configuration for adapting the game to different platforms.
 * Composed of focused provider interfaces for better separation of concerns.
 *
 * Each provider handles a specific aspect of platform integration:
 * - IStorageProvider: Data persistence (required)
 * - IAssetProvider: Asset loading (required)
 * - IUIProvider: UI rendering and async operations (required)
 * - IAudioProvider: Sound and music (optional)
 * - IWorldProvider: Multiplayer/world features (optional)
 *
 * Example implementation for Web:
 * ```ts
 * const webPlatform: PlatformConfig = {
 *   // Storage
 *   setPlayerData: (data) => localStorage.setItem('playerData', JSON.stringify(data)),
 *   getPlayerData: () => JSON.parse(localStorage.getItem('playerData') || 'null'),
 *
 *   // Assets
 *   getImageAsset: (assetId) => catalogManager.getAsset(assetId).webPath,
 *   catalogManager: webCatalogManager,
 *
 *   // UI
 *   getUIMethodMappings: () => webUIComponents,
 *   async: { setTimeout, setInterval, clearTimeout, clearInterval },
 *   render: (uiNode) => renderer.render(uiNode),
 *
 *   // Audio (optional)
 *   playSound: (assetId, loop, volume) => webAudio.play(assetId, { loop, volume }),
 *   stopSound: (assetId) => webAudio.stop(assetId),
 *   // ... other audio methods
 * };
 * ```
 *
 * Example implementation for Horizon:
 * ```ts
 * const horizonPlatform: PlatformConfig = {
 *   // Storage
 *   setPlayerData: (data) => persistentVar.set(data),
 *   getPlayerData: () => persistentVar.get(),
 *
 *   // Assets
 *   getImageAsset: (assetId) => ImageSource.fromTextureAsset(getHorizonAsset(assetId)),
 *   catalogManager: horizonCatalogManager,
 *
 *   // UI
 *   getUIMethodMappings: () => ({ View: hz.View, Text: hz.Text, ... }),
 *   async: component.async,
 *   render: (uiNode) => component.update(uiNode),
 *
 *   // Audio (optional)
 *   playSound: (assetId, loop, volume) => world.playSound(soundAssets[assetId], { loop, volume }),
 *   // ... other audio methods
 *
 *   // World (optional)
 *   getWorldVariable: (group, name) => world.getVariable(group, name),
 *   setWorldVariable: (group, name, value) => world.setVariable(group, name, value),
 *   sendNetworkEvent: (event, data) => world.sendNetworkEvent(event, data),
 * };
 * ```
 */

import type { IStorageProvider } from './IStorageProvider';
import type { IAssetProvider } from './IAssetProvider';
import type { IUIProvider } from './IUIProvider';
import type { IAudioProvider } from './IAudioProvider';
import type { IWorldProvider } from './IWorldProvider';

/**
 * Platform configuration - implement all required providers for your platform
 *
 * Composes multiple provider interfaces:
 * - Storage, Asset, and UI providers are required
 * - Audio and World providers are optional
 */
export interface PlatformConfig
  extends IStorageProvider,
    IAssetProvider,
    IUIProvider,
    IAudioProvider,
    IWorldProvider {}
