/**
 * Tests for Cinder Pup card
 */

import { describe, test, expect } from '@jest/globals';
import { CINDER_PUP } from './cinderPup.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, CostType, StructuredAbility } from '../../types/abilities.js';

describe('Cinder Pup Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(CINDER_PUP);
    });

    test('should have correct card properties', () => {
      expect(CINDER_PUP.id).toBe('cinder-pup');
      expect(CINDER_PUP.name).toBe('Cinder Pup');
      expect(CINDER_PUP.type).toBe('Bloom');
      expect(CINDER_PUP.affinity).toBe('Fire');
      expect(CINDER_PUP.cost).toBe(2);
      expect(CINDER_PUP.baseAttack).toBe(2);
      expect(CINDER_PUP.baseHealth).toBe(3);
    });

    test('should be a balanced unit with burn focus', () => {
      expect(CINDER_PUP.baseHealth).toBeGreaterThan(CINDER_PUP.baseAttack);
      expect(CINDER_PUP.cost).toBe(2);
      expect(CINDER_PUP.baseAttack + CINDER_PUP.baseHealth).toBe(5);
    });
  });

  describe('Base Ability - Burning Passion', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(CINDER_PUP.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(CINDER_PUP.ability.name).toBe('Burning Passion');
    });

    test('should trigger on attack', () => {
      expect(CINDER_PUP.ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should apply 1 Burn counter to target on attack', () => {
      const ability = CINDER_PUP.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.target).toBe(AbilityTarget.Target);
      expect(effect.counter).toBe('Burn');
      expect(effect.value).toBe(1);
    });

    test('should apply burn on every attack', () => {
      const ability = CINDER_PUP.ability as StructuredAbility;
      const hasBurn = ability.effects.some(
        (e: any) => e.type === EffectType.ApplyCounter && e.counter === 'Burn'
      );
      expect(hasBurn).toBe(true);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(CINDER_PUP);
    });

    test('should have stat gains for all levels', () => {
      expect(CINDER_PUP.levelingConfig).toBeDefined();
      expect(CINDER_PUP.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(CINDER_PUP.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(CINDER_PUP);
    });

    test('should have perfectly balanced stat growth', () => {
      const statGains = CINDER_PUP.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(8);
      expect(statGains[9].atk).toBe(8);
      expect(statGains[9].hp).toBe(statGains[9].atk);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(CINDER_PUP.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(CINDER_PUP.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Inferno Bite', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = CINDER_PUP.levelingConfig!.abilityUpgrades![4];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.name).toBe('Inferno Bite');
    });

    test('should still trigger on attack', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should apply 2 Burn counters instead of 1', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.target).toBe(AbilityTarget.Target);
      expect(effect.counter).toBe('Burn');
      expect(effect.value).toBe(2);
    });

    test('should be a power upgrade from base ability', () => {
      const baseAbility = CINDER_PUP.ability as StructuredAbility;
      const upgradedAbility = CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const baseEffect: any = baseAbility.effects[0];
      const upgradedEffect: any = upgradedAbility.effects[0];
      expect(upgradedEffect.value).toBeGreaterThan(baseEffect.value);
    });
  });

  describe('Level 7 Upgrade - Flame Burst', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = CINDER_PUP.levelingConfig!.abilityUpgrades![7];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.name).toBe('Flame Burst');
    });

    test('should be an activated ability', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Activated);
    });

    test('should have discard cost', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(ability.cost).toBeDefined();
      expect(ability.cost!.type).toBe(CostType.Discard);
      expect(ability.cost!.value).toBe(1);
    });

    test('should apply 2 Burn counters to all enemies', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.target).toBe(AbilityTarget.AllEnemies);
      expect(effect.counter).toBe('Burn');
      expect(effect.value).toBe(2);
    });

    test('should provide AoE burn capability', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const effect: any = ability.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllEnemies);
    });
  });

  describe('Level 9 Upgrade - Wildfire Aura & Apocalypse Flame', () => {
    test('should have upgraded passive ability at level 9', () => {
      const upgrade = CINDER_PUP.levelingConfig!.abilityUpgrades![9];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.name).toBe('Wildfire Aura');
    });

    test('should trigger on attack', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should apply 3 Burn counters to target', () => {
      const ability = CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.target).toBe(AbilityTarget.Target);
      expect(effect.counter).toBe('Burn');
      expect(effect.value).toBe(3);
    });

    test('should maximize burn application', () => {
      const baseAbility = CINDER_PUP.ability as StructuredAbility;
      const level4Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const level9Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;

      const baseValue = (baseAbility.effects[0] as any).value;
      const level4Value = (level4Ability.effects[0] as any).value;
      const level9Value = (level9Ability.effects[0] as any).value;

      expect(level4Value).toBeGreaterThan(baseValue);
      expect(level9Value).toBeGreaterThan(level4Value);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain balanced stat growth throughout progression', () => {
      const statGains = CINDER_PUP.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBe(gains.atk);
      }
    });

    test('should have consistent burn application theme', () => {
      const baseAbility = CINDER_PUP.ability as StructuredAbility;
      expect((baseAbility.effects[0] as any).counter).toBe('Burn');

      const level4Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      expect((level4Ability.effects[0] as any).counter).toBe('Burn');

      const level9Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      expect((level9Ability.effects[0] as any).counter).toBe('Burn');
    });

    test('should scale appropriately for a 2-cost burn specialist', () => {
      expect(CINDER_PUP.cost).toBe(2);
      expect(CINDER_PUP.baseAttack + CINDER_PUP.baseHealth).toBe(5);
      const maxStats = CINDER_PUP.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(16);
    });

    test('should increase burn power at each upgrade', () => {
      const baseAbility = CINDER_PUP.ability as StructuredAbility;
      const level4Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const level9Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;

      const baseBurn = (baseAbility.effects[0] as any).value;
      const level4Burn = (level4Ability.effects[0] as any).value;
      const level9Burn = (level9Ability.effects[0] as any).value;

      expect(level4Burn).toBe(2);
      expect(level9Burn).toBe(3);
      expect(baseBurn).toBe(1);
    });
  });

  describe('Ability Synergies', () => {
    test('should synergize with burn-focused strategies', () => {
      const baseAbility = CINDER_PUP.ability as StructuredAbility;
      const effect: any = baseAbility.effects[0];
      expect(effect.type).toBe(EffectType.ApplyCounter);
      expect(effect.counter).toBe('Burn');
    });

    test('should provide AoE burn at level 7', () => {
      const level7Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const effect: any = level7Ability.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllEnemies);
      expect(effect.counter).toBe('Burn');
    });

    test('should scale from single-target to multi-target burn', () => {
      const baseAbility = CINDER_PUP.ability as StructuredAbility;
      const level7Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;

      const baseTarget = (baseAbility.effects[0] as any).target;
      const level7Target = (level7Ability.effects[0] as any).target;

      expect(baseTarget).toBe(AbilityTarget.Target);
      expect(level7Target).toBe(AbilityTarget.AllEnemies);
    });

    test('should have activated abilities for strategic play', () => {
      const level7Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(level7Ability.trigger).toBe(AbilityTrigger.Activated);
      expect(level7Ability.cost).toBeDefined();
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain fire-themed ability names', () => {
      expect(CINDER_PUP.ability.name).toBe('Burning Passion');
      expect(CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability!.name).toBe('Inferno Bite');
      expect(CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability!.name).toBe('Flame Burst');
      expect(CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability!.name).toBe('Wildfire Aura');
    });

    test('should embody burn and damage-over-time mechanics', () => {
      const baseAbility = CINDER_PUP.ability as StructuredAbility;
      expect((baseAbility.effects[0] as any).counter).toBe('Burn');

      const level4Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      expect((level4Ability.effects[0] as any).counter).toBe('Burn');

      const level7Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect((level7Ability.effects[0] as any).counter).toBe('Burn');
    });

    test('should represent growing wildfire intensity', () => {
      expect(CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability!.name).toBe('Flame Burst');
      expect(CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability!.name).toBe('Wildfire Aura');

      const level9Ability = CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      expect((level9Ability.effects[0] as any).value).toBe(3);
    });

    test('should be a dedicated burn applier', () => {
      const abilities = [
        CINDER_PUP.ability,
        CINDER_PUP.levelingConfig!.abilityUpgrades![4].ability!,
        CINDER_PUP.levelingConfig!.abilityUpgrades![7].ability!,
        CINDER_PUP.levelingConfig!.abilityUpgrades![9].ability!,
      ];

      abilities.forEach(ability => {
        const hasBurn = (ability as StructuredAbility).effects.some(
          (e: any) => e.type === EffectType.ApplyCounter && e.counter === 'Burn'
        );
        expect(hasBurn).toBe(true);
      });
    });
  });
});
