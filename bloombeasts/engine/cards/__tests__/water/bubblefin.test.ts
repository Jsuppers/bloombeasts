/**
 * Tests for Bubblefin - Water card
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

const BUBBLEFIN = loadCardFromJSON('bubblefin', 'water');

describe('Bubblefin Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(BUBBLEFIN);
    });

    test('should have correct card properties', () => {
      expect(BUBBLEFIN.id).toBe('bubblefin');
      expect(BUBBLEFIN.name).toBe('Bubblefin');
      expect(BUBBLEFIN.type).toBe('Bloom');
      expect(BUBBLEFIN.affinity).toBe('Water');
      expect(BUBBLEFIN.cost).toBe(2);
      expect(BUBBLEFIN.baseAttack).toBe(2);
      expect(BUBBLEFIN.baseHealth).toBe(5);
    });
  });

  describe('Base Ability - Emerge', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(BUBBLEFIN.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(BUBBLEFIN.abilities[0].name).toBe('Emerge');
    });

    test('should have correct trigger', () => {
      expect(BUBBLEFIN.abilities[0].trigger).toBe('Passive');
    });

    test('should have correct effects', () => {
      expect(BUBBLEFIN.abilities[0].effects).toBeDefined();
      expect(BUBBLEFIN.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(BUBBLEFIN);
    });

    test('should have stat gains for all levels', () => {
      expect(BUBBLEFIN.levelingConfig).toBeDefined();
      expect(BUBBLEFIN.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(BUBBLEFIN.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(BUBBLEFIN);
    });
  });

  describe('Level 4 Upgrade - Tidal Shield', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Tidal Shield');
    });

    test('should have correct trigger', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnDamage');
    });
  });

  describe('Level 7 Upgrade - Deep Dive', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Deep Dive');
    });

    test('should have correct trigger', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('Passive');
    });
  });

  describe('Level 9 Upgrade - Ocean Sanctuary', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Ocean Sanctuary');
    });

    test('should have correct trigger', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('Passive');
    });
  });

});
