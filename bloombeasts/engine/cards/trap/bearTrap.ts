/**
 * Bear Trap - Damage attacker when triggered
 */

import { TrapCard, TrapTrigger, Ability } from '../../types/core';
import { DamageEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const trapDamage: DamageEffect = {
  type: EffectType.DealDamage,
  target: AbilityTarget.Attacker,
  value: 3
};

const bearTrapAbility: StructuredAbility = {
  name: 'Bear Trap',
  trigger: AbilityTrigger.OnSummon, // Trap effects trigger when the trap is activated
  effects: [trapDamage]
};

export const BEAR_TRAP: TrapCard = {
  id: 'bear-trap',
  name: 'Bear Trap',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnAttack
  },
  abilities: [bearTrapAbility]
};
