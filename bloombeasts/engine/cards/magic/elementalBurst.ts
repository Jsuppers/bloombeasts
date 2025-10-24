/**
 * Elemental Burst - Deal damage to all enemy units
 */

import { MagicCard, Ability } from '../../types/core';
import { DamageEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const burstDamage: DamageEffect = {
  type: EffectType.DealDamage,
  target: AbilityTarget.AllEnemies,
  value: 2
};

const elementalBurstAbility: StructuredAbility = {
  name: 'Elemental Burst',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [burstDamage]
};

export const ELEMENTAL_BURST: MagicCard = {
  id: 'elemental-burst',
  name: 'Elemental Burst',
  type: 'Magic',
  cost: 3,
  abilities: [elementalBurstAbility],
  targetRequired: false
};
