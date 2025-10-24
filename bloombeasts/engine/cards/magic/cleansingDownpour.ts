/**
 * Cleansing Downpour - Remove all counters from all beasts
 */

import { MagicCard, Ability } from '../../types/core';
import { RemoveCounterEffect, DrawCardEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const removeAllCounters: RemoveCounterEffect = {
  type: EffectType.RemoveCounter,
  target: AbilityTarget.AllUnits,  // All beasts on the field
  // No specific counter type means remove all counters
};

const cleansingDownpourDraw: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

const cleansingDownpourAbility: StructuredAbility = {
  name: 'Cleansing Downpour',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [removeAllCounters, cleansingDownpourDraw]
};

export const CLEANSING_DOWNPOUR: MagicCard = {
  id: 'cleansing-downpour',
  name: 'Cleansing Downpour',
  type: 'Magic',
  cost: 2,
  abilities: [cleansingDownpourAbility],
  targetRequired: false
};