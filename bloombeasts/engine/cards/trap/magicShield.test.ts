/**
 * Tests for Magic Shield trap card
 */

import { describe, test, expect } from '@jest/globals';
import { MAGIC_SHIELD } from './magicShield.js';
import { validateTrapCard } from '../__tests__/testUtils.js';
import { TrapTrigger } from '../../types/core.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Magic Shield Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(MAGIC_SHIELD);
    });

    test('should have correct card properties', () => {
      expect(MAGIC_SHIELD.id).toBe('magic-shield');
      expect(MAGIC_SHIELD.name).toBe('Magic Shield');
      expect(MAGIC_SHIELD.type).toBe('Trap');
      expect(MAGIC_SHIELD.cost).toBe(1);
    });
  });

  describe('Trap Activation', () => {
    test('should have activation configuration', () => {
      expect(MAGIC_SHIELD.activation).toBeDefined();
      expect(MAGIC_SHIELD.activation.trigger).toBeDefined();
    });

    test('should trigger on magic play', () => {
      expect(MAGIC_SHIELD.activation.trigger).toBe(TrapTrigger.OnMagicPlay);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(MAGIC_SHIELD.effects).toHaveLength(1);
    });

    test('should have nullify effect', () => {
      const effect = MAGIC_SHIELD.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
    });

    test('should target the magic card', () => {
      const effect = MAGIC_SHIELD.effects[0];
      expect(effect.target).toBe(AbilityTarget.Target);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 1 cost', () => {
      expect(MAGIC_SHIELD.cost).toBe(1);
      expect(MAGIC_SHIELD.effects).toHaveLength(1);
    });

    test('should counter magic strategies', () => {
      expect(MAGIC_SHIELD.activation.trigger).toBe(TrapTrigger.OnMagicPlay);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should protect from enemy spells', () => {
      expect(MAGIC_SHIELD.activation.trigger).toBe(TrapTrigger.OnMagicPlay);
      const effect = MAGIC_SHIELD.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
    });

    test('should be anti-magic tech card', () => {
      expect(MAGIC_SHIELD.activation.trigger).toBe(TrapTrigger.OnMagicPlay);
    });
  });
});
