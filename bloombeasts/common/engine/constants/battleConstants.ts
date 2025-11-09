/**
 * Battle System Constants
 *
 * Centralized constants for battle timing, limits, and other magic numbers.
 * Extract magic numbers here to improve maintainability and readability.
 */

/**
 * AI Turn Execution
 */
export const MAX_AI_ACTIONS_PER_TURN = 50;

/**
 * Animation and Delay Timing (milliseconds)
 */
export const BEAST_PLAY_DELAY_MS = 1200;
export const MAGIC_PLAY_DELAY_MS = 3500;
export const TRAP_PLAY_DELAY_MS = 1200;
export const BUFF_PLAY_DELAY_MS = 1200;
export const HABITAT_PLAY_DELAY_MS = 1200;
export const ATTACK_ANIMATION_DELAY_MS = 1000;
export const AUTO_ATTACK_TOTAL_DELAY_MS = 3500;

/**
 * Turn Timer (seconds)
 */
export const TURN_TIMER_SECONDS = 300; // 5 minutes per turn

/**
 * Battle Event Thresholds
 */
export const LOW_HEALTH_THRESHOLD_PERCENT = 10;
