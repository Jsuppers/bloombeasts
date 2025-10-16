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

const nectarSurgeDraw: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

export const NECTAR_SURGE: MagicCard = {
  id: 'nectar-surge',
  name: 'Nectar Surge',
  type: 'Magic',
  cost: 1,
  effects: [gainNectar, nectarSurgeDraw],
  targetRequired: false
};