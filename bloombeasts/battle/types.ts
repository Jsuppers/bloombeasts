/**
 * Battle System Types
 *
 * Core type definitions for the generic battle system.
 * This system works with any two players (human vs AI, human vs human, AI vs AI).
 */

import { GameState, Player } from '../engine/types/game';
import { AnyCard } from '../engine/types/core';

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
 */
export interface BattleState {
  gameState: GameState;
  isComplete: boolean;
  winner: 'player1' | 'player2' | null;
  turn: number;
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
