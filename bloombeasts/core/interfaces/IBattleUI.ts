/**
 * IBattleUI - Interface for battle UI operations
 * Breaks circular dependency between core and screens
 */

import type { BattleAction } from '../../screens/battle/engine/types/actions';
import type { RuntimeCard } from '../../common/engine/types/runtime';

/**
 * Battle state representation
 */
export interface BattleState {
  battleState: any;  // TODO: Type this properly when we have the full battle state type
  isComplete: boolean;
  rewards: any | null;  // TODO: Type this properly
  winner: string | null;
}

/**
 * Interface for battle UI operations
 */
export interface IBattleUI {
  /**
   * Initialize a new battle
   */
  initializeBattle(playerDeckCards: RuntimeCard[], playerName: string): BattleState | null;

  /**
   * Get the current battle state
   */
  getCurrentBattle(): BattleState | null;

  /**
   * Process a battle action
   */
  processTypedAction(action: BattleAction, data?: any): Promise<void>;
}
