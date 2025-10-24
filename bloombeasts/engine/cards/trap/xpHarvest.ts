/**
 * XP Harvest - Reduce attacker to level 1 when your unit is destroyed
 */

import { TrapCard, TrapTrigger, Ability } from '../../types/core';
import { RemoveCounterEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const removeXP: RemoveCounterEffect = {
  type: EffectType.RemoveCounter,
  target: AbilityTarget.Attacker,  // The unit that destroyed your unit
  counter: 'XP'  // Remove all XP counters, resetting to level 1
};

const xpHarvestAbility: StructuredAbility = {
  name: 'XP Harvest',
  trigger: AbilityTrigger.OnSummon, // Trap effects trigger when the trap is activated
  effects: [removeXP]
};

export const XP_HARVEST: TrapCard = {
  id: 'xp-harvest',
  name: 'XP Harvest',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnDestroy
  },
  abilities: [xpHarvestAbility]
};
