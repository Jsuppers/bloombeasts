/**
 * Purify - Remove all negative counters from target unit
 */

import { MagicCard, Ability } from '../../types/core';
import { RemoveCounterEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const removeCounters: RemoveCounterEffect = {
  type: EffectType.RemoveCounter,
  target: AbilityTarget.Target
  // No specific counter type = removes all counters
};

const purifyAbility: StructuredAbility = {
  name: 'Purify',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [removeCounters]
};

export const PURIFY: MagicCard = {
  id: 'purify',
  name: 'Purify',
  type: 'Magic',
  cost: 1,
  abilities: [purifyAbility],
  targetRequired: true
};
