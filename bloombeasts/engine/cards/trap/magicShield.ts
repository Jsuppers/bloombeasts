/**
 * Magic Shield - Counter opponent's magic card
 */

import { TrapCard, TrapTrigger } from '../../types/core';
import { NullifyEffectEffect, EffectType, AbilityTarget } from '../../types/abilities';

const nullifyMagic: NullifyEffectEffect = {
  type: EffectType.NullifyEffect,
  target: AbilityTarget.Target
};

export const MAGIC_SHIELD: TrapCard = {
  id: 'magic-shield',
  name: 'Magic Shield',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnMagicPlay
  },
  effects: [nullifyMagic]
};
