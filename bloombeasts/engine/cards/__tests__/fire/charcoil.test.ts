/**
 * Tests for Charcoil - Fire card
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

const CHARCOIL = loadCardFromJSON('charcoil', 'fire');

describe('Charcoil Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(CHARCOIL);
    });

    test('should have correct card properties', () => {
      expect(CHARCOIL.id).toBe('charcoil');
      expect(CHARCOIL.name).toBe('Charcoil');
      expect(CHARCOIL.type).toBe('Bloom');
      expect(CHARCOIL.affinity).toBe('Fire');
      expect(CHARCOIL.cost).toBe(2);
      expect(CHARCOIL.baseAttack).toBe(3);
      expect(CHARCOIL.baseHealth).toBe(4);
    });
  });

  describe('Base Ability - Flame Retaliation', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(CHARCOIL.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(CHARCOIL.abilities[0].name).toBe('Flame Retaliation');
    });

    test('should have correct trigger', () => {
      expect(CHARCOIL.abilities[0].trigger).toBe('OnDamage');
    });

    test('should have correct effects', () => {
      expect(CHARCOIL.abilities[0].effects).toBeDefined();
      expect(CHARCOIL.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(CHARCOIL);
    });

    test('should have stat gains for all levels', () => {
      expect(CHARCOIL.levelingConfig).toBeDefined();
      expect(CHARCOIL.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(CHARCOIL.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(CHARCOIL);
    });
  });

  describe('Level 4 Upgrade - Burning Retaliation', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = CHARCOIL.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = CHARCOIL.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Burning Retaliation');
    });

    test('should have correct trigger', () => {
      const upgrade = CHARCOIL.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnDamage');
    });
  });

  describe('Level 7 Upgrade - Smoke Screen', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = CHARCOIL.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = CHARCOIL.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Smoke Screen');
    });

    test('should have correct trigger', () => {
      const upgrade = CHARCOIL.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnDamage');
    });
  });

  describe('Level 9 Upgrade - Blazing Vengeance', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = CHARCOIL.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = CHARCOIL.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Blazing Vengeance');
    });

    test('should have correct trigger', () => {
      const upgrade = CHARCOIL.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnDamage');
    });
  });

});
