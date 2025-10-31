/**
 * Tests for Kelp Cub - Water card
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

const KELP_CUB = loadCardFromJSON('kelp-cub', 'water');

describe('Kelp Cub Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(KELP_CUB);
    });

    test('should have correct card properties', () => {
      expect(KELP_CUB.id).toBe('kelp-cub');
      expect(KELP_CUB.name).toBe('Kelp Cub');
      expect(KELP_CUB.type).toBe('Bloom');
      expect(KELP_CUB.affinity).toBe('Water');
      expect(KELP_CUB.cost).toBe(2);
      expect(KELP_CUB.baseAttack).toBe(3);
      expect(KELP_CUB.baseHealth).toBe(3);
    });
  });

  describe('Base Ability - Entangle', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(KELP_CUB.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(KELP_CUB.abilities[0].name).toBe('Entangle');
    });

    test('should have correct trigger', () => {
      expect(KELP_CUB.abilities[0].trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should have correct effects', () => {
      expect(KELP_CUB.abilities[0].effects).toBeDefined();
      expect(KELP_CUB.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(KELP_CUB);
    });

    test('should have stat gains for all levels', () => {
      expect(KELP_CUB.levelingConfig).toBeDefined();
      expect(KELP_CUB.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(KELP_CUB.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(KELP_CUB);
    });
  });

  describe('Level 4 Upgrade - Binding Vines', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Binding Vines');
    });

    test('should have correct trigger', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });
  });

  describe('Level 7 Upgrade - Deep Anchor', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Deep Anchor');
    });

    test('should have correct trigger', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

  describe('Level 9 Upgrade - Strangling Grasp', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Strangling Grasp');
    });

    test('should have correct trigger', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });
  });

});
