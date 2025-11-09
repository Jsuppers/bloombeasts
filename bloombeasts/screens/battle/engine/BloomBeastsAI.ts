/**
 * BloomBeasts AI implementation using the TURBO library
 */

import { Turbo } from '../../../lib/Turbo-Standalone';

import {
  BloomBeastsState,
  BloomBeastsActionData,
  BloomBeastsActionType,
  BloomBeastsPlayer,
} from './types';
import { cardMatchesId } from './utils/cardIdentifiers';
import { RuntimeBeast, RuntimeBuff, RuntimeHabitat, RuntimeTrap } from '../../../common/engine/types/runtime';
import {
  BloomBeastCard,
  BuffCard,
  HabitatCard,
  TrapCard,
} from '../../../common/engine/types/core';

/**
 * Player field structure
 */
type PlayerField = {
  beasts: (RuntimeBeast | null)[];
  buffs: (RuntimeBuff | null)[];
  habitat: RuntimeHabitat | null;
  traps: RuntimeTrap[];
};

/**
 * BloomBeasts Greedy AI implementation
 */
export class BloomBeastsGreedyAI extends Turbo.GreedyAI<BloomBeastsState, BloomBeastsActionData> {
  private currentState: Turbo.IGameState<BloomBeastsState> | null;

  constructor(config: Turbo.IAIConfig) {
    super({
      ...config,
      // Set longer thinking times for better UX
      thinkingTime: config.thinkingTime || { min: 800, max: 2500 }
    });
    this.currentState = null;
  }

  /**
   * Evaluate the current state (higher is better for this player)
   */
  evaluateState(state: Turbo.IGameState<BloomBeastsState>): number {
    let score = 0;
    const playerIndex = state.gameData.players.findIndex(p => p.id === this.playerId);
    const player = state.gameData.players[playerIndex];
    const opponent = state.gameData.players[1 - playerIndex];
    const playerField = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
    const opponentField = playerIndex === 0 ? state.gameData.field.player2 : state.gameData.field.player1;

    // Health difference (most important)
    score += (player.health - opponent.health) * 10;

    // Energy advantage
    score += (player.energy - opponent.energy) * 2;

    // Card advantage
    score += (player.hand.length - opponent.hand.length) * 3;

    // Board presence
    const playerBeasts = playerField.beasts.filter(b => b !== null).length;
    const opponentBeasts = opponentField.beasts.filter(b => b !== null).length;
    score += (playerBeasts - opponentBeasts) * 5;

    // Total stats on board
    let playerStats = 0;
    let opponentStats = 0;

    playerField.beasts.forEach(beast => {
      if (beast) {
        playerStats += beast.currentAttack + beast.currentHealth;
        // Bonus for special abilities
        if (beast.abilities && beast.abilities.length > 0) {
          playerStats += beast.abilities.length * 2;
        }
      }
    });

    opponentField.beasts.forEach(beast => {
      if (beast) {
        opponentStats += beast.currentAttack + beast.currentHealth;
        if (beast.abilities && beast.abilities.length > 0) {
          opponentStats += beast.abilities.length * 2;
        }
      }
    });

    score += (playerStats - opponentStats) * 2;

    // Buffs and habitat bonus
    score += playerField.buffs.filter(b => b !== null).length * 3;
    score += playerField.habitat ? 4 : 0;

    // Traps bonus
    score += playerField.traps.length * 2;

    return score;
  }

  /**
   * Evaluate an action's immediate value
   * CRITICAL: Always derive from passed state parameter, never use this.currentState
   */
  evaluateAction(
    action: Turbo.IGameAction<BloomBeastsActionData>,
    state: Turbo.IGameState<BloomBeastsState>
  ): number {
    const playerIndex = state.gameData.players.findIndex(p => p.id === this.playerId);
    const player = state.gameData.players[playerIndex];
    const opponent = state.gameData.players[1 - playerIndex];
    const playerField = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
    const opponentField = playerIndex === 0 ? state.gameData.field.player2 : state.gameData.field.player1;

    // Calculate beast counts from passed state (not cached this.currentState)
    const playerBeasts = playerField.beasts.filter(b => b !== null).length;
    const opponentBeasts = opponentField.beasts.filter(b => b !== null).length;

    switch (action.data.type) {
      case BloomBeastsActionType.DRAW_CARD:
        // Drawing cards is generally good
        return 5 + Math.random() * 2;

      case BloomBeastsActionType.PLAY_CARD:
        const card = player.hand.find(c => c.id === action.data.cardId);
        if (!card) return 0;

        let value = 0;

        switch (card.type) {
          case 'Beast':
            const beast = card as BloomBeastCard;
            // Value based on stats and abilities
            value = beast.baseAttack * 2 + beast.baseHealth * 1.5;

            // Bonus for abilities
            if (beast.abilities) {
              value += beast.abilities.length * 5;
            }

            // Efficiency bonus (stats per energy)
            if (beast.cost > 0) {
              value += (beast.baseAttack + beast.baseHealth) / beast.cost * 3;
            }

            // Board control bonus
            if (playerBeasts < opponentBeasts) {
              value += 10; // Extra value when behind on board
            }
            break;

          case 'Magic':
            // Magic cards vary widely, use base value
            value = 8 + Math.random() * 4;
            break;

          case 'Trap':
            // Traps are defensive
            value = 6;
            if (opponentBeasts > playerBeasts) {
              value += 4; // More valuable when opponent has board advantage
            }
            break;

          case 'Buff':
            // Buffs need creatures to be valuable
            value = playerBeasts * 4;
            break;

          case 'Habitat':
            // Habitat provides long-term value
            value = 7 + playerBeasts * 2;
            break;
        }

        // Adjust for energy efficiency
        if (card.cost > 0) {
          const energyEfficiency = value / card.cost;
          value = energyEfficiency * 5;
        }

        return value;

      case BloomBeastsActionType.ATTACK:
        const attackerId = action.data.cardId!;
        const targetId = action.data.targetId;

        const attacker = this.findBeast(attackerId, playerField);
        if (!attacker) return 0;

        let attackValue = 0;

        if (!targetId || targetId === opponent.id) {
          // Direct attack on opponent
          attackValue = attacker.currentAttack * 3;

          // Lethal bonus
          if (attacker.currentAttack >= opponent.health) {
            attackValue += 1000; // Win the game!
          }
        } else {
          // Attack on creature
          const target = this.findBeast(targetId, opponentField);
          if (!target) return 0;

          // Value of removing opponent creature
          attackValue = target.currentAttack * 2 + target.currentHealth * 1.5;

          // Favorable trade bonus
          if (attacker.currentAttack >= target.currentHealth && target.currentAttack < attacker.currentHealth) {
            attackValue += 15; // We survive, they don't
          }

          // Penalty for unfavorable trade
          if (target.currentAttack >= attacker.currentHealth && attacker.currentAttack < target.currentHealth) {
            attackValue -= 10; // We die, they don't
          }

          // Equal trade evaluation
          if (attacker.currentAttack >= target.currentHealth && target.currentAttack >= attacker.currentHealth) {
            // Compare creature values
            const attackerValue = attacker.currentAttack * 2 + attacker.currentHealth * 1.5;
            const targetValue = target.currentAttack * 2 + target.currentHealth * 1.5;
            attackValue = targetValue - attackerValue + 5; // Slight bonus for proactive play
          }
        }

        return attackValue;

      case BloomBeastsActionType.END_TURN:
        // Only end turn when nothing better to do
        return -10;

      default:
        return 0;
    }
  }

  /**
   * Override chooseAction to implement turn logic
   */
  async chooseAction(
    state: Turbo.IGameState<BloomBeastsState>,
    availableActions: Turbo.IGameAction<BloomBeastsActionData>[]
  ): Promise<Turbo.IGameAction<BloomBeastsActionData> | null> {
    // Store state for getter methods
    this.currentState = state;

    // Add thinking delay for better UX (configured in constructor)
    await this.simulateThinking();

    if (availableActions.length === 0) {
      return null;
    }

    // Group actions by type
    const actionsByType = new Map<BloomBeastsActionType, Turbo.IGameAction<BloomBeastsActionData>[]>();
    availableActions.forEach(action => {
      const type = action.data.type;
      if (!actionsByType.has(type)) {
        actionsByType.set(type, []);
      }
      actionsByType.get(type)!.push(action);
    });

    // Priority order for action types
    const priorityOrder = [
      BloomBeastsActionType.DRAW_CARD,    // Always draw first if available
      BloomBeastsActionType.ATTACK,       // Then attack
      BloomBeastsActionType.PLAY_CARD,    // Then play cards
      BloomBeastsActionType.END_TURN,     // End turn last
    ];

    // Find best action considering priorities
    for (const actionType of priorityOrder) {
      const actionsOfType = actionsByType.get(actionType);
      if (!actionsOfType || actionsOfType.length === 0) continue;

      // Special handling for END_TURN
      if (actionType === BloomBeastsActionType.END_TURN) {
        // Only end turn if no other valuable actions
        const otherActions = availableActions.filter(a => a.data.type !== BloomBeastsActionType.END_TURN);
        const hasValuableActions = otherActions.some(a => this.evaluateAction(a, state) > 5);

        if (hasValuableActions) {
          continue; // Skip END_TURN and look for better actions
        }

        return actionsOfType[0]; // End turn
      }

      // Evaluate all actions of this type
      const evaluatedActions = actionsOfType.map(action => ({
        action,
        value: this.evaluateAction(action, state),
      }));

      // Filter out low-value actions (except draw which is always good)
      const valuableActions = evaluatedActions.filter(ea =>
        ea.value > 0 || actionType === BloomBeastsActionType.DRAW_CARD
      );

      if (valuableActions.length > 0) {
        // Add randomness based on difficulty
        valuableActions.forEach(ea => {
          ea.value = this.addNoise(ea.value, this.difficulty === 'easy' ? 30 : 10);
        });

        // Sort by value and return best
        valuableActions.sort((a, b) => b.value - a.value);
        return valuableActions[0].action;
      }
    }

    // Fallback: end turn
    const endTurnAction = availableActions.find(a => a.data.type === BloomBeastsActionType.END_TURN);
    return endTurnAction || null;
  }

  /**
   * Helper methods
   */

  private findBeast(id: string, field: PlayerField): RuntimeBeast | null {
    for (const beast of field.beasts) {
      if (beast && cardMatchesId(beast, id)) {
        return beast;
      }
    }
    return null;
  }

  // Removed playerBeasts and opponentBeasts getters - they cached this.currentState
  // which caused stale data bugs. Beast counts now calculated from passed state parameter
  // in evaluateAction() method.
}

/**
 * Simple Random AI for testing
 */
export class BloomBeastsRandomAI extends BloomBeastsGreedyAI {
  evaluateAction(
    action: Turbo.IGameAction<BloomBeastsActionData>,
    state: Turbo.IGameState<BloomBeastsState>
  ): number {
    // Random evaluation with slight preference for non-END_TURN actions
    if (action.data.type === BloomBeastsActionType.END_TURN) {
      return Math.random() * 10;
    }
    return Math.random() * 100;
  }
}