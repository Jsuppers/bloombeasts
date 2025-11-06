/**
 * Tests for Energy Surge - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils';
import { StructuredAbility } from '../../../types/abilities';

const ENERGY_SURGE = loadCardFromJSON('nectar-surge', 'magic');

describe('Energy Surge Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(ENERGY_SURGE);
    });

    test('should have correct card properties', () => {
      expect(ENERGY_SURGE.id).toBe('nectar-surge');
      expect(ENERGY_SURGE.name).toBe('Energy Surge');
      expect(ENERGY_SURGE.type).toBe('Magic');
      expect(ENERGY_SURGE.cost).toBe(1);
    });
  });

  describe('Ability - Energy Surge', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(ENERGY_SURGE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(ENERGY_SURGE.abilities[0].name).toBe('Energy Surge');
    });

    test('should have correct effects', () => {
      expect(ENERGY_SURGE.abilities[0].effects).toBeDefined();
      expect(ENERGY_SURGE.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
