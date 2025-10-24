/**
 * Test script to check card descriptions for all cards
 */

import { getAllCards } from './bloombeasts/engine/cards';
import { getCardDescription } from './bloombeasts/engine/utils/cardDescriptionGenerator';

console.log('Testing card descriptions for all cards...\n');
console.log('='.repeat(80));

const cards = getAllCards();
const missingDescriptions: string[] = [];
const cardsWithDescriptions: string[] = [];

for (const card of cards) {
  const description = getCardDescription(card);

  if (!description || description.trim() === '') {
    missingDescriptions.push(card.name);
    console.log(`❌ ${card.name} (${card.type})`);
    console.log(`   ID: ${card.id}`);
    console.log(`   Abilities:`, card.abilities);
    console.log(`   Description: [EMPTY]`);
    console.log('');
  } else {
    cardsWithDescriptions.push(card.name);
    console.log(`✅ ${card.name} (${card.type})`);
    console.log(`   Description: ${description}`);
    console.log('');
  }
}

console.log('='.repeat(80));
console.log(`\nSummary:`);
console.log(`  Cards with descriptions: ${cardsWithDescriptions.length}`);
console.log(`  Cards missing descriptions: ${missingDescriptions.length}`);

if (missingDescriptions.length > 0) {
  console.log(`\nCards missing descriptions:`);
  missingDescriptions.forEach(name => console.log(`  - ${name}`));
}
