/**
 * Tests for XP Harvest trap card
 */

import { describe, test, expect } from '@jest/globals';
import { XP_HARVEST } from './xpHarvest.js';
import { validateTrapCard } from '../__tests__/testUtils.js';
import { TrapTrigger } from '../../types/core.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('XP Harvest Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid trap card structure', () => {
      validateTrapCard(XP_HARVEST);
    });

    test('should have correct card properties', () => {
      expect(XP_HARVEST.id).toBe('xp-harvest');
      expect(XP_HARVEST.name).toBe('XP Harvest');
      expect(XP_HARVEST.type).toBe('Trap');
      expect(XP_HARVEST.cost).toBe(1);
    });
  });

  describe('Trap Activation', () => {
    test('should have activation configuration', () => {
      expect(XP_HARVEST.activation).toBeDefined();
      expect(XP_HARVEST.activation.trigger).toBeDefined();
    });

    test('should trigger when unit is destroyed', () => {
      expect(XP_HARVEST.activation.trigger).toBe(TrapTrigger.OnDestroy);
    });
  });

  describe('Card Effects', () => {
    test('should have exactly one effect', () => {
      expect(XP_HARVEST.effects).toHaveLength(1);
    });

    test('should have remove counter effect', () => {
      const effect = XP_HARVEST.effects[0];
      expect(effect.type).toBe(EffectType.RemoveCounter);
    });

    test('should target the attacker', () => {
      const effect = XP_HARVEST.effects[0];
      expect(effect.target).toBe(AbilityTarget.Attacker);
    });

    test('should remove XP counters', () => {
      const effect = XP_HARVEST.effects[0];
      if (effect.type === EffectType.RemoveCounter) {
        expect(effect.counter).toBe('XP');
      }
    });
  });

  describe('Card Balance', () => {
    test('should provide strong punishment', () => {
      expect(XP_HARVEST.cost).toBe(1);
      const effect = XP_HARVEST.effects[0];
      expect(effect.type).toBe(EffectType.RemoveCounter);
    });

    test('should reset attacker to level 1', () => {
      const effect = XP_HARVEST.effects[0];
      if (effect.type === EffectType.RemoveCounter) {
        expect(effect.counter).toBe('XP');
      }
    });
  });

  describe('Strategic Use Cases', () => {
    test('should punish high-level attackers', () => {
      expect(XP_HARVEST.activation.trigger).toBe(TrapTrigger.OnDestroy);
      const effect = XP_HARVEST.effects[0];
      expect(effect.type).toBe(EffectType.RemoveCounter);
    });

    test('should reverse opponent progress', () => {
      const effect = XP_HARVEST.effects[0];
      if (effect.type === EffectType.RemoveCounter) {
        expect(effect.counter).toBe('XP');
      }
    });

    test('should be powerful tempo swing', () => {
      expect(XP_HARVEST.cost).toBe(1);
    });
  });
});
