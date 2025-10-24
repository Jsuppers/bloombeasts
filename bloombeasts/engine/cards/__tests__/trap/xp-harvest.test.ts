/**
 * Tests for XP Harvest - Trap card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateTrapCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const XP_HARVEST = loadCardFromJSON('xp-harvest', 'trap');

describe('XP Harvest Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(XP_HARVEST);
    });

    test('should have correct card properties', () => {
      expect(XP_HARVEST.id).toBe('xp-harvest');
      expect(XP_HARVEST.name).toBe('XP Harvest');
      expect(XP_HARVEST.type).toBe('Trap');
      expect(XP_HARVEST.cost).toBe(1);
    });

    test('should have activation trigger', () => {
      expect(XP_HARVEST.activation).toBeDefined();
      expect(XP_HARVEST.activation.trigger).toBeDefined();
    });
  });

  describe('Ability - XP Harvest', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(XP_HARVEST.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(XP_HARVEST.abilities[0].name).toBe('XP Harvest');
    });

    test('should have correct effects', () => {
      expect(XP_HARVEST.abilities[0].effects).toBeDefined();
      expect(XP_HARVEST.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
