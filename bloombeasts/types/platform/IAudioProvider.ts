/**
 * Audio Provider Interface
 *
 * Handles audio playback and settings.
 * Platform can optionally implement these methods to support sound/music.
 */

/**
 * Audio provider for sound effects and music
 *
 * All methods are optional - platform can choose which audio features to support.
 *
 * Examples:
 * - Web: HTML5 Audio API
 * - Horizon: Horizon audio system
 * - Headless: No implementation (silent mode)
 */
export interface IAudioProvider {
  /**
   * Play a sound effect or music track
   *
   * @param assetId - Sound asset identifier
   * @param loop - Whether to loop the sound
   * @param volume - Volume level (0-100)
   *
   * @example Web
   * ```ts
   * playSound: (assetId, loop, volume) => {
   *   const audio = new Audio(getSoundPath(assetId));
   *   audio.loop = loop;
   *   audio.volume = volume / 100;
   *   audio.play();
   * }
   * ```
   *
   * @example Horizon
   * ```ts
   * playSound: (assetId, loop, volume) => {
   *   world.playSound(soundAssets[assetId], { loop, volume: volume / 100 });
   * }
   * ```
   */
  playSound?: (assetId: string, loop: boolean, volume: number) => void;

  /**
   * Stop a playing sound
   *
   * @param assetId - Optional sound to stop (if omitted, stops all sounds)
   *
   * @example
   * ```ts
   * stopSound: (assetId) => {
   *   if (assetId) {
   *     audioMap.get(assetId)?.pause();
   *   } else {
   *     audioMap.forEach(audio => audio.pause());
   *   }
   * }
   * ```
   */
  stopSound?: (assetId?: string) => void;

  /**
   * Set music volume level
   *
   * @param volume - Volume level (0-100)
   *
   * @example
   * ```ts
   * setMusicVolume: (volume) => {
   *   musicTracks.forEach(track => track.volume = volume / 100);
   * }
   * ```
   */
  setMusicVolume?: (volume: number) => void;

  /**
   * Set sound effects volume level
   *
   * @param volume - Volume level (0-100)
   *
   * @example
   * ```ts
   * setSfxVolume: (volume) => {
   *   sfxTracks.forEach(sfx => sfx.volume = volume / 100);
   * }
   * ```
   */
  setSfxVolume?: (volume: number) => void;

  /**
   * Enable or disable music playback
   *
   * @param enabled - Whether music should play
   *
   * @example
   * ```ts
   * setMusicEnabled: (enabled) => {
   *   if (enabled) resumeMusic();
   *   else pauseMusic();
   * }
   * ```
   */
  setMusicEnabled?: (enabled: boolean) => void;

  /**
   * Enable or disable sound effects playback
   *
   * @param enabled - Whether sound effects should play
   *
   * @example
   * ```ts
   * setSfxEnabled: (enabled) => {
   *   sfxEnabled = enabled;
   * }
   * ```
   */
  setSfxEnabled?: (enabled: boolean) => void;
}
