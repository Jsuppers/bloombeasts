/**
 * Tests for Mystic Shield buff card
 */

import { describe, test, expect } from '@jest/globals';
import { MYSTIC_SHIELD } from './mysticShield.js';
import { validateBuffCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, StatType, EffectDuration, StatModificationEffect } from '../../types/abilities.js';

describe('Mystic Shield Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid buff card structure', () => {
      validateBuffCard(MYSTIC_SHIELD);
    });

    test('should have correct card properties', () => {
      expect(MYSTIC_SHIELD.id).toBe('mystic-shield');
      expect(MYSTIC_SHIELD.name).toBe('Mystic Shield');
      expect(MYSTIC_SHIELD.type).toBe('Buff');
      expect(MYSTIC_SHIELD.cost).toBe(3);
    });

    test('should have moderate cost for ongoing effect', () => {
      expect(MYSTIC_SHIELD.cost).toBe(3);
    });

    test('should not have affinity restriction', () => {
      expect(MYSTIC_SHIELD.affinity).toBeUndefined();
    });
  });

  describe('Ongoing Effects', () => {
    test('should have exactly one ongoing effect', () => {
      expect(MYSTIC_SHIELD.ongoingEffects).toHaveLength(1);
    });

    test('should have stat modification effect', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
    });

    test('should target all allies', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should modify health stat', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
    });

    test('should provide +2 health bonus', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(2);
    });

    test('should last while on field', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 3 cost', () => {
      // 3 cost for global +2 HP buff is reasonable
      expect(MYSTIC_SHIELD.cost).toBe(3);
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(2);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should scale with board presence', () => {
      // More units = more value from buff
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should be vulnerable to removal', () => {
      // Effect lasts only while on field
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have defensive/protection themed name', () => {
      expect(MYSTIC_SHIELD.name).toContain('Shield');
    });

    test('should boost defensive capabilities', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
      expect(effect.value).toBeGreaterThan(0);
    });

    test('should affect all allies equally', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should have mystic/magical theme', () => {
      expect(MYSTIC_SHIELD.name).toContain('Mystic');
    });
  });

  describe('Strategic Use Cases', () => {
    test('should enable defensive strategies', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
      expect(effect.value).toBe(2);
    });

    test('should synergize with wide boards', () => {
      // More units = more total health bonus
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should protect against AOE damage', () => {
      // +2 HP can save units from mass damage effects
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
      expect(effect.value).toBe(2);
    });

    test('should help survive trading', () => {
      // Extra health means units survive combat better
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
    });
  });

  describe('Buff Mechanics', () => {
    test('should be a persistent effect', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should affect current and future units', () => {
      // AllAllies means all units you control
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should stack with other buffs', () => {
      // Stat modifications should stack
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
    });
  });

  describe('Comparison with Similar Cards', () => {
    test('should be defensive counterpart to Battle Fury', () => {
      // Same cost, same bonus value, different stat
      expect(MYSTIC_SHIELD.cost).toBe(3);
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(2);
      expect(effect.stat).toBe(StatType.Health);
    });

    test('should be generic with no affinity', () => {
      expect(MYSTIC_SHIELD.affinity).toBeUndefined();
    });
  });

  describe('Defensive Synergies', () => {
    test('should synergize with healing strategies', () => {
      // More max HP = more healing value
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
    });

    test('should help stabilize board', () => {
      // Ongoing +2 HP helps keep units alive
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should counter aggressive strategies', () => {
      // Extra health makes it harder for opponent to clear board
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(2);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });

  describe('Health Modification Behavior', () => {
    test('should increase maximum health', () => {
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
      expect(effect.type).toBe(EffectType.ModifyStats);
    });

    test('should protect small units', () => {
      // +2 HP is significant for low-cost units
      const effect = MYSTIC_SHIELD.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(2);
    });
  });
});
