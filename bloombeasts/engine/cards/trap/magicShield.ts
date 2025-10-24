/**
 * Magic Shield - Counter opponent's magic card
 */

import { TrapCard, TrapTrigger, Ability } from '../../types/core';
import { NullifyEffectEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const nullifyMagic: NullifyEffectEffect = {
  type: EffectType.NullifyEffect,
  target: AbilityTarget.Target
};

const magicShieldAbility: StructuredAbility = {
  name: 'Magic Shield',
  trigger: AbilityTrigger.OnSummon, // Trap effects trigger when the trap is activated
  effects: [nullifyMagic]
};

export const MAGIC_SHIELD: TrapCard = {
  id: 'magic-shield',
  name: 'Magic Shield',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnMagicPlay
  },
  abilities: [magicShieldAbility]
};
