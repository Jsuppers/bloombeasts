/**
 * Tests for Magmite card
 */

import { describe, test, expect } from '@jest/globals';
import { MAGMITE } from './magmite.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, EffectDuration, ConditionType, Comparison, StructuredAbility } from '../../types/abilities.js';

describe('Magmite Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(MAGMITE);
    });

    test('should have correct card properties', () => {
      expect(MAGMITE.id).toBe('magmite');
      expect(MAGMITE.name).toBe('Magmite');
      expect(MAGMITE.type).toBe('Bloom');
      expect(MAGMITE.affinity).toBe('Fire');
      expect(MAGMITE.cost).toBe(3);
      expect(MAGMITE.baseAttack).toBe(4);
      expect(MAGMITE.baseHealth).toBe(6);
    });

    test('should be a defensive tank with strong base stats', () => {
      expect(MAGMITE.baseHealth).toBeGreaterThan(MAGMITE.baseAttack);
      expect(MAGMITE.cost).toBe(3);
      expect(MAGMITE.baseAttack + MAGMITE.baseHealth).toBe(10);
    });
  });

  describe('Base Ability - Hardened Shell', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(MAGMITE.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(MAGMITE.ability.name).toBe('Hardened Shell');
    });

    test('should be a passive ability', () => {
      expect(MAGMITE.ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should reduce incoming damage by 1', () => {
      const ability = MAGMITE.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.DamageReduction);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.value).toBe(1);
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should provide passive defensive capability', () => {
      const ability = MAGMITE.ability as StructuredAbility;
      const hasDamageReduction = ability.effects.some(
        e => e.type === EffectType.DamageReduction
      );
      expect(hasDamageReduction).toBe(true);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(MAGMITE);
    });

    test('should have stat gains for all levels', () => {
      expect(MAGMITE.levelingConfig).toBeDefined();
      expect(MAGMITE.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(MAGMITE.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(MAGMITE);
    });

    test('should heavily prioritize HP gains over ATK gains', () => {
      const statGains = MAGMITE.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(15);
      expect(statGains[9].atk).toBe(9);
      expect(statGains[9].hp).toBeGreaterThan(statGains[9].atk);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(MAGMITE.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(MAGMITE.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Molten Armor', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = MAGMITE.levelingConfig!.abilityUpgrades![4];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.name).toBe('Molten Armor');
    });

    test('should remain a passive ability', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should reduce incoming damage by 2 instead of 1', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.DamageReduction);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.value).toBe(2);
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should be a power upgrade from base ability', () => {
      const baseAbility = MAGMITE.ability as StructuredAbility;
      const upgradedAbility = MAGMITE.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const baseEffect: any = baseAbility.effects[0];
      const upgradedEffect: any = upgradedAbility.effects[0];
      expect(upgradedEffect.value).toBeGreaterThan(baseEffect.value);
    });
  });

  describe('Level 7 Upgrade - Eruption', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = MAGMITE.levelingConfig!.abilityUpgrades![7];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.name).toBe('Eruption');
    });

    test('should trigger on destroy', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnDestroy);
    });

    test('should deal 5 damage to opponent gardener and 2 to all enemies', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const gardenerEffect: any = ability.effects[0];
      expect(gardenerEffect.type).toBe(EffectType.DealDamage);
      expect(gardenerEffect.target).toBe(AbilityTarget.OpponentGardener);
      expect(gardenerEffect.value).toBe(5);

      const aoeEffect: any = ability.effects[1];
      expect(aoeEffect.type).toBe(EffectType.DealDamage);
      expect(aoeEffect.target).toBe(AbilityTarget.AllEnemies);
      expect(aoeEffect.value).toBe(2);
    });

    test('should add death effect capability', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnDestroy);
      const hasDamage = ability.effects.some(e => e.type === EffectType.DealDamage);
      expect(hasDamage).toBe(true);
    });
  });

  describe('Level 9 Upgrade - Obsidian Carapace & Cataclysm', () => {
    test('should have upgraded passive ability at level 9', () => {
      const upgrade = MAGMITE.levelingConfig!.abilityUpgrades![9];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.name).toBe('Obsidian Carapace');
    });

    test('should be a passive ability', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should reduce damage by 3 and retaliate for 2', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const reductionEffect: any = ability.effects[0];
      expect(reductionEffect.type).toBe(EffectType.DamageReduction);
      expect(reductionEffect.target).toBe(AbilityTarget.Self);
      expect(reductionEffect.value).toBe(3);
      expect(reductionEffect.duration).toBe(EffectDuration.WhileOnField);

      const retaliationEffect: any = ability.effects[1];
      expect(retaliationEffect.type).toBe(EffectType.Retaliation);
      expect(retaliationEffect.target).toBe(AbilityTarget.Attacker);
      expect(retaliationEffect.value).toBe(2);
    });

    test('should combine defense and offense', () => {
      const ability = MAGMITE.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      const hasDamageReduction = countEffectsByType(ability.effects, EffectType.DamageReduction) > 0;
      const hasRetaliation = countEffectsByType(ability.effects, EffectType.Retaliation) > 0;
      expect(hasDamageReduction).toBe(true);
      expect(hasRetaliation).toBe(true);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain tank role throughout progression', () => {
      const statGains = MAGMITE.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBeGreaterThanOrEqual(gains.atk);
      }
    });

    test('should have consistent defensive and death effect theme', () => {
      const baseAbility = MAGMITE.ability as StructuredAbility;
      expect(baseAbility.effects[0].type).toBe(EffectType.DamageReduction);

      const level7Ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(level7Ability.trigger).toBe(AbilityTrigger.OnDestroy);
    });

    test('should scale appropriately for a 3-cost tank', () => {
      expect(MAGMITE.cost).toBe(3);
      expect(MAGMITE.baseAttack + MAGMITE.baseHealth).toBe(10);
      const maxStats = MAGMITE.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(24);
    });

    test('should have increasing damage reduction', () => {
      const baseAbility = MAGMITE.ability as StructuredAbility;
      const level4Ability = MAGMITE.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const level9Ability = MAGMITE.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;

      const baseReduction = (baseAbility.effects[0] as any).value;
      const level4Reduction = (level4Ability.effects[0] as any).value;
      const level9Reduction = (level9Ability.effects[0] as any).value;

      expect(level4Reduction).toBe(2);
      expect(level9Reduction).toBe(3);
      expect(baseReduction).toBe(1);
    });
  });

  describe('Ability Synergies', () => {
    test('should synergize with defensive strategies', () => {
      const baseAbility = MAGMITE.ability as StructuredAbility;
      expect(baseAbility.trigger).toBe(AbilityTrigger.Passive);
      expect(baseAbility.effects[0].type).toBe(EffectType.DamageReduction);
    });

    test('should provide death value at level 7', () => {
      const level7Ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(level7Ability.trigger).toBe(AbilityTrigger.OnDestroy);
      const hasDamage = level7Ability.effects.some(e => e.type === EffectType.DealDamage);
      expect(hasDamage).toBe(true);
    });

    test('should become nearly invincible at level 9', () => {
      const level9Ability = MAGMITE.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      const reductionEffect: any = level9Ability.effects[0];
      expect(reductionEffect.value).toBe(3);

      const statGains = MAGMITE.levelingConfig!.statGains![9];
      expect(statGains.hp).toBe(15);
    });

    test('should punish attackers at higher levels', () => {
      const level9Ability = MAGMITE.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      const hasRetaliation = level9Ability.effects.some(e => e.type === EffectType.Retaliation);
      expect(hasRetaliation).toBe(true);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain fire and rock-themed ability names', () => {
      expect(MAGMITE.ability.name).toBe('Hardened Shell');
      expect(MAGMITE.levelingConfig!.abilityUpgrades![4].ability!.name).toBe('Molten Armor');
      expect(MAGMITE.levelingConfig!.abilityUpgrades![7].ability!.name).toBe('Eruption');
      expect(MAGMITE.levelingConfig!.abilityUpgrades![9].ability!.name).toBe('Obsidian Carapace');
    });

    test('should embody volcanic tank mechanics', () => {
      const baseAbility = MAGMITE.ability as StructuredAbility;
      expect(baseAbility.trigger).toBe(AbilityTrigger.Passive);
      expect(baseAbility.effects[0].type).toBe(EffectType.DamageReduction);

      const level7Ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(level7Ability.trigger).toBe(AbilityTrigger.OnDestroy);
      expect(level7Ability.name).toBe('Eruption');
    });

    test('should represent volcanic eruption on death', () => {
      const level7Ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(level7Ability.name).toBe('Eruption');
      expect(level7Ability.trigger).toBe(AbilityTrigger.OnDestroy);

      const gardenerEffect: any = level7Ability.effects[0];
      expect(gardenerEffect.target).toBe(AbilityTarget.OpponentGardener);
      expect(gardenerEffect.value).toBe(5);
    });

    test('should be an ultimate finisher', () => {
      const level7Ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(level7Ability.trigger).toBe(AbilityTrigger.OnDestroy);

      const hasDamage = level7Ability.effects.some(
        (e: any) => e.type === EffectType.DealDamage && e.target === AbilityTarget.OpponentGardener
      );
      expect(hasDamage).toBe(true);
    });
  });

  describe('Advanced Mechanics', () => {
    test('should scale damage reduction progressively', () => {
      const abilities = [
        MAGMITE.ability as StructuredAbility,
        MAGMITE.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility,
        MAGMITE.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility,
      ];

      const reductions = abilities.map(ability => {
        const effect: any = ability.effects.find(e => e.type === EffectType.DamageReduction);
        return effect?.value || 0;
      });

      expect(reductions).toEqual([1, 2, 3]);
    });

    test('should have massive death effect at level 7', () => {
      const level7Ability = MAGMITE.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const totalDamage = level7Ability.effects.reduce((sum, effect: any) => {
        if (effect.type === EffectType.DealDamage && typeof effect.value === 'number') {
          return sum + effect.value;
        }
        return sum;
      }, 0);

      expect(totalDamage).toBe(7);
    });

    test('should combine multiple defensive mechanics at level 9', () => {
      const level9Ability = MAGMITE.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      const effectTypes = level9Ability.effects.map(e => e.type);
      expect(effectTypes).toContain(EffectType.DamageReduction);
      expect(effectTypes).toContain(EffectType.Retaliation);
    });
  });
});
