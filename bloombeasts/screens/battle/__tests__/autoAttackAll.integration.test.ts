/**
 * Integration Tests for autoAttackAll State Refresh
 *
 * These tests verify the critical bug fix in BattleUI.ts:372-380
 * where field state must be refreshed INSIDE the attack loop.
 *
 * CRITICAL BUG: State was cached before loop, causing attacks to target dead beasts
 * FIX: Moved getPlayerField() and getOpponentField() calls INSIDE the loop
 */

import { BattleController } from '../engine/core/BattleController';
import {
  mockAsync,
  createTestBeast,
  setupBattleScenario,
  executeAutoAttackAll,
  endTurnAndReposition,
  type BattleScenario
} from './testHarness';

describe('autoAttackAll - State Refresh Integration Tests', () => {
  let controller: BattleController;

  beforeEach(() => {
    controller = new BattleController(mockAsync);
  });

  describe('REGRESSION TEST: State Refresh Bug', () => {
    test('should hit player health when beast dies mid-loop (3v1 scenario)', async () => {
      // This is THE test that catches the bug we fixed
      // Setup: 3 strong player beasts vs 1 weak opponent beast at slot 0
      // Expected: Attack 1 kills beast, attacks 2-3 should hit player health (not dead beast)
      // Bug behavior: Attacks 2-3 would target the dead beast (cached state)
      // Fix behavior: Attacks 2-3 hit player health (refreshed state)

      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p0', 'Strong 0', 5, 5, false),
          createTestBeast('p1', 'Strong 1', 5, 5, false),
          createTestBeast('p2', 'Strong 2', 5, 5, false),
        ],
        opponentBeasts: [
          createTestBeast('o0', 'Weak', 1, 1, false), // Dies from first 5-damage attack
        ],
      };

      const battle = setupBattleScenario(controller, scenario);
      const initialOpponentHealth = battle.getOpponentHealth();

      // Execute auto-attack-all
      await executeAutoAttackAll(controller, 'player');

      // End turn to trigger repositioning
      endTurnAndReposition(controller, 'player');

      // Verify final state
      const finalOpponentField = battle.getOpponentField();
      const finalOpponentHealth = battle.getOpponentHealth();

      // ASSERTION 1: Opponent beast should be dead
      expect(finalOpponentField.beasts[0]).toBeNull();

      // ASSERTION 2: Opponent health reduced by 10 (attacks 2-3 each do 5 damage)
      // This is the CRITICAL test - with the bug, health would be unchanged
      expect(finalOpponentHealth).toBeLessThan(initialOpponentHealth);
      expect(finalOpponentHealth).toBe(initialOpponentHealth - 10);
    });

    test('should handle cascading deaths (3v1 with multiple weak opponents)', async () => {
      // With DEFERRED repositioning: Beasts stay in slots until end of turn
      // i=0: p0 (slot 0) attacks o0 (slot 0) → o0 dies, p0 takes 2 damage → Player:[p0(1hp),p1,p2], Opponent:[null,o1,o2]
      // i=1: p1 (slot 1) attacks o1 (slot 1) → o1 dies, p1 takes 2 damage → Player:[p0(1hp),p1(1hp),p2], Opponent:[null,null,o2]
      // i=2: p2 (slot 2) attacks o2 (slot 2) → o2 dies, p2 takes 2 damage → Player:[p0(1hp),p1(1hp),p2(1hp)], Opponent:[null,null,null]
      // End turn: Reposition → All opponent beasts are dead
      // Result: All player beasts survive with 1hp, all opponent beasts die

      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p0', 'Strong 0', 3, 3, false),
          createTestBeast('p1', 'Strong 1', 3, 3, false),
          createTestBeast('p2', 'Strong 2', 3, 3, false),
        ],
        opponentBeasts: [
          createTestBeast('o0', 'Weak 0', 2, 2, false),
          createTestBeast('o1', 'Weak 1', 2, 2, false),
          createTestBeast('o2', 'Weak 2', 2, 2, false),
        ],
      };

      const battle = setupBattleScenario(controller, scenario);

      await executeAutoAttackAll(controller, 'player');

      // End turn to trigger repositioning
      endTurnAndReposition(controller, 'player');

      const finalOpponentField = battle.getOpponentField();

      // All opponent beasts are dead with deferred repositioning
      expect(finalOpponentField.beasts[0]).toBeNull();
      expect(finalOpponentField.beasts[1]).toBeNull();
      expect(finalOpponentField.beasts[2]).toBeNull();
    });

    test('should handle partial deaths (first beast dies, others survive)', async () => {
      // With DEFERRED repositioning: Beasts stay in slots until end of turn
      // i=0: p0 (slot 0) attacks o0 (slot 0) → o0 dies → Opponent:[null,o1,o2]
      // i=1: p1 (slot 1) attacks o1 (slot 1) → o1 takes 3 damage → Opponent:[null,o1(7hp),o2]
      // i=2: p2 (slot 2) attacks o2 (slot 2) → o2 takes 3 damage → Opponent:[null,o1(7hp),o2(7hp)]
      // End turn: Reposition → [o1(7hp), o2(7hp), null]
      // Result: o1 and o2 both have 7hp after repositioning

      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p0', 'Attacker 0', 3, 3, false),
          createTestBeast('p1', 'Attacker 1', 3, 3, false),
          createTestBeast('p2', 'Attacker 2', 3, 3, false),
        ],
        opponentBeasts: [
          createTestBeast('o0', 'Weak', 2, 2, false), // Dies (3 damage)
          createTestBeast('o1', 'Strong', 10, 10, false), // Survives with 7hp
          createTestBeast('o2', 'Strong', 10, 10, false), // Survives with 7hp
        ],
      };

      const battle = setupBattleScenario(controller, scenario);

      await executeAutoAttackAll(controller, 'player');

      // End turn to trigger repositioning
      endTurnAndReposition(controller, 'player');

      const finalOpponentField = battle.getOpponentField();

      // After repositioning: o1 in slot 0 (damaged), o2 in slot 1 (damaged)
      expect(finalOpponentField.beasts[0]?.name).toBe('Strong');
      expect(finalOpponentField.beasts[0]?.currentHealth).toBe(7); // o1 damaged: 10 - 3
      expect(finalOpponentField.beasts[1]?.name).toBe('Strong');
      expect(finalOpponentField.beasts[1]?.currentHealth).toBe(7); // o2 damaged: 10 - 3
      expect(finalOpponentField.beasts[2]).toBeNull();
    });
  });

  describe('Empty Slot Scenarios', () => {
    test('3v0 - all attacks hit player health', async () => {
      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p0', 'A0', 4, 4, false),
          createTestBeast('p1', 'A1', 4, 4, false),
          createTestBeast('p2', 'A2', 4, 4, false),
        ],
        opponentBeasts: [],
      };

      const battle = setupBattleScenario(controller, scenario);
      const initialHealth = battle.getOpponentHealth();

      await executeAutoAttackAll(controller, 'player');

      const finalHealth = battle.getOpponentHealth();

      // All 3 attacks (4 damage each) = 12 damage total
      expect(finalHealth).toBe(initialHealth - 12);
    });

    test('2v0 with one summoning sick beast', async () => {
      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p0', 'Ready', 5, 5, false),
          createTestBeast('p1', 'Sick', 5, 5, true), // Can't attack
          createTestBeast('p2', 'Ready', 5, 5, false),
        ],
        opponentBeasts: [],
      };

      const battle = setupBattleScenario(controller, scenario);
      const initialHealth = battle.getOpponentHealth();

      await executeAutoAttackAll(controller, 'player');

      const finalHealth = battle.getOpponentHealth();

      // Only 2 attacks (beast 1 has summoning sickness)
      expect(finalHealth).toBe(initialHealth - 10);
    });

    test('1v0 with beasts in different slots', async () => {
      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p0', 'Slot0', 3, 3, false),
          createTestBeast('p1', 'Slot1', 3, 3, false),
          createTestBeast('p2', 'Slot2', 3, 3, false),
        ],
        opponentBeasts: [
          createTestBeast('o0', 'OnlySlot1', 1, 1, false),
        ], // Only in slot 0
      };

      const battle = setupBattleScenario(controller, scenario);
      const initialHealth = battle.getOpponentHealth();

      await executeAutoAttackAll(controller, 'player');

      // End turn to trigger repositioning
      endTurnAndReposition(controller, 'player');

      const finalOpponentField = battle.getOpponentField();
      const finalHealth = battle.getOpponentHealth();

      // Beast at slot 0 should be dead
      expect(finalOpponentField.beasts[0]).toBeNull();

      // Attacks from slots 1 and 2 hit health (6 damage)
      expect(finalHealth).toBe(initialHealth - 6);
    });
  });

  describe('Mutual Destruction Scenarios', () => {
    test('1v1 equal stats - both die', async () => {
      const scenario: BattleScenario = {
        playerBeasts: [createTestBeast('p0', 'P', 2, 2, false)],
        opponentBeasts: [createTestBeast('o0', 'O', 2, 2, false)],
      };

      const battle = setupBattleScenario(controller, scenario);

      await executeAutoAttackAll(controller, 'player');

      // End turn to trigger repositioning
      endTurnAndReposition(controller, 'player');

      const finalPlayerField = battle.getPlayerField();
      const finalOpponentField = battle.getOpponentField();

      // Both dead from mutual destruction
      expect(finalPlayerField.beasts[0]).toBeNull();
      expect(finalOpponentField.beasts[0]).toBeNull();
    });

    test('3v3 cascade - all 6 beasts die', async () => {
      // With DEFERRED repositioning (at end of turn):
      // i=0: p0(slot 0) vs o0(slot 0) → mutual kill → Player:[null,p1,p2], Opponent:[null,o1,o2] (not shifted yet)
      // i=1: p1(slot 1) vs o1(slot 1) → mutual kill → Player:[null,null,p2], Opponent:[null,null,o2]
      // i=2: p2(slot 2) vs o2(slot 2) → mutual kill → Player:[null,null,null], Opponent:[null,null,null]
      // End turn: Reposition → Player:[null,null,null], Opponent:[null,null,null]
      // Result: All beasts die!

      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p0', 'P0', 1, 1, false),
          createTestBeast('p1', 'P1', 1, 1, false),
          createTestBeast('p2', 'P2', 1, 1, false),
        ],
        opponentBeasts: [
          createTestBeast('o0', 'O0', 1, 1, false),
          createTestBeast('o1', 'O1', 1, 1, false),
          createTestBeast('o2', 'O2', 1, 1, false),
        ],
      };

      const battle = setupBattleScenario(controller, scenario);

      await executeAutoAttackAll(controller, 'player');

      // End turn to trigger repositioning
      endTurnAndReposition(controller, 'player');

      const finalPlayerField = battle.getPlayerField();
      const finalOpponentField = battle.getOpponentField();

      // With deferred repositioning, all beasts die (each slot attacks its opposite slot)
      expect(finalPlayerField.beasts[0]).toBeNull();
      expect(finalPlayerField.beasts[1]).toBeNull();
      expect(finalPlayerField.beasts[2]).toBeNull();
      expect(finalOpponentField.beasts[0]).toBeNull();
      expect(finalOpponentField.beasts[1]).toBeNull();
      expect(finalOpponentField.beasts[2]).toBeNull();
    });

    test('2v2 asymmetric - strong vs weak', async () => {
      // With DEFERRED repositioning:
      // i=0: p0(10/10) vs o0(1/1) → o0 dies, p0 takes 1 damage → Player:[p0(9hp),p1,null], Opponent:[null,o1,null] (NOT shifted yet)
      // i=1: p1(10/10) vs o1(slot 1) → o1 dies, p1 takes 1 damage → Player:[p0(9hp),p1(9hp),null], Opponent:[null,null,null]
      // i=2: null vs null → skip
      // End turn: Reposition → Player:[p0(9hp),p1(9hp),null], Opponent:[null,null,null]
      // Result: Both player beasts survive with 9hp each, both opponent beasts die

      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p0', 'Strong', 10, 10, false),
          createTestBeast('p1', 'Strong', 10, 10, false),
        ],
        opponentBeasts: [
          createTestBeast('o0', 'Weak', 1, 1, false),
          createTestBeast('o1', 'Weak', 1, 1, false),
        ],
      };

      const battle = setupBattleScenario(controller, scenario);

      await executeAutoAttackAll(controller, 'player');

      // End turn to trigger repositioning
      endTurnAndReposition(controller, 'player');

      const finalPlayerField = battle.getPlayerField();
      const finalOpponentField = battle.getOpponentField();

      // Player beasts survive, both took 1 damage
      expect(finalPlayerField.beasts[0]).not.toBeNull();
      expect(finalPlayerField.beasts[0]?.currentHealth).toBe(9); // p0 took 1 damage from o0
      expect(finalPlayerField.beasts[1]).not.toBeNull();
      expect(finalPlayerField.beasts[1]?.currentHealth).toBe(9); // p1 took 1 damage from o1

      // Both opponent beasts are dead
      expect(finalOpponentField.beasts[0]).toBeNull();
      expect(finalOpponentField.beasts[1]).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    test('empty field - no attacks', async () => {
      const scenario: BattleScenario = {
        playerBeasts: [],
        opponentBeasts: [],
      };

      const battle = setupBattleScenario(controller, scenario);
      const initialHealth = battle.getOpponentHealth();

      await executeAutoAttackAll(controller, 'player');

      const finalHealth = battle.getOpponentHealth();

      // No damage (no beasts to attack)
      expect(finalHealth).toBe(initialHealth);
    });

    test('all beasts have summoning sickness', async () => {
      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p0', 'Sick0', 5, 5, true),
          createTestBeast('p1', 'Sick1', 5, 5, true),
          createTestBeast('p2', 'Sick2', 5, 5, true),
        ],
        opponentBeasts: [],
      };

      const battle = setupBattleScenario(controller, scenario);
      const initialHealth = battle.getOpponentHealth();

      await executeAutoAttackAll(controller, 'player');

      const finalHealth = battle.getOpponentHealth();

      // No damage (all beasts have summoning sickness)
      expect(finalHealth).toBe(initialHealth);
    });

    test('only middle slot has beast', async () => {
      const scenario: BattleScenario = {
        playerBeasts: [
          createTestBeast('p1', 'Middle', 7, 7, false),
        ],
        opponentBeasts: [],
      };

      const battle = setupBattleScenario(controller, scenario);

      // Manually place in slot 1 (middle)
      const playerField = battle.getPlayerField();
      playerField.beasts[0] = null;
      playerField.beasts[1] = createTestBeast('p1', 'Middle', 7, 7, false);
      playerField.beasts[2] = null;

      const initialHealth = battle.getOpponentHealth();

      await executeAutoAttackAll(controller, 'player');

      const finalHealth = battle.getOpponentHealth();

      // Only middle beast attacks (7 damage)
      expect(finalHealth).toBe(initialHealth - 7);
    });
  });
});
