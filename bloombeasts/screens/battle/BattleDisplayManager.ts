/**
 * BattleDisplayManager - Handles battle UI rendering and display enrichment
 * Manages battle state visualization, animations, and card popups
 */

import { BloomBeastCard, CardType } from '../../engine/types/core';
import { STARTING_HEALTH, TURN_TIME_LIMIT } from '../../engine/constants/gameRules';
import type { BattleDisplay, ObjectiveDisplay } from '../../gameManager';
import type { RuntimeCard } from '../../engine/types/runtime';

export class BattleDisplayManager {
  private catalogManager: any;

  constructor(catalogManager: any) {
    this.catalogManager = catalogManager;
  }
  /**
   * Create a battle display object from battle state
   */
  createBattleDisplay(
    battleUIState: any,
    attackAnimation?: {
      attackerPlayer: 'player' | 'opponent';
      attackerIndex: number;
      targetPlayer: 'player' | 'opponent' | 'health';
      targetIndex?: number;
    } | null
  ): BattleDisplay | null {
    // Handle new TURBO-based battle state structure
    if (!battleUIState || !battleUIState.battleState || !battleUIState.battleState.turboState) {
      return null;
    }

    const turboState = battleUIState.battleState.turboState;
    const gameData = turboState.gameData;

    // Extract players and field from TURBO state
    const player = gameData.players[0];
    const opponent = gameData.players[1];
    const playerField = gameData.field.player1;
    const opponentField = gameData.field.player2;

    if (!player || !opponent) return null;

    // Determine current turn player
    const turnPlayer = turboState.turnInfo.currentPlayerId === 'player' ? 'player' : 'opponent';

    // Convert to display format
    const display: BattleDisplay = {
      playerHealth: player.health,
      playerMaxHealth: player.maxHealth || STARTING_HEALTH,
      playerDeckCount: player.deck.length,
      playerEnergy: player.energy,
      playerHand: this.enrichHandCards(player.hand),
      playerTrapZone: playerField.traps || [],
      playerBuffZone: playerField.buffs || [],
      opponentHealth: opponent.health,
      opponentMaxHealth: opponent.maxHealth || STARTING_HEALTH,
      opponentDeckCount: opponent.deck.length,
      opponentEnergy: opponent.energy,
      opponentField: this.enrichFieldBeasts(opponentField.beasts, turboState, 1),
      opponentTrapZone: opponentField.traps || [],
      opponentBuffZone: opponentField.buffs || [],
      playerField: this.enrichFieldBeasts(playerField.beasts, turboState, 0),
      currentTurn: turboState.turnInfo.turnNumber,
      turnPlayer: turnPlayer,
      turnTimeRemaining: TURN_TIME_LIMIT,
      objectives: this.getObjectiveDisplay(battleUIState),
      habitatZone: playerField.habitat || opponentField.habitat, // Use whichever has a habitat
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
        description: obj.description || 'Unknown objective',
        progress: Math.min(progress, target),
        target: target,
        isComplete: progress >= target,
      };
    });
  }

  /**
   * Return field beasts as RuntimeCard
   * NOTE: Do NOT apply bonuses here - the engine's StatModifierManager already handles this!
   */
  private enrichFieldBeasts(field: RuntimeCard[], turboState?: any, playerIndex?: number): RuntimeCard[] {
    return field.filter(beast => beast !== null);
  }

  /**
   * Return hand cards as RuntimeCard
   */
  private enrichHandCards(hand: RuntimeCard[]): RuntimeCard[] {
    return hand.filter(card => card !== null);
  }

}
