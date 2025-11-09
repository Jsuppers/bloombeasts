/**
 * Timeout Action Handler
 *
 * Handles the TIMEOUT action, marking a player as having timed out
 * This triggers the win condition checker to end the game with the opponent as winner
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import type { BloomBeastsState, BloomBeastsActionData } from '../types';
import { BloomBeastsActionType, SuddenEndReason } from '../types';
import { BaseActionHandler, ActionValidationResult, ActionHandlerContext } from './ActionHandler';

export interface TimeoutActionData extends BloomBeastsActionData {
  type: BloomBeastsActionType.TIMEOUT;
  timedOutPlayerId?: string; // Which player actually timed out (may differ from who executes the action)
}

export class TimeoutActionHandler extends BaseActionHandler<TimeoutActionData> {
  readonly actionType = BloomBeastsActionType.TIMEOUT;

  validate(
    actionData: TimeoutActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult {
    // Can always timeout (though it should only happen when timer reaches 0)
    return { valid: true };
  }

  execute(
    actionData: TimeoutActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string,
    context?: ActionHandlerContext
  ): Turbo.IActionResult<BloomBeastsState> {
    const newState = this.cloneState(state);

    // Use timedOutPlayerId if provided, otherwise use the playerId executing the action
    const actualTimedOutPlayer = actionData.timedOutPlayerId || playerId;

    // Mark the sudden end due to timeout
    newState.gameData.suddenEnd = {
      playerId: actualTimedOutPlayer,
      reason: SuddenEndReason.TIMEOUT
    };

    // Create event
    const event = this.createEvent('timeout', actualTimedOutPlayer, {
      reason: 'Timer expired'
    });

    return {
      success: true,
      newState,
      sideEffects: [event],
    };
  }
}
