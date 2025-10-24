/**
 * Tests for Aero Moth - Sky card
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

const AERO_MOTH = loadCardFromJSON('aero-moth', 'sky');

describe('Aero Moth Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(AERO_MOTH);
    });

    test('should have correct card properties', () => {
      expect(AERO_MOTH.id).toBe('aero-moth');
      expect(AERO_MOTH.name).toBe('Aero Moth');
      expect(AERO_MOTH.type).toBe('Bloom');
      expect(AERO_MOTH.affinity).toBe('Sky');
      expect(AERO_MOTH.cost).toBe(2);
      expect(AERO_MOTH.baseAttack).toBe(3);
      expect(AERO_MOTH.baseHealth).toBe(3);
    });
  });

  describe('Base Ability - Wing Flutter', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(AERO_MOTH.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(AERO_MOTH.abilities[0].name).toBe('Wing Flutter');
    });

    test('should have correct trigger', () => {
      expect(AERO_MOTH.abilities[0].trigger).toBe('OnSummon');
    });

    test('should have correct effects', () => {
      expect(AERO_MOTH.abilities[0].effects).toBeDefined();
      expect(AERO_MOTH.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(AERO_MOTH);
    });

    test('should have stat gains for all levels', () => {
      expect(AERO_MOTH.levelingConfig).toBeDefined();
      expect(AERO_MOTH.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(AERO_MOTH.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(AERO_MOTH);
    });
  });

  describe('Level 4 Upgrade - Hypnotic Wings', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Hypnotic Wings');
    });

    test('should have correct trigger', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnSummon');
    });
  });

  describe('Level 7 Upgrade - Hypnotic Wings', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Hypnotic Wings');
    });

    test('should have correct trigger', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnSummon');
    });
  });

  describe('Level 9 Upgrade - Rainbow Cascade', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Rainbow Cascade');
    });

    test('should have correct trigger', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnSummon');
    });
  });

});
