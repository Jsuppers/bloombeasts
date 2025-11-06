/**
 * Tests for Energy Block - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils';
import { StructuredAbility } from '../../../types/abilities';

const ENERGY_BLOCK = loadCardFromJSON('nectar-block', 'magic');

describe('Energy Block Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(ENERGY_BLOCK);
    });

    test('should have correct card properties', () => {
      expect(ENERGY_BLOCK.id).toBe('nectar-block');
      expect(ENERGY_BLOCK.name).toBe('Energy Block');
      expect(ENERGY_BLOCK.type).toBe('Magic');
      expect(ENERGY_BLOCK.cost).toBe(0);
    });
  });

  describe('Ability - Energy Block', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(ENERGY_BLOCK.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(ENERGY_BLOCK.abilities[0].name).toBe('Energy Block');
    });

    test('should have correct effects', () => {
      expect(ENERGY_BLOCK.abilities[0].effects).toBeDefined();
      expect(ENERGY_BLOCK.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
