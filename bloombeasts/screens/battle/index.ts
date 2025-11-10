/**
 * Battle module - Main export point
 */

// Battle UI and state management
export { BattleUI } from './BattleUI';

// Battle display manager
export { BattleDisplayManager } from './BattleDisplayManager';

// Re-export BattleState from engine for convenience
export type { BattleState } from './engine/types';
