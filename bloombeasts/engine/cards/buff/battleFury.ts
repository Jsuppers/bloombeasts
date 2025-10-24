/**
 * Battle Fury - Buff Card
 *
 * IMAGE PROMPT:
 * "A glowing red and orange magical aura with flames and energy swirls,
 * centered on a raised fist symbol. Dynamic, aggressive energy radiating outward.
 * Fantasy card game art style, vibrant colors, square format 185x185px."
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

// Ongoing effect: All your Beasts gain +2 Attack
const attackBoost: StatModificationEffect = {
  type: EffectType.ModifyStats,
  target: AbilityTarget.AllAllies,
  stat: StatType.Attack,
  value: 2,
  duration: EffectDuration.WhileOnField,
};

const battleFuryAbility: StructuredAbility = {
  name: 'Battle Fury',
  trigger: AbilityTrigger.Passive, // Ongoing effect
  effects: [attackBoost]
};

export const BATTLE_FURY: BuffCard = {
  id: 'battle-fury',
  name: 'Battle Fury',
  type: 'Buff',
  cost: 3,
  abilities: [battleFuryAbility],
};
