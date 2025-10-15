/**
 * Leaf Sprite - Evasive attacker with resource generation
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, ResourceType, ImmunityType, EffectDuration } from '../../types/abilities';

const leafSpritePassive: StructuredAbility = {
  name: 'Evasive',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'piercing',
    },
  ],
};

const leafSpriteBloom: StructuredAbility = {
  name: 'Pollen Haste',
  trigger: AbilityTrigger.OnDestroy,
  effects: [
    {
      type: EffectType.GainResource,
      target: AbilityTarget.PlayerGardener,
      resource: ResourceType.ExtraNectarPlay,
      value: 1,
    },
  ],
};

// Level 4 upgrades
const leafSpriteBloom4: StructuredAbility = {
  name: 'Pollen Rush',
  trigger: AbilityTrigger.OnDestroy,
  effects: [
    {
      type: EffectType.GainResource,
      target: AbilityTarget.PlayerGardener,
      resource: ResourceType.ExtraNectarPlay,
      value: 2,
    },
  ],
};

// Level 7 upgrades
const leafSpritePassive7: StructuredAbility = {
  name: 'Master Evasion',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'piercing',
    },
    {
      type: EffectType.Immunity,
      target: AbilityTarget.Self,
      immuneTo: [ImmunityType.Targeting],
      duration: EffectDuration.WhileOnField,
    },
  ],
};

// Level 9 upgrades
const leafSpritePassive9: StructuredAbility = {
  name: 'Shadow Strike',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'attack-twice',
    },
    {
      type: EffectType.AttackModification,
      target: AbilityTarget.Self,
      modification: 'piercing',
    },
  ],
};

const leafSpriteBloom9: StructuredAbility = {
  name: 'Explosive Pollen',
  trigger: AbilityTrigger.OnDestroy,
  effects: [
    {
      type: EffectType.GainResource,
      target: AbilityTarget.PlayerGardener,
      resource: ResourceType.ExtraNectarPlay,
      value: 3,
    },
    {
      type: EffectType.DrawCards,
      target: AbilityTarget.PlayerGardener,
      value: 1,
    },
  ],
};

export const LEAF_SPRITE: BloomBeastCard = {
  id: 'leaf-sprite',
  name: 'Leaf Sprite',
  type: 'Bloom',
  affinity: 'Forest',
  cost: 2,
  baseAttack: 3,
  baseHealth: 2,
  abilities: [leafSpritePassive],
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 0, atk: 1 },
      3: { hp: 1, atk: 2 },
      4: { hp: 1, atk: 4 },
      5: { hp: 2, atk: 5 },
      6: { hp: 2, atk: 7 },
      7: { hp: 3, atk: 8 },
      8: { hp: 3, atk: 10 },
      9: { hp: 4, atk: 12 },
    },
    abilityUpgrades: {
      4: {
        abilities: [leafSpriteBloom4],
      },
      7: {
        abilities: [leafSpritePassive7],
      },
      9: {
        abilities: [leafSpritePassive9],
      },
    },
  },
};