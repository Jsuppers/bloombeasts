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
// TODO: Need to add ConditionType.AffinityNotMatches or handle negation
// For now, this will be handled in the game engine logic
const damageNonFire: DamageEffect = {
  type: EffectType.DealDamage,
  target: AbilityTarget.AllUnits,
  value: 1
  // condition should exclude Fire affinity beasts
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