/**
 * Emergency Bloom - Draw cards when your unit is destroyed
 */

import { TrapCard, TrapTrigger } from '../../types/core';
import { DrawCardEffect, EffectType, AbilityTarget } from '../../types/abilities';

const drawCards: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 2
};

export const EMERGENCY_BLOOM: TrapCard = {
  id: 'emergency-bloom',
  name: 'Emergency Bloom',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnDestroy
  },
  effects: [drawCards]
};
