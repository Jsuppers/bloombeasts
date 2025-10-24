/**
 * Tests for Deep Sea Grotto - Habitat card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateHabitatCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const DEEP_SEA_GROTTO = loadCardFromJSON('deep-sea-grotto', 'water');

describe('Deep Sea Grotto Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid habitat card structure', () => {
      validateHabitatCard(DEEP_SEA_GROTTO);
    });

    test('should have correct card properties', () => {
      expect(DEEP_SEA_GROTTO.id).toBe('deep-sea-grotto');
      expect(DEEP_SEA_GROTTO.name).toBe('Deep Sea Grotto');
      expect(DEEP_SEA_GROTTO.type).toBe('Habitat');
      expect(DEEP_SEA_GROTTO.affinity).toBe('Water');
      expect(DEEP_SEA_GROTTO.cost).toBe(1);
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(DEEP_SEA_GROTTO.abilities).toBeDefined();
      expect(DEEP_SEA_GROTTO.abilities.length).toBeGreaterThan(0);
    });
  });
});
