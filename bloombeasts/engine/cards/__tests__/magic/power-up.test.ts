/**
 * Tests for Power Up - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const POWER_UP = loadCardFromJSON('power-up', 'magic');

describe('Power Up Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(POWER_UP);
    });

    test('should have correct card properties', () => {
      expect(POWER_UP.id).toBe('power-up');
      expect(POWER_UP.name).toBe('Power Up');
      expect(POWER_UP.type).toBe('Magic');
      expect(POWER_UP.cost).toBe(2);
    });
  });

  describe('Ability - Power Up', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(POWER_UP.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(POWER_UP.abilities[0].name).toBe('Power Up');
    });

    test('should have correct effects', () => {
      expect(POWER_UP.abilities[0].effects).toBeDefined();
      expect(POWER_UP.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
