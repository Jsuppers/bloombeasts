/**
 * Magmite - Tanky finisher with death effect
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, EffectDuration, ConditionType, Comparison } from '../../types/abilities';
import { CardBuilder } from '../CardBuilder';

const magmitePassive: StructuredAbility = {
  name: 'Hardened Shell',
  description: 'Magmite takes 1 less damage from all sources.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.DamageReduction,
      target: AbilityTarget.Self,
      value: 1,
      duration: EffectDuration.WhileOnField,
    },
  ],
};

const magmiteBloom: StructuredAbility = {
  name: 'Volcanic Burst',
  description: "When Magmite is destroyed, deal 3 damage to the opponent's Gardener.",
  trigger: AbilityTrigger.OnDestroy,
  effects: [
    {
      type: EffectType.DealDamage,
      target: AbilityTarget.OpponentGardener,
      value: 3,
    },
  ],
};

// Level 4 upgrades
const magmitePassive4: StructuredAbility = {
  name: 'Molten Armor',
  description: 'Magmite takes 2 less damage from all sources.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.DamageReduction,
      target: AbilityTarget.Self,
      value: 2,
      duration: EffectDuration.WhileOnField,
    },
  ],
};

// Level 7 upgrades
const magmiteBloom7: StructuredAbility = {
  name: 'Eruption',
  description: "When destroyed, deal 5 damage to opponent Gardener and 2 damage to all opponent Bloom Beasts.",
  trigger: AbilityTrigger.OnDestroy,
  effects: [
    {
      type: EffectType.DealDamage,
      target: AbilityTarget.OpponentGardener,
      value: 5,
    },
    {
      type: EffectType.DealDamage,
      target: AbilityTarget.AllEnemies,
      value: 2,
    },
  ],
};

// Level 9 upgrades
const magmitePassive9: StructuredAbility = {
  name: 'Obsidian Carapace',
  description: 'Takes 3 less damage. When attacked, deal 2 damage to attacker.',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.DamageReduction,
      target: AbilityTarget.Self,
      value: 3,
      duration: EffectDuration.WhileOnField,
    },
    {
      type: EffectType.Retaliation,
      target: AbilityTarget.Attacker,
      value: 2,
    },
  ],
};

const magmiteBloom9: StructuredAbility = {
  name: 'Cataclysm',
  description: "When destroyed, deal 8 damage to opponent Gardener and destroy all Bloom Beasts with 3 HP or less.",
  trigger: AbilityTrigger.OnDestroy,
  effects: [
    {
      type: EffectType.DealDamage,
      target: AbilityTarget.OpponentGardener,
      value: 8,
    },
    {
      type: EffectType.Destroy,
      target: AbilityTarget.AllEnemies,
      condition: {
        type: ConditionType.HealthBelow,
        value: 4,
        comparison: Comparison.Less,
      },
    },
  ],
};

export const MAGMITE: BloomBeastCard = CardBuilder.bloomBeast('magmite', 'Magmite')
  .affinity('Fire')
  .cost(3)
  .stats(4, 6)
  .ability(magmitePassive)
  .leveling({
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 2, atk: 1 },
      3: { hp: 3, atk: 2 },
      4: { hp: 5, atk: 3 },
      5: { hp: 7, atk: 4 },
      6: { hp: 9, atk: 5 },
      7: { hp: 11, atk: 6 },
      8: { hp: 13, atk: 7 },
      9: { hp: 15, atk: 9 },
    },
    abilityUpgrades: {
      4: {
        ability: magmitePassive4,
      },
      7: {
        ability: magmiteBloom7,
      },
      9: {
        ability: magmitePassive9,
      },
    },
  })
  .build();