/**
 * Tests for Dewdrop Drake card
 */

import { describe, test, expect } from '@jest/globals';
import { DEWDROP_DRAKE } from './dewdropDrake.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, EffectDuration, ConditionType, Comparison, CostType, StructuredAbility, AttackModificationEffect, DamageReductionEffect, DamageEffect } from '../../types/abilities.js';

describe('Dewdrop Drake Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(DEWDROP_DRAKE);
    });

    test('should have correct card properties', () => {
      expect(DEWDROP_DRAKE.id).toBe('dewdrop-drake');
      expect(DEWDROP_DRAKE.name).toBe('Dewdrop Drake');
      expect(DEWDROP_DRAKE.type).toBe('Bloom');
      expect(DEWDROP_DRAKE.affinity).toBe('Water');
      expect(DEWDROP_DRAKE.cost).toBe(3);
      expect(DEWDROP_DRAKE.baseAttack).toBe(3);
      expect(DEWDROP_DRAKE.baseHealth).toBe(6);
    });

    test('should be a balanced mid-cost finisher', () => {
      expect(DEWDROP_DRAKE.baseHealth).toBeGreaterThan(DEWDROP_DRAKE.baseAttack);
      expect(DEWDROP_DRAKE.cost).toBe(3);
      expect(DEWDROP_DRAKE.baseAttack + DEWDROP_DRAKE.baseHealth).toBe(9);
    });
  });

  describe('Base Ability - Mist Screen', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(DEWDROP_DRAKE.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(DEWDROP_DRAKE.abilities[0].name).toBe('Mist Screen');
    });

    test('should be a passive ability', () => {
      expect(DEWDROP_DRAKE.abilities[0].trigger).toBe(AbilityTrigger.Passive);
    });

    test('should grant attack-first when alone', () => {
      expect(DEWDROP_DRAKE.abilities[0].effects).toHaveLength(1);
      const effect = DEWDROP_DRAKE.abilities[0].effects[0] as AttackModificationEffect;
      expect(effect.type).toBe(EffectType.AttackModification);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.modification).toBe('attack-first');
    });

    test('should have condition for being alone on field', () => {
      const effect = DEWDROP_DRAKE.abilities[0].effects[0] as AttackModificationEffect;
      expect(effect.condition).toBeDefined();
      expect(effect.condition!.type).toBe(ConditionType.UnitsOnField);
      expect(effect.condition!.value).toBe(1);
      expect(effect.condition!.comparison).toBe(Comparison.Equal);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(DEWDROP_DRAKE);
    });

    test('should have stat gains for all levels', () => {
      expect(DEWDROP_DRAKE.levelingConfig).toBeDefined();
      expect(DEWDROP_DRAKE.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(DEWDROP_DRAKE.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have non-decreasing stat gains', () => {
      validateStatGainsProgression(DEWDROP_DRAKE);
    });

    test('should have balanced stat progression', () => {
      const statGains = DEWDROP_DRAKE.levelingConfig!.statGains!;
      expect(statGains[5].hp).toBe(6);
      expect(statGains[5].atk).toBe(4);
      expect(statGains[9].hp).toBe(14);
      expect(statGains[9].atk).toBe(8);
    });

    test('should prioritize HP gains slightly', () => {
      const statGains = DEWDROP_DRAKE.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBeGreaterThanOrEqual(gains.atk);
      }
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(DEWDROP_DRAKE.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(DEWDROP_DRAKE.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Deluge', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.name).toBe('Deluge');
    });

    test('should trigger on attack', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should have nectar cost', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.cost).toBeDefined();
      expect(ability.cost!.type).toBe(CostType.Nectar);
      expect(ability.cost!.value).toBe(1);
    });

    test('should deal 3 damage to opponent gardener', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as DamageEffect;
      expect(effect.type).toBe(EffectType.DealDamage);
      expect(effect.target).toBe(AbilityTarget.OpponentGardener);
      expect(effect.value).toBe(3);
    });

    test('should be a power upgrade from base damage', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      const effect = ability.effects[0] as DamageEffect;
      expect(effect.value).toBe(3);
    });
  });

  describe('Level 7 Upgrade - Fog Veil', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.name).toBe('Fog Veil');
    });

    test('should be a passive ability', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should grant unconditional attack-first', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      const attackFirstEffect = ability.effects.find(e => e.type === EffectType.AttackModification) as AttackModificationEffect | undefined;
      expect(attackFirstEffect).toBeDefined();
      expect(attackFirstEffect!.modification).toBe('attack-first');
      expect(attackFirstEffect!.condition).toBeUndefined();
    });

    test('should provide damage reduction', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      const damageReductionEffect = ability.effects.find(e => e.type === EffectType.DamageReduction) as DamageReductionEffect | undefined;
      expect(damageReductionEffect).toBeDefined();
      expect(damageReductionEffect!.target).toBe(AbilityTarget.Self);
      expect(damageReductionEffect!.value).toBe(1);
      expect(damageReductionEffect!.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should have multiple effects', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      expect(ability.effects.length).toBe(2);
    });

    test('should remove conditional requirement from base', () => {
      const baseEffect = DEWDROP_DRAKE.abilities[0].effects[0] as AttackModificationEffect;
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const level7Effect = upgrade!.abilities![0].effects[0] as AttackModificationEffect;
      expect(baseEffect.condition).toBeDefined();
      expect(level7Effect.condition).toBeUndefined();
    });
  });

  describe('Level 9 Upgrade - Storm Guardian and Maelstrom', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.name).toBe('Storm Guardian');
    });

    test('should be a passive ability', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should grant unconditional attack-first', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      const attackFirstEffect = ability.effects.find(e => e.type === EffectType.AttackModification) as AttackModificationEffect | undefined;
      expect(attackFirstEffect).toBeDefined();
      expect(attackFirstEffect!.modification).toBe('attack-first');
      expect(attackFirstEffect!.condition).toBeUndefined();
    });

    test('should provide enhanced damage reduction', () => {
      const upgrade = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      const damageReductionEffect = ability.effects.find(e => e.type === EffectType.DamageReduction) as DamageReductionEffect | undefined;
      expect(damageReductionEffect).toBeDefined();
      expect(damageReductionEffect!.target).toBe(AbilityTarget.Self);
      expect(damageReductionEffect!.value).toBe(2);
      expect(damageReductionEffect!.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should have improved damage reduction from level 7', () => {
      const upgrade7 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      const level7Reduction = level7Ability.effects.find(e => e.type === EffectType.DamageReduction) as DamageReductionEffect | undefined;
      const upgrade9 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0] as StructuredAbility;
      const level9Reduction = level9Ability.effects.find(e => e.type === EffectType.DamageReduction) as DamageReductionEffect | undefined;

      expect(level9Reduction!.value).toBeGreaterThan(level7Reduction!.value);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain finisher role throughout progression', () => {
      const statGains = DEWDROP_DRAKE.levelingConfig!.statGains!;
      // Should have balanced growth
      for (let level = 2; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBeGreaterThanOrEqual(gains.atk);
      }
    });

    test('should have consistent direct damage theme', () => {
      const upgrade4 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      const hasDirectDamage = level4Ability.effects.some(
        e => e.type === EffectType.DealDamage && e.target === AbilityTarget.OpponentGardener
      );
      expect(hasDirectDamage).toBe(true);
    });

    test('should scale appropriately for a 3-cost unit', () => {
      expect(DEWDROP_DRAKE.cost).toBe(3);
      expect(DEWDROP_DRAKE.baseAttack + DEWDROP_DRAKE.baseHealth).toBe(9);
      const maxStats = DEWDROP_DRAKE.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(22);
    });

    test('should have increasing defensive capabilities', () => {
      const upgrade7 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      const level7Reduction = level7Ability.effects.find(e => e.type === EffectType.DamageReduction) as DamageReductionEffect | undefined;
      const upgrade9 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0] as StructuredAbility;
      const level9Reduction = level9Ability.effects.find(e => e.type === EffectType.DamageReduction) as DamageReductionEffect | undefined;

      expect(level7Reduction).toBeDefined();
      expect(level9Reduction).toBeDefined();
      expect(level9Reduction!.value).toBeGreaterThan(level7Reduction!.value);
    });
  });

  describe('Ability Synergies', () => {
    test('should provide solo play advantage', () => {
      const baseAbility = DEWDROP_DRAKE.abilities[0];
      const effect = baseAbility.effects[0] as AttackModificationEffect;
      expect(effect.condition).toBeDefined();
      expect(effect.condition!.type).toBe(ConditionType.UnitsOnField);
      expect(effect.condition!.value).toBe(1);
    });

    test('should enable aggressive finisher strategy with direct damage', () => {
      const upgrade4 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      expect(level4Ability.trigger).toBe(AbilityTrigger.OnAttack);
      const effect = level4Ability.effects[0] as DamageEffect;
      expect(effect.type).toBe(EffectType.DealDamage);
      expect(effect.target).toBe(AbilityTarget.OpponentGardener);
    });

    test('should have survival tools at higher levels', () => {
      const upgrade7 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      const hasDamageReduction = level7Ability.effects.some(e => e.type === EffectType.DamageReduction);
      expect(hasDamageReduction).toBe(true);
    });

    test('should require resource management with nectar cost', () => {
      const upgrade4 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0];
      expect(level4Ability.cost).toBeDefined();
      expect(level4Ability.cost!.type).toBe(CostType.Nectar);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain water-themed ability names', () => {
      expect(DEWDROP_DRAKE.abilities[0].name).toBe('Mist Screen');
      const upgrade4 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      expect(upgrade4!.abilities![0].name).toBe('Deluge');
      const upgrade7 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      expect(upgrade7!.abilities![0].name).toBe('Fog Veil');
      const upgrade9 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      expect(upgrade9!.abilities![0].name).toBe('Storm Guardian');
    });

    test('should embody swift, elusive striker mechanics', () => {
      // Attack-first represents speed
      expect((DEWDROP_DRAKE.abilities[0].effects[0] as AttackModificationEffect).modification).toBe('attack-first');

      // Direct damage represents finishing power
      const upgrade4 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      expect(level4Ability.effects[0].type).toBe(EffectType.DealDamage);

      // Damage reduction represents elusiveness
      const upgrade7 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      const hasDamageReduction = level7Ability.effects.some(e => e.type === EffectType.DamageReduction);
      expect(hasDamageReduction).toBe(true);
    });

    test('should represent storm and mist themes', () => {
      expect(DEWDROP_DRAKE.abilities[0].name).toContain('Mist');
      const upgrade7 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      expect(upgrade7!.abilities![0].name).toContain('Fog');
      const upgrade9 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      expect(upgrade9!.abilities![0].name).toContain('Storm');
    });
  });

  describe('Edge Cases and Special Mechanics', () => {
    test('should transition from conditional to unconditional attack-first', () => {
      const baseAbility = DEWDROP_DRAKE.abilities[0];
      expect((baseAbility.effects[0] as AttackModificationEffect).condition).toBeDefined();

      const upgrade7 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      const attackFirstEffect = level7Ability.effects.find(e => e.type === EffectType.AttackModification) as AttackModificationEffect | undefined;
      expect(attackFirstEffect!.condition).toBeUndefined();
    });

    test('should have damage reduction that lasts while on field', () => {
      const upgrade7 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      const damageReductionEffect = level7Ability.effects.find(e => e.type === EffectType.DamageReduction) as DamageReductionEffect | undefined;
      expect(damageReductionEffect!.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should require payment for powerful effects', () => {
      const upgrade4 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0];
      expect(level4Ability.cost).toBeDefined();
      expect(level4Ability.cost!.value).toBeGreaterThan(0);
    });

    test('should scale direct damage appropriately', () => {
      const upgrade4 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      const damage = (level4Ability.effects[0] as DamageEffect).value;
      expect(damage).toBeGreaterThanOrEqual(3);
      expect(damage).toBeLessThanOrEqual(5);
    });
  });

  describe('Combat Mechanics', () => {
    test('should have attack-first advantage', () => {
      const baseAbility = DEWDROP_DRAKE.abilities[0];
      expect(baseAbility.effects[0].type).toBe(EffectType.AttackModification);
      expect((baseAbility.effects[0] as AttackModificationEffect).modification).toBe('attack-first');
    });

    test('should deal damage on attack', () => {
      const upgrade4 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      expect(level4Ability.trigger).toBe(AbilityTrigger.OnAttack);
      expect(level4Ability.effects[0].type).toBe(EffectType.DealDamage);
    });

    test('should have progressive defensive layering', () => {
      const upgrade7 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Reduction = (upgrade7!.abilities![0] as StructuredAbility).effects
        .find(e => e.type === EffectType.DamageReduction) as DamageReductionEffect | undefined;
      const upgrade9 = DEWDROP_DRAKE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Reduction = (upgrade9!.abilities![0] as StructuredAbility).effects
        .find(e => e.type === EffectType.DamageReduction) as DamageReductionEffect | undefined;

      expect(level7Reduction!.value).toBe(1);
      expect(level9Reduction!.value).toBe(2);
    });
  });
});
