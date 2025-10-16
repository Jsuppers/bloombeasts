/**
 * Bear Trap - Damage attacker when triggered
 */

import { TrapCard, TrapTrigger } from '../../types/core';
import { DamageEffect, EffectType, AbilityTarget } from '../../types/abilities';

const trapDamage: DamageEffect = {
  type: EffectType.DealDamage,
  target: AbilityTarget.Attacker,
  value: 3
};

export const BEAR_TRAP: TrapCard = {
  id: 'bear-trap',
  name: 'Bear Trap',
  type: 'Trap',
  cost: 1,
  activation: {
    trigger: TrapTrigger.OnAttack
  },
  effects: [trapDamage]
};
