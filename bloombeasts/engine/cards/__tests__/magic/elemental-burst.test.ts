/**
 * Tests for Elemental Burst - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const ELEMENTAL_BURST = loadCardFromJSON('elemental-burst', 'magic');

describe('Elemental Burst Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(ELEMENTAL_BURST);
    });

    test('should have correct card properties', () => {
      expect(ELEMENTAL_BURST.id).toBe('elemental-burst');
      expect(ELEMENTAL_BURST.name).toBe('Elemental Burst');
      expect(ELEMENTAL_BURST.type).toBe('Magic');
      expect(ELEMENTAL_BURST.cost).toBe(3);
    });
  });

  describe('Ability - Elemental Burst', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(ELEMENTAL_BURST.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(ELEMENTAL_BURST.abilities[0].name).toBe('Elemental Burst');
    });

    test('should have correct effects', () => {
      expect(ELEMENTAL_BURST.abilities[0].effects).toBeDefined();
      expect(ELEMENTAL_BURST.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
