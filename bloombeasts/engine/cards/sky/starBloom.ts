/**
 * Star Bloom - Team buffer with deck search
 */

import { BloomBeastCard } from '../../types/core';
import { StructuredAbility, EffectType, AbilityTarget, AbilityTrigger, StatType, EffectDuration } from '../../types/abilities';

const starBloomPassive: StructuredAbility = {
  name: 'Aura',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AllAllies,
      stat: StatType.Attack,
      value: 1,
      duration: EffectDuration.WhileOnField,
    },
  ],
};

const starBloomBloom: StructuredAbility = {
  name: 'Celestial Alignment',
  trigger: AbilityTrigger.Activated,
  maxUsesPerGame: 1,
  effects: [
    {
      type: EffectType.SearchDeck,
      target: AbilityTarget.PlayerGardener,
      searchFor: 'bloom',
      quantity: 1,
    },
  ],
};

// Level 4 upgrades
const starBloomPassive4: StructuredAbility = {
  name: 'Radiant Aura',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AllAllies,
      stat: StatType.Attack,
      value: 2,
      duration: EffectDuration.WhileOnField,
    },
  ],
};

// Level 7 upgrades
const starBloomBloom7: StructuredAbility = {
  name: 'Cosmic Guidance',
  trigger: AbilityTrigger.Activated,
  maxUsesPerTurn: 1,
  effects: [
    {
      type: EffectType.SearchDeck,
      target: AbilityTarget.PlayerGardener,
      searchFor: 'any',
      quantity: 1,
    },
  ],
};

// Level 9 upgrades
const starBloomPassive9: StructuredAbility = {
  name: 'Astral Dominance',
  trigger: AbilityTrigger.Passive,
  effects: [
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AllAllies,
      stat: StatType.Attack,
      value: 3,
      duration: EffectDuration.WhileOnField,
    },
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AllAllies,
      stat: StatType.Health,
      value: 2,
      duration: EffectDuration.WhileOnField,
    },
  ],
};

const starBloomBloom9: StructuredAbility = {
  name: 'Universal Harmony',
  trigger: AbilityTrigger.Activated,
  effects: [
    {
      type: EffectType.DrawCards,
      target: AbilityTarget.PlayerGardener,
      value: 3,
    },
    {
      type: EffectType.SearchDeck,
      target: AbilityTarget.PlayerGardener,
      searchFor: 'any',
      quantity: 2,
    },
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AllAllies,
      stat: StatType.Attack,
      value: 2,
      duration: EffectDuration.Permanent,
    },
    {
      type: EffectType.ModifyStats,
      target: AbilityTarget.AllAllies,
      stat: StatType.Health,
      value: 2,
      duration: EffectDuration.Permanent,
    },
  ],
};

export const STAR_BLOOM: BloomBeastCard = {
  id: 'star-bloom',
  name: 'Star Bloom',
  type: 'Bloom',
  affinity: 'Sky',
  cost: 3,
  baseAttack: 4,
  baseHealth: 5,
  ability: starBloomPassive,
  levelingConfig: {
    statGains: {
      1: { hp: 0, atk: 0 },
      2: { hp: 1, atk: 1 },
      3: { hp: 2, atk: 2 },
      4: { hp: 4, atk: 3 },
      5: { hp: 6, atk: 4 },
      6: { hp: 8, atk: 5 },
      7: { hp: 10, atk: 6 },
      8: { hp: 12, atk: 7 },
      9: { hp: 14, atk: 9 },
    },
    abilityUpgrades: {
      4: {
        ability: starBloomPassive4,
      },
      7: {
        ability: starBloomBloom7,
      },
      9: {
        ability: starBloomPassive9,
      },
    },
  },
};