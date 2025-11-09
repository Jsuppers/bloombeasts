/**
 * Attack Action Handler
 *
 * Handles the ATTACK action, allowing a beast to attack a target (player or another beast)
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import type { BloomBeastsState, BloomBeastsActionData, RuntimeBeast } from '../types';
import { BloomBeastsActionType } from '../types';
import { BaseActionHandler, ActionValidationResult, ActionHandlerContext } from './ActionHandler';

export interface AttackActionData extends BloomBeastsActionData {
  type: BloomBeastsActionType.ATTACK;
  cardId: string;
  targetId?: string;
}

export class AttackActionHandler extends BaseActionHandler<AttackActionData> {
  readonly actionType = BloomBeastsActionType.ATTACK;

  validate(
    actionData: AttackActionData,
    state: Turbo.IGameState<BloomBeastsState>,
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
    if (attacker.currentAttack <= 0) {
      return { valid: false, reason: 'Beast has no attack power' };
    }

    // Recalculate valid targets based on current field state (slot-based targeting)
    const playerIndex = state.gameData.players.findIndex(p => p.id === playerId);
    const opponentIndex = 1 - playerIndex;
    const opponent = state.gameData.players[opponentIndex];
    const currentField = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
    const opponentField = playerIndex === 0 ? state.gameData.field.player2 : state.gameData.field.player1;

    // Find the slot index of the attacking beast
    const slotIndex = currentField.beasts.findIndex(b => b?.id === actionData.cardId);
    if (slotIndex === -1) {
      return { valid: false, reason: 'Attacker not found on field' };
    }

    // Determine the correct target based on current field state
    const opponentBeast = opponentField.beasts[slotIndex];
    let validTargetId: string;

    if (opponentBeast) {
      // Beast in opposite slot - must attack that beast
      validTargetId = opponentBeast.id;
    } else {
      // No beast in opposite slot - must attack player
      validTargetId = opponent.id;
    }

    // Validate that the provided target matches the calculated valid target
    if (actionData.targetId !== validTargetId) {
      return { valid: false, reason: 'Invalid target for slot position' };
    }

    return { valid: true };
  }

  execute(
    actionData: AttackActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string,
    context?: ActionHandlerContext
  ): Turbo.IActionResult<BloomBeastsState> {
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
      opponent.health -= attacker.currentAttack;
    } else {
      // Attack on beast
      const target = this.findBeastOnField(actionData.targetId, newState);
      if (!target) {
        throw new Error('Target not found');
      }

      // Both creatures deal damage to each other
      target.currentHealth -= attacker.currentAttack;
      attacker.currentHealth -= target.currentAttack;

      // Check for defeats
      if (target.currentHealth <= 0) {
        this.destroyBeast(target, newState);
      }
      if (attacker.currentHealth <= 0) {
        this.destroyBeast(attacker, newState);
      }
    }

    // Update turn tracking
    newState.gameData.currentTurnActions.hasAttacked.add(actionData.cardId);

    // Process OnAttack triggers
    if (context?.processTriggers) {
      context.processTriggers('on_action', newState, { action: 'attack' });
    }

    // Create event
    const event = this.createEvent('attack', playerId);

    return {
      success: true,
      newState,
      sideEffects: [event],
    };
  }

  /**
   * Find a beast on the field by ID
   */
  private findBeastOnField(
    beastId: string,
    state: Turbo.IGameState<BloomBeastsState>
  ): RuntimeBeast | null {
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
  private destroyBeast(beast: RuntimeBeast, state: Turbo.IGameState<BloomBeastsState>): void {
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
