/**
 * Tests for Dewdrop Drake - Water card
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

const DEWDROP_DRAKE = loadCardFromJSON('dewdrop-drake', 'water');

describe('Dewdrop Drake Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(DEWDROP_DRAKE);
    });

    test('should have correct card properties', () => {
      expect(DEWDROP_DRAKE.id).toBe('dewdrop-drake');
      expect(DEWDROP_DRAKE.name).toBe('Dewdrop Drake');
      expect(DEWDROP_DRAKE.type).toBe('Bloom');
      expect(DEWDROP_DRAKE.affinity).toBe('Water');
      expect(DEWDROP_DRAKE.cost).toBe(3);
      expect(DEWDROP_DRAKE.baseAttack).toBe(3);
      expect(DEWDROP_DRAKE.baseHealth).toBe(6);
    });
  });

  describe('Base Ability - Mist Screen', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(DEWDROP_DRAKE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(DEWDROP_DRAKE.abilities[0].name).toBe('Mist Screen');
    });

    test('should have correct trigger', () => {
      expect(DEWDROP_DRAKE.abilities[0].trigger).toBe(AbilityTrigger.WhileOnField);
    });

    test('should have correct effects', () => {
      expect(DEWDROP_DRAKE.abilities[0].effects).toBeDefined();
      expect(DEWDROP_DRAKE.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(DEWDROP_DRAKE);
    });

    test('should have stat gains for all levels', () => {
      expect(DEWDROP_DRAKE.levelingConfig).toBeDefined();
      expect(DEWDROP_DRAKE.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(DEWDROP_DRAKE.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(DEWDROP_DRAKE);
    });
  });

  describe('Level 4 Upgrade - Deluge', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Deluge');
    });

    test('should have correct trigger', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });
  });

  describe('Level 7 Upgrade - Fog Veil', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Fog Veil');
    });

    test('should have correct trigger', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

  describe('Level 9 Upgrade - Storm Guardian', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Storm Guardian');
    });

    test('should have correct trigger', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.WhileOnField);
    });
  });

});
