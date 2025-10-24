/**
 * Tests for Nectar Drain - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const NECTAR_DRAIN = loadCardFromJSON('nectar-drain', 'magic');

describe('Nectar Drain Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(NECTAR_DRAIN);
    });

    test('should have correct card properties', () => {
      expect(NECTAR_DRAIN.id).toBe('nectar-drain');
      expect(NECTAR_DRAIN.name).toBe('Nectar Drain');
      expect(NECTAR_DRAIN.type).toBe('Magic');
      expect(NECTAR_DRAIN.cost).toBe(1);
    });
  });

  describe('Ability - Nectar Drain', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(NECTAR_DRAIN.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(NECTAR_DRAIN.abilities[0].name).toBe('Nectar Drain');
    });

    test('should have correct effects', () => {
      expect(NECTAR_DRAIN.abilities[0].effects).toBeDefined();
      expect(NECTAR_DRAIN.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
