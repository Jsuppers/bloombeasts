/**
 * Display type definitions
 *
 * Types used for UI display and presentation.
 * These are view models that aggregate game state for presentation.
 */

import type { RuntimeCard } from '../../common/engine/types/runtime';
import type { BattleDisplayOptions } from '../../screens/battle/BattleDisplayManager';

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
  card: RuntimeCard;
  buttons: string[];
  isInDeck: boolean;
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

/**
 * Complete battle state for display in battle screen
 */
export interface BattleDisplay {
  playerHealth: number;
  playerMaxHealth: number;
  playerDeckCount: number;
  playerEnergy: number;
  playerHand: any[];
  playerTrapZone: any[]; // Player's trap cards (face-down)
  playerBuffZone: any[]; // Player's active buff cards
  opponentHealth: number;
  opponentMaxHealth: number;
  opponentDeckCount: number;
  opponentEnergy: number;
  opponentField: any[];
  opponentTrapZone: any[]; // Opponent's trap cards (face-down)
  opponentBuffZone: any[]; // Opponent's active buff cards
  playerField: any[];
  currentTurn: number;
  turnPlayer: string;
  turnTimeRemaining: number;
  objectives: ObjectiveDisplay[];
  habitatZone: any | null; // Current habitat card
  attackAnimation?: BattleDisplayOptions; // Attack animation state
  cardPopup?: { // Card popup display (for magic/trap/buff cards)
    card: any;
    player: 'player' | 'opponent';
    showCloseButton?: boolean; // Show close button for manual popups
  } | null;
}
