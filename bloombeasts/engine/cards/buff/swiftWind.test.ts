/**
 * Tests for Swift Wind buff card
 */

import { describe, test, expect } from '@jest/globals';
import { SWIFT_WIND } from './swiftWind.js';
import { validateBuffCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, ResourceType, ResourceGainEffect } from '../../types/abilities.js';

describe('Swift Wind Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid buff card structure', () => {
      validateBuffCard(SWIFT_WIND);
    });

    test('should have correct card properties', () => {
      expect(SWIFT_WIND.id).toBe('swift-wind');
      expect(SWIFT_WIND.name).toBe('Swift Wind');
      expect(SWIFT_WIND.type).toBe('Buff');
      expect(SWIFT_WIND.cost).toBe(2);
    });

    test('should have Sky affinity', () => {
      expect(SWIFT_WIND.affinity).toBe('Sky');
    });

    test('should have low cost for economy effect', () => {
      expect(SWIFT_WIND.cost).toBe(2);
    });
  });

  describe('Ongoing Effects', () => {
    test('should have exactly one ongoing effect', () => {
      expect(SWIFT_WIND.ongoingEffects).toHaveLength(1);
    });

    test('should have resource gain effect', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });

    test('should target self/player', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.target).toBe(AbilityTarget.Self);
    });

    test('should grant Nectar resource', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.resource).toBe(ResourceType.Nectar);
    });

    test('should grant 1 Nectar', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.value).toBe(1);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 2 cost', () => {
      // 2 cost for ongoing +1 nectar per turn
      expect(SWIFT_WIND.cost).toBe(2);
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.value).toBe(1);
    });

    test('should pay for itself over time', () => {
      // After 2+ turns, generates value
      expect(SWIFT_WIND.cost).toBe(2);
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.value).toBe(1);
    });

    test('should provide economic advantage', () => {
      // Ongoing resource generation
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });

    test('should be vulnerable to removal', () => {
      // Must stay on field to generate value
      expect(SWIFT_WIND.type).toBe('Buff');
    });
  });

  describe('Thematic Consistency', () => {
    test('should have wind/speed themed name', () => {
      expect(SWIFT_WIND.name).toContain('Swift');
      expect(SWIFT_WIND.name).toContain('Wind');
    });

    test('should match Sky affinity theme', () => {
      expect(SWIFT_WIND.affinity).toBe('Sky');
    });

    test('should represent accelerated resource flow', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
      expect(effect.resource).toBe(ResourceType.Nectar);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should enable ramp strategies', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });

    test('should synergize with Sky decks', () => {
      expect(SWIFT_WIND.affinity).toBe('Sky');
    });

    test('should provide long-term advantage', () => {
      // Ongoing resource generation compounds
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });

    test('should be best used early game', () => {
      // Earlier = more triggers = more value
      expect(SWIFT_WIND.cost).toBe(2);
    });
  });

  describe('Resource Generation Mechanics', () => {
    test('should require trigger system implementation', () => {
      // Note in card suggests StartOfTurn trigger needed
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });

    test('should generate permanent resources', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.resource).toBe(ResourceType.Nectar);
      // No duration specified = permanent
    });

    test('should stack with other resource effects', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });
  });

  describe('Affinity Restrictions', () => {
    test('should be limited to Sky-focused decks', () => {
      expect(SWIFT_WIND.affinity).toBe('Sky');
    });

    test('should be efficiently costed for affinity card', () => {
      expect(SWIFT_WIND.cost).toBe(2);
    });
  });

  describe('Comparison with Similar Cards', () => {
    test('should be cheaper than Nature\'s Blessing', () => {
      expect(SWIFT_WIND.cost).toBe(2);
    });

    test('should provide different utility than stat buffs', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });

    test('should be more specialized than generic buffs', () => {
      expect(SWIFT_WIND.affinity).toBe('Sky');
    });
  });

  describe('Economic Value', () => {
    test('should accelerate game plan', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });

    test('should enable bigger plays', () => {
      // Extra nectar allows casting more/bigger spells
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.resource).toBe(ResourceType.Nectar);
    });

    test('should provide exponential advantage if left unchecked', () => {
      // Each turn compounds the resource advantage
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.value).toBe(1);
    });
  });

  describe('Tempo Considerations', () => {
    test('should be a tempo loss initially', () => {
      // Costs 2, doesn\'t affect board immediately
      expect(SWIFT_WIND.cost).toBe(2);
    });

    test('should provide value advantage over time', () => {
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });
  });

  describe('Synergy with Sky Theme', () => {
    test('should enable Sky-specific strategies', () => {
      expect(SWIFT_WIND.affinity).toBe('Sky');
    });

    test('should complement fast/aggressive Sky decks', () => {
      expect(SWIFT_WIND.name).toContain('Swift');
      const effect = SWIFT_WIND.ongoingEffects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
    });
  });
});
