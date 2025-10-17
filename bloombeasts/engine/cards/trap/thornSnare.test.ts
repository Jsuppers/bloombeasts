/**
 * Tests for Thorn Snare trap card
 */

import { describe, test, expect } from '@jest/globals';
import { THORN_SNARE } from './thornSnare.js';
import { validateTrapCard } from '../__tests__/testUtils.js';
import { TrapTrigger } from '../../types/core.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Thorn Snare Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(THORN_SNARE);
    });

    test('should have correct card properties', () => {
      expect(THORN_SNARE.id).toBe('thorn-snare');
      expect(THORN_SNARE.name).toBe('Thorn Snare');
      expect(THORN_SNARE.type).toBe('Trap');
      expect(THORN_SNARE.cost).toBe(2);
    });
  });

  describe('Trap Activation', () => {
    test('should have activation configuration', () => {
      expect(THORN_SNARE.activation).toBeDefined();
      expect(THORN_SNARE.activation.trigger).toBeDefined();
    });

    test('should trigger on attack', () => {
      expect(THORN_SNARE.activation.trigger).toBe(TrapTrigger.OnAttack);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly two effects', () => {
      expect(THORN_SNARE.effects).toHaveLength(2);
    });

    test('should have prevent attack effect', () => {
      const effect = THORN_SNARE.effects[0];
      expect(effect.type).toBe(EffectType.PreventAttack);
    });

    test('should have damage effect', () => {
      const effect = THORN_SNARE.effects[1];
      expect(effect.type).toBe(EffectType.DealDamage);
    });

    test('should target the attacker', () => {
      const preventEffect = THORN_SNARE.effects[0];
      const damageEffect = THORN_SNARE.effects[1];
      expect(preventEffect.target).toBe(AbilityTarget.Attacker);
      expect(damageEffect.target).toBe(AbilityTarget.Attacker);
    });

    test('should deal 2 damage', () => {
      const effect = THORN_SNARE.effects[1];
      if (effect.type === EffectType.DealDamage) {
        expect(effect.value).toBe(2);
      }
    });
  });

  describe('Card Balance', () => {
    test('should provide strong defensive value', () => {
      expect(THORN_SNARE.cost).toBe(2);
      expect(THORN_SNARE.effects).toHaveLength(2);
    });

    test('should prevent attack and punish attacker', () => {
      expect(THORN_SNARE.effects[0].type).toBe(EffectType.PreventAttack);
      expect(THORN_SNARE.effects[1].type).toBe(EffectType.DealDamage);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should protect key units', () => {
      expect(THORN_SNARE.effects[0].type).toBe(EffectType.PreventAttack);
    });

    test('should be upgraded Bear Trap', () => {
      expect(THORN_SNARE.activation.trigger).toBe(TrapTrigger.OnAttack);
      expect(THORN_SNARE.cost).toBe(2);
    });
  });
});
