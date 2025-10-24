/**
 * Tests for Mystic Shield - Buff card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateBuffCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const MYSTIC_SHIELD = loadCardFromJSON('mystic-shield', 'buff');

describe('Mystic Shield Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid buff card structure', () => {
      validateBuffCard(MYSTIC_SHIELD);
    });

    test('should have correct card properties', () => {
      expect(MYSTIC_SHIELD.id).toBe('mystic-shield');
      expect(MYSTIC_SHIELD.name).toBe('Mystic Shield');
      expect(MYSTIC_SHIELD.type).toBe('Buff');
      expect(MYSTIC_SHIELD.cost).toBe(3);
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(MYSTIC_SHIELD.abilities).toBeDefined();
      expect(MYSTIC_SHIELD.abilities.length).toBeGreaterThan(0);
    });

    test('should have valid first ability', () => {
      validateStructuredAbility(MYSTIC_SHIELD.abilities[0] as StructuredAbility);
    });
  });
});
