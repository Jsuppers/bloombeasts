/**
 * Tests for Vaporize trap card
 */

import { describe, test, expect } from '@jest/globals';
import { VAPORIZE } from './vaporize.js';
import { validateTrapCard } from '../__tests__/testUtils.js';
import { TrapTrigger, TrapConditionType } from '../../types/core.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Vaporize Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(VAPORIZE);
    });

    test('should have correct card properties', () => {
      expect(VAPORIZE.id).toBe('vaporize');
      expect(VAPORIZE.name).toBe('Vaporize');
      expect(VAPORIZE.type).toBe('Trap');
      expect(VAPORIZE.cost).toBe(2);
    });
  });

  describe('Trap Activation', () => {
    test('should have activation configuration', () => {
      expect(VAPORIZE.activation).toBeDefined();
      expect(VAPORIZE.activation.trigger).toBeDefined();
    });

    test('should trigger on bloom play', () => {
      expect(VAPORIZE.activation.trigger).toBe(TrapTrigger.OnBloomPlay);
    });

    test('should have cost condition', () => {
      expect(VAPORIZE.activation.condition).toBeDefined();
      expect(VAPORIZE.activation.condition?.type).toBe(TrapConditionType.CostBelow);
    });

    test('should only work on low cost blooms', () => {
      expect(VAPORIZE.activation.condition?.value).toBe(4);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(VAPORIZE.effects).toHaveLength(1);
    });

    test('should have destroy effect', () => {
      const effect = VAPORIZE.effects[0];
      expect(effect.type).toBe(EffectType.Destroy);
    });

    test('should target the bloom being played', () => {
      const effect = VAPORIZE.effects[0];
      expect(effect.target).toBe(AbilityTarget.Target);
    });
  });

  describe('Card Balance', () => {
    test('should be narrow but powerful', () => {
      expect(VAPORIZE.cost).toBe(2);
      expect(VAPORIZE.activation.condition).toBeDefined();
    });

    test('should counter early game blooms', () => {
      expect(VAPORIZE.activation.trigger).toBe(TrapTrigger.OnBloomPlay);
      expect(VAPORIZE.activation.condition?.type).toBe(TrapConditionType.CostBelow);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should punish aggressive bloom plays', () => {
      const effect = VAPORIZE.effects[0];
      expect(effect.type).toBe(EffectType.Destroy);
    });

    test('should have limited applicability', () => {
      expect(VAPORIZE.activation.condition).toBeDefined();
    });

    test('should be early game tech card', () => {
      expect(VAPORIZE.activation.condition?.value).toBe(4);
    });
  });
});
