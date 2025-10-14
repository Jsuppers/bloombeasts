/**
 * Tests for Gale Glider card
 */

import { describe, test, expect } from '@jest/globals';
import { GALE_GLIDER } from './galeGlider.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration } from '../../types/abilities.js';
import type { StructuredAbility } from '../../types/abilities.js';

describe('Gale Glider Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(GALE_GLIDER);
    });

    test('should have correct card properties', () => {
      expect(GALE_GLIDER.id).toBe('gale-glider');
      expect(GALE_GLIDER.name).toBe('Gale Glider');
      expect(GALE_GLIDER.type).toBe('Bloom');
      expect(GALE_GLIDER.affinity).toBe('Sky');
      expect(GALE_GLIDER.cost).toBe(1);
      expect(GALE_GLIDER.baseAttack).toBe(2);
      expect(GALE_GLIDER.baseHealth).toBe(2);
    });

    test('should be a balanced aggressive 1-cost unit', () => {
      expect(GALE_GLIDER.baseAttack).toBe(GALE_GLIDER.baseHealth);
      expect(GALE_GLIDER.cost).toBe(1);
      expect(GALE_GLIDER.baseAttack + GALE_GLIDER.baseHealth).toBe(4);
    });
  });

  describe('Base Ability - First Wind', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(GALE_GLIDER.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = GALE_GLIDER.ability as StructuredAbility;
      expect(ability.name).toBe('First Wind');
    });

    test('should be a passive ability', () => {
      const ability = GALE_GLIDER.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should allow attacking first', () => {
      const ability = GALE_GLIDER.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.AttackModification);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.modification).toBe('attack-first');
    });

    test('should provide speed advantage in combat', () => {
      const ability = GALE_GLIDER.ability as StructuredAbility;
      const effect: any = ability.effects[0];
      expect(effect.modification).toBe('attack-first');
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(GALE_GLIDER);
    });

    test('should have stat gains for all levels', () => {
      expect(GALE_GLIDER.levelingConfig).toBeDefined();
      expect(GALE_GLIDER.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(GALE_GLIDER.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have non-decreasing stat gains', () => {
      validateStatGainsProgression(GALE_GLIDER);
    });

    test('should heavily prioritize ATK gains over HP gains', () => {
      const statGains = GALE_GLIDER.levelingConfig!.statGains!;
      expect(statGains[5].hp).toBe(1);
      expect(statGains[5].atk).toBe(7);
      expect(statGains[9].hp).toBe(3);
      expect(statGains[9].atk).toBe(14);
      // ATK gains should be significantly higher than HP
      expect(statGains[9].atk).toBeGreaterThan(statGains[9].hp * 4);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(GALE_GLIDER.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(GALE_GLIDER.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Wind Dance', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = GALE_GLIDER.levelingConfig!.abilityUpgrades![4];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability!);
    });

    test('should have correct ability name', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.name).toBe('Wind Dance');
    });

    test('should trigger on attack', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should allow movement to any slot', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![4].ability!;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.MoveUnit);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.destination).toBe('any-slot');
    });

    test('should provide enhanced mobility', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![4].ability!;
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.MoveUnit);
      expect(effect.destination).toBe('any-slot');
    });
  });

  describe('Level 7 Upgrade - Storm Blade', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = GALE_GLIDER.levelingConfig!.abilityUpgrades![7];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability!);
    });

    test('should have correct ability name', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.name).toBe('Storm Blade');
    });

    test('should be a passive ability', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should have multiple effects', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!;
      expect(ability.effects.length).toBeGreaterThan(1);
      expect(ability.effects).toHaveLength(2);
    });

    test('should maintain attack-first capability', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!;
      const attackFirstEffect: any = ability.effects[0];
      expect(attackFirstEffect.type).toBe(EffectType.AttackModification);
      expect(attackFirstEffect.target).toBe(AbilityTarget.Self);
      expect(attackFirstEffect.modification).toBe('attack-first');
    });

    test('should gain attack bonus for next attack', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!;
      const attackBonusEffect: any = ability.effects[1];
      expect(attackBonusEffect.type).toBe(EffectType.ModifyStats);
      expect(attackBonusEffect.target).toBe(AbilityTarget.Self);
      expect(attackBonusEffect.stat).toBe(StatType.Attack);
      expect(attackBonusEffect.value).toBe(2);
      expect(attackBonusEffect.duration).toBe(EffectDuration.NextAttack);
    });

    test('should combine speed with power', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!;
      const hasAttackFirst = ability.effects.some(
        (e: any) => e.type === EffectType.AttackModification && e.modification === 'attack-first'
      );
      const hasAttackBonus = ability.effects.some(
        (e: any) => e.type === EffectType.ModifyStats && e.stat === StatType.Attack
      );
      expect(hasAttackFirst).toBe(true);
      expect(hasAttackBonus).toBe(true);
    });
  });

  describe('Level 9 Upgrade - Tempest Strike', () => {
    test('should have upgraded passive ability at level 9', () => {
      const upgrade = GALE_GLIDER.levelingConfig!.abilityUpgrades![9];
      expect(upgrade).toBeDefined();
      expect(upgrade.ability).toBeDefined();
      validateStructuredAbility(upgrade.ability!);
    });

    test('should have correct ability name', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.name).toBe('Tempest Strike');
    });

    test('should be a passive ability', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should have multiple powerful effects', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      expect(ability.effects.length).toBeGreaterThanOrEqual(2);
      expect(ability.effects).toHaveLength(3);
    });

    test('should maintain attack-first capability', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      const attackFirstEffect: any = ability.effects.find(
        (e: any) => e.modification === 'attack-first'
      );
      expect(attackFirstEffect).toBeDefined();
      expect(attackFirstEffect!.type).toBe(EffectType.AttackModification);
    });

    test('should have triple damage modifier', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      const tripleDamageEffect: any = ability.effects.find(
        (e: any) => e.modification === 'triple-damage'
      );
      expect(tripleDamageEffect).toBeDefined();
      expect(tripleDamageEffect!.type).toBe(EffectType.AttackModification);
    });

    test('should prevent counterattack', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      const noCounterEffect: any = ability.effects.find(
        (e: any) => e.modification === 'cannot-counterattack'
      );
      expect(noCounterEffect).toBeDefined();
      expect(noCounterEffect!.type).toBe(EffectType.AttackModification);
    });

    test('should be an assassin-style ability', () => {
      const ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      const modifications = ability.effects.map((e: any) => e.modification);
      expect(modifications).toContain('attack-first');
      expect(modifications).toContain('triple-damage');
      expect(modifications).toContain('cannot-counterattack');
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain aggressive attacker role throughout progression', () => {
      const statGains = GALE_GLIDER.levelingConfig!.statGains!;
      for (let level = 2; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.atk).toBeGreaterThan(gains.hp);
      }
    });

    test('should have consistent speed and mobility theme', () => {
      const baseAbility = GALE_GLIDER.ability as StructuredAbility;
      const baseEffect: any = baseAbility.effects[0];
      expect(baseEffect.modification).toBe('attack-first');

      const level7Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!;
      const level7FirstEffect: any = level7Ability.effects[0];
      expect(level7FirstEffect.modification).toBe('attack-first');

      const level9Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      const level9HasFirst = level9Ability.effects.some(
        (e: any) => e.modification === 'attack-first'
      );
      expect(level9HasFirst).toBe(true);
    });

    test('should scale appropriately for a 1-cost aggressive unit', () => {
      expect(GALE_GLIDER.cost).toBe(1);
      expect(GALE_GLIDER.baseAttack + GALE_GLIDER.baseHealth).toBe(4);
      const maxStats = GALE_GLIDER.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(17);
    });

    test('should evolve from mobility to raw power', () => {
      const level4Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![4].ability!;
      expect(level4Ability.trigger).toBe(AbilityTrigger.OnAttack);

      const level7Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!;
      const hasStatBonus = level7Ability.effects.some(
        (e: any) => e.type === EffectType.ModifyStats
      );
      expect(hasStatBonus).toBe(true);

      const level9Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      const hasTripleDamage = level9Ability.effects.some(
        (e: any) => e.modification === 'triple-damage'
      );
      expect(hasTripleDamage).toBe(true);
    });
  });

  describe('Ability Synergies', () => {
    test('should synergize with first-strike mechanics', () => {
      const baseAbility = GALE_GLIDER.ability as StructuredAbility;
      const effect: any = baseAbility.effects[0];
      expect(effect.modification).toBe('attack-first');
    });

    test('should excel at hit-and-run tactics', () => {
      const level4Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![4].ability!;
      const hasMoveAbility = level4Ability.effects.some(
        (e: any) => e.type === EffectType.MoveUnit
      );
      expect(hasMoveAbility).toBe(true);
    });

    test('should counter slower units effectively', () => {
      const level9Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      const hasFirstStrike = level9Ability.effects.some(
        (e: any) => e.modification === 'attack-first'
      );
      const preventsCounter = level9Ability.effects.some(
        (e: any) => e.modification === 'cannot-counterattack'
      );
      expect(hasFirstStrike).toBe(true);
      expect(preventsCounter).toBe(true);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain wind-themed ability names', () => {
      const baseAbility = GALE_GLIDER.ability as StructuredAbility;
      expect(baseAbility.name).toBe('First Wind');
      expect(GALE_GLIDER.levelingConfig!.abilityUpgrades![4].ability!.name).toBe('Wind Dance');
      expect(GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!.name).toBe('Storm Blade');
      expect(GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!.name).toBe('Tempest Strike');
    });

    test('should embody swift aerial creature mechanics', () => {
      // Low HP represents fragility
      expect(GALE_GLIDER.baseHealth).toBeLessThanOrEqual(2);

      // Moderate attack for 1-cost
      expect(GALE_GLIDER.baseAttack).toBe(2);

      // Attack-first represents speed
      const baseAbility = GALE_GLIDER.ability as StructuredAbility;
      const effect: any = baseAbility.effects[0];
      expect(effect.modification).toBe('attack-first');
    });

    test('should represent agile aerial combat', () => {
      const level4Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![4].ability!;
      expect(level4Ability.name).toBe('Wind Dance');
      const effect: any = level4Ability.effects[0];
      expect(effect.type).toBe(EffectType.MoveUnit);
    });
  });

  describe('Edge Cases and Special Mechanics', () => {
    test('should maintain glass cannon archetype', () => {
      const statGains = GALE_GLIDER.levelingConfig!.statGains!;
      expect(statGains[9].atk).toBe(14);
      expect(statGains[9].hp).toBe(3);
      expect(statGains[9].atk).toBeGreaterThan(statGains[9].hp * 4);
    });

    test('should have temporary attack buffs', () => {
      const level7Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![7].ability!;
      const tempBuff: any = level7Ability.effects.find(
        (e: any) => e.duration === EffectDuration.NextAttack
      );
      expect(tempBuff).toBeDefined();
    });

    test('should have multiple attack modifiers at max level', () => {
      const level9Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      const attackMods = level9Ability.effects.filter(
        (e: any) => e.type === EffectType.AttackModification
      );
      expect(attackMods.length).toBeGreaterThanOrEqual(3);
    });

    test('should be vulnerable to defensive units', () => {
      // Very low HP makes it vulnerable to counterattacks
      expect(GALE_GLIDER.baseHealth).toBe(2);
      const statGains = GALE_GLIDER.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBeLessThanOrEqual(3);
    });

    test('should transition from mobility to one-shot capability', () => {
      const level4Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![4].ability!;
      expect(level4Ability.trigger).toBe(AbilityTrigger.OnAttack);

      const level9Ability = GALE_GLIDER.levelingConfig!.abilityUpgrades![9].ability!;
      expect(level9Ability.trigger).toBe(AbilityTrigger.Passive);
      const hasTripleDamage = level9Ability.effects.some(
        (e: any) => e.modification === 'triple-damage'
      );
      expect(hasTripleDamage).toBe(true);
    });
  });
});
