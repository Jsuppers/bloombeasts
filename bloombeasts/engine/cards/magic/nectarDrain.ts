/**
 * Nectar Drain - Drain nectar from opponent
 */

import { MagicCard } from '../../types/core';
import { ResourceGainEffect, DrawCardEffect, EffectType, AbilityTarget, ResourceType, EffectDuration } from '../../types/abilities';

const drainEffect: ResourceGainEffect = {
  type: EffectType.GainResource,
  target: AbilityTarget.PlayerGardener,
  resource: ResourceType.Nectar,
  value: 2,
  duration: EffectDuration.ThisTurn
};

const drawEffect: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

export const NECTAR_DRAIN: MagicCard = {
  id: 'nectar-drain',
  name: 'Nectar Drain',
  type: 'Magic',
  cost: 1,
  effects: [drainEffect, drawEffect],
  targetRequired: false
};
