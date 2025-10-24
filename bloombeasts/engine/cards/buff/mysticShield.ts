/**
 * Mystic Shield - Buff Card
 *
 * IMAGE PROMPT:
 * "A shimmering blue and purple magical shield with arcane runes and symbols.
 * Protective energy barrier with geometric patterns and soft glowing edges.
 * Fantasy card game art style, magical defensive aura, square format 185x185px."
 */

import { BuffCard, Ability } from '../../types/core';
import {
  StatModificationEffect,
  EffectType,
  AbilityTarget,
  StatType,
  EffectDuration,
  StructuredAbility,
  AbilityTrigger,
} from '../../types/abilities';

// Ongoing effect: All your Beasts gain +2 Health
const defenseBoost: StatModificationEffect = {
  type: EffectType.ModifyStats,
  target: AbilityTarget.AllAllies,
  stat: StatType.Health,
  value: 2,
  duration: EffectDuration.WhileOnField,
};

const mysticShieldAbility: StructuredAbility = {
  name: 'Mystic Shield',
  trigger: AbilityTrigger.Passive, // Ongoing effect
  effects: [defenseBoost]
};

export const MYSTIC_SHIELD: BuffCard = {
  id: 'mystic-shield',
  name: 'Mystic Shield',
  type: 'Buff',
  cost: 3,
  abilities: [mysticShieldAbility],
};
