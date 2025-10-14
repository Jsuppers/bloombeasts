/**
 * Nature's Blessing - Buff Card
 *
 * IMAGE PROMPT:
 * "A soft green and golden magical glow with floating leaves, flowers, and sparkles.
 * Gentle healing energy emanating from a blooming flower in the center.
 * Fantasy card game art style, natural and peaceful colors, square format 185x185px."
 */

import { BuffCard } from '../../types/core';
import {
  HealEffect,
  EffectType,
  AbilityTarget,
} from '../../types/abilities';

// Ongoing effect: Heal all your Beasts for 1 HP at the start of your turn
// Note: This would require StartOfTurn trigger support in the buff system
const healingAura: HealEffect = {
  type: EffectType.Heal,
  target: AbilityTarget.AllAllies,
  value: 1,
};

export const NATURES_BLESSING: BuffCard = {
  id: 'natures-blessing',
  name: "Nature's Blessing",
  type: 'Buff',
  description: 'At the start of your turn, heal all your Beasts for 1 HP.',
  affinity: 'Forest',
  cost: 4,
  ongoingEffects: [healingAura],
};
