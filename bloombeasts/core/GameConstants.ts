/**
 * Game Constants - Centralized configuration values
 * Eliminates magic numbers and hardcoded values throughout the codebase
 */

/**
 * XP thresholds for player leveling (cumulative)
 * Formula: XP = 100 * (2.0 ^ (level - 1))
 */
export const XP_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2: 100 XP
  300,    // Level 3: 300 XP total
  700,    // Level 4: 700 XP total
  1500,   // Level 5: 1500 XP total
  3100,   // Level 6: 3100 XP total
  6300,   // Level 7: 6300 XP total
  12700,  // Level 8: 12700 XP total
  25500,  // Level 9: 25500 XP total
] as const;

/**
 * Game balance constants
 */
export const GAME_CONSTANTS = {
  /** Maximum player level */
  MAX_PLAYER_LEVEL: 9,

  /** Maximum boost upgrade level */
  MAX_BOOST_LEVEL: 6,

  /** Starting player health */
  STARTING_HEALTH: 30,

  /** Maximum energy */
  MAX_ENERGY: 10,

  /** Turn timer in seconds */
  TURN_TIMER_SECONDS: 300,

  /** Starting hand size */
  STARTING_HAND_SIZE: 3,

  /** Mission ID for Cluck Norris (used in leaderboard) */
  MISSION_CLUCK_NORRIS_ID: 'mission17',

  /** Attack animation duration in milliseconds */
  ATTACK_ANIMATION_DURATION_MS: 500,

  /** Card detail popup display duration in milliseconds */
  CARD_DETAIL_POPUP_DURATION_MS: 2000,

  /** Deck size (maximum cards in deck) */
  DECK_SIZE: 30,

  /** Minimum deck size required to start a battle */
  MIN_DECK_SIZE: 1,

  /** Energy blocks per deck */
  ENERGY_BLOCKS_PER_DECK: 27,

  /** Stat increase per level (10% per level) */
  STAT_INCREASE_PER_LEVEL: 0.1,

  /** Max priority value for combat helpers */
  MAX_PRIORITY_VALUE: 999,

  /** Leaderboard max entries to display */
  LEADERBOARD_MAX_ENTRIES: 10,

  /** Percentage to decimal conversion divisor */
  PERCENTAGE_TO_DECIMAL: 100,

  /** Milliseconds per second */
  MILLISECONDS_PER_SECOND: 1000,

  /** Seconds per minute */
  SECONDS_PER_MINUTE: 60,

  /** Volume max value */
  VOLUME_MAX: 100,
} as const;

/**
 * Sound asset IDs - Type-safe references to all sound effects
 */
export const SOUND_EFFECTS = {
  MENU_BUTTON_SELECT: 'sfx-menu-button-select',
  ATTACK: 'sfx-attack',
  PLAY_CARD: 'sfx-play-card',
  TRAP_ACTIVATED: 'sfx-trap-card-activated',
  WIN: 'sfx-win',
  LOSE: 'sfx-lose',
  UPGRADE: 'sfx-upgrade',
  UPGRADE_ROOSTER: 'sfx-upgrade-rooster',
} as const;

/**
 * Music asset IDs - Type-safe references to all music tracks
 */
export const MUSIC_TRACKS = {
  BACKGROUND: 'music-background',
  BATTLE: 'music-battle',
} as const;

/**
 * Calculate player level from total XP (derived data)
 */
export function getPlayerLevel(totalXP: number): number {
  for (let level = GAME_CONSTANTS.MAX_PLAYER_LEVEL; level >= 1; level--) {
    if (totalXP >= XP_THRESHOLDS[level - 1]) {
      return level;
    }
  }
  return 1;
}
