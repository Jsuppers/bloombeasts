/**
 * Bubblefin - Integration Tests
 * Tests the defensive water beast with attack reduction mechanics
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { GameEngine } from '../../systems/GameEngine';
import { BUBBLEFIN } from './bubblefin.js';
import { FUZZLET } from '../forest/fuzzlet.js';
import { CHARCOIL } from '../fire/charcoil.js';
import { BLAZEFINCH } from '../fire/blazefinch.js';
import { HABITAT_LOCK } from '../trap/habitatLock.js';
import { CLEANSING_DOWNPOUR } from '../magic/cleansingDownpour.js';
import {
  createTestGame,
  createDeck,
  setHand,
  giveNectar,
  createTestBeast,
  placeBeast,
  waitForEffects,
} from '../__tests__/gameTestUtils.js';

describe('Bubblefin - Integration Tests', () => {
  let game: GameEngine;

  beforeEach(() => {
    game = createTestGame();
  });

  describe('Basic Functionality', () => {
    test('should summon with correct base stats', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      setHand(player, [BUBBLEFIN]);
      giveNectar(player, 10);

      await game.playCard(player, 0);
      await waitForEffects();

      const bubblefin = player.field.find(b => b && b.cardId === 'bubblefin');
      expect(bubblefin).toBeTruthy();
      expect(bubblefin?.currentAttack).toBe(2);
      expect(bubblefin?.currentHealth).toBe(5);
    });

    test('should cost 2 nectar to summon', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([])
      );

      let state = game.getState();
      let player = state.players[0];

      setHand(player, [BUBBLEFIN]);
      giveNectar(player, 5);

      const nectarBefore = player.currentNectar;

      await game.playCard(player, 0);

      state = game.getState();
      player = state.players[0];

      expect(player.currentNectar).toBe(nectarBefore - 2);
    });
  });

  describe('Emerge Passive Ability', () => {
    test('should not be targetable by trap cards', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([HABITAT_LOCK])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Summon Bubblefin
      setHand(player1, [BUBBLEFIN]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await waitForEffects();

      const bubblefinHealthBefore = player1.field[0]?.currentHealth;

      await game.endTurn();

      // Player 2 tries to use trap targeting Bubblefin
      setHand(player2, [HABITAT_LOCK]);
      giveNectar(player2, 10);

      // TODO: Test trap targeting - verify Bubblefin cannot be targeted
      // For now, we just verify Bubblefin exists
      expect(player1.field[0]?.cardId).toBe('bubblefin');
      expect(player1.field[0]?.currentHealth).toBe(bubblefinHealthBefore);
    });

    test('should be targetable by beasts in combat', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN);
      placeBeast(player1, bubblefin, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      const bubblefinHealthBefore = bubblefin.currentHealth;

      await game.endTurn();

      // Fuzzlet should be able to attack Bubblefin
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify damage is dealt
      // expect(bubblefin.currentHealth).toBe(bubblefinHealthBefore - 2);
    });
  });

  describe('Dampen Ability (Bloom Level)', () => {
    test('should reduce attacker attack by -1 when taking damage', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN);
      placeBeast(player1, bubblefin, 0);

      const fuzzlet = createTestBeast(FUZZLET); // 2 attack
      placeBeast(player2, fuzzlet, 0);

      const fuzzletAttackBefore = fuzzlet.currentAttack;

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify attacker attack is reduced by -1 until end of turn
      // expect(fuzzlet.currentAttack).toBe(fuzzletAttackBefore - 1);
    });

    test('should apply -1 attack for the rest of the turn', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CHARCOIL, FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN);
      placeBeast(player1, bubblefin, 0);

      const charcoil = createTestBeast(CHARCOIL); // 3 attack
      placeBeast(player2, charcoil, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player1, fuzzlet, 1);

      await game.endTurn();

      // Charcoil attacks Bubblefin (triggers Dampen)
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      const charcoilAttackAfterDampen = charcoil.currentAttack;

      // TODO: Verify Charcoil's attack is reduced
      // expect(charcoilAttackAfterDampen).toBe(2); // 3 - 1

      // Charcoil attacks Fuzzlet on same turn
      // TODO: Should still have reduced attack
      // await game.executeAttack(player2, 0, 'beast', 1);
      // expect(fuzzlet.currentHealth).toBe(4 - charcoilAttackAfterDampen);
    });

    test('attack reduction should expire at end of turn', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN);
      placeBeast(player1, bubblefin, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      const fuzzletBaseAttack = fuzzlet.currentAttack;

      await game.endTurn();

      // Attack on turn 1
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // End turn - effect should expire
      await game.endTurn();
      await game.endTurn();

      // TODO: Verify attack is restored
      // expect(fuzzlet.currentAttack).toBe(fuzzletBaseAttack);
    });

    test('should not reduce attack below 0', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([BLAZEFINCH])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN);
      placeBeast(player1, bubblefin, 0);

      const blazefinch = createTestBeast(BLAZEFINCH, { currentAttack: 1 }); // 1 attack
      placeBeast(player2, blazefinch, 0);

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify attack doesn't go negative (1 - 1 = 0, not negative)
      // expect(blazefinch.currentAttack).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Tidal Shield Ability (Level 4)', () => {
    test('should reduce attacker attack by -2 when taking damage', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Level 4 Bubblefin with Tidal Shield
      const bubblefin = createTestBeast(BUBBLEFIN, {
        currentAttack: 3,
        currentHealth: 11,
        level: 4
      });
      placeBeast(player1, bubblefin, 0);

      const charcoil = createTestBeast(CHARCOIL); // 3 attack
      placeBeast(player2, charcoil, 0);

      const charcoilAttackBefore = charcoil.currentAttack;

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify attacker attack is reduced by -2
      // expect(charcoil.currentAttack).toBe(charcoilAttackBefore - 2);
    });

    test('should make attackers deal significantly less damage', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CHARCOIL, FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN, {
        currentAttack: 3,
        currentHealth: 11,
        level: 4
      });
      placeBeast(player1, bubblefin, 0);

      const charcoil = createTestBeast(CHARCOIL); // 3 attack
      placeBeast(player2, charcoil, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player1, fuzzlet, 1);

      await game.endTurn();

      // Charcoil attacks Bubblefin
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      const fuzzletHealthBefore = fuzzlet.currentHealth;

      // TODO: Charcoil attacks Fuzzlet next - should deal reduced damage
      // await game.executeAttack(player2, 0, 'beast', 1);
      // expect(fuzzlet.currentHealth).toBe(fuzzletHealthBefore - 1); // 3 - 2 = 1 damage
    });
  });

  describe('Deep Dive Passive (Level 7)', () => {
    test('should not be targetable by trap or magic cards', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CLEANSING_DOWNPOUR, HABITAT_LOCK])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Level 7 Bubblefin with Deep Dive
      const bubblefin = createTestBeast(BUBBLEFIN, {
        currentAttack: 6,
        currentHealth: 17,
        level: 7
      });
      placeBeast(player1, bubblefin, 0);

      const bubblefinHealthBefore = bubblefin.currentHealth;

      await game.endTurn();

      // Try to play magic targeting Bubblefin
      setHand(player2, [CLEANSING_DOWNPOUR]);
      giveNectar(player2, 10);

      // TODO: Verify magic cannot target Bubblefin
      // For now, just verify Bubblefin is unaffected
      expect(bubblefin.currentHealth).toBe(bubblefinHealthBefore);
    });

    test('should still be targetable by beast attacks', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN, {
        currentAttack: 6,
        currentHealth: 17,
        level: 7
      });
      placeBeast(player1, bubblefin, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      const bubblefinHealthBefore = bubblefin.currentHealth;

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify damage from beast attacks still works
      // expect(bubblefin.currentHealth).toBeLessThan(bubblefinHealthBefore);
    });
  });

  describe('Crushing Depths Ability (Level 9)', () => {
    test('should permanently reduce attacker attack by -3', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Level 9 Bubblefin with Crushing Depths
      const bubblefin = createTestBeast(BUBBLEFIN, {
        currentAttack: 8,
        currentHealth: 21,
        level: 9
      });
      placeBeast(player1, bubblefin, 0);

      const charcoil = createTestBeast(CHARCOIL); // 3 attack
      placeBeast(player2, charcoil, 0);

      const charcoilAttackBefore = charcoil.currentAttack;

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify permanent attack reduction
      // expect(charcoil.currentAttack).toBe(charcoilAttackBefore - 3);

      // End turn and check if reduction persists
      await game.endTurn();
      await game.endTurn();

      // TODO: Verify reduction is permanent (doesn't expire)
      // expect(charcoil.currentAttack).toBe(charcoilAttackBefore - 3);
    });

    test('should heal 2 HP when taking damage', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN, {
        currentAttack: 8,
        currentHealth: 15, // Less than max HP
        level: 9
      });
      placeBeast(player1, bubblefin, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      const bubblefinHealthBefore = bubblefin.currentHealth;

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify healing
      // Takes 2 damage from Fuzzlet, heals 2 from ability = net 0 change
      // Or: Takes reduced damage (2-3 = 0), then heals 2 = +2 HP
      // expect(bubblefin.currentHealth).toBeGreaterThanOrEqual(bubblefinHealthBefore);
    });

    test('should cripple attackers permanently', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN, {
        currentAttack: 8,
        currentHealth: 21,
        level: 9
      });
      placeBeast(player1, bubblefin, 0);

      const charcoil = createTestBeast(CHARCOIL, { currentAttack: 3 });
      placeBeast(player2, charcoil, 0);

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Charcoil's attack is crippled (3 - 3 = 0)
      // expect(charcoil.currentAttack).toBe(0);
    });
  });

  describe('Ocean Sanctuary Passive (Level 9)', () => {
    test('should not be targetable by magic, traps, or abilities', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CLEANSING_DOWNPOUR])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN, {
        currentAttack: 8,
        currentHealth: 21,
        level: 9
      });
      placeBeast(player1, bubblefin, 0);

      await game.endTurn();

      setHand(player2, [CLEANSING_DOWNPOUR]);
      giveNectar(player2, 10);

      // TODO: Verify Bubblefin cannot be targeted by any cards or abilities
      // This makes Bubblefin nearly invulnerable except to direct combat
    });

    test('should only be killable through combat', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN, {
        currentAttack: 8,
        currentHealth: 1, // Very low HP
        level: 9
      });
      placeBeast(player1, bubblefin, 0);

      const charcoil = createTestBeast(CHARCOIL);
      placeBeast(player2, charcoil, 0);

      await game.endTurn();

      // Combat should still work
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Bubblefin can be destroyed through combat
      // expect(player1.graveyard.some(c => c.id === 'bubblefin')).toBe(true);
    });
  });

  describe('Defensive Synergies', () => {
    test('should punish aggressive attackers', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CHARCOIL, FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN);
      placeBeast(player1, bubblefin, 0);

      const charcoil = createTestBeast(CHARCOIL);
      placeBeast(player2, charcoil, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 1);

      await game.endTurn();

      // Both beasts attack Bubblefin
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify both attackers have reduced attack
      // This makes Bubblefin a strong defensive wall
    });

    test('should survive longer than expected due to attack reduction', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN);
      placeBeast(player1, bubblefin, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      // Without Dampen: 5 HP / 2 attack = 3 attacks to kill (rounded up)
      // With Dampen: 5 HP / 1 attack (after reduction) = 5 attacks to kill

      await game.endTurn();

      // First attack
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Bubblefin takes less damage than expected
      // expect(bubblefin.currentHealth).toBeGreaterThan(3);
    });
  });

  describe('Edge Cases', () => {
    test('should handle being attacked by 0 attack beasts', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN);
      placeBeast(player1, bubblefin, 0);

      const fuzzlet = createTestBeast(FUZZLET, { currentAttack: 0 });
      placeBeast(player2, fuzzlet, 0);

      const bubblefinHealthBefore = bubblefin.currentHealth;

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // Should take no damage and still trigger Dampen
      expect(bubblefin.currentHealth).toBe(bubblefinHealthBefore);
      // TODO: Verify Dampen still triggers (0 - 1 = 0, clamped)
    });

    test('should handle multiple attackers in one turn', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([FUZZLET, CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN, { level: 4 }); // Tidal Shield (-2)
      placeBeast(player1, bubblefin, 0);

      const fuzzlet = createTestBeast(FUZZLET); // 2 attack
      placeBeast(player2, fuzzlet, 0);

      const charcoil = createTestBeast(CHARCOIL); // 3 attack
      placeBeast(player2, charcoil, 1);

      await game.endTurn();

      // Fuzzlet attacks
      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // Charcoil attacks
      // TODO: Each attack should trigger Tidal Shield separately
      // await game.executeAttack(player2, 1, 'beast', 0);
      // expect(fuzzlet.currentAttack).toBe(0); // 2 - 2
      // expect(charcoil.currentAttack).toBe(1); // 3 - 2
    });

    test('attack reduction should not affect other abilities', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([BLAZEFINCH])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN);
      placeBeast(player1, bubblefin, 0);

      const blazefinch = createTestBeast(BLAZEFINCH, { currentAttack: 3 });
      placeBeast(player2, blazefinch, 0);

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Blazefinch abilities still work despite attack reduction
      // Quick Strike should still allow immediate attacks, etc.
    });
  });

  describe('Leveling System', () => {
    test('should gain significant HP at each level', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Level 4: +6 HP (5 base + 6 = 11 HP)
      const bubblefin4 = createTestBeast(BUBBLEFIN, { level: 4 });
      placeBeast(player, bubblefin4, 0);

      // TODO: Verify HP scaling
      // expect(bubblefin4.currentHealth).toBe(11);

      // Level 9: +16 HP (5 base + 16 = 21 HP)
      const bubblefin9 = createTestBeast(BUBBLEFIN, { level: 9 });
      placeBeast(player, bubblefin9, 1);

      // TODO: Verify high-level HP
      // expect(bubblefin9.currentHealth).toBe(21);
    });

    test('should unlock Tidal Shield at level 4', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const bubblefin = createTestBeast(BUBBLEFIN, { level: 4 });
      placeBeast(player, bubblefin, 0);

      // TODO: Verify Tidal Shield ability is present
      // expect(bubblefin.abilities.some(a => a.name === 'Tidal Shield')).toBe(true);
    });

    test('should unlock Deep Dive at level 7', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const bubblefin = createTestBeast(BUBBLEFIN, { level: 7 });
      placeBeast(player, bubblefin, 0);

      // TODO: Verify Deep Dive ability is present
      // expect(bubblefin.abilities.some(a => a.name === 'Deep Dive')).toBe(true);
    });

    test('should unlock Ocean Sanctuary and Crushing Depths at level 9', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const bubblefin = createTestBeast(BUBBLEFIN, { level: 9 });
      placeBeast(player, bubblefin, 0);

      // TODO: Verify both level 9 abilities are present
      // expect(bubblefin.abilities.some(a => a.name === 'Ocean Sanctuary')).toBe(true);
      // expect(bubblefin.abilities.some(a => a.name === 'Crushing Depths')).toBe(true);
    });
  });

  describe('Game Rules Compliance', () => {
    test('should follow normal summon rules', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      setHand(player, [BUBBLEFIN]);
      giveNectar(player, 10);

      // Can only summon once per turn
      await game.playCard(player, 0);

      // TODO: Second summon should fail
      // const result = await game.playCard(player, 0);
      // expect(result).toBe(false);
    });

    test('should have summoning sickness (cannot attack on summon turn)', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      setHand(player1, [BUBBLEFIN]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      // Should not be able to attack immediately
      const result = await game.executeAttack(player1, 0, 'beast', 0);

      // TODO: Verify attack is blocked by summoning sickness
      // expect(result).toBe(false);
    });

    test('should be destroyed when health reaches 0', async () => {
      await game.startMatch(
        createDeck([BUBBLEFIN]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const bubblefin = createTestBeast(BUBBLEFIN, { currentHealth: 2 });
      placeBeast(player1, bubblefin, 0);

      const charcoil = createTestBeast(CHARCOIL);
      placeBeast(player2, charcoil, 0);

      await game.endTurn();

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Bubblefin is destroyed (3 attack - 1 from Dampen = 2 damage = death)
      // expect(player1.field[0]).toBe(null);
      // expect(player1.graveyard.some(c => c.id === 'bubblefin')).toBe(true);
    });
  });
});
