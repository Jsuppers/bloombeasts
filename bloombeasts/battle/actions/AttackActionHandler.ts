/**
 * Attack Action Handler
 *
 * Handles the ATTACK action, allowing a beast to attack a target (player or another beast)
 */

import type { IGameState } from '../../../turbo/src';
import type { BloomBeastsState, BloomBeastsActionData, BeastFieldCard } from '../BloomBeastsGame';
import { BloomBeastsActionType } from '../BloomBeastsGame';
import { BaseActionHandler, ActionValidationResult } from './ActionHandler';

export interface AttackActionData extends BloomBeastsActionData {
  type: BloomBeastsActionType.ATTACK;
  cardId: string;
  targetId?: string;
}

export class AttackActionHandler extends BaseActionHandler<AttackActionData> {
  readonly actionType = BloomBeastsActionType.ATTACK;

  validate(
    actionData: AttackActionData,
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult {
    // Find the attacking beast
    const attacker = this.findBeastOnField(actionData.cardId, state);
    if (!attacker) {
      return { valid: false, reason: 'Attacker not found' };
    }

    // Check summoning sickness
    if (attacker.summoningSickness) {
      return { valid: false, reason: 'Beast has summoning sickness' };
    }

    // Check if already attacked this turn
    if (state.gameData.currentTurnActions.hasAttacked.has(actionData.cardId)) {
      return { valid: false, reason: 'Beast already attacked this turn' };
    }

    // Check attack value
    if (attacker.attack <= 0) {
      return { valid: false, reason: 'Beast has no attack power' };
    }

    // If there's a target, validate it exists
    if (actionData.targetId) {
      const playerIndex = state.gameData.players.findIndex(p => p.id === playerId);
      const opponentIndex = 1 - playerIndex;
      const opponent = state.gameData.players[opponentIndex];

      // Check if targeting opponent player
      if (actionData.targetId === opponent.id) {
        return { valid: true };
      }

      // Check if targeting a beast
      const target = this.findBeastOnField(actionData.targetId, state);
      if (!target) {
        return { valid: false, reason: 'Target not found' };
      }
    }

    return { valid: true };
  }

  execute(
    actionData: AttackActionData,
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): IGameState<BloomBeastsState> {
    const newState = this.cloneState(state);

    const attacker = this.findBeastOnField(actionData.cardId, newState);
    if (!attacker) {
      throw new Error('Attacker not found');
    }

    const playerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
    const opponentIndex = 1 - playerIndex;
    const opponent = newState.gameData.players[opponentIndex];

    if (!actionData.targetId || actionData.targetId === opponent.id) {
      // Direct attack on player
      opponent.health -= attacker.attack;
    } else {
      // Attack on beast
      const target = this.findBeastOnField(actionData.targetId, newState);
      if (!target) {
        throw new Error('Target not found');
      }

      // Both creatures deal damage to each other
      target.health -= attacker.attack;
      attacker.health -= target.attack;

      // Check for defeats
      if (target.health <= 0) {
        this.destroyBeast(target, newState);
      }
      if (attacker.health <= 0) {
        this.destroyBeast(attacker, newState);
      }
    }

    // Update turn tracking
    newState.gameData.currentTurnActions.hasAttacked.add(actionData.cardId);

    return newState;
  }

  /**
   * Find a beast on the field by ID
   */
  private findBeastOnField(
    beastId: string,
    state: IGameState<BloomBeastsState>
  ): BeastFieldCard | null {
    for (const field of [state.gameData.field.player1, state.gameData.field.player2]) {
      for (const beast of field.beasts) {
        if (beast?.id === beastId) {
          return beast;
        }
      }
    }
    return null;
  }

  /**
   * Remove a defeated beast from the field and add to graveyard
   */
  private destroyBeast(beast: BeastFieldCard, state: IGameState<BloomBeastsState>): void {
    // Remove from field
    for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
      const field = playerIdx === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
      const index = field.beasts.findIndex(b => b?.id === beast.id);
      if (index !== -1) {
        field.beasts[index] = null;

        // Add to graveyard
        const owner = state.gameData.players[playerIdx];
        owner.graveyard.push(beast);
        break;
      }
    }
  }
}
