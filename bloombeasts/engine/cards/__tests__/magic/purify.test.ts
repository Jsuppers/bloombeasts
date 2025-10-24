/**
 * Tests for Purify - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const PURIFY = loadCardFromJSON('purify', 'magic');

describe('Purify Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(PURIFY);
    });

    test('should have correct card properties', () => {
      expect(PURIFY.id).toBe('purify');
      expect(PURIFY.name).toBe('Purify');
      expect(PURIFY.type).toBe('Magic');
      expect(PURIFY.cost).toBe(1);
    });
  });

  describe('Ability - Purify', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(PURIFY.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(PURIFY.abilities[0].name).toBe('Purify');
    });

    test('should have correct effects', () => {
      expect(PURIFY.abilities[0].effects).toBeDefined();
      expect(PURIFY.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
