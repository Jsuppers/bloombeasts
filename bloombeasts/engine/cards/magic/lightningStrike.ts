/**
 * Lightning Strike - Deal high damage to a single target
 */

import { MagicCard, Ability } from '../../types/core';
import { DamageEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const strikeDamage: DamageEffect = {
  type: EffectType.DealDamage,
  target: AbilityTarget.Target,
  value: 5,
  piercing: true  // Piercing damage ignores shields
};

const lightningStrikeAbility: StructuredAbility = {
  name: 'Lightning Strike',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [strikeDamage]
};

export const LIGHTNING_STRIKE: MagicCard = {
  id: 'lightning-strike',
  name: 'Lightning Strike',
  type: 'Magic',
  cost: 2,
  abilities: [lightningStrikeAbility],
  targetRequired: true
};
