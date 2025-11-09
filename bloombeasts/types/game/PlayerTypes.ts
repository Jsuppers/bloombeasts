/**
 * Player data type definitions
 *
 * Core player data structures used throughout the game.
 */

import type { CardInstance } from '../../screens/common/types';
import type { SoundSettings } from './DisplayTypes';

/**
 * Player item in inventory
 */
export interface PlayerItem {
  itemId: string;
  quantity: number;
}

/**
 * Player data structure - persisted to platform storage
 * This is the canonical save data format
 *
 * Note: Player level is derived from totalXP and not stored directly
 */
export interface PlayerData {
  // Identity and progression
  name: string;
  totalXP: number; // Level is derived from this via getPlayerLevel()

  // Currency
  coins: number;

  // Card collection and deck (SINGLE SOURCE OF TRUTH)
  cards: {
    collected: CardInstance[]; // All owned card instances
    deck: string[]; // Card instance IDs in player's deck
  };

  // Mission tracking
  missions: {
    completedMissions: { [missionId: string]: number }; // Mission ID -> completion count
  };

  // Item inventory (only special items like serums)
  items: PlayerItem[];

  // Boost upgrades (0-6 levels per boost)
  boosts: {
    [boostId: string]: number; // Boost ID -> upgrade level (0-6)
  };

  // UI preferences (not persisted on all platforms)
  settings?: SoundSettings;
}
