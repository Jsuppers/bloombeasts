/**
 * Swift Wind - Buff Card
 *
 * IMAGE PROMPT:
 * "Swirling white and cyan wind currents forming a spiral pattern,
 * with small sparkles and air particles. Light and airy magical energy.
 * Fantasy card game art style, dynamic motion blur, square format 185x185px."
 */

import { BuffCard } from '../../types/core';
import {
  ResourceGainEffect,
  EffectType,
  AbilityTarget,
  ResourceType,
} from '../../types/abilities';

// Ongoing effect: Gain 1 extra Nectar at the start of your turn
// Note: This would require StartOfTurn trigger support in the buff system
const nectarGeneration: ResourceGainEffect = {
  type: EffectType.GainResource,
  target: AbilityTarget.Self,
  resource: ResourceType.Nectar,
  value: 1,
};

export const SWIFT_WIND: BuffCard = {
  id: 'swift-wind',
  name: 'Swift Wind',
  type: 'Buff',
  description: 'At the start of your turn, gain 1 Nectar.',
  affinity: 'Sky',
  cost: 2,
  ongoingEffects: [nectarGeneration],
};
