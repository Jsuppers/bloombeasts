/**
 * Tests for Purify magic card
 */

import { describe, test, expect } from '@jest/globals';
import { PURIFY } from './purify.js';
import { validateMagicCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Purify Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(PURIFY);
    });

    test('should have correct card properties', () => {
      expect(PURIFY.id).toBe('purify');
      expect(PURIFY.name).toBe('Purify');
      expect(PURIFY.type).toBe('Magic');
      expect(PURIFY.cost).toBe(1);
    });

    test('should require a target', () => {
      expect(PURIFY.targetRequired).toBe(true);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(PURIFY.effects).toHaveLength(1);
    });

    test('should have remove counter effect', () => {
      const effect = PURIFY.effects[0];
      expect(effect.type).toBe(EffectType.RemoveCounter);
    });

    test('should target a single unit', () => {
      const effect = PURIFY.effects[0];
      expect(effect.target).toBe(AbilityTarget.Target);
    });

    test('should remove all counters', () => {
      const effect = PURIFY.effects[0];
      if (effect.type === EffectType.RemoveCounter) {
        expect(effect.counter).toBeUndefined();
      }
    });
  });

  describe('Card Balance', () => {
    test('should be low cost utility spell', () => {
      expect(PURIFY.cost).toBe(1);
    });

    test('should counter negative effects', () => {
      expect(PURIFY.effects[0].type).toBe(EffectType.RemoveCounter);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should cleanse debuffed units', () => {
      expect(PURIFY.effects[0].type).toBe(EffectType.RemoveCounter);
    });

    test('should be situational tech card', () => {
      expect(PURIFY.targetRequired).toBe(true);
      expect(PURIFY.cost).toBe(1);
    });

    test('should remove all counter types', () => {
      const effect = PURIFY.effects[0];
      if (effect.type === EffectType.RemoveCounter) {
        expect(effect.counter).toBeUndefined();
      }
    });
  });
});
