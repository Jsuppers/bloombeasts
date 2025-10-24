/**
 * Migration script to convert TypeScript card definitions to JSON catalog format
 *
 * Usage:
 * ts-node scripts/migrateCardsToJson.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { getAllCards } from '../bloombeasts/engine/cards';
import type { BloomBeastCard, MagicCard, TrapCard, BuffCard, HabitatCard, AnyCard } from '../bloombeasts/engine/types/core';
import type { AssetCatalog, CardAssetEntry } from '../bloombeasts/AssetCatalogManager';

/**
 * Helper to get asset path for a card
 */
function getAssetPath(card: AnyCard): string {
  // Determine the directory based on card type and affinity
  let directory = '';

  if (card.type === 'Bloom') {
    const bloomCard = card as BloomBeastCard;
    directory = `cards/${bloomCard.affinity}`;
  } else if (card.type === 'Habitat') {
    const habitatCard = card as HabitatCard;
    directory = `cards/${habitatCard.affinity}`;
  } else {
    directory = `cards/${card.type}`;
  }

  // Convert card name to filename (e.g., "Leaf Sprite" -> "LeafSprite.png")
  const filename = card.name.replace(/\s+/g, '') + '.png';

  return `shared/images/${directory}/${filename}`;
}

/**
 * Convert a card to catalog entry format
 */
function cardToCatalogEntry(card: AnyCard): CardAssetEntry {
  // Determine the entry type
  let entryType: 'beast' | 'magic' | 'trap' | 'buff' | 'habitat';
  let affinity: 'fire' | 'forest' | 'sky' | 'water' | undefined;

  switch (card.type) {
    case 'Bloom':
      entryType = 'beast';
      affinity = (card as BloomBeastCard).affinity.toLowerCase() as any;
      break;
    case 'Habitat':
      entryType = 'habitat';
      affinity = (card as HabitatCard).affinity.toLowerCase() as any;
      break;
    case 'Magic':
      entryType = 'magic';
      break;
    case 'Trap':
      entryType = 'trap';
      break;
    case 'Buff':
      entryType = 'buff';
      affinity = (card as BuffCard).affinity?.toLowerCase() as any;
      break;
    default:
      throw new Error(`Unknown card type: ${card.type}`);
  }

  // Create the catalog entry
  const entry: CardAssetEntry = {
    id: card.id,
    type: entryType,
    cardType: card.type,
    affinity,
    data: {
      ...card,
      displayName: card.name
    } as any,
    assets: [
      {
        type: 'image',
        horizonAssetId: 'REPLACE_WITH_HORIZON_ID',
        path: getAssetPath(card),
        description: `${card.name} card artwork`
      }
    ]
  };

  // Remove undefined affinity if not applicable
  if (!affinity) {
    delete entry.affinity;
  }

  return entry;
}

/**
 * Group cards by category
 */
function groupCardsByCategory(cards: AnyCard[]): Map<string, CardAssetEntry[]> {
  const groups = new Map<string, CardAssetEntry[]>();

  cards.forEach(card => {
    let category: string;

    if (card.type === 'Bloom' || card.type === 'Habitat') {
      const affCard = card as (BloomBeastCard | HabitatCard);
      category = affCard.affinity.toLowerCase();
    } else if (card.type === 'Buff') {
      const buffCard = card as BuffCard;
      category = buffCard.affinity ? buffCard.affinity.toLowerCase() : 'buff';
    } else {
      category = card.type.toLowerCase();
    }

    if (!groups.has(category)) {
      groups.set(category, []);
    }

    groups.get(category)!.push(cardToCatalogEntry(card));
  });

  return groups;
}

/**
 * Create catalog JSON for a category
 */
function createCatalog(category: string, entries: CardAssetEntry[]): AssetCatalog {
  return {
    version: '1.0.0',
    category: category as any,
    description: `${category.charAt(0).toUpperCase() + category.slice(1)} cards and assets`,
    data: entries
  };
}

/**
 * Main migration function
 */
async function migrateCards() {
  console.log('Starting card migration...');

  // Get all cards from the game engine
  const allCards = getAllCards();
  console.log(`Found ${allCards.length} cards`);

  // Group cards by category
  const groups = groupCardsByCategory(allCards);

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '../assets/catalogs/generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write catalog files for each category
  for (const [category, entries] of groups) {
    const catalog = createCatalog(category, entries);
    const filename = `${category}Assets.generated.json`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(
      filepath,
      JSON.stringify(catalog, null, 2),
      'utf8'
    );

    console.log(`Created ${filename} with ${entries.length} entries`);
  }

  console.log('\nMigration complete!');
  console.log('Generated files are in: assets/catalogs/generated/');
  console.log('\nNext steps:');
  console.log('1. Review the generated JSON files');
  console.log('2. Add any missing UI assets (chests, missions, icons)');
  console.log('3. Replace REPLACE_WITH_HORIZON_ID placeholders with actual Horizon IDs');
  console.log('4. Move files from /generated to /catalogs when ready');
}

/**
 * Validate that all expected assets exist
 */
function validateAssetPaths() {
  console.log('\nValidating asset paths...');

  const allCards = getAllCards();
  const missing: string[] = [];

  allCards.forEach(card => {
    const assetPath = getAssetPath(card);
    const fullPath = path.join(__dirname, '..', assetPath);

    if (!fs.existsSync(fullPath)) {
      missing.push(`${card.name}: ${assetPath}`);
    }
  });

  if (missing.length > 0) {
    console.log('\nWarning: Missing asset files:');
    missing.forEach(m => console.log(`  - ${m}`));
  } else {
    console.log('All asset paths are valid!');
  }
}

// Run the migration
if (require.main === module) {
  migrateCards()
    .then(() => validateAssetPaths())
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateCards, validateAssetPaths, cardToCatalogEntry };