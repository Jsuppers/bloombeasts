/**
 * Tests for Blazefinch card
 */

import { describe, test, expect } from '@jest/globals';
import { BLAZEFINCH } from './blazefinch.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, ConditionType, StructuredAbility } from '../../types/abilities.js';

describe('Blazefinch Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(BLAZEFINCH);
    });

    test('should have correct card properties', () => {
      expect(BLAZEFINCH.id).toBe('blazefinch');
      expect(BLAZEFINCH.name).toBe('Blazefinch');
      expect(BLAZEFINCH.type).toBe('Bloom');
      expect(BLAZEFINCH.affinity).toBe('Fire');
      expect(BLAZEFINCH.cost).toBe(1);
      expect(BLAZEFINCH.baseAttack).toBe(1);
      expect(BLAZEFINCH.baseHealth).toBe(2);
    });

    test('should be a low-cost aggressive unit with fragile stats', () => {
      expect(BLAZEFINCH.baseHealth).toBe(2);
      expect(BLAZEFINCH.baseAttack).toBe(1);
      expect(BLAZEFINCH.cost).toBe(1);
      expect(BLAZEFINCH.baseAttack + BLAZEFINCH.baseHealth).toBe(3);
    });
  });

  describe('Base Ability - Quick Strike', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(BLAZEFINCH.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(BLAZEFINCH.ability.name).toBe('Quick Strike');
    });

    test('should be a passive ability', () => {
      expect(BLAZEFINCH.ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should remove summoning sickness', () => {
      const ability = BLAZEFINCH.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.RemoveSummoningSickness);
      expect(effect.target).toBe(AbilityTarget.Self);
    });

    test('should enable immediate attack capability', () => {
      const ability = BLAZEFINCH.ability as StructuredAbility;
      const hasRemoveSummoningSickness = ability.effects.some(
        e => e.type === EffectType.RemoveSummoningSickness
      );
      expect(hasRemoveSummoningSickness).toBe(true);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(BLAZEFINCH);
    });

    test('should have stat gains for all levels', () => {
      expect(BLAZEFINCH.levelingConfig).toBeDefined();
      expect(BLAZEFINCH.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(BLAZEFINCH.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(BLAZEFINCH);
    });

    test('should heavily prioritize ATK gains over HP gains', () => {
      const statGains = BLAZEFINCH.levelingConfig!.statGains!;
      expect(statGains[9].atk).toBe(13);
      expect(statGains[9].hp).toBe(3);
      expect(statGains[9].atk).toBeGreaterThan(statGains[9].hp * 4);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(BLAZEFINCH.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(BLAZEFINCH.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Ember Strike', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = BLAZEFINCH.levelingConfig!.abilityUpgrades![4];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.name).toBe('Ember Strike');
    });

    test('should trigger on attack', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should deal triple damage to damaged enemies', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.AttackModification);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.modification).toBe('triple-damage');
    });

    test('should have damaged condition', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const effect: any = ability.effects[0];
      expect(effect.condition).toBeDefined();
      expect(effect.condition!.type).toBe(ConditionType.IsDamaged);
    });

    test('should add execute mechanic', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const hasAttackModification = ability.effects.some(
        e => e.type === EffectType.AttackModification
      );
      expect(hasAttackModification).toBe(true);
    });
  });

  describe('Level 7 Upgrade - Lightning Speed', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = BLAZEFINCH.levelingConfig!.abilityUpgrades![7];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.name).toBe('Lightning Speed');
    });

    test('should be a passive ability', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should remove summoning sickness and attack twice', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const removeSicknessEffect: any = ability.effects[0];
      expect(removeSicknessEffect.type).toBe(EffectType.RemoveSummoningSickness);
      expect(removeSicknessEffect.target).toBe(AbilityTarget.Self);

      const attackTwiceEffect: any = ability.effects[1];
      expect(attackTwiceEffect.type).toBe(EffectType.AttackModification);
      expect(attackTwiceEffect.target).toBe(AbilityTarget.Self);
      expect(attackTwiceEffect.modification).toBe('attack-twice');
    });

    test('should combine speed and multi-attack', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const hasRemoveSickness = countEffectsByType(ability.effects, EffectType.RemoveSummoningSickness) > 0;
      const hasAttackModification = countEffectsByType(ability.effects, EffectType.AttackModification) > 0;
      expect(hasRemoveSickness).toBe(true);
      expect(hasAttackModification).toBe(true);
    });
  });

  describe('Level 9 Upgrade - Phoenix Form & Annihilation', () => {
    test('should have upgraded passive ability at level 9', () => {
      const upgrade = BLAZEFINCH.levelingConfig!.abilityUpgrades![9];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.name).toBe('Phoenix Form');
    });

    test('should be a passive ability', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should attack twice', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      expect(ability.effects.length).toBeGreaterThanOrEqual(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.AttackModification);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.modification).toBe('attack-twice');
    });

    test('should enable ultimate offensive capabilities', () => {
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      const hasAttackModification = ability.effects.some(
        e => e.type === EffectType.AttackModification
      );
      expect(hasAttackModification).toBe(true);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain aggressive glass cannon role throughout progression', () => {
      const statGains = BLAZEFINCH.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.atk).toBeGreaterThanOrEqual(gains.hp);
      }
    });

    test('should have consistent speed and execute theme', () => {
      const baseAbility = BLAZEFINCH.ability as StructuredAbility;
      expect(baseAbility.effects[0].type).toBe(EffectType.RemoveSummoningSickness);

      const level4Ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const level4Effect: any = level4Ability.effects[0];
      expect(level4Effect.condition?.type).toBe(ConditionType.IsDamaged);
    });

    test('should scale appropriately for a 1-cost aggro unit', () => {
      expect(BLAZEFINCH.cost).toBe(1);
      expect(BLAZEFINCH.baseAttack + BLAZEFINCH.baseHealth).toBe(3);
      const maxStats = BLAZEFINCH.levelingConfig!.statGains![9];
      expect(maxStats.atk + maxStats.hp).toBe(16);
    });

    test('should have extreme attack scaling', () => {
      const statGains = BLAZEFINCH.levelingConfig!.statGains!;
      expect(statGains[9].atk).toBe(13);
      expect(statGains[1].atk).toBe(0);
      expect(statGains[9].atk - statGains[1].atk).toBe(13);
    });
  });

  describe('Ability Synergies', () => {
    test('should synergize with fast aggressive strategies', () => {
      const baseAbility = BLAZEFINCH.ability as StructuredAbility;
      const hasRemoveSickness = baseAbility.effects.some(
        e => e.type === EffectType.RemoveSummoningSickness
      );
      expect(hasRemoveSickness).toBe(true);
    });

    test('should enable execute strategies against damaged enemies', () => {
      const level4Ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![4].ability! as StructuredAbility;
      const effect: any = level4Ability.effects[0];
      expect(effect.condition?.type).toBe(ConditionType.IsDamaged);
      expect(effect.modification).toBe('triple-damage');
    });

    test('should scale into multi-attack powerhouse', () => {
      const level7Ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const level9Ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;

      const level7HasMultiAttack = level7Ability.effects.some(
        (e: any) => e.modification === 'attack-twice'
      );
      const level9HasMultiAttack = level9Ability.effects.some(
        (e: any) => e.modification === 'attack-twice'
      );

      expect(level7HasMultiAttack).toBe(true);
      expect(level9HasMultiAttack).toBe(true);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain fire-themed ability names', () => {
      expect(BLAZEFINCH.ability.name).toBe('Quick Strike');
      expect(BLAZEFINCH.levelingConfig!.abilityUpgrades![4].ability!.name).toBe('Ember Strike');
      expect(BLAZEFINCH.levelingConfig!.abilityUpgrades![7].ability!.name).toBe('Lightning Speed');
      expect(BLAZEFINCH.levelingConfig!.abilityUpgrades![9].ability!.name).toBe('Phoenix Form');
    });

    test('should embody speed and aggression mechanics', () => {
      const baseAbility = BLAZEFINCH.ability as StructuredAbility;
      expect(baseAbility.trigger).toBe(AbilityTrigger.Passive);
      expect(baseAbility.effects[0].type).toBe(EffectType.RemoveSummoningSickness);

      const level7Ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![7].ability! as StructuredAbility;
      const hasMultiAttack = level7Ability.effects.some(
        (e: any) => e.modification === 'attack-twice'
      );
      expect(hasMultiAttack).toBe(true);
    });

    test('should represent a phoenix-like evolution', () => {
      expect(BLAZEFINCH.levelingConfig!.abilityUpgrades![9].ability!.name).toBe('Phoenix Form');
      const ability = BLAZEFINCH.levelingConfig!.abilityUpgrades![9].ability! as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });
  });
});
