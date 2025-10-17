/**
 * Tests for Habitat Shield trap card
 */

import { describe, test, expect } from '@jest/globals';
import { HABITAT_SHIELD } from './habitatShield.js';
import { validateTrapCard } from '../__tests__/testUtils.js';
import { TrapTrigger } from '../../types/core.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

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
  });

  describe('Trap Activation', () => {
    test('should have activation configuration', () => {
      expect(HABITAT_SHIELD.activation).toBeDefined();
      expect(HABITAT_SHIELD.activation.trigger).toBeDefined();
    });

    test('should trigger on habitat play', () => {
      expect(HABITAT_SHIELD.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly two effects', () => {
      expect(HABITAT_SHIELD.effects).toHaveLength(2);
    });

    test('should have nullify effect', () => {
      const effect = HABITAT_SHIELD.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
    });

    test('should have draw card effect', () => {
      const effect = HABITAT_SHIELD.effects[1];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should nullify the habitat', () => {
      const effect = HABITAT_SHIELD.effects[0];
      expect(effect.target).toBe(AbilityTarget.Target);
    });

    test('should draw 1 card', () => {
      const effect = HABITAT_SHIELD.effects[1];
      if (effect.type === EffectType.DrawCards) {
        expect(effect.value).toBe(1);
      }
    });
  });

  describe('Card Balance', () => {
    test('should provide value for 2 cost', () => {
      expect(HABITAT_SHIELD.cost).toBe(2);
      expect(HABITAT_SHIELD.effects).toHaveLength(2);
    });

    test('should be upgraded Habitat Lock', () => {
      expect(HABITAT_SHIELD.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
      expect(HABITAT_SHIELD.cost).toBe(2);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should counter habitat and replace itself', () => {
      const nullifyEffect = HABITAT_SHIELD.effects[0];
      const drawEffect = HABITAT_SHIELD.effects[1];
      expect(nullifyEffect.type).toBe(EffectType.NullifyEffect);
      expect(drawEffect.type).toBe(EffectType.DrawCards);
    });
  });
});
