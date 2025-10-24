/**
 * Tests for Overgrowth - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const OVERGROWTH = loadCardFromJSON('overgrowth', 'magic');

describe('Overgrowth Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(OVERGROWTH);
    });

    test('should have correct card properties', () => {
      expect(OVERGROWTH.id).toBe('overgrowth');
      expect(OVERGROWTH.name).toBe('Overgrowth');
      expect(OVERGROWTH.type).toBe('Magic');
      expect(OVERGROWTH.cost).toBe(3);
    });
  });

  describe('Ability - Overgrowth', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(OVERGROWTH.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(OVERGROWTH.abilities[0].name).toBe('Overgrowth');
    });

    test('should have correct effects', () => {
      expect(OVERGROWTH.abilities[0].effects).toBeDefined();
      expect(OVERGROWTH.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
