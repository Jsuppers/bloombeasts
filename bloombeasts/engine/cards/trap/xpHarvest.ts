/**
 * XP Harvest - Reduce attacker to level 1 when your unit is destroyed
 */

import { TrapCard, TrapTrigger } from '../../types/core';
import { RemoveCounterEffect, EffectType, AbilityTarget } from '../../types/abilities';

const removeXP: RemoveCounterEffect = {
  type: EffectType.RemoveCounter,
  target: AbilityTarget.Attacker,  // The unit that destroyed your unit
  counter: 'XP'  // Remove all XP counters, resetting to level 1
};

export const XP_HARVEST: TrapCard = {
  id: 'xp-harvest',
  name: 'XP Harvest',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnDestroy
  },
  effects: [removeXP]
};
