/**
 * End Turn Action Handler
 *
 * Handles the END_TURN action, switching to the next player and resetting turn state
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import type { BloomBeastsState, BloomBeastsActionData } from '../types';
import { BloomBeastsActionType } from '../types';
import { BaseActionHandler, ActionValidationResult, ActionHandlerContext } from './ActionHandler';

export interface EndTurnActionData extends BloomBeastsActionData {
  type: BloomBeastsActionType.END_TURN;
}

export class EndTurnActionHandler extends BaseActionHandler<EndTurnActionData> {
  readonly actionType = BloomBeastsActionType.END_TURN;

  validate(
    actionData: EndTurnActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult {
    // Can always end turn
    return { valid: true };
  }

  execute(
    actionData: EndTurnActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string,
    context?: ActionHandlerContext
  ): Turbo.IActionResult<BloomBeastsState> {
    const newState = this.cloneState(state);

    const currentPlayerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
    const players = newState.gameData.players;

    // Process end of turn effects
    if (context?.processTriggers) {
      context.processTriggers('end_of_turn', newState);
    }

    // Clear temporary effects
    this.clearTemporaryEffects(newState);

    // Switch to next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextPlayerId = players[nextPlayerIndex].id;

    // Update turn info
    newState.turnInfo = {
      ...newState.turnInfo,
      currentPlayerId: nextPlayerId,
      turnNumber: nextPlayerIndex === 0 ? newState.turnInfo.turnNumber + 1 : newState.turnInfo.turnNumber,
      movesThisTurn: 0,
      timeStarted: Date.now(),
    };

    // Start new turn for next player
    this.startNewTurn(newState, nextPlayerIndex);

    // Process start of turn effects for next player
    if (context?.processTriggers) {
      context.processTriggers('start_of_turn', newState);
    }

    // Create event
    const event = this.createEvent('turn_ended', playerId);

    return {
      success: true,
      newState,
      sideEffects: [event],
    };
  }

  /**
   * Clear temporary effects at end of turn
   */
  private clearTemporaryEffects(state: Turbo.IGameState<BloomBeastsState>): void {
    // Remove summoning sickness and reset ability usage
    for (const field of [state.gameData.field.player1, state.gameData.field.player2]) {
      field.beasts.forEach(beast => {
        if (beast) {
          beast.summoningSickness = false;
        }
      });
    }
  }

  /**
   * Initialize the new turn for a player
   */
  private startNewTurn(state: Turbo.IGameState<BloomBeastsState>, playerIndex: number): void {
    const player = state.gameData.players[playerIndex];
    const field = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;

    // Reset turn actions
    state.gameData.currentTurnActions = {
      hasDrawnCard: false,
      cardsPlayed: 0,
      hasAttacked: new Set<string>(),
    };

    // Increment energy (up to max turn energy)
    const turnNumber = state.turnInfo.turnNumber;
    player.energy = Math.min(turnNumber, 10); // Max 10 energy

    // Auto-draw a card at the start of turn (if deck has cards and hand isn't full)
    if (player.deck.length > 0 && player.hand.length < player.maxHandSize) {
      const card = player.deck.shift()!;
      player.hand.push(card);
      state.gameData.currentTurnActions.hasDrawnCard = true;
    }

    // Reset ability usage for beasts
    for (const beast of field.beasts) {
      if (beast) {
        beast.usedAbilityThisTurn = false;
      }
    }
  }
}
