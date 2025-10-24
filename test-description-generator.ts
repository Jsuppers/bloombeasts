/**
 * Test script for ability description generator
 */

import { MOSSLET } from './bloombeasts/engine/cards/forest/mosslet';
import { getAbilityDescription } from './bloombeasts/engine/utils/getAbilityDescription';

console.log('=== Testing Ability Description Generator ===\n');

// Test Mosslet's abilities
const card = MOSSLET;

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
