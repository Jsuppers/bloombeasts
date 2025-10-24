/**
 * Tests for Aqua Pebble - Water card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const AQUA_PEBBLE = loadCardFromJSON('aqua-pebble', 'water');

describe('Aqua Pebble Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(AQUA_PEBBLE);
    });

    test('should have correct card properties', () => {
      expect(AQUA_PEBBLE.id).toBe('aqua-pebble');
      expect(AQUA_PEBBLE.name).toBe('Aqua Pebble');
      expect(AQUA_PEBBLE.type).toBe('Bloom');
      expect(AQUA_PEBBLE.affinity).toBe('Water');
      expect(AQUA_PEBBLE.cost).toBe(1);
      expect(AQUA_PEBBLE.baseAttack).toBe(1);
      expect(AQUA_PEBBLE.baseHealth).toBe(4);
    });
  });

  describe('Base Ability - Tide Flow', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(AQUA_PEBBLE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(AQUA_PEBBLE.abilities[0].name).toBe('Tide Flow');
    });

    test('should have correct trigger', () => {
      expect(AQUA_PEBBLE.abilities[0].trigger).toBe('OnAllySummon');
    });

    test('should have correct effects', () => {
      expect(AQUA_PEBBLE.abilities[0].effects).toBeDefined();
      expect(AQUA_PEBBLE.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(AQUA_PEBBLE);
    });

    test('should have stat gains for all levels', () => {
      expect(AQUA_PEBBLE.levelingConfig).toBeDefined();
      expect(AQUA_PEBBLE.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(AQUA_PEBBLE.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(AQUA_PEBBLE);
    });
  });

  describe('Level 4 Upgrade - Tidal Surge', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Tidal Surge');
    });

    test('should have correct trigger', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnAllySummon');
    });
  });

  describe('Level 7 Upgrade - Rejuvenation', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Rejuvenation');
    });

    test('should have correct trigger', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnOwnEndOfTurn');
    });
  });

  describe('Level 9 Upgrade - Tsunami Force', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Tsunami Force');
    });

    test('should have correct trigger', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnAllySummon');
    });
  });

});
