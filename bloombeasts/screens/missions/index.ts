/**
 * Missions module - Main export point
 */

// Types
export * from './types';

// Mission definitions
export * from './definitions';

// Mission management
export { MissionManager } from './MissionManager';
export type { MissionRunProgress, RewardResult } from './MissionManager';

// UI components
export { MissionSelectionUI } from './MissionSelectionUI';
export type { MissionDisplayData } from './MissionSelectionUI';

export { MissionBattleUI } from './MissionBattleUI';
export type { BattleUIState } from './MissionBattleUI';

// Quick access functions
export { missions, getMissionById, getAvailableMissions, getCompletedMissions } from './definitions';