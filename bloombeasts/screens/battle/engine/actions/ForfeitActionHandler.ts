/**
 * Forfeit Action Handler
 *
 * Handles the FORFEIT action, marking a player as having forfeited
 * This triggers the win condition checker to end the game with the opponent as winner
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import type { BloomBeastsState, BloomBeastsActionData } from '../types';
import { BloomBeastsActionType, SuddenEndReason } from '../types';
import { BaseActionHandler, ActionValidationResult, ActionHandlerContext } from './ActionHandler';

export interface ForfeitActionData extends BloomBeastsActionData {
  type: BloomBeastsActionType.FORFEIT;
}

export class ForfeitActionHandler extends BaseActionHandler<ForfeitActionData> {
  readonly actionType = BloomBeastsActionType.FORFEIT;

  validate(
    actionData: ForfeitActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult {
    // Can always forfeit
    return { valid: true };
  }

  execute(
    actionData: ForfeitActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string,
    context?: ActionHandlerContext
  ): Turbo.IActionResult<BloomBeastsState> {
    const newState = this.cloneState(state);

    // Mark the sudden end due to forfeit
    newState.gameData.suddenEnd = {
      playerId,
      reason: SuddenEndReason.FORFEIT
    };

    // Create event
    const event = this.createEvent('forfeit', playerId, {
      reason: 'Player forfeited'
    });

    return {
      success: true,
      newState,
      sideEffects: [event],
    };
  }
}
