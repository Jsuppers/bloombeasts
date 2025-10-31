/**
 * TurnManager - Handles turn flow and sequencing
 *
 * Responsibilities:
 * - Turn initialization (drawing cards, applying start-of-turn effects)
 * - Turn cleanup (removing summoning sickness, applying end-of-turn effects)
 * - Turn transitions between players
 */

import { Player, GameState } from '../../engine/types/game';
import { Logger } from '../../engine/utils/Logger';
import type { AsyncMethods } from '../../ui/types/bindings';

export class TurnManager {
  private async: AsyncMethods;

  constructor(async: AsyncMethods) {
    this.async = async;
  }

  /**
   * Initialize a player's turn
   */
  initializeTurn(player: Player, gameState: GameState, turnNumber: number): void {
    Logger.debug(`[TurnManager] Starting turn ${turnNumber} for ${player.name}`);

    // Draw a card
    if (player.deck.length > 0) {
      const card = player.deck.shift();
      if (card) {
        player.hand.push(card);
        Logger.debug(`[TurnManager] ${player.name} drew: ${card.name}`);
      }
    }

    // Increase nectar (max 10)
    player.currentNectar = Math.min(10, turnNumber);

    // Reset summoning sickness for all beasts
    player.field.forEach((beast: any) => {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedAbilityThisTurn = false;
      }
    });

    // Reset summons counter
    player.summonsThisTurn = 0;
  }

  /**
   * Clean up at end of turn
   */
  cleanupTurn(player: Player, opponent: Player): void {
    Logger.debug(`[TurnManager] Ending turn for ${player.name}`);

    // Process end-of-turn effects would go here
    // (currently handled by BattleRules/BattleStateManager)
  }

  /**
   * Switch active player
   */
  switchPlayer(gameState: GameState): void {
    gameState.activePlayer = (1 - gameState.activePlayer) as 0 | 1;
    Logger.debug(`[TurnManager] Switched to player ${gameState.activePlayer}`);
  }
}
