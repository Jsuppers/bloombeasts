/**
 * Tests for Charcoil card
 */

import { describe, test, expect } from '@jest/globals';
import { CHARCOIL } from './charcoil.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, ImmunityType, EffectDuration, StructuredAbility } from '../../types/abilities.js';

describe('Charcoil Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(CHARCOIL);
    });

    test('should have correct card properties', () => {
      expect(CHARCOIL.id).toBe('charcoil');
      expect(CHARCOIL.name).toBe('Charcoil');
      expect(CHARCOIL.type).toBe('Bloom');
      expect(CHARCOIL.affinity).toBe('Fire');
      expect(CHARCOIL.cost).toBe(2);
      expect(CHARCOIL.baseAttack).toBe(3);
      expect(CHARCOIL.baseHealth).toBe(4);
    });

    test('should be a balanced defensive unit with retaliation', () => {
      expect(CHARCOIL.baseHealth).toBeGreaterThan(CHARCOIL.baseAttack);
      expect(CHARCOIL.cost).toBe(2);
      expect(CHARCOIL.baseAttack + CHARCOIL.baseHealth).toBe(7);
    });
  });

  describe('Base Ability - Flame Retaliation', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(CHARCOIL.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(CHARCOIL.ability.name).toBe('Flame Retaliation');
    });

    test('should trigger on damage', () => {
      expect(CHARCOIL.ability.trigger).toBe(AbilityTrigger.OnDamage);
    });

    test('should deal 1 retaliation damage to attacker', () => {
      const ability = CHARCOIL.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.Retaliation);
      expect(effect.target).toBe(AbilityTarget.Attacker);
      expect(effect.value).toBe(1);
    });

    test('should punish attackers immediately', () => {
      const ability = CHARCOIL.ability as StructuredAbility;
      const hasRetaliation = ability.effects.some(e => e.type === EffectType.Retaliation);
      expect(hasRetaliation).toBe(true);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(CHARCOIL);
    });

    test('should have stat gains for all levels', () => {
      expect(CHARCOIL.levelingConfig).toBeDefined();
      expect(CHARCOIL.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(CHARCOIL.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(CHARCOIL);
    });

    test('should prioritize HP gains over ATK gains', () => {
      const statGains = CHARCOIL.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(11);
      expect(statGains[9].atk).toBe(8);
      expect(statGains[9].hp).toBeGreaterThan(statGains[9].atk);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(CHARCOIL.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(CHARCOIL.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Burning Retaliation', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = CHARCOIL.levelingConfig!.abilityUpgrades![4];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.name).toBe('Burning Retaliation');
    });

    test('should still trigger on damage', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnDamage);
    });

    test('should deal increased retaliation damage and apply burn', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const retaliationEffect: any = ability.effects[0];
      expect(retaliationEffect.type).toBe(EffectType.Retaliation);
      expect(retaliationEffect.target).toBe(AbilityTarget.Attacker);
      expect(retaliationEffect.value).toBe(2);

      const burnEffect: any = ability.effects[1];
      expect(burnEffect.type).toBe(EffectType.ApplyCounter);
      expect(burnEffect.target).toBe(AbilityTarget.Attacker);
      expect(burnEffect.counter).toBe('Burn');
      expect(burnEffect.value).toBe(1);
    });

    test('should be a power upgrade from base ability', () => {
      const baseAbility = CHARCOIL.ability as StructuredAbility;
      const upgradedAbility = CHARCOIL.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const baseEffect: any = baseAbility.effects[0];
      const upgradedEffect: any = upgradedAbility.effects[0];
      expect(upgradedEffect.value).toBeGreaterThan(baseEffect.value);
      expect(upgradedAbility.effects.length).toBeGreaterThan(baseAbility.effects.length);
    });
  });

  describe('Level 7 Upgrade - Smoke Screen', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = CHARCOIL.levelingConfig!.abilityUpgrades![7];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.name).toBe('Smoke Screen');
    });

    test('should trigger on damage', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnDamage);
    });

    test('should grant immunity to magic and traps', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const immunityEffect: any = ability.effects[0];
      expect(immunityEffect.type).toBe(EffectType.Immunity);
      expect(immunityEffect.target).toBe(AbilityTarget.Self);
      expect(immunityEffect.immuneTo).toContain(ImmunityType.Magic);
      expect(immunityEffect.immuneTo).toContain(ImmunityType.Trap);
      expect(immunityEffect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should apply increased soot counters', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const sootEffect: any = ability.effects[1];
      expect(sootEffect.type).toBe(EffectType.ApplyCounter);
      expect(sootEffect.target).toBe(AbilityTarget.Target);
      expect(sootEffect.counter).toBe('Soot');
      expect(sootEffect.value).toBe(2);
    });

    test('should add defensive utility', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const hasImmunity = ability.effects.some(e => e.type === EffectType.Immunity);
      expect(hasImmunity).toBe(true);
    });
  });

  describe('Level 9 Upgrade - Blazing Vengeance & Infernal Reflection', () => {
    test('should have upgraded passive ability at level 9', () => {
      const upgrade = CHARCOIL.levelingConfig!.abilityUpgrades![9];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.name).toBe('Blazing Vengeance');
    });

    test('should trigger on damage', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnDamage);
    });

    test('should maintain immunity and apply heavy burn', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const immunityEffect: any = ability.effects[0];
      expect(immunityEffect.type).toBe(EffectType.Immunity);
      expect(immunityEffect.target).toBe(AbilityTarget.Self);
      expect(immunityEffect.immuneTo).toContain(ImmunityType.Magic);
      expect(immunityEffect.immuneTo).toContain(ImmunityType.Trap);

      const burnEffect: any = ability.effects[1];
      expect(burnEffect.type).toBe(EffectType.ApplyCounter);
      expect(burnEffect.target).toBe(AbilityTarget.Attacker);
      expect(burnEffect.counter).toBe('Burn');
      expect(burnEffect.value).toBe(3);
    });

    test('should combine offensive and defensive capabilities', () => {
      const ability = CHARCOIL.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      const hasImmunity = countEffectsByType(ability.effects, EffectType.Immunity) > 0;
      const hasCounter = countEffectsByType(ability.effects, EffectType.ApplyCounter) > 0;
      expect(hasImmunity).toBe(true);
      expect(hasCounter).toBe(true);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain defensive tank role throughout progression', () => {
      const statGains = CHARCOIL.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBeGreaterThanOrEqual(gains.atk);
      }
    });

    test('should have consistent retaliation theme', () => {
      const baseAbility = CHARCOIL.ability as StructuredAbility;
      expect(baseAbility.effects[0].type).toBe(EffectType.Retaliation);

      const level4Ability = CHARCOIL.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      expect(level4Ability.effects[0].type).toBe(EffectType.Retaliation);
    });

    test('should scale appropriately for a 2-cost defensive unit', () => {
      expect(CHARCOIL.cost).toBe(2);
      expect(CHARCOIL.baseAttack + CHARCOIL.baseHealth).toBe(7);
      const maxStats = CHARCOIL.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(19);
    });

    test('should evolve from retaliation to immunity and burn', () => {
      const baseAbility = CHARCOIL.ability as StructuredAbility;
      const baseHasRetaliation = baseAbility.effects.some(e => e.type === EffectType.Retaliation);
      expect(baseHasRetaliation).toBe(true);

      const level7Ability = CHARCOIL.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const level7HasImmunity = level7Ability.effects.some(e => e.type === EffectType.Immunity);
      expect(level7HasImmunity).toBe(true);

      const level9Ability = CHARCOIL.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      const level9HasBurn = level9Ability.effects.some(
        (e: any) => e.type === EffectType.ApplyCounter && e.counter === 'Burn'
      );
      expect(level9HasBurn).toBe(true);
    });
  });

  describe('Ability Synergies', () => {
    test('should synergize with defensive strategies', () => {
      const baseAbility = CHARCOIL.ability as StructuredAbility;
      expect(baseAbility.trigger).toBe(AbilityTrigger.OnDamage);
      expect(baseAbility.effects[0].type).toBe(EffectType.Retaliation);
    });

    test('should counter magic and trap heavy decks', () => {
      const level7Ability = CHARCOIL.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const immunityEffect: any = level7Ability.effects[0];
      expect(immunityEffect.type).toBe(EffectType.Immunity);
      expect(immunityEffect.immuneTo).toContain(ImmunityType.Magic);
      expect(immunityEffect.immuneTo).toContain(ImmunityType.Trap);
    });

    test('should scale from simple retaliation to complex burn synergies', () => {
      const level4Ability = CHARCOIL.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const hasBurn = level4Ability.effects.some(
        (e: any) => e.type === EffectType.ApplyCounter && e.counter === 'Burn'
      );
      expect(hasBurn).toBe(true);

      const level9Ability = CHARCOIL.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      const burnEffect: any = level9Ability.effects.find(
        (e: any) => e.type === EffectType.ApplyCounter && e.counter === 'Burn'
      );
      expect(burnEffect?.value).toBe(3);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain fire-themed ability names', () => {
      expect(CHARCOIL.ability.name).toBe('Flame Retaliation');
      expect(CHARCOIL.levelingConfig!.abilityUpgrades![4].ability!.name).toBe('Burning Retaliation');
      expect(CHARCOIL.levelingConfig!.abilityUpgrades![7].ability!.name).toBe('Smoke Screen');
      expect(CHARCOIL.levelingConfig!.abilityUpgrades![9].ability!.name).toBe('Blazing Vengeance');
    });

    test('should embody defensive retaliation mechanics', () => {
      const baseAbility = CHARCOIL.ability as StructuredAbility;
      expect(baseAbility.trigger).toBe(AbilityTrigger.OnDamage);
      expect(baseAbility.effects[0].type).toBe(EffectType.Retaliation);

      const level4Ability = CHARCOIL.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      expect(level4Ability.effects[0].type).toBe(EffectType.Retaliation);
    });

    test('should represent charcoal and soot thematically', () => {
      const level7Ability = CHARCOIL.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const sootEffect: any = level7Ability.effects.find(
        (e: any) => e.type === EffectType.ApplyCounter && e.counter === 'Soot'
      );
      expect(sootEffect).toBeDefined();

      expect(CHARCOIL.levelingConfig!.abilityUpgrades![7].ability!.name).toBe('Smoke Screen');
    });
  });
});
