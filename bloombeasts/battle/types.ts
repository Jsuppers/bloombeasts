/**
 * Battle System Types
 *
 * Core type definitions for the generic battle system.
 * This system works with any two players (human vs AI, human vs human, AI vs AI).
 */

import { GameState, Player } from '../engine/types/game';
import { AnyCard } from '../engine/types/core';
import type { IGameState } from '../../turbo/src';
import type { BloomBeastsState } from './BloomBeastsGame';

/**
 * Result of a battle action
 */
export interface BattleActionResult {
  success: boolean;
  message?: string;
  damage?: number;
  isTrap?: boolean;
}

/**
 * Battle configuration - passed when initializing a battle
 */
export interface BattleConfig {
  player1: PlayerConfig;
  player2: PlayerConfig;
}

/**
 * Configuration for a player in a battle
 */
export interface PlayerConfig {
  id: string;
  name: string;
  deck: AnyCard[];
  health?: number;
  maxHealth?: number;
  isAI?: boolean;
  aiStrategy?: 'default' | 'aggressive' | 'defensive' | 'custom';
}

/**
 * Current state of an active battle
 * Now uses TURBO's IGameState directly (no conversion layer)
 */
export interface BattleState {
  /** TURBO game state (contains gameData with players and field) */
  turboState: IGameState<BloomBeastsState>;
  /** @deprecated Use turboState.gameData instead */
  gameState?: GameState;
}

/**
 * Callbacks for battle events
 */
export interface BattleCallbacks {
  onTurnStart?: (playerIndex: number) => void;
  onTurnEnd?: (playerIndex: number) => void;
  onAction?: (action: string, playerId: string) => void;
  onBattleEnd?: (winner: 'player1' | 'player2' | null) => void;
  onRender?: () => void;
}

/**
 * Result of a completed battle
 */
export interface BattleResult {
  winner: 'player1' | 'player2' | null;
  turns: number;
  player1Health: number;
  player2Health: number;
}
