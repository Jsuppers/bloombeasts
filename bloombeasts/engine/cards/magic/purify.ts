/**
 * Purify - Remove all negative counters from target unit
 */

import { MagicCard } from '../../types/core';
import { RemoveCounterEffect, EffectType, AbilityTarget } from '../../types/abilities';

const removeCounters: RemoveCounterEffect = {
  type: EffectType.RemoveCounter,
  target: AbilityTarget.Target
  // No specific counter type = removes all counters
};

export const PURIFY: MagicCard = {
  id: 'purify',
  name: 'Purify',
  type: 'Magic',
  cost: 1,
  effects: [removeCounters],
  targetRequired: true
};
