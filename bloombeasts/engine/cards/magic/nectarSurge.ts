/**
 * Nectar Surge - Draw and temporary nectar
 */

import { MagicCard } from '../../types/core';
import { ResourceGainEffect, DrawCardEffect, EffectType, AbilityTarget, ResourceType, EffectDuration } from '../../types/abilities';

const gainNectar: ResourceGainEffect = {
  type: EffectType.GainResource,
  target: AbilityTarget.PlayerGardener,
  resource: ResourceType.Nectar,
  value: 3,
  duration: EffectDuration.ThisTurn
};

const drawCard: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

export const NECTAR_SURGE: MagicCard = {
  id: 'nectar-surge',
  name: 'Nectar Surge',
  type: 'Magic',
  level: 1,
  description: 'Gain 3 temporary Nectar this turn and draw 1 card.',
  cost: 1,
  effects: [gainNectar, drawCard],
  targetRequired: false
};