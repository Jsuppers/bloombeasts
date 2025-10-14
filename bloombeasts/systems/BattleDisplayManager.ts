/**
 * BattleDisplayManager - Handles battle UI rendering and display enrichment
 * Manages battle state visualization, animations, and card popups
 */

import { getAllCards } from '../engine/cards';
import { BloomBeastCard } from '../engine/types/core';
import { STARTING_HEALTH, TURN_TIME_LIMIT } from '../engine/constants/gameRules';

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
  selectedBeastIndex: number | null; // Track selected beast for attacking
  attackAnimation?: { // Attack animation state
    attackerPlayer: 'player' | 'opponent';
    attackerIndex: number;
    targetPlayer: 'player' | 'opponent' | 'health';
    targetIndex?: number; // undefined if targeting health
  } | null;
  cardPopup?: { // Card popup display (for magic/trap/buff cards)
    card: any;
    player: 'player' | 'opponent';
  } | null;
}

export interface ObjectiveDisplay {
  description: string;
  progress: number;
  target: number;
  isComplete: boolean;
}

export class BattleDisplayManager {
  /**
   * Create a battle display object from battle state
   */
  createBattleDisplay(
    battleState: any,
    selectedBeastIndex: number | null,
    attackAnimation?: {
      attackerPlayer: 'player' | 'opponent';
      attackerIndex: number;
      targetPlayer: 'player' | 'opponent' | 'health';
      targetIndex?: number;
    } | null
  ): BattleDisplay | null {
    if (!battleState || !battleState.gameState) {
      return null;
    }

    // Players is a tuple [Player, Player] where index 0 is typically the player
    const player = battleState.gameState.players[0];
    const opponent = battleState.gameState.players[1];

    if (!player || !opponent) return null;

    // Convert to display format
    const display: BattleDisplay = {
      playerHealth: player.health,
      playerMaxHealth: player.maxHealth || STARTING_HEALTH, // Default to STARTING_HEALTH if undefined
      playerDeckCount: player.deck.length,
      playerNectar: player.currentNectar,
      playerHand: player.hand,
      playerTrapZone: player.trapZone || [null, null, null],
      playerBuffZone: player.buffZone || [null, null],
      opponentHealth: opponent.health,
      opponentMaxHealth: opponent.maxHealth || STARTING_HEALTH, // Default to STARTING_HEALTH if undefined
      opponentDeckCount: opponent.deck.length,
      opponentNectar: opponent.currentNectar,
      opponentField: this.enrichFieldBeasts(opponent.field, battleState.gameState, 1), // Opponent is player index 1
      opponentTrapZone: opponent.trapZone || [null, null, null],
      opponentBuffZone: opponent.buffZone || [null, null],
      playerField: this.enrichFieldBeasts(player.field, battleState.gameState, 0), // Player is player index 0
      currentTurn: battleState.gameState.turn,
      turnPlayer: battleState.gameState.activePlayer === 0 ? 'player' : 'opponent',
      turnTimeRemaining: TURN_TIME_LIMIT,
      objectives: this.getObjectiveDisplay(battleState),
      habitatZone: battleState.gameState.habitatZone,
      selectedBeastIndex: selectedBeastIndex,
      attackAnimation: attackAnimation,
    };

    return display;
  }

  /**
   * Get objective display for current battle
   */
  private getObjectiveDisplay(battleState: any): ObjectiveDisplay[] {
    if (!battleState.mission || !battleState.progress) {
      return [];
    }

    // Check if mission has objectives defined
    if (!battleState.mission.objectives || !Array.isArray(battleState.mission.objectives)) {
      return [];
    }

    return battleState.mission.objectives.map((obj: any) => {
      const key = `${obj.type}-${obj.target || 0}`;
      const progress = battleState.progress.objectiveProgress.get(key) || 0;
      const target = obj.target || 1;

      return {
        description: obj.description,
        progress: Math.min(progress, target),
        target: target,
        isComplete: progress >= target,
      };
    });
  }

  /**
   * Enrich field beasts with card definition data and apply bonuses for display
   */
  private enrichFieldBeasts(field: any[], gameState?: any, playerIndex?: number): any[] {
    // Create a card lookup map from all card definitions
    const cardMap = new Map<string, BloomBeastCard>();
    const allCards = getAllCards();
    allCards.forEach((card: any) => {
      if (card && card.type === 'Bloom') {
        cardMap.set(card.id, card as BloomBeastCard);
      }
    });

    return field.map(beast => {
      if (!beast) return null;

      // Get the card definition
      const cardDef = cardMap.get(beast.cardId);

      if (!cardDef) return beast; // Return as-is if card not found

      // Calculate stat bonuses from habitat and buffs (only if we have gameState and playerIndex)
      const bonuses = (gameState && playerIndex !== undefined)
        ? this.calculateStatBonuses(beast, gameState, playerIndex)
        : { attackBonus: 0, healthBonus: 0 };

      // Merge instance data with card definition data and apply bonuses
      // Only add abilities if they're not already present
      return {
        ...beast,
        name: beast.name || cardDef.name,
        affinity: beast.affinity || cardDef.affinity,
        cost: beast.cost || cardDef.cost,
        ability: beast.ability || cardDef.ability,
        // Apply bonuses to display stats (don't modify the actual beast in game engine)
        currentAttack: (beast.currentAttack || 0) + bonuses.attackBonus,
        currentHealth: (beast.currentHealth || 0) + bonuses.healthBonus,
        maxHealth: (beast.maxHealth || 0) + bonuses.healthBonus,
      };
    });
  }

  /**
   * Calculate stat bonuses for a beast from habitat and buff zones
   */
  private calculateStatBonuses(beast: any, gameState: any, playerIndex: number): { attackBonus: number; healthBonus: number } {
    let attackBonus = 0;
    let healthBonus = 0;

    // Helper to check if effect applies to this beast
    const checkCondition = (condition: any): boolean => {
      if (!condition) return true; // No condition means applies to all

      switch (condition.type) {
        case 'affinity-matches':
        case 'AffinityMatches':
          return beast.affinity === condition.value;
        // Add more condition types as needed
        default:
          return true;
      }
    };

    // Helper to process ongoing effects
    const processOngoingEffects = (effects: any[]) => {
      if (!effects || !Array.isArray(effects)) return;

      effects.forEach((effect: any) => {
        // Only process stat modification effects with WhileOnField duration
        if (effect.type === 'modify-stats' || effect.type === 'ModifyStats') {
          if (effect.duration === 'while-on-field' || effect.duration === 'WhileOnField') {
            // Check if effect applies to this beast
            if (checkCondition(effect.condition)) {
              // Apply the bonus based on stat type
              if (effect.stat === 'attack' || effect.stat === 'Attack') {
                attackBonus += effect.value || 0;
              } else if (effect.stat === 'health' || effect.stat === 'Health') {
                healthBonus += effect.value || 0;
              } else if (effect.stat === 'both' || effect.stat === 'Both') {
                attackBonus += effect.value || 0;
                healthBonus += effect.value || 0;
              }
            }
          }
        }
      });
    };

    // Process habitat zone ongoing effects
    if (gameState.habitatZone && gameState.habitatZone.ongoingEffects) {
      processOngoingEffects(gameState.habitatZone.ongoingEffects);
    }

    // Process buff zones ONLY for the player who owns this beast
    if (gameState.players && gameState.players[playerIndex]) {
      const player = gameState.players[playerIndex];
      if (player.buffZone && Array.isArray(player.buffZone)) {
        player.buffZone.forEach((buff: any) => {
          if (buff && buff.ongoingEffects) {
            processOngoingEffects(buff.ongoingEffects);
          }
        });
      }
    }

    return { attackBonus, healthBonus };
  }
}
