/**
 * Tests for Cleansing Downpour - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const CLEANSING_DOWNPOUR = loadCardFromJSON('cleansing-downpour', 'magic');

describe('Cleansing Downpour Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(CLEANSING_DOWNPOUR);
    });

    test('should have correct card properties', () => {
      expect(CLEANSING_DOWNPOUR.id).toBe('cleansing-downpour');
      expect(CLEANSING_DOWNPOUR.name).toBe('Cleansing Downpour');
      expect(CLEANSING_DOWNPOUR.type).toBe('Magic');
      expect(CLEANSING_DOWNPOUR.cost).toBe(2);
    });
  });

  describe('Ability - Cleansing Downpour', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(CLEANSING_DOWNPOUR.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(CLEANSING_DOWNPOUR.abilities[0].name).toBe('Cleansing Downpour');
    });

    test('should have correct effects', () => {
      expect(CLEANSING_DOWNPOUR.abilities[0].effects).toBeDefined();
      expect(CLEANSING_DOWNPOUR.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
