/**
 * Tests for Ancient Forest habitat card
 */

import { describe, test, expect } from '@jest/globals';
import { ANCIENT_FOREST } from './ancientForest.js';
import { validateHabitatCard, countEffectsByType } from '../__tests__/testUtils.js';
import {
  EffectType, AbilityTarget, StatType, EffectDuration, ConditionType,
  StatModificationEffect, RemoveCounterEffect
} from '../../types/abilities.js';

describe('Ancient Forest Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid habitat card structure', () => {
      validateHabitatCard(ANCIENT_FOREST);
    });

    test('should have correct card properties', () => {
      expect(ANCIENT_FOREST.id).toBe('ancient-forest');
      expect(ANCIENT_FOREST.name).toBe('Ancient Forest');
      expect(ANCIENT_FOREST.type).toBe('Habitat');
      expect(ANCIENT_FOREST.cost).toBe(1);
    });

    test('should have Forest affinity', () => {
      expect(ANCIENT_FOREST.affinity).toBe('Forest');
    });

    test('should have low cost for habitat card', () => {
      expect(ANCIENT_FOREST.cost).toBe(1);
    });
  });

  describe('Ongoing Effects', () => {
    test('should have exactly one ongoing effect', () => {
      expect(ANCIENT_FOREST.ongoingEffects).toHaveLength(1);
    });

    test('should have stat modification effect', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
    });

    test('should target all allies', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should boost Health stat', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
    });

    test('should provide +1 Health bonus', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(1);
    });

    test('should last while on field', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should only affect Forest beasts', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition).toBeDefined();
      expect(effect.condition?.type).toBe(ConditionType.AffinityMatches);
      expect(effect.condition?.value).toBe('Forest');
    });
  });

  describe('On Play Effects', () => {
    test('should have exactly two on-play effects', () => {
      expect(ANCIENT_FOREST.onPlayEffects).toBeDefined();
      expect(ANCIENT_FOREST.onPlayEffects).toHaveLength(2);
    });

    test('should have remove counter effects', () => {
      const removeCounterEffects = countEffectsByType(ANCIENT_FOREST.onPlayEffects || [], EffectType.RemoveCounter);
      expect(removeCounterEffects).toBe(2);
    });

    test('should remove Burn counters', () => {
      const burnEffect = ANCIENT_FOREST.onPlayEffects![0] as RemoveCounterEffect;
      expect(burnEffect.type).toBe(EffectType.RemoveCounter);
      expect(burnEffect.counter).toBe('Burn');
      expect(burnEffect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should remove Freeze counters', () => {
      const freezeEffect = ANCIENT_FOREST.onPlayEffects![1] as RemoveCounterEffect;
      expect(freezeEffect.type).toBe(EffectType.RemoveCounter);
      expect(freezeEffect.counter).toBe('Freeze');
      expect(freezeEffect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should affect all units on the field', () => {
      ANCIENT_FOREST.onPlayEffects!.forEach(effect => {
        expect(effect.target).toBe(AbilityTarget.AllUnits);
      });
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 1 cost', () => {
      // 1 cost habitat with conditional buff + counter removal
      expect(ANCIENT_FOREST.cost).toBe(1);
      expect(ANCIENT_FOREST.ongoingEffects).toHaveLength(1);
      expect(ANCIENT_FOREST.onPlayEffects).toHaveLength(2);
    });

    test('should benefit Forest-heavy decks', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition?.value).toBe('Forest');
    });

    test('should provide utility through cleansing', () => {
      expect(ANCIENT_FOREST.onPlayEffects).toHaveLength(2);
      expect(countEffectsByType(ANCIENT_FOREST.onPlayEffects || [], EffectType.RemoveCounter)).toBe(2);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have ancient/forest themed name', () => {
      expect(ANCIENT_FOREST.name).toContain('Ancient');
      expect(ANCIENT_FOREST.name).toContain('Forest');
    });

    test('should match Forest affinity', () => {
      expect(ANCIENT_FOREST.affinity).toBe('Forest');
    });

    test('should provide cleansing/natural healing', () => {
      // Removes harmful Burn and Freeze counters
      const burnEffect = ANCIENT_FOREST.onPlayEffects![0] as RemoveCounterEffect;
      const freezeEffect = ANCIENT_FOREST.onPlayEffects![1] as RemoveCounterEffect;
      expect(burnEffect.counter).toBe('Burn');
      expect(freezeEffect.counter).toBe('Freeze');
    });

    test('should boost defensive stats for forest creatures', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
      expect(effect.condition?.value).toBe('Forest');
    });
  });

  describe('Strategic Use Cases', () => {
    test('should counter Fire and Water strategies', () => {
      // Removes Burn (Fire) and Freeze (Water) counters
      const burnEffect = ANCIENT_FOREST.onPlayEffects![0] as RemoveCounterEffect;
      const freezeEffect = ANCIENT_FOREST.onPlayEffects![1] as RemoveCounterEffect;
      expect(burnEffect.counter).toBe('Burn');
      expect(freezeEffect.counter).toBe('Freeze');
    });

    test('should synergize with Forest beasts', () => {
      expect(ANCIENT_FOREST.affinity).toBe('Forest');
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition?.value).toBe('Forest');
    });

    test('should provide immediate and ongoing value', () => {
      // On-play cleansing + ongoing stat buff
      expect(ANCIENT_FOREST.onPlayEffects).toHaveLength(2);
      expect(ANCIENT_FOREST.ongoingEffects).toHaveLength(1);
    });

    test('should help Forest beasts survive longer', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
    });
  });

  describe('Habitat Mechanics', () => {
    test('should have persistent ongoing effects', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should trigger on-play effects immediately', () => {
      expect(ANCIENT_FOREST.onPlayEffects).toBeDefined();
      expect(ANCIENT_FOREST.onPlayEffects).toHaveLength(2);
    });

    test('should be vulnerable to habitat removal', () => {
      // Ongoing effect only lasts while on field
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });
  });

  describe('Affinity Synergies', () => {
    test('should only boost Forest units', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition?.type).toBe(ConditionType.AffinityMatches);
      expect(effect.condition?.value).toBe('Forest');
    });

    test('should be most valuable in mono-Forest decks', () => {
      expect(ANCIENT_FOREST.affinity).toBe('Forest');
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition?.value).toBe('Forest');
    });
  });

  describe('Counter Removal Utility', () => {
    test('should be a symmetrical effect', () => {
      // Affects all units, including opponent\'s
      ANCIENT_FOREST.onPlayEffects!.forEach(effect => {
        expect(effect.target).toBe(AbilityTarget.AllUnits);
      });
    });

    test('should remove specific counter types only', () => {
      const burnEffect = ANCIENT_FOREST.onPlayEffects![0] as RemoveCounterEffect;
      const freezeEffect = ANCIENT_FOREST.onPlayEffects![1] as RemoveCounterEffect;
      expect(burnEffect.counter).toBe('Burn');
      expect(freezeEffect.counter).toBe('Freeze');
    });

    test('should provide tech option against status effects', () => {
      expect(countEffectsByType(ANCIENT_FOREST.onPlayEffects || [], EffectType.RemoveCounter)).toBe(2);
    });
  });

  describe('Stat Boost Analysis', () => {
    test('should provide modest defensive bonus', () => {
      // +0/+1 is small but meaningful
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Health);
      expect(effect.value).toBe(1);
    });

    test('should scale with number of Forest units', () => {
      const effect = ANCIENT_FOREST.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });
});
