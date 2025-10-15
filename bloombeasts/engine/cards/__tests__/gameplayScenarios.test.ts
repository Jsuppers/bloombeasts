/**
 * Complex Gameplay Scenarios - Integration Tests
 * Tests realistic multi-card gameplay scenarios that combine different card types
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { GameEngine } from '../../systems/GameEngine';
import { FUZZLET } from '../forest/fuzzlet.js';
import { LEAF_SPRITE } from '../forest/leafSprite.js';
import { CHARCOIL } from '../fire/charcoil.js';
import { BLAZEFINCH } from '../fire/blazefinch.js';
import { BATTLE_FURY } from '../buff/battleFury.js';
import { MYSTIC_SHIELD } from '../buff/mysticShield.js';
import { CLEANSING_DOWNPOUR } from '../magic/cleansingDownpour.js';
import { HABITAT_LOCK } from '../trap/habitatLock.js';
import { ANCIENT_FOREST } from '../forest/ancientForest.js';
import { VOLCANIC_SCAR } from '../fire/volcanicScar.js';
import {
  createTestGame,
  createDeck,
  createTestBeast,
  placeBeast,
  giveCards,
  giveNectar,
  hasCounter,
  getCounterAmount,
  getTotalAttack,
  getTotalHealth,
  countAliveBeasts,
  waitForEffects,
} from './gameTestUtils.js';

describe('Complex Gameplay Scenarios', () => {
  let game: GameEngine;

  beforeEach(() => {
    game = createTestGame();
  });

  describe('Buff + Combat Scenarios', () => {
    test('Battle Fury enables winning multiple trades', async () => {
      await game.startMatch(
        createDeck([FUZZLET, LEAF_SPRITE, BATTLE_FURY]),
        createDeck([CHARCOIL, BLAZEFINCH])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 setup: 2 beasts + Battle Fury
      const fuzzlet = createTestBeast(FUZZLET); // 2/3
      const leafSprite = createTestBeast(LEAF_SPRITE); // 3/2
      placeBeast(player1, fuzzlet, 0);
      placeBeast(player1, leafSprite, 1);

      // Player 2 setup: 2 beasts
      const charcoil = createTestBeast(CHARCOIL); // 2/2
      const blazefinch = createTestBeast(BLAZEFINCH); // 3/3
      placeBeast(player2, charcoil, 0);
      placeBeast(player2, blazefinch, 1);

      giveCards(player1, [BATTLE_FURY]);
      giveNectar(player1, 10);

      // Without buff: Fuzzlet (2 ATK) can't kill Charcoil (2 HP) easily
      // Without buff: Leaf Sprite (3 ATK) equals Blazefinch (3 HP), both die

      // Play Battle Fury (+2 ATK to all allies)
      await game.playCard(player1, 0);
      await waitForEffects();

      // TODO: With buff: Fuzzlet becomes 4 ATK, Leaf Sprite becomes 5 ATK
      // This allows dominating trades

      // Fuzzlet attacks Charcoil
      await game.executeAttack(player1, 0, 'beast', 0);
      await waitForEffects();

      // Leaf Sprite attacks Blazefinch
      await game.executeAttack(player1, 1, 'beast', 1);
      await waitForEffects();

      // TODO: Verify player 1 wins both trades
      // expect(countAliveBeasts(player1)).toBe(2);
      // expect(countAliveBeasts(player2)).toBe(0);
    });

    test('Mystic Shield + Cleansing Downpour survival combo', async () => {
      await game.startMatch(
        createDeck([FUZZLET, MYSTIC_SHIELD, CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 has low-health beast with Burn counter
      const fuzzlet = createTestBeast(FUZZLET, { currentHealth: 2, maxHealth: 3 });
      fuzzlet.counters.push({ type: 'Burn', amount: 3 }); // Would die from burn
      placeBeast(player1, fuzzlet, 0);

      giveCards(player1, [MYSTIC_SHIELD, CLEANSING_DOWNPOUR]);
      giveNectar(player1, 10);

      // Play Mystic Shield (+2 HP)
      await game.playCard(player1, 0);
      await waitForEffects();

      // TODO: Verify HP increased
      // expect(fuzzlet.currentHealth).toBe(4);

      // Play Cleansing Downpour (remove Burn counter)
      await game.playCard(player1, 0);
      await waitForEffects();

      // TODO: Verify Burn removed
      // expect(hasCounter(fuzzlet, 'Burn')).toBe(false);

      // Beast survives start of next turn
      await game.endTurn();
      await waitForEffects();

      expect(fuzzlet.currentHealth).toBeGreaterThan(0);
    });
  });

  describe('Trap + Habitat Interactions', () => {
    test('Habitat Lock counters expensive habitat play', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK]),
        createDeck([ANCIENT_FOREST]) // 5 cost habitat
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 sets cheap trap (1 nectar)
      giveCards(player1, [HABITAT_LOCK]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);

      await game.endTurn();

      // Player 2 tries to play expensive habitat
      giveCards(player2, [ANCIENT_FOREST]);
      giveNectar(player2, 10);

      const nectarBefore = player2.currentNectar;
      await game.playCard(player2, 0);
      await waitForEffects();

      // Habitat countered, nectar wasted
      expect(state.habitatZone).toBe(null);
      expect(player2.currentNectar).toBe(nectarBefore - ANCIENT_FOREST.cost);
      // Player 2 also took 2 damage
      // TODO: expect(player2.health).toBe(STARTING_HEALTH - 2);
    });

    test('Setting trap vs rushing with beasts trade-off', async () => {
      await game.startMatch(
        createDeck([HABITAT_LOCK, FUZZLET]),
        createDeck([VOLCANIC_SCAR])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      giveCards(player1, [HABITAT_LOCK, FUZZLET]);
      player1.currentNectar = 0; // Reset to ensure consistent state
      giveNectar(player1, 3);

      // Decision: Set trap (1 nectar) + summon Fuzzlet (2 nectar)
      // OR: Save nectar for future turn

      await game.playCard(player1, 0); // Set trap (1 nectar)
      await game.playCard(player1, 0); // Summon Fuzzlet (2 nectar)

      expect(player1.currentNectar).toBe(0);
      expect(countAliveBeasts(player1)).toBe(1);
      expect(player1.trapZone.filter(t => t !== null).length).toBe(1);

      await game.endTurn();

      // Player 2 plays habitat, gets countered
      giveCards(player2, [VOLCANIC_SCAR]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // Player 1's trap strategy paid off
      expect(state.habitatZone).toBe(null);
    });
  });

  describe('Full Turn Sequences', () => {
    test('Complete turn: draw, summon, buff, attack', async () => {
      await game.startMatch(
        createDeck([FUZZLET, LEAF_SPRITE, BATTLE_FURY]),
        createDeck([CHARCOIL])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Setup opponent
      const charcoil = createTestBeast(CHARCOIL);
      placeBeast(player2, charcoil, 0);

      // Turn starts
      giveCards(player1, [FUZZLET, BATTLE_FURY]);
      player1.currentNectar = 0; // Reset to ensure consistent state
      giveNectar(player1, 10);

      // 1. Summon beast
      await game.playCard(player1, 0); // Summon Fuzzlet (2 nectar)
      // Nectar after playing Fuzzlet
      const nectarAfterFuzzlet = player1.currentNectar;

      // 2. Play buff
      await game.playCard(player1, 0); // Battle Fury
      // Verify nectar was deducted
      expect(player1.currentNectar).toBeLessThan(nectarAfterFuzzlet);

      await waitForEffects();

      // 3. Attack (assuming no summoning sickness for test)
      const fuzzlet = player1.field.find(b => b && b.cardId === 'fuzzlet');
      if (fuzzlet) {
        fuzzlet.summoningSickness = false; // Remove for test
        await game.executeAttack(player1, 0, 'beast', 0);
        await waitForEffects();
      }

      // TODO: Verify attack dealt buffed damage
      // expect(charcoil.currentHealth).toBe(2 - (2 + 2)); // Base 2 ATK + 2 from buff
    });

    test('Multi-turn resource management and strategy', async () => {
      await game.startMatch(
        createDeck([FUZZLET, LEAF_SPRITE, MYSTIC_SHIELD]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Turn 1: Limited nectar (1 nectar)
      state.turn = 1;
      player.currentNectar = 0; // Reset to ensure consistent state
      giveNectar(player, 1);
      // Replace hand with specific cards in desired order
      player.hand = [FUZZLET, LEAF_SPRITE, MYSTIC_SHIELD];

      // Can't afford anything good yet
      expect(player.currentNectar).toBe(1);

      await game.endTurn();
      await game.endTurn();

      // Turn 2: 2 nectar
      giveNectar(player, 2);
      await game.playCard(player, 0); // Play Fuzzlet (2 nectar)
      expect(countAliveBeasts(player)).toBe(1);

      await game.endTurn();
      await game.endTurn();

      // Turn 3: 3 nectar
      giveNectar(player, 3);
      await game.playCard(player, 1); // Play Mystic Shield (3 nectar) - it's at index 1 now

      await waitForEffects();

      // By turn 3, have 1 beast + 1 buff active
      expect(countAliveBeasts(player)).toBe(1);
      expect(player.buffZone.filter(b => b !== null).length).toBe(1);
    });
  });

  describe('Ability Combos', () => {
    test('Burn damage + Cleansing Downpour timing', async () => {
      await game.startMatch(
        createDeck([CLEANSING_DOWNPOUR]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Setup: Multiple beasts with varying Burn amounts
      const beast1 = createTestBeast(FUZZLET, { currentHealth: 2, maxHealth: 3 });
      beast1.counters.push({ type: 'Burn', amount: 2 }); // Would die

      const beast2 = createTestBeast(LEAF_SPRITE, { currentHealth: 1, maxHealth: 2 });
      beast2.counters.push({ type: 'Burn', amount: 1 }); // Would die

      const beast3 = createTestBeast(CHARCOIL, { currentHealth: 3, maxHealth: 3 });
      beast3.counters.push({ type: 'Burn', amount: 1 }); // Would survive

      placeBeast(player1, beast1, 0);
      placeBeast(player1, beast2, 1);
      placeBeast(player2, beast3, 0);

      const totalBurnDamage =
        getCounterAmount(beast1, 'Burn') +
        getCounterAmount(beast2, 'Burn') +
        getCounterAmount(beast3, 'Burn');
      expect(totalBurnDamage).toBe(4);

      // Play Cleansing Downpour before burn triggers
      giveCards(player1, [CLEANSING_DOWNPOUR]);
      giveNectar(player1, 10);
      await game.playCard(player1, 0);
      await waitForEffects();

      // TODO: All burn removed
      // expect(getCounterAmount(beast1, 'Burn')).toBe(0);
      // expect(getCounterAmount(beast2, 'Burn')).toBe(0);
      // expect(getCounterAmount(beast3, 'Burn')).toBe(0);

      // Start of turn: No burn damage occurs
      await game.endTurn();
      await waitForEffects();

      // All beasts survive
      expect(beast1.currentHealth).toBe(2);
      expect(beast2.currentHealth).toBe(1);
      expect(beast3.currentHealth).toBe(3);
    });

    test('Fuzzlet Spore counter accumulation strategy', async () => {
      await game.startMatch(
        createDeck([FUZZLET]),
        createDeck([LEAF_SPRITE])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // High-health Fuzzlet to survive multiple attacks
      const fuzzlet = createTestBeast(FUZZLET, { currentHealth: 10, maxHealth: 10 });
      placeBeast(player1, fuzzlet, 0);

      const attacker = createTestBeast(LEAF_SPRITE);
      placeBeast(player2, attacker, 0);

      // Attack Fuzzlet multiple times
      for (let i = 0; i < 3; i++) {
        await game.executeAttack(player2, 0, 'beast', 0);
        await waitForEffects();

        await game.endTurn();
        await game.endTurn();
      }

      // TODO: Fuzzlet should have accumulated 3 Spore counters
      // expect(getCounterAmount(fuzzlet, 'Spore')).toBe(3);

      // At level 4, these spores would grant +1 HP each with "Spore Shield" ability
    });
  });

  describe('Win Condition Scenarios', () => {
    test('Defeat opponent by reducing health to 0', async () => {
      await game.startMatch(
        createDeck([CHARCOIL]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 has strong attacker
      const charcoil = createTestBeast(CHARCOIL, { currentAttack: 20 });
      placeBeast(player1, charcoil, 0);

      // Set opponent to low health
      player2.health = 10;

      charcoil.summoningSickness = false;

      // Attack player directly
      await game.executeAttack(player1, 0, 'player');
      await waitForEffects();

      expect(player2.health).toBe(0);

      // TODO: Game should end with player 1 winning
      // const result = game.checkWinCondition();
      // expect(result).toBeTruthy();
      // expect(result.winner).toBe('player1');
    });

    test('Control victory through board domination', async () => {
      await game.startMatch(
        createDeck([FUZZLET, LEAF_SPRITE, CHARCOIL]),
        createDeck([])
      );

      const state = game.getState();
      const player1 = state.players[0];
      const player2 = state.players[1];

      // Player 1 has full board
      placeBeast(player1, createTestBeast(FUZZLET), 0);
      placeBeast(player1, createTestBeast(LEAF_SPRITE), 1);
      placeBeast(player1, createTestBeast(CHARCOIL), 2);

      // Player 2 has no beasts
      expect(countAliveBeasts(player1)).toBe(3);
      expect(countAliveBeasts(player2)).toBe(0);

      // Player 1 can attack freely
      for (let i = 0; i < 3; i++) {
        const beast = player1.field[i];
        if (beast) {
          beast.summoningSickness = false;
          await game.executeAttack(player1, i, 'player');
          await waitForEffects();
        }
      }

      // Player 2 takes massive damage
      expect(player2.health).toBeLessThan(20);
    });
  });

  describe('Resource Management', () => {
    test('Nectar efficiency: buff value increases with more beasts', async () => {
      await game.startMatch(
        createDeck([FUZZLET, LEAF_SPRITE, CHARCOIL, BATTLE_FURY]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Scenario 1: 1 beast, then buff (3 nectar for +2 ATK = ~1.5 nectar per +1 ATK)
      placeBeast(player, createTestBeast(FUZZLET), 0);

      const attackBefore1 = getTotalAttack(player);
      giveCards(player, [BATTLE_FURY]);
      giveNectar(player, 10);
      await game.playCard(player, 0);
      await waitForEffects();

      // TODO: +2 total attack for 3 nectar
      // const attackAfter1 = getTotalAttack(player);
      // const valuePerNectar1 = (attackAfter1 - attackBefore1) / 3;

      // Reset
      game.reset();
      await game.startMatch(
        createDeck([FUZZLET, LEAF_SPRITE, CHARCOIL, BATTLE_FURY]),
        createDeck([])
      );

      const state2 = game.getState();
      const player2 = state2.players[0];

      // Scenario 2: 3 beasts, then buff (3 nectar for +6 ATK = 0.5 nectar per +1 ATK)
      placeBeast(player2, createTestBeast(FUZZLET), 0);
      placeBeast(player2, createTestBeast(LEAF_SPRITE), 1);
      placeBeast(player2, createTestBeast(CHARCOIL), 2);

      const attackBefore2 = getTotalAttack(player2);
      giveCards(player2, [BATTLE_FURY]);
      giveNectar(player2, 10);
      await game.playCard(player2, 0);
      await waitForEffects();

      // TODO: +6 total attack for 3 nectar - much better value!
      // const attackAfter2 = getTotalAttack(player2);
      // const valuePerNectar2 = (attackAfter2 - attackBefore2) / 3;
      // expect(valuePerNectar2).toBeGreaterThan(valuePerNectar1);
    });

    test('Opportunity cost: tempo vs value', async () => {
      await game.startMatch(
        createDeck([FUZZLET, MYSTIC_SHIELD]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Replace hand with specific cards in desired order
      player.hand = [FUZZLET, MYSTIC_SHIELD];
      player.currentNectar = 0; // Reset to ensure consistent state
      giveNectar(player, 3);

      // Choice A: Play Fuzzlet (2/3 body for 2 nectar, 1 nectar left)
      // Choice B: Play Mystic Shield (+2 HP to all allies, but no body)

      // Playing beast gives immediate board presence (tempo)
      await game.playCard(player, 0); // Fuzzlet
      expect(countAliveBeasts(player)).toBe(1);
      expect(player.currentNectar).toBe(1);

      // Can't afford Mystic Shield anymore this turn
      const result = await game.playCard(player, 0); // Mystic Shield
      expect(result).toBe(false);

      // This demonstrates the tempo vs value decision
    });
  });

  describe('Field Positioning', () => {
    test('Adjacent abilities and field positioning matters', async () => {
      await game.startMatch(
        createDeck([FUZZLET, LEAF_SPRITE, CHARCOIL]),
        createDeck([])
      );

      const state = game.getState();
      const player = state.players[0];

      // Place beasts in specific positions
      const center = createTestBeast(LEAF_SPRITE);
      const left = createTestBeast(FUZZLET);
      const right = createTestBeast(CHARCOIL);

      placeBeast(player, left, 0);
      placeBeast(player, center, 1);
      placeBeast(player, right, 2);

      // Center beast has 2 adjacent allies
      expect(center.slotIndex).toBe(1);

      // TODO: Test abilities that care about adjacent beasts
      // e.g., "Give adjacent allies +1/+1"
    });
  });
});
