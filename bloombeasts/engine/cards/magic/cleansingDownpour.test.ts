/**
 * Tests for Cleansing Downpour magic card
 */

import { describe, test, expect } from '@jest/globals';
import { CLEANSING_DOWNPOUR } from './cleansingDownpour.js';
import { validateMagicCard, countEffectsByType } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, RemoveCounterEffect, DrawCardEffect } from '../../types/abilities.js';

describe('Cleansing Downpour Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(CLEANSING_DOWNPOUR);
    });

    test('should have correct card properties', () => {
      expect(CLEANSING_DOWNPOUR.id).toBe('cleansing-downpour');
      expect(CLEANSING_DOWNPOUR.name).toBe('Cleansing Downpour');
      expect(CLEANSING_DOWNPOUR.type).toBe('Magic');
      expect(CLEANSING_DOWNPOUR.cost).toBe(2);
    });

    test('should not require a target', () => {
      expect(CLEANSING_DOWNPOUR.targetRequired).toBe(false);
    });

    test('should have moderate cost for utility spell', () => {
      expect(CLEANSING_DOWNPOUR.cost).toBe(2);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly two effects', () => {
      expect(CLEANSING_DOWNPOUR.effects).toHaveLength(2);
    });

    test('should have remove counter effect', () => {
      const removeCounterEffects = countEffectsByType(CLEANSING_DOWNPOUR.effects, EffectType.RemoveCounter);
      expect(removeCounterEffects).toBe(1);
    });

    test('should have draw card effect', () => {
      const drawEffects = countEffectsByType(CLEANSING_DOWNPOUR.effects, EffectType.DrawCards);
      expect(drawEffects).toBe(1);
    });
  });

  describe('Remove Counter Effect', () => {
    test('should target all units on the field', () => {
      const removeEffect = CLEANSING_DOWNPOUR.effects[0] as RemoveCounterEffect;
      expect(removeEffect.type).toBe(EffectType.RemoveCounter);
      expect(removeEffect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should remove all counter types', () => {
      const removeEffect = CLEANSING_DOWNPOUR.effects[0] as RemoveCounterEffect;
      // No specific counter type means remove all counters
      expect(removeEffect.counter).toBeUndefined();
    });

    test('should be a mass cleansing effect', () => {
      const removeEffect = CLEANSING_DOWNPOUR.effects[0] as RemoveCounterEffect;
      expect(removeEffect.target).toBe(AbilityTarget.AllUnits);
    });
  });

  describe('Draw Card Effect', () => {
    test('should draw 1 card for the player', () => {
      const drawEffect = CLEANSING_DOWNPOUR.effects[1] as DrawCardEffect;
      expect(drawEffect.type).toBe(EffectType.DrawCards);
      expect(drawEffect.target).toBe(AbilityTarget.PlayerGardener);
      expect(drawEffect.value).toBe(1);
    });

    test('should provide card replacement', () => {
      // Card replaces itself by drawing 1
      const drawEffect = CLEANSING_DOWNPOUR.effects[1] as DrawCardEffect;
      expect(drawEffect.value).toBe(1);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 2 cost', () => {
      // 2 cost for mass counter removal + card draw is reasonable
      expect(CLEANSING_DOWNPOUR.cost).toBe(2);
      expect(CLEANSING_DOWNPOUR.effects).toHaveLength(2);
    });

    test('should be situationally powerful', () => {
      // Most valuable when counters are present
      const removeEffect = CLEANSING_DOWNPOUR.effects[0] as RemoveCounterEffect;
      expect(removeEffect.type).toBe(EffectType.RemoveCounter);
      expect(removeEffect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should never be a dead card due to card draw', () => {
      // Always draws 1 card, so worst case it cycles
      const drawEffect = CLEANSING_DOWNPOUR.effects[1] as DrawCardEffect;
      expect(drawEffect.type).toBe(EffectType.DrawCards);
      expect(drawEffect.value).toBe(1);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have cleansing/water-themed name', () => {
      expect(CLEANSING_DOWNPOUR.name).toContain('Cleansing');
      expect(CLEANSING_DOWNPOUR.name).toContain('Downpour');
    });

    test('should wash away negative effects', () => {
      const removeEffect = CLEANSING_DOWNPOUR.effects[0] as RemoveCounterEffect;
      expect(removeEffect.type).toBe(EffectType.RemoveCounter);
      expect(removeEffect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should have utility/support nature', () => {
      // Remove counters + draw is utility-focused
      expect(countEffectsByType(CLEANSING_DOWNPOUR.effects, EffectType.RemoveCounter)).toBe(1);
      expect(countEffectsByType(CLEANSING_DOWNPOUR.effects, EffectType.DrawCards)).toBe(1);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should counter status-based strategies', () => {
      // Removes all counters from all units
      const removeEffect = CLEANSING_DOWNPOUR.effects[0] as RemoveCounterEffect;
      expect(removeEffect.type).toBe(EffectType.RemoveCounter);
      expect(removeEffect.counter).toBeUndefined(); // All counters
    });

    test('should be usable without specific targets', () => {
      expect(CLEANSING_DOWNPOUR.targetRequired).toBe(false);
    });

    test('should affect both friendly and enemy units', () => {
      // AllUnits means both sides
      const removeEffect = CLEANSING_DOWNPOUR.effects[0] as RemoveCounterEffect;
      expect(removeEffect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should provide card advantage through cycling', () => {
      // Replace itself when cast
      const drawEffect = CLEANSING_DOWNPOUR.effects[1] as DrawCardEffect;
      expect(drawEffect.value).toBe(1);
    });
  });

  describe('Counter Interactions', () => {
    test('should remove beneficial and detrimental counters', () => {
      // No counter type specified = remove all
      const removeEffect = CLEANSING_DOWNPOUR.effects[0] as RemoveCounterEffect;
      expect(removeEffect.counter).toBeUndefined();
    });

    test('should be a symmetrical effect', () => {
      // Affects all units equally
      const removeEffect = CLEANSING_DOWNPOUR.effects[0] as RemoveCounterEffect;
      expect(removeEffect.target).toBe(AbilityTarget.AllUnits);
    });
  });
});
