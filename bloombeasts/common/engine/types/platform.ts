/**
 * Platform Interface
 *
 * Defines the contract between the game engine and platform-specific implementations.
 * This allows the game to run on different platforms (Web, Meta Horizon, etc.)
 * with platform-specific rendering, input, and asset loading.
 */

export interface RenderContext {
  width: number;
  height: number;
  deltaTime: number;
}

export interface AssetLoadResult {
  success: boolean;
  assetId: string;
  data?: any;
  error?: string;
}

export type InputCallback = (data: any) => void;

export interface PlatformInterface {
  /**
   * Initialize the platform (load assets, set up rendering, etc.)
   */
  initialize(): Promise<void>;

  /**
   * Load a single asset
   */
  loadAsset(assetId: string): Promise<AssetLoadResult>;

  /**
   * Load multiple assets
   */
  loadAssets(assetIds: string[]): Promise<AssetLoadResult[]>;

  /**
   * Register a render callback
   */
  onRender(callback: (ctx: RenderContext) => void): void;

  /**
   * Register an input handler
   */
  onInput(eventType: string, callback: InputCallback): void;

  /**
   * Play a sound effect
   */
  playSound(soundId: string, volume?: number): Promise<void>;

  /**
   * Play background music
   */
  playMusic(musicId: string, loop?: boolean, volume?: number): Promise<void>;

  /**
   * Stop background music
   */
  stopMusic(): Promise<void>;

  /**
   * Show a dialog to the user
   * @returns The index of the button that was clicked
   */
  showDialog(title: string, message: string, buttons: string[]): Promise<number>;

  /**
   * Get current timestamp in milliseconds
   */
  getTimestamp(): number;

  /**
   * Delay execution
   */
  delay(ms: number): Promise<void>;
}
