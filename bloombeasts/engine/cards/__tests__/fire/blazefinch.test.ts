/**
 * Tests for Blazefinch - Fire card
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
import { StructuredAbility, AbilityTrigger } from '../../types/abilities.js';

const BLAZEFINCH = loadCardFromJSON('blazefinch', 'fire');

describe('Blazefinch Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(BLAZEFINCH);
    });

    test('should have correct card properties', () => {
      expect(BLAZEFINCH.id).toBe('blazefinch');
      expect(BLAZEFINCH.name).toBe('Blazefinch');
      expect(BLAZEFINCH.type).toBe('Bloom');
      expect(BLAZEFINCH.affinity).toBe('Fire');
      expect(BLAZEFINCH.cost).toBe(1);
      expect(BLAZEFINCH.baseAttack).toBe(1);
      expect(BLAZEFINCH.baseHealth).toBe(2);
    });
  });

  describe('Base Ability - Quick Strike', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(BLAZEFINCH.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(BLAZEFINCH.abilities[0].name).toBe('Quick Strike');
    });

    test('should have correct trigger', () => {
      expect(BLAZEFINCH.abilities[0].trigger).toBe(AbilityTrigger.WhileOnField);
    });

    test('should have correct effects', () => {
      expect(BLAZEFINCH.abilities[0].effects).toBeDefined();
      expect(BLAZEFINCH.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(BLAZEFINCH);
    });

    test('should have stat gains for all levels', () => {
      expect(BLAZEFINCH.levelingConfig).toBeDefined();
      expect(BLAZEFINCH.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(BLAZEFINCH.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(BLAZEFINCH);
    });
  });

  describe('Level 4 Upgrade - Ember Strike', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = BLAZEFINCH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = BLAZEFINCH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Ember Strike');
    });

    test('should have correct trigger', () => {
      const upgrade = BLAZEFINCH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });
  });

  describe('Level 7 Upgrade - Lightning Speed', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = BLAZEFINCH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = BLAZEFINCH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Lightning Speed');
    });

    test('should have correct trigger', () => {
      const upgrade = BLAZEFINCH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

  describe('Level 9 Upgrade - Phoenix Form', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = BLAZEFINCH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = BLAZEFINCH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Phoenix Form');
    });

    test('should have correct trigger', () => {
      const upgrade = BLAZEFINCH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

});
