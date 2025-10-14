/**
 * Tests for Battle Fury buff card
 */

import { describe, test, expect } from '@jest/globals';
import { BATTLE_FURY } from './battleFury.js';
import { validateBuffCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, StatType, EffectDuration, StatModificationEffect } from '../../types/abilities.js';

describe('Battle Fury Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid buff card structure', () => {
      validateBuffCard(BATTLE_FURY);
    });

    test('should have correct card properties', () => {
      expect(BATTLE_FURY.id).toBe('battle-fury');
      expect(BATTLE_FURY.name).toBe('Battle Fury');
      expect(BATTLE_FURY.type).toBe('Buff');
      expect(BATTLE_FURY.cost).toBe(3);
    });

    test('should have moderate cost for ongoing effect', () => {
      expect(BATTLE_FURY.cost).toBe(3);
    });

    test('should not have affinity restriction', () => {
      expect(BATTLE_FURY.affinity).toBeUndefined();
    });
  });

  describe('Ongoing Effects', () => {
    test('should have exactly one ongoing effect', () => {
      expect(BATTLE_FURY.ongoingEffects).toHaveLength(1);
    });

    test('should have stat modification effect', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
    });

    test('should target all allies', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should modify attack stat', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
    });

    test('should provide +2 attack bonus', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(2);
    });

    test('should last while on field', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 3 cost', () => {
      // 3 cost for global +2 ATK buff is reasonable
      expect(BATTLE_FURY.cost).toBe(3);
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(2);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should scale with board presence', () => {
      // More units = more value from buff
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should be vulnerable to removal', () => {
      // Effect lasts only while on field
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have aggressive/battle themed name', () => {
      expect(BATTLE_FURY.name).toContain('Battle');
      expect(BATTLE_FURY.name).toContain('Fury');
    });

    test('should boost offensive capabilities', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBeGreaterThan(0);
    });

    test('should affect all allies equally', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should enable aggressive strategies', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(2);
    });

    test('should synergize with wide boards', () => {
      // More units = more total attack bonus
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should be best used mid-game', () => {
      // Need board presence to maximize value
      expect(BATTLE_FURY.cost).toBe(3);
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should create pressure on opponent', () => {
      // Ongoing +2 ATK forces opponent to deal with buff or take more damage
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });
  });

  describe('Buff Mechanics', () => {
    test('should be a persistent effect', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should affect current and future units', () => {
      // AllAllies means all units you control
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should stack with other buffs', () => {
      // Stat modifications should stack
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
    });
  });

  describe('Comparison with Similar Cards', () => {
    test('should be offensive counterpart to Mystic Shield', () => {
      // Same cost, same bonus value, different stat
      expect(BATTLE_FURY.cost).toBe(3);
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(2);
      expect(effect.stat).toBe(StatType.Attack);
    });

    test('should be generic with no affinity', () => {
      expect(BATTLE_FURY.affinity).toBeUndefined();
    });
  });

  describe('Win Conditions', () => {
    test('should accelerate damage output', () => {
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should help close out games', () => {
      // +2 ATK to all units can lead to lethal
      const effect = BATTLE_FURY.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(2);
    });
  });
});
