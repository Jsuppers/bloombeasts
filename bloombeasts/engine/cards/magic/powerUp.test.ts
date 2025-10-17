/**
 * Tests for Power Up magic card
 */

import { describe, test, expect } from '@jest/globals';
import { POWER_UP } from './powerUp.js';
import { validateMagicCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, StatType, EffectDuration } from '../../types/abilities.js';

describe('Power Up Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(POWER_UP);
    });

    test('should have correct card properties', () => {
      expect(POWER_UP.id).toBe('power-up');
      expect(POWER_UP.name).toBe('Power Up');
      expect(POWER_UP.type).toBe('Magic');
      expect(POWER_UP.cost).toBe(2);
    });

    test('should require a target', () => {
      expect(POWER_UP.targetRequired).toBe(true);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(POWER_UP.effects).toHaveLength(1);
    });

    test('should have stat modification effect', () => {
      const effect = POWER_UP.effects[0];
      expect(effect.type).toBe(EffectType.ModifyStats);
    });

    test('should target a single unit', () => {
      const effect = POWER_UP.effects[0];
      expect(effect.target).toBe(AbilityTarget.Target);
    });

    test('should buff both attack and health by 3', () => {
      const effect = POWER_UP.effects[0];
      if (effect.type === EffectType.ModifyStats) {
        expect(effect.stat).toBe(StatType.Both);
        expect(effect.value).toBe(3);
      }
    });

    test('should be permanent buff', () => {
      const effect = POWER_UP.effects[0];
      if (effect.type === EffectType.ModifyStats) {
        expect(effect.duration).toBe(EffectDuration.Permanent);
      }
    });
  });

  describe('Card Balance', () => {
    test('should provide strong single-target buff', () => {
      expect(POWER_UP.cost).toBe(2);
      const effect = POWER_UP.effects[0];
      if (effect.type === EffectType.ModifyStats) {
        expect(effect.value).toBe(3);
      }
    });

    test('should be efficient combat trick', () => {
      expect(POWER_UP.targetRequired).toBe(true);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should strengthen key threats', () => {
      const effect = POWER_UP.effects[0];
      if (effect.type === EffectType.ModifyStats) {
        expect(effect.duration).toBe(EffectDuration.Permanent);
      }
    });

    test('should require target selection', () => {
      expect(POWER_UP.targetRequired).toBe(true);
    });
  });
});
