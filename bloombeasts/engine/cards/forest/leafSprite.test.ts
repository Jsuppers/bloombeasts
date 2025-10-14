/**
 * Tests for Leaf Sprite card
 */

import { describe, test, expect } from '@jest/globals';
import { LEAF_SPRITE } from './leafSprite.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import {
  EffectType, AbilityTarget, AbilityTrigger, ResourceType, ImmunityType,
  AttackModificationEffect, ResourceGainEffect, ImmunityEffect, StructuredAbility
} from '../../types/abilities.js';

describe('Leaf Sprite Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(LEAF_SPRITE);
    });

    test('should have correct card properties', () => {
      expect(LEAF_SPRITE.id).toBe('leaf-sprite');
      expect(LEAF_SPRITE.name).toBe('Leaf Sprite');
      expect(LEAF_SPRITE.type).toBe('Bloom');
      expect(LEAF_SPRITE.affinity).toBe('Forest');
      expect(LEAF_SPRITE.cost).toBe(2);
      expect(LEAF_SPRITE.baseAttack).toBe(3);
      expect(LEAF_SPRITE.baseHealth).toBe(2);
    });

    test('should be an evasive attacker with high attack', () => {
      expect(LEAF_SPRITE.baseAttack).toBeGreaterThan(LEAF_SPRITE.baseHealth);
      expect(LEAF_SPRITE.cost).toBe(2);
    });
  });

  describe('Base Ability - Evasive', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(LEAF_SPRITE.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(LEAF_SPRITE.ability.name).toBe('Evasive');
    });

    test('should be a passive ability', () => {
      expect(LEAF_SPRITE.ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should have piercing attack modification', () => {
      const ability = LEAF_SPRITE.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as AttackModificationEffect;
      expect(effect.type).toBe(EffectType.AttackModification);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.modification).toBe('piercing');
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(LEAF_SPRITE);
    });

    test('should have stat gains for all levels', () => {
      expect(LEAF_SPRITE.levelingConfig).toBeDefined();
      expect(LEAF_SPRITE.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(LEAF_SPRITE.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have increasing stat gains', () => {
      validateStatGainsProgression(LEAF_SPRITE);
    });

    test('should prioritize ATK gains over HP gains', () => {
      const statGains = LEAF_SPRITE.levelingConfig!.statGains!;
      expect(statGains[9].atk).toBe(12);
      expect(statGains[9].hp).toBe(4);
      expect(statGains[9].atk).toBeGreaterThan(statGains[9].hp * 2);
    });
  });

  describe('Level 4 Upgrade - Pollen Rush', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.name).toBe('Pollen Rush');
    });

    test('should trigger on destroy', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.OnDestroy);
    });

    test('should grant 2 extra nectar plays', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as ResourceGainEffect;
      expect(effect.type).toBe(EffectType.GainResource);
      expect(effect.target).toBe(AbilityTarget.PlayerGardener);
      expect(effect.resource).toBe(ResourceType.ExtraNectarPlay);
      expect(effect.value).toBe(2);
    });
  });

  describe('Level 7 Upgrade - Master Evasion', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.name).toBe('Master Evasion');
    });

    test('should be passive', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should have piercing and immunity to targeting', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const piercingEffect = ability.effects[0] as AttackModificationEffect;
      expect(piercingEffect.type).toBe(EffectType.AttackModification);
      expect(piercingEffect.modification).toBe('piercing');

      const immunityEffect = ability.effects[1] as ImmunityEffect;
      expect(immunityEffect.type).toBe(EffectType.Immunity);
      expect(immunityEffect.target).toBe(AbilityTarget.Self);
      expect(immunityEffect.immuneTo).toContain(ImmunityType.Targeting);
    });
  });

  describe('Level 9 Upgrade - Shadow Strike', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.ability).toBeDefined();
      validateStructuredAbility(upgrade!.ability as StructuredAbility);
    });

    test('should have correct ability name', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.name).toBe('Shadow Strike');
    });

    test('should be passive', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should attack twice and have piercing', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.ability as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const doubleAttackEffect = ability.effects[0] as AttackModificationEffect;
      expect(doubleAttackEffect.type).toBe(EffectType.AttackModification);
      expect(doubleAttackEffect.modification).toBe('attack-twice');

      const piercingEffect = ability.effects[1] as AttackModificationEffect;
      expect(piercingEffect.type).toBe(EffectType.AttackModification);
      expect(piercingEffect.modification).toBe('piercing');
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain aggressive attacker role throughout progression', () => {
      const statGains = LEAF_SPRITE.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.atk).toBeGreaterThanOrEqual(gains.hp);
      }
    });

    test('should have consistent evasion theme', () => {
      const baseAbility = LEAF_SPRITE.ability as StructuredAbility;
      expect(baseAbility.effects[0].type).toBe(EffectType.AttackModification);

      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const level7Ability = upgrade!.ability as StructuredAbility;
      const hasImmunity = level7Ability.effects.some(e => e.type === EffectType.Immunity);
      expect(hasImmunity).toBe(true);
    });

    test('should scale appropriately for a 2-cost unit', () => {
      expect(LEAF_SPRITE.cost).toBe(2);
      expect(LEAF_SPRITE.baseAttack + LEAF_SPRITE.baseHealth).toBe(5);
      const maxStats = LEAF_SPRITE.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(16);
    });

    test('should have resource generation on death', () => {
      const upgrade = LEAF_SPRITE.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const level4Ability = upgrade!.ability as StructuredAbility;
      const hasResourceGain = level4Ability.effects.some(e => e.type === EffectType.GainResource);
      expect(hasResourceGain).toBe(true);
    });
  });
});
