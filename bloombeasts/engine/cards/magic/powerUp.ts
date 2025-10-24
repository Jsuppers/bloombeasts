/**
 * Power Up - Give target unit +3/+3
 */

import { MagicCard, Ability } from '../../types/core';
import { StatModificationEffect, EffectType, AbilityTarget, StatType, EffectDuration, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const powerUpBuffEffect: StatModificationEffect = {
  type: EffectType.ModifyStats,
  target: AbilityTarget.Target,
  stat: StatType.Both,
  value: 3,
  duration: EffectDuration.Permanent
};

const powerUpAbility: StructuredAbility = {
  name: 'Power Up',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [powerUpBuffEffect]
};

export const POWER_UP: MagicCard = {
  id: 'power-up',
  name: 'Power Up',
  type: 'Magic',
  cost: 2,
  abilities: [powerUpAbility],
  targetRequired: true
};
