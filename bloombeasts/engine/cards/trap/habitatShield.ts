/**
 * Habitat Shield - Counter opponent's habitat and draw a card
 */

import { TrapCard, TrapTrigger, Ability } from '../../types/core';
import { NullifyEffectEffect, DrawCardEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const nullifyHabitat: NullifyEffectEffect = {
  type: EffectType.NullifyEffect,
  target: AbilityTarget.Target
};

const drawCard: DrawCardEffect = {
  type: EffectType.DrawCards,
  target: AbilityTarget.PlayerGardener,
  value: 1
};

const habitatShieldAbility: StructuredAbility = {
  name: 'Habitat Shield',
  trigger: AbilityTrigger.OnSummon, // Trap effects trigger when the trap is activated
  effects: [nullifyHabitat, drawCard]
};

export const HABITAT_SHIELD: TrapCard = {
  id: 'habitat-shield',
  name: 'Habitat Shield',
  type: 'Trap',
  cost: 2,
  activation: {
    trigger: TrapTrigger.OnHabitatPlay
  },
  abilities: [habitatShieldAbility]
};
