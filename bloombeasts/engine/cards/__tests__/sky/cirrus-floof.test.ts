/**
 * Tests for Cirrus Floof - Sky card
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

const CIRRUS_FLOOF = loadCardFromJSON('cirrus-floof', 'sky');

describe('Cirrus Floof Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(CIRRUS_FLOOF);
    });

    test('should have correct card properties', () => {
      expect(CIRRUS_FLOOF.id).toBe('cirrus-floof');
      expect(CIRRUS_FLOOF.name).toBe('Cirrus Floof');
      expect(CIRRUS_FLOOF.type).toBe('Bloom');
      expect(CIRRUS_FLOOF.affinity).toBe('Sky');
      expect(CIRRUS_FLOOF.cost).toBe(2);
      expect(CIRRUS_FLOOF.baseAttack).toBe(1);
      expect(CIRRUS_FLOOF.baseHealth).toBe(6);
    });
  });

  describe('Base Ability - Lightness', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(CIRRUS_FLOOF.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(CIRRUS_FLOOF.abilities[0].name).toBe('Lightness');
    });

    test('should have correct trigger', () => {
      expect(CIRRUS_FLOOF.abilities[0].trigger).toBe('Passive');
    });

    test('should have correct effects', () => {
      expect(CIRRUS_FLOOF.abilities[0].effects).toBeDefined();
      expect(CIRRUS_FLOOF.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(CIRRUS_FLOOF);
    });

    test('should have stat gains for all levels', () => {
      expect(CIRRUS_FLOOF.levelingConfig).toBeDefined();
      expect(CIRRUS_FLOOF.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(CIRRUS_FLOOF.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(CIRRUS_FLOOF);
    });
  });

  describe('Level 4 Upgrade - Storm Shield', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Storm Shield');
    });

    test('should have correct trigger', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnOwnStartOfTurn');
    });
  });

  describe('Level 7 Upgrade - Ethereal Form', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Ethereal Form');
    });

    test('should have correct trigger', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('Passive');
    });
  });

  describe('Level 9 Upgrade - Celestial Protector', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Celestial Protector');
    });

    test('should have correct trigger', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('Passive');
    });
  });

});
