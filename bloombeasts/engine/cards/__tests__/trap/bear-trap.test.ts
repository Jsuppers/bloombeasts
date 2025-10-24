/**
 * Tests for Bear Trap - Trap card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateTrapCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const BEAR_TRAP = loadCardFromJSON('bear-trap', 'trap');

describe('Bear Trap Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(BEAR_TRAP);
    });

    test('should have correct card properties', () => {
      expect(BEAR_TRAP.id).toBe('bear-trap');
      expect(BEAR_TRAP.name).toBe('Bear Trap');
      expect(BEAR_TRAP.type).toBe('Trap');
      expect(BEAR_TRAP.cost).toBe(1);
    });

    test('should have activation trigger', () => {
      expect(BEAR_TRAP.activation).toBeDefined();
      expect(BEAR_TRAP.activation.trigger).toBeDefined();
    });
  });

  describe('Ability - Bear Trap', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(BEAR_TRAP.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(BEAR_TRAP.abilities[0].name).toBe('Bear Trap');
    });

    test('should have correct effects', () => {
      expect(BEAR_TRAP.abilities[0].effects).toBeDefined();
      expect(BEAR_TRAP.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
