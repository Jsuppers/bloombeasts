/**
 * Tests for Aether Swap - Magic card
 * Generated from JSON catalog
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateMagicCard,
  validateStructuredAbility,
  loadCardFromJSON,
} from '../testUtils.js';
import { StructuredAbility } from '../../types/abilities.js';

const AETHER_SWAP = loadCardFromJSON('aether-swap', 'magic');

describe('Aether Swap Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(AETHER_SWAP);
    });

    test('should have correct card properties', () => {
      expect(AETHER_SWAP.id).toBe('aether-swap');
      expect(AETHER_SWAP.name).toBe('Aether Swap');
      expect(AETHER_SWAP.type).toBe('Magic');
      expect(AETHER_SWAP.cost).toBe(1);
    });
  });

  describe('Ability - Aether Swap', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(AETHER_SWAP.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(AETHER_SWAP.abilities[0].name).toBe('Aether Swap');
    });

    test('should have correct effects', () => {
      expect(AETHER_SWAP.abilities[0].effects).toBeDefined();
      expect(AETHER_SWAP.abilities[0].effects.length).toBeGreaterThan(0);
    });
  });
});
