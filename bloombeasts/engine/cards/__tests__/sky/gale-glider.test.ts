/**
 * Tests for Gale Glider - Sky card
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

const GALE_GLIDER = loadCardFromJSON('gale-glider', 'sky');

describe('Gale Glider Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(GALE_GLIDER);
    });

    test('should have correct card properties', () => {
      expect(GALE_GLIDER.id).toBe('gale-glider');
      expect(GALE_GLIDER.name).toBe('Gale Glider');
      expect(GALE_GLIDER.type).toBe('Bloom');
      expect(GALE_GLIDER.affinity).toBe('Sky');
      expect(GALE_GLIDER.cost).toBe(1);
      expect(GALE_GLIDER.baseAttack).toBe(2);
      expect(GALE_GLIDER.baseHealth).toBe(2);
    });
  });

  describe('Base Ability - First Wind', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(GALE_GLIDER.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(GALE_GLIDER.abilities[0].name).toBe('First Wind');
    });

    test('should have correct trigger', () => {
      expect(GALE_GLIDER.abilities[0].trigger).toBe(AbilityTrigger.WhileOnField);
    });

    test('should have correct effects', () => {
      expect(GALE_GLIDER.abilities[0].effects).toBeDefined();
      expect(GALE_GLIDER.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(GALE_GLIDER);
    });

    test('should have stat gains for all levels', () => {
      expect(GALE_GLIDER.levelingConfig).toBeDefined();
      expect(GALE_GLIDER.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(GALE_GLIDER.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(GALE_GLIDER);
    });
  });

  describe('Level 4 Upgrade - Wind Dance', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = GALE_GLIDER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = GALE_GLIDER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Wind Dance');
    });

    test('should have correct trigger', () => {
      const upgrade = GALE_GLIDER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });
  });

  describe('Level 7 Upgrade - Storm Blade', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = GALE_GLIDER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = GALE_GLIDER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Storm Blade');
    });

    test('should have correct trigger', () => {
      const upgrade = GALE_GLIDER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

  describe('Level 9 Upgrade - Tempest Strike', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = GALE_GLIDER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = GALE_GLIDER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Tempest Strike');
    });

    test('should have correct trigger', () => {
      const upgrade = GALE_GLIDER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

});
