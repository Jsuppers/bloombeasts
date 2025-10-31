/**
 * Tests for Cinder Pup - Fire card
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

const CINDER_PUP = loadCardFromJSON('cinder-pup', 'fire');

describe('Cinder Pup Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(CINDER_PUP);
    });

    test('should have correct card properties', () => {
      expect(CINDER_PUP.id).toBe('cinder-pup');
      expect(CINDER_PUP.name).toBe('Cinder Pup');
      expect(CINDER_PUP.type).toBe('Bloom');
      expect(CINDER_PUP.affinity).toBe('Fire');
      expect(CINDER_PUP.cost).toBe(2);
      expect(CINDER_PUP.baseAttack).toBe(2);
      expect(CINDER_PUP.baseHealth).toBe(3);
    });
  });

  describe('Base Ability - Burning Passion', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(CINDER_PUP.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(CINDER_PUP.abilities[0].name).toBe('Burning Passion');
    });

    test('should have correct trigger', () => {
      expect(CINDER_PUP.abilities[0].trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should have correct effects', () => {
      expect(CINDER_PUP.abilities[0].effects).toBeDefined();
      expect(CINDER_PUP.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(CINDER_PUP);
    });

    test('should have stat gains for all levels', () => {
      expect(CINDER_PUP.levelingConfig).toBeDefined();
      expect(CINDER_PUP.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(CINDER_PUP.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(CINDER_PUP);
    });
  });

  describe('Level 4 Upgrade - Inferno Bite', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = CINDER_PUP.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = CINDER_PUP.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Inferno Bite');
    });

    test('should have correct trigger', () => {
      const upgrade = CINDER_PUP.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });
  });

  describe('Level 7 Upgrade - Flame Burst', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = CINDER_PUP.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = CINDER_PUP.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Flame Burst');
    });

    test('should have correct trigger', () => {
      const upgrade = CINDER_PUP.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnSummon);
    });
  });

  describe('Level 9 Upgrade - Wildfire Aura', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = CINDER_PUP.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = CINDER_PUP.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Wildfire Aura');
    });

    test('should have correct trigger', () => {
      const upgrade = CINDER_PUP.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });
  });

});
