/**
 * Tests for Swift Wind - Buff card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateBuffCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const SWIFT_WIND = loadCardFromJSON('swift-wind', 'buff');

describe('Swift Wind Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid buff card structure', () => {
      validateBuffCard(SWIFT_WIND);
    });

    test('should have correct card properties', () => {
      expect(SWIFT_WIND.id).toBe('swift-wind');
      expect(SWIFT_WIND.name).toBe('Swift Wind');
      expect(SWIFT_WIND.type).toBe('Buff');
      expect(SWIFT_WIND.cost).toBe(2);
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(SWIFT_WIND.abilities).toBeDefined();
      expect(SWIFT_WIND.abilities.length).toBeGreaterThan(0);
    });

    test('should have valid first ability', () => {
      validateStructuredAbility(SWIFT_WIND.abilities[0] as StructuredAbility);
    });
  });
});
