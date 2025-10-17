/**
 * Tests for Nectar Drain magic card
 */

import { describe, test, expect } from '@jest/globals';
import { NECTAR_DRAIN } from './nectarDrain.js';
import { validateMagicCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, ResourceType } from '../../types/abilities.js';

describe('Nectar Drain Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid magic card structure', () => {
      validateMagicCard(NECTAR_DRAIN);
    });

    test('should have correct card properties', () => {
      expect(NECTAR_DRAIN.id).toBe('nectar-drain');
      expect(NECTAR_DRAIN.name).toBe('Nectar Drain');
      expect(NECTAR_DRAIN.type).toBe('Magic');
      expect(NECTAR_DRAIN.cost).toBe(1);
    });

    test('should not require a target', () => {
      expect(NECTAR_DRAIN.targetRequired).toBe(false);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly two effects', () => {
      expect(NECTAR_DRAIN.effects).toHaveLength(2);
    });

    test('should have resource gain effect', () => {
      const drainEffect = NECTAR_DRAIN.effects[0];
      expect(drainEffect.type).toBe(EffectType.GainResource);
    });

    test('should have draw card effect', () => {
      const drawEffect = NECTAR_DRAIN.effects[1];
      expect(drawEffect.type).toBe(EffectType.DrawCards);
    });

    test('should gain nectar for player', () => {
      const drainEffect = NECTAR_DRAIN.effects[0];
      expect(drainEffect.target).toBe(AbilityTarget.PlayerGardener);
      if (drainEffect.type === EffectType.GainResource) {
        expect(drainEffect.resource).toBe(ResourceType.Nectar);
        expect(drainEffect.value).toBe(2);
      }
    });

    test('should draw 1 card', () => {
      const drawEffect = NECTAR_DRAIN.effects[1];
      if (drawEffect.type === EffectType.DrawCards) {
        expect(drawEffect.value).toBe(1);
      }
    });
  });

  describe('Card Balance', () => {
    test('should provide resource and card advantage', () => {
      expect(NECTAR_DRAIN.cost).toBe(1);
      expect(NECTAR_DRAIN.effects).toHaveLength(2);
    });

    test('should be similar to Nectar Surge', () => {
      expect(NECTAR_DRAIN.cost).toBe(1);
      const drainEffect = NECTAR_DRAIN.effects[0];
      if (drainEffect.type === EffectType.GainResource) {
        expect(drainEffect.resource).toBe(ResourceType.Nectar);
      }
    });
  });

  describe('Strategic Use Cases', () => {
    test('should provide tempo and card advantage', () => {
      expect(NECTAR_DRAIN.effects).toHaveLength(2);
    });

    test('should enable resource ramp strategies', () => {
      const drainEffect = NECTAR_DRAIN.effects[0];
      if (drainEffect.type === EffectType.GainResource) {
        expect(drainEffect.resource).toBe(ResourceType.Nectar);
      }
    });
  });
});
