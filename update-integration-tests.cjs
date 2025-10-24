/**
 * Script to update integration test files to load from JSON instead of TypeScript imports
 */

const fs = require('fs');
const path = require('path');

// Map of directories to catalog names
const catalogMap = {
  'forest': 'forest',
  'fire': 'fire',
  'water': 'water',
  'sky': 'sky',
  'magic': 'magic',
  'trap': 'trap',
  'buff': 'buff'
};

function updateIntegrationTest(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf-8');

  // Extract all card imports
  // Pattern: import { CARD_NAME } from '../fire/cardfile.js' or './cardfile.js'
  const importRegex = /import\s+{\s*([A-Z_]+)\s*}\s+from\s+['"](\.\.\/([a-z]+)\/[^'"]+|\.\/[^'"]+)\.js['"]/g;
  const matches = [...content.matchAll(importRegex)];

  if (matches.length === 0) {
    console.log(`  No card imports found`);
    return;
  }

  let hasChanges = false;
  const loadStatements = [];

  for (const match of matches) {
    const cardConstName = match[1];
    const importPath = match[2];
    const fullImport = match[0];

    // Determine catalog from import path
    let catalog;
    if (importPath.startsWith('../')) {
      // Cross-directory import like '../fire/charcoil'
      const parts = importPath.split('/');
      catalog = parts[1]; // 'fire', 'water', etc.
    } else {
      // Same directory import like './mosslet'
      const pathParts = filePath.split(path.sep);
      const cardType = pathParts[pathParts.length - 2];
      catalog = catalogMap[cardType];
    }

    // Convert constant name to card ID
    const cardId = cardConstName.toLowerCase().replace(/_/g, '-');

    console.log(`  Found: ${cardConstName} -> ${cardId} in ${catalog}`);

    // Remove the import line
    content = content.replace(fullImport + '\n', '');

    // Track the load statement
    loadStatements.push(`const ${cardConstName} = loadCardFromJSON('${cardId}', '${catalog}');`);

    hasChanges = true;
  }

  if (hasChanges) {
    // Add loadCardFromJSON to imports
    if (!content.includes('loadCardFromJSON')) {
      // Find gameTestUtils import and add loadCardFromJSON to testUtils import
      if (content.includes('gameTestUtils')) {
        // Add loadCardFromJSON import
        content = `import { loadCardFromJSON } from '../__tests__/testUtils.js';\n` + content;
      }
    }

    // Add load statements before the describe block
    const loadBlock = '\n// Load cards from JSON catalogs\n' + loadStatements.join('\n') + '\n\n';
    content = content.replace(/describe\(/, loadBlock + 'describe(');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ Updated`);
  } else {
    console.log(`  No changes needed`);
  }
}

// Integration test files
const integrationTests = [
  'bloombeasts/engine/cards/buff/battleFury.integration.test.ts',
  'bloombeasts/engine/cards/fire/blazefinch.integration.test.ts',
  'bloombeasts/engine/cards/forest/mosslet.integration.test.ts',
  'bloombeasts/engine/cards/magic/cleansingDownpour.integration.test.ts',
  'bloombeasts/engine/cards/magic/nectarSurge.integration.test.ts',
  'bloombeasts/engine/cards/sky/aeroMoth.integration.test.ts',
  'bloombeasts/engine/cards/sky/galeGlider.integration.test.ts',
  'bloombeasts/engine/cards/trap/habitatLock.integration.test.ts',
  'bloombeasts/engine/cards/water/bubblefin.integration.test.ts',
];

console.log(`Found ${integrationTests.length} integration test files\n`);

for (const file of integrationTests) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    updateIntegrationTest(fullPath);
    console.log('');
  }
}

console.log('Done!');
