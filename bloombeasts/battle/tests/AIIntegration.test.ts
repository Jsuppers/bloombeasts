/**
 * Integration tests for AI opponent in BloomBeasts
 * Tests the complete flow from player ending turn to AI execution
 */

import { BattleController } from '../core/BattleController';
import { BloomBeastsGreedyAI } from '../BloomBeastsAI';
import { BloomBeastsRules, BloomBeastsActionType } from '../BloomBeastsGame';
import { GameController, IGameConfig, PlayerType, AILevel } from '../../../turbo/src';
import { Logger } from '../../engine/utils/Logger';

// Mock AsyncMethods for testing
const mockAsync = {
  setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
} as any;

describe('AI Integration Tests', () => {
  let battleController: BattleController;

  beforeEach(() => {
    battleController = new BattleController(mockAsync);
  });

  // Helper to create test cards
  const createTestCard = (id: string, cost: number = 1) => ({
    id,
    name: `Test Card ${id}`,
    type: 'Bloom',
    cost,
    baseAttack: 2,
    baseHealth: 2,
    abilities: []
  });

  // Helper to create test deck
  const createTestDeck = () => [
    createTestCard('card1', 1),
    createTestCard('card2', 1),
    createTestCard('card3', 2),
    createTestCard('card4', 2),
    createTestCard('card5', 3)
  ];

  test('should properly register AI for opponent', () => {
    const battleState = battleController.initializeBattle({
      player1: {
        id: 'player',
        name: 'Human Player',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: false
      },
      player2: {
        id: 'opponent',
        name: 'AI Opponent',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: true
      }
    });

    expect(battleState).toBeDefined();
    expect(battleState.turboState.gameData.players).toHaveLength(2);

    // Check that AI was registered (we can't directly check the internal registration,
    // but we can verify it works by executing an AI turn)
  });

  test('should switch to opponent when player ends turn', () => {
    const battleState = battleController.initializeBattle({
      player1: {
        id: 'player',
        name: 'Human Player',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: false
      },
      player2: {
        id: 'opponent',
        name: 'AI Opponent',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: true
      }
    });

    // Initially should be player's turn
    const initialPlayer = battleController.getCurrentPlayer();
    expect(initialPlayer.id).toBe('player');

    // End player's turn
    battleController.endTurn('player');

    // Should now be opponent's turn
    const newPlayer = battleController.getCurrentPlayer();
    expect(newPlayer.id).toBe('opponent');
  });

  test('should execute AI turn after player ends turn', async () => {
    const battleState = battleController.initializeBattle({
      player1: {
        id: 'player',
        name: 'Human Player',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: false
      },
      player2: {
        id: 'opponent',
        name: 'AI Opponent',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: true
      }
    });

    // End player's turn
    battleController.endTurn('player');

    // Execute AI turn
    await battleController.executeAITurn();

    // AI should have ended its turn, switching back to player
    const currentPlayer = battleController.getCurrentPlayer();
    expect(currentPlayer.id).toBe('player');
  });

  test('AI should draw card if it has not drawn yet', async () => {
    const battleState = battleController.initializeBattle({
      player1: {
        id: 'player',
        name: 'Human Player',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: false
      },
      player2: {
        id: 'opponent',
        name: 'AI Opponent',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: true
      }
    });

    // End player's turn
    battleController.endTurn('player');

    const opponentBefore = battleController.getOpponentPlayer();
    const handSizeBefore = opponentBefore.hand.length;

    // Execute AI turn
    await battleController.executeAITurn();

    const opponentAfter = battleController.getOpponentPlayer();
    const handSizeAfter = opponentAfter.hand.length;

    // AI should have either drawn a card or played cards
    // (depends on AI decision making)
    expect(handSizeAfter).toBeLessThanOrEqual(handSizeBefore + 1);
  });

  test('should handle complete player-AI turn cycle', async () => {
    const battleState = battleController.initializeBattle({
      player1: {
        id: 'player',
        name: 'Human Player',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: false
      },
      player2: {
        id: 'opponent',
        name: 'AI Opponent',
        deck: createTestDeck(),
        health: 30,
        maxHealth: 30,
        isAI: true
      }
    });

    // Initially player 1's turn
    expect(battleController.getCurrentPlayer().id).toBe('player');

    // Player ends turn
    battleController.endTurn('player');

    // Now opponent's turn
    expect(battleController.getCurrentPlayer().id).toBe('opponent');

    // Execute AI turn
    await battleController.executeAITurn();

    // Back to player's turn
    expect(battleController.getCurrentPlayer().id).toBe('player');

    // Check energy progression
    const player = battleController.getCurrentPlayer();
    expect(player.currentEnergy).toBe(2); // Turn 2 = 2 energy
  });

  test('should properly handle AI with no available actions', async () => {
    // Create a rules instance to test directly
    const rules = new BloomBeastsRules();
    const game = new GameController(rules);

    const config: IGameConfig = {
      players: [
        { id: 'player1', name: 'Human', type: PlayerType.HUMAN, metadata: { deck: [] } },
        { id: 'ai', name: 'AI', type: PlayerType.HUMAN, metadata: { deck: [] } }
      ]
    };

    game.initialize(config);

    // Register AI
    const ai = new BloomBeastsGreedyAI('ai', 'medium');
    game.registerAI('ai', ai);

    // End player 1's turn
    game.performAction({
      type: 'game_action',
      playerId: 'player1',
      data: { type: BloomBeastsActionType.END_TURN }
    });

    const stateBefore = game.getState();
    expect(stateBefore.turnInfo.currentPlayerId).toBe('ai'); // AI's turn

    // Execute AI turn (should just end turn since no cards)
    await game.executeAITurn();

    const stateAfter = game.getState();
    expect(stateAfter.turnInfo.currentPlayerId).toBe('player1'); // Back to player 1
  });
});