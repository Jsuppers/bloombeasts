/**
 * Test Harness for Battle System
 *
 * Provides utilities to set up testable battle scenarios without full game initialization
 */

import { BattleController } from '../engine/core/BattleController';
import { CardType, Affinity, type AnyCard } from '../../../common/engine/types/core';
import type { RuntimeCard, RuntimeBeast, BattleConfig } from '../engine/types';

// Mock async methods for testing
export const mockAsync = {
  setTimeout: (callback: () => void, delay: number) => {
    setTimeout(callback, delay);
    return 1;
  },
  clearTimeout: (id: number) => clearTimeout(id),
  setInterval: (callback: () => void, delay: number) => setInterval(callback, delay),
  clearInterval: (id: number) => clearInterval(id),
};

/**
 * Create a test beast with specified stats
 */
export function createTestBeast(
  id: string,
  name: string,
  attack: number,
  health: number,
  summoningSickness = false
): RuntimeBeast {
  return {
    id,
    cardId: id,
    instanceId: `${id}-instance`,
    name,
    type: CardType.Beast,
    affinity: Affinity.Forest,
    cost: 1,
    baseAttack: attack,
    baseHealth: health,
    currentAttack: attack,
    currentHealth: health,
    maxHealth: health,
    currentXP: 0,
    level: 1,
    currentLevel: 1,
    statusEffects: [],
    abilities: [],
    summoningSickness,
  };
}

/**
 * Battle test scenario configuration
 */
export interface BattleScenario {
  playerBeasts: RuntimeBeast[];
  opponentBeasts: RuntimeBeast[];
  playerHealth?: number;
  opponentHealth?: number;
}

/**
 * Initialize a battle with a specific scenario
 */
export function setupBattleScenario(
  controller: BattleController,
  scenario: BattleScenario
) {
  // Create minimal deck (just need one card to initialize)
  const config: BattleConfig = {
    player1: {
      id: 'player',
      name: 'Test Player',
      deck: scenario.playerBeasts.length > 0 ? [scenario.playerBeasts[0] as any] : [],
      health: scenario.playerHealth ?? 30,
      maxHealth: 30,
    },
    player2: {
      id: 'opponent',
      name: 'Test Opponent',
      deck: scenario.opponentBeasts.length > 0 ? [scenario.opponentBeasts[0] as any] : [],
      health: scenario.opponentHealth ?? 30,
      maxHealth: 30,
      isAI: false, // Disable AI for controlled testing
    },
  };

  // Initialize battle
  const battleState = controller.initializeBattle(config);
  const turboState = battleState.turboState;

  // Place beasts on field
  const playerField = turboState.gameData.field.player1;
  const opponentField = turboState.gameData.field.player2;

  for (let i = 0; i < 3; i++) {
    playerField.beasts[i] = i < scenario.playerBeasts.length
      ? scenario.playerBeasts[i]
      : null;

    opponentField.beasts[i] = i < scenario.opponentBeasts.length
      ? scenario.opponentBeasts[i]
      : null;
  }

  return {
    controller,
    battleState,
    turboState,
    getPlayerField: () => turboState.gameData.field.player1,
    getOpponentField: () => turboState.gameData.field.player2,
    getPlayerHealth: () => turboState.gameData.players[0].health,
    getOpponentHealth: () => turboState.gameData.players[1].health,
  };
}

/**
 * Helper to execute attacks through BattleController
 */
export async function executeAutoAttackAll(
  controller: BattleController,
  playerId: string = 'player'
): Promise<void> {
  const game = controller.getGameController();
  const turboState = game.getState();

  // Get field references
  const playerField = playerId === 'player'
    ? turboState.gameData.field.player1
    : turboState.gameData.field.player2;
  const opponentField = playerId === 'player'
    ? turboState.gameData.field.player2
    : turboState.gameData.field.player1;
  const opponent = playerId === 'player'
    ? turboState.gameData.players[1]
    : turboState.gameData.players[0];

  // Execute attacks for each slot (this is the logic we're testing)
  for (let i = 0; i < 3; i++) {
    // CRITICAL: Refresh field state before each attack (bug fix!)
    const currentState = game.getState();
    const currentPlayerField = playerId === 'player'
      ? currentState.gameData.field.player1
      : currentState.gameData.field.player2;
    const currentOpponentField = playerId === 'player'
      ? currentState.gameData.field.player2
      : currentState.gameData.field.player1;

    const attackerBeast = currentPlayerField.beasts[i];
    if (!attackerBeast || attackerBeast.summoningSickness) continue;

    const opposingBeast = currentOpponentField.beasts[i];

    if (opposingBeast) {
      // Attack opposing beast
      controller.attackBeast(attackerBeast.instanceId || attackerBeast.id, opposingBeast.instanceId || opposingBeast.id, playerId);
    } else {
      // Attack player health directly
      controller.attackPlayer(attackerBeast.instanceId || attackerBeast.id, playerId);
    }
  }
}
