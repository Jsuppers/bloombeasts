/**
 * Tests for Magmite - Fire card
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

const MAGMITE = loadCardFromJSON('magmite', 'fire');

describe('Magmite Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(MAGMITE);
    });

    test('should have correct card properties', () => {
      expect(MAGMITE.id).toBe('magmite');
      expect(MAGMITE.name).toBe('Magmite');
      expect(MAGMITE.type).toBe('Bloom');
      expect(MAGMITE.affinity).toBe('Fire');
      expect(MAGMITE.cost).toBe(3);
      expect(MAGMITE.baseAttack).toBe(4);
      expect(MAGMITE.baseHealth).toBe(6);
    });
  });

  describe('Base Ability - Hardened Shell', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(MAGMITE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(MAGMITE.abilities[0].name).toBe('Hardened Shell');
    });

    test('should have correct trigger', () => {
      expect(MAGMITE.abilities[0].trigger).toBe('Passive');
    });

    test('should have correct effects', () => {
      expect(MAGMITE.abilities[0].effects).toBeDefined();
      expect(MAGMITE.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(MAGMITE);
    });

    test('should have stat gains for all levels', () => {
      expect(MAGMITE.levelingConfig).toBeDefined();
      expect(MAGMITE.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(MAGMITE.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(MAGMITE);
    });
  });

  describe('Level 4 Upgrade - Molten Armor', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = MAGMITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MAGMITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Molten Armor');
    });

    test('should have correct trigger', () => {
      const upgrade = MAGMITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('Passive');
    });
  });

  describe('Level 7 Upgrade - Eruption', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = MAGMITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MAGMITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Eruption');
    });

    test('should have correct trigger', () => {
      const upgrade = MAGMITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnDestroy');
    });
  });

  describe('Level 9 Upgrade - Obsidian Carapace', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = MAGMITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MAGMITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Obsidian Carapace');
    });

    test('should have correct trigger', () => {
      const upgrade = MAGMITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('Passive');
    });
  });

});
