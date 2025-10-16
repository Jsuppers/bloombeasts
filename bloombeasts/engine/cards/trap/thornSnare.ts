/**
 * Thorn Snare - Prevent an attack and damage the attacker
 */

import { TrapCard, TrapTrigger } from '../../types/core';
import { PreventEffect, DamageEffect, EffectType, AbilityTarget, EffectDuration } from '../../types/abilities';

const preventAttack: PreventEffect = {
  type: EffectType.PreventAttack,
  target: AbilityTarget.Attacker,
  duration: EffectDuration.Instant
};

const snareDamage: DamageEffect = {
  type: EffectType.DealDamage,
  target: AbilityTarget.Attacker,
  value: 2
};

export const THORN_SNARE: TrapCard = {
  id: 'thorn-snare',
  name: 'Thorn Snare',
  type: 'Trap',
  cost: 2,
  activation: {
    trigger: TrapTrigger.OnAttack
  },
  effects: [preventAttack, snareDamage]
};
