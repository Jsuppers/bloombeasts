/**
 * Battle Fury - Buff Card
 *
 * IMAGE PROMPT:
 * "A glowing red and orange magical aura with flames and energy swirls,
 * centered on a raised fist symbol. Dynamic, aggressive energy radiating outward.
 * Fantasy card game art style, vibrant colors, square format 185x185px."
 */

import { BuffCard } from '../../types/core';
import {
  StatModificationEffect,
  EffectType,
  AbilityTarget,
  StatType,
  EffectDuration,
} from '../../types/abilities';

// Ongoing effect: All your Beasts gain +2 Attack
const attackBoost: StatModificationEffect = {
  type: EffectType.ModifyStats,
  target: AbilityTarget.AllAllies,
  stat: StatType.Attack,
  value: 2,
  duration: EffectDuration.WhileOnField,
};

export const BATTLE_FURY: BuffCard = {
  id: 'battle-fury',
  name: 'Battle Fury',
  type: 'Buff',
  description: 'All your Beasts gain +2 Attack.',
  cost: 3,
  ongoingEffects: [attackBoost],
};
