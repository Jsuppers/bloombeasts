/**
 * Tests for Thorn Snare - Trap card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateTrapCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const THORN_SNARE = loadCardFromJSON('thorn-snare', 'trap');

describe('Thorn Snare Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(THORN_SNARE);
    });

    test('should have correct card properties', () => {
      expect(THORN_SNARE.id).toBe('thorn-snare');
      expect(THORN_SNARE.name).toBe('Thorn Snare');
      expect(THORN_SNARE.type).toBe('Trap');
      expect(THORN_SNARE.cost).toBe(2);
    });

    test('should have activation trigger', () => {
      expect(THORN_SNARE.activation).toBeDefined();
      expect(THORN_SNARE.activation.trigger).toBeDefined();
    });
  });

  describe('Ability - Thorn Snare', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(THORN_SNARE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(THORN_SNARE.abilities[0].name).toBe('Thorn Snare');
    });

    test('should have correct effects', () => {
      expect(THORN_SNARE.abilities[0].effects).toBeDefined();
      expect(THORN_SNARE.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
