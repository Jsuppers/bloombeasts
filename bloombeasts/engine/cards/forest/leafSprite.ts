/**
 * Leaf Sprite - Evasive attacker with resource generation
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, ResourceType, ImmunityType, EffectDuration } from '../../types/abilities';

const leafSpritePassive: StructuredAbility = {
  name: 'Evasive',
  description: 'Leaf Sprite can attack an opposing Bloom Beast directly, ignoring "Guard" or "Block" effects.',
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
  description: 'If Leaf Sprite destroys a Bloom Beast, immediately play one additional Nectar Card this turn.',
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
  description: 'If Leaf Sprite destroys a Bloom Beast, play 2 additional Nectar Cards this turn.',
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
  description: 'Leaf Sprite ignores all defensive abilities and can attack directly.',
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
  description: 'Leaf Sprite can attack twice per turn and ignores all defensive abilities.',
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
  description: 'When destroying a Bloom Beast, play 3 Nectar Cards and draw 1 card.',
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
  ability: leafSpritePassive,
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
        ability: leafSpriteBloom4,
      },
      7: {
        ability: leafSpritePassive7,
      },
      9: {
        ability: leafSpritePassive9,
      },
    },
  },
};