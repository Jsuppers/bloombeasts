/**
 * Tests for Lightning Strike - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const LIGHTNING_STRIKE = loadCardFromJSON('lightning-strike', 'magic');

describe('Lightning Strike Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(LIGHTNING_STRIKE);
    });

    test('should have correct card properties', () => {
      expect(LIGHTNING_STRIKE.id).toBe('lightning-strike');
      expect(LIGHTNING_STRIKE.name).toBe('Lightning Strike');
      expect(LIGHTNING_STRIKE.type).toBe('Magic');
      expect(LIGHTNING_STRIKE.cost).toBe(2);
    });
  });

  describe('Ability - Lightning Strike', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(LIGHTNING_STRIKE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(LIGHTNING_STRIKE.abilities[0].name).toBe('Lightning Strike');
    });

    test('should have correct effects', () => {
      expect(LIGHTNING_STRIKE.abilities[0].effects).toBeDefined();
      expect(LIGHTNING_STRIKE.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
