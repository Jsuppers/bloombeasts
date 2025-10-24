/**
 * Overgrowth - Give all allies +2/+2
 */

import { MagicCard, Ability } from '../../types/core';
import { StatModificationEffect, EffectType, AbilityTarget, StatType, EffectDuration, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const overgrowthBuffEffect: StatModificationEffect = {
  type: EffectType.ModifyStats,
  target: AbilityTarget.AllAllies,
  stat: StatType.Both,
  value: 2,
  duration: EffectDuration.Permanent
};

const overgrowthAbility: StructuredAbility = {
  name: 'Overgrowth',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [overgrowthBuffEffect]
};

export const OVERGROWTH: MagicCard = {
  id: 'overgrowth',
  name: 'Overgrowth',
  type: 'Magic',
  cost: 3,
  abilities: [overgrowthAbility],
  targetRequired: false
};
