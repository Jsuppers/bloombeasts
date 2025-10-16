/**
 * Vaporize - Destroy opponent's summoned bloom beast
 */

import { TrapCard, TrapTrigger, TrapConditionType } from '../../types/core';
import { DestroyEffect, EffectType, AbilityTarget } from '../../types/abilities';

const destroyBloom: DestroyEffect = {
  type: EffectType.Destroy,
  target: AbilityTarget.Target
};

export const VAPORIZE: TrapCard = {
  id: 'vaporize',
  name: 'Vaporize',
  type: 'Trap',
  cost: 2,
  activation: {
    trigger: TrapTrigger.OnBloomPlay,
    condition: {
      type: TrapConditionType.CostBelow,
      value: 4  // Only works on blooms with cost 3 or less
    }
  },
  effects: [destroyBloom]
};
