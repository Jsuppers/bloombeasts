/**
 * Habitat Shield - Counter opponent's habitat and draw a card
 */

import { TrapCard, TrapTrigger } from '../../types/core';
import { NullifyEffectEffect, DrawCardEffect, EffectType, AbilityTarget } from '../../types/abilities';

const nullifyHabitat: NullifyEffectEffect = {
  type: EffectType.NullifyEffect,
  target: AbilityTarget.Target
};

const drawCard: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

export const HABITAT_SHIELD: TrapCard = {
  id: 'habitat-shield',
  name: 'Habitat Shield',
  type: 'Trap',
  cost: 2,
  activation: {
    trigger: TrapTrigger.OnHabitatPlay
  },
  effects: [nullifyHabitat, drawCard]
};
