/**
 * Tests for Nectar Block magic card
 */

import { describe, test, expect } from '@jest/globals';
import { NECTAR_BLOCK } from './nectarBlock.js';
import { validateMagicCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, ResourceType, EffectDuration, ResourceGainEffect } from '../../types/abilities.js';

describe('Nectar Block Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(NECTAR_BLOCK);
    });

    test('should have correct card properties', () => {
      expect(NECTAR_BLOCK.id).toBe('nectar-block');
      expect(NECTAR_BLOCK.name).toBe('Nectar Block');
      expect(NECTAR_BLOCK.type).toBe('Magic');
      expect(NECTAR_BLOCK.cost).toBe(0);
    });

    test('should not require a target', () => {
      expect(NECTAR_BLOCK.targetRequired).toBe(false);
    });

    test('should be free to cast (0 cost)', () => {
      expect(NECTAR_BLOCK.cost).toBe(0);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(NECTAR_BLOCK.effects).toHaveLength(1);
    });

    test('should have resource gain effect', () => {
      const effect = NECTAR_BLOCK.effects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });

    test('should target the player', () => {
      const effect = NECTAR_BLOCK.effects[0] as ResourceGainEffect;
      expect(effect.target).toBe(AbilityTarget.PlayerGardener);
    });

    test('should grant Nectar resource', () => {
      const effect = NECTAR_BLOCK.effects[0] as ResourceGainEffect;
      expect(effect.resource).toBe(ResourceType.Nectar);
    });

    test('should grant 2 temporary Nectar', () => {
      const effect = NECTAR_BLOCK.effects[0] as ResourceGainEffect;
      expect(effect.value).toBe(2);
      expect(effect.duration).toBe(EffectDuration.ThisTurn);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 0 cost', () => {
      // 0-cost card providing temporary resources is reasonable
      expect(NECTAR_BLOCK.cost).toBe(0);
      const effect = NECTAR_BLOCK.effects[0] as ResourceGainEffect;
      expect(effect.value).toBe(2);
      // Temporary (this turn) resource is weaker than permanent
      expect(effect.duration).toBe(EffectDuration.ThisTurn);
    });

    test('should be simple and focused', () => {
      // Single effect, no targeting complexity
      expect(NECTAR_BLOCK.effects).toHaveLength(1);
      expect(NECTAR_BLOCK.targetRequired).toBe(false);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have resource-related name', () => {
      expect(NECTAR_BLOCK.name).toContain('Nectar');
    });

    test('should be a basic resource generation spell', () => {
      const effect = NECTAR_BLOCK.effects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
      expect(effect.resource).toBe(ResourceType.Nectar);
    });

    test('should provide temporary boost for this turn only', () => {
      const effect = NECTAR_BLOCK.effects[0] as ResourceGainEffect;
      expect(effect.duration).toBe(EffectDuration.ThisTurn);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should enable emergency plays when short on resources', () => {
      // Free card that gives 2 temporary nectar
      expect(NECTAR_BLOCK.cost).toBe(0);
      const effect = NECTAR_BLOCK.effects[0] as ResourceGainEffect;
      expect(effect.value).toBe(2);
    });

    test('should not provide permanent resource advantage', () => {
      const effect = NECTAR_BLOCK.effects[0] as ResourceGainEffect;
      expect(effect.duration).toBe(EffectDuration.ThisTurn);
    });

    test('should be usable at any time without target', () => {
      expect(NECTAR_BLOCK.targetRequired).toBe(false);
      expect(NECTAR_BLOCK.cost).toBe(0);
    });
  });
});
