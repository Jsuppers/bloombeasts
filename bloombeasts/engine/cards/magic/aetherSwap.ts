/**
 * Aether Swap - Swap positions of two units
 */

import { MagicCard, Ability } from '../../types/core';
import { SwapPositionsEffect, EffectType, AbilityTarget, StructuredAbility, AbilityTrigger } from '../../types/abilities';

const swapEffect: SwapPositionsEffect = {
  type: EffectType.SwapPositions,
  target: AbilityTarget.Target
};

const aetherSwapAbility: StructuredAbility = {
  name: 'Aether Swap',
  trigger: AbilityTrigger.OnSummon, // Magic cards trigger immediately when played
  effects: [swapEffect]
};

export const AETHER_SWAP: MagicCard = {
  id: 'aether-swap',
  name: 'Aether Swap',
  type: 'Magic',
  cost: 1,
  abilities: [aetherSwapAbility],
  targetRequired: true  // Requires selecting two units to swap
};
