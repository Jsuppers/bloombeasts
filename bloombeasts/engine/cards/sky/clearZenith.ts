/**
 * Clear Zenith - Sky Habitat Card
 */

import { HabitatCard } from '../../types/core';
import {
  DrawCardEffect,
  EffectType,
  AbilityTarget
} from '../../types/abilities';

// On play effect: Draw 1 card
const drawCard: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

export const CLEAR_ZENITH: HabitatCard = {
  id: 'clear-zenith',
  name: 'Clear Zenith',
  type: 'Habitat',
  affinity: 'Sky',
  cost: 1,
  titleColor: '#000000',  // Black title for better contrast on light background
  onPlayEffects: [drawCard],
  ongoingEffects: []
};