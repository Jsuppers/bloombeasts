/**
 * Tests for Battle Fury - Buff card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateBuffCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const BATTLE_FURY = loadCardFromJSON('battle-fury', 'buff');

describe('Battle Fury Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid buff card structure', () => {
      validateBuffCard(BATTLE_FURY);
    });

    test('should have correct card properties', () => {
      expect(BATTLE_FURY.id).toBe('battle-fury');
      expect(BATTLE_FURY.name).toBe('Battle Fury');
      expect(BATTLE_FURY.type).toBe('Buff');
      expect(BATTLE_FURY.cost).toBe(3);
    });
  });

  describe('Abilities', () => {
    test('should have at least one ability', () => {
      expect(BATTLE_FURY.abilities).toBeDefined();
      expect(BATTLE_FURY.abilities.length).toBeGreaterThan(0);
    });

    test('should have valid first ability', () => {
      validateStructuredAbility(BATTLE_FURY.abilities[0] as StructuredAbility);
    });
  });
});
