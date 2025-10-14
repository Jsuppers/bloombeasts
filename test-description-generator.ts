/**
 * Test script for ability description generator
 */

import { FUZZLET } from './bloombeasts/engine/cards/forest/fuzzlet';
import { getAbilityDescription } from './bloombeasts/engine/utils/getAbilityDescription';

console.log('=== Testing Ability Description Generator ===\n');

// Test Fuzzlet's abilities
const card = FUZZLET;

console.log(`Card: ${card.name}`);
console.log(`\nBase Ability: ${card.ability.name}`);
console.log(`Generated: ${getAbilityDescription(card.ability)}`);

// Test level upgrades
if (card.levelingConfig?.abilityUpgrades) {
  for (const [level, upgrade] of Object.entries(card.levelingConfig.abilityUpgrades)) {
    if (upgrade.ability) {
      console.log(`\nLevel ${level} Ability: ${upgrade.ability.name}`);
      console.log(`Generated: ${getAbilityDescription(upgrade.ability)}`);
    }
  }
}
