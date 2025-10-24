/**
 * Ancient Forest - Forest Habitat Card
 */

import { HabitatCard, Ability } from '../../types/core';
import {
  StatModificationEffect,
  RemoveCounterEffect,
  EffectType,
  AbilityTarget,
  StatType,
  EffectDuration,
  ConditionType,
  StructuredAbility,
  AbilityTrigger
} from '../../types/abilities';

// Ongoing effect: All Forest Beasts gain +0/+1
const forestBeastBonus: StatModificationEffect = {
  type: EffectType.ModifyStats,
  target: AbilityTarget.AllAllies,
  stat: StatType.Health,
  value: 1,
  duration: EffectDuration.WhileOnField,
  condition: {
    type: ConditionType.AffinityMatches,
    value: 'Forest'
  }
};

// On play: Remove Burn and Freeze counters
const removeBurnCounters: RemoveCounterEffect = {
  type: EffectType.RemoveCounter,
  target: AbilityTarget.AllUnits,
  counter: 'Burn'
};

const removeFreezeCounters: RemoveCounterEffect = {
  type: EffectType.RemoveCounter,
  target: AbilityTarget.AllUnits,
  counter: 'Freeze'
};

// Ongoing ability
const forestBonusAbility: StructuredAbility = {
  name: 'Forest Blessing',
  trigger: AbilityTrigger.Passive, // Ongoing effect
  effects: [forestBeastBonus]
};

// On play ability
const cleansingAbility: StructuredAbility = {
  name: 'Natural Cleansing',
  trigger: AbilityTrigger.OnSummon, // On play effect
  effects: [removeBurnCounters, removeFreezeCounters]
};

export const ANCIENT_FOREST: HabitatCard = {
  id: 'ancient-forest',
  name: 'Ancient Forest',
  type: 'Habitat',
  affinity: 'Forest',
  cost: 1,
  abilities: [forestBonusAbility, cleansingAbility]
};