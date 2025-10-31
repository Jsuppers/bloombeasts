/**
 * Type Definitions for BloomBeasts Game
 *
 * NOTE: This file only contains type exports used by the UI layer.
 * The actual game logic is in BloomBeastsGame.ts.
 */

import type { CardDisplayData } from './utils/cardUtils';

/**
 * Player statistics displayed in UI
 */
export interface MenuStats {
  playerLevel: number;
  totalXP: number;
  coins: number;
  serums: number;
}

/**
 * Sound settings for audio playback
 */
export interface SoundSettings {
  musicVolume: number; // 0-100
  sfxVolume: number; // 0-100
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

/**
 * Mission information for display in mission selection
 */
export interface MissionDisplay {
  id: string;
  name: string;
  level: number;
  difficulty: string;
  isAvailable: boolean;
  isCompleted: boolean;
  description: string;
  affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky' | 'Boss';
  beastId?: string;
}

/**
 * Card detail popup information
 */
export interface CardDetailDisplay {
  card: CardDisplayData;
  buttons: string[];
  isInDeck: boolean;
}

/**
 * Complete battle state for display in battle screen
 */
export interface BattleDisplay {
  playerHealth: number;
  playerMaxHealth: number;
  playerDeckCount: number;
  playerNectar: number;
  playerHand: any[];
  playerTrapZone: any[]; // Player's trap cards (face-down)
  playerBuffZone: any[]; // Player's active buff cards
  opponentHealth: number;
  opponentMaxHealth: number;
  opponentDeckCount: number;
  opponentNectar: number;
  opponentField: any[];
  opponentTrapZone: any[]; // Opponent's trap cards (face-down)
  opponentBuffZone: any[]; // Opponent's active buff cards
  playerField: any[];
  currentTurn: number;
  turnPlayer: string;
  turnTimeRemaining: number;
  objectives: ObjectiveDisplay[];
  habitatZone: any | null; // Current habitat card
  attackAnimation?: { // Attack animation state
    attackerPlayer: 'player' | 'opponent';
    attackerIndex: number;
    targetPlayer: 'player' | 'opponent' | 'health';
    targetIndex?: number; // undefined if targeting health
  } | null;
  cardPopup?: { // Card popup display (for magic/trap/buff cards)
    card: any;
    player: 'player' | 'opponent';
    showCloseButton?: boolean; // Show close button for manual popups
  } | null;
}

/**
 * Mission objective progress for display
 */
export interface ObjectiveDisplay {
  description: string;
  progress: number;
  target: number;
  isComplete: boolean;
}
