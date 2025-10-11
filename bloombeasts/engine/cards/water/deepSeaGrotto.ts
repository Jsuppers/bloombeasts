/**
 * Deep Sea Grotto - Water Habitat Card
 */

import { HabitatCard } from '../../types/core';

export const DEEP_SEA_GROTTO: HabitatCard = {
  id: 'deep-sea-grotto',
  name: 'Deep Sea Grotto',
  type: 'Habitat',
  affinity: 'Water',
  cost: 1,
  // TODO: Add ongoingEffects to increase cost of non-Water beasts
  // This requires a new effect type for modifying card costs
  ongoingEffects: []
};