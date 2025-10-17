/**
 * Tests for Emergency Bloom trap card
 */

import { describe, test, expect } from '@jest/globals';
import { EMERGENCY_BLOOM } from './emergencyBloom.js';
import { validateTrapCard } from '../__tests__/testUtils.js';
import { TrapTrigger } from '../../types/core.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Emergency Bloom Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(EMERGENCY_BLOOM);
    });

    test('should have correct card properties', () => {
      expect(EMERGENCY_BLOOM.id).toBe('emergency-bloom');
      expect(EMERGENCY_BLOOM.name).toBe('Emergency Bloom');
      expect(EMERGENCY_BLOOM.type).toBe('Trap');
      expect(EMERGENCY_BLOOM.cost).toBe(1);
    });
  });

  describe('Trap Activation', () => {
    test('should have activation configuration', () => {
      expect(EMERGENCY_BLOOM.activation).toBeDefined();
      expect(EMERGENCY_BLOOM.activation.trigger).toBeDefined();
    });

    test('should trigger when unit is destroyed', () => {
      expect(EMERGENCY_BLOOM.activation.trigger).toBe(TrapTrigger.OnDestroy);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(EMERGENCY_BLOOM.effects).toHaveLength(1);
    });

    test('should have draw cards effect', () => {
      const effect = EMERGENCY_BLOOM.effects[0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should target the player', () => {
      const effect = EMERGENCY_BLOOM.effects[0];
      expect(effect.target).toBe(AbilityTarget.PlayerGardener);
    });

    test('should draw 2 cards', () => {
      const effect = EMERGENCY_BLOOM.effects[0];
      if (effect.type === EffectType.DrawCards) {
        expect(effect.value).toBe(2);
      }
    });
  });

  describe('Card Balance', () => {
    test('should provide card advantage', () => {
      expect(EMERGENCY_BLOOM.cost).toBe(1);
      const effect = EMERGENCY_BLOOM.effects[0];
      if (effect.type === EffectType.DrawCards) {
        expect(effect.value).toBe(2);
      }
    });

    test('should mitigate unit loss', () => {
      expect(EMERGENCY_BLOOM.activation.trigger).toBe(TrapTrigger.OnDestroy);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should provide recovery after board wipe', () => {
      expect(EMERGENCY_BLOOM.effects[0].type).toBe(EffectType.DrawCards);
    });

    test('should turn destruction into card advantage', () => {
      expect(EMERGENCY_BLOOM.activation.trigger).toBe(TrapTrigger.OnDestroy);
    });
  });
});
