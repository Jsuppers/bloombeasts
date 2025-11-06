/**
 * Unit tests for WinConditionChecker
 */

import { Turbo } from '../../../lib/Turbo-Standalone';

import { WinConditionChecker } from '../WinConditionChecker';
import type { BloomBeastsState } from '../../BloomBeastsGame';

describe('WinConditionChecker', () => {
  let checker: WinConditionChecker;

  beforeEach(() => {
    checker = new WinConditionChecker();
  });

  describe('checkBattleEnd', () => {
    it('should return null when game is not complete', () => {
      const state = createMockState({
        isComplete: false,
        player1Health: 20,
        player2Health: 15,
      });

      const result = checker.checkBattleEnd(state);

      expect(result).toBeNull();
    });

    it('should return player2 as winner when player1 health is 0', () => {
      const state = createMockState({
        isComplete: true,
        player1Health: 0,
        player2Health: 15,
      });

      const result = checker.checkBattleEnd(state);

      expect(result).not.toBeNull();
      expect(result!.winner).toBe('player2');
    });

    it('should return player1 as winner when player2 health is 0', () => {
      const state = createMockState({
        isComplete: true,
        player1Health: 20,
        player2Health: 0,
      });

      const result = checker.checkBattleEnd(state);

      expect(result).not.toBeNull();
      expect(result!.winner).toBe('player1');
    });

    it('should return null for tie when both players have 0 health', () => {
      const state = createMockState({
        isComplete: true,
        player1Health: 0,
        player2Health: 0,
      });

      const result = checker.checkBattleEnd(state);

      expect(result).not.toBeNull();
      expect(result!.winner).toBeNull();
    });

    it('should include turn number and health in result', () => {
      const state = createMockState({
        isComplete: true,
        player1Health: 25,
        player2Health: 0,
        turnNumber: 10,
      });

      const result = checker.checkBattleEnd(state);

      expect(result).not.toBeNull();
      expect(result!.turns).toBe(10);
      expect(result!.player1Health).toBe(25);
      expect(result!.player2Health).toBe(0);
    });
  });

  describe('shouldGameEnd', () => {
    it('should return false when both players alive', () => {
      const state = createMockState({
        isComplete: false,
        player1Health: 20,
        player2Health: 15,
        player1DeckSize: 5,
        player2DeckSize: 5,
      });

      const result = checker.shouldGameEnd(state);

      expect(result).toBe(false);
    });

    it('should return true when player1 is defeated', () => {
      const state = createMockState({
        isComplete: false,
        player1Health: 0,
        player2Health: 15,
      });

      const result = checker.shouldGameEnd(state);

      expect(result).toBe(true);
    });

    it('should return true when player2 is defeated', () => {
      const state = createMockState({
        isComplete: false,
        player1Health: 20,
        player2Health: 0,
      });

      const result = checker.shouldGameEnd(state);

      expect(result).toBe(true);
    });

    it('should return true when player1 is decked out', () => {
      const state = createMockState({
        isComplete: false,
        player1Health: 20,
        player2Health: 15,
        player1DeckSize: 0,
        player1HandSize: 0,
        player2DeckSize: 5,
      });

      const result = checker.shouldGameEnd(state);

      expect(result).toBe(true);
    });

    it('should not end when player has no deck but has cards in hand', () => {
      const state = createMockState({
        isComplete: false,
        player1Health: 20,
        player2Health: 15,
        player1DeckSize: 0,
        player1HandSize: 3,
        player2DeckSize: 5,
      });

      const result = checker.shouldGameEnd(state);

      expect(result).toBe(false);
    });
  });

  describe('getWinnerId', () => {
    it('should return player2 id when player1 is defeated', () => {
      const state = createMockState({
        isComplete: true,
        player1Health: 0,
        player2Health: 15,
      });

      const winnerId = checker.getWinnerId(state);

      expect(winnerId).toBe('player2');
    });

    it('should return player1 id when player2 is defeated', () => {
      const state = createMockState({
        isComplete: true,
        player1Health: 20,
        player2Health: 0,
      });

      const winnerId = checker.getWinnerId(state);

      expect(winnerId).toBe('player1');
    });

    it('should return null for tie', () => {
      const state = createMockState({
        isComplete: true,
        player1Health: 0,
        player2Health: 0,
      });

      const winnerId = checker.getWinnerId(state);

      expect(winnerId).toBeNull();
    });
  });
});

// Helper to create mock state
function createMockState(options: {
  isComplete: boolean;
  player1Health: number;
  player2Health: number;
  player1DeckSize?: number;
  player2DeckSize?: number;
  player1HandSize?: number;
  player2HandSize?: number;
  turnNumber?: number;
}): Turbo.IGameState<BloomBeastsState> {
  const player1Deck = Array.from({ length: options.player1DeckSize ?? 10 }, (_, i) => ({
    id: `p1-deck-${i}`,
    name: 'Card',
    type: 'Beast' as const,
    cost: 1,
    baseAttack: 1,
    baseHealth: 1,
    abilities: [],
    affinity: 'Forest' as const,
    description: 'Test',
  }));

  const player2Deck = Array.from({ length: options.player2DeckSize ?? 10 }, (_, i) => ({
    id: `p2-deck-${i}`,
    name: 'Card',
    type: 'Beast' as const,
    cost: 1,
    baseAttack: 1,
    baseHealth: 1,
    abilities: [],
    affinity: 'Forest' as const,
    description: 'Test',
  }));

  const player1Hand = Array.from({ length: options.player1HandSize ?? 0 }, (_, i) => ({
    id: `p1-hand-${i}`,
    name: 'Card',
    type: 'Beast' as const,
    cost: 1,
    baseAttack: 1,
    baseHealth: 1,
    abilities: [],
    affinity: 'Forest' as const,
    description: 'Test',
  }));

  const player2Hand = Array.from({ length: options.player2HandSize ?? 0 }, (_, i) => ({
    id: `p2-hand-${i}`,
    name: 'Card',
    type: 'Beast' as const,
    cost: 1,
    baseAttack: 1,
    baseHealth: 1,
    abilities: [],
    affinity: 'Forest' as const,
    description: 'Test',
  }));

  return {
    gameId: 'test-game',
    phase: 'playing' as const,
    isComplete: options.isComplete,
    turnInfo: {
      currentPlayerId: 'player1',
      turnNumber: options.turnNumber ?? 1,
      movesThisTurn: 0,
      timeStarted: Date.now(),
    },
    gameData: {
      players: [
        {
          id: 'player1',
          name: 'Player 1',
          health: options.player1Health,
          maxHealth: 30,
          energy: 5,
          deck: player1Deck,
          hand: player1Hand,
          graveyard: [],
          maxHandSize: 7,
        },
        {
          id: 'player2',
          name: 'Player 2',
          health: options.player2Health,
          maxHealth: 30,
          energy: 5,
          deck: player2Deck,
          hand: player2Hand,
          graveyard: [],
          maxHandSize: 7,
        },
      ],
      field: {
        player1: { beasts: [null, null, null], traps: [], buffs: [null, null, null], habitat: null },
        player2: { beasts: [null, null, null], traps: [], buffs: [null, null, null], habitat: null },
      },
      currentTurnActions: {
        hasDrawnCard: false,
        cardsPlayed: 0,
        hasAttacked: new Set(),
      },
    },
  } as Turbo.IGameState<BloomBeastsState>;
}
