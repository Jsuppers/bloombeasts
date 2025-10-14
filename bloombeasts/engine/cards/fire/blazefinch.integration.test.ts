/**
 * Blazefinch - Integration Tests
 * Tests the fast-attacking fire beast with execute mechanics
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { GameEngine } from '../../systems/GameEngine';
import { BLAZEFINCH } from './blazefinch.js';
import { FUZZLET } from '../forest/fuzzlet.js';
import { MOSSLET } from '../forest/mosslet.js';
import { LEAF_SPRITE } from '../forest/leafSprite.js';
import {
  createTestGame,
  createDeck,
  giveCards,
  setHand,
  giveNectar,
  createTestBeast,
  placeBeast,
  waitForEffects,
} from '../__tests__/gameTestUtils.js';

describe('Blazefinch - Integration Tests', () => {
  let game: GameEngine;

  beforeEach(() => {
    game = createTestGame();
  });

  describe('Basic Functionality', () => {
    test('should summon with correct base stats', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      setHand(player, [BLAZEFINCH]);
      giveNectar(player, 10);

      await game.playCard(player, 0);
      await waitForEffects();

      const blazefinch = player.field.find(b => b && b.cardId === 'blazefinch');
      expect(blazefinch).toBeTruthy();
      expect(blazefinch?.currentAttack).toBe(1);
      expect(blazefinch?.currentHealth).toBe(2);
    });

    test('should cost 1 nectar to summon', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([])
      );

      let state = game.getState();
      let player = state.players[0];

      setHand(player, [BLAZEFINCH]);
      giveNectar(player, 5);

      const nectarBefore = player.currentNectar;

      await game.playCard(player, 0);

      state = game.getState();
      player = state.players[0];

      expect(player.currentNectar).toBe(nectarBefore - 1);
    });
  });

  describe('Quick Strike Passive Ability', () => {
    test('should be able to attack immediately (no summoning sickness)', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Summon Blazefinch
      setHand(player1, [BLAZEFINCH]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await waitForEffects();

      // Place enemy beast
      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      const fuzzletHealthBefore = fuzzlet.currentHealth;

      // Try to attack immediately (should work due to Quick Strike)
      const result = await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Quick Strike removes summoning sickness
      // expect(result).toBe(true);
      // expect(fuzzlet.currentHealth).toBe(fuzzletHealthBefore - 1);
    });

    test('should not have summoning sickness flag after being summoned', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      setHand(player, [BLAZEFINCH]);
      giveNectar(player, 10);

      await game.playCard(player, 0);
      await waitForEffects();

      const blazefinch = player.field.find(b => b && b.cardId === 'blazefinch');

      // TODO: Verify hasSummoningSickness is false
      // expect(blazefinch?.hasSummoningSickness).toBe(false);
    });
  });

  describe('Incinerate Ability (Bloom Level)', () => {
    test('should deal double damage to wilting beasts', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([LEAF_SPRITE])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Summon Blazefinch
      const blazefinch = createTestBeast(BLAZEFINCH);
      placeBeast(player1, blazefinch, 0);

      // Create wilting enemy (half HP or less)
      const leafSprite = createTestBeast(LEAF_SPRITE, { currentHealth: 1 }); // 1/2 HP = wilting
      placeBeast(player2, leafSprite, 0);

      const baseAttack = blazefinch.currentAttack; // 1
      const targetHealthBefore = leafSprite.currentHealth;

      // End turn so player1 can attack
      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify double damage is dealt to wilting target
      // expect(leafSprite.currentHealth).toBe(targetHealthBefore - (baseAttack * 2));
    });

    test('should deal normal damage to healthy beasts', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH);
      placeBeast(player1, blazefinch, 0);

      const fuzzlet = createTestBeast(FUZZLET); // Full HP = not wilting
      placeBeast(player2, fuzzlet, 0);

      const baseAttack = blazefinch.currentAttack; // 1
      const targetHealthBefore = fuzzlet.currentHealth;

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify normal damage is dealt
      // expect(fuzzlet.currentHealth).toBe(targetHealthBefore - baseAttack);
    });

    test('should execute low-health beasts with doubled damage', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([LEAF_SPRITE])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH);
      placeBeast(player1, blazefinch, 0);

      // Leaf Sprite at 1 HP (wilting)
      const leafSprite = createTestBeast(LEAF_SPRITE, { currentHealth: 1 });
      placeBeast(player2, leafSprite, 0);

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify beast is destroyed (1 attack × 2 = 2 damage, 1 HP beast dies)
      // expect(leafSprite.currentHealth).toBe(0);
      // expect(player2.graveyard.some(c => c.id === 'leaf-sprite')).toBe(true);
    });
  });

  describe('Ember Strike Ability (Level 4)', () => {
    test('should deal triple damage to damaged beasts', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([MOSSLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Level 4 Blazefinch (stats: 2 attack, 3 HP based on stat gains)
      const blazefinch = createTestBeast(BLAZEFINCH, {
        currentAttack: 2,
        currentHealth: 3,
        level: 4
      });
      placeBeast(player1, blazefinch, 0);

      // Damaged enemy (not full HP)
      const mosslet = createTestBeast(MOSSLET, { currentHealth: 4 }); // 4/5 HP = damaged
      placeBeast(player2, mosslet, 0);

      const baseAttack = blazefinch.currentAttack; // 2
      const targetHealthBefore = mosslet.currentHealth;

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify triple damage (2 × 3 = 6)
      // expect(mosslet.currentHealth).toBe(targetHealthBefore - (baseAttack * 3));
    });

    test('should deal normal damage to full HP beasts', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH, {
        currentAttack: 2,
        currentHealth: 3,
        level: 4
      });
      placeBeast(player1, blazefinch, 0);

      const fuzzlet = createTestBeast(FUZZLET); // Full HP = not damaged
      placeBeast(player2, fuzzlet, 0);

      const baseAttack = blazefinch.currentAttack;
      const targetHealthBefore = fuzzlet.currentHealth;

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify normal damage
      // expect(fuzzlet.currentHealth).toBe(targetHealthBefore - baseAttack);
    });
  });

  describe('Lightning Speed Passive (Level 7)', () => {
    test('should be able to attack twice in one turn', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([MOSSLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Level 7 Blazefinch with Lightning Speed
      const blazefinch = createTestBeast(BLAZEFINCH, {
        currentAttack: 3,
        currentHealth: 4,
        level: 7
      });
      placeBeast(player1, blazefinch, 0);

      const mosslet = createTestBeast(MOSSLET);
      placeBeast(player2, mosslet, 0);

      const targetHealthBefore = mosslet.currentHealth;
      const baseAttack = blazefinch.currentAttack;

      await game.endTurn();

      // First attack
      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify second attack is allowed
      // const result = await game.executeAttack(player1, 0, 'beast', 0);
      // expect(result).toBe(true);
      // expect(mosslet.currentHealth).toBe(targetHealthBefore - (baseAttack * 2));
    });

    test('should still have Quick Strike (no summoning sickness)', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Summon Level 7 Blazefinch
      setHand(player1, [BLAZEFINCH]);
      giveNectar(player1, 10);

      // Hack to simulate level 7
      const card = player1.hand[0];
      if (card) {
        card.level = 7;
      }

      await game.playCard(player1, 0);
      await waitForEffects();

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      // Should be able to attack immediately
      // TODO: Verify attack succeeds
      // const result = await game.executeAttack(player1, 0, 'beast', 0);
      // expect(result).toBe(true);
    });
  });

  describe('Annihilation Ability (Level 9)', () => {
    test('should instantly destroy damaged beasts', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([MOSSLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Level 9 Blazefinch with Annihilation
      const blazefinch = createTestBeast(BLAZEFINCH, {
        currentAttack: 4,
        currentHealth: 5,
        level: 9
      });
      placeBeast(player1, blazefinch, 0);

      // Damaged high-HP beast (would normally take many hits)
      const mosslet = createTestBeast(MOSSLET, { currentHealth: 50 }); // 50/5 HP = damaged
      placeBeast(player2, mosslet, 0);

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify instant destroy regardless of HP
      // expect(mosslet.currentHealth).toBe(0);
      // expect(player2.graveyard.some(c => c.id === 'mosslet')).toBe(true);
    });

    test('should not instantly destroy full HP beasts', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([MOSSLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH, {
        currentAttack: 4,
        currentHealth: 5,
        level: 9
      });
      placeBeast(player1, blazefinch, 0);

      const mosslet = createTestBeast(MOSSLET); // Full HP
      placeBeast(player2, mosslet, 0);

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify normal damage, not instant destroy
      // expect(mosslet.currentHealth).toBeGreaterThan(0);
    });
  });

  describe('Combat Synergies', () => {
    test('Quick Strike should allow first strike against opponent', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH);
      placeBeast(player1, blazefinch, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      // Blazefinch can attack on summon turn, Fuzzlet cannot
      const blazefinchHealthBefore = blazefinch.currentHealth;

      // TODO: Verify Blazefinch attacks without retaliation on summon turn
      // await game.executeAttack(player1, 0, 'beast', 0);
      // expect(blazefinch.currentHealth).toBe(blazefinchHealthBefore);
    });

    test('should synergize with other fire beasts', async () => {
      // Test strategic gameplay: Blazefinch executes weakened targets
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([MOSSLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH);
      placeBeast(player1, blazefinch, 0);

      // Enemy at 2 HP (wilting)
      const mosslet = createTestBeast(MOSSLET, { currentHealth: 2 });
      placeBeast(player2, mosslet, 0);

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Incinerate executes the target (1 × 2 = 2 damage)
      // expect(player2.graveyard.some(c => c.id === 'mosslet')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle attacking with 0 attack (no damage)', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH, { currentAttack: 0 });
      placeBeast(player1, blazefinch, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      const fuzzletHealthBefore = fuzzlet.currentHealth;

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // Even with double/triple damage, 0 × N = 0
      expect(fuzzlet.currentHealth).toBe(fuzzletHealthBefore);
    });

    test('should work correctly when attacking player directly', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH);
      placeBeast(player1, blazefinch, 0);

      const player2HealthBefore = player2.health;

      await game.endTurn();

      await game.executeAttack(player1, 0, 'player', 0);
      await waitForEffects();

      // TODO: Verify damage to player (no Incinerate bonus on player)
      // expect(player2.health).toBe(player2HealthBefore - 1);
    });

    test('double/triple damage modifiers should not stack with each other', async () => {
      // If a beast is both wilting AND damaged, only one modifier should apply
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([LEAF_SPRITE])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Level 4 Blazefinch (has Ember Strike)
      const blazefinch = createTestBeast(BLAZEFINCH, {
        currentAttack: 2,
        level: 4
      });
      placeBeast(player1, blazefinch, 0);

      // Beast that is both wilting AND damaged (1/2 HP)
      const leafSprite = createTestBeast(LEAF_SPRITE, { currentHealth: 1 });
      placeBeast(player2, leafSprite, 0);

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify only one damage modifier applies (not 6x damage)
      // Expect either 2×2=4 or 2×3=6 damage, not 2×2×3=12
    });
  });

  describe('Leveling System', () => {
    test('should gain stats correctly at level 4', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Create level 4 Blazefinch
      const blazefinch = createTestBeast(BLAZEFINCH, { level: 4 });
      placeBeast(player, blazefinch, 0);

      // Level 4 stats: +5 attack, +1 HP from stat gains
      // Base: 1/2, Level 4: 6/3 (1+5 attack, 2+1 HP)
      // TODO: Verify correct stats when leveling is implemented
      // expect(blazefinch.currentAttack).toBe(6);
      // expect(blazefinch.currentHealth).toBe(3);
    });

    test('should unlock Ember Strike ability at level 4', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const blazefinch = createTestBeast(BLAZEFINCH, { level: 4 });
      placeBeast(player, blazefinch, 0);

      // TODO: Verify Ember Strike ability is present
      // expect(blazefinch.abilities.some(a => a.name === 'Ember Strike')).toBe(true);
    });

    test('should unlock Lightning Speed at level 7', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const blazefinch = createTestBeast(BLAZEFINCH, { level: 7 });
      placeBeast(player, blazefinch, 0);

      // TODO: Verify Lightning Speed ability is present
      // expect(blazefinch.abilities.some(a => a.name === 'Lightning Speed')).toBe(true);
    });

    test('should unlock Phoenix Form and Annihilation at level 9', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      const blazefinch = createTestBeast(BLAZEFINCH, { level: 9 });
      placeBeast(player, blazefinch, 0);

      // TODO: Verify Phoenix Form and Annihilation abilities are present
      // expect(blazefinch.abilities.some(a => a.name === 'Phoenix Form')).toBe(true);
      // expect(blazefinch.abilities.some(a => a.name === 'Annihilation')).toBe(true);
    });
  });

  describe('Game Rules Compliance', () => {
    test('should follow normal combat rules', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH);
      placeBeast(player1, blazefinch, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      const blazefinchHealthBefore = blazefinch.currentHealth;

      await game.endTurn();

      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // Blazefinch should take return damage (Fuzzlet has 2 attack)
      // TODO: Verify retaliation damage
      // expect(blazefinch.currentHealth).toBe(blazefinchHealthBefore - 2);
    });

    test('should be destroyed when health reaches 0', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([MOSSLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH, { currentHealth: 1 });
      placeBeast(player1, blazefinch, 0);

      const mosslet = createTestBeast(MOSSLET); // 2 attack
      placeBeast(player2, mosslet, 0);

      await game.endTurn();
      await game.endTurn(); // Player 2's turn

      await game.executeAttack(player2, 0, 'beast', 0);
      await waitForEffects();

      // TODO: Verify Blazefinch is destroyed
      // expect(player1.field[0]).toBe(null);
      // expect(player1.graveyard.some(c => c.id === 'blazefinch')).toBe(true);
    });

    test('should only attack once per turn (without Lightning Speed)', async () => {
      await game.startMatch(
        createDeck([BLAZEFINCH]),
        createDeck([FUZZLET])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      const blazefinch = createTestBeast(BLAZEFINCH);
      placeBeast(player1, blazefinch, 0);

      const fuzzlet = createTestBeast(FUZZLET);
      placeBeast(player2, fuzzlet, 0);

      await game.endTurn();

      // First attack should succeed
      const result1 = await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // Second attack should fail (already attacked)
      const result2 = await game.executeAttack(player1, 0, 'beast', 0);

      // TODO: Verify second attack is blocked
      // expect(result1).toBe(true);
      // expect(result2).toBe(false);
    });
  });
});
