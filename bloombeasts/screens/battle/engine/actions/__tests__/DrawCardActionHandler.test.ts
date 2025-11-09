/**
 * Unit tests for DrawCardActionHandler
 */

import { Turbo } from '../../../../../lib/Turbo-Standalone';

import { DrawCardActionHandler } from '../DrawCardActionHandler';
import { BloomBeastsActionType } from '../../BloomBeastsGame';
import type { BloomBeastsState } from '../../BloomBeastsGame';

describe('DrawCardActionHandler', () => {
  let handler: DrawCardActionHandler;

  beforeEach(() => {
    handler = new DrawCardActionHandler();
  });

  describe('validate', () => {
    it('should allow drawing when no card drawn this turn', () => {
      const state = createMockState({
        hasDrawnCard: false,
        deckSize: 5,
        handSize: 3,
      });

      const result = handler.validate(
        { type: BloomBeastsActionType.DRAW_CARD },
        state,
        'player1'
      );

      expect(result.valid).toBe(true);
    });

    it('should reject when already drawn this turn', () => {
      const state = createMockState({
        hasDrawnCard: true,
        deckSize: 5,
        handSize: 3,
      });

      const result = handler.validate(
        { type: BloomBeastsActionType.DRAW_CARD },
        state,
        'player1'
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Already drew a card this turn');
    });

    it('should reject when deck is empty', () => {
      const state = createMockState({
        hasDrawnCard: false,
        deckSize: 0,
        handSize: 3,
      });

      const result = handler.validate(
        { type: BloomBeastsActionType.DRAW_CARD },
        state,
        'player1'
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('No cards left in deck');
    });

    it('should reject when hand is full', () => {
      const state = createMockState({
        hasDrawnCard: false,
        deckSize: 5,
        handSize: 7, // Assuming max hand size is 7
      });

      const result = handler.validate(
        { type: BloomBeastsActionType.DRAW_CARD },
        state,
        'player1'
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Hand is full');
    });
  });

  describe('execute', () => {
    it('should move card from deck to hand', () => {
      const state = createMockState({
        hasDrawnCard: false,
        deckSize: 5,
        handSize: 3,
      });

      const result = handler.execute(
        { type: BloomBeastsActionType.DRAW_CARD },
        state,
        'player1'
      );

      expect(result.success).toBe(true);
      expect(result.newState.gameData.players[0].hand.length).toBe(4);
      expect(result.newState.gameData.players[0].deck.length).toBe(4);
    });

    it('should mark hasDrawnCard as true', () => {
      const state = createMockState({
        hasDrawnCard: false,
        deckSize: 5,
        handSize: 3,
      });

      const result = handler.execute(
        { type: BloomBeastsActionType.DRAW_CARD },
        state,
        'player1'
      );

      expect(result.success).toBe(true);
      expect(result.newState.gameData.currentTurnActions.hasDrawnCard).toBe(true);
    });

    it('should emit card_drawn event', () => {
      const state = createMockState({
        hasDrawnCard: false,
        deckSize: 5,
        handSize: 3,
      });

      const result = handler.execute(
        { type: BloomBeastsActionType.DRAW_CARD },
        state,
        'player1'
      );

      expect(result.success).toBe(true);
      expect(result.sideEffects).toHaveLength(1);
      expect(result.sideEffects![0].type).toBe('card_drawn');
    });

    it('should not mutate original state', () => {
      const state = createMockState({
        hasDrawnCard: false,
        deckSize: 5,
        handSize: 3,
      });

      const originalDeckSize = state.gameData.players[0].deck.length;
      const originalHandSize = state.gameData.players[0].hand.length;

      handler.execute(
        { type: BloomBeastsActionType.DRAW_CARD },
        state,
        'player1'
      );

      expect(state.gameData.players[0].deck.length).toBe(originalDeckSize);
      expect(state.gameData.players[0].hand.length).toBe(originalHandSize);
    });
  });
});

// Helper to create mock state
function createMockState(options: {
  hasDrawnCard: boolean;
  deckSize: number;
  handSize: number;
}): Turbo.IGameState<BloomBeastsState> {
  const deck = Array.from({ length: options.deckSize }, (_, i) => ({
    id: `card-deck-${i}`,
    name: `Deck Card ${i}`,
    type: 'Beast' as const,
    cost: 1,
    baseAttack: 1,
    baseHealth: 1,
    abilities: [],
    affinity: 'Forest' as const,
    description: 'Test card',
  }));

  const hand = Array.from({ length: options.handSize }, (_, i) => ({
    id: `card-hand-${i}`,
    name: `Hand Card ${i}`,
    type: 'Beast' as const,
    cost: 1,
    baseAttack: 1,
    baseHealth: 1,
    abilities: [],
    affinity: 'Forest' as const,
    description: 'Test card',
  }));

  return {
    gameId: 'test-game',
    phase: 'playing' as const,
    isComplete: false,
    turnInfo: {
      currentPlayerId: 'player1',
      turnNumber: 1,
      movesThisTurn: 0,
      timeStarted: Date.now(),
    },
    gameData: {
      players: [
        {
          id: 'player1',
          name: 'Player 1',
          health: 30,
          maxHealth: 30,
          energy: 5,
          deck,
          hand,
          graveyard: [],
          maxHandSize: 7,
        },
        {
          id: 'player2',
          name: 'Player 2',
          health: 30,
          maxHealth: 30,
          energy: 5,
          deck: [],
          hand: [],
          graveyard: [],
          maxHandSize: 7,
        },
      ],
      field: {
        player1: { beasts: [null, null, null], traps: [], buffs: [null, null, null], habitat: null },
        player2: { beasts: [null, null, null], traps: [], buffs: [null, null, null], habitat: null },
      },
      currentTurnActions: {
        hasDrawnCard: options.hasDrawnCard,
        cardsPlayed: 0,
        hasAttacked: new Set(),
      },
    },
  } as Turbo.IGameState<BloomBeastsState>;
}
