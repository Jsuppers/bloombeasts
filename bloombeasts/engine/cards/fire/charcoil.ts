/**
 * Charcoil - Defensive creature with retaliation
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, ImmunityType, EffectDuration } from '../../types/abilities';
import { CardBuilder } from '../CardBuilder';

const charcoilPassive: StructuredAbility = {
  name: 'Sooty Defense',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Target,
      counter: 'Soot',
      value: 1,
    },
  ],
};

const charcoilBloom: StructuredAbility = {
  name: 'Flame Retaliation',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.Retaliation,
      target: AbilityTarget.Attacker,
      value: 1,
    },
  ],
};

// Level 4 upgrades
const charcoilBloom4: StructuredAbility = {
  name: 'Burning Retaliation',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.Retaliation,
      target: AbilityTarget.Attacker,
      value: 2,
    },
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Attacker,
      counter: 'Burn',
      value: 1,
    },
  ],
};

// Level 7 upgrades
const charcoilPassive7: StructuredAbility = {
  name: 'Smoke Screen',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.Immunity,
      target: AbilityTarget.Self,
      immuneTo: [ImmunityType.Magic, ImmunityType.Trap],
      duration: EffectDuration.WhileOnField,
    },
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Target,
      counter: 'Soot',
      value: 2,
    },
  ],
};

// Level 9 upgrades
const charcoilPassive9: StructuredAbility = {
  name: 'Blazing Vengeance',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.Immunity,
      target: AbilityTarget.Self,
      immuneTo: [ImmunityType.Magic, ImmunityType.Trap],
      duration: EffectDuration.WhileOnField,
    },
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Attacker,
      counter: 'Burn',
      value: 3,
    },
  ],
};

const charcoilBloom9: StructuredAbility = {
  name: 'Infernal Reflection',
  trigger: AbilityTrigger.OnDamage,
  effects: [
    {
      type: EffectType.Retaliation,
      target: AbilityTarget.Attacker,
      value: 'reflected',
    },
    {
      type: EffectType.ApplyCounter,
      target: AbilityTarget.Attacker,
      counter: 'Burn',
      value: 2,
    },
  ],
};

export const CHARCOIL: BloomBeastCard = CardBuilder.bloomBeast('charcoil', 'Charcoil')
  .affinity('Fire')
  .cost(2)
  .stats(3, 4)
  .abilities([charcoilBloom])
  .leveling({
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 1, atk: 1 },
      3: { hp: 2, atk: 2 },
      4: { hp: 4, atk: 3 },
      5: { hp: 5, atk: 4 },
      6: { hp: 6, atk: 5 },
      7: { hp: 8, atk: 6 },
      8: { hp: 9, atk: 7 },
      9: { hp: 11, atk: 8 },
    },
    abilityUpgrades: {
      4: {
        abilities: [charcoilBloom4],
      },
      7: {
        abilities: [charcoilPassive7],
      },
      9: {
        abilities: [charcoilPassive9],
      },
    },
  })
  .build();