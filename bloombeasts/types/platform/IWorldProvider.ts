/**
 * World Provider Interface
 *
 * Handles multiplayer/world features like variables and network events.
 * Platform can optionally implement these methods to support multiplayer.
 */

/**
 * World provider for multiplayer features
 *
 * All methods are optional - platform can choose which world features to support.
 *
 * Examples:
 * - Horizon: World variables and network events
 * - Web: Mock implementation or server-based
 * - Single-player: No implementation
 */
export interface IWorldProvider {
  /**
   * Get a world variable value
   *
   * World variables are shared across all players in the world.
   * Useful for leaderboards, global state, etc.
   *
   * @param variableGroup - Variable group name
   * @param variableName - Variable name within group
   * @returns The variable value (any type)
   *
   * @example Horizon
   * ```ts
   * getWorldVariable: (group, name) => world.getVariable(group, name)
   * ```
   *
   * @example Web (Mock)
   * ```ts
   * getWorldVariable: (group, name) => mockWorldData[group]?.[name]
   * ```
   */
  getWorldVariable?: (variableGroup: string, variableName: string) => any;

  /**
   * Set a world variable value
   *
   * Updates a world variable that's shared across all players.
   *
   * @param variableGroup - Variable group name
   * @param variableName - Variable name within group
   * @param value - New value to set
   *
   * @example Horizon
   * ```ts
   * setWorldVariable: (group, name, value) => world.setVariable(group, name, value)
   * ```
   *
   * @example Web (Mock)
   * ```ts
   * setWorldVariable: (group, name, value) => {
   *   mockWorldData[group] = mockWorldData[group] || {};
   *   mockWorldData[group][name] = value;
   * }
   * ```
   */
  setWorldVariable?: (variableGroup: string, variableName: string, value: any) => void;

  /**
   * Send a network event to server/other players
   *
   * Triggers a network event that can be received by server or other clients.
   * Useful for multiplayer actions, leaderboard updates, etc.
   *
   * @param eventName - Name of the event
   * @param data - Event payload data
   *
   * @example Horizon
   * ```ts
   * sendNetworkEvent: (eventName, data) => world.sendNetworkEvent(eventName, data)
   * ```
   *
   * @example Web (Mock)
   * ```ts
   * sendNetworkEvent: (eventName, data) => {
   *   console.log('Network event:', eventName, data);
   *   // Could send to server via WebSocket/HTTP
   * }
   * ```
   */
  sendNetworkEvent?: (eventName: string, data: any) => void;
}
