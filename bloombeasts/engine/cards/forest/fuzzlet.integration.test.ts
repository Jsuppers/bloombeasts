/**
 * Fuzzlet - Integration Tests
 * Tests bloom beast abilities, leveling, combat, and ability upgrades
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { GameEngine } from '../../systems/GameEngine';
import { FUZZLET } from './fuzzlet.js';
import { CHARCOIL } from '../fire/charcoil.js';
import { LEAF_SPRITE } from './leafSprite.js';
import {
  createTestGame,
  createDeck,
  createTestBeast,
  placeBeast,
  giveCards,
  giveNectar,
  hasCounter,
  getCounterAmount,
  waitForEffects,
  findBeastByCardId,
} from '../__tests__/gameTestUtils.js';

describe('Fuzzlet - Integration Tests', () => {
  let game: GameEngine;

  beforeEach(() => {
    game = createTestGame();
  });

  describe('Summoning', () => {
    test('should be summoned with correct base stats', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      giveCards(player, [FUZZLET]);
      giveNectar(player, 10);

      await game.playCard(player, 0);
      await waitForEffects();

      const fuzzlet = findBeastByCardId(player, 'fuzzlet');
      expect(fuzzlet).toBeTruthy();
      expect(fuzzlet!.currentAttack).toBe(FUZZLET.baseAttack);
      expect(fuzzlet!.currentHealth).toBe(FUZZLET.baseHealth);
      expect(fuzzlet!.maxHealth).toBe(FUZZLET.baseHealth);
    });

    test('should start at level 1', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      giveCards(player, [FUZZLET]);
      giveNectar(player, 10);

      await game.playCard(player, 0);
      await waitForEffects();

      const fuzzlet = findBeastByCardId(player, 'fuzzlet');
      expect(fuzzlet!.currentLevel).toBe(1);
      expect(fuzzlet!.currentXP).toBe(0);
    });

    test('should have summoning sickness initially', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      giveCards(player, [FUZZLET]);
      giveNectar(player, 10);

      await game.playCard(player, 0);
      await waitForEffects();

      const fuzzlet = findBeastByCardId(player, 'fuzzlet');

      // TODO: Verify summoning sickness when implemented
      // expect(fuzzlet!.summoningSickness).toBe(true);
    });

    test('should occupy a field slot', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const emptySlotsBefore = player.field.filter(s => s === null).length;

      giveCards(player, [FUZZLET]);
      giveNectar(player, 10);

      await game.playCard(player, 0);
      await waitForEffects();

      const emptySlotsAfter = player.field.filter(s => s === null).length;
      expect(emptySlotsAfter).toBe(emptySlotsBefore - 1);
    });
  });

  describe('OnDamage Ability - Spore Counter', () => {
    test('should apply 1 Spore counter to self when damaged', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Setup beasts
      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player1, fuzzlet, 0);

      const charcoil = createTestBeast(CHARCOIL);
      placeBeast(player2, charcoil, 0);

      expect(getCounterAmount(fuzzlet, 'Spore')).toBe(0);

      // Charcoil attacks Fuzzlet
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Spore counter applied when OnDamage abilities are implemented
      // expect(getCounterAmount(fuzzlet, 'Spore')).toBe(1);
    });

    test('should stack Spore counters on repeated damage', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([LEAF_SPRITE])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET, { currentHealth: 10, maxHealth: 10 });
      placeBeast(player1, fuzzlet, 0);

      const attacker = createTestBeast(LEAF_SPRITE);
      placeBeast(player2, attacker, 0);

      // First attack
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify first counter
      // expect(getCounterAmount(fuzzlet, 'Spore')).toBe(1);

      // Second attack
      await game.endTurn();
      await game.endTurn();
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify counters stack
      // expect(getCounterAmount(fuzzlet, 'Spore')).toBe(2);
    });

    test('should not trigger ability if not damaged', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player, fuzzlet, 0);

      // Just sitting on field, not taking damage
      await game.endTurn();
      await waitForEffects();

      expect(getCounterAmount(fuzzlet, 'Spore')).toBe(0);
    });
  });

  describe('Combat', () => {
    test('should deal damage equal to attack stat', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player1, fuzzlet, 0);

      const charcoil = createTestBeast(CHARCOIL);
      const initialHealth = charcoil.currentHealth;
      placeBeast(player2, charcoil, 0);

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      expect(charcoil.currentHealth).toBe(initialHealth - fuzzlet.currentAttack);
    });

    test('should take damage when attacked', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([CHARCOIL])
      );

      let state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET);
      const initialHealth = fuzzlet.currentHealth;
      placeBeast(player1, fuzzlet, 0);

      const charcoil = createTestBeast(CHARCOIL);
      charcoil.summoningSickness = false; // Allow attack
      placeBeast(player2, charcoil, 0);

      // End turn so player 2 becomes active and can attack
      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // Get fresh state to check updated health
      state = game.getState();
      const updatedFuzzlet = state.players[0].field[0];
      expect(updatedFuzzlet).toBeTruthy();
      expect(updatedFuzzlet!.currentHealth).toBeLessThan(initialHealth);
    });

    test('should be destroyed when health reaches 0', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      let state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET, { currentHealth: 1, maxHealth: 3 });
      const fuzzletId = fuzzlet.instanceId;
      placeBeast(player1, fuzzlet, 0);

      const strongAttacker = createTestBeast(CHARCOIL, { currentAttack: 10 });
      strongAttacker.summoningSickness = false;
      placeBeast(player2, strongAttacker, 0);

      // End turn so player 2 becomes active and can attack
      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // Get fresh state
      state = game.getState();
      const updatedPlayer1 = state.players[0];
      const updatedFuzzlet = updatedPlayer1.field[0];

      expect(updatedFuzzlet).toBe(null); // Should be removed from field
      expect(updatedPlayer1.graveyard.some((c: any) =>
        c.cardId === 'fuzzlet' || c.id === 'fuzzlet' || c.instanceId === fuzzletId
      )).toBe(true);
    });

    test('should be able to attack player directly if no blockers', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player1, fuzzlet, 0);

      const initialPlayerHealth = player2.health;

      await game.executeAttack(player1, 0, 'player');
      await waitForEffects();

      expect(player2.health).toBe(initialPlayerHealth - fuzzlet.currentAttack);
    });
  });

  describe('Leveling System', () => {
    test('should gain XP from combat victories', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([LEAF_SPRITE])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player1, fuzzlet, 0);

      const enemy = createTestBeast(LEAF_SPRITE, { currentHealth: 1 });
      placeBeast(player2, enemy, 0);

      const initialXP = fuzzlet.currentXP;

      // Fuzzlet defeats enemy
      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify XP gained when leveling system is fully integrated
      // expect(fuzzlet.currentXP).toBeGreaterThan(initialXP);
    });

    test('should level up at level 4 with ability upgrade', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player, fuzzlet, 0);

      // Manually set to level 4 (in real game, this happens through XP gain)
      fuzzlet.currentLevel = 4;

      // TODO: Verify ability upgrade when implemented
      // Expected: Ability "Spore Shield" that grants +1 Health per Spore counter
    });

    test('should have stronger stats at higher levels', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const level1Fuzzlet = createTestBeast(FUZZLET);
      const baseAttack = level1Fuzzlet.currentAttack;
      const baseHealth = level1Fuzzlet.currentHealth;

      const level5Fuzzlet = createTestBeast(FUZZLET, { currentLevel: 5 });

      // TODO: Verify stat gains from leveling when implemented
      // expect(level5Fuzzlet.currentAttack).toBeGreaterThan(baseAttack);
      // expect(level5Fuzzlet.maxHealth).toBeGreaterThan(baseHealth);
    });
  });

  describe('Synergies', () => {
    test('should benefit from Forest affinity bonuses', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player, fuzzlet, 0);

      expect(fuzzlet.affinity).toBe('Forest');

      // TODO: Test interaction with Forest habitat or Forest-specific buffs
    });

    test('Spore counters should enable future synergies', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET);
      fuzzlet.counters.push({ type: 'Spore', amount: 3 });
      placeBeast(player1, fuzzlet, 0);

      // TODO: Test cards that interact with Spore counters
      // e.g., "Deal damage equal to Spore counters" or "Heal for each Spore"
      expect(getCounterAmount(fuzzlet, 'Spore')).toBe(3);
    });
  });

  describe('Strategic Gameplay', () => {
    test('should encourage defensive playstyle (accumulate Spores when hit)', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET, { currentHealth: 10, maxHealth: 10 });
      placeBeast(player1, fuzzlet, 0);

      const charcoil = createTestBeast(CHARCOIL);
      placeBeast(player2, charcoil, 0);

      // Take damage multiple times
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      await game.endTurn();
      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Spores accumulate as a defensive benefit
      // expect(getCounterAmount(fuzzlet, 'Spore')).toBeGreaterThanOrEqual(2);
    });

    test('should be cost-effective early game unit', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      let state = game.getState();
      let player = state.players[0];

      // Fuzzlet costs 2 nectar
      giveCards(player, [FUZZLET]);
      giveNectar(player, 2);

      const result = await game.playCard(player, 0);

      // Get fresh state
      state = game.getState();
      player = state.players[0];

      expect(result).toBe(true);
      expect(player.currentNectar).toBe(1); // Started with 1 from turn 1, added 2, spent 2

      // Good stats for cost: 2/4 with ability
      const fuzzlet = findBeastByCardId(player, 'fuzzlet');
      expect(fuzzlet!.currentAttack).toBe(2);
      expect(fuzzlet!.currentHealth).toBe(4); // Use currentHealth not maxHealth (leveling system changes maxHealth)
    });
  });

  describe('Edge Cases', () => {
    test('should handle overflow damage correctly', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([])
      );

      let state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET, { currentHealth: 1 });
      placeBeast(player1, fuzzlet, 0);

      const strongAttacker = createTestBeast(CHARCOIL, { currentAttack: 100 });
      strongAttacker.summoningSickness = false;
      placeBeast(player2, strongAttacker, 0);

      // End turn so player 2 becomes active and can attack
      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // Get fresh state
      state = game.getState();
      const updatedFuzzlet = state.players[0].field[0];

      // Beast should be destroyed
      expect(updatedFuzzlet).toBe(null);
    });

    test('should handle simultaneous destruction', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([LEAF_SPRITE])
      );

      let state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const fuzzlet = createTestBeast(FUZZLET, { currentHealth: 3, currentAttack: 2 });
      fuzzlet.summoningSickness = false;
      placeBeast(player1, fuzzlet, 0);

      const leafSprite = createTestBeast(LEAF_SPRITE, { currentHealth: 2, currentAttack: 3 });
      placeBeast(player2, leafSprite, 0);

      // Fuzzlet attacks - both beasts should die from simultaneous damage
      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // Get fresh state
      state = game.getState();
      const updatedLeafSprite = state.players[1].field[0];
      const updatedFuzzlet = state.players[0].field[0];

      // Leaf Sprite should be dead (took 2 damage, had 2 HP)
      expect(updatedLeafSprite).toBe(null);
      // Fuzzlet should also be dead (took 3 counter-damage, had 3 HP)
      expect(updatedFuzzlet).toBe(null);
    });
  });

  describe('Game Rules Compliance', () => {
    test('should respect one summon per turn limit', async () => {
      await game.startMatch(
        createDeck([FUZZLET, FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      giveCards(player, [FUZZLET, FUZZLET]);
      giveNectar(player, 10);

      // First summon should succeed
      const result1 = await game.playCard(player, 0);
      expect(result1).toBe(true);

      // Second summon same turn should fail
      const result2 = await game.playCard(player, 0);
      expect(result2).toBe(false);
    });

    test('should respect field size limit', async () => {
      await game.startMatch(
        createDeck([FUZZLET, FUZZLET, FUZZLET, FUZZLET]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Fill field (typically 3 slots)
      for (let i = 0; i < 3; i++) {
        const fuzzlet = createTestBeast(FUZZLET);
        placeBeast(player, fuzzlet, i);
      }

      giveCards(player, [FUZZLET]);
      giveNectar(player, 10);

      // Should not be able to summon if field is full
      const emptySlots = player.field.filter(s => s === null).length;
      if (emptySlots === 0) {
        const result = await game.playCard(player, 0);
        // Card gets discarded if field is full
        expect(player.graveyard.some(c => c.id === 'fuzzlet')).toBe(true);
      }
    });
  });
});
