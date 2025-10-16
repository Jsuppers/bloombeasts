/**
 * Power Up - Give target unit +3/+3
 */

import { MagicCard } from '../../types/core';
import { StatModificationEffect, EffectType, AbilityTarget, StatType, EffectDuration } from '../../types/abilities';

const buffEffect: StatModificationEffect = {
  type: EffectType.ModifyStats,
  target: AbilityTarget.Target,
  stat: StatType.Both,
  value: 3,
  duration: EffectDuration.Permanent
};

export const POWER_UP: MagicCard = {
  id: 'power-up',
  name: 'Power Up',
  type: 'Magic',
  cost: 2,
  effects: [buffEffect],
  targetRequired: true
};
