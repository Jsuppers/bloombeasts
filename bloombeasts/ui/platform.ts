/**
 * Platform configuration for BloomBeasts UI
 * This module manages platform selection and configuration
 */

/**
 * Available platforms for BloomBeasts UI
 */
export enum Platform {
  horizon = 'horizon',
  web = 'web'
}

/**
 * Current platform selection
 * Defaults to web platform for development
 */
let currentPlatform: Platform = Platform.web;

/**
 * Set the current platform
 * This should be called at application initialization
 * @param platform The platform to use
 */
export function setPlatform(platform: Platform): void {
  currentPlatform = platform;
  console.log(`[BloomBeasts UI] Platform set to: ${platform}`);
}

/**
 * Get the current platform
 * @returns The currently selected platform
 */
export function getPlatform(): Platform {
  return currentPlatform;
}

/**
 * Check if running on Horizon platform
 * @returns true if current platform is Horizon
 */
export function isHorizon(): boolean {
  return currentPlatform === Platform.horizon;
}

/**
 * Check if running on Web platform
 * @returns true if current platform is Web
 */
export function isWeb(): boolean {
  return currentPlatform === Platform.web;
}

/**
 * Platform capabilities
 * Used to check if certain features are available on the current platform
 */
export interface PlatformCapabilities {
  hasNativeUI: boolean;
  hasCanvasRendering: boolean;
  hasPersistentStorage: boolean;
  hasMultiplayer: boolean;
  hasVR: boolean;
}

/**
 * Get capabilities of the current platform
 * @returns Platform capabilities object
 */
export function getPlatformCapabilities(): PlatformCapabilities {
  switch (currentPlatform) {
    case Platform.horizon:
      return {
        hasNativeUI: true,
        hasCanvasRendering: false,
        hasPersistentStorage: true,
        hasMultiplayer: true,
        hasVR: true
      };
    case Platform.web:
      return {
        hasNativeUI: false,
        hasCanvasRendering: true,
        hasPersistentStorage: false,
        hasMultiplayer: false,
        hasVR: false
      };
    default:
      throw new Error(`Unknown platform: ${currentPlatform}`);
  }
}

/**
 * Platform-specific configuration
 */
export interface PlatformConfig {
  panelWidth: number;
  panelHeight: number;
  defaultFontFamily: string;
  supportsProps: boolean;
}

/**
 * Get configuration for the current platform
 * @returns Platform configuration object
 */
export function getPlatformConfig(): PlatformConfig {
  switch (currentPlatform) {
    case Platform.horizon:
      return {
        panelWidth: 1280,
        panelHeight: 720,
        defaultFontFamily: 'system-ui',
        supportsProps: true
      };
    case Platform.web:
      return {
        panelWidth: 1280,
        panelHeight: 720,
        defaultFontFamily: 'Orbitron, monospace',
        supportsProps: false
      };
    default:
      throw new Error(`Unknown platform: ${currentPlatform}`);
  }
}