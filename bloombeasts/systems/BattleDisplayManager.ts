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
   * Enrich field beasts with card definition data
   * NOTE: Do NOT apply bonuses here - the engine's StatModifierManager already handles this!
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

      // Merge instance data with card definition data
      // The engine's StatModifierManager already includes all bonuses in currentAttack/currentHealth/maxHealth
      // We do NOT need to calculate or apply bonuses here
      return {
        ...beast,
        name: beast.name || cardDef.name,
        affinity: beast.affinity || cardDef.affinity,
        cost: beast.cost || cardDef.cost,
        ability: beast.ability || cardDef.ability,
        // Use stats as-is from the engine (bonuses are already applied by StatModifierManager)
        currentAttack: beast.currentAttack || 0,
        currentHealth: beast.currentHealth || 0,
        maxHealth: beast.maxHealth || 0,
      };
    });
  }

}
