/**
 * Tests for Mushroomancer card
 */

import { describe, test, expect } from '@jest/globals';
import { MUSHROOMANCER } from './mushroomancer.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
} from '../__tests__/testUtils.js';
import {
  EffectType, AbilityTarget, AbilityTrigger, StatType, CostType, EffectDuration, HealValueType,
  StatModificationEffect, HealEffect, StructuredAbility
} from '../../types/abilities.js';

describe('Mushroomancer Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(MUSHROOMANCER);
    });

    test('should have correct card properties', () => {
      expect(MUSHROOMANCER.id).toBe('mushroomancer');
      expect(MUSHROOMANCER.name).toBe('Mushroomancer');
      expect(MUSHROOMANCER.type).toBe('Bloom');
      expect(MUSHROOMANCER.affinity).toBe('Forest');
      expect(MUSHROOMANCER.cost).toBe(3);
      expect(MUSHROOMANCER.baseAttack).toBe(3);
      expect(MUSHROOMANCER.baseHealth).toBe(5);
    });

    test('should be a balanced 3-cost unit', () => {
      expect(MUSHROOMANCER.cost).toBe(3);
      expect(MUSHROOMANCER.baseAttack + MUSHROOMANCER.baseHealth).toBe(8);
    });
  });

  describe('Base Ability - Fungal Cloud', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(MUSHROOMANCER.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(MUSHROOMANCER.abilities[0].name).toBe('Fungal Cloud');
    });

    test('should trigger on summon', () => {
      expect(MUSHROOMANCER.abilities[0].trigger).toBe(AbilityTrigger.OnSummon);
    });

    test('should debuff adjacent enemies attack by -1', () => {
      const ability = MUSHROOMANCER.abilities[0] as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.AdjacentEnemies);
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(-1);
      expect(effect.duration).toBe(EffectDuration.StartOfNextTurn);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(MUSHROOMANCER);
    });

    test('should have stat gains for all levels', () => {
      expect(MUSHROOMANCER.levelingConfig).toBeDefined();
      expect(MUSHROOMANCER.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(MUSHROOMANCER.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(MUSHROOMANCER);
    });

    test('should prioritize HP over ATK', () => {
      const statGains = MUSHROOMANCER.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(14);
      expect(statGains[9].atk).toBe(7);
      expect(statGains[9].hp).toBeGreaterThan(statGains[9].atk);
    });
  });

  describe('Level 4 Upgrade - Toxic Spores', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Toxic Spores');
    });

    test('should trigger on summon', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnSummon);
    });

    test('should debuff adjacent enemies attack by -2', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.AdjacentEnemies);
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(-2);
    });
  });

  describe('Level 7 Upgrade - Greater Life Spore', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Greater Life Spore');
    });

    test('should be an activated ability', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.Activated);
    });

    test('should have spore cost', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.cost).toBeDefined();
      expect(ability.cost!.type).toBe(CostType.RemoveCounter);
      expect(ability.cost!.counter).toBe('Spore');
      expect(ability.cost!.value).toBe(1);
    });

    test('should heal for 3', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      const effect = ability.effects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.value).toBe(3);
    });
  });

  describe('Level 9 Upgrade - Parasitic Bloom & Spore Regeneration', () => {
    test('should have upgraded passive at level 9', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Parasitic Bloom');
    });

    test('should trigger on summon', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnSummon);
    });

    test('should permanently debuff all enemies', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities[0] as StructuredAbility;
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.AllEnemies);
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(-2);
      expect(effect.duration).toBe(EffectDuration.Permanent);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain AOE debuffer role throughout progression', () => {
      const baseAbility = MUSHROOMANCER.abilities[0] as StructuredAbility;
      const baseEffect = baseAbility.effects[0] as StatModificationEffect;
      expect(baseEffect.target).toBe(AbilityTarget.AdjacentEnemies);

      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const level9Ability = upgrade!.abilities[0] as StructuredAbility;
      const level9Effect = level9Ability.effects[0] as StatModificationEffect;
      expect(level9Effect.target).toBe(AbilityTarget.AllEnemies);
    });

    test('should have activated healing abilities', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const level7Ability = upgrade!.abilities[0] as StructuredAbility;
      expect(level7Ability.trigger).toBe(AbilityTrigger.Activated);
      expect(level7Ability.effects[0].type).toBe(EffectType.Heal);
    });

    test('should scale debuff power with level', () => {
      const baseAbility = MUSHROOMANCER.abilities[0] as StructuredAbility;
      const baseEffect = baseAbility.effects[0] as StatModificationEffect;
      const baseDebuff = baseEffect.value;
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const level4Ability = upgrade!.abilities[0] as StructuredAbility;
      const level4Effect = level4Ability.effects[0] as StatModificationEffect;
      const level4Debuff = level4Effect.value;
      expect(level4Debuff).toBeLessThan(baseDebuff);
      expect(Math.abs(level4Debuff)).toBeGreaterThan(Math.abs(baseDebuff));
    });

    test('should have consistent spore mechanics theme', () => {
      const upgrade = MUSHROOMANCER.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const level7Ability = upgrade!.abilities[0] as StructuredAbility;
      expect(level7Ability.cost!.counter).toBe('Spore');
    });
  });
});
