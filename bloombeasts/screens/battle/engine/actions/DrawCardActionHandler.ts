/**
 * Draw Card Action Handler
 *
 * Handles the DRAW_CARD action, allowing a player to draw a card from their deck
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import type { BloomBeastsState, BloomBeastsActionData } from '../types';
import { BloomBeastsActionType } from '../types';
import { BaseActionHandler, ActionValidationResult, ActionHandlerContext } from './ActionHandler';

export interface DrawCardActionData extends BloomBeastsActionData {
  type: BloomBeastsActionType.DRAW_CARD;
}

export class DrawCardActionHandler extends BaseActionHandler<DrawCardActionData> {
  readonly actionType = BloomBeastsActionType.DRAW_CARD;

  validate(
    actionData: DrawCardActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult {
    const playerIndex = state.gameData.players.findIndex(p => p.id === playerId);
    const player = state.gameData.players[playerIndex];

    // Check if already drawn this turn
    if (state.gameData.currentTurnActions.hasDrawnCard) {
      return { valid: false, reason: 'Already drew a card this turn' };
    }

    // Check if deck has cards
    if (player.deck.length === 0) {
      return { valid: false, reason: 'No cards left in deck' };
    }

    // Check if hand is full
    if (player.hand.length >= player.maxHandSize) {
      return { valid: false, reason: 'Hand is full' };
    }

    return { valid: true };
  }

  execute(
    actionData: DrawCardActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string,
    context?: ActionHandlerContext
  ): Turbo.IActionResult<BloomBeastsState> {
    const newState = this.cloneState(state);
    const playerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
    const player = newState.gameData.players[playerIndex];

    // Draw the card
    if (player.deck.length > 0) {
      const card = player.deck.shift()!;
      player.hand.push(card);
    }

    // Update turn tracking
    newState.gameData.currentTurnActions.hasDrawnCard = true;

    // Create event
    const event = this.createEvent('card_drawn', playerId);

    return {
      success: true,
      newState,
      sideEffects: [event],
    };
  }
}
