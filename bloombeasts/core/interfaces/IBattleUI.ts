/**
 * IBattleUI - Interface for battle UI operations
 * Breaks circular dependency between core and screens
 */

import type { BattleAction } from '../../screens/battle/engine/types/actions';
import type { RuntimeCard } from '../../common/engine/types/runtime';
import type { BattleState } from '../../screens/battle/engine/types';
import type { Mission } from '../../screens/missions/types';
import type { MissionRunProgress, RewardResult } from '../../screens/missions/MissionManager';

/**
 * Battle UI state representation
 * Wraps the battle state with mission-specific information
 */
export interface BattleUIState {
  mission: Mission;
  battleState: BattleState | null;
  progress: MissionRunProgress | null;
  isComplete: boolean;
  rewards: RewardResult | null;
  winner: string | null;
}

/**
 * Action processing context data
 */
export interface ActionProcessingData {
  [key: string]: unknown;
}

/**
 * Interface for battle UI operations
 */
export interface IBattleUI {
  /**
   * Initialize a new battle
   */
  initializeBattle(playerDeckCards: RuntimeCard[], playerName: string): BattleUIState | null;

  /**
   * Get the current battle state
   */
  getCurrentBattle(): BattleUIState | null;

  /**
   * Process a battle action
   */
  processTypedAction(action: BattleAction, data?: ActionProcessingData): Promise<void>;
}
