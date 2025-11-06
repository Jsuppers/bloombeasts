/**
 * Battle System - Public API
 *
 * Generic, reusable battle system that works with any two players.
 * Supports human vs AI, human vs human, and AI vs AI battles.
 *
 * Usage:
 * ```typescript
 * import { BattleController, BattleConfig } from './battle';
 *
 * const battleController = new BattleController(asyncMethods);
 * const battle = battleController.initializeBattle({
 *   player1: { id: 'p1', name: 'Player', deck: playerDeck },
 *   player2: { id: 'p2', name: 'Opponent', deck: opponentDeck, isAI: true }
 * });
 *
 * // Subscribe to TURBO events
 * const game = battleController.getGameController();
 * game.on('stateChanged', () => console.log('State changed'));
 * game.on('turnStarted', ({ playerId }) => console.log(`Turn started: ${playerId}`));
 * ```
 */

import { Turbo } from '../lib/Turbo-Standalone';

// Core exports
export { BattleController } from './core/BattleController';

// Type exports
export type {
  BattleConfig,
  BattleState,
  BattleResult,
  BattleActionResult,
  PlayerConfig,
} from './types';

// TURBO-based exports
export { createBloomBeastsGame, BloomBeastsRules } from './BloomBeastsGame';
export { BloomBeastsGreedyAI, BloomBeastsRandomAI } from './BloomBeastsAI';

// TURBO namespace is available globally via the standalone file reference
