/**
 * Elemental Burst - Deal damage to all enemy units
 */

import { MagicCard } from '../../types/core';
import { DamageEffect, EffectType, AbilityTarget } from '../../types/abilities';

const burstDamage: DamageEffect = {
  type: EffectType.DealDamage,
  target: AbilityTarget.AllEnemies,
  value: 2
};

export const ELEMENTAL_BURST: MagicCard = {
  id: 'elemental-burst',
  name: 'Elemental Burst',
  type: 'Magic',
  cost: 3,
  effects: [burstDamage],
  targetRequired: false
};
