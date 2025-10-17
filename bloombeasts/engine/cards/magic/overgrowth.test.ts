/**
 * Tests for Overgrowth magic card
 */

import { describe, test, expect } from '@jest/globals';
import { OVERGROWTH } from './overgrowth.js';
import { validateMagicCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, StatType, EffectDuration } from '../../types/abilities.js';

describe('Overgrowth Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(OVERGROWTH);
    });

    test('should have correct card properties', () => {
      expect(OVERGROWTH.id).toBe('overgrowth');
      expect(OVERGROWTH.name).toBe('Overgrowth');
      expect(OVERGROWTH.type).toBe('Magic');
      expect(OVERGROWTH.cost).toBe(3);
    });

    test('should not require a target', () => {
      expect(OVERGROWTH.targetRequired).toBe(false);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(OVERGROWTH.effects).toHaveLength(1);
    });

    test('should have stat modification effect', () => {
      const effect = OVERGROWTH.effects[0];
      expect(effect.type).toBe(EffectType.ModifyStats);
    });

    test('should target all allies', () => {
      const effect = OVERGROWTH.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should buff both attack and health', () => {
      const effect = OVERGROWTH.effects[0];
      if (effect.type === EffectType.ModifyStats) {
        expect(effect.stat).toBe(StatType.Both);
        expect(effect.value).toBe(2);
      }
    });

    test('should be permanent buff', () => {
      const effect = OVERGROWTH.effects[0];
      if (effect.type === EffectType.ModifyStats) {
        expect(effect.duration).toBe(EffectDuration.Permanent);
      }
    });
  });

  describe('Card Balance', () => {
    test('should be expensive board buff', () => {
      expect(OVERGROWTH.cost).toBe(3);
    });

    test('should reward going wide', () => {
      const effect = OVERGROWTH.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should be a win condition finisher', () => {
      const effect = OVERGROWTH.effects[0];
      if (effect.type === EffectType.ModifyStats) {
        expect(effect.duration).toBe(EffectDuration.Permanent);
      }
    });

    test('should scale with board presence', () => {
      expect(OVERGROWTH.effects[0].target).toBe(AbilityTarget.AllAllies);
    });
  });
});
