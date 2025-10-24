/**
 * Tests for Nature\'s Blessing - Buff card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateBuffCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const NATURES_BLESSING = loadCardFromJSON('natures-blessing', 'buff');

describe('Nature\'s Blessing Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid buff card structure', () => {
      validateBuffCard(NATURES_BLESSING);
    });

    test('should have correct card properties', () => {
      expect(NATURES_BLESSING.id).toBe('natures-blessing');
      expect(NATURES_BLESSING.name).toBe('Nature\'s Blessing');
      expect(NATURES_BLESSING.type).toBe('Buff');
      expect(NATURES_BLESSING.cost).toBe(4);
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(NATURES_BLESSING.abilities).toBeDefined();
      expect(NATURES_BLESSING.abilities.length).toBeGreaterThan(0);
    });

    test('should have valid first ability', () => {
      validateStructuredAbility(NATURES_BLESSING.abilities[0] as StructuredAbility);
    });
  });
});
