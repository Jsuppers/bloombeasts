/**
 * Swift Wind - Buff Card
 *
 * IMAGE PROMPT:
 * "Swirling white and cyan wind currents forming a spiral pattern,
 * with small sparkles and air particles. Light and airy magical energy.
 * Fantasy card game art style, dynamic motion blur, square format 185x185px."
 */

import { BuffCard, Ability } from '../../types/core';
import {
  ResourceGainEffect,
  EffectType,
  AbilityTarget,
  ResourceType,
  StructuredAbility,
  AbilityTrigger,
} from '../../types/abilities';

// Gain 1 extra Nectar at the start of your turn
const nectarGeneration: ResourceGainEffect = {
  type: EffectType.GainResource,
  target: AbilityTarget.PlayerGardener,
  resource: ResourceType.Nectar,
  value: 1,
};

const swiftWindAbility: StructuredAbility = {
  name: 'Swift Wind',
  trigger: AbilityTrigger.OnOwnStartOfTurn, // Triggers at the start of your turn
  effects: [nectarGeneration]
};

export const SWIFT_WIND: BuffCard = {
  id: 'swift-wind',
  name: 'Swift Wind',
  type: 'Buff',
  affinity: 'Sky',
  cost: 2,
  abilities: [swiftWindAbility],
};
