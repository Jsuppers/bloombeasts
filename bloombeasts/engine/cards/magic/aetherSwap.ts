/**
 * Aether Swap - Swap positions of two units
 */

import { MagicCard } from '../../types/core';
import { SwapPositionsEffect, EffectType, AbilityTarget } from '../../types/abilities';

const swapEffect: SwapPositionsEffect = {
  type: EffectType.SwapPositions,
  target: AbilityTarget.Target
};

export const AETHER_SWAP: MagicCard = {
  id: 'aether-swap',
  name: 'Aether Swap',
  type: 'Magic',
  cost: 1,
  effects: [swapEffect],
  targetRequired: true  // Requires selecting two units to swap
};
