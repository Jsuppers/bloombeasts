/**
 * Game Rules Constants
 *
 * Central location for all game rule constants to avoid magic numbers
 * throughout the codebase.
 */

// Field Configuration
export const FIELD_SIZE = 3;

// Deck Configuration
export const DECK_SIZE = 30;
export const MIN_DECK_SIZE = 30;
export const MAX_DECK_SIZE = 30;

// Health Configuration
export const STARTING_HEALTH = 30;
export const PLAYER_MAX_HEALTH = 30;

// Turn Configuration
export const TURN_TIME_LIMIT = 60; // seconds
export const MAX_TURNS = 100; // to prevent infinite games

// Hand Configuration
export const MAX_HAND_SIZE = 10;
export const STARTING_HAND_SIZE = 5;

// Zone Limits
export const MAX_TRAP_ZONE_SIZE = 3;
export const MAX_MAGIC_ZONE_SIZE = 3;

// Cost Limits
export const MAX_CARD_COST = 10;
export const MIN_CARD_COST = 0;

// Resource Limits
export const MAX_NECTAR = 10;
export const MIN_NECTAR = 0;

// Level Configuration
export const MIN_LEVEL = 1;
// MAX_LEVEL is defined in leveling.ts

// Stat Limits
export const MAX_ATTACK = 99;
export const MAX_HEALTH = 99;
export const MIN_ATTACK = 0;
export const MIN_HEALTH = 1;

// Counter limits removed

// Card Limits
export const MAX_COPIES_PER_CARD = 3;

// Battle Configuration
export const FIRST_PLAYER_DRAWS_ON_FIRST_TURN = false;
