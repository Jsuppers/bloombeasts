/**
 * Tests for Rootling - Forest card
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

const ROOTLING = loadCardFromJSON('rootling', 'forest');

describe('Rootling Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(ROOTLING);
    });

    test('should have correct card properties', () => {
      expect(ROOTLING.id).toBe('rootling');
      expect(ROOTLING.name).toBe('Rootling');
      expect(ROOTLING.type).toBe('Bloom');
      expect(ROOTLING.affinity).toBe('Forest');
      expect(ROOTLING.cost).toBe(1);
      expect(ROOTLING.baseAttack).toBe(1);
      expect(ROOTLING.baseHealth).toBe(3);
    });
  });

  describe('Base Ability - Deep Roots', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(ROOTLING.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(ROOTLING.abilities[0].name).toBe('Deep Roots');
    });

    test('should have correct trigger', () => {
      expect(ROOTLING.abilities[0].trigger).toBe(AbilityTrigger.WhileOnField);
    });

    test('should have correct effects', () => {
      expect(ROOTLING.abilities[0].effects).toBeDefined();
      expect(ROOTLING.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(ROOTLING);
    });

    test('should have stat gains for all levels', () => {
      expect(ROOTLING.levelingConfig).toBeDefined();
      expect(ROOTLING.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(ROOTLING.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(ROOTLING);
    });
  });

  describe('Level 4 Upgrade - Abundant Nourish', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Abundant Nourish');
    });

    test('should have correct trigger', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnDestroy);
    });
  });

  describe('Level 7 Upgrade - Ancient Roots', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Ancient Roots');
    });

    test('should have correct trigger', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

  describe('Level 9 Upgrade - Eternal Roots', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Eternal Roots');
    });

    test('should have correct trigger', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

});
