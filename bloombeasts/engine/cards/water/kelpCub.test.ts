/**
 * Tests for Kelp Cub card
 */

import { describe, test, expect } from '@jest/globals';
import { KELP_CUB } from './kelpCub.js';
import {
  validateBloomBeastCard,
  validateStructuredAbility,
  validateLevelingConfig,
  validateStatGainsProgression,
  countEffectsByType,
} from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget, AbilityTrigger, EffectDuration, ImmunityType, StructuredAbility, PreventEffect, ImmunityEffect } from '../../types/abilities.js';

describe('Kelp Cub Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid base card structure', () => {
      validateBloomBeastCard(KELP_CUB);
    });

    test('should have correct card properties', () => {
      expect(KELP_CUB.id).toBe('kelp-cub');
      expect(KELP_CUB.name).toBe('Kelp Cub');
      expect(KELP_CUB.type).toBe('Bloom');
      expect(KELP_CUB.affinity).toBe('Water');
      expect(KELP_CUB.cost).toBe(2);
      expect(KELP_CUB.baseAttack).toBe(3);
      expect(KELP_CUB.baseHealth).toBe(3);
    });

    test('should be a balanced control unit', () => {
      expect(KELP_CUB.baseAttack).toBe(KELP_CUB.baseHealth);
      expect(KELP_CUB.cost).toBe(2);
      expect(KELP_CUB.baseAttack + KELP_CUB.baseHealth).toBe(6);
    });
  });

  describe('Base Ability - Entangle', () => {
    test('should have valid structured ability', () => {
      validateStructuredAbility(KELP_CUB.abilities[0] as StructuredAbility);
    });

    test('should have correct ability name', () => {
      expect(KELP_CUB.abilities[0].name).toBe('Entangle');
    });

    test('should trigger on attack', () => {
      expect(KELP_CUB.abilities[0].trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should prevent target from attacking', () => {
      expect(KELP_CUB.abilities[0].effects).toHaveLength(1);
      const effect = KELP_CUB.abilities[0].effects[0] as PreventEffect;
      expect(effect.type).toBe(EffectType.PreventAttack);
      expect(effect.target).toBe(AbilityTarget.Target);
      expect(effect.duration).toBe(EffectDuration.StartOfNextTurn);
    });

    test('should immobilize until start of next turn', () => {
      const effect = KELP_CUB.abilities[0].effects[0] as PreventEffect;
      expect(effect.duration).toBe(EffectDuration.StartOfNextTurn);
    });
  });

  describe('Leveling Configuration', () => {
    test('should have valid leveling configuration', () => {
      validateLevelingConfig(KELP_CUB);
    });

    test('should have stat gains for all levels', () => {
      expect(KELP_CUB.levelingConfig).toBeDefined();
      expect(KELP_CUB.levelingConfig!.statGains).toBeDefined();
      const levels = Object.keys(KELP_CUB.levelingConfig!.statGains!).map(Number);
      expect(levels).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    test('should have non-decreasing stat gains', () => {
      validateStatGainsProgression(KELP_CUB);
    });

    test('should have perfectly balanced stat progression', () => {
      const statGains = KELP_CUB.levelingConfig!.statGains!;
      for (let level = 1; level <= 9; level++) {
        const gains = statGains[level as keyof typeof statGains];
        expect(gains.hp).toBe(gains.atk);
      }
    });

    test('should have symmetric growth', () => {
      const statGains = KELP_CUB.levelingConfig!.statGains!;
      expect(statGains[5].hp).toBe(4);
      expect(statGains[5].atk).toBe(4);
      expect(statGains[9].hp).toBe(8);
      expect(statGains[9].atk).toBe(8);
    });

    test('should have ability upgrades at levels 4, 7, and 9', () => {
      expect(KELP_CUB.levelingConfig!.abilityUpgrades).toBeDefined();
      const upgradeLevels = Object.keys(KELP_CUB.levelingConfig!.abilityUpgrades!).map(Number);
      expect(upgradeLevels).toEqual(expect.arrayContaining([4, 7, 9]));
    });
  });

  describe('Level 4 Upgrade - Binding Vines', () => {
    test('should have upgraded ability at level 4', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.name).toBe('Binding Vines');
    });

    test('should still trigger on attack', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should prevent both attack and abilities', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const preventAttack = ability.effects.find(e => e.type === EffectType.PreventAttack) as PreventEffect | undefined;
      const preventAbilities = ability.effects.find(e => e.type === EffectType.PreventAbilities) as PreventEffect | undefined;

      expect(preventAttack).toBeDefined();
      expect(preventAbilities).toBeDefined();
      expect(preventAttack!.target).toBe(AbilityTarget.Target);
      expect(preventAbilities!.target).toBe(AbilityTarget.Target);
    });

    test('should have consistent duration on both effects', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      ability.effects.forEach(effect => {
        expect((effect as PreventEffect).duration).toBe(EffectDuration.StartOfNextTurn);
      });
    });

    test('should be a power upgrade from base ability', () => {
      const baseEffects = KELP_CUB.abilities[0].effects.length;
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade).toBeDefined();
      const upgradedEffects = upgrade!.abilities![0].effects.length;
      expect(upgradedEffects).toBeGreaterThan(baseEffects);
    });
  });

  describe('Level 7 Upgrade - Deep Anchor', () => {
    test('should have upgraded ability at level 7', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.name).toBe('Deep Anchor');
    });

    test('should be a passive ability', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.trigger).toBe(AbilityTrigger.Passive);
    });

    test('should grant immunity to magic, traps, and abilities', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      expect(ability.effects).toHaveLength(1);
      const effect = ability.effects[0] as ImmunityEffect;
      expect(effect.type).toBe(EffectType.Immunity);
      expect(effect.target).toBe(AbilityTarget.Self);
      expect(effect.immuneTo).toBeDefined();
      expect(effect.immuneTo).toContain(ImmunityType.Magic);
      expect(effect.immuneTo).toContain(ImmunityType.Trap);
      expect(effect.immuneTo).toContain(ImmunityType.Abilities);
    });

    test('should have while on field duration', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      const effect = ability.effects[0] as ImmunityEffect;
      expect(effect.duration).toBe(EffectDuration.WhileOnField);
    });

    test('should add defensive capabilities', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      expect(ability.effects[0].type).toBe(EffectType.Immunity);
    });
  });

  describe('Level 9 Upgrade - Strangling Grasp and Immovable Force', () => {
    test('should have upgraded ability at level 9', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      validateStructuredAbility(upgrade!.abilities![0]);
    });

    test('should have correct ability name', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.name).toBe('Strangling Grasp');
    });

    test('should trigger on attack', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0];
      expect(ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should permanently prevent attack and abilities', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      expect(upgrade?.abilities).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      expect(ability.effects).toHaveLength(2);

      const preventAttack = ability.effects.find(e => e.type === EffectType.PreventAttack) as PreventEffect | undefined;
      const preventAbilities = ability.effects.find(e => e.type === EffectType.PreventAbilities) as PreventEffect | undefined;

      expect(preventAttack).toBeDefined();
      expect(preventAbilities).toBeDefined();
      expect(preventAttack!.duration).toBe(EffectDuration.Permanent);
      expect(preventAbilities!.duration).toBe(EffectDuration.Permanent);
    });

    test('should have permanent lockdown instead of temporary', () => {
      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0] as StructuredAbility;

      expect((level4Ability.effects[0] as PreventEffect).duration).toBe(EffectDuration.StartOfNextTurn);
      expect((level9Ability.effects[0] as PreventEffect).duration).toBe(EffectDuration.Permanent);
    });

    test('should target the same unit as base ability', () => {
      const upgrade = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade).toBeDefined();
      const ability = upgrade!.abilities![0] as StructuredAbility;
      ability.effects.forEach(effect => {
        if (effect.type === EffectType.PreventAttack || effect.type === EffectType.PreventAbilities) {
          expect(effect.target).toBe(AbilityTarget.Target);
        }
      });
    });
  });

  describe('Card Progression and Balance', () => {
    test('should maintain control role throughout progression', () => {
      const baseAbility = KELP_CUB.abilities[0];
      expect(baseAbility.effects[0].type).toBe(EffectType.PreventAttack);

      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      const hasControl = level4Ability.effects.some(
        e => e.type === EffectType.PreventAttack || e.type === EffectType.PreventAbilities
      );
      expect(hasControl).toBe(true);

      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0] as StructuredAbility;
      const hasLevel9Control = level9Ability.effects.some(
        e => e.type === EffectType.PreventAttack || e.type === EffectType.PreventAbilities
      );
      expect(hasLevel9Control).toBe(true);
    });

    test('should have consistent immobilization theme', () => {
      const baseAbility = KELP_CUB.abilities[0];
      expect(baseAbility.name).toBe('Entangle');

      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0];
      expect(level4Ability.name).toBe('Binding Vines');

      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0];
      expect(level9Ability.name).toBe('Strangling Grasp');
    });

    test('should scale appropriately for a 2-cost control unit', () => {
      expect(KELP_CUB.cost).toBe(2);
      expect(KELP_CUB.baseAttack + KELP_CUB.baseHealth).toBe(6);
      const maxStats = KELP_CUB.levelingConfig!.statGains![9];
      expect(maxStats.hp + maxStats.atk).toBe(16);
    });

    test('should progress from temporary to permanent control', () => {
      const baseAbility = KELP_CUB.abilities[0];
      expect((baseAbility.effects[0] as PreventEffect).duration).toBe(EffectDuration.StartOfNextTurn);

      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0] as StructuredAbility;
      expect((level9Ability.effects[0] as PreventEffect).duration).toBe(EffectDuration.Permanent);
    });
  });

  describe('Ability Synergies', () => {
    test('should synergize with attack-based strategies', () => {
      const baseAbility = KELP_CUB.abilities[0];
      expect(baseAbility.trigger).toBe(AbilityTrigger.OnAttack);

      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0];
      expect(level4Ability.trigger).toBe(AbilityTrigger.OnAttack);

      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0];
      expect(level9Ability.trigger).toBe(AbilityTrigger.OnAttack);
    });

    test('should provide immunity to indirect strategies at level 7', () => {
      const upgrade7 = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      const effect = level7Ability.effects[0] as ImmunityEffect;
      expect(effect.immuneTo).toContain(ImmunityType.Magic);
      expect(effect.immuneTo).toContain(ImmunityType.Trap);
      expect(effect.immuneTo).toContain(ImmunityType.Abilities);
    });

    test('should neutralize single threats effectively', () => {
      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0] as StructuredAbility;
      const preventAttack = level9Ability.effects.find(e => e.type === EffectType.PreventAttack) as PreventEffect | undefined;
      const preventAbilities = level9Ability.effects.find(e => e.type === EffectType.PreventAbilities) as PreventEffect | undefined;

      expect(preventAttack!.duration).toBe(EffectDuration.Permanent);
      expect(preventAbilities!.duration).toBe(EffectDuration.Permanent);
    });

    test('should have increasing control power', () => {
      const baseAbility = KELP_CUB.abilities[0];
      const baseControl = countEffectsByType(baseAbility.effects, EffectType.PreventAttack);

      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      const level4Control = countEffectsByType(level4Ability.effects, EffectType.PreventAttack) +
                            countEffectsByType(level4Ability.effects, EffectType.PreventAbilities);

      expect(level4Control).toBeGreaterThan(baseControl);
    });
  });

  describe('Thematic Consistency', () => {
    test('should maintain kelp/entanglement themed ability names', () => {
      expect(KELP_CUB.abilities[0].name).toBe('Entangle');
      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      expect(upgrade4!.abilities![0].name).toBe('Binding Vines');
      const upgrade7 = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      expect(upgrade7!.abilities![0].name).toBe('Deep Anchor');
      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      expect(upgrade9!.abilities![0].name).toBe('Strangling Grasp');
    });

    test('should embody immobilization and control mechanics', () => {
      // Base prevents attack
      expect(KELP_CUB.abilities[0].effects[0].type).toBe(EffectType.PreventAttack);

      // Level 4 adds ability prevention
      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      const hasAbilityPrevention = level4Ability.effects.some(e => e.type === EffectType.PreventAbilities);
      expect(hasAbilityPrevention).toBe(true);

      // Level 7 adds immunity (defensive anchor)
      const upgrade7 = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      expect(level7Ability.effects[0].type).toBe(EffectType.Immunity);

      // Level 9 makes control permanent (strangling)
      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0] as StructuredAbility;
      expect((level9Ability.effects[0] as PreventEffect).duration).toBe(EffectDuration.Permanent);
    });

    test('should represent underwater plant mechanics', () => {
      // Entanglement on attack (wrapping around)
      expect(KELP_CUB.abilities[0].trigger).toBe(AbilityTrigger.OnAttack);
      expect(KELP_CUB.abilities[0].effects[0].type).toBe(EffectType.PreventAttack);

      // Anchoring provides stability (immunity)
      const upgrade7 = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0];
      expect(level7Ability.name).toContain('Anchor');
      expect(level7Ability.effects[0].type).toBe(EffectType.Immunity);
    });
  });

  describe('Edge Cases and Special Mechanics', () => {
    test('should have attack-triggered control effects', () => {
      expect(KELP_CUB.abilities[0].trigger).toBe(AbilityTrigger.OnAttack);
      expect(KELP_CUB.abilities[0].effects[0].target).toBe(AbilityTarget.Target);
    });

    test('should provide self-protection through immunity', () => {
      const upgrade7 = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      expect(level7Ability.effects[0].target).toBe(AbilityTarget.Self);
      expect(level7Ability.effects[0].type).toBe(EffectType.Immunity);
    });

    test('should have balanced stat growth', () => {
      const statGains = KELP_CUB.levelingConfig!.statGains!;
      Object.values(statGains).forEach(gains => {
        expect(gains.hp).toBe(gains.atk);
      });
    });

    test('should escalate control duration', () => {
      const baseAbility = KELP_CUB.abilities[0];
      expect((baseAbility.effects[0] as PreventEffect).duration).toBe(EffectDuration.StartOfNextTurn);

      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      expect((level4Ability.effects[0] as PreventEffect).duration).toBe(EffectDuration.StartOfNextTurn);

      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0] as StructuredAbility;
      expect((level9Ability.effects[0] as PreventEffect).duration).toBe(EffectDuration.Permanent);
    });
  });

  describe('Combat Mechanics', () => {
    test('should disable attacker on successful attack', () => {
      const baseAbility = KELP_CUB.abilities[0];
      expect(baseAbility.trigger).toBe(AbilityTrigger.OnAttack);
      expect(baseAbility.effects[0].type).toBe(EffectType.PreventAttack);
      expect(baseAbility.effects[0].target).toBe(AbilityTarget.Target);
    });

    test('should have increasing lockdown power', () => {
      const baseEffects = KELP_CUB.abilities[0].effects.length;
      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Effects = upgrade4!.abilities![0].effects.length;

      expect(level4Effects).toBeGreaterThan(baseEffects);
    });

    test('should prevent both offensive and utility actions', () => {
      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const level4Ability = upgrade4!.abilities![0] as StructuredAbility;
      const preventAttack = level4Ability.effects.some(e => e.type === EffectType.PreventAttack);
      const preventAbilities = level4Ability.effects.some(e => e.type === EffectType.PreventAbilities);

      expect(preventAttack).toBe(true);
      expect(preventAbilities).toBe(true);
    });

    test('should maintain control theme across all upgrades', () => {
      const upgrade4 = KELP_CUB.levelingConfig?.abilityUpgrades?.[4];
      expect(upgrade4).toBeDefined();
      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();

      const abilities = [
        KELP_CUB.abilities[0],
        upgrade4!.abilities![0],
        upgrade9!.abilities![0],
      ];

      abilities.forEach(ability => {
        if (ability.trigger === AbilityTrigger.OnAttack) {
          const hasControl = ability.effects.some(
            e => e.type === EffectType.PreventAttack || e.type === EffectType.PreventAbilities
          );
          expect(hasControl).toBe(true);
        }
      });
    });
  });

  describe('Strategic Value', () => {
    test('should provide hard removal at level 9', () => {
      const upgrade9 = KELP_CUB.levelingConfig?.abilityUpgrades?.[9];
      expect(upgrade9).toBeDefined();
      const level9Ability = upgrade9!.abilities![0] as StructuredAbility;
      const permanentPrevent = level9Ability.effects.every(
        e => (e as PreventEffect).duration === EffectDuration.Permanent
      );
      expect(permanentPrevent).toBe(true);
    });

    test('should have immunity to indirect removal', () => {
      const upgrade7 = KELP_CUB.levelingConfig?.abilityUpgrades?.[7];
      expect(upgrade7).toBeDefined();
      const level7Ability = upgrade7!.abilities![0] as StructuredAbility;
      const immunities = (level7Ability.effects[0] as ImmunityEffect).immuneTo;
      expect(immunities).toContain(ImmunityType.Magic);
      expect(immunities).toContain(ImmunityType.Trap);
      expect(immunities).toContain(ImmunityType.Abilities);
    });

    test('should scale stats evenly for flexible positioning', () => {
      const statGains = KELP_CUB.levelingConfig!.statGains!;
      expect(statGains[9].hp).toBe(8);
      expect(statGains[9].atk).toBe(8);
    });
  });
});
