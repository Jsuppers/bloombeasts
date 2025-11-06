/**
 * Tests for Energy Drain - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils';
import { StructuredAbility } from '../../../types/abilities';

const ENERGY_DRAIN = loadCardFromJSON('nectar-drain', 'magic');

describe('Energy Drain Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(ENERGY_DRAIN);
    });

    test('should have correct card properties', () => {
      expect(ENERGY_DRAIN.id).toBe('nectar-drain');
      expect(ENERGY_DRAIN.name).toBe('Energy Drain');
      expect(ENERGY_DRAIN.type).toBe('Magic');
      expect(ENERGY_DRAIN.cost).toBe(1);
    });
  });

  describe('Ability - Energy Drain', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(ENERGY_DRAIN.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(ENERGY_DRAIN.abilities[0].name).toBe('Energy Drain');
    });

    test('should have correct effects', () => {
      expect(ENERGY_DRAIN.abilities[0].effects).toBeDefined();
      expect(ENERGY_DRAIN.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
