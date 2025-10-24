/**
 * Tests for Mosslet - Forest card
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

const MOSSLET = loadCardFromJSON('mosslet', 'forest');

describe('Mosslet Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(MOSSLET);
    });

    test('should have correct card properties', () => {
      expect(MOSSLET.id).toBe('mosslet');
      expect(MOSSLET.name).toBe('Mosslet');
      expect(MOSSLET.type).toBe('Bloom');
      expect(MOSSLET.affinity).toBe('Forest');
      expect(MOSSLET.cost).toBe(2);
      expect(MOSSLET.baseAttack).toBe(2);
      expect(MOSSLET.baseHealth).toBe(2);
    });
  });

  describe('Base Ability - Growth', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(MOSSLET.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(MOSSLET.abilities[0].name).toBe('Growth');
    });

    test('should have correct trigger', () => {
      expect(MOSSLET.abilities[0].trigger).toBe('OnOwnEndOfTurn');
    });

    test('should have correct effects', () => {
      expect(MOSSLET.abilities[0].effects).toBeDefined();
      expect(MOSSLET.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(MOSSLET);
    });

    test('should have stat gains for all levels', () => {
      expect(MOSSLET.levelingConfig).toBeDefined();
      expect(MOSSLET.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(MOSSLET.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(MOSSLET);
    });
  });

  describe('Level 4 Upgrade - Rapid Growth', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Rapid Growth');
    });

    test('should have correct trigger', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnOwnEndOfTurn');
    });
  });

  describe('Level 7 Upgrade - Mossy Armor', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Mossy Armor');
    });

    test('should have correct trigger', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('Passive');
    });
  });

  describe('Level 9 Upgrade - Overgrowth', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Overgrowth');
    });

    test('should have correct trigger', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnOwnEndOfTurn');
    });
  });

});
