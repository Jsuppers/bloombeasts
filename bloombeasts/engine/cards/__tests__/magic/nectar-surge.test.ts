/**
 * Tests for Nectar Surge - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const NECTAR_SURGE = loadCardFromJSON('nectar-surge', 'magic');

describe('Nectar Surge Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(NECTAR_SURGE);
    });

    test('should have correct card properties', () => {
      expect(NECTAR_SURGE.id).toBe('nectar-surge');
      expect(NECTAR_SURGE.name).toBe('Nectar Surge');
      expect(NECTAR_SURGE.type).toBe('Magic');
      expect(NECTAR_SURGE.cost).toBe(1);
    });
  });

  describe('Ability - Nectar Surge', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(NECTAR_SURGE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(NECTAR_SURGE.abilities[0].name).toBe('Nectar Surge');
    });

    test('should have correct effects', () => {
      expect(NECTAR_SURGE.abilities[0].effects).toBeDefined();
      expect(NECTAR_SURGE.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
