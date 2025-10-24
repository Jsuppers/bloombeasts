/**
 * Habitat Lock - Counter habitat play
 */

import { TrapCard, TrapTrigger, Ability } from '../../types/core';
import { NullifyEffectEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const counterHabitatEffect: NullifyEffectEffect = {
  type: EffectType.NullifyEffect,
  target: AbilityTarget.Target,  // The habitat card being played
};

const habitatLockAbility: StructuredAbility = {
  name: 'Habitat Lock',
  trigger: AbilityTrigger.OnSummon, // Trap effects trigger when the trap is activated
  effects: [counterHabitatEffect]
};

export const HABITAT_LOCK: TrapCard = {
  id: 'habitat-lock',
  name: 'Habitat Lock',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnHabitatPlay
  },
  abilities: [habitatLockAbility]
};