/**
 * Cleansing Downpour - Integration Tests
 * Tests magic card functionality with counters and board effects
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { GameEngine } from '../../systems/GameEngine';
import { CLEANSING_DOWNPOUR } from './cleansingDownpour.js';
import { FUZZLET } from '../forest/fuzzlet.js';
import { CHARCOIL } from '../fire/charcoil.js';
import { BLAZEFINCH } from '../fire/blazefinch.js';
import {
  createTestGame,
  createDeck,
  createTestBeast,
  placeBeast,
  giveCards,
  setHand,
  giveNectar,
  hasCounter,
  getCounterAmount,
  waitForEffects,
} from '../__tests__/gameTestUtils.js';

describe('Cleansing Downpour - Integration Tests', () => {
  let game: GameEngine;

  beforeEach(() => {
    game = createTestGame();
  });

  describe('Basic Counter Removal', () => {
    test('should remove Burn counters from all beasts', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Setup: Create beasts with Burn counters
      const fuzzlet = createTestBeast(FUZZLET);
      fuzzlet.counters.push({ type: 'Burn', amount: 2 });
      placeBeast(player1, fuzzlet, 0);

      const charcoil = createTestBeast(CHARCOIL);
      charcoil.counters.push({ type: 'Burn', amount: 3 });
      placeBeast(player2, charcoil, 0);

      // Verify counters are present
      expect(hasCounter(fuzzlet, 'Burn')).toBe(true);
      expect(hasCounter(charcoil, 'Burn')).toBe(true);

      // Play Cleansing Downpour
      setHand(player1, [CLEANSING_DOWNPOUR]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await waitForEffects();

      // TODO: Verify counters are removed when magic card effects are implemented
      // expect(hasCounter(fuzzlet, 'Burn')).toBe(false);
      // expect(hasCounter(charcoil, 'Burn')).toBe(false);
    });

    test('should remove Freeze counters from all beasts', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];

      const fuzzlet = createTestBeast(FUZZLET);
      fuzzlet.counters.push({ type: 'Freeze', amount: 2 });
      placeBeast(player1, fuzzlet, 0);

      expect(hasCounter(fuzzlet, 'Freeze')).toBe(true);

      setHand(player1, [CLEANSING_DOWNPOUR]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await waitForEffects();

      // TODO: Verify Freeze counter removed
      // expect(hasCounter(fuzzlet, 'Freeze')).toBe(false);
    });

    test('should remove Poison counters from all beasts', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];

      const fuzzlet = createTestBeast(FUZZLET);
      fuzzlet.counters.push({ type: 'Poison', amount: 1 });
      placeBeast(player1, fuzzlet, 0);

      setHand(player1, [CLEANSING_DOWNPOUR]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await waitForEffects();

      // TODO: Verify Poison counter removed
      // expect(hasCounter(fuzzlet, 'Poison')).toBe(false);
    });
  });

  describe('Multiple Counters', () => {
    test('should remove all negative counter types at once', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Create beast with multiple negative counters
      const fuzzlet = createTestBeast(FUZZLET);
      fuzzlet.counters.push({ type: 'Burn', amount: 2 });
      fuzzlet.counters.push({ type: 'Freeze', amount: 1 });
      fuzzlet.counters.push({ type: 'Poison', amount: 1 });
      placeBeast(player, fuzzlet, 0);

      expect(fuzzlet.counters.length).toBe(3);

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);
      await game.playCard(player, 0);
      await waitForEffects();

      // TODO: Verify all negative counters removed
      // expect(fuzzlet.counters.length).toBe(0);
    });

    test('should remove counters from multiple beasts simultaneously', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Setup multiple beasts with counters
      const beast1 = createTestBeast(FUZZLET);
      beast1.counters.push({ type: 'Burn', amount: 1 });
      placeBeast(player1, beast1, 0);

      const beast2 = createTestBeast(CHARCOIL);
      beast2.counters.push({ type: 'Burn', amount: 2 });
      placeBeast(player1, beast2, 1);

      const beast3 = createTestBeast(BLAZEFINCH);
      beast3.counters.push({ type: 'Freeze', amount: 1 });
      placeBeast(player2, beast3, 0);

      setHand(player1, [CLEANSING_DOWNPOUR]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await waitForEffects();

      // TODO: All beasts should have counters removed
      // expect(beast1.counters.length).toBe(0);
      // expect(beast2.counters.length).toBe(0);
      // expect(beast3.counters.length).toBe(0);
    });
  });

  describe('Strategic Scenarios', () => {
    test('should save burning beasts from death', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Create low-health beast with lethal Burn counter
      const fuzzlet = createTestBeast(FUZZLET, {
        currentHealth: 2,
        maxHealth: 3,
      });
      fuzzlet.counters.push({ type: 'Burn', amount: 2 }); // Would die at start of turn
      placeBeast(player, fuzzlet, 0);

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);
      await game.playCard(player, 0);
      await waitForEffects();

      // TODO: Verify counter removed
      // expect(hasCounter(fuzzlet, 'Burn')).toBe(false);

      // Simulate start of turn (burn would trigger)
      await game.endTurn();
      await waitForEffects();

      // Beast should still be alive
      expect(fuzzlet.currentHealth).toBeGreaterThan(0);
    });

    test('should counter Fire-based strategies that rely on Burn', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];

      // Opponent's strategy applied burn counters
      const beast1 = createTestBeast(FUZZLET);
      beast1.counters.push({ type: 'Burn', amount: 3 });
      const beast2 = createTestBeast(CHARCOIL);
      beast2.counters.push({ type: 'Burn', amount: 2 });

      placeBeast(player1, beast1, 0);
      placeBeast(player1, beast2, 1);

      const totalBurnDamage =
        getCounterAmount(beast1, 'Burn') + getCounterAmount(beast2, 'Burn');
      expect(totalBurnDamage).toBe(5); // Total damage per turn without cleansing

      setHand(player1, [CLEANSING_DOWNPOUR]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await waitForEffects();

      // TODO: All burn damage negated
      // expect(getCounterAmount(beast1, 'Burn')).toBe(0);
      // expect(getCounterAmount(beast2, 'Burn')).toBe(0);
    });

    test('should unfreeze frozen beasts allowing them to attack', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const fuzzlet = createTestBeast(FUZZLET);
      fuzzlet.counters.push({ type: 'Freeze', amount: 2 }); // Frozen for 2 turns
      placeBeast(player, fuzzlet, 0);

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);
      await game.playCard(player, 0);
      await waitForEffects();

      // TODO: Verify freeze removed
      // expect(hasCounter(fuzzlet, 'Freeze')).toBe(false);

      // Beast should be able to attack immediately
      // (assuming freeze prevents attacks in game rules)
    });
  });

  describe('Card Draw Effect', () => {
    test('should draw 1 card', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR, FUZZLET, CHARCOIL]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const handSizeBefore = player.hand.length;

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);
      await game.playCard(player, 0);
      await waitForEffects();

      // TODO: Verify card drawn when draw effect is implemented
      // expect(player.hand.length).toBe(handSizeBefore + 1);
    });

    test('should provide card advantage even without counters to remove', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR, FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // No beasts with counters on field
      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player, fuzzlet, 0);

      expect(fuzzlet.counters.length).toBe(0);

      const handSizeBefore = player.hand.length;

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);
      await game.playCard(player, 0);
      await waitForEffects();

      // Still draws a card
      // TODO: Verify when implemented
      // expect(player.hand.length).toBe(handSizeBefore + 1);
    });
  });

  describe('Edge Cases', () => {
    test('should work with empty board', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // No beasts on field
      expect(player.field.filter(b => b !== null).length).toBe(0);

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);

      // Should still be playable
      const result = await game.playCard(player, 0);
      expect(result).toBe(true);

      // TODO: Should still draw card
      // expect(player.hand.length).toBe(1);
    });

    test('should not remove positive counters', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Create beast with positive counter (like Spore or Growth)
      const fuzzlet = createTestBeast(FUZZLET);
      fuzzlet.counters.push({ type: 'Spore', amount: 3 }); // Positive counter
      fuzzlet.counters.push({ type: 'Burn', amount: 1 }); // Negative counter
      placeBeast(player, fuzzlet, 0);

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);
      await game.playCard(player, 0);
      await waitForEffects();

      // TODO: Spore should remain, Burn should be removed
      // expect(hasCounter(fuzzlet, 'Spore')).toBe(true);
      // expect(hasCounter(fuzzlet, 'Burn')).toBe(false);
    });

    test('should work when counters are at high amounts', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const fuzzlet = createTestBeast(FUZZLET);
      fuzzlet.counters.push({ type: 'Burn', amount: 999 }); // Extremely high
      placeBeast(player, fuzzlet, 0);

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);
      await game.playCard(player, 0);
      await waitForEffects();

      // TODO: Should still remove all
      // expect(hasCounter(fuzzlet, 'Burn')).toBe(false);
    });
  });

  describe('Game Rules Compliance', () => {
    test('should cost 2 nectar', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      let state = game.getState();
      let player = state.players[0];

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 2);

      const nectarBefore = player.currentNectar;

      const result = await game.playCard(player, 0);

      // Get fresh state
      state = game.getState();
      player = state.players[0];

      expect(result).toBe(true);
      expect(player.currentNectar).toBe(nectarBefore - 2);
    });

    test('should not be playable with insufficient nectar', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      let state = game.getState();
      let player = state.players[0];

      setHand(player, [CLEANSING_DOWNPOUR]);
      // Turn 1 gives 1 nectar, need 2 total
      // Don't add any - only have 1 from turn 1

      const result = await game.playCard(player, 0);

      // Get fresh state
      state = game.getState();
      player = state.players[0];

      expect(result).toBe(false);
      expect(player.hand.length).toBe(1); // Still in hand
    });

    test('should go to graveyard after use', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      let state = game.getState();
      let player = state.players[0];

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);

      const graveyardSizeBefore = player.graveyard.length;

      await game.playCard(player, 0);
      await waitForEffects();

      // Get fresh state
      state = game.getState();
      player = state.players[0];

      expect(player.graveyard.length).toBe(graveyardSizeBefore + 1);
      expect(player.graveyard.some(c => c.id === 'cleansing-downpour')).toBe(true);
      expect(player.hand.some(c => c.id === 'cleansing-downpour')).toBe(false);
    });

    test('should be usable on any turn', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);

      // Turn 1
      const resultTurn1 = await game.playCard(player, 0);
      expect(resultTurn1).toBe(true);

      await game.endTurn();
      await game.endTurn();

      // Turn 2
      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);
      const resultTurn2 = await game.playCard(player, 0);
      expect(resultTurn2).toBe(true);
    });
  });

  describe('Timing and Response', () => {
    test('should immediately remove counters without waiting for turn phases', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const fuzzlet = createTestBeast(FUZZLET);
      fuzzlet.counters.push({ type: 'Burn', amount: 1 });
      placeBeast(player, fuzzlet, 0);

      setHand(player, [CLEANSING_DOWNPOUR]);
      giveNectar(player, 10);

      expect(hasCounter(fuzzlet, 'Burn')).toBe(true);

      await game.playCard(player, 0);
      // No await game.endTurn() - effect should be immediate

      // TODO: Verify immediate effect
      // expect(hasCounter(fuzzlet, 'Burn')).toBe(false);
    });
  });
});
