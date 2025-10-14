/**
 * Tests for Aero Moth card
 */

import { describe, test, expect } from '@jest/globals';
import { AERO_MOTH } from './aeroMoth.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration, DrawCardEffect, StatModificationEffect, SwapPositionsEffect, StructuredAbility } from '../../types/abilities.js';

describe('Aero Moth Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(AERO_MOTH);
    });

    test('should have correct card properties', () => {
      expect(AERO_MOTH.id).toBe('aero-moth');
      expect(AERO_MOTH.name).toBe('Aero Moth');
      expect(AERO_MOTH.type).toBe('Bloom');
      expect(AERO_MOTH.affinity).toBe('Sky');
      expect(AERO_MOTH.cost).toBe(2);
      expect(AERO_MOTH.baseAttack).toBe(3);
      expect(AERO_MOTH.baseHealth).toBe(3);
    });

    test('should be a balanced 2-cost unit', () => {
      expect(AERO_MOTH.baseAttack).toBe(AERO_MOTH.baseHealth);
      expect(AERO_MOTH.cost).toBe(2);
      expect(AERO_MOTH.baseAttack + AERO_MOTH.baseHealth).toBe(6);
    });
  });

  describe('Base Ability - Wing Flutter', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(AERO_MOTH.ability);
    });

    test('should have correct ability name', () => {
      expect(AERO_MOTH.ability.name).toBe('Wing Flutter');
    });

    test('should trigger on summon', () => {
      expect(AERO_MOTH.ability.trigger).toBe(AbilityTrigger.OnSummon);
    });

    test('should draw 1 card', () => {
      expect(AERO_MOTH.ability.effects).toHaveLength(1);
      const effect = AERO_MOTH.ability.effects[0] as DrawCardEffect;
      expect(effect.type).toBe(EffectType.DrawCards);
      expect(effect.target).toBe(AbilityTarget.PlayerGardener);
      expect(effect.value).toBe(1);
    });

    test('should provide immediate card advantage', () => {
      const effect = AERO_MOTH.ability.effects[0] as DrawCardEffect;
      expect(effect.type).toBe(EffectType.DrawCards);
      expect(effect.value).toBeGreaterThan(0);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(AERO_MOTH);
    });

    test('should have stat gains for all levels', () => {
      expect(AERO_MOTH.levelingConfig).toBeDefined();
      expect(AERO_MOTH.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(AERO_MOTH.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have non-decreasing stat gains', () => {
      validateStatGainsProgression(AERO_MOTH);
    });

    test('should have perfectly balanced stat gains', () => {
      const statGains = AERO_MOTH.levelingConfig!.statGains!;
      expect(statGains[5].hp).toBe(4);
      expect(statGains[5].atk).toBe(4);
      expect(statGains[9].hp).toBe(8);
      expect(statGains[9].atk).toBe(8);
      // Perfectly balanced gains
      expect(statGains[9].hp).toBe(statGains[9].atk);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(AERO_MOTH.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(AERO_MOTH.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Hypnotic Wings', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability!);
    });

    test('should have correct ability name', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.name).toBe('Hypnotic Wings');
    });

    test('should trigger on summon', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnSummon);
    });

    test('should draw 2 cards', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as DrawCardEffect;
      expect(effect.type).toBe(EffectType.DrawCards);
      expect(effect.target).toBe(AbilityTarget.PlayerGardener);
      expect(effect.value).toBe(2);
    });

    test('should be a power upgrade from base ability', () => {
      const baseEffect = AERO_MOTH.ability.effects[0] as DrawCardEffect;
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      const level4Effect = ability.effects[0] as DrawCardEffect;
      expect(level4Effect.value).toBeGreaterThan(baseEffect.value);
    });
  });

  describe('Level 7 Upgrade - Cyclone', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability!);
    });

    test('should have correct ability name', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.name).toBe('Cyclone');
    });

    test('should trigger on attack', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should swap enemy positions', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as SwapPositionsEffect;
      expect(effect.type).toBe(EffectType.SwapPositions);
      expect(effect.target).toBe(AbilityTarget.AllEnemies);
    });

    test('should disrupt enemy positioning', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      const effect = ability.effects[0] as SwapPositionsEffect;
      expect(effect.type).toBe(EffectType.SwapPositions);
    });
  });

  describe('Level 9 Upgrade - Rainbow Cascade and Chaos Storm', () => {
    test('should have upgraded passive ability at level 9', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability!);
    });

    test('should have correct ability name', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.name).toBe('Rainbow Cascade');
    });

    test('should trigger on summon', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnSummon);
    });

    test('should have multiple powerful effects', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.effects.length).toBeGreaterThan(1);
      expect(ability.effects).toHaveLength(3);
    });

    test('should draw 3 cards', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      const drawEffect = ability.effects[0] as DrawCardEffect;
      expect(drawEffect.type).toBe(EffectType.DrawCards);
      expect(drawEffect.target).toBe(AbilityTarget.PlayerGardener);
      expect(drawEffect.value).toBe(3);
    });

    test('should grant permanent +1/+1 to all allies', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      const attackEffect = ability.effects[1] as StatModificationEffect;
      expect(attackEffect.type).toBe(EffectType.ModifyStats);
      expect(attackEffect.target).toBe(AbilityTarget.AllAllies);
      expect(attackEffect.stat).toBe(StatType.Attack);
      expect(attackEffect.value).toBe(1);
      expect(attackEffect.duration).toBe(EffectDuration.Permanent);

      const healthEffect = ability.effects[2] as StatModificationEffect;
      expect(healthEffect.type).toBe(EffectType.ModifyStats);
      expect(healthEffect.target).toBe(AbilityTarget.AllAllies);
      expect(healthEffect.stat).toBe(StatType.Health);
      expect(healthEffect.value).toBe(1);
      expect(healthEffect.duration).toBe(EffectDuration.Permanent);
    });

    test('should provide massive value on summon', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      const hasCardDraw = ability.effects.some(
        e => e.type === EffectType.DrawCards
      );
      const hasStatBuff = ability.effects.some(
        e => e.type === EffectType.ModifyStats
      );
      expect(hasCardDraw).toBe(true);
      expect(hasStatBuff).toBe(true);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain balanced stats throughout progression', () => {
      const statGains = AERO_MOTH.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBe(gains.atk);
      }
    });

    test('should have consistent card draw theme', () => {
      expect(AERO_MOTH.ability.effects[0].type).toBe(EffectType.DrawCards);

      const upgrade4 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability as StructuredAbility;
      expect(level4Ability.effects[0].type).toBe(EffectType.DrawCards);

      const upgrade9 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability as StructuredAbility;
      const hasCardDraw = level9Ability.effects.some(
        e => e.type === EffectType.DrawCards
      );
      expect(hasCardDraw).toBe(true);
    });

    test('should scale appropriately for a 2-cost utility unit', () => {
      expect(AERO_MOTH.cost).toBe(2);
      expect(AERO_MOTH.baseAttack + AERO_MOTH.baseHealth).toBe(6);
      const maxStats = AERO_MOTH.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(16);
    });

    test('should increase card draw value over time', () => {
      const baseEffect = AERO_MOTH.ability.effects[0] as DrawCardEffect;
      expect(baseEffect.value).toBe(1);

      const upgrade4 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability as StructuredAbility;
      const level4Effect = level4Ability.effects[0] as DrawCardEffect;
      expect(level4Effect.value).toBe(2);

      const upgrade9 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability as StructuredAbility;
      const level9DrawEffect = level9Ability.effects.find(
        e => e.type === EffectType.DrawCards
      ) as DrawCardEffect | undefined;
      expect(level9DrawEffect).toBeDefined();
      expect(level9DrawEffect!.value).toBe(3);
    });
  });

  describe('Ability Synergies', () => {
    test('should provide card advantage through draw effects', () => {
      const effect = AERO_MOTH.ability.effects[0] as DrawCardEffect;
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should disrupt enemy positioning strategies', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const level7Ability = upgrade!.ability as StructuredAbility;
      const hasPositionSwap = level7Ability.effects.some(
        e => e.type === EffectType.SwapPositions
      );
      expect(hasPositionSwap).toBe(true);
    });

    test('should excel in combo-based strategies', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const level9Ability = upgrade!.ability as StructuredAbility;
      const drawEffect = level9Ability.effects.find(
        e => e.type === EffectType.DrawCards
      ) as DrawCardEffect | undefined;
      expect(drawEffect).toBeDefined();
      expect(drawEffect!.value).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain moth/wind-themed ability names', () => {
      expect(AERO_MOTH.ability.name).toBe('Wing Flutter');
      const upgrade4 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4?.ability?.name).toBe('Hypnotic Wings');
      const upgrade7 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7?.ability?.name).toBe('Cyclone');
      const upgrade9 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9?.ability?.name).toBe('Rainbow Cascade');
    });

    test('should embody mystical moth creature mechanics', () => {
      // Balanced stats represent agility and durability
      expect(AERO_MOTH.baseAttack).toBe(3);
      expect(AERO_MOTH.baseHealth).toBe(3);

      // Card draw represents hypnotic wing patterns
      expect(AERO_MOTH.ability.effects[0].type).toBe(EffectType.DrawCards);

      // Position manipulation represents wind control
      const upgrade7 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.ability as StructuredAbility;
      expect(level7Ability.effects[0].type).toBe(EffectType.SwapPositions);
    });

    test('should represent hypnotic wing patterns', () => {
      const upgrade4 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability as StructuredAbility;
      expect(level4Ability.name).toBe('Hypnotic Wings');
      const effect = level4Ability.effects[0] as DrawCardEffect;
      expect(effect.type).toBe(EffectType.DrawCards);
    });
  });

  describe('Edge Cases and Special Mechanics', () => {
    test('should have perfectly symmetrical stat growth', () => {
      const statGains = AERO_MOTH.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(8);
      expect(statGains[9].atk).toBe(8);
      expect(statGains[9].hp).toBe(statGains[9].atk);
    });

    test('should have permanent buffs at max level', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const level9Ability = upgrade!.ability as StructuredAbility;
      const permanentEffects = level9Ability.effects.filter(
        e => 'duration' in e && e.duration === EffectDuration.Permanent
      );
      expect(permanentEffects.length).toBeGreaterThan(0);
    });

    test('should combine immediate and long-term value', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const level9Ability = upgrade!.ability as StructuredAbility;
      const hasDrawCards = level9Ability.effects.some(
        e => e.type === EffectType.DrawCards
      );
      const hasPermanentBuff = level9Ability.effects.some(
        e => 'duration' in e && e.duration === EffectDuration.Permanent
      );
      expect(hasDrawCards).toBe(true);
      expect(hasPermanentBuff).toBe(true);
    });

    test('should reward playing it early for value', () => {
      // OnSummon trigger provides immediate value
      expect(AERO_MOTH.ability.trigger).toBe(AbilityTrigger.OnSummon);

      // Low cost allows early play
      expect(AERO_MOTH.cost).toBe(2);
    });

    test('should have asymmetric ability progression', () => {
      // Level 4: Enhances OnSummon draw
      const upgrade4 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability as StructuredAbility;
      expect(level4Ability.trigger).toBe(AbilityTrigger.OnSummon);

      // Level 7: Adds OnAttack disruption
      const upgrade7 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.ability as StructuredAbility;
      expect(level7Ability.trigger).toBe(AbilityTrigger.OnAttack);

      // Level 9: Enhances OnSummon with team buffs
      const upgrade9 = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability as StructuredAbility;
      expect(level9Ability.trigger).toBe(AbilityTrigger.OnSummon);
    });
  });

  describe('Strategic Value', () => {
    test('should provide explosive card advantage', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const level9Ability = upgrade!.ability as StructuredAbility;
      const drawEffect = level9Ability.effects.find(
        e => e.type === EffectType.DrawCards
      ) as DrawCardEffect | undefined;
      expect(drawEffect).toBeDefined();
      expect(drawEffect!.value).toBe(3);
    });

    test('should buff entire board on summon at max level', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const level9Ability = upgrade!.ability as StructuredAbility;
      const teamBuffs = level9Ability.effects.filter(
        e => e.target === AbilityTarget.AllAllies && e.type === EffectType.ModifyStats
      );
      expect(teamBuffs.length).toBeGreaterThanOrEqual(2);
    });

    test('should disrupt enemy formations', () => {
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const level7Ability = upgrade!.ability as StructuredAbility;
      const effect = level7Ability.effects[0] as SwapPositionsEffect;
      expect(effect.type).toBe(EffectType.SwapPositions);
      expect(effect.target).toBe(AbilityTarget.AllEnemies);
    });

    test('should excel in aggressive tempo strategies', () => {
      // Balanced stats for combat
      expect(AERO_MOTH.baseAttack).toBe(3);
      expect(AERO_MOTH.baseHealth).toBe(3);

      // Card draw for maintaining pressure
      expect(AERO_MOTH.ability.effects[0].type).toBe(EffectType.DrawCards);

      // Affordable cost for tempo plays
      expect(AERO_MOTH.cost).toBe(2);
    });

    test('should replace itself and more', () => {
      // Base ability draws 1 card (replaces itself)
      const baseEffect = AERO_MOTH.ability.effects[0] as DrawCardEffect;
      expect(baseEffect.value).toBe(1);

      // Level 9 draws 3 cards (generates card advantage)
      const upgrade = AERO_MOTH.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const level9Ability = upgrade!.ability as StructuredAbility;
      const level9DrawEffect = level9Ability.effects.find(
        e => e.type === EffectType.DrawCards
      ) as DrawCardEffect | undefined;
      expect(level9DrawEffect).toBeDefined();
      expect(level9DrawEffect!.value).toBe(3);
    });
  });
});
