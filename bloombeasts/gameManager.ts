/**
 * Type Definitions for BloomBeasts Game
 *
 * NOTE: This file now re-exports types from the centralized types/ directory.
 * The actual game logic is in BloomBeastsGame.ts.
 */

// Export types for regular module bundling (web deployment)
export type {
  MenuStats,
  BattleDisplay,
  CardDetailDisplay,
  MissionDisplay,
  ObjectiveDisplay,
} from './types/game/DisplayTypes';
