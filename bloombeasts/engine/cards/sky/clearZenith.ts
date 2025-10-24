/**
 * Clear Zenith - Sky Habitat Card
 */

import { HabitatCard, Ability } from '../../types/core';
import {
  DrawCardEffect,
  EffectType,
  AbilityTarget,
  StructuredAbility,
  AbilityTrigger
} from '../../types/abilities';

// On play effect: Draw 1 card
const clearZenithDraw: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

const skyDrawAbility: StructuredAbility = {
  name: 'Sky Vision',
  trigger: AbilityTrigger.OnSummon, // On play effect
  effects: [clearZenithDraw]
};

export const CLEAR_ZENITH: HabitatCard = {
  id: 'clear-zenith',
  name: 'Clear Zenith',
  type: 'Habitat',
  affinity: 'Sky',
  cost: 1,
  titleColor: '#000000',  // Black title for better contrast on light background
  abilities: [skyDrawAbility]
};