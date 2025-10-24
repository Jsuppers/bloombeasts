/**
 * Tests for Nectar Block - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const NECTAR_BLOCK = loadCardFromJSON('nectar-block', 'magic');

describe('Nectar Block Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(NECTAR_BLOCK);
    });

    test('should have correct card properties', () => {
      expect(NECTAR_BLOCK.id).toBe('nectar-block');
      expect(NECTAR_BLOCK.name).toBe('Nectar Block');
      expect(NECTAR_BLOCK.type).toBe('Magic');
      expect(NECTAR_BLOCK.cost).toBe(0);
    });
  });

  describe('Ability - Nectar Block', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(NECTAR_BLOCK.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(NECTAR_BLOCK.abilities[0].name).toBe('Nectar Block');
    });

    test('should have correct effects', () => {
      expect(NECTAR_BLOCK.abilities[0].effects).toBeDefined();
      expect(NECTAR_BLOCK.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
