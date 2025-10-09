/**
 * Habitat Lock - Prevent habitat change
 */

import { TrapCard } from '../../types/core';

export const HABITAT_LOCK: TrapCard = {
  id: 'habitat-lock',
  name: 'Habitat Lock',
  type: 'Trap',
  cost: 1,
  activation: 'When the opponent plays a Bloom Card, flip this card.',
  effect: 'The Habitat Zone cannot be changed next turn.',
};