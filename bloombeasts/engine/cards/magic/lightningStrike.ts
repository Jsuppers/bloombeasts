/**
 * Lightning Strike - Deal high damage to a single target
 */

import { MagicCard } from '../../types/core';
import { DamageEffect, EffectType, AbilityTarget } from '../../types/abilities';

const strikeDamage: DamageEffect = {
  type: EffectType.DealDamage,
  target: AbilityTarget.Target,
  value: 5,
  piercing: true  // Piercing damage ignores shields
};

export const LIGHTNING_STRIKE: MagicCard = {
  id: 'lightning-strike',
  name: 'Lightning Strike',
  type: 'Magic',
  cost: 2,
  effects: [strikeDamage],
  targetRequired: true
};
