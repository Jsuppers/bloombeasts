/**
 * Tests for Cirrus Floof card
 */

import { describe, test, expect } from '@jest/globals';
import { CIRRUS_FLOOF } from './cirrusFloof.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, EffectDuration, ImmunityType, TemporaryHPEffect, DamageReductionEffect, ImmunityEffect, StructuredAbility } from '../../types/abilities.js';

describe('Cirrus Floof Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(CIRRUS_FLOOF);
    });

    test('should have correct card properties', () => {
      expect(CIRRUS_FLOOF.id).toBe('cirrus-floof');
      expect(CIRRUS_FLOOF.name).toBe('Cirrus Floof');
      expect(CIRRUS_FLOOF.type).toBe('Bloom');
      expect(CIRRUS_FLOOF.affinity).toBe('Sky');
      expect(CIRRUS_FLOOF.cost).toBe(2);
      expect(CIRRUS_FLOOF.baseAttack).toBe(1);
      expect(CIRRUS_FLOOF.baseHealth).toBe(6);
    });

    test('should be a defensive support unit with very high HP', () => {
      expect(CIRRUS_FLOOF.baseHealth).toBeGreaterThan(CIRRUS_FLOOF.baseAttack);
      expect(CIRRUS_FLOOF.cost).toBe(2);
      expect(CIRRUS_FLOOF.baseAttack + CIRRUS_FLOOF.baseHealth).toBe(7);
      expect(CIRRUS_FLOOF.baseHealth).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Base Ability - Lightness', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(CIRRUS_FLOOF.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = CIRRUS_FLOOF.ability as StructuredAbility;
      expect(ability.name).toBe('Lightness');
    });

    test('should be a passive ability', () => {
      const ability = CIRRUS_FLOOF.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should prevent targeting by high-cost units', () => {
      const ability = CIRRUS_FLOOF.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.CannotBeTargeted);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.by).toBeDefined();
      expect(effect.by).toContain('high-cost-units');
      expect(effect.costThreshold).toBe(3);
    });

    test('should provide protection based on cost threshold', () => {
      const ability = CIRRUS_FLOOF.ability as StructuredAbility;
      const effect: any = ability.effects[0];
      expect(effect.costThreshold).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(CIRRUS_FLOOF);
    });

    test('should have stat gains for all levels', () => {
      expect(CIRRUS_FLOOF.levelingConfig).toBeDefined();
      expect(CIRRUS_FLOOF.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(CIRRUS_FLOOF.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have non-decreasing stat gains', () => {
      validateStatGainsProgression(CIRRUS_FLOOF);
    });

    test('should heavily prioritize HP gains over ATK gains', () => {
      const statGains = CIRRUS_FLOOF.levelingConfig!.statGains!;
      expect(statGains[5].hp).toBe(10);
      expect(statGains[5].atk).toBe(1);
      expect(statGains[9].hp).toBe(20);
      expect(statGains[9].atk).toBe(4);
      // HP gains should be significantly higher than ATK
      expect(statGains[9].hp).toBeGreaterThan(statGains[9].atk * 4);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(CIRRUS_FLOOF.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(CIRRUS_FLOOF.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Storm Shield', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![4];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability!);
    });

    test('should have correct ability name', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.name).toBe('Storm Shield');
    });

    test('should trigger at start of turn', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.StartOfTurn);
    });

    test('should grant temporary HP to all allies', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.TemporaryHP);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
      expect(effect.value).toBe(2);
    });

    test('should provide team-wide defensive buff', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![4].ability!;
      const effect: any = ability.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllAllies);
      expect(effect.value).toBeGreaterThan(0);
    });
  });

  describe('Level 7 Upgrade - Ethereal Form', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![7];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability!);
    });

    test('should have correct ability name', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.name).toBe('Ethereal Form');
    });

    test('should be a passive ability', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should prevent targeting by attacks', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.CannotBeTargeted);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.by).toBeDefined();
      expect(effect.by).toContain('attacks');
    });

    test('should provide broader protection than base ability', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![7].ability!;
      const effect: any = ability.effects[0];
      expect(effect.by).toBeDefined();
      expect(effect.by.length).toBeGreaterThan(0);
    });
  });

  describe('Level 9 Upgrade - Celestial Protector', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability!);
    });

    test('should have correct ability name', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.name).toBe('Celestial Protector');
    });

    test('should be a passive ability', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should have multiple protective effects', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.effects.length).toBeGreaterThan(1);
      expect(ability.effects).toHaveLength(2);
    });

    test('should prevent all targeting', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      const cannotBeTargetedEffect: any = ability.effects[0];
      expect(cannotBeTargetedEffect.type).toBe(EffectType.CannotBeTargeted);
      expect(cannotBeTargetedEffect.target).toBe(AbilityTarget.Self);
      expect(cannotBeTargetedEffect.by).toContain('all');
    });

    test('should provide damage reduction to all allies', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      const damageReductionEffect: any = ability.effects[1];
      expect(damageReductionEffect.type).toBe(EffectType.DamageReduction);
      expect(damageReductionEffect.target).toBe(AbilityTarget.AllAllies);
      expect(damageReductionEffect.value).toBe(1);
      expect(damageReductionEffect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should be a comprehensive team protector', () => {
      const ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      const hasProtection = ability.effects.some(
        (e: any) => e.type === EffectType.CannotBeTargeted
      );
      const hasDamageReduction = ability.effects.some(
        (e: any) => e.type === EffectType.DamageReduction
      );
      expect(hasProtection).toBe(true);
      expect(hasDamageReduction).toBe(true);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain defensive support role throughout progression', () => {
      const statGains = CIRRUS_FLOOF.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBeGreaterThanOrEqual(gains.atk);
      }
    });

    test('should have consistent protection theme', () => {
      const baseAbility = CIRRUS_FLOOF.ability as StructuredAbility;
      expect(baseAbility.effects[0].type).toBe(EffectType.CannotBeTargeted);

      const level7Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![7].ability!;
      expect(level7Ability.effects[0].type).toBe(EffectType.CannotBeTargeted);

      const level9Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      expect(level9Ability.effects[0].type).toBe(EffectType.CannotBeTargeted);
    });

    test('should scale appropriately for a 2-cost support unit', () => {
      expect(CIRRUS_FLOOF.cost).toBe(2);
      expect(CIRRUS_FLOOF.baseAttack + CIRRUS_FLOOF.baseHealth).toBe(7);
      const maxStats = CIRRUS_FLOOF.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(24);
    });

    test('should expand protection coverage over time', () => {
      const baseAbility = CIRRUS_FLOOF.ability as StructuredAbility;
      const baseEffect: any = baseAbility.effects[0];
      expect(baseEffect.by).toBeDefined();

      const level9Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      const level9Effect: any = level9Ability.effects[0];
      expect(level9Effect.by).toContain('all');
    });
  });

  describe('Ability Synergies', () => {
    test('should provide team-wide temporary HP buffs', () => {
      const level4Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![4].ability!;
      const hasTemporaryHP = level4Ability.effects.some(
        (e: any) => e.type === EffectType.TemporaryHP && e.target === AbilityTarget.AllAllies
      );
      expect(hasTemporaryHP).toBe(true);
    });

    test('should synergize with defensive team strategies', () => {
      const level9Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      const hasDamageReduction = level9Ability.effects.some(
        (e: any) => e.type === EffectType.DamageReduction && e.target === AbilityTarget.AllAllies
      );
      expect(hasDamageReduction).toBe(true);
    });

    test('should excel at protecting fragile units', () => {
      const level9Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      const teamProtection = level9Ability.effects.filter(
        (e: any) => e.target === AbilityTarget.AllAllies
      );
      expect(teamProtection.length).toBeGreaterThan(0);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain cloud-themed ability names', () => {
      const baseAbility = CIRRUS_FLOOF.ability as StructuredAbility;
      expect(baseAbility.name).toBe('Lightness');
      expect(CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![4].ability!.name).toBe('Storm Shield');
      expect(CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![7].ability!.name).toBe('Ethereal Form');
      expect(CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!.name).toBe('Celestial Protector');
    });

    test('should embody ethereal cloud creature mechanics', () => {
      // High HP represents fluffy cloud durability
      expect(CIRRUS_FLOOF.baseHealth).toBeGreaterThanOrEqual(6);

      // Low attack represents non-aggressive nature
      expect(CIRRUS_FLOOF.baseAttack).toBeLessThanOrEqual(1);

      // Untargetability represents intangibility
      const baseAbility = CIRRUS_FLOOF.ability as StructuredAbility;
      expect(baseAbility.effects[0].type).toBe(EffectType.CannotBeTargeted);
    });

    test('should represent protective cloud cover mechanics', () => {
      const level4Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![4].ability!;
      expect(level4Ability.name).toBe('Storm Shield');
      expect(level4Ability.trigger).toBe(AbilityTrigger.StartOfTurn);
      const effect: any = level4Ability.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });
  });

  describe('Edge Cases and Special Mechanics', () => {
    test('should have cost-based protection threshold', () => {
      const baseAbility = CIRRUS_FLOOF.ability as StructuredAbility;
      const effect: any = baseAbility.effects[0];
      expect(effect.costThreshold).toBeDefined();
      expect(typeof effect.costThreshold).toBe('number');
    });

    test('should transition from conditional to absolute protection', () => {
      const baseAbility = CIRRUS_FLOOF.ability as StructuredAbility;
      const baseEffect: any = baseAbility.effects[0];
      expect(baseEffect.by).toContain('high-cost-units');

      const level7Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![7].ability!;
      const level7Effect: any = level7Ability.effects[0];
      expect(level7Effect.by).toContain('attacks');

      const level9Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      const level9Effect: any = level9Ability.effects[0];
      expect(level9Effect.by).toContain('all');
    });

    test('should have permanent aura effects at max level', () => {
      const level9Ability = CIRRUS_FLOOF.levelingConfig!.abilityUpgrades![9].ability!;
      const auraEffect: any = level9Ability.effects.find(
        (e: any) => e.type === EffectType.DamageReduction
      );
      expect(auraEffect).toBeDefined();
      expect(auraEffect!.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should maintain extremely high HP-to-ATK ratio', () => {
      const statGains = CIRRUS_FLOOF.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBeGreaterThan(statGains[9].atk * 4);
    });
  });
});
