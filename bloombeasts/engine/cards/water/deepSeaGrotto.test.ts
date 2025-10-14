/**
 * Tests for Deep Sea Grotto habitat card
 */

import { describe, test, expect } from '@jest/globals';
import { DEEP_SEA_GROTTO } from './deepSeaGrotto.js';
import { validateHabitatCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, StatType, EffectDuration, ConditionType, StatModificationEffect } from '../../types/abilities.js';

describe('Deep Sea Grotto Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid habitat card structure', () => {
      validateHabitatCard(DEEP_SEA_GROTTO);
    });

    test('should have correct card properties', () => {
      expect(DEEP_SEA_GROTTO.id).toBe('deep-sea-grotto');
      expect(DEEP_SEA_GROTTO.name).toBe('Deep Sea Grotto');
      expect(DEEP_SEA_GROTTO.type).toBe('Habitat');
      expect(DEEP_SEA_GROTTO.cost).toBe(1);
    });

    test('should have Water affinity', () => {
      expect(DEEP_SEA_GROTTO.affinity).toBe('Water');
    });

    test('should have low cost for habitat card', () => {
      expect(DEEP_SEA_GROTTO.cost).toBe(1);
    });
  });

  describe('Ongoing Effects', () => {
    test('should have exactly one ongoing effect', () => {
      expect(DEEP_SEA_GROTTO.ongoingEffects).toHaveLength(1);
    });

    test('should have stat modification effect', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
    });

    test('should target all allies', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should boost Attack stat', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
    });

    test('should provide +1 Attack bonus', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(1);
    });

    test('should last while on field', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should only affect Water beasts', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition).toBeDefined();
      expect(effect.condition?.type).toBe(ConditionType.AffinityMatches);
      expect(effect.condition?.value).toBe('Water');
    });
  });

  describe('On Play Effects', () => {
    test('should have no on-play effects', () => {
      expect(DEEP_SEA_GROTTO.onPlayEffects).toBeDefined();
      expect(DEEP_SEA_GROTTO.onPlayEffects).toHaveLength(0);
    });

    test('should be a pure ongoing effect habitat', () => {
      expect(DEEP_SEA_GROTTO.onPlayEffects).toHaveLength(0);
      expect(DEEP_SEA_GROTTO.ongoingEffects).toHaveLength(1);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 1 cost', () => {
      // 1 cost habitat with conditional +1 ATK buff
      expect(DEEP_SEA_GROTTO.cost).toBe(1);
      expect(DEEP_SEA_GROTTO.ongoingEffects).toHaveLength(1);
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBe(1);
    });

    test('should benefit Water-heavy decks', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition?.value).toBe('Water');
    });

    test('should scale with board presence', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have water/ocean themed name', () => {
      expect(DEEP_SEA_GROTTO.name).toContain('Deep Sea');
      expect(DEEP_SEA_GROTTO.name).toContain('Grotto');
    });

    test('should match Water affinity', () => {
      expect(DEEP_SEA_GROTTO.affinity).toBe('Water');
    });

    test('should boost offensive stats for water creatures', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.condition?.value).toBe('Water');
    });

    test('should represent aggressive water environment', () => {
      // Attack boost suggests dangerous waters
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
    });
  });

  describe('Strategic Use Cases', () => {
    test('should synergize with Water beasts', () => {
      expect(DEEP_SEA_GROTTO.affinity).toBe('Water');
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition?.value).toBe('Water');
    });

    test('should enable aggressive Water strategies', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
    });

    test('should provide pure value with no drawback', () => {
      // No on-play downside, just ongoing buff
      expect(DEEP_SEA_GROTTO.onPlayEffects).toHaveLength(0);
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.value).toBeGreaterThan(0);
    });

    test('should help close out games faster', () => {
      // Attack boost accelerates damage
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
    });
  });

  describe('Habitat Mechanics', () => {
    test('should have persistent ongoing effects', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should be vulnerable to habitat removal', () => {
      // Ongoing effect only lasts while on field
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should provide immediate benefit', () => {
      // No delay, affects units on field immediately
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });

  describe('Affinity Synergies', () => {
    test('should only boost Water units', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition?.type).toBe(ConditionType.AffinityMatches);
      expect(effect.condition?.value).toBe('Water');
    });

    test('should be most valuable in mono-Water decks', () => {
      expect(DEEP_SEA_GROTTO.affinity).toBe('Water');
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition?.value).toBe('Water');
    });

    test('should encourage Water-focused deck building', () => {
      expect(DEEP_SEA_GROTTO.affinity).toBe('Water');
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.condition?.value).toBe('Water');
    });
  });

  describe('Comparison with Other Habitats', () => {
    test('should be offensive counterpart to Ancient Forest', () => {
      // Same cost, opposite stat focus
      expect(DEEP_SEA_GROTTO.cost).toBe(1);
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(1);
    });

    test('should have simpler design than Ancient Forest', () => {
      // No on-play effects
      expect(DEEP_SEA_GROTTO.onPlayEffects).toHaveLength(0);
    });
  });

  describe('Stat Boost Analysis', () => {
    test('should provide modest offensive bonus', () => {
      // +1/+0 is small but meaningful
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(1);
    });

    test('should scale with number of Water units', () => {
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should compound damage output', () => {
      // Each Water unit deals +1 damage
      const effect = DEEP_SEA_GROTTO.ongoingEffects[0] as StatModificationEffect;
      expect(effect.stat).toBe(StatType.Attack);
    });
  });

  describe('Deck Building Implications', () => {
    test('should be auto-include in Water decks', () => {
      expect(DEEP_SEA_GROTTO.cost).toBe(1);
      expect(DEEP_SEA_GROTTO.affinity).toBe('Water');
    });

    test('should provide consistent value', () => {
      // Simple, reliable effect
      expect(DEEP_SEA_GROTTO.ongoingEffects).toHaveLength(1);
    });
  });
});
