/**
 * Nature's Blessing - Buff Card
 *
 * IMAGE PROMPT:
 * "A soft green and golden magical glow with floating leaves, flowers, and sparkles.
 * Gentle healing energy emanating from a blooming flower in the center.
 * Fantasy card game art style, natural and peaceful colors, square format 185x185px."
 */

import { BuffCard, Ability } from '../../types/core';
import {
  HealEffect,
  EffectType,
  AbilityTarget,
  StructuredAbility,
  AbilityTrigger,
} from '../../types/abilities';

// Heal all your Beasts for 1 HP at the start of your turn
const healingAura: HealEffect = {
  type: EffectType.Heal,
  target: AbilityTarget.AllAllies,
  value: 1,
};

const naturesBlessingAbility: StructuredAbility = {
  name: "Nature's Blessing",
  trigger: AbilityTrigger.OnOwnStartOfTurn, // Triggers at the start of your turn
  effects: [healingAura]
};

export const NATURES_BLESSING: BuffCard = {
  id: 'natures-blessing',
  name: "Nature's Blessing",
  type: 'Buff',
  affinity: 'Forest',
  cost: 4,
  abilities: [naturesBlessingAbility],
};
