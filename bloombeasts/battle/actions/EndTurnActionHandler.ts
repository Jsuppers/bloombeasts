/**
 * End Turn Action Handler
 *
 * Handles the END_TURN action, switching to the next player and resetting turn state
 */

import type { IGameState } from '../../../turbo/src';
import type { BloomBeastsState, BloomBeastsActionData } from '../BloomBeastsGame';
import { BloomBeastsActionType } from '../BloomBeastsGame';
import { BaseActionHandler, ActionValidationResult } from './ActionHandler';

export interface EndTurnActionData extends BloomBeastsActionData {
  type: BloomBeastsActionType.END_TURN;
}

export class EndTurnActionHandler extends BaseActionHandler<EndTurnActionData> {
  readonly actionType = BloomBeastsActionType.END_TURN;

  validate(
    actionData: EndTurnActionData,
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult {
    // Can always end turn
    return { valid: true };
  }

  execute(
    actionData: EndTurnActionData,
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): IGameState<BloomBeastsState> {
    const newState = this.cloneState(state);

    const currentPlayerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
    const players = newState.gameData.players;

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

    return newState;
  }

  /**
   * Initialize the new turn for a player
   */
  private startNewTurn(state: IGameState<BloomBeastsState>, playerIndex: number): void {
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

    // Remove summoning sickness from beasts
    for (const beast of field.beasts) {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedAbilityThisTurn = false;
      }
    }
  }
}
