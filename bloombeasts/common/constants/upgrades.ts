/**
 * Upgrade Constants
 * Defines all available upgrades and their properties
 */

export interface UpgradeDefinition {
  id: string;
  name: string;
  description: string;
  assetId: string;
  costs: number[]; // Cost for each level (index 0 = level 1, index 5 = level 6)
  values?: number[]; // Value of the upgrade (0-100) for each level
}

export const COIN_BOOST: UpgradeDefinition = {
  id: 'coin-boost',
  name: 'Coin Boost',
  description: 'Earn more coins!',
  assetId: 'upgrade-coin-boost',
  costs: [100, 200, 400, 800, 1600, 3200], // Levels 1-6
  values: [5, 15, 25, 50, 100, 200]
};

export const EXP_BOOST: UpgradeDefinition = {
  id: 'exp-boost',
  name: 'Experience Boost',
  description: 'Gain more experience!',
  assetId: 'upgrade-exp-boost',
  costs: [100, 200, 400, 800, 1600, 3200], // Levels 1-6
  values: [5, 15, 25, 50, 100, 200]
};

export const LUCK_BOOST: UpgradeDefinition = {
  id: 'luck-boost',
  name: 'Luck Boost',
  description: 'Increase your chances in getting loot!',
  assetId: 'upgrade-luck-boost',
  costs: [100, 200, 400, 800, 1600, 3200], // Levels 1-6
  values: [5, 15, 25, 50, 100, 200]
};

export const ROOSTER: UpgradeDefinition = {
  id: 'rooster',
  name: 'Rooster',
  description: 'Please ignore this rooster, nothing good will come of it!',
  assetId: 'upgrade-rooster',
  costs: [400, 800, 1600, 3200, 6400, 12800], // Levels 1-6
};

// Array of all upgrades for iteration
export const ALL_UPGRADES: UpgradeDefinition[] = [
  COIN_BOOST,
  EXP_BOOST,
  LUCK_BOOST,
  ROOSTER
];

// Map of upgrade costs by ID for quick lookup
export const UPGRADE_COSTS: { [key: string]: number[] } = {
  [COIN_BOOST.id]: COIN_BOOST.costs,
  [EXP_BOOST.id]: EXP_BOOST.costs,
  [LUCK_BOOST.id]: LUCK_BOOST.costs,
  [ROOSTER.id]: ROOSTER.costs
};
