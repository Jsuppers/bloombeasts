/**
 * Tests for Star Bloom - Sky card
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

const STAR_BLOOM = loadCardFromJSON('star-bloom', 'sky');

describe('Star Bloom Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(STAR_BLOOM);
    });

    test('should have correct card properties', () => {
      expect(STAR_BLOOM.id).toBe('star-bloom');
      expect(STAR_BLOOM.name).toBe('Star Bloom');
      expect(STAR_BLOOM.type).toBe('Bloom');
      expect(STAR_BLOOM.affinity).toBe('Sky');
      expect(STAR_BLOOM.cost).toBe(3);
      expect(STAR_BLOOM.baseAttack).toBe(4);
      expect(STAR_BLOOM.baseHealth).toBe(5);
    });
  });

  describe('Base Ability - Aura', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(STAR_BLOOM.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(STAR_BLOOM.abilities[0].name).toBe('Aura');
    });

    test('should have correct trigger', () => {
      expect(STAR_BLOOM.abilities[0].trigger).toBe(AbilityTrigger.WhileOnField);
    });

    test('should have correct effects', () => {
      expect(STAR_BLOOM.abilities[0].effects).toBeDefined();
      expect(STAR_BLOOM.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(STAR_BLOOM);
    });

    test('should have stat gains for all levels', () => {
      expect(STAR_BLOOM.levelingConfig).toBeDefined();
      expect(STAR_BLOOM.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(STAR_BLOOM.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(STAR_BLOOM);
    });
  });

  describe('Level 4 Upgrade - Radiant Aura', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = STAR_BLOOM.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = STAR_BLOOM.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Radiant Aura');
    });

    test('should have correct trigger', () => {
      const upgrade = STAR_BLOOM.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

  describe('Level 7 Upgrade - Cosmic Guidance', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = STAR_BLOOM.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = STAR_BLOOM.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Cosmic Guidance');
    });

    test('should have correct trigger', () => {
      const upgrade = STAR_BLOOM.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnSummon);
    });
  });

  describe('Level 9 Upgrade - Astral Dominance', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = STAR_BLOOM.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = STAR_BLOOM.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Astral Dominance');
    });

    test('should have correct trigger', () => {
      const upgrade = STAR_BLOOM.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

});
