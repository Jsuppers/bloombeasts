/**
 * Tests for Leaf Sprite - Forest card
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

const LEAF_SPRITE = loadCardFromJSON('leaf-sprite', 'forest');

describe('Leaf Sprite Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(LEAF_SPRITE);
    });

    test('should have correct card properties', () => {
      expect(LEAF_SPRITE.id).toBe('leaf-sprite');
      expect(LEAF_SPRITE.name).toBe('Leaf Sprite');
      expect(LEAF_SPRITE.type).toBe('Bloom');
      expect(LEAF_SPRITE.affinity).toBe('Forest');
      expect(LEAF_SPRITE.cost).toBe(1);
      expect(LEAF_SPRITE.baseAttack).toBe(1);
      expect(LEAF_SPRITE.baseHealth).toBe(2);
    });
  });

  describe('Base Ability - Nimble', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(LEAF_SPRITE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(LEAF_SPRITE.abilities[0].name).toBe('Nimble');
    });

    test('should have correct trigger', () => {
      expect(LEAF_SPRITE.abilities[0].trigger).toBe(AbilityTrigger.OnSummon);
    });

    test('should have correct effects', () => {
      expect(LEAF_SPRITE.abilities[0].effects).toBeDefined();
      expect(LEAF_SPRITE.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(LEAF_SPRITE);
    });

    test('should have stat gains for all levels', () => {
      expect(LEAF_SPRITE.levelingConfig).toBeDefined();
      expect(LEAF_SPRITE.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(LEAF_SPRITE.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(LEAF_SPRITE);
    });
  });

  describe('Level 4 Upgrade - Swiftness', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Swiftness');
    });

    test('should have correct trigger', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnSummon);
    });
  });

  describe('Level 7 Upgrade - Evasive', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Evasive');
    });

    test('should have correct trigger', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

  describe('Level 9 Upgrade - Sprint', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Sprint');
    });

    test('should have correct trigger', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnSummon);
    });
  });

});
