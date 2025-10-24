/**
 * Tests for Clear Zenith - Habitat card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateHabitatCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const CLEAR_ZENITH = loadCardFromJSON('clear-zenith', 'sky');

describe('Clear Zenith Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid habitat card structure', () => {
      validateHabitatCard(CLEAR_ZENITH);
    });

    test('should have correct card properties', () => {
      expect(CLEAR_ZENITH.id).toBe('clear-zenith');
      expect(CLEAR_ZENITH.name).toBe('Clear Zenith');
      expect(CLEAR_ZENITH.type).toBe('Habitat');
      expect(CLEAR_ZENITH.affinity).toBe('Sky');
      expect(CLEAR_ZENITH.cost).toBe(1);
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(CLEAR_ZENITH.abilities).toBeDefined();
      expect(CLEAR_ZENITH.abilities.length).toBeGreaterThan(0);
    });
  });
});
