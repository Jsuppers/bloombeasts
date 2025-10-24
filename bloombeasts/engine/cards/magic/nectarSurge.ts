/**
 * Nectar Surge - Draw and temporary nectar
 */

import { MagicCard, Ability } from '../../types/core';
import { ResourceGainEffect, DrawCardEffect, EffectType, AbilityTarget, ResourceType, EffectDuration, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const gainNectar: ResourceGainEffect = {
  type: EffectType.GainResource,
  target: AbilityTarget.PlayerGardener,
  resource: ResourceType.Nectar,
  value: 3,
  duration: EffectDuration.ThisTurn
};

const nectarSurgeDraw: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

const nectarSurgeAbility: StructuredAbility = {
  name: 'Nectar Surge',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [gainNectar, nectarSurgeDraw]
};

export const NECTAR_SURGE: MagicCard = {
  id: 'nectar-surge',
  name: 'Nectar Surge',
  type: 'Magic',
  cost: 1,
  abilities: [nectarSurgeAbility],
  targetRequired: false
};