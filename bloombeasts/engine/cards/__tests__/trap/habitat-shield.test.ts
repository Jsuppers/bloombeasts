/**
 * Tests for Habitat Shield - Trap card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateTrapCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const HABITAT_SHIELD = loadCardFromJSON('habitat-shield', 'trap');

describe('Habitat Shield Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(HABITAT_SHIELD);
    });

    test('should have correct card properties', () => {
      expect(HABITAT_SHIELD.id).toBe('habitat-shield');
      expect(HABITAT_SHIELD.name).toBe('Habitat Shield');
      expect(HABITAT_SHIELD.type).toBe('Trap');
      expect(HABITAT_SHIELD.cost).toBe(2);
    });

    test('should have activation trigger', () => {
      expect(HABITAT_SHIELD.activation).toBeDefined();
      expect(HABITAT_SHIELD.activation.trigger).toBeDefined();
    });
  });

  describe('Ability - Habitat Shield', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(HABITAT_SHIELD.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(HABITAT_SHIELD.abilities[0].name).toBe('Habitat Shield');
    });

    test('should have correct effects', () => {
      expect(HABITAT_SHIELD.abilities[0].effects).toBeDefined();
      expect(HABITAT_SHIELD.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
