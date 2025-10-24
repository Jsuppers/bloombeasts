/**
 * Script to update all card tests to load from JSON instead of TypeScript imports
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
  'buff': 'buff',
  'common': 'common'
};

// Card name to ID mapping (most are lowercase, but we'll handle exceptions)
const cardNameToId = (name) => {
  // Convert PascalCase to kebab-case
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
};

function updateTestFile(filePath) {
  console.log(`Processing: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf-8');

  // Determine the catalog based on the file path
  const pathParts = filePath.split(path.sep);
  const cardType = pathParts[pathParts.length - 2]; // e.g., 'forest', 'fire', etc.
  const catalogName = catalogMap[cardType];

  if (!catalogName) {
    console.log(`  Skipping (no catalog mapping for ${cardType})`);
    return;
  }

  // Extract card constant name from imports
  // Pattern: import { CARD_NAME } from './cardfile.js';
  const importRegex = /import\s+{\s*([A-Z_]+)\s*}\s+from\s+['"]\.\/[^'"]+\.js['"]/g;
  const matches = [...content.matchAll(importRegex)];

  if (matches.length === 0) {
    console.log(`  No card imports found`);
    return;
  }

  let hasChanges = false;

  for (const match of matches) {
    const cardConstName = match[1];
    const fullImport = match[0];

    // Convert constant name to card ID (e.g., MOSSLET -> mosslet, CINDER_PUP -> cinder-pup)
    const cardId = cardConstName.toLowerCase().replace(/_/g, '-');

    console.log(`  Found: ${cardConstName} -> ${cardId} in ${catalogName}`);

    // Remove the import line
    content = content.replace(fullImport + '\n', '');

    // Add the loadCardFromJSON call after imports (before the describe block)
    // First, ensure loadCardFromJSON is imported
    if (!content.includes('loadCardFromJSON')) {
      // Add to existing testUtils import
      content = content.replace(
        /from\s+['"]\.\.\/(__tests__|__tests__)\/testUtils\.js['"]/,
        (match) => {
          // Find the import statement
          const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]\.\.\/(__tests__|__tests__)\/testUtils\.js['"]/);
          if (importMatch) {
            const imports = importMatch[1].trim();
            if (!imports.includes('loadCardFromJSON')) {
              content = content.replace(
                importMatch[0],
                `import {\n  ${imports},\n  loadCardFromJSON,\n} from '../__tests__/testUtils.js'`
              );
            }
          }
          return match;
        }
      );
    }

    // Add the const declaration before describe
    const loadStatement = `// Load card from JSON catalog instead of importing TypeScript\nconst ${cardConstName} = loadCardFromJSON('${cardId}', '${catalogName}');\n\n`;

    // Insert before the first describe block
    content = content.replace(/describe\(/, loadStatement + 'describe(');

    hasChanges = true;
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ Updated`);
  } else {
    console.log(`  No changes needed`);
  }
}

// Find all test files in the cards directory
function findTestFiles(dir) {
  const files = [];

  function walk(directory) {
    const items = fs.readdirSync(directory);

    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.test.ts') && !item.includes('integration')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

// Main execution
const cardsDir = path.join(__dirname, 'bloombeasts', 'engine', 'cards');
const testFiles = findTestFiles(cardsDir);

console.log(`Found ${testFiles.length} test files\n`);

// Skip mosslet.test.ts as it's already updated
const filesToProcess = testFiles.filter(f => !f.includes('mosslet.test.ts') && !f.includes('__tests__'));

for (const file of filesToProcess) {
  updateTestFile(file);
  console.log('');
}

console.log('Done!');
