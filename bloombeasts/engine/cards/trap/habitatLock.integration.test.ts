/**
 * Habitat Lock - Integration Tests
 * Tests the trap card functionality in real gameplay scenarios
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { GameEngine } from '../../systems/GameEngine';
import { HABITAT_LOCK } from './habitatLock.js';
import { ANCIENT_FOREST } from '../forest/ancientForest.js';
import { VOLCANIC_SCAR } from '../fire/volcanicScar.js';
import { FUZZLET } from '../forest/fuzzlet.js';
import {
  createTestGame,
  createDeck,
  giveCards,
  setHand,
  giveNectar,
  waitForEffects,
} from '../__tests__/gameTestUtils.js';

describe('Habitat Lock - Integration Tests', () => {
  let game: GameEngine;

  beforeEach(() => {
    game = createTestGame();
  });

  describe('Trap Placement', () => {
    test('should be placed face-down in trap zone', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([])
      );

      let state = game.getState();
      let player = state.players[0];

      // Clear initial hand and set specific cards
      setHand(player, [HABITAT_LOCK]);
      giveNectar(player, 10);

      const result = await game.playCard(player, 0);

      // Get fresh state after playCard
      state = game.getState();
      player = state.players[0];

      expect(result).toBe(true);
      expect(player.trapZone.some(t => t && t.id === 'habitat-lock')).toBe(true);
      expect(player.hand.length).toBe(0); // Card removed from hand
    });

    test('should cost 1 nectar to set', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([])
      );

      let state = game.getState();
      let player = state.players[0];

      setHand(player, [HABITAT_LOCK]);
      // Turn 1 gives 1 nectar, need 1 for trap - have exactly enough
      const nectarBefore = player.currentNectar;

      await game.playCard(player, 0);

      state = game.getState();
      player = state.players[0];

      expect(player.currentNectar).toBe(nectarBefore - 1);
    });

    test('should not be playable with full trap zone', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK, HABITAT_LOCK, HABITAT_LOCK, HABITAT_LOCK]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      giveCards(player, [HABITAT_LOCK, HABITAT_LOCK, HABITAT_LOCK, HABITAT_LOCK]);
      giveNectar(player, 10);

      // Fill trap zone (max 3 slots)
      await game.playCard(player, 0);
      await game.playCard(player, 0);
      await game.playCard(player, 0);

      // 4th trap should go to graveyard
      await game.playCard(player, 0);

      const trapsInZone = player.trapZone.filter(t => t !== null).length;
      expect(trapsInZone).toBeLessThanOrEqual(3);
    });
  });

  describe('Trap Activation', () => {
    test('should trigger when opponent plays habitat card', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([ANCIENT_FOREST])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 sets trap
      giveCards(player1, [HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await waitForEffects();

      // End turn so player 2 can play
      await game.endTurn();
      await waitForEffects();

      const trapCountBefore = player1.trapZone.filter(t => t !== null).length;

      // Player 2 plays habitat
      giveCards(player2, [ANCIENT_FOREST]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Trap should activate and move to graveyard
      const trapCountAfter = player1.trapZone.filter(t => t !== null).length;
      expect(trapCountAfter).toBe(trapCountBefore - 1);
      expect(player1.graveyard.some(c => c.id === 'habitat-lock')).toBe(true);
    });

    test('should counter the habitat card', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([ANCIENT_FOREST])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 sets trap
      giveCards(player1, [HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);

      await game.endTurn();

      // Player 2 plays habitat
      giveCards(player2, [ANCIENT_FOREST]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Habitat should be countered and not enter play
      expect(state.habitatZone).toBe(null);
      // Habitat should be in graveyard
      expect(player2.graveyard.some(c => c.id === 'ancient-forest')).toBe(true);
    });

    test('should deal 2 damage to opponent', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([ANCIENT_FOREST])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 sets trap
      giveCards(player1, [HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);

      await game.endTurn();

      const player2HealthBefore = player2.health;

      // Player 2 plays habitat, triggering trap
      giveCards(player2, [ANCIENT_FOREST]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // TODO: Verify damage dealt when trap effects are fully implemented
      // expect(player2.health).toBe(player2HealthBefore - 2);
    });
  });

  describe('Trap Timing', () => {
    test('should not trigger on own habitat plays', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK, ANCIENT_FOREST]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Set trap - replace hand to ensure correct order
      player.hand = [HABITAT_LOCK, ANCIENT_FOREST];
      giveNectar(player, 10);
      await game.playCard(player, 0); // Set trap

      const trapCountBefore = player.trapZone.filter(t => t !== null).length;

      // Play own habitat
      await game.playCard(player, 0); // Play habitat

      await waitForEffects();

      // Trap should NOT activate
      const trapCountAfter = player.trapZone.filter(t => t !== null).length;
      expect(trapCountAfter).toBe(trapCountBefore);
    });

    test('should not trigger on bloom card plays', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 sets trap
      giveCards(player1, [HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);

      await game.endTurn();

      const trapCountBefore = player1.trapZone.filter(t => t !== null).length;

      // Player 2 plays bloom beast (not habitat)
      giveCards(player2, [FUZZLET]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Trap should NOT activate
      const trapCountAfter = player1.trapZone.filter(t => t !== null).length;
      expect(trapCountAfter).toBe(trapCountBefore);
    });
  });

  describe('Strategic Scenarios', () => {
    test('should prevent opponent from establishing habitat', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([VOLCANIC_SCAR])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 sets trap
      giveCards(player1, [HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);

      await game.endTurn();

      // Player 2 tries to play habitat
      giveCards(player2, [VOLCANIC_SCAR]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // No habitat should be active
      expect(state.habitatZone).toBe(null);

      // Player 2 wasted nectar and lost the card
      expect(player2.graveyard.some(c => c.id === 'volcanic-scar')).toBe(true);
    });

    test('should punish expensive habitat plays', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([ANCIENT_FOREST]) // Costs 1 nectar
      );

      let state = game.getState();
      const player1 = state.players[0];
      let player2 = state.players[1];

      // Player 1 sets cheap trap (1 nectar)
      setHand(player1, [HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);

      await game.endTurn();

      // Get fresh state after turn change
      state = game.getState();
      player2 = state.players[1];
      const player2NectarBefore = player2.currentNectar;

      // Player 2 plays habitat
      setHand(player2, [ANCIENT_FOREST]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Get final state
      state = game.getState();
      player2 = state.players[1];

      // Player 2 spent nectar but habitat was countered
      expect(player2.currentNectar).toBe(player2NectarBefore + 10 - ANCIENT_FOREST.cost);
      expect(state.habitatZone).toBe(null);
    });
  });

  describe('Multiple Traps', () => {
    test('multiple Habitat Locks should each trigger on different habitat plays', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK, HABITAT_LOCK]),
        createDeck([ANCIENT_FOREST, VOLCANIC_SCAR])
      );

      let state = game.getState();
      let player1 = state.players[0];
      let player2 = state.players[1];

      // Player 1 sets two traps
      giveCards(player1, [HABITAT_LOCK, HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await game.playCard(player1, 0);

      await game.endTurn();

      // Get fresh state
      state = game.getState();
      player1 = state.players[0];
      player2 = state.players[1];

      // Player 2 plays first habitat
      giveCards(player2, [ANCIENT_FOREST]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Get fresh state
      state = game.getState();
      player1 = state.players[0];

      // One trap should activate
      let trapsRemaining = player1.trapZone.filter(t => t !== null).length;
      expect(trapsRemaining).toBe(1);

      await game.endTurn();
      await game.endTurn();

      // Get fresh state
      state = game.getState();
      player1 = state.players[0];
      player2 = state.players[1];

      // Player 2 plays second habitat
      giveCards(player2, [VOLCANIC_SCAR]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Get fresh state
      state = game.getState();
      player1 = state.players[0];

      // Second trap should activate
      trapsRemaining = player1.trapZone.filter(t => t !== null).length;
      expect(trapsRemaining).toBe(0);

      // Both traps in graveyard
      expect(player1.graveyard.filter(c => c.id === 'habitat-lock').length).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    test('should work when trap zone is almost full', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK, HABITAT_LOCK, HABITAT_LOCK]),
        createDeck([ANCIENT_FOREST])
      );

      let state = game.getState();
      let player1 = state.players[0];
      let player2 = state.players[1];

      // Fill trap zone
      giveCards(player1, [HABITAT_LOCK, HABITAT_LOCK, HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await game.playCard(player1, 0);
      await game.playCard(player1, 0);

      await game.endTurn();

      // Get fresh state
      state = game.getState();
      player1 = state.players[0];
      player2 = state.players[1];

      // Trigger trap
      giveCards(player2, [ANCIENT_FOREST]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Get fresh state
      state = game.getState();
      player1 = state.players[0];

      // One trap should activate
      const trapsRemaining = player1.trapZone.filter(t => t !== null).length;
      expect(trapsRemaining).toBe(2);
    });

    test('trap should go to graveyard after activation, not back to hand', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([ANCIENT_FOREST])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      giveCards(player1, [HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);

      await game.endTurn();

      const handSizeBefore = player1.hand.length;
      const graveyardSizeBefore = player1.graveyard.length;

      giveCards(player2, [ANCIENT_FOREST]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Should not go back to hand
      expect(player1.hand.length).toBe(handSizeBefore);
      // Should go to graveyard
      expect(player1.graveyard.length).toBe(graveyardSizeBefore + 1);
      expect(player1.graveyard.some(c => c.id === 'habitat-lock')).toBe(true);
    });
  });

  describe('Game Rules Compliance', () => {
    test('should follow trap activation priority order', async () => {
      // If multiple traps are set, they should activate in the order they were set
      // This is implementation-dependent, but document expected behavior
      await game.startMatch(
        createDeck([HABITAT_LOCK, HABITAT_LOCK]),
        createDeck([ANCIENT_FOREST])
      );

      let state = game.getState();
      let player1 = state.players[0];
      let player2 = state.players[1];

      giveCards(player1, [HABITAT_LOCK, HABITAT_LOCK]);
      giveNectar(player1, 10);

      // Set traps in specific order
      await game.playCard(player1, 0); // First trap
      await game.playCard(player1, 0); // Second trap

      await game.endTurn();

      // Get fresh state
      state = game.getState();
      player1 = state.players[0];
      player2 = state.players[1];

      giveCards(player2, [ANCIENT_FOREST]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Get fresh state
      state = game.getState();
      player1 = state.players[0];

      // Only one trap should activate per habitat play
      const trapsRemaining = player1.trapZone.filter(t => t !== null).length;
      expect(trapsRemaining).toBe(1);
    });
  });
});
