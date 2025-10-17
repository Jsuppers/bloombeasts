/**
 * Tests for Elemental Burst magic card
 */

import { describe, test, expect } from '@jest/globals';
import { ELEMENTAL_BURST } from './elementalBurst.js';
import { validateMagicCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Elemental Burst Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(ELEMENTAL_BURST);
    });

    test('should have correct card properties', () => {
      expect(ELEMENTAL_BURST.id).toBe('elemental-burst');
      expect(ELEMENTAL_BURST.name).toBe('Elemental Burst');
      expect(ELEMENTAL_BURST.type).toBe('Magic');
      expect(ELEMENTAL_BURST.cost).toBe(3);
    });

    test('should not require a target', () => {
      expect(ELEMENTAL_BURST.targetRequired).toBe(false);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(ELEMENTAL_BURST.effects).toHaveLength(1);
    });

    test('should have damage effect', () => {
      const effect = ELEMENTAL_BURST.effects[0];
      expect(effect.type).toBe(EffectType.DealDamage);
    });

    test('should target all enemies', () => {
      const effect = ELEMENTAL_BURST.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllEnemies);
    });

    test('should deal 2 damage', () => {
      const effect = ELEMENTAL_BURST.effects[0];
      if (effect.type === EffectType.DealDamage) {
        expect(effect.value).toBe(2);
      }
    });
  });

  describe('Card Balance', () => {
    test('should be moderately expensive AOE spell', () => {
      expect(ELEMENTAL_BURST.cost).toBe(3);
    });

    test('should provide board clear potential', () => {
      const effect = ELEMENTAL_BURST.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllEnemies);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should punish wide boards', () => {
      const effect = ELEMENTAL_BURST.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllEnemies);
    });

    test('should be a board control tool', () => {
      expect(ELEMENTAL_BURST.effects[0].type).toBe(EffectType.DealDamage);
      expect(ELEMENTAL_BURST.effects[0].target).toBe(AbilityTarget.AllEnemies);
    });
  });
});
