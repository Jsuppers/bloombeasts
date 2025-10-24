/**
 * Tests for Volcanic Scar - Habitat card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateHabitatCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const VOLCANIC_SCAR = loadCardFromJSON('volcanic-scar', 'fire');

describe('Volcanic Scar Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid habitat card structure', () => {
      validateHabitatCard(VOLCANIC_SCAR);
    });

    test('should have correct card properties', () => {
      expect(VOLCANIC_SCAR.id).toBe('volcanic-scar');
      expect(VOLCANIC_SCAR.name).toBe('Volcanic Scar');
      expect(VOLCANIC_SCAR.type).toBe('Habitat');
      expect(VOLCANIC_SCAR.affinity).toBe('Fire');
      expect(VOLCANIC_SCAR.cost).toBe(1);
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(VOLCANIC_SCAR.abilities).toBeDefined();
      expect(VOLCANIC_SCAR.abilities.length).toBeGreaterThan(0);
    });
  });
});
