/**
 * Tests for Lightning Strike magic card
 */

import { describe, test, expect } from '@jest/globals';
import { LIGHTNING_STRIKE } from './lightningStrike.js';
import { validateMagicCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Lightning Strike Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(LIGHTNING_STRIKE);
    });

    test('should have correct card properties', () => {
      expect(LIGHTNING_STRIKE.id).toBe('lightning-strike');
      expect(LIGHTNING_STRIKE.name).toBe('Lightning Strike');
      expect(LIGHTNING_STRIKE.type).toBe('Magic');
      expect(LIGHTNING_STRIKE.cost).toBe(2);
    });

    test('should require a target', () => {
      expect(LIGHTNING_STRIKE.targetRequired).toBe(true);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(LIGHTNING_STRIKE.effects).toHaveLength(1);
    });

    test('should have damage effect', () => {
      const effect = LIGHTNING_STRIKE.effects[0];
      expect(effect.type).toBe(EffectType.DealDamage);
    });

    test('should target a single unit', () => {
      const effect = LIGHTNING_STRIKE.effects[0];
      expect(effect.target).toBe(AbilityTarget.Target);
    });

    test('should deal 5 damage', () => {
      const effect = LIGHTNING_STRIKE.effects[0];
      if (effect.type === EffectType.DealDamage) {
        expect(effect.value).toBe(5);
      }
    });

    test('should have piercing damage', () => {
      const effect = LIGHTNING_STRIKE.effects[0];
      if (effect.type === EffectType.DealDamage) {
        expect(effect.piercing).toBe(true);
      }
    });
  });

  describe('Card Balance', () => {
    test('should provide high single-target damage', () => {
      expect(LIGHTNING_STRIKE.cost).toBe(2);
      const effect = LIGHTNING_STRIKE.effects[0];
      if (effect.type === EffectType.DealDamage) {
        expect(effect.value).toBe(5);
      }
    });

    test('should be efficient removal spell', () => {
      const effect = LIGHTNING_STRIKE.effects[0];
      if (effect.type === EffectType.DealDamage) {
        expect(effect.piercing).toBe(true);
      }
    });
  });

  describe('Strategic Use Cases', () => {
    test('should remove high-priority threats', () => {
      expect(LIGHTNING_STRIKE.effects[0].type).toBe(EffectType.DealDamage);
      expect(LIGHTNING_STRIKE.targetRequired).toBe(true);
    });

    test('should bypass defensive abilities', () => {
      const effect = LIGHTNING_STRIKE.effects[0];
      if (effect.type === EffectType.DealDamage) {
        expect(effect.piercing).toBe(true);
      }
    });
  });
});
