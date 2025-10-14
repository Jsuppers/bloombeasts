/**
 * Tests for Aqua Pebble card
 */

import { describe, test, expect } from '@jest/globals';
import { AQUA_PEBBLE } from './aquaPebble.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration, ConditionType, StructuredAbility, StatModificationEffect, HealEffect } from '../../types/abilities.js';

describe('Aqua Pebble Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(AQUA_PEBBLE);
    });

    test('should have correct card properties', () => {
      expect(AQUA_PEBBLE.id).toBe('aqua-pebble');
      expect(AQUA_PEBBLE.name).toBe('Aqua Pebble');
      expect(AQUA_PEBBLE.type).toBe('Bloom');
      expect(AQUA_PEBBLE.affinity).toBe('Water');
      expect(AQUA_PEBBLE.cost).toBe(1);
      expect(AQUA_PEBBLE.baseAttack).toBe(1);
      expect(AQUA_PEBBLE.baseHealth).toBe(4);
    });

    test('should be a low-cost support unit with defensive stats', () => {
      expect(AQUA_PEBBLE.baseHealth).toBeGreaterThan(AQUA_PEBBLE.baseAttack);
      expect(AQUA_PEBBLE.cost).toBe(1);
      expect(AQUA_PEBBLE.baseAttack + AQUA_PEBBLE.baseHealth).toBe(5);
    });
  });

  describe('Base Ability - Tide Flow', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(AQUA_PEBBLE.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(AQUA_PEBBLE.ability.name).toBe('Tide Flow');
    });

    test('should trigger on ally summon', () => {
      expect(AQUA_PEBBLE.ability.trigger).toBe(AbilityTrigger.OnAllySummon);
    });

    test('should grant +1 attack to self when Water ally is summoned', () => {
      const ability = AQUA_PEBBLE.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(1);
      expect(effect.duration).toBe(EffectDuration.EndOfTurn);
    });

    test('should have affinity condition for Water units', () => {
      const ability = AQUA_PEBBLE.ability as StructuredAbility;
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.condition).toBeDefined();
      expect(effect.condition!.type).toBe(ConditionType.AffinityMatches);
      expect(effect.condition!.value).toBe('Water');
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(AQUA_PEBBLE);
    });

    test('should have stat gains for all levels', () => {
      expect(AQUA_PEBBLE.levelingConfig).toBeDefined();
      expect(AQUA_PEBBLE.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(AQUA_PEBBLE.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have non-decreasing stat gains', () => {
      validateStatGainsProgression(AQUA_PEBBLE);
    });

    test('should prioritize HP gains over ATK gains initially', () => {
      const statGains = AQUA_PEBBLE.levelingConfig!.statGains!;
      expect(statGains[3].hp).toBe(3);
      expect(statGains[3].atk).toBe(0);
      expect(statGains[6].hp).toBe(7);
      expect(statGains[6].atk).toBe(3);
    });

    test('should have balanced endgame stats', () => {
      const statGains = AQUA_PEBBLE.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(12);
      expect(statGains[9].atk).toBe(6);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(AQUA_PEBBLE.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(AQUA_PEBBLE.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Tidal Surge', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.name).toBe('Tidal Surge');
    });

    test('should still trigger on ally summon', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnAllySummon);
    });

    test('should grant +2 attack instead of +1', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(2);
      expect(effect.duration).toBe(EffectDuration.EndOfTurn);
    });

    test('should maintain affinity condition', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.condition).toBeDefined();
      expect(effect.condition!.type).toBe(ConditionType.AffinityMatches);
      expect(effect.condition!.value).toBe('Water');
    });

    test('should be a power upgrade from base ability', () => {
      const baseAbility = AQUA_PEBBLE.ability as StructuredAbility;
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const upgradedAbility = upgrade!.ability! as StructuredAbility;
      const baseEffect = baseAbility.effects[0] as StatModificationEffect;
      const upgradedEffect = upgradedAbility.effects[0] as StatModificationEffect;
      expect(upgradedEffect.value).toBeGreaterThan(baseEffect.value);
    });
  });

  describe('Level 7 Upgrade - Rejuvenation', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.name).toBe('Rejuvenation');
    });

    test('should trigger at end of turn', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.trigger).toBe(AbilityTrigger.EndOfTurn);
    });

    test('should heal all allies for 2', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as HealEffect;
      expect(effect.type).toBe(EffectType.Heal);
      expect(effect.target).toBe(AbilityTarget.AllAllies);
      expect(effect.value).toBe(2);
    });

    test('should add support capabilities', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      const hasHeal = ability.effects.some(e => e.type === EffectType.Heal);
      expect(hasHeal).toBe(true);
    });
  });

  describe('Level 9 Upgrade - Tsunami Force', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability! as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.name).toBe('Tsunami Force');
    });

    test('should trigger on ally summon', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnAllySummon);
    });

    test('should grant +3 attack permanently', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(3);
      expect(effect.duration).toBe(EffectDuration.Permanent);
    });

    test('should have permanent duration instead of temporary', () => {
      const baseAbility = AQUA_PEBBLE.ability as StructuredAbility;
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const level9Ability = upgrade!.ability! as StructuredAbility;
      const baseEffect = baseAbility.effects[0] as StatModificationEffect;
      const level9Effect = level9Ability.effects[0] as StatModificationEffect;
      expect(baseEffect.duration).toBe(EffectDuration.EndOfTurn);
      expect(level9Effect.duration).toBe(EffectDuration.Permanent);
    });

    test('should maintain affinity condition', () => {
      const upgrade = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.condition).toBeDefined();
      expect(effect.condition!.type).toBe(ConditionType.AffinityMatches);
      expect(effect.condition!.value).toBe('Water');
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain support role throughout progression', () => {
      const statGains = AQUA_PEBBLE.levelingConfig!.statGains!;
      // Early game should prioritize HP
      expect(statGains[2].hp).toBeGreaterThan(statGains[2].atk);
      expect(statGains[3].hp).toBeGreaterThan(statGains[3].atk);
    });

    test('should have consistent synergy theme', () => {
      const baseAbility = AQUA_PEBBLE.ability as StructuredAbility;
      const baseEffect = baseAbility.effects[0] as StatModificationEffect;
      expect(baseEffect.condition!.value).toBe('Water');

      const upgrade4 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability! as StructuredAbility;
      const level4Effect = level4Ability.effects[0] as StatModificationEffect;
      expect(level4Effect.condition!.value).toBe('Water');

      const upgrade9 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability! as StructuredAbility;
      const level9Effect = level9Ability.effects[0] as StatModificationEffect;
      expect(level9Effect.condition!.value).toBe('Water');
    });

    test('should scale appropriately for a 1-cost unit', () => {
      expect(AQUA_PEBBLE.cost).toBe(1);
      expect(AQUA_PEBBLE.baseAttack + AQUA_PEBBLE.baseHealth).toBe(5);
      const maxStats = AQUA_PEBBLE.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(18);
    });

    test('should have increasing power progression', () => {
      const baseAbility = AQUA_PEBBLE.ability as StructuredAbility;
      const upgrade4 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability! as StructuredAbility;
      const upgrade9 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability! as StructuredAbility;

      const baseValue = (baseAbility.effects[0] as StatModificationEffect).value;
      const level4Value = (level4Ability.effects[0] as StatModificationEffect).value;
      const level9Value = (level9Ability.effects[0] as StatModificationEffect).value;

      expect(level4Value).toBeGreaterThan(baseValue);
      expect(level9Value).toBeGreaterThan(level4Value);
    });
  });

  describe('Ability Synergies', () => {
    test('should synergize with Water affinity teams', () => {
      const baseAbility = AQUA_PEBBLE.ability as StructuredAbility;
      const effect = baseAbility.effects[0] as StatModificationEffect;
      expect(effect.condition).toBeDefined();
      expect(effect.condition!.type).toBe(ConditionType.AffinityMatches);
      expect(effect.condition!.value).toBe('Water');
    });

    test('should provide healing support at level 7', () => {
      const upgrade7 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.ability! as StructuredAbility;
      const hasHeal = level7Ability.effects.some(e => e.type === EffectType.Heal);
      expect(hasHeal).toBe(true);
      expect(level7Ability.effects[0].target).toBe(AbilityTarget.AllAllies);
    });

    test('should scale from temporary to permanent buffs', () => {
      const baseAbility = AQUA_PEBBLE.ability as StructuredAbility;
      const upgrade9 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability! as StructuredAbility;

      const baseEffect = baseAbility.effects[0] as StatModificationEffect;
      const level9Effect = level9Ability.effects[0] as StatModificationEffect;

      expect(baseEffect.duration).toBe(EffectDuration.EndOfTurn);
      expect(level9Effect.duration).toBe(EffectDuration.Permanent);
    });

    test('should have consistent self-buffing strategy', () => {
      const baseAbility = AQUA_PEBBLE.ability as StructuredAbility;
      const upgrade4 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability! as StructuredAbility;
      const upgrade9 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability! as StructuredAbility;

      const baseEffect = baseAbility.effects[0] as StatModificationEffect;
      const level4Effect = level4Ability.effects[0] as StatModificationEffect;
      const level9Effect = level9Ability.effects[0] as StatModificationEffect;

      expect(baseEffect.target).toBe(AbilityTarget.Self);
      expect(level4Effect.target).toBe(AbilityTarget.Self);
      expect(level9Effect.target).toBe(AbilityTarget.Self);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain water-themed ability names', () => {
      expect(AQUA_PEBBLE.ability.name).toBe('Tide Flow');
      const upgrade4 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      expect(upgrade4!.ability!.name).toBe('Tidal Surge');
      const upgrade7 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      expect(upgrade7!.ability!.name).toBe('Rejuvenation');
      const upgrade9 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      expect(upgrade9!.ability!.name).toBe('Tsunami Force');
    });

    test('should embody support and synergy mechanics', () => {
      // Triggers on ally summon for synergy
      expect(AQUA_PEBBLE.ability.trigger).toBe(AbilityTrigger.OnAllySummon);

      // Provides team healing at level 7
      const upgrade7 = AQUA_PEBBLE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.ability! as StructuredAbility;
      expect(level7Ability.effects[0].type).toBe(EffectType.Heal);
      expect(level7Ability.effects[0].target).toBe(AbilityTarget.AllAllies);
    });
  });
});
