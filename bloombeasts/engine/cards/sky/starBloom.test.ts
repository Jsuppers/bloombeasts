/**
 * Tests for Star Bloom card
 */

import { describe, test, expect } from '@jest/globals';
import { STAR_BLOOM } from './starBloom.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration } from '../../types/abilities.js';
import type { StructuredAbility } from '../../types/abilities.js';

describe('Star Bloom Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(STAR_BLOOM);
    });

    test('should have correct card properties', () => {
      expect(STAR_BLOOM.id).toBe('star-bloom');
      expect(STAR_BLOOM.name).toBe('Star Bloom');
      expect(STAR_BLOOM.type).toBe('Bloom');
      expect(STAR_BLOOM.affinity).toBe('Sky');
      expect(STAR_BLOOM.cost).toBe(3);
      expect(STAR_BLOOM.baseAttack).toBe(4);
      expect(STAR_BLOOM.baseHealth).toBe(5);
    });

    test('should be a mid-cost balanced unit with strong stats', () => {
      expect(STAR_BLOOM.cost).toBe(3);
      expect(STAR_BLOOM.baseAttack + STAR_BLOOM.baseHealth).toBe(9);
      expect(STAR_BLOOM.baseHealth).toBeGreaterThan(STAR_BLOOM.baseAttack);
    });
  });

  describe('Base Ability - Aura', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(STAR_BLOOM.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const ability = STAR_BLOOM.abilities[0] as StructuredAbility;
      expect(ability.name).toBe('Aura');
    });

    test('should be a passive ability', () => {
      const ability = STAR_BLOOM.abilities[0] as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should grant +1 attack to all allies', () => {
      const ability = STAR_BLOOM.abilities[0] as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(1);
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should provide team-wide offensive buff', () => {
      const ability = STAR_BLOOM.abilities[0] as StructuredAbility;
      const effect: any = ability.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllAllies);
      expect(effect.value).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(STAR_BLOOM);
    });

    test('should have stat gains for all levels', () => {
      expect(STAR_BLOOM.levelingConfig).toBeDefined();
      expect(STAR_BLOOM.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(STAR_BLOOM.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have non-decreasing stat gains', () => {
      validateStatGainsProgression(STAR_BLOOM);
    });

    test('should have balanced stat gains favoring HP', () => {
      const statGains = STAR_BLOOM.levelingConfig!.statGains!;
      expect(statGains[5].hp).toBe(6);
      expect(statGains[5].atk).toBe(4);
      expect(statGains[9].hp).toBe(14);
      expect(statGains[9].atk).toBe(9);
      // HP gains should be higher than ATK but both significant
      expect(statGains[9].hp).toBeGreaterThan(statGains[9].atk);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(STAR_BLOOM.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(STAR_BLOOM.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Radiant Aura', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = STAR_BLOOM.levelingConfig!.abilityUpgrades![4];
      expect(upgrade).toBeDefined();
      expect(upgrade.abilities).toBeDefined();
      validateStructuredAbility(upgrade.abilities![0]);
    });

    test('should have correct ability name', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      expect(ability.name).toBe('Radiant Aura');
    });

    test('should be a passive ability', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should grant +2 attack to all allies', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(2);
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should be a power upgrade from base aura', () => {
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      const baseEffect: any = baseAbility.effects[0];
      const level4Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      const level4Effect: any = level4Ability.effects[0];
      expect(level4Effect.value).toBeGreaterThan(baseEffect.value);
    });
  });

  describe('Level 7 Upgrade - Cosmic Guidance', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = STAR_BLOOM.levelingConfig!.abilityUpgrades![7];
      expect(upgrade).toBeDefined();
      expect(upgrade.abilities).toBeDefined();
      validateStructuredAbility(upgrade.abilities![0]);
    });

    test('should have correct ability name', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      expect(ability.name).toBe('Cosmic Guidance');
    });

    test('should be an activated ability', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      expect(ability.trigger).toBe(AbilityTrigger.Activated);
    });

    test('should be limited to once per turn', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      expect(ability.maxUsesPerTurn).toBe(1);
    });

    test('should allow searching for any card', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      expect(ability.effects).toHaveLength(1);
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.SearchDeck);
      expect(effect.target).toBe(AbilityTarget.PlayerGardener);
      expect(effect.searchFor).toBe('any');
      expect(effect.quantity).toBe(1);
    });

    test('should provide deck tutoring capability', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      const effect: any = ability.effects[0];
      expect(effect.type).toBe(EffectType.SearchDeck);
      expect(effect.searchFor).toBe('any');
    });
  });

  describe('Level 9 Upgrade - Astral Dominance and Universal Harmony', () => {
    test('should have upgraded passive ability at level 9', () => {
      const upgrade = STAR_BLOOM.levelingConfig!.abilityUpgrades![9];
      expect(upgrade).toBeDefined();
      expect(upgrade.abilities).toBeDefined();
      validateStructuredAbility(upgrade.abilities![0]);
    });

    test('should have correct ability name', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      expect(ability.name).toBe('Astral Dominance');
    });

    test('should be a passive ability', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should have multiple buff effects', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      expect(ability.effects.length).toBeGreaterThan(1);
      expect(ability.effects).toHaveLength(2);
    });

    test('should grant +3 attack to all allies', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      const attackEffect: any = ability.effects[0];
      expect(attackEffect.type).toBe(EffectType.ModifyStats);
      expect(attackEffect.target).toBe(AbilityTarget.AllAllies);
      expect(attackEffect.stat).toBe(StatType.Attack);
      expect(attackEffect.value).toBe(3);
      expect(attackEffect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should grant +2 health to all allies', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      const healthEffect: any = ability.effects[1];
      expect(healthEffect.type).toBe(EffectType.ModifyStats);
      expect(healthEffect.target).toBe(AbilityTarget.AllAllies);
      expect(healthEffect.stat).toBe(StatType.Health);
      expect(healthEffect.value).toBe(2);
      expect(healthEffect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should provide comprehensive team buffs', () => {
      const ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      const hasAttackBuff = ability.effects.some(
        (e: any) => e.type === EffectType.ModifyStats && e.stat === StatType.Attack
      );
      const hasHealthBuff = ability.effects.some(
        (e: any) => e.type === EffectType.ModifyStats && e.stat === StatType.Health
      );
      expect(hasAttackBuff).toBe(true);
      expect(hasHealthBuff).toBe(true);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain team buffer role throughout progression', () => {
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      expect(baseAbility.effects[0].type).toBe(EffectType.ModifyStats);

      const level4Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      expect(level4Ability.effects[0].type).toBe(EffectType.ModifyStats);

      const level9Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      const hasModifyStats = level9Ability.effects.some(
        (e: any) => e.type === EffectType.ModifyStats
      );
      expect(hasModifyStats).toBe(true);
    });

    test('should have consistent aura theme', () => {
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      expect(baseAbility.name).toBe('Aura');

      const level4Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      expect(level4Ability.name).toContain('Aura');

      const level9Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      expect(level9Ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should scale appropriately for a 3-cost support unit', () => {
      expect(STAR_BLOOM.cost).toBe(3);
      expect(STAR_BLOOM.baseAttack + STAR_BLOOM.baseHealth).toBe(9);
      const maxStats = STAR_BLOOM.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(23);
    });

    test('should provide increasing aura values', () => {
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      const baseEffect: any = baseAbility.effects[0];
      expect(baseEffect.value).toBe(1);

      const level4Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      const level4Effect: any = level4Ability.effects[0];
      expect(level4Effect.value).toBe(2);

      const level9Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      const level9AttackEffect: any = level9Ability.effects[0];
      expect(level9AttackEffect.value).toBe(3);
    });
  });

  describe('Ability Synergies', () => {
    test('should synergize with wide board strategies', () => {
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      const effect: any = baseAbility.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should provide deck consistency tools', () => {
      const level7Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      const hasSearchDeck = level7Ability.effects.some(
        (e: any) => e.type === EffectType.SearchDeck
      );
      expect(hasSearchDeck).toBe(true);
    });

    test('should excel in long games with level 9 power', () => {
      const level9Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      const allBuffs = level9Ability.effects.filter(
        (e: any) => e.type === EffectType.ModifyStats
      );
      expect(allBuffs.length).toBe(2);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain celestial-themed ability names', () => {
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      expect(baseAbility.name).toBe('Aura');
      expect(STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0].name).toBe('Radiant Aura');
      expect(STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0].name).toBe('Cosmic Guidance');
      expect(STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0].name).toBe('Astral Dominance');
    });

    test('should embody star/celestial support mechanics', () => {
      // Passive aura represents stellar radiation
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      expect(baseAbility.trigger).toBe(AbilityTrigger.Passive);

      // Team buffs represent illuminating allies
      const effect: any = baseAbility.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllAllies);

      // Balanced stats represent stable presence
      expect(STAR_BLOOM.baseAttack).toBe(4);
      expect(STAR_BLOOM.baseHealth).toBe(5);
    });

    test('should represent guiding star mechanics', () => {
      const level7Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      expect(level7Ability.name).toBe('Cosmic Guidance');
      const effect: any = level7Ability.effects[0];
      expect(effect.type).toBe(EffectType.SearchDeck);
    });
  });

  describe('Edge Cases and Special Mechanics', () => {
    test('should have field-dependent aura effects', () => {
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      const effect: any = baseAbility.effects[0];
      expect(effect.duration).toBe(EffectDuration.WhileOnField);

      const level4Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      const level4Effect: any = level4Ability.effects[0];
      expect(level4Effect.duration).toBe(EffectDuration.WhileOnField);

      const level9Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      const allEffects = level9Ability.effects.filter(
        (e: any) => e.type === EffectType.ModifyStats
      );
      allEffects.forEach((effect: any) => {
        expect(effect.duration).toBe(EffectDuration.WhileOnField);
      });
    });

    test('should provide both offensive and defensive buffs at max level', () => {
      const level9Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      const statTypes = level9Ability.effects.map((e: any) => e.stat);
      expect(statTypes).toContain(StatType.Attack);
      expect(statTypes).toContain(StatType.Health);
    });

    test('should have usage restrictions on search abilities', () => {
      const level7Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      expect(level7Ability.maxUsesPerTurn).toBeDefined();
      expect(level7Ability.maxUsesPerTurn).toBe(1);
    });

    test('should maintain consistent passive aura throughout progression', () => {
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      expect(baseAbility.trigger).toBe(AbilityTrigger.Passive);

      const level4Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      expect(level4Ability.trigger).toBe(AbilityTrigger.Passive);

      const level9Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      expect(level9Ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should provide utility at level 7 while maintaining aura at level 4', () => {
      const level4Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      expect(level4Ability.effects[0].type).toBe(EffectType.ModifyStats);

      const level7Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      expect(level7Ability.effects[0].type).toBe(EffectType.SearchDeck);
    });
  });

  describe('Strategic Value', () => {
    test('should be a high-priority target for removal', () => {
      // Strong aura effects make it dangerous to leave on field
      const level9Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![9].abilities![0];
      const attackEffect: any = level9Ability.effects[0];
      expect(attackEffect.value).toBeGreaterThanOrEqual(3);
    });

    test('should provide card advantage through tutoring', () => {
      const level7Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![7].abilities![0];
      const effect: any = level7Ability.effects[0];
      expect(effect.type).toBe(EffectType.SearchDeck);
      expect(effect.searchFor).toBe('any');
    });

    test('should reward building around it with multiple units', () => {
      const baseAbility = STAR_BLOOM.abilities[0] as StructuredAbility;
      const effect: any = baseAbility.effects[0];
      expect(effect.target).toBe(AbilityTarget.AllAllies);
    });

    test('should have significant mid-game impact', () => {
      expect(STAR_BLOOM.cost).toBe(3);
      const level4Ability = STAR_BLOOM.levelingConfig!.abilityUpgrades![4].abilities![0];
      const effect: any = level4Ability.effects[0];
      expect(effect.value).toBe(2);
    });
  });
});
