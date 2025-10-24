/**
 * Tests for Vaporize - Trap card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateTrapCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const VAPORIZE = loadCardFromJSON('vaporize', 'trap');

describe('Vaporize Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(VAPORIZE);
    });

    test('should have correct card properties', () => {
      expect(VAPORIZE.id).toBe('vaporize');
      expect(VAPORIZE.name).toBe('Vaporize');
      expect(VAPORIZE.type).toBe('Trap');
      expect(VAPORIZE.cost).toBe(2);
    });

    test('should have activation trigger', () => {
      expect(VAPORIZE.activation).toBeDefined();
      expect(VAPORIZE.activation.trigger).toBeDefined();
    });
  });

  describe('Ability - Vaporize', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(VAPORIZE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(VAPORIZE.abilities[0].name).toBe('Vaporize');
    });

    test('should have correct effects', () => {
      expect(VAPORIZE.abilities[0].effects).toBeDefined();
      expect(VAPORIZE.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
