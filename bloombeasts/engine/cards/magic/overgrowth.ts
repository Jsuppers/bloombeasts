/**
 * Overgrowth - Give all allies +2/+2
 */

import { MagicCard } from '../../types/core';
import { StatModificationEffect, EffectType, AbilityTarget, StatType, EffectDuration } from '../../types/abilities';

const buffEffect: StatModificationEffect = {
  type: EffectType.ModifyStats,
  target: AbilityTarget.AllAllies,
  stat: StatType.Both,
  value: 2,
  duration: EffectDuration.Permanent
};

export const OVERGROWTH: MagicCard = {
  id: 'overgrowth',
  name: 'Overgrowth',
  type: 'Magic',
  cost: 3,
  effects: [buffEffect],
  targetRequired: false
};
