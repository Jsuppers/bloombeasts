/**
 * Mission System Type Definitions
 */

import type { Affinity, AnyCard } from '../../engine/types/core';
import type { DeckList } from '../../engine/utils/deckBuilder';

export type MissionDifficulty = 'beginner' | 'easy' | 'normal' | 'hard' | 'expert';

export type CardPool = 'common' | 'uncommon' | 'rare' | 'affinity' | 'any';

export interface ItemReward {
  itemId: string;               // Item ID from items.ts
  minAmount: number;            // Minimum items to receive
  maxAmount: number;            // Maximum items to receive
  dropChance: number;           // Chance to receive (0-1)
}

export interface MissionRewards {
  guaranteedXP: number;        // Minimum XP earned
  bonusXPChance: number;        // Chance for bonus XP (0-1)
  bonusXPAmount: number;        // Amount of bonus XP if triggered
  cardRewards: CardReward[];    // Possible card rewards
  itemRewards?: ItemReward[];   // Possible item rewards
}

export interface CardReward {
  cardPool: CardPool;
  affinity?: Affinity;         // If cardPool is 'affinity'
  minAmount: number;            // Minimum cards to receive
  maxAmount: number;            // Maximum cards to receive
  dropChance: number;           // Chance to receive (0-1)
}

export interface MissionObjective {
  type: 'defeat-opponent' | 'survive-turns' | 'deal-damage' |
        'summon-beasts' | 'use-abilities' | 'maintain-health';
  target?: number;              // Target value for objective
  description: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  storyText?: string;           // Lore/flavor text
  difficulty: MissionDifficulty;
  level: number;                // Mission level (1-10)
  affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky' | 'Boss'; // Mission affinity for visuals
  beastId: string;              // Beast card ID for mission image (e.g., 'Rootling')

  // Battle configuration
  playerDeck?: DeckList | (() => DeckList);        // Optional fixed deck for player (or factory function)
  opponentDeck: DeckList | (() => DeckList);       // AI opponent's deck (or factory function)
  opponentAI?: AIProfile;        // AI behavior profile (optional)

  // Mission specifics (all optional now)
  objectives?: MissionObjective[];
  turnLimit?: number;           // Optional turn limit
  specialRules?: SpecialRule[]; // Special battle rules

  // Rewards
  rewards: MissionRewards;
  firstTimeBonus?: MissionRewards; // Extra rewards for first completion

  // Progress tracking
  timesCompleted: number;
  bestScore?: number;
  lastPlayed?: Date;
  unlocked: boolean;
}

export interface SpecialRule {
  id: string;
  name: string;
  description: string;
  effect: 'double-xp' | 'no-abilities' | 'fast-nectar' |
          'burn-damage' | 'heal-per-turn' | 'random-effects';
}

export interface AIProfile {
  name: string;
  difficulty: MissionDifficulty;
  personality: 'aggressive' | 'defensive' | 'balanced' | 'strategic' | 'chaotic';

  // AI behavior weights (0-1)
  aggressiveness: number;       // Likelihood to attack
  resourceManagement: number;   // How well it manages nectar
  targetPriority: 'strongest' | 'weakest' | 'random' | 'strategic';
  abilityUsage: number;        // Likelihood to use abilities

  // Special AI behaviors
  behaviors?: AIBehavior[];
}

export interface AIBehavior {
  trigger: 'low-health' | 'high-nectar' | 'empty-field' | 'turn-count';
  condition?: number;
  action: 'play-defensive' | 'all-out-attack' | 'summon-rush' | 'ability-spam';
}

export interface MissionResult {
  missionId: string;
  completed: boolean;
  objectivesCompleted: string[];
  turnsUsed: number;
  damageDealt: number;
  beastsDefeated: number;
  score: number;

  // Rewards earned
  xpEarned: number;
  cardsEarned: AnyCard[];
  nectarEarned: number;
}

export interface MissionProgress {
  missionId: string;
  attempts: number;
  completions: number;
  bestScore: number;
  totalXPEarned: number;
  totalCardsEarned: number;
  averageCompletion: number;   // Average turns to complete
  currentStreak: number;        // Consecutive completions
}

/**
 * Helper to resolve a deck (handles both direct DeckList and factory functions)
 */
export function resolveDeck(deckOrFactory: DeckList | (() => DeckList)): DeckList {
  if (typeof deckOrFactory === 'function') {
    return deckOrFactory();
  }
  return deckOrFactory;
}