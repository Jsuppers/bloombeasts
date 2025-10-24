/**
 * Tests for Ancient Forest - Habitat card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateHabitatCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const ANCIENT_FOREST = loadCardFromJSON('ancient-forest', 'forest');

describe('Ancient Forest Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid habitat card structure', () => {
      validateHabitatCard(ANCIENT_FOREST);
    });

    test('should have correct card properties', () => {
      expect(ANCIENT_FOREST.id).toBe('ancient-forest');
      expect(ANCIENT_FOREST.name).toBe('Ancient Forest');
      expect(ANCIENT_FOREST.type).toBe('Habitat');
      expect(ANCIENT_FOREST.affinity).toBe('Forest');
      expect(ANCIENT_FOREST.cost).toBe(0);
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(ANCIENT_FOREST.abilities).toBeDefined();
      expect(ANCIENT_FOREST.abilities.length).toBeGreaterThan(0);
    });
  });
});
