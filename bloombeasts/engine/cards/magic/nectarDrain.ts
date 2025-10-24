/**
 * Nectar Drain - Drain nectar from opponent
 */

import { MagicCard, Ability } from '../../types/core';
import { ResourceGainEffect, DrawCardEffect, EffectType, AbilityTarget, ResourceType, EffectDuration, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const drainEffect: ResourceGainEffect = {
  type: EffectType.GainResource,
  target: AbilityTarget.PlayerGardener,
  resource: ResourceType.Nectar,
  value: 2,
  duration: EffectDuration.ThisTurn
};

const drawEffect: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

const nectarDrainAbility: StructuredAbility = {
  name: 'Nectar Drain',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [drainEffect, drawEffect]
};

export const NECTAR_DRAIN: MagicCard = {
  id: 'nectar-drain',
  name: 'Nectar Drain',
  type: 'Magic',
  cost: 1,
  abilities: [nectarDrainAbility],
  targetRequired: false
};
