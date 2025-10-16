/**
 * Shared Core Cards - Present in all starter decks
 */

import { MagicCard, TrapCard } from '../../types/core';
import { DeckCardEntry } from '../BaseDeck';

// Import all shared cards from their new locations
// Magic cards
import { NECTAR_BLOCK } from '../magic/nectarBlock';
import { NECTAR_SURGE } from '../magic/nectarSurge';
import { CLEANSING_DOWNPOUR } from '../magic/cleansingDownpour';
import { AETHER_SWAP } from '../magic/aetherSwap';
import { ELEMENTAL_BURST } from '../magic/elementalBurst';
import { LIGHTNING_STRIKE } from '../magic/lightningStrike';
import { NECTAR_DRAIN } from '../magic/nectarDrain';
import { OVERGROWTH } from '../magic/overgrowth';
import { POWER_UP } from '../magic/powerUp';
import { PURIFY } from '../magic/purify';

// Trap cards
import { HABITAT_LOCK } from '../trap/habitatLock';
import { BEAR_TRAP } from '../trap/bearTrap';
import { EMERGENCY_BLOOM } from '../trap/emergencyBloom';
import { HABITAT_SHIELD } from '../trap/habitatShield';
import { MAGIC_SHIELD } from '../trap/magicShield';
import { THORN_SNARE } from '../trap/thornSnare';
import { VAPORIZE } from '../trap/vaporize';
import { XP_HARVEST } from '../trap/xpHarvest';

// Re-export all cards
// Magic cards
export { NECTAR_BLOCK } from '../magic/nectarBlock';
export { NECTAR_SURGE } from '../magic/nectarSurge';
export { CLEANSING_DOWNPOUR } from '../magic/cleansingDownpour';
export { AETHER_SWAP } from '../magic/aetherSwap';
export { ELEMENTAL_BURST } from '../magic/elementalBurst';
export { LIGHTNING_STRIKE } from '../magic/lightningStrike';
export { NECTAR_DRAIN } from '../magic/nectarDrain';
export { OVERGROWTH } from '../magic/overgrowth';
export { POWER_UP } from '../magic/powerUp';
export { PURIFY } from '../magic/purify';

// Trap cards
export { HABITAT_LOCK } from '../trap/habitatLock';
export { BEAR_TRAP } from '../trap/bearTrap';
export { EMERGENCY_BLOOM } from '../trap/emergencyBloom';
export { HABITAT_SHIELD } from '../trap/habitatShield';
export { MAGIC_SHIELD } from '../trap/magicShield';
export { THORN_SNARE } from '../trap/thornSnare';
export { VAPORIZE } from '../trap/vaporize';
export { XP_HARVEST } from '../trap/xpHarvest';

/**
 * Get all shared core cards with quantities
 */
export function getSharedCoreCards(): DeckCardEntry<MagicCard | TrapCard>[] {
  return [
    // Basic resource generation
    { card: NECTAR_BLOCK, quantity: 10 },
    { card: NECTAR_SURGE, quantity: 2 },
    { card: NECTAR_DRAIN, quantity: 1 },

    // Removal and utility
    { card: CLEANSING_DOWNPOUR, quantity: 1 },
    { card: PURIFY, quantity: 1 },
    { card: LIGHTNING_STRIKE, quantity: 1 },
    { card: ELEMENTAL_BURST, quantity: 1 },

    // Buffs and positioning
    { card: POWER_UP, quantity: 1 },
    { card: OVERGROWTH, quantity: 1 },
    { card: AETHER_SWAP, quantity: 1 },

    // Trap cards
    { card: HABITAT_LOCK, quantity: 1 },
    { card: MAGIC_SHIELD, quantity: 1 },
    { card: HABITAT_SHIELD, quantity: 1 },
    { card: BEAR_TRAP, quantity: 1 },
    { card: THORN_SNARE, quantity: 1 },
    { card: VAPORIZE, quantity: 1 },
    { card: EMERGENCY_BLOOM, quantity: 1 },
    { card: XP_HARVEST, quantity: 1 },
  ];
}