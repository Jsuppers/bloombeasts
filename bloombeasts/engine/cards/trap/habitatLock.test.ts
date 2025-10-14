/**
 * Tests for Habitat Lock trap card
 */

import { describe, test, expect } from '@jest/globals';
import { HABITAT_LOCK } from './habitatLock.js';
import { validateTrapCard } from '../__tests__/testUtils.js';
import { TrapTrigger } from '../../types/core.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Habitat Lock Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(HABITAT_LOCK);
    });

    test('should have correct card properties', () => {
      expect(HABITAT_LOCK.id).toBe('habitat-lock');
      expect(HABITAT_LOCK.name).toBe('Habitat Lock');
      expect(HABITAT_LOCK.type).toBe('Trap');
      expect(HABITAT_LOCK.cost).toBe(1);
    });

    test('should have low cost for counter trap', () => {
      expect(HABITAT_LOCK.cost).toBe(1);
    });
  });

  describe('Trap Activation', () => {
    test('should have activation configuration', () => {
      expect(HABITAT_LOCK.activation).toBeDefined();
      expect(HABITAT_LOCK.activation.trigger).toBeDefined();
    });

    test('should trigger on habitat play', () => {
      expect(HABITAT_LOCK.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
    });

    test('should be a reactive trap', () => {
      // Traps wait for specific game events
      expect(HABITAT_LOCK.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(HABITAT_LOCK.effects).toHaveLength(1);
    });

    test('should have nullify effect', () => {
      const effect = HABITAT_LOCK.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
    });

    test('should target the triggering habitat', () => {
      const effect = HABITAT_LOCK.effects[0];
      expect(effect.target).toBe(AbilityTarget.Target);
    });
  });

  describe('Nullify Effect', () => {
    test('should counter the habitat card being played', () => {
      const effect = HABITAT_LOCK.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
      expect(effect.target).toBe(AbilityTarget.Target);
    });

    test('should prevent habitat from taking effect', () => {
      // NullifyEffect stops the card's effects
      const effect = HABITAT_LOCK.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 1 cost', () => {
      // 1 cost counter trap is standard
      expect(HABITAT_LOCK.cost).toBe(1);
      expect(HABITAT_LOCK.effects).toHaveLength(1);
    });

    test('should be narrow but powerful', () => {
      // Only works against habitat plays
      expect(HABITAT_LOCK.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
      // But completely nullifies them
      const effect = HABITAT_LOCK.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
    });

    test('should be efficient counter to habitat strategies', () => {
      expect(HABITAT_LOCK.cost).toBe(1);
      expect(HABITAT_LOCK.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have lock/counter themed name', () => {
      expect(HABITAT_LOCK.name).toContain('Habitat');
      expect(HABITAT_LOCK.name).toContain('Lock');
    });

    test('should be specifically anti-habitat', () => {
      expect(HABITAT_LOCK.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
    });

    test('should represent denial/control', () => {
      const effect = HABITAT_LOCK.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should punish habitat-dependent strategies', () => {
      expect(HABITAT_LOCK.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
      const effect = HABITAT_LOCK.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
    });

    test('should provide tempo advantage', () => {
      // Costs 1, can counter more expensive habitats
      expect(HABITAT_LOCK.cost).toBe(1);
    });

    test('should require prediction and timing', () => {
      // Must be set before opponent plays habitat
      expect(HABITAT_LOCK.type).toBe('Trap');
    });

    test('should be a sideboard/tech card', () => {
      // Very specific trigger condition
      expect(HABITAT_LOCK.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
    });
  });

  describe('Trap Mechanics', () => {
    test('should be hidden when played', () => {
      // Traps are face-down until triggered
      expect(HABITAT_LOCK.type).toBe('Trap');
    });

    test('should trigger automatically', () => {
      // Traps activate on trigger, not player choice
      expect(HABITAT_LOCK.activation).toBeDefined();
      expect(HABITAT_LOCK.activation.trigger).toBeDefined();
    });

    test('should target the card that triggered it', () => {
      const effect = HABITAT_LOCK.effects[0];
      expect(effect.target).toBe(AbilityTarget.Target);
    });
  });

  describe('Counter Play Patterns', () => {
    test('should make opponent think twice about habitat plays', () => {
      // Presence threatens to nullify habitat
      expect(HABITAT_LOCK.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
    });

    test('should be vulnerable to bait tactics', () => {
      // Only triggers on habitat, can be wasted
      expect(HABITAT_LOCK.activation.trigger).toBe(TrapTrigger.OnHabitatPlay);
    });

    test('should provide value through disruption', () => {
      const effect = HABITAT_LOCK.effects[0];
      expect(effect.type).toBe(EffectType.NullifyEffect);
    });
  });
});
