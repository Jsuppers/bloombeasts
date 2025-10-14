/**
 * Tests for Bubblefin card
 */

import { describe, test, expect } from '@jest/globals';
import { BUBBLEFIN } from './bubblefin.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration, StructuredAbility, CannotBeTargetedEffect, StatModificationEffect } from '../../types/abilities.js';

describe('Bubblefin Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(BUBBLEFIN);
    });

    test('should have correct card properties', () => {
      expect(BUBBLEFIN.id).toBe('bubblefin');
      expect(BUBBLEFIN.name).toBe('Bubblefin');
      expect(BUBBLEFIN.type).toBe('Bloom');
      expect(BUBBLEFIN.affinity).toBe('Water');
      expect(BUBBLEFIN.cost).toBe(2);
      expect(BUBBLEFIN.baseAttack).toBe(2);
      expect(BUBBLEFIN.baseHealth).toBe(5);
    });

    test('should be a defensive protected unit', () => {
      expect(BUBBLEFIN.baseHealth).toBeGreaterThan(BUBBLEFIN.baseAttack);
      expect(BUBBLEFIN.cost).toBe(2);
      expect(BUBBLEFIN.baseAttack + BUBBLEFIN.baseHealth).toBe(7);
    });
  });

  describe('Base Ability - Emerge', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(BUBBLEFIN.ability);
    });

    test('should have correct ability name', () => {
      expect(BUBBLEFIN.ability.name).toBe('Emerge');
    });

    test('should be a passive ability', () => {
      expect(BUBBLEFIN.ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should prevent targeting by traps', () => {
      expect(BUBBLEFIN.ability.effects).toHaveLength(1);
      const effect = BUBBLEFIN.ability.effects[0] as CannotBeTargetedEffect;
      expect(effect.type).toBe(EffectType.CannotBeTargeted);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.by).toBeDefined();
      expect(effect.by).toContain('trap');
    });

    test('should only protect from traps at base level', () => {
      const effect = BUBBLEFIN.ability.effects[0] as CannotBeTargetedEffect;
      expect(effect.by).toEqual(['trap']);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(BUBBLEFIN);
    });

    test('should have stat gains for all levels', () => {
      expect(BUBBLEFIN.levelingConfig).toBeDefined();
      expect(BUBBLEFIN.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(BUBBLEFIN.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have non-decreasing stat gains', () => {
      validateStatGainsProgression(BUBBLEFIN);
    });

    test('should heavily prioritize HP gains', () => {
      const statGains = BUBBLEFIN.levelingConfig!.statGains!;
      expect(statGains[5].hp).toBe(8);
      expect(statGains[5].atk).toBe(2);
      expect(statGains[9].hp).toBe(16);
      expect(statGains[9].atk).toBe(6);
      // HP gains should be significantly higher than ATK
      expect(statGains[9].hp).toBeGreaterThan(statGains[9].atk * 2);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(BUBBLEFIN.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(BUBBLEFIN.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Tidal Shield', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability!);
    });

    test('should have correct ability name', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.name).toBe('Tidal Shield');
    });

    test('should trigger on damage', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.trigger).toBe(AbilityTrigger.OnDamage);
    });

    test('should reduce attacker attack by 2', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.Attacker);
      expect(effect.stat).toBe(StatType.Attack);
      expect(effect.value).toBe(-2);
      expect(effect.duration).toBe(EffectDuration.EndOfTurn);
    });

    test('should be a defensive counter mechanism', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      const effect = ability.effects[0] as StatModificationEffect;
      expect(effect.target).toBe(AbilityTarget.Attacker);
      expect(effect.value).toBeLessThan(0);
    });
  });

  describe('Level 7 Upgrade - Deep Dive', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability!);
    });

    test('should have correct ability name', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.name).toBe('Deep Dive');
    });

    test('should be a passive ability', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should prevent targeting by traps and magic', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as CannotBeTargetedEffect;
      expect(effect.type).toBe(EffectType.CannotBeTargeted);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.by).toBeDefined();
      expect(effect.by).toContain('trap');
      expect(effect.by).toContain('magic');
    });

    test('should expand protection compared to base ability', () => {
      const baseEffect = BUBBLEFIN.ability.effects[0] as CannotBeTargetedEffect;
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const level7Effect = upgrade!.ability!.effects[0] as CannotBeTargetedEffect;
      expect(level7Effect.by!.length).toBeGreaterThan(baseEffect.by!.length);
    });
  });

  describe('Level 9 Upgrade - Ocean Sanctuary and Crushing Depths', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability!);
    });

    test('should have correct ability name', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.name).toBe('Ocean Sanctuary');
    });

    test('should be a passive ability', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability!;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should prevent targeting by magic, traps, and abilities', () => {
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      const ability = upgrade!.ability! as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as CannotBeTargetedEffect;
      expect(effect.type).toBe(EffectType.CannotBeTargeted);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.by).toBeDefined();
      expect(effect.by).toContain('magic');
      expect(effect.by).toContain('trap');
      expect(effect.by).toContain('abilities');
    });

    test('should have maximum protection coverage', () => {
      const baseEffect = BUBBLEFIN.ability.effects[0] as CannotBeTargetedEffect;
      const upgrade = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const level9Effect = upgrade!.ability!.effects[0] as CannotBeTargetedEffect;
      expect(level9Effect.by!.length).toBeGreaterThan(baseEffect.by!.length);
      expect(level9Effect.by!.length).toBe(3);
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain defensive tank role throughout progression', () => {
      const statGains = BUBBLEFIN.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBeGreaterThanOrEqual(gains.atk);
      }
    });

    test('should have consistent protection theme', () => {
      const baseAbility = BUBBLEFIN.ability;
      expect(baseAbility.effects[0].type).toBe(EffectType.CannotBeTargeted);

      const level7Ability = BUBBLEFIN.levelingConfig!.abilityUpgrades![7].ability!;
      expect(level7Ability.effects[0].type).toBe(EffectType.CannotBeTargeted);

      const level9Ability = BUBBLEFIN.levelingConfig!.abilityUpgrades![9].ability!;
      expect(level9Ability.effects[0].type).toBe(EffectType.CannotBeTargeted);
    });

    test('should scale appropriately for a 2-cost defensive unit', () => {
      expect(BUBBLEFIN.cost).toBe(2);
      expect(BUBBLEFIN.baseAttack + BUBBLEFIN.baseHealth).toBe(7);
      const maxStats = BUBBLEFIN.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(22);
    });

    test('should expand protection over time', () => {
      const baseProtection = (BUBBLEFIN.ability.effects[0] as CannotBeTargetedEffect).by!.length;
      const upgrade7 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Protection = (upgrade7!.ability!.effects[0] as CannotBeTargetedEffect).by!.length;
      const upgrade9 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Protection = (upgrade9!.ability!.effects[0] as CannotBeTargetedEffect).by!.length;

      expect(level7Protection).toBeGreaterThan(baseProtection);
      expect(level9Protection).toBeGreaterThan(level7Protection);
    });
  });

  describe('Ability Synergies', () => {
    test('should provide excellent protection from targeted effects', () => {
      const upgrade9 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability! as StructuredAbility;
      const effect = level9Ability.effects[0] as CannotBeTargetedEffect;
      expect(effect.type).toBe(EffectType.CannotBeTargeted);
      expect(effect.by!.length).toBeGreaterThanOrEqual(3);
    });

    test('should have defensive counter mechanics at level 4', () => {
      const upgrade4 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability! as StructuredAbility;
      expect(level4Ability.trigger).toBe(AbilityTrigger.OnDamage);
      const effect = level4Ability.effects[0] as StatModificationEffect;
      expect(effect.type).toBe(EffectType.ModifyStats);
      expect(effect.target).toBe(AbilityTarget.Attacker);
      expect(effect.value).toBeLessThan(0);
    });

    test('should counter aggressive strategies', () => {
      const upgrade4 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability! as StructuredAbility;
      const hasAttackReduction = level4Ability.effects.some(
        e => e.type === EffectType.ModifyStats && (e as StatModificationEffect).stat === StatType.Attack && (e as StatModificationEffect).value < 0
      );
      expect(hasAttackReduction).toBe(true);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain water-themed ability names', () => {
      expect(BUBBLEFIN.ability.name).toBe('Emerge');
      const upgrade4 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      expect(upgrade4!.ability!.name).toBe('Tidal Shield');
      const upgrade7 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      expect(upgrade7!.ability!.name).toBe('Deep Dive');
      const upgrade9 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      expect(upgrade9!.ability!.name).toBe('Ocean Sanctuary');
    });

    test('should embody elusive underwater creature mechanics', () => {
      // Base ability provides untargetability
      expect(BUBBLEFIN.ability.effects[0].type).toBe(EffectType.CannotBeTargeted);

      // High HP to represent durability
      expect(BUBBLEFIN.baseHealth).toBe(5);

      // Expands protection over levels
      const upgrade9 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Protection = (upgrade9!.ability!.effects[0] as CannotBeTargetedEffect).by!;
      expect(level9Protection.length).toBeGreaterThanOrEqual(3);
    });

    test('should represent bubble shield mechanics', () => {
      const upgrade4 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability!;
      expect(level4Ability.name).toBe('Tidal Shield');
      expect(level4Ability.trigger).toBe(AbilityTrigger.OnDamage);
      expect(level4Ability.effects[0].target).toBe(AbilityTarget.Attacker);
    });
  });

  describe('Edge Cases and Special Mechanics', () => {
    test('should have passive protection that is always active', () => {
      expect(BUBBLEFIN.ability.trigger).toBe(AbilityTrigger.Passive);
      const upgrade7 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.ability!;
      expect(level7Ability.trigger).toBe(AbilityTrigger.Passive);
      const upgrade9 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability!;
      expect(level9Ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should protect self, not allies', () => {
      const baseEffect = BUBBLEFIN.ability.effects[0] as CannotBeTargetedEffect;
      expect(baseEffect.target).toBe(AbilityTarget.Self);

      const upgrade7 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Effect = upgrade7!.ability!.effects[0] as CannotBeTargetedEffect;
      expect(level7Effect.target).toBe(AbilityTarget.Self);

      const upgrade9 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Effect = upgrade9!.ability!.effects[0] as CannotBeTargetedEffect;
      expect(level9Effect.target).toBe(AbilityTarget.Self);
    });

    test('should have temporary debuffs on damage', () => {
      const upgrade4 = BUBBLEFIN.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.ability! as StructuredAbility;
      const effect = level4Ability.effects[0] as StatModificationEffect;
      expect(effect.duration).toBe(EffectDuration.EndOfTurn);
    });
  });
});
