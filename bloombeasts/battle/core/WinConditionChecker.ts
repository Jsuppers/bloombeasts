/**
 * WinConditionChecker - Determines battle end conditions and winners
 *
 * Responsibilities:
 * - Check if battle has ended
 * - Determine winner
 * - Calculate battle results
 */

import { Turbo } from '../../lib/Turbo-Standalone';

import type { BloomBeastsState, BloomBeastsPlayer } from '../BloomBeastsGame';
import type { BattleResult } from '../types';

export class WinConditionChecker {
  /**
   * Check if the battle has ended and return result
   */
  checkBattleEnd(state: Turbo.IGameState<BloomBeastsState>): BattleResult | null {
    if (!state.isComplete) {
      return null;
    }

    const players = state.gameData.players;
    const winner = this.determineWinner(state);

    return {
      winner,
      turns: state.turnInfo.turnNumber,
      player1Health: players[0].health,
      player2Health: players[1].health,
    };
  }

  /**
   * Determine the winner from the game state
   */
  private determineWinner(state: Turbo.IGameState<BloomBeastsState>): 'player1' | 'player2' | null {
    const players = state.gameData.players;

    // Check sudden end (timeout/forfeit/disconnect) first (highest priority)
    if (state.gameData.suddenEnd) {
      const loserPlayerId = state.gameData.suddenEnd.playerId;
      // Find which player caused the sudden end
      if (players[0].id === loserPlayerId) {
        return 'player2'; // Player 1 ended suddenly, player 2 wins
      } else {
        return 'player1'; // Player 2 ended suddenly, player 1 wins
      }
    }

    // Check health-based win
    if (players[0].health <= 0 && players[1].health > 0) {
      return 'player2';
    }
    if (players[1].health <= 0 && players[0].health > 0) {
      return 'player1';
    }

    // Check deck-out win
    const p1HasCards = players[0].deck.length > 0 || players[0].hand.length > 0;
    const p2HasCards = players[1].deck.length > 0 || players[1].hand.length > 0;

    if (!p1HasCards && p2HasCards) {
      return 'player2';
    }
    if (!p2HasCards && p1HasCards) {
      return 'player1';
    }

    // Tie or draw
    return null;
  }

  /**
   * Check if the game should end based on current state
   */
  shouldGameEnd(state: Turbo.IGameState<BloomBeastsState>): boolean {
    // Check sudden end (timeout/forfeit/disconnect) first (highest priority)
    if (state.gameData.suddenEnd) {
      return true;
    }

    const players = state.gameData.players;

    // Check if any player is defeated
    const aliveCount = players.filter(p => p.health > 0).length;
    if (aliveCount < 2) {
      return true;
    }

    // Check if any player is decked out
    const playersWithCards = players.filter(p => p.deck.length > 0 || p.hand.length > 0).length;
    if (playersWithCards < 2) {
      return true;
    }

    return false;
  }

  /**
   * Get winner ID from state (returns player ID, not 'player1'/'player2')
   */
  getWinnerId(state: Turbo.IGameState<BloomBeastsState>): string | null {
    const winner = this.determineWinner(state);
    if (!winner) return null;

    return winner === 'player1' ? state.gameData.players[0].id : state.gameData.players[1].id;
  }
}
