/**
 * Tests for Rootling card
 */

import { describe, test, expect } from '@jest/globals';
import { ROOTLING } from './rootling.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
} from '../__tests__/testUtils.js';
import {
  EffectType, AbilityTarget, AbilityTrigger, ResourceType,
  CannotBeTargetedEffect, ResourceGainEffect, StructuredAbility
} from '../../types/abilities.js';

describe('Rootling Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(ROOTLING);
    });

    test('should have correct card properties', () => {
      expect(ROOTLING.id).toBe('rootling');
      expect(ROOTLING.name).toBe('Rootling');
      expect(ROOTLING.type).toBe('Bloom');
      expect(ROOTLING.affinity).toBe('Forest');
      expect(ROOTLING.cost).toBe(1);
      expect(ROOTLING.baseAttack).toBe(1);
      expect(ROOTLING.baseHealth).toBe(3);
    });

    test('should be a low-cost utility unit', () => {
      expect(ROOTLING.cost).toBe(1);
      expect(ROOTLING.baseAttack + ROOTLING.baseHealth).toBe(4);
    });
  });

  describe('Base Ability - Deep Roots', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(ROOTLING.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(ROOTLING.ability.name).toBe('Deep Roots');
    });

    test('should be a passive ability', () => {
      expect(ROOTLING.ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should not be targetable by magic', () => {
      const ability = ROOTLING.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as CannotBeTargetedEffect;
      expect(effect.type).toBe(EffectType.CannotBeTargeted);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.by).toContain('magic');
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(ROOTLING);
    });

    test('should have stat gains for all levels', () => {
      expect(ROOTLING.levelingConfig).toBeDefined();
      expect(ROOTLING.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(ROOTLING.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(ROOTLING);
    });

    test('should have balanced stat gains', () => {
      const statGains = ROOTLING.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(8);
      expect(statGains[9].atk).toBe(7);
      expect(Math.abs(statGains[9].hp - statGains[9].atk)).toBeLessThanOrEqual(1);
    });
  });

  describe('Level 4 Upgrade - Abundant Nourish', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.name).toBe('Abundant Nourish');
    });

    test('should trigger on destroy', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnDestroy);
    });

    test('should grant 2 nectar', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      const effect = ability.effects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
      expect(effect.target).toBe(AbilityTarget.PlayerGardener);
      expect(effect.resource).toBe(ResourceType.Nectar);
      expect(effect.value).toBe(2);
    });
  });

  describe('Level 7 Upgrade - Ancient Roots', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.name).toBe('Ancient Roots');
    });

    test('should be passive', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should not be targetable by magic and traps', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      const effect = ability.effects[0] as CannotBeTargetedEffect;
      expect(effect.type).toBe(EffectType.CannotBeTargeted);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.by).toContain('magic');
      expect(effect.by).toContain('trap');
    });
  });

  describe('Level 9 Upgrade - Eternal Roots & Harvest Feast', () => {
    test('should have upgraded passive at level 9', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.name).toBe('Eternal Roots');
    });

    test('should not be targetable by magic, traps, and abilities', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      const effect = ability.effects[0] as CannotBeTargetedEffect;
      expect(effect.type).toBe(EffectType.CannotBeTargeted);
      expect(effect.by).toContain('magic');
      expect(effect.by).toContain('trap');
      expect(effect.by).toContain('abilities');
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain protected utility role throughout progression', () => {
      const baseAbility = ROOTLING.ability as StructuredAbility;
      expect(baseAbility.effects[0].type).toBe(EffectType.CannotBeTargeted);

      const upgrade7 = ROOTLING.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.ability as StructuredAbility;
      expect(level7Ability.effects[0].type).toBe(EffectType.CannotBeTargeted);

      const upgrade9 = ROOTLING.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability as StructuredAbility;
      expect(level9Ability.effects[0].type).toBe(EffectType.CannotBeTargeted);
    });

    test('should expand protection coverage with level', () => {
      const baseAbility = ROOTLING.ability as StructuredAbility;
      const baseProtection = (baseAbility.effects[0] as CannotBeTargetedEffect).by;
      expect(baseProtection).toHaveLength(1);

      const upgrade7 = ROOTLING.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.ability as StructuredAbility;
      const level7Protection = (level7Ability.effects[0] as CannotBeTargetedEffect).by;
      expect(level7Protection.length).toBeGreaterThan(baseProtection.length);

      const upgrade9 = ROOTLING.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.ability as StructuredAbility;
      const level9Protection = (level9Ability.effects[0] as CannotBeTargetedEffect).by;
      expect(level9Protection.length).toBeGreaterThan(level7Protection.length);
    });

    test('should have resource generation on death', () => {
      const upgrade = ROOTLING.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const level4Ability = upgrade!.ability as StructuredAbility;
      expect(level4Ability.trigger).toBe(AbilityTrigger.OnDestroy);
      expect(level4Ability.effects[0].type).toBe(EffectType.GainResource);
    });

    test('should scale appropriately for a 1-cost unit', () => {
      expect(ROOTLING.cost).toBe(1);
      expect(ROOTLING.baseAttack + ROOTLING.baseHealth).toBe(4);
      const maxStats = ROOTLING.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(15);
    });
  });
});
