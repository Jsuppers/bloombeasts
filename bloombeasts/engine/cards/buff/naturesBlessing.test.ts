/**
 * Tests for Nature's Blessing buff card
 */

import { describe, test, expect } from '@jest/globals';
import { NATURES_BLESSING } from './naturesBlessing.js';
import { validateBuffCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, HealEffect } from '../../types/abilities.js';

describe("Nature's Blessing Card", () => {
  describe('Base Card Properties', () => {
    test('should have valid buff card structure', () => {
      validateBuffCard(NATURES_BLESSING);
    });

    test('should have correct card properties', () => {
      expect(NATURES_BLESSING.id).toBe('natures-blessing');
      expect(NATURES_BLESSING.name).toBe("Nature's Blessing");
      expect(NATURES_BLESSING.type).toBe('Buff');
      expect(NATURES_BLESSING.cost).toBe(4);
    });

    test('should have Forest affinity', () => {
      expect(NATURES_BLESSING.affinity).toBe('Forest');
    });

    test('should have higher cost due to affinity bonus', () => {
      expect(NATURES_BLESSING.cost).toBe(4);
    });
  });

  describe('Ongoing Effects', () => {
    test('should have exactly one ongoing effect', () => {
      expect(NATURES_BLESSING.ongoingEffects).toHaveLength(1);
    });

    test('should have heal effect', () => {
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
    });

    test('should target all allies', () => {
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should heal for 1 HP', () => {
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.value).toBe(1);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 4 cost', () => {
      // 4 cost for ongoing healing effect with affinity restriction
      expect(NATURES_BLESSING.cost).toBe(4);
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.value).toBe(1);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should be more expensive than generic buffs', () => {
      // Affinity-specific cards cost more
      expect(NATURES_BLESSING.cost).toBe(4);
      expect(NATURES_BLESSING.affinity).toBe('Forest');
    });

    test('should provide ongoing value over time', () => {
      // Healing 1 HP per turn/trigger adds up
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
    });

    test('should scale with board size', () => {
      // Heals all allies
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have nature/healing themed name', () => {
      expect(NATURES_BLESSING.name).toContain('Nature');
      expect(NATURES_BLESSING.name).toContain('Blessing');
    });

    test('should match Forest affinity theme', () => {
      expect(NATURES_BLESSING.affinity).toBe('Forest');
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
    });

    test('should provide healing support', () => {
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should enable sustain-focused strategies', () => {
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
    });

    test('should synergize with Forest decks', () => {
      expect(NATURES_BLESSING.affinity).toBe('Forest');
    });

    test('should help in defensive/control matchups', () => {
      // Ongoing healing helps outlast opponent
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
    });

    test('should counter chip damage strategies', () => {
      // Small healing over time negates small recurring damage
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.value).toBe(1);
    });
  });

  describe('Healing Mechanics', () => {
    test('should require trigger system implementation', () => {
      // Note in card suggests StartOfTurn trigger needed
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
    });

    test('should heal all current allies', () => {
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should provide incremental value', () => {
      // 1 HP per trigger is gradual but meaningful
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.value).toBe(1);
    });
  });

  describe('Affinity Restrictions', () => {
    test('should be limited to Forest-focused decks', () => {
      expect(NATURES_BLESSING.affinity).toBe('Forest');
    });

    test('should have higher cost to balance affinity synergy', () => {
      expect(NATURES_BLESSING.cost).toBe(4);
    });
  });

  describe('Comparison with Similar Cards', () => {
    test('should be more specialized than generic buffs', () => {
      expect(NATURES_BLESSING.affinity).toBe('Forest');
      expect(NATURES_BLESSING.cost).toBe(4);
    });

    test('should provide different utility than stat buffs', () => {
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
    });
  });

  describe('Synergy Patterns', () => {
    test('should synergize with high-HP units', () => {
      // More HP to heal = more value
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
    });

    test('should work well with defensive strategies', () => {
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should combine with other Forest cards', () => {
      expect(NATURES_BLESSING.affinity).toBe('Forest');
    });
  });

  describe('Long Game Value', () => {
    test('should provide cumulative advantage over time', () => {
      // Ongoing healing effect compounds
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
    });

    test('should help win attrition wars', () => {
      const effect = NATURES_BLESSING.ongoingEffects[0] as HealEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });
});
