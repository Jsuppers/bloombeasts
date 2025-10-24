/**
 * Tests for Magic Shield - Trap card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateTrapCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const MAGIC_SHIELD = loadCardFromJSON('magic-shield', 'trap');

describe('Magic Shield Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(MAGIC_SHIELD);
    });

    test('should have correct card properties', () => {
      expect(MAGIC_SHIELD.id).toBe('magic-shield');
      expect(MAGIC_SHIELD.name).toBe('Magic Shield');
      expect(MAGIC_SHIELD.type).toBe('Trap');
      expect(MAGIC_SHIELD.cost).toBe(1);
    });

    test('should have activation trigger', () => {
      expect(MAGIC_SHIELD.activation).toBeDefined();
      expect(MAGIC_SHIELD.activation.trigger).toBeDefined();
    });
  });

  describe('Ability - Magic Shield', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(MAGIC_SHIELD.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(MAGIC_SHIELD.abilities[0].name).toBe('Magic Shield');
    });

    test('should have correct effects', () => {
      expect(MAGIC_SHIELD.abilities[0].effects).toBeDefined();
      expect(MAGIC_SHIELD.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
