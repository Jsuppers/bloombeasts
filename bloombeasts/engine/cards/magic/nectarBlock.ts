/**
 * Nectar Block - Basic resource generation magic card
 */

import { MagicCard, Ability } from '../../types/core';
import { ResourceGainEffect, EffectType, AbilityTarget, ResourceType, EffectDuration, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const nectarGainEffect: ResourceGainEffect = {
  type: EffectType.GainResource,
  target: AbilityTarget.PlayerGardener,
  resource: ResourceType.Nectar,
  value: 2,  // Gain 2 temporary nectar this turn
  duration: EffectDuration.ThisTurn
};

const nectarBlockAbility: StructuredAbility = {
  name: 'Nectar Block',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [nectarGainEffect]
};

export const NECTAR_BLOCK: MagicCard = {
  id: 'nectar-block',
  name: 'Nectar Block',
  type: 'Magic',
  cost: 0,
  abilities: [nectarBlockAbility],
  targetRequired: false  // No target needed, automatically applies to player
};