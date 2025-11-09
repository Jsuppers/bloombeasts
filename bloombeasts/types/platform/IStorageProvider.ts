/**
 * Storage Provider Interface
 *
 * Handles persistent data storage and retrieval.
 * Platform must implement these methods to support save/load functionality.
 */

import type { PlayerData } from '../game/PlayerTypes';

/**
 * Storage provider for persisting player data
 *
 * Examples:
 * - Web: localStorage
 * - Horizon: Persistent Variables API
 * - Native: File system or database
 */
export interface IStorageProvider {
  /**
   * Save player data to persistent storage
   *
   * @param data - Player data to persist
   *
   * @example Web
   * ```ts
   * setPlayerData: (data) => localStorage.setItem('playerData', JSON.stringify(data))
   * ```
   *
   * @example Horizon
   * ```ts
   * setPlayerData: (data) => persistentVar.set(data)
   * ```
   */
  setPlayerData: (data: PlayerData) => void;

  /**
   * Load player data from persistent storage
   *
   * Platform must ensure valid PlayerData is returned (create default if none exists)
   *
   * @returns Player data or null if not found
   *
   * @example Web
   * ```ts
   * getPlayerData: () => JSON.parse(localStorage.getItem('playerData') || 'null')
   * ```
   *
   * @example Horizon
   * ```ts
   * getPlayerData: () => persistentVar.get()
   * ```
   */
  getPlayerData: () => PlayerData | null;
}
