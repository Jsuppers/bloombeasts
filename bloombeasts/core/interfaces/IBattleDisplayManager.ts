/**
 * IBattleDisplayManager - Interface for battle display management
 * Breaks circular dependency between core and screens
 */

import type { BattleUIState } from './IBattleUI';
import type { BattleDisplay } from '../../types/game/DisplayTypes';

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
    battleState: BattleUIState | null,
    options?: BattleDisplayOptions
  ): BattleDisplay;
}
