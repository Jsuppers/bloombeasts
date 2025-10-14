/**
 * Charcoil - Defensive creature with retaliation
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, ImmunityType, EffectDuration } from '../../types/abilities';
import { CardBuilder } from '../CardBuilder';

const charcoilPassive: StructuredAbility = {
  name: 'Sooty Defense',
  description: 'If Charcoil is targeted by a Magic Card, place a "Soot" counter on the Magic Card.',
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
  description: 'When Charcoil is attacked, if it survives, return 1 damage to the attacking Bloom Beast.',
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
  description: 'When attacked and survives, return 2 damage and apply 1 Burn counter to attacker.',
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
  description: 'If targeted by Magic or Trap, nullify it and place 2 Soot counters.',
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
  description: 'Immune to Magic and Trap cards. When targeted by anything, place 3 Burn counters on the source.',
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
  description: 'When attacked, reflect all damage back to attacker and apply 2 Burn counters.',
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
  .ability(charcoilBloom)
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
        ability: charcoilBloom4,
      },
      7: {
        ability: charcoilPassive7,
      },
      9: {
        ability: charcoilPassive9,
      },
    },
  })
  .build();