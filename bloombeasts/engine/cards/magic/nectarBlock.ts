/**
 * Nectar Block - Basic resource generation magic card
 */

import { MagicCard } from '../../types/core';
import { ResourceGainEffect, EffectType, AbilityTarget, ResourceType, EffectDuration } from '../../types/abilities';

const nectarGainEffect: ResourceGainEffect = {
  type: EffectType.GainResource,
  target: AbilityTarget.PlayerGardener,
  resource: ResourceType.Nectar,
  value: 2,  // Gain 2 temporary nectar this turn
  duration: EffectDuration.ThisTurn
};

export const NECTAR_BLOCK: MagicCard = {
  id: 'nectar-block',
  name: 'Nectar Block',
  type: 'Magic',
  cost: 0,
  effects: [nectarGainEffect],
  targetRequired: false  // No target needed, automatically applies to player
};