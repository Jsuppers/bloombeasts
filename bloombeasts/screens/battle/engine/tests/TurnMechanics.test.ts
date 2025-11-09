/**
 * Tests for turn mechanics and AI execution in BloomBeasts
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import { BloomBeastsRules, BloomBeastsState, BloomBeastsActionType, BloomBeastsActionData } from '../BloomBeastsGame';
import { BloomBeastsGreedyAI } from '../BloomBeastsAI';

describe('BloomBeasts Turn Mechanics', () => {
  let rules: BloomBeastsRules;
  let game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>;

  beforeEach(() => {
    rules = new BloomBeastsRules();
    game = new Turbo.GameController(rules);
  });

  // Helper to create test cards
  const createTestCard = (id: string) => ({
    id,
    name: `Test Card ${id}`,
    type: 'Bloom',
    cost: 1,
    baseAttack: 1,
    baseHealth: 1,
    abilities: []
  });

  // Helper to create test deck
  const createTestDeck = () => [
    createTestCard('card1'),
    createTestCard('card2'),
    createTestCard('card3'),
    createTestCard('card4'),
    createTestCard('card5')
  ];

  describe('Energy System', () => {
    test('should give player 1 energy on first turn', () => {
      const config: Turbo.IGameConfig = {
        players: [
          { id: 'player1', name: 'Alice', type: Turbo.PlayerType.HUMAN, metadata: { deck: createTestDeck() } },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: createTestDeck() } }
        ]
      };

      game.initialize(config);
      const state = game.getState();

      // Player 1 should start with 1 energy
      expect(state.gameData.players[0].energy).toBe(1);
    });

    test('should give correct energy progression', () => {
      const config: Turbo.IGameConfig = {
        players: [
          { id: 'player1', name: 'Alice', type: Turbo.PlayerType.HUMAN, metadata: { deck: createTestDeck() } },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: createTestDeck() } }
        ]
      };

      game.initialize(config);
      let state = game.getState();

      // Player 1 turn 1: 1 energy
      expect(state.gameData.players[0].energy).toBe(1);
      expect(state.turnInfo.currentPlayerId).toBe('player1');

      // End player 1's turn
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.END_TURN }
      });

      state = game.getState();

      // Player 2 turn 1: should have 1 energy
      expect(state.turnInfo.currentPlayerId).toBe('player2');
      expect(state.gameData.players[1].energy).toBe(1);

      // End player 2's turn
      game.executeAction({
        type: 'game_action',
        playerId: 'player2',
        data: { type: BloomBeastsActionType.END_TURN }
      });

      state = game.getState();

      // Player 1 turn 2: should have 2 energy
      expect(state.turnInfo.currentPlayerId).toBe('player1');
      expect(state.gameData.players[0].energy).toBe(2);
    });
  });

  describe('Turn Switching', () => {
    test('should switch players correctly', () => {
      const config: Turbo.IGameConfig = {
        players: [
          { id: 'player1', name: 'Alice', type: Turbo.PlayerType.HUMAN, metadata: { deck: createTestDeck() } },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: createTestDeck() } }
        ]
      };

      game.initialize(config);
      let state = game.getState();

      expect(state.turnInfo.currentPlayerId).toBe('player1');

      // End turn
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.END_TURN }
      });

      state = game.getState();
      expect(state.turnInfo.currentPlayerId).toBe('player2');
    });
  });

  describe('AI Turn Execution', () => {
    test('should execute AI turn when player ends turn', async () => {
      const config: Turbo.IGameConfig = {
        players: [
          { id: 'player1', name: 'Alice', type: Turbo.PlayerType.HUMAN, metadata: { deck: createTestDeck() } },
          { id: 'opponent', name: 'Bob AI', data: { deck: createTestDeck() } }
        ]
      };

      game.initialize(config);

      // Register AI for player 2
      const ai = new BloomBeastsGreedyAI({ playerId: 'opponent', difficulty: Turbo.AILevel.MEDIUM });
      game.registerAI('opponent', ai);

      let state = game.getState();
      expect(state.turnInfo.currentPlayerId).toBe('player1');

      // End player 1's turn
      const result = game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.END_TURN }
      });

      expect(result.success).toBe(true);

      state = game.getState();
      expect(state.turnInfo.currentPlayerId).toBe('opponent');
      expect(state.gameData.players[1].energy).toBe(1);

      // Execute AI turn manually (in real game, this would be called by BattleController)
      await game.executeAITurn();

      // AI should have ended its turn (since it has no cards to play)
      state = game.getState();
      expect(state.turnInfo.currentPlayerId).toBe('player1'); // Back to player 1
    });

    test('should have available actions for AI', () => {
      const config: Turbo.IGameConfig = {
        players: [
          { id: 'player1', name: 'Alice', type: Turbo.PlayerType.HUMAN, metadata: { deck: createTestDeck() } },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: createTestDeck() } }
        ]
      };

      game.initialize(config);

      // End player 1's turn
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.END_TURN }
      });

      const state = game.getState();

      // Get available actions for player 2
      const actions = game.getAvailableActions();

      // Should at least have END_TURN action available
      expect(actions.length).toBeGreaterThan(0);

      const endTurnAction = actions.find(a => a.data.type === BloomBeastsActionType.END_TURN);
      expect(endTurnAction).toBeDefined();
      expect(endTurnAction?.playerId).toBe('player2');
    });
  });
});