/**
 * Utility to create default PlayerData structure
 * Used by platforms when initializing new players
 */

import { PlayerData } from '../BloomBeastsGame';
import { COIN_BOOST, EXP_BOOST, LUCK_BOOST, ROOSTER } from '../constants/upgrades';

/**
 * Create default player data structure
 * @param name - Player's display name
 * @returns Default PlayerData with the given name
 */
export function createDefaultPlayerData(name: string): PlayerData {
  return {
    name: name,
    totalXP: 0,
    coins: 1000, // Starting coins
    items: [],
    cards: {
      collected: [],
      deck: []
    },
    missions: {
      completedMissions: {}
    },
    boosts: {
      [COIN_BOOST.id]: 0,
      [EXP_BOOST.id]: 0,
      [LUCK_BOOST.id]: 0,
      [ROOSTER.id]: 0
    },
    settings: {
      musicVolume: 10,
      sfxVolume: 50,
      musicEnabled: true,
      sfxEnabled: true
    }
  };
}
