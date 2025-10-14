/**
 * Volcanic Scar - Fire Habitat Card
 */

import { HabitatCard } from '../../types/core';
import {
  DamageEffect,
  EffectType,
  AbilityTarget,
  ConditionType
} from '../../types/abilities';

// On play effect: Deal 1 damage to all non-Fire beasts
const damageNonFire: DamageEffect = {
  type: EffectType.DealDamage,
  target: AbilityTarget.AllUnits,
  value: 1,
  condition: {
    type: 'affinity-not-matches' as any, // Exclude Fire affinity beasts
    value: 'Fire'
  }
};

export const VOLCANIC_SCAR: HabitatCard = {
  id: 'volcanic-scar',
  name: 'Volcanic Scar',
  type: 'Habitat',
  affinity: 'Fire',
  cost: 1,
  onPlayEffects: [damageNonFire],
  ongoingEffects: []
};