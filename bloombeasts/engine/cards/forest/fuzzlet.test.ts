/**
 * Tests for Fuzzlet card
 */

import { describe, test, expect } from '@jest/globals';
import { FUZZLET } from './fuzzlet.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, ApplyCounterEffect, HealEffect, StructuredAbility } from '../../types/abilities.js';

describe('Fuzzlet Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(FUZZLET);
    });

    test('should have correct card properties', () => {
      expect(FUZZLET.id).toBe('fuzzlet');
      expect(FUZZLET.name).toBe('Fuzzlet');
      expect(FUZZLET.type).toBe('Bloom');
      expect(FUZZLET.affinity).toBe('Forest');
      expect(FUZZLET.cost).toBe(2);
      expect(FUZZLET.baseAttack).toBe(2);
      expect(FUZZLET.baseHealth).toBe(4);
    });

    test('should be a defensive tank with moderate stats', () => {
      expect(FUZZLET.baseHealth).toBeGreaterThan(FUZZLET.baseAttack);
      expect(FUZZLET.cost).toBe(2);
    });
  });

  describe('Base Ability - Spores of Defense', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(FUZZLET.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(FUZZLET.abilities[0].name).toBe('Spores of Defense');
    });

    test('should trigger on damage', () => {
      expect(FUZZLET.abilities[0].trigger).toBe(AbilityTrigger.OnDamage);
    });

    test('should apply 1 Spore counter to self when damaged', () => {
      expect(FUZZLET.abilities[0].effects).toHaveLength(1);
      const effect = FUZZLET.abilities[0].effects[0] as ApplyCounterEffect;
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.counter).toBe('Spore');
      expect(effect.value).toBe(1);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(FUZZLET);
    });

    test('should have stat gains for all levels', () => {
      expect(FUZZLET.levelingConfig).toBeDefined();
      expect(FUZZLET.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(FUZZLET.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(FUZZLET);
    });

    test('should prioritize HP gains over ATK gains', () => {
      const statGains = FUZZLET.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(15);
      expect(statGains[9].atk).toBe(7);
      expect(statGains[9].hp).toBeGreaterThan(statGains[9].atk * 2);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(FUZZLET.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(FUZZLET.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Spore Burst', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Spore Burst');
    });

    test('should still trigger on damage', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnDamage);
    });

    test('should apply 2 Spore counters instead of 1', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as ApplyCounterEffect;
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.counter).toBe('Spore');
      expect(effect.value).toBe(2);
    });

    test('should be a power upgrade from base ability', () => {
      const baseEffect = FUZZLET.abilities[0].effects[0] as ApplyCounterEffect;
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      const upgradedEffect = ability.effects[0] as ApplyCounterEffect;
      expect(upgradedEffect.value).toBeGreaterThan(baseEffect.value);
    });
  });

  describe('Level 7 Upgrade - Accelerated Growth', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Accelerated Growth');
    });

    test('should trigger at start of turn', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnOwnStartOfTurn);
    });

    test('should have healing effect', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.value).toBe(2);
    });
  });

  describe('Level 9 Upgrade - Spore Dominance', () => {
    test('should have upgraded passive ability at level 9', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Spore Dominance');
    });

    test('should trigger on damage', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnDamage);
    });

    test('should have multiple effects', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.effects.length).toBeGreaterThan(1);
    });

    test('should apply 2 Spore counters and heal', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const sporeEffect = ability.effects[0] as ApplyCounterEffect;
      expect(sporeEffect.type).toBe(EffectType.ApplyCounter);
      expect(sporeEffect.target).toBe(AbilityTarget.Self);
      expect(sporeEffect.counter).toBe('Spore');
      expect(sporeEffect.value).toBe(2);

      const healEffect = ability.effects[1] as HealEffect;
      expect(healEffect.type).toBe(EffectType.Heal);
      expect(healEffect.target).toBe(AbilityTarget.Self);
      expect(healEffect.value).toBe(1);
    });

    test('should combine offensive and defensive capabilities', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      const hasCounterEffect = countEffectsByType(ability.effects, EffectType.ApplyCounter) > 0;
      const hasHealEffect = countEffectsByType(ability.effects, EffectType.Heal) > 0;
      expect(hasCounterEffect).toBe(true);
      expect(hasHealEffect).toBe(true);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain defensive tank role throughout progression', () => {
      const statGains = FUZZLET.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBeGreaterThanOrEqual(gains.atk);
      }
    });

    test('should have consistent spore mechanics theme', () => {
      const baseEffect = FUZZLET.abilities[0].effects[0] as ApplyCounterEffect;
      expect(baseEffect.counter).toBe('Spore');

      const upgrade4 = FUZZLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const ability4 = upgrade4!.abilities[0] as StructuredAbility;
      const level4Effect = ability4.effects[0] as ApplyCounterEffect;
      expect(level4Effect.counter).toBe('Spore');

      const upgrade9 = FUZZLET.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const ability9 = upgrade9!.abilities[0] as StructuredAbility;
      const level9Effect = ability9.effects[0] as ApplyCounterEffect;
      expect(level9Effect.counter).toBe('Spore');
    });

    test('should scale appropriately for a 2-cost unit', () => {
      expect(FUZZLET.cost).toBe(2);
      expect(FUZZLET.baseAttack + FUZZLET.baseHealth).toBe(6);
      const maxStats = FUZZLET.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(22);
    });
  });

  describe('Ability Synergies', () => {
    test('should synergize with spore-generating abilities', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const level4Ability = upgrade!.abilities[0] as StructuredAbility;
      const effect = level4Ability.effects[0] as ApplyCounterEffect;
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.counter).toBe('Spore');
      expect(effect.value).toBeGreaterThan(1);
    });

    test('should have healing capabilities at higher levels', () => {
      const upgrade = FUZZLET.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const level7Ability = upgrade!.abilities[0] as StructuredAbility;
      const hasHeal = level7Ability.effects.some(e => e.type === EffectType.Heal);
      expect(hasHeal).toBe(true);
    });
  });
});
