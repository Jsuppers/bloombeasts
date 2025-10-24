/**
 * Emergency Bloom - Draw cards when your unit is destroyed
 */

import { TrapCard, TrapTrigger, Ability } from '../../types/core';
import { DrawCardEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const drawCards: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 2
};

const emergencyBloomAbility: StructuredAbility = {
  name: 'Emergency Bloom',
  trigger: AbilityTrigger.OnSummon, // Trap effects trigger when the trap is activated
  effects: [drawCards]
};

export const EMERGENCY_BLOOM: TrapCard = {
  id: 'emergency-bloom',
  name: 'Emergency Bloom',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnDestroy
  },
  abilities: [emergencyBloomAbility]
};
