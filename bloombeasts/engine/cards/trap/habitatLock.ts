/**
 * Habitat Lock - Counter habitat play
 */

import { TrapCard, TrapTrigger } from '../../types/core';
import { NullifyEffectEffect, EffectType, AbilityTarget } from '../../types/abilities';

const counterHabitatEffect: NullifyEffectEffect = {
  type: EffectType.NullifyEffect,
  target: AbilityTarget.Target,  // The habitat card being played
};

export const HABITAT_LOCK: TrapCard = {
  id: 'habitat-lock',
  name: 'Habitat Lock',
  description: 'Counter habitat play.',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnHabitatPlay
  },
  effects: [counterHabitatEffect]
};