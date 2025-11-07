/**
 * IBattleDisplayManager - Interface for battle display management
 * Breaks circular dependency between core and screens
 */

import type { BattleState } from './IBattleUI';

/**
 * Options for creating battle display
 */
export interface BattleDisplayOptions {
  attackerPlayer?: 'player' | 'opponent';
  attackerIndex?: number;
  targetPlayer?: 'player' | 'opponent' | 'health';
  targetIndex?: number;
}

/**
 * Interface for battle display manager
 */
export interface IBattleDisplayManager {
  /**
   * Create a battle display from current state
   */
  createBattleDisplay(
    battleState: BattleState | null,
    options?: BattleDisplayOptions
  ): any;  // TODO: Type this as BattleDisplay when we have the type
}
