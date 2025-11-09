/**
 * Functional tests for BloomBeasts gameplay
 * Tests actual game scenarios, battles, and win conditions
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import { BloomBeastsRules, BloomBeastsState, BloomBeastsActionType, BloomBeastsActionData } from '../BloomBeastsGame';
import {
  BloomBeastCard,
  MagicCard,
  TrapCard,
  BuffCard,
  HabitatCard,
  TrapTrigger,
  CardType,
  Affinity
} from '../../../../common/engine/types/core';

// Helper function to create a runtime bloom beast card
function createBloomBeast(
  id: string,
  name: string,
  cost: number,
  attack: number,
  health: number
): any {
  return {
    id,
    cardId: id,
    instanceId: `${id}-instance`,
    name,
    type: CardType.Beast,
    affinity: Affinity.Forest,
    cost,
    baseAttack: attack,
    baseHealth: health,
    currentAttack: attack,
    currentHealth: health,
    maxHealth: health,
    currentXP: 0,
    level: 1,
    currentLevel: 1 as any,
    statusEffects: [],
    abilities: []
  };
}

// Helper function to create a runtime magic card
function createMagicCard(id: string, name: string, cost: number): any {
  return {
    id,
    cardId: id,
    instanceId: `${id}-instance`,
    name,
    type: CardType.Magic,
    cost,
    currentXP: 0,
    level: 1,
    abilities: [],
    targetRequired: false
  };
}

// Helper function to create a runtime trap card
function createTrapCard(id: string, name: string, cost: number, trigger: TrapTrigger): any {
  return {
    id,
    cardId: id,
    instanceId: `${id}-instance`,
    name,
    type: CardType.Trap,
    cost,
    currentXP: 0,
    level: 1,
    activation: { trigger },
    abilities: []
  };
}

describe('BloomBeasts Gameplay', () => {
  let game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>;
  let rules: BloomBeastsRules;

  beforeEach(() => {
    rules = new BloomBeastsRules();
    game = new Turbo.GameController(rules);
  });

  // Helper function to advance to a specific turn number for player1
  function advanceToTurn(turnNumber: number): void {
    const currentState = game.getState();
    const currentTurn = currentState.turnInfo.turnNumber;

    if (turnNumber <= currentTurn) {
      return; // Already at or past desired turn
    }

    // Each full turn cycle requires 2 END_TURN actions (one per player)
    const turnsToAdvance = turnNumber - currentTurn;
    const actionsNeeded = turnsToAdvance * 2;

    for (let i = 0; i < actionsNeeded; i++) {
      const state = game.getState();
      game.executeAction({
        type: 'game_action',
        playerId: state.turnInfo.currentPlayerId,
        data: { type: BloomBeastsActionType.END_TURN }
      });
    }
  }

  // Helper to end current player's turn
  function endTurn(): void {
    const state = game.getState();
    game.executeAction({
      type: 'game_action',
      playerId: state.turnInfo.currentPlayerId,
      data: { type: BloomBeastsActionType.END_TURN }
    });
  }

  describe('Game Initialization', () => {
    test('should initialize a new game with two players', () => {
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('beast1', 'Rootling', 1, 1, 2),
                createBloomBeast('beast2', 'Mosslet', 2, 2, 3),
                createBloomBeast('beast3', 'Leaf Sprite', 3, 3, 2),
                createMagicCard('magic1', 'Lightning Strike', 2),
                createTrapCard('trap1', 'Spike Trap', 1, TrapTrigger.OnAttack)
              ]
            }
          },
          {
            id: 'player2',
            name: 'Bob',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('beast4', 'Cinder Pup', 1, 2, 1),
                createBloomBeast('beast5', 'Blazefinch', 2, 3, 2),
                createBloomBeast('beast6', 'Magmite', 3, 4, 3),
                createMagicCard('magic2', 'Fireball', 3),
                createTrapCard('trap2', 'Fire Wall', 2, TrapTrigger.OnBeastPlay)
              ]
            }
          }
        ]
      };

      game.initialize(config);
      const state = game.getState();

      expect(state.gameData.players).toHaveLength(2);
      expect(state.gameData.players[0].health).toBe(30);
      expect(state.gameData.players[1].health).toBe(30);
      expect(state.gameData.players[0].hand).toHaveLength(3); // Starting hand
      expect(state.gameData.players[1].hand).toHaveLength(3); // Starting hand
      expect(state.gameData.players[0].energy).toBe(1); // Player 1 starts with 1 energy
      expect(state.gameData.players[1].energy).toBe(0); // Player 2 starts with 0 energy
    });

    test('should set up empty field for both players', () => {
      const config: Turbo.IGameConfig = {
        players: [
          { id: 'player1', name: 'Alice', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } }
        ]
      };

      game.initialize(config);
      const state = game.getState();

      expect(state.gameData.field.player1.beasts).toEqual([null, null, null]);
      expect(state.gameData.field.player2.beasts).toEqual([null, null, null]);
      expect(state.gameData.field.player1.traps).toEqual([]);
      expect(state.gameData.field.player2.traps).toEqual([]);
    });
  });

  describe('Card Playing', () => {
    beforeEach(() => {
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('beast1', 'Rootling', 1, 1, 2),
                createBloomBeast('beast2', 'Mosslet', 1, 2, 3),
                createBloomBeast('beast3', 'Leaf Sprite', 1, 3, 2)
              ]
            }
          },
          {
            id: 'player2',
            name: 'Bob',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('beast4', 'Cinder Pup', 1, 2, 1),
                createBloomBeast('beast5', 'Blazefinch', 1, 3, 2)
              ]
            }
          }
        ]
      };

      game.initialize(config);
      // Player 1 starts with 1 energy naturally
    });

    test('should play bloom beast to field', () => {
      let state = game.getState();
      const cardToPlay = state.gameData.players[0].hand[0];

      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: cardToPlay.id,
          position: 0
        }
      };

      const result = game.executeAction(action);
      expect(result.success).toBe(true);

      state = game.getState();
      expect(state.gameData.field.player1.beasts[0]).not.toBeNull();
      expect(state.gameData.field.player1.beasts[0]?.id).toBe(cardToPlay.id);
      expect(state.gameData.field.player1.beasts[0]?.summoningSickness).toBe(true);
    });

    test('should not play card without enough energy', () => {
      // Setup a game where player has a high-cost card
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('expensive', 'Expensive Beast', 5, 10, 10), // Costs 5, but player has 1 energy
              ]
            }
          },
          {
            id: 'player2',
            name: 'Bob',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [createBloomBeast('beast4', 'Cinder Pup', 1, 2, 1)]
            }
          }
        ]
      };

      game.initialize(config);

      const state = game.getState();
      const cardToPlay = state.gameData.players[0].hand[0];

      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: cardToPlay.id,
          position: 0
        }
      };

      const result = game.executeAction(action);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Not enough energy');
    });

    test('should not play bloom to occupied position', () => {
      // Advance to turn 2 to have 2 energy for playing 2 cards
      advanceToTurn(2);

      let state = game.getState();
      const card1 = state.gameData.players[0].hand[0];
      const card2 = state.gameData.players[0].hand[1];

      // Play first card to position 0
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: card1.id,
          position: 0
        }
      });

      // Try to play second card to same position
      const result = game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: card2.id,
          position: 0
        }
      });

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Position occupied');
    });
  });

  describe('Combat', () => {
    beforeEach(() => {
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('p1beast', 'Strong Beast', 1, 3, 4),
              ]
            }
          },
          {
            id: 'player2',
            name: 'Bob',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('p2beast', 'Weak Beast', 1, 2, 2),
              ]
            }
          }
        ]
      };

      game.initialize(config);

      // Player 1 plays their creature
      let state = game.getState();
      const p1Card = state.gameData.players[0].hand[0];
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: p1Card.id,
          position: 0
        }
      });

      // Player 1 ends turn
      endTurn();

      // Player 2 plays their creature
      state = game.getState();
      const p2Card = state.gameData.players[1].hand[0];
      game.executeAction({
        type: 'game_action',
        playerId: 'player2',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: p2Card.id,
          position: 0
        }
      });

      // Player 2 ends turn - now back to player 1 turn 2
      // Both creatures now have no summoning sickness
      endTurn();
    });

    test('should attack enemy bloom beast', () => {
      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.ATTACK,
          cardId: 'p1beast',
          targetId: 'p2beast'
        }
      };

      const result = game.executeAction(action);
      expect(result.success).toBe(true);

      const state = game.getState();

      // Player 2's beast should be destroyed (2 health - 3 damage = -1)
      expect(state.gameData.field.player2.beasts[0]).toBeNull();

      // Player 1's beast should take damage (4 health - 2 damage = 2)
      expect(state.gameData.field.player1.beasts[0]?.currentHealth).toBe(2);
    });

    test('should attack player directly when no blocker', () => {
      // Setup a fresh game where only player1 has a creature
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [createBloomBeast('p1beast', 'Strong Beast', 1, 3, 4)]
            }
          },
          {
            id: 'player2',
            name: 'Bob',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [] // No cards for player2
            }
          }
        ]
      };

      game.initialize(config);

      // Player 1 plays their creature
      let state = game.getState();
      const p1Card = state.gameData.players[0].hand[0];
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: p1Card.id,
          position: 0
        }
      });

      // End turn twice to remove summoning sickness
      endTurn(); // Player 2's turn
      endTurn(); // Back to player 1

      // Now attack player directly
      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.ATTACK,
          cardId: 'p1beast',
          targetId: 'player2'
        }
      };

      const result = game.executeAction(action);
      expect(result.success).toBe(true);

      const newState = game.getState();
      // Player 2 should take 3 damage
      expect(newState.gameData.players[1].health).toBe(27);
    });

    test('should not attack with summoning sick creature', () => {
      // Setup a fresh game to have a creature with summoning sickness
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [createBloomBeast('p1beast', 'Beast', 1, 3, 4)]
            }
          },
          {
            id: 'player2',
            name: 'Bob',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [createBloomBeast('p2beast', 'Beast', 1, 2, 2)]
            }
          }
        ]
      };

      game.initialize(config);

      // Player 1 plays their creature (it will have summoning sickness)
      let state = game.getState();
      const p1Card = state.gameData.players[0].hand[0];
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: p1Card.id,
          position: 0
        }
      });

      // Try to attack immediately (should fail due to summoning sickness)
      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.ATTACK,
          cardId: 'p1beast',
          targetId: 'player2'
        }
      };

      const result = game.executeAction(action);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('summoning sickness');
    });

    test('should track that creature has attacked this turn', () => {
      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.ATTACK,
          cardId: 'p1beast',
          targetId: 'p2beast'
        }
      };

      game.executeAction(action);

      // Try to attack again
      const secondAttack: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.ATTACK,
          cardId: 'p1beast',
          targetId: 'player2'
        }
      };

      const result = game.executeAction(secondAttack);
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('already attacked');
    });
  });

  describe('Turn Management', () => {
    beforeEach(() => {
      const config: Turbo.IGameConfig = {
        players: [
          { id: 'player1', name: 'Alice', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } }
        ]
      };
      game.initialize(config);
    });

    test('should draw card at start of turn', () => {
      // Initialize with cards in deck for drawing
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('card1', 'Beast 1', 1, 1, 1),
                createBloomBeast('card2', 'Beast 2', 1, 1, 1),
                createBloomBeast('card3', 'Beast 3', 1, 1, 1),
                createBloomBeast('card4', 'Beast 4', 1, 1, 1), // Extra card for drawing
              ]
            }
          },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } }
        ]
      };

      game.initialize(config);

      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.DRAW_CARD }
      };

      const result = game.executeAction(action);
      expect(result.success).toBe(true);

      const newState = game.getState();
      expect(newState.gameData.players[0].hand).toHaveLength(4); // 3 starting + 1 drawn
      expect(newState.gameData.currentTurnActions.hasDrawnCard).toBe(true);
    });

    test('should switch turns when ending turn', () => {
      let state = game.getState();
      expect(state.turnInfo.currentPlayerId).toBe('player1');

      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.END_TURN }
      };

      const result = game.executeAction(action);
      expect(result.success).toBe(true);

      state = game.getState();
      expect(state.turnInfo.currentPlayerId).toBe('player2');
      expect(state.turnInfo.turnNumber).toBe(1);

      // Turn actions should reset
      expect(state.gameData.currentTurnActions.hasDrawnCard).toBe(false);
      expect(state.gameData.currentTurnActions.hasAttacked.size).toBe(0);
    });

    test('should increase energy at start of turn', () => {
      // End player 1's turn
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.END_TURN }
      });

      // Player 2's turn starts - energy should be set by END_TURN action
      let state = game.getState();
      expect(state.gameData.players[1].energy).toBe(1); // Turn 1 = 1 energy
    });

    test('should remove summoning sickness at start of turn', () => {
      // Initialize with a card to play
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [createBloomBeast('beast1', 'Test Beast', 1, 1, 1)]
            }
          },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } }
        ]
      };

      game.initialize(config);

      // Play the creature (it will have summoning sickness)
      let state = game.getState();
      const card = state.gameData.players[0].hand[0];
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: card.id,
          position: 0
        }
      });

      state = game.getState();
      expect(state.gameData.field.player1.beasts[0]?.summoningSickness).toBe(true);

      // End turn
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.END_TURN }
      });

      // End player 2's turn to get back to player 1
      game.executeAction({
        type: 'game_action',
        playerId: 'player2',
        data: { type: BloomBeastsActionType.END_TURN }
      });

      const newState = game.getState();
      // Summoning sickness should be removed
      expect(newState.gameData.field.player1.beasts[0]?.summoningSickness).toBe(false);
    });
  });

  describe('Win Conditions', () => {
    beforeEach(() => {
      const config: Turbo.IGameConfig = {
        players: [
          { id: 'player1', name: 'Alice', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } }
        ]
      };

      game.initialize(config);
    });

    test('should end game when player health reaches 0', () => {
      // Setup a game where player1 has a powerful attacker
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [createBloomBeast('attacker', 'Powerful Beast', 1, 30, 10)] // 30 attack to kill player in one hit
            }
          },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } }
        ]
      };

      game.initialize(config);

      // Player 1 plays the attacker
      let state = game.getState();
      const card = state.gameData.players[0].hand[0];
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: card.id,
          position: 0
        }
      });

      // End turns to remove summoning sickness
      endTurn(); // Player 2's turn
      endTurn(); // Back to player 1

      // Attack player 2 directly to end the game
      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.ATTACK,
          cardId: 'attacker',
          targetId: 'player2'
        }
      };

      const result = game.executeAction(action);
      expect(result.success).toBe(true);

      const endState = game.getState();
      expect(endState.gameData.players[1].health).toBeLessThanOrEqual(0);
      expect(endState.isComplete).toBe(true);
      expect(endState.winnerId).toBe('player1');
    });

    test.skip('should handle draw when both players die simultaneously', () => {
      // TODO: This would happen with certain effect combinations
      // Requires implementing simultaneous damage effects
      // Skipping for now as it requires setState or complex effect mechanics
    });
  });

  describe('Complex Scenarios', () => {
    test('should handle full board combat', () => {
      // Setup game with enough cards to fill the board
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('p1beast0', 'P1 Beast 0', 1, 2, 3),
                createBloomBeast('p1beast1', 'P1 Beast 1', 1, 2, 3),
                createBloomBeast('p1beast2', 'P1 Beast 2', 1, 2, 3),
              ]
            }
          },
          {
            id: 'player2',
            name: 'Bob',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [
                createBloomBeast('p2beast0', 'P2 Beast 0', 1, 1, 2),
                createBloomBeast('p2beast1', 'P2 Beast 1', 1, 1, 2),
                createBloomBeast('p2beast2', 'P2 Beast 2', 1, 1, 2),
              ]
            }
          }
        ]
      };

      game.initialize(config);

      // Player 1 plays all 3 creatures (needs 3 energy, so advance to turn 3)
      advanceToTurn(3);

      let state = game.getState();
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: 'p1beast0',
          position: 0
        }
      });

      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: 'p1beast1',
          position: 1
        }
      });

      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: 'p1beast2',
          position: 2
        }
      });

      endTurn();

      // Player 2 plays all 3 creatures
      state = game.getState();
      game.executeAction({
        type: 'game_action',
        playerId: 'player2',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: 'p2beast0',
          position: 0
        }
      });

      game.executeAction({
        type: 'game_action',
        playerId: 'player2',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: 'p2beast1',
          position: 1
        }
      });

      game.executeAction({
        type: 'game_action',
        playerId: 'player2',
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId: 'p2beast2',
          position: 2
        }
      });

      endTurn();

      // Player 1 attacks with first creature
      const result = game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: {
          type: BloomBeastsActionType.ATTACK,
          cardId: 'p1beast0',
          targetId: 'p2beast0'
        }
      });

      expect(result.success).toBe(true);

      const newState = game.getState();

      // P2's first beast should be destroyed
      expect(newState.gameData.field.player2.beasts[0]).toBeNull();

      // P1's first beast should have taken damage
      expect(newState.gameData.field.player1.beasts[0]?.currentHealth).toBe(2);

      // Other creatures should be unaffected
      expect(newState.gameData.field.player1.beasts[1]?.currentHealth).toBe(3);
      expect(newState.gameData.field.player2.beasts[1]?.currentHealth).toBe(2);
    });

    test('should handle card draw with empty deck', () => {
      const config: Turbo.IGameConfig = {
        players: [
          { id: 'player1', name: 'Alice', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } }, // Empty deck
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: [] } }
        ]
      };

      game.initialize(config);

      // Try to draw from empty deck
      const action: Turbo.IGameAction<BloomBeastsActionData> = {
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.DRAW_CARD }
      };

      const result = game.executeAction(action);

      // Should fail gracefully
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('No cards left in deck');
    });

    test('should validate action order in a turn', () => {
      const config: Turbo.IGameConfig = {
        players: [
          {
            id: 'player1',
            name: 'Alice',
            type: Turbo.PlayerType.HUMAN,
            metadata: {
              // Enough cards for starting hand (3) + 2 explicit draws
              deck: [
                createBloomBeast('beast1', 'Test1', 1, 1, 1),
                createBloomBeast('beast2', 'Test2', 1, 1, 1),
                createBloomBeast('beast3', 'Test3', 1, 1, 1),
                createBloomBeast('beast4', 'Test4', 1, 1, 1),
                createBloomBeast('beast5', 'Test5', 1, 1, 1)
              ]
            }
          },
          { id: 'player2', name: 'Bob', type: Turbo.PlayerType.HUMAN, metadata: { deck: [
            createBloomBeast('beast6', 'Test6', 1, 1, 1),
            createBloomBeast('beast7', 'Test7', 1, 1, 1),
            createBloomBeast('beast8', 'Test8', 1, 1, 1)
          ] } }
        ]
      };

      game.initialize(config);

      // Draw card first
      game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.DRAW_CARD }
      });

      // Try to draw again
      const secondDraw = game.executeAction({
        type: 'game_action',
        playerId: 'player1',
        data: { type: BloomBeastsActionType.DRAW_CARD }
      });

      expect(secondDraw.success).toBe(false);
      expect(secondDraw.error?.message).toContain('Already drew a card');
    });
  });
});