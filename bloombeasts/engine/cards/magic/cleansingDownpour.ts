/**
 * Cleansing Downpour - Remove all counters from all beasts
 */

import { MagicCard } from '../../types/core';
import { RemoveCounterEffect, DrawCardEffect, EffectType, AbilityTarget } from '../../types/abilities';

const removeAllCounters: RemoveCounterEffect = {
  type: EffectType.RemoveCounter,
  target: AbilityTarget.AllUnits,  // All beasts on the field
  // No specific counter type means remove all counters
};

const drawCard: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

export const CLEANSING_DOWNPOUR: MagicCard = {
  id: 'cleansing-downpour',
  name: 'Cleansing Downpour',
  type: 'Magic',
  description: 'Remove all counters from all beasts and draw 1 card.',
  cost: 2,
  effects: [removeAllCounters, drawCard],
  targetRequired: false
};