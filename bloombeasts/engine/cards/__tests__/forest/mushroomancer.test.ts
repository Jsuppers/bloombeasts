/**
 * Tests for Mushroomancer - Forest card
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

const MUSHROOMANCER = loadCardFromJSON('mushroomancer', 'forest');

describe('Mushroomancer Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(MUSHROOMANCER);
    });

    test('should have correct card properties', () => {
      expect(MUSHROOMANCER.id).toBe('mushroomancer');
      expect(MUSHROOMANCER.name).toBe('Mushroomancer');
      expect(MUSHROOMANCER.type).toBe('Bloom');
      expect(MUSHROOMANCER.affinity).toBe('Forest');
      expect(MUSHROOMANCER.cost).toBe(3);
      expect(MUSHROOMANCER.baseAttack).toBe(3);
      expect(MUSHROOMANCER.baseHealth).toBe(4);
    });
  });

  describe('Base Ability - Sporogenesis', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(MUSHROOMANCER.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(MUSHROOMANCER.abilities[0].name).toBe('Sporogenesis');
    });

    test('should have correct trigger', () => {
      expect(MUSHROOMANCER.abilities[0].trigger).toBe('OnSummon');
    });

    test('should have correct effects', () => {
      expect(MUSHROOMANCER.abilities[0].effects).toBeDefined();
      expect(MUSHROOMANCER.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(MUSHROOMANCER);
    });

    test('should have stat gains for all levels', () => {
      expect(MUSHROOMANCER.levelingConfig).toBeDefined();
      expect(MUSHROOMANCER.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(MUSHROOMANCER.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(MUSHROOMANCER);
    });
  });

  describe('Level 4 Upgrade - Virulent Spores', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Virulent Spores');
    });

    test('should have correct trigger', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnSummon');
    });
  });

  describe('Level 7 Upgrade - Spore Burst', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Spore Burst');
    });

    test('should have correct trigger', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnDestroy');
    });
  });

  describe('Level 9 Upgrade - Fungal Network', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Fungal Network');
    });

    test('should have correct trigger', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe('OnOwnEndOfTurn');
    });
  });

});
