/**
 * IMissionSelectionUI - Interface for mission selection UI
 * Breaks circular dependency between core and screens
 */

/**
 * Mission display data returned by the UI
 */
export interface MissionDisplayData {
  mission: any;  // TODO: Import Mission type when refactoring
  isAvailable: boolean;
  completionCount: number;
  difficultyColor: string;
  rewardPreview: string[];
}

/**
 * Interface for mission selection UI operations
 */
export interface IMissionSelectionUI {
  /**
   * Set the player's current level for mission filtering
   */
  setPlayerLevel(level: number): void;

  /**
   * Get all missions formatted for display
   */
  getMissionList(): MissionDisplayData[];
}
