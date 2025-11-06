/**
 * ActionProcessor - Processes player actions
 *
 * Responsibilities:
 * - Execute player actions (play card, attack, etc.)
 * - Validate actions before execution
 * - Return action results
 */

import { Turbo } from '../../lib/Turbo-Standalone';

import { Logger } from '../../engine/utils/Logger';
import type { BloomBeastsState, BloomBeastsActionData } from '../BloomBeastsGame';
import { BloomBeastsActionType } from '../BloomBeastsGame';

export class ActionProcessor {
  private game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>;

  constructor(game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>) {
    this.game = game;
  }

  /**
   * Draw a card
   */
  drawCard(playerId: string): boolean {
    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.DRAW_CARD,
      }
    });

    if (!result.success) {
      Logger.warn(`[ActionProcessor] Failed to draw card: ${result.error}`);
    }

    return result.success;
  }

  /**
   * Play a card
   */
  playCard(cardId: string, playerId: string, position?: number): boolean {
    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.PLAY_CARD,
        cardId,
        position,
      }
    });

    if (!result.success) {
      Logger.warn(`[ActionProcessor] Failed to play card: ${result.error}`);
    }

    return result.success;
  }

  /**
   * Attack with a beast
   */
  attack(attackerId: string, targetId: string, playerId: string): boolean {
    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.ATTACK,
        cardId: attackerId,
        targetId,
      }
    });

    if (!result.success) {
      Logger.warn(`[ActionProcessor] Failed to attack: ${result.error}`);
    }

    return result.success;
  }

  /**
   * Attack player directly
   */
  attackPlayer(attackerId: string, playerId: string): boolean {
    const state = this.game.getState();
    const currentPlayerId = state.turnInfo.currentPlayerId;
    const currentIndex = state.gameData.players.findIndex(p => p.id === currentPlayerId);
    const targetPlayer = state.gameData.players[1 - currentIndex];

    return this.attack(attackerId, targetPlayer.id, playerId);
  }

  /**
   * Use creature ability
   */
  useAbility(creatureId: string, targetId: string | null, playerId: string): boolean {
    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.USE_ABILITY,
        cardId: creatureId,
        targetId: targetId || undefined,
        abilityId: 'default',
      }
    });

    if (!result.success) {
      Logger.warn(`[ActionProcessor] Failed to use ability: ${result.error}`);
    }

    return result.success;
  }

  /**
   * End turn
   */
  endTurn(playerId: string): boolean {
    Logger.info(`[ActionProcessor] Ending turn for ${playerId}`);

    const result = this.game.performAction({
      type: 'game_action',
      playerId,
      data: {
        type: BloomBeastsActionType.END_TURN,
      }
    });

    if (result.success) {
      const newState = this.game.getState();
      const currentPlayerId = newState.turnInfo.currentPlayerId;
      Logger.info(`[ActionProcessor] Turn ended successfully. New current player: ${currentPlayerId}`);
    } else {
      Logger.error(`[ActionProcessor] Failed to end turn: ${result.error}`);
    }

    return result.success;
  }

  /**
   * Get available actions for current player
   */
  getAvailableActions() {
    return this.game.getAvailableActions();
  }
}
