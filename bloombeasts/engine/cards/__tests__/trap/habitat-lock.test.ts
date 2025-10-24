/**
 * Tests for Habitat Lock - Trap card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateTrapCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const HABITAT_LOCK = loadCardFromJSON('habitat-lock', 'trap');

describe('Habitat Lock Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(HABITAT_LOCK);
    });

    test('should have correct card properties', () => {
      expect(HABITAT_LOCK.id).toBe('habitat-lock');
      expect(HABITAT_LOCK.name).toBe('Habitat Lock');
      expect(HABITAT_LOCK.type).toBe('Trap');
      expect(HABITAT_LOCK.cost).toBe(1);
    });

    test('should have activation trigger', () => {
      expect(HABITAT_LOCK.activation).toBeDefined();
      expect(HABITAT_LOCK.activation.trigger).toBeDefined();
    });
  });

  describe('Ability - Habitat Lock', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(HABITAT_LOCK.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(HABITAT_LOCK.abilities[0].name).toBe('Habitat Lock');
    });

    test('should have correct effects', () => {
      expect(HABITAT_LOCK.abilities[0].effects).toBeDefined();
      expect(HABITAT_LOCK.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
