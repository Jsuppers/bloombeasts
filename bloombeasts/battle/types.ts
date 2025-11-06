/**
 * Battle System Types
 *
 * Core type definitions for the generic battle system.
 * This system works with any two players (human vs AI, human vs human, AI vs AI).
 */

import { Turbo } from '../lib/Turbo-Standalone';
import { GameState, Player } from '../engine/types/game';
import {
  AnyCard,
  BloomBeastCard,
  MagicCard,
  TrapCard,
  BuffCard,
  HabitatCard
} from '../engine/types/core';
import {
  RuntimeCard,
  RuntimeBeast,
  RuntimeMagic,
  RuntimeTrap,
  RuntimeBuff,
  RuntimeHabitat
} from '../engine/types/runtime';

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
  deck: RuntimeCard[];
  health?: number;
  maxHealth?: number;
  isAI?: boolean;
  aiStrategy?: 'default' | 'aggressive' | 'defensive' | 'custom';
}

/**
 * Current state of an active battle
 * Uses TURBO's IGameState directly (no conversion layer)
 */
export interface BattleState {
  /** TURBO game state (contains gameData with players and field) */
  turboState: Turbo.IGameState<BloomBeastsState>;
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

/**
 * Re-export runtime types
 * These are the unified runtime card types used throughout the battle system
 */
export type { RuntimeCard, RuntimeBeast, RuntimeMagic, RuntimeTrap, RuntimeBuff, RuntimeHabitat };

/**
 * BloomBeasts Game State Types
 *
 * These types are used by both the game engine (BloomBeastsGame.ts) and action handlers.
 * They're defined here to avoid circular dependencies.
 */

/**
 * BloomBeasts action types
 */
export enum BloomBeastsActionType {
  DRAW_CARD = 'draw_card',
  PLAY_CARD = 'play_card',
  ATTACK = 'attack',
  USE_ABILITY = 'use_ability',
  END_TURN = 'end_turn',
  TIMEOUT = 'timeout',
  FORFEIT = 'forfeit',
}

/**
 * BloomBeasts action data
 */
export interface BloomBeastsActionData extends Record<string, unknown> {
  type: BloomBeastsActionType;
  cardId?: string;
  targetId?: string;
  position?: number;
  abilityId?: string;
}

/**
 * BloomBeasts player data
 */
export interface BloomBeastsPlayer {
  id: string;
  name: string;
  health: number;
  energy: number;
  deck: RuntimeCard[];
  hand: RuntimeCard[];
  graveyard: RuntimeCard[];
  maxHandSize: number;
  maxHealth: number;
}

/**
 * BloomBeasts specific game state
 */
export interface BloomBeastsState extends Record<string, unknown> {
  players: BloomBeastsPlayer[];
  field: {
    player1: {
      beasts: (RuntimeBeast | null)[];
      buffs: (RuntimeBuff | null)[];
      habitat: RuntimeHabitat | null;
      traps: RuntimeTrap[];
    };
    player2: {
      beasts: (RuntimeBeast | null)[];
      buffs: (RuntimeBuff | null)[];
      habitat: RuntimeHabitat | null;
      traps: RuntimeTrap[];
    };
  };
  currentTurnActions: {
    hasDrawnCard: boolean;
    cardsPlayed: number;
    hasAttacked: Set<string>;
  };
  /** Set when a game ends suddenly (timeout, forfeit, disconnect) - causes immediate game end */
  suddenEnd?: {
    playerId: string;
    reason: SuddenEndReason;
  };
}

/**
 * Reasons for sudden game end
 */
export enum SuddenEndReason {
  TIMEOUT = 'timeout',
  FORFEIT = 'forfeit',
  DISCONNECT = 'disconnect',
}
