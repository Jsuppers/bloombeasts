/**
 * Tests for Mosslet card - Similar to Fuzzlet with same spore mechanics
 */

import { describe, test, expect } from '@jest/globals';
import { MOSSLET } from './mosslet.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, ApplyCounterEffect, HealEffect, StructuredAbility } from '../../types/abilities.js';

describe('Mosslet Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(MOSSLET);
    });

    test('should have correct card properties', () => {
      expect(MOSSLET.id).toBe('mosslet');
      expect(MOSSLET.name).toBe('Mosslet');
      expect(MOSSLET.type).toBe('Bloom');
      expect(MOSSLET.affinity).toBe('Forest');
      expect(MOSSLET.cost).toBe(2);
      expect(MOSSLET.baseAttack).toBe(2);
      expect(MOSSLET.baseHealth).toBe(4);
    });

    test('should have identical stats to Fuzzlet', () => {
      expect(MOSSLET.cost).toBe(2);
      expect(MOSSLET.baseAttack).toBe(2);
      expect(MOSSLET.baseHealth).toBe(4);
    });
  });

  describe('Base Ability - Spores of Defense', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(MOSSLET.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(MOSSLET.abilities[0].name).toBe('Spores of Defense');
    });

    test('should trigger on damage', () => {
      expect(MOSSLET.abilities[0].trigger).toBe(AbilityTrigger.OnDamage);
    });

    test('should apply 1 Spore counter to self', () => {
      expect(MOSSLET.abilities[0].effects).toHaveLength(1);
      const effect = MOSSLET.abilities[0].effects[0] as ApplyCounterEffect;
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.counter).toBe('Spore');
      expect(effect.value).toBe(1);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(MOSSLET);
    });

    test('should have stat gains for all levels', () => {
      expect(MOSSLET.levelingConfig).toBeDefined();
      expect(MOSSLET.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(MOSSLET.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(MOSSLET);
    });

    test('should have identical stat progression to Fuzzlet', () => {
      const statGains = MOSSLET.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(15);
      expect(statGains[9].atk).toBe(7);
    });
  });

  describe('Level 4 Upgrade - Spore Burst', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Spore Burst');
    });

    test('should apply 2 Spore counters', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      const effect = ability.effects[0] as ApplyCounterEffect;
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.counter).toBe('Spore');
      expect(effect.value).toBe(2);
    });
  });

  describe('Level 7 Upgrade - Accelerated Growth', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Accelerated Growth');
    });

    test('should trigger at start of turn', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnOwnStartOfTurn);
    });

    test('should heal for 2', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      const effect = ability.effects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
      expect(effect.value).toBe(2);
    });
  });

  describe('Level 9 Upgrade - Spore Dominance', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Spore Dominance');
    });

    test('should apply 2 Spore counters and heal', () => {
      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const sporeEffect = ability.effects[0] as ApplyCounterEffect;
      expect(sporeEffect.type).toBe(EffectType.ApplyCounter);
      expect(sporeEffect.value).toBe(2);

      const healEffect = ability.effects[1] as HealEffect;
      expect(healEffect.type).toBe(EffectType.Heal);
      expect(healEffect.value).toBe(1);
    });
  });

  describe('Card Consistency', () => {
    test('should maintain defensive tank role', () => {
      expect(MOSSLET.baseHealth).toBeGreaterThan(MOSSLET.baseAttack);
    });

    test('should have consistent spore mechanics theme', () => {
      const baseEffect = MOSSLET.abilities[0].effects[0] as ApplyCounterEffect;
      expect(baseEffect.counter).toBe('Spore');

      const upgrade = MOSSLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      const level4Effect = ability.effects[0] as ApplyCounterEffect;
      expect(level4Effect.counter).toBe('Spore');
    });
  });
});
