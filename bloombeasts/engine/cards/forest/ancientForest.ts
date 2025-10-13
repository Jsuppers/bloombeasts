/**
 * Ancient Forest - Forest Habitat Card
 */

import { HabitatCard } from '../../types/core';
import {
  StatModificationEffect,
  RemoveCounterEffect,
  EffectType,
  AbilityTarget,
  StatType,
  EffectDuration,
  ConditionType
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

export const ANCIENT_FOREST: HabitatCard = {
  id: 'ancient-forest',
  name: 'Ancient Forest',
  type: 'Habitat',
  level: 1,
  description: 'Forest Beasts gain +1 Health. Removes Burn and Freeze counters when played.',
  affinity: 'Forest',
  cost: 1,
  ongoingEffects: [forestBeastBonus],
  onPlayEffects: [removeBurnCounters, removeFreezeCounters]
};