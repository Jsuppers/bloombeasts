/**
 * Gameplay Integration Tests
 * Tests for real gameplay scenarios and mechanics
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { GameEngine } from '../../systems/GameEngine';
import { loadCardFromJSON } from './testUtils.js';
import {
  createTestGame,
  createDeck,
  createTestBeast,
  placeBeast,
  waitForEffects,
} from './gameTestUtils.js';

// Load test cards
const MOSSLET = loadCardFromJSON('mosslet', 'forest');
const BLAZEFINCH = loadCardFromJSON('blazefinch', 'fire');
const CHARCOIL = loadCardFromJSON('charcoil', 'fire');
const LEAF_SPRITE = loadCardFromJSON('leaf-sprite', 'forest');
const ROOTLING = loadCardFromJSON('rootling', 'forest');

describe('Gameplay Integration Tests', () => {
  let game: GameEngine;

  beforeEach(() => {
    game = createTestGame();
  });

  describe('Attack Targeting', () => {
    test('3 attackers vs 1 defender: 2 should attack health, 1 attacks opposing beast', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET, MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 has 3 beasts ready to attack
      const beast1 = createTestBeast(MOSSLET, { currentAttack: 2, currentHealth: 3 });
      const beast2 = createTestBeast(MOSSLET, { currentAttack: 2, currentHealth: 3 });
      const beast3 = createTestBeast(MOSSLET, { currentAttack: 2, currentHealth: 3 });

      beast1.summoningSickness = false;
      beast2.summoningSickness = false;
      beast3.summoningSickness = false;

      placeBeast(player1, beast1, 0); // Position 0
      placeBeast(player1, beast2, 1); // Position 1
      placeBeast(player1, beast3, 2); // Position 2

      // Player 2 has 1 beast at position 1
      const defender = createTestBeast(CHARCOIL, { currentAttack: 2, currentHealth: 5 });
      defender.summoningSickness = false;
      placeBeast(player2, defender, 1); // Position 1 only

      const initialPlayer2Health = player2.health;
      const initialDefenderHealth = defender.currentHealth;

      // Beast at position 0 attacks player (no opposing beast)
      await game.executeAttack(player1, 0, 'player');
      await waitForEffects();

      let updatedState = game.getState();
      let updatedPlayer2 = updatedState.players[1];

      // Player 2 should have taken damage
      expect(updatedPlayer2.health).toBeLessThan(initialPlayer2Health);
      expect(updatedPlayer2.health).toBe(initialPlayer2Health - 2);

      // Beast at position 1 attacks opposing beast at position 1
      await game.executeAttack(player1, 1, 'beast', 1);
      await waitForEffects();

      updatedState = game.getState();
      const updatedDefender = updatedState.players[1].field[1];

      // Defender should have taken damage
      expect(updatedDefender).toBeTruthy();
      if (updatedDefender) {
        expect(updatedDefender.currentHealth).toBeLessThan(initialDefenderHealth);
        expect(updatedDefender.currentHealth).toBe(initialDefenderHealth - 2);
      }

      // Beast at position 2 attacks player (no opposing beast)
      await game.executeAttack(player1, 2, 'player');
      await waitForEffects();

      updatedState = game.getState();
      updatedPlayer2 = updatedState.players[1];

      // Player 2 should have taken more damage
      expect(updatedPlayer2.health).toBe(initialPlayer2Health - 4); // 2 attacks of 2 damage
    });

    test('should only attack opposing position by default (lane-based combat)', async () => {
      await game.startMatch(
        createDeck([MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 has beast at position 0
      const attacker = createTestBeast(MOSSLET, { currentAttack: 3 });
      attacker.summoningSickness = false;
      placeBeast(player1, attacker, 0);

      // Player 2 has beasts at positions 1 and 2
      const defender1 = createTestBeast(CHARCOIL, { currentHealth: 5 });
      const defender2 = createTestBeast(CHARCOIL, { currentHealth: 5 });
      placeBeast(player2, defender1, 1);
      placeBeast(player2, defender2, 2);

      const initialHealth1 = defender1.currentHealth;
      const initialHealth2 = defender2.currentHealth;

      // Attack from position 0 can hit health (no opposing beast at position 0)
      await game.executeAttack(player1, 0, 'player');
      await waitForEffects();

      const updatedState = game.getState();
      const updatedDefender1 = updatedState.players[1].field[1];
      const updatedDefender2 = updatedState.players[1].field[2];

      // Other lanes should be untouched
      expect(updatedDefender1?.currentHealth).toBe(initialHealth1);
      expect(updatedDefender2?.currentHealth).toBe(initialHealth2);
    });

    test('empty lanes allow direct attacks to health', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET, MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 has beasts in all 3 positions
      const beast0 = createTestBeast(MOSSLET, { currentAttack: 2 });
      const beast1 = createTestBeast(MOSSLET, { currentAttack: 2 });
      const beast2 = createTestBeast(MOSSLET, { currentAttack: 2 });

      beast0.summoningSickness = false;
      beast1.summoningSickness = false;
      beast2.summoningSickness = false;

      placeBeast(player1, beast0, 0);
      placeBeast(player1, beast1, 1);
      placeBeast(player1, beast2, 2);

      // Player 2 has NO beasts (all lanes empty)
      const initialHealth = player2.health;

      // All 3 beasts should be able to attack player
      await game.executeAttack(player1, 0, 'player');
      await waitForEffects();

      await game.executeAttack(player1, 1, 'player');
      await waitForEffects();

      await game.executeAttack(player1, 2, 'player');
      await waitForEffects();

      const updatedState = game.getState();
      const updatedPlayer2 = updatedState.players[1];

      // Should have taken 6 damage total (3 beasts x 2 attack each)
      expect(updatedPlayer2.health).toBe(initialHealth - 6);
    });
  });

  describe('Summoning Sickness', () => {
    test('only ready beasts should be able to attack', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET, MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 has 3 beasts: 1 ready, 2 with summoning sickness
      const readyBeast = createTestBeast(MOSSLET, { currentAttack: 3 });
      readyBeast.summoningSickness = false; // Ready to attack

      const sicknessBeast1 = createTestBeast(MOSSLET, { currentAttack: 3 });
      sicknessBeast1.summoningSickness = true; // Not ready

      const sicknessBeast2 = createTestBeast(MOSSLET, { currentAttack: 3 });
      sicknessBeast2.summoningSickness = true; // Not ready

      placeBeast(player1, readyBeast, 0);
      placeBeast(player1, sicknessBeast1, 1);
      placeBeast(player1, sicknessBeast2, 2);

      const initialHealth = player2.health;

      // Try to attack with ready beast - should succeed
      await game.executeAttack(player1, 0, 'player');
      await waitForEffects();

      let updatedState = game.getState();
      let updatedPlayer2 = updatedState.players[1];
      expect(updatedPlayer2.health).toBe(initialHealth - 3); // Damage applied

      // Try to attack with sickness beast - should fail
      const result1 = await game.executeAttack(player1, 1, 'player');
      await waitForEffects();

      updatedState = game.getState();
      updatedPlayer2 = updatedState.players[1];
      expect(updatedPlayer2.health).toBe(initialHealth - 3); // No additional damage

      // Try to attack with another sickness beast - should fail
      const result2 = await game.executeAttack(player1, 2, 'player');
      await waitForEffects();

      updatedState = game.getState();
      updatedPlayer2 = updatedState.players[1];
      expect(updatedPlayer2.health).toBe(initialHealth - 3); // Still no additional damage
    });

    test('summoning sickness should be removed at start of turn', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];

      // Place beast with summoning sickness
      const beast = createTestBeast(MOSSLET);
      beast.summoningSickness = true;
      placeBeast(player1, beast, 0);

      expect(beast.summoningSickness).toBe(true);

      // End turn and come back
      await game.endTurn(); // Player 1 -> Player 2
      await game.endTurn(); // Player 2 -> Player 1

      const updatedState = game.getState();
      const updatedBeast = updatedState.players[0].field[0];

      // Summoning sickness should be removed
      expect(updatedBeast?.summoningSickness).toBe(false);
    });

    test('newly summoned beasts should have summoning sickness', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];

      // Place a fresh beast (simulating a summon)
      const newBeast = createTestBeast(MOSSLET);
      newBeast.summoningSickness = true; // Should start with sickness
      placeBeast(player1, newBeast, 0);

      expect(newBeast.summoningSickness).toBe(true);

      // Should not be able to attack immediately
      const player2InitialHealth = state.players[1].health;
      await game.executeAttack(player1, 0, 'player');
      await waitForEffects();

      const updatedState = game.getState();
      expect(updatedState.players[1].health).toBe(player2InitialHealth); // No damage
    });
  });

  describe('Multi-Beast Combat', () => {
    test('3 vs 3 full field battle', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET, MOSSLET]),
        createDeck([CHARCOIL, CHARCOIL, CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1: 3 beasts, all ready
      for (let i = 0; i < 3; i++) {
        const beast = createTestBeast(MOSSLET, { currentAttack: 2, currentHealth: 3 });
        beast.summoningSickness = false;
        placeBeast(player1, beast, i);
      }

      // Player 2: 3 beasts, all ready
      for (let i = 0; i < 3; i++) {
        const beast = createTestBeast(CHARCOIL, { currentAttack: 2, currentHealth: 4 });
        beast.summoningSickness = false;
        placeBeast(player2, beast, i);
      }

      // Each player 1 beast attacks the opposing beast in same lane
      for (let i = 0; i < 3; i++) {
        await game.executeAttack(player1, i, 'beast', i);
        await waitForEffects();
      }

      const updatedState = game.getState();
      const player2Beasts = updatedState.players[1].field;

      // All player 2 beasts should have taken 2 damage
      for (let i = 0; i < 3; i++) {
        const beast = player2Beasts[i];
        expect(beast).toBeTruthy();
        if (beast) {
          expect(beast.currentHealth).toBe(2); // 4 - 2 = 2
        }
      }
    });

    test('2 vs 1: multiple attackers on single defender', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1: 2 beasts at positions 0 and 2
      const attacker1 = createTestBeast(MOSSLET, { currentAttack: 3 });
      const attacker2 = createTestBeast(MOSSLET, { currentAttack: 3 });
      attacker1.summoningSickness = false;
      attacker2.summoningSickness = false;
      placeBeast(player1, attacker1, 0);
      placeBeast(player1, attacker2, 2);

      // Player 2: 1 beast at position 1
      const defender = createTestBeast(CHARCOIL, { currentHealth: 10 });
      placeBeast(player2, defender, 1);

      const initialHealth = defender.currentHealth;

      // Attacker 1 (position 0) has no opposing beast, attacks health
      await game.executeAttack(player1, 0, 'player');
      await waitForEffects();

      let updatedState = game.getState();
      expect(updatedState.players[1].health).toBeLessThan(30); // Health damaged

      // Attacker 2 (position 2) has no opposing beast, attacks health
      await game.executeAttack(player1, 2, 'player');
      await waitForEffects();

      updatedState = game.getState();
      expect(updatedState.players[1].health).toBeLessThan(30 - 3); // More health damaged

      // The defender at position 1 should still be at full health
      const updatedDefender = updatedState.players[1].field[1];
      expect(updatedDefender?.currentHealth).toBe(initialHealth);
    });

    test('counter attack: both beasts take damage', async () => {
      await game.startMatch(
        createDeck([MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Both beasts at position 0
      const attacker = createTestBeast(MOSSLET, { currentAttack: 3, currentHealth: 5 });
      attacker.summoningSickness = false;
      placeBeast(player1, attacker, 0);

      const defender = createTestBeast(CHARCOIL, { currentAttack: 2, currentHealth: 6 });
      placeBeast(player2, defender, 0);

      const initialAttackerHealth = attacker.currentHealth;
      const initialDefenderHealth = defender.currentHealth;

      // Attack
      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      const updatedState = game.getState();
      const updatedAttacker = updatedState.players[0].field[0];
      const updatedDefender = updatedState.players[1].field[0];

      // Both should have taken damage
      expect(updatedAttacker?.currentHealth).toBeLessThan(initialAttackerHealth);
      expect(updatedDefender?.currentHealth).toBeLessThan(initialDefenderHealth);

      // Check exact damage values
      expect(updatedAttacker?.currentHealth).toBe(initialAttackerHealth - 2); // Took defender's attack
      expect(updatedDefender?.currentHealth).toBe(initialDefenderHealth - 3); // Took attacker's attack
    });

    test('lethal damage: beast should be destroyed and moved to graveyard', async () => {
      await game.startMatch(
        createDeck([MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Strong attacker
      const attacker = createTestBeast(MOSSLET, { currentAttack: 10, currentHealth: 10 });
      attacker.summoningSickness = false;
      placeBeast(player1, attacker, 0);

      // Weak defender
      const defender = createTestBeast(CHARCOIL, { currentAttack: 1, currentHealth: 3 });
      placeBeast(player2, defender, 0);

      expect(player2.field[0]).toBeTruthy();
      expect(player2.graveyard.length).toBe(0);

      // Deal lethal damage
      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      const updatedState = game.getState();
      const updatedPlayer2 = updatedState.players[1];

      // Defender should be destroyed
      expect(updatedPlayer2.field[0]).toBe(null);

      // Defender should be in graveyard
      expect(updatedPlayer2.graveyard.length).toBeGreaterThan(0);
    });
  });

  describe('Field Positioning', () => {
    test('beasts should maintain their lane positions', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET, MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];

      // Place beasts at specific positions
      const beast0 = createTestBeast(MOSSLET);
      const beast1 = createTestBeast(MOSSLET);
      const beast2 = createTestBeast(MOSSLET);

      placeBeast(player1, beast0, 0);
      placeBeast(player1, beast1, 1);
      placeBeast(player1, beast2, 2);

      // Verify they're in the right spots
      expect(player1.field[0]?.cardId).toBe('mosslet');
      expect(player1.field[1]?.cardId).toBe('mosslet');
      expect(player1.field[2]?.cardId).toBe('mosslet');
      expect(player1.field[0]?.slotIndex).toBe(0);
      expect(player1.field[1]?.slotIndex).toBe(1);
      expect(player1.field[2]?.slotIndex).toBe(2);
    });

    test('empty field positions should remain null', async () => {
      await game.startMatch(
        createDeck([MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];

      // Only place one beast
      const beast = createTestBeast(MOSSLET);
      placeBeast(player1, beast, 1); // Middle position

      // Other positions should be empty
      expect(player1.field[0]).toBe(null);
      expect(player1.field[1]).toBeTruthy();
      expect(player1.field[2]).toBe(null);
    });
  });

  describe('Turn Flow', () => {
    test('players should alternate turns', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET]),
        createDeck([CHARCOIL, CHARCOIL])
      );

      let state = game.getState();
      expect(state.activePlayer).toBe(0); // Player 1 starts

      await game.endTurn();
      state = game.getState();
      expect(state.activePlayer).toBe(1); // Player 2's turn

      await game.endTurn();
      state = game.getState();
      expect(state.activePlayer).toBe(0); // Back to Player 1

      await game.endTurn();
      state = game.getState();
      expect(state.activePlayer).toBe(1); // Player 2 again
    });

    test('turn counter should increment', async () => {
      await game.startMatch(
        createDeck([MOSSLET, MOSSLET]),
        createDeck([CHARCOIL, CHARCOIL])
      );

      let state = game.getState();
      const initialTurn = state.turn;

      await game.endTurn(); // P1 -> P2
      await game.endTurn(); // P2 -> P1

      state = game.getState();
      expect(state.turn).toBeGreaterThan(initialTurn);
    });
  });

  describe('Victory Conditions', () => {
    test('player with 0 health should lose', async () => {
      await game.startMatch(
        createDeck([MOSSLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 has a very strong beast
      const attacker = createTestBeast(MOSSLET, { currentAttack: 30 });
      attacker.summoningSickness = false;
      placeBeast(player1, attacker, 0);

      // Player 2 has no beasts (all lanes empty for direct attack)
      expect(player2.health).toBe(30);

      // Attack player 2 directly with lethal damage
      await game.executeAttack(player1, 0, 'player');
      await waitForEffects();

      const updatedState = game.getState();
      const updatedPlayer2 = updatedState.players[1];

      // Player 2 should be at 0 or negative health
      expect(updatedPlayer2.health).toBeLessThanOrEqual(0);
    });
  });
});
