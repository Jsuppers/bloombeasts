/**
 * Deep Sea Grotto - Water Habitat Card
 */

import { HabitatCard } from '../../types/core';
import {
  StatModificationEffect,
  EffectType,
  AbilityTarget,
  StatType,
  EffectDuration,
  ConditionType
} from '../../types/abilities';

// Ongoing effect: All Water Beasts gain +1 Attack
const waterBeastBonus: StatModificationEffect = {
  type: EffectType.ModifyStats,
  target: AbilityTarget.AllAllies,
  stat: StatType.Attack,
  value: 1,
  duration: EffectDuration.WhileOnField,
  condition: {
    type: ConditionType.AffinityMatches,
    value: 'Water'
  }
};

export const DEEP_SEA_GROTTO: HabitatCard = {
  id: 'deep-sea-grotto',
  name: 'Deep Sea Grotto',
  type: 'Habitat',
  description: 'Water Beasts gain +1 Attack.',
  affinity: 'Water',
  cost: 1,
  ongoingEffects: [waterBeastBonus],
  onPlayEffects: []
};