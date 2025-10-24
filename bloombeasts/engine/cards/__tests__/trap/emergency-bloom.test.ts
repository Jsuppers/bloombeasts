/**
 * Tests for Emergency Bloom - Trap card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateTrapCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const EMERGENCY_BLOOM = loadCardFromJSON('emergency-bloom', 'trap');

describe('Emergency Bloom Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(EMERGENCY_BLOOM);
    });

    test('should have correct card properties', () => {
      expect(EMERGENCY_BLOOM.id).toBe('emergency-bloom');
      expect(EMERGENCY_BLOOM.name).toBe('Emergency Bloom');
      expect(EMERGENCY_BLOOM.type).toBe('Trap');
      expect(EMERGENCY_BLOOM.cost).toBe(1);
    });

    test('should have activation trigger', () => {
      expect(EMERGENCY_BLOOM.activation).toBeDefined();
      expect(EMERGENCY_BLOOM.activation.trigger).toBeDefined();
    });
  });

  describe('Ability - Emergency Bloom', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(EMERGENCY_BLOOM.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(EMERGENCY_BLOOM.abilities[0].name).toBe('Emergency Bloom');
    });

    test('should have correct effects', () => {
      expect(EMERGENCY_BLOOM.abilities[0].effects).toBeDefined();
      expect(EMERGENCY_BLOOM.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
