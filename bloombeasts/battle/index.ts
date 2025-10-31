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
 * const battleController = new BattleController(asyncMethods, callbacks);
 * const battle = battleController.initializeBattle({
 *   player1: { id: 'p1', name: 'Player', deck: playerDeck },
 *   player2: { id: 'p2', name: 'Opponent', deck: opponentDeck, isAI: true }
 * });
 * ```
 */

// Core exports
export { BattleController } from './core/BattleController';
export { TurnManager } from './core/TurnManager';

// Player exports
export { HumanPlayer, AIBattlePlayer } from './player/BattlePlayer';
export type { IBattlePlayer, BattlePlayerCallbacks } from './player/BattlePlayer';

// Type exports
export type {
  BattleConfig,
  BattleState,
  BattleCallbacks,
  BattleResult,
  BattleActionResult,
  PlayerConfig,
} from './types';

// Game rules (used internally, but exported for extensibility)
export { BattleStateManager as BattleRules } from './core/BattleRules';

// AI exports
export { OpponentAI } from './ai/OpponentAI';
