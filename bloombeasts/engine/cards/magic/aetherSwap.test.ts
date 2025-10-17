/**
 * Tests for Aether Swap magic card
 */

import { describe, test, expect } from '@jest/globals';
import { AETHER_SWAP } from './aetherSwap.js';
import { validateMagicCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

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

    test('should require a target', () => {
      expect(AETHER_SWAP.targetRequired).toBe(true);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(AETHER_SWAP.effects).toHaveLength(1);
    });

    test('should have swap positions effect', () => {
      const effect = AETHER_SWAP.effects[0];
      expect(effect.type).toBe(EffectType.SwapPositions);
    });

    test('should target units for swapping', () => {
      const effect = AETHER_SWAP.effects[0];
      expect(effect.target).toBe(AbilityTarget.Target);
    });
  });

  describe('Card Balance', () => {
    test('should be low cost utility spell', () => {
      expect(AETHER_SWAP.cost).toBe(1);
    });

    test('should provide tactical positioning advantage', () => {
      const effect = AETHER_SWAP.effects[0];
      expect(effect.type).toBe(EffectType.SwapPositions);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should enable repositioning strategies', () => {
      expect(AETHER_SWAP.effects[0].type).toBe(EffectType.SwapPositions);
    });

    test('should require tactical decision making', () => {
      expect(AETHER_SWAP.targetRequired).toBe(true);
    });

    test('should be versatile utility card', () => {
      expect(AETHER_SWAP.cost).toBe(1);
      expect(AETHER_SWAP.targetRequired).toBe(true);
    });
  });
});
