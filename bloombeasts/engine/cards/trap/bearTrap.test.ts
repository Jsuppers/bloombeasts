/**
 * Tests for Bear Trap trap card
 */

import { describe, test, expect } from '@jest/globals';
import { BEAR_TRAP } from './bearTrap.js';
import { validateTrapCard } from '../__tests__/testUtils.js';
import { TrapTrigger } from '../../types/core.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Bear Trap Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(BEAR_TRAP);
    });

    test('should have correct card properties', () => {
      expect(BEAR_TRAP.id).toBe('bear-trap');
      expect(BEAR_TRAP.name).toBe('Bear Trap');
      expect(BEAR_TRAP.type).toBe('Trap');
      expect(BEAR_TRAP.cost).toBe(1);
    });
  });

  describe('Trap Activation', () => {
    test('should have activation configuration', () => {
      expect(BEAR_TRAP.activation).toBeDefined();
      expect(BEAR_TRAP.activation.trigger).toBeDefined();
    });

    test('should trigger on attack', () => {
      expect(BEAR_TRAP.activation.trigger).toBe(TrapTrigger.OnAttack);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(BEAR_TRAP.effects).toHaveLength(1);
    });

    test('should have damage effect', () => {
      const effect = BEAR_TRAP.effects[0];
      expect(effect.type).toBe(EffectType.DealDamage);
    });

    test('should target the attacker', () => {
      const effect = BEAR_TRAP.effects[0];
      expect(effect.target).toBe(AbilityTarget.Attacker);
    });

    test('should deal 3 damage', () => {
      const effect = BEAR_TRAP.effects[0];
      if (effect.type === EffectType.DealDamage) {
        expect(effect.value).toBe(3);
      }
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 1 cost', () => {
      expect(BEAR_TRAP.cost).toBe(1);
      const effect = BEAR_TRAP.effects[0];
      if (effect.type === EffectType.DealDamage) {
        expect(effect.value).toBe(3);
      }
    });

    test('should punish aggressive strategies', () => {
      expect(BEAR_TRAP.activation.trigger).toBe(TrapTrigger.OnAttack);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should deter attacks', () => {
      expect(BEAR_TRAP.activation.trigger).toBe(TrapTrigger.OnAttack);
      const effect = BEAR_TRAP.effects[0];
      expect(effect.type).toBe(EffectType.DealDamage);
    });

    test('should punish the attacker', () => {
      const effect = BEAR_TRAP.effects[0];
      expect(effect.target).toBe(AbilityTarget.Attacker);
    });
  });
});
