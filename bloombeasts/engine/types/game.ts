/**
 * Game state and player types
 */

import { AnyCard, HabitatCard, Counter } from './core';
import { BloomBeastInstance } from './leveling';
import { SimpleMap } from '../../utils/polyfills';

// Re-export for convenience
export { BloomBeastInstance } from './leveling';

// Battle state enum for state-based battle flow
export enum BattleState {
  Setup = 'Setup',
  Player1StartOfTurn = 'Player1StartOfTurn',
  Player1Playing = 'Player1Playing',
  Player1EndOfTurn = 'Player1EndOfTurn',
  Player2StartOfTurn = 'Player2StartOfTurn',
  Player2Playing = 'Player2Playing',
  Player2EndOfTurn = 'Player2EndOfTurn',
  Finished = 'Finished'
}

// Phase type for game flow (kept for backward compatibility)
export type Phase = 'Setup' | 'Draw' | 'Main' | 'Combat' | 'End';

export interface Player {
  id?: string;
  name: string;
  health: number;
  maxHealth?: number;
  nectar?: number;
  permanentNectar?: number;
  temporaryNectar?: number;
  currentNectar: number;  // Available nectar this turn
  summonsThisTurn: number; // Track summons for extra summon effects
  deck: AnyCard[];
  hand: AnyCard[];
  discardPile?: AnyCard[];
  graveyard: AnyCard[];  // Cards that have been destroyed
  field: (BloomBeastInstance | null)[]; // Nullable for empty slots
  trapZone: (AnyCard | null)[]; // Face-down trap cards (max 3)
  buffZone: (AnyCard | null)[]; // Active buff cards (max 2)
  habitatCounters: SimpleMap<string, number>; // Counters specific to this player's habitat
}

export interface GameState {
  players: [Player, Player];
  currentPlayerIndex?: 0 | 1;
  activePlayer: 0 | 1;  // Current player's turn
  habitatZone: HabitatCard | null;
  habitatCounters?: Counter[]; // Counters on the habitat (like Spores)
  turn: number;
  phase: Phase;  // Kept for backward compatibility
  battleState: BattleState;  // New state-based battle flow
  turnHistory: any[];  // History of actions taken
  // Pending actions that need to be resolved
  drawCardsQueued?: number;
  drawForPlayerIndex?: 0 | 1;
  pendingMove?: {
    unit: BloomBeastInstance;
    destination: string;
  };
  pendingSearch?: {
    searchFor: string;
    quantity: number;
    affinity?: string;
  };
}

// Alias for Phase from core
export type GamePhase = Phase;

export interface GameAction {
  type: string;
  playerId: string;
  timestamp: number;
}

export interface SummonAction extends GameAction {
  type: 'SUMMON';
  cardId: string;
  slotIndex: number;
}

export interface AttackAction extends GameAction {
  type: 'ATTACK';
  attackerInstanceId: string;
  targetInstanceId?: string; // undefined means attacking player directly
}

export interface PlayMagicAction extends GameAction {
  type: 'PLAY_MAGIC';
  cardId: string;
  targetInstanceId?: string;
}

export interface GainXPAction extends GameAction {
  type: 'GAIN_XP';
  instanceId: string;
  amount: number;
  source: 'Combat' | 'NectarSacrifice';
}

export interface HabitatShiftAction extends GameAction {
  type: 'HABITAT_SHIFT';
  habitatCardId: string;
}
