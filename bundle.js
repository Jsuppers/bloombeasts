/**
 * Custom bundler to concatenate all TypeScript files into a single file
 * while maintaining TypeScript syntax
 */

const fs = require('fs');
const path = require('path');

// Order matters for dependencies
const fileOrder = [
  // Polyfills first
  'utils/polyfills.ts',

  // Core types
  'game/types/core.ts',
  'game/types/abilities.ts',
  'game/types/leveling.ts',
  'game/types/game.ts',

  // Constants
  'game/constants/leveling.ts',

  // Card definitions - base class first
  'game/cards/BaseDeck.ts',

  // Individual cards
  'game/cards/forest/fuzzlet.ts',
  'game/cards/forest/mushroomancer.ts',
  'game/cards/forest/leafSprite.ts',
  'game/cards/forest/rootling.ts',
  'game/cards/forest/ancientForest.ts',
  'game/cards/forest/index.ts', // Contains ForestDeck class

  'game/cards/fire/cinderPup.ts',
  'game/cards/fire/magmite.ts',
  'game/cards/fire/charcoil.ts',
  'game/cards/fire/blazefinch.ts',
  'game/cards/fire/volcanicScar.ts',
  'game/cards/fire/index.ts', // Contains FireDeck class

  'game/cards/water/dewdropDrake.ts',
  'game/cards/water/bubblefin.ts',
  'game/cards/water/kelpCub.ts',
  'game/cards/water/aquaPebble.ts',
  'game/cards/water/deepSeaGrotto.ts',
  'game/cards/water/index.ts', // Contains WaterDeck class

  'game/cards/sky/cirrusFloof.ts',
  'game/cards/sky/aeroMoth.ts',
  'game/cards/sky/galeGlider.ts',
  'game/cards/sky/starBloom.ts',
  'game/cards/sky/clearZenith.ts',
  'game/cards/sky/index.ts', // Contains SkyDeck class

  'game/cards/shared/habitatLock.ts',
  'game/cards/shared/nectarSurge.ts',
  'game/cards/shared/cleansingDownpour.ts',
  'game/cards/shared/nectarBlock.ts',
  'game/cards/shared/index.ts', // Contains getSharedCoreCards function
  'game/cards/index.ts', // Contains getAllCards and card query functions

  // Utils
  'game/utils/cardHelpers.ts',
  'game/utils/combatHelpers.ts',
  'game/utils/deckBuilder.ts',

  // Systems
  'game/systems/AbilityProcessor.ts',
  'game/systems/CombatSystem.ts',
  'game/systems/LevelingSystem.ts',
  'game/systems/GameEngine.ts',
  'game/index.ts',

  // Inventory
  'inventory/types.ts',
  'inventory/InventoryFilters.ts',
  'inventory/CardCollection.ts',
  'inventory/InventoryUI.ts',
  'inventory/index.ts',

  // Missions
  'missions/types.ts',
  'missions/definitions/mission01.ts',
  'missions/definitions/mission02.ts',
  'missions/definitions/mission03.ts',
  'missions/definitions/mission04.ts',
  'missions/definitions/mission05.ts',
  'missions/definitions/mission06.ts',
  'missions/definitions/mission07.ts',
  'missions/definitions/mission08.ts',
  'missions/definitions/mission09.ts',
  'missions/definitions/mission10.ts',
  'missions/definitions/index.ts',
  'missions/MissionManager.ts',
  'missions/MissionSelectionUI.ts',
  'missions/MissionBattleUI.ts',
  'missions/index.ts',

  // Start menu
  'startmenu/MenuController.ts',
  'startmenu/StartMenuUI.ts',
  'startmenu/index.ts',

  // Main files
  'GameManager.ts',
  // Skip cardExports.ts - cards are accessed via declare statements in index.ts
  // Skip AllCardDefinitions.ts - duplicates individual card definitions
  'index.ts'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if this is the MAIN index.ts (root level) - preserve exports for it only
  const isMainIndexFile = filePath === 'index.ts';

  // Remove import statements (we're bundling everything)
  // Remove import type with multi-line object destructuring
  content = content.replace(/^import\s+type\s*\{[\s\S]*?\}\s*from\s+['"].*?['"];?\s*$/gm, '');
  // Remove import type single line
  content = content.replace(/^import\s+type\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  // Remove regular imports
  content = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
  content = content.replace(/^import\s+['"].*?['"];?\s*$/gm, '');
  content = content.replace(/^import\s+\{[\s\S]*?\}\s+from\s+['"].*?['"];?\s*$/gm, '');

  // Remove export type statements (export type { something } from 'somewhere')
  content = content.replace(/^export\s+type\s+\{[^}]*\}\s+from\s+['"].*?['"];?\s*$/gm, '');

  // Remove re-export statements (export { something } from 'somewhere')
  content = content.replace(/^export\s+\{[^}]*\}\s+from\s+['"].*?['"];?\s*$/gm, '');

  // Remove standalone export { } statements (without 'from')
  content = content.replace(/^export\s+\{[^}]*\};?\s*$/gm, '');

  // Remove standalone export type { } statements (without 'from')
  content = content.replace(/^export\s+type\s+\{[\s\S]*?\};?\s*$/gm, '');

  // Remove export statements only from main index.ts (for other files, keep exports so they're accessible in namespace)
  if (isMainIndexFile) {
    content = content.replace(/^export\s+((?:abstract\s+)?(?:interface|type|class|function|const|let|var|enum|namespace)\s+)/gm, '$1');
  }

  // Remove named exports (export { something })
  content = content.replace(/^export\s+\{[^}]*\};?\s*$/gm, '');

  // Remove export * statements
  content = content.replace(/^export\s+\*\s+(?:as\s+\w+\s+)?from\s+['"].*?['"];?\s*$/gm, '');

  // Remove default exports
  content = content.replace(/^export\s+default\s+/gm, '');

  // Special handling for main index.ts - remove namespace declaration since we wrap everything
  if (isMainIndexFile) {
    // Remove 'export namespace Bloombeasts {' and the closing brace
    content = content.replace(/^namespace\s+Bloombeasts\s*\{/gm, '');
    // Remove the closing brace and default export at the end
    content = content.replace(/^\}\s*\/\/\s*End namespace Bloombeasts\s*$/gm, '');
    content = content.replace(/^Bloombeasts;\s*$/gm, '');
  }

  // Add file marker comment
  const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
  return `\n  // ===== ${relativePath} =====\n${content}`;
}

function bundle() {
  console.log('Starting bundle process...');

  let output = `/**
 * Bloombeasts Compiled Code
 * Auto-generated file - DO NOT EDIT
 * Generated from bloombeasts folder
 *
 * This single file contains all Bloom Beasts game code
 * compiled for Horizon Worlds compatibility
 */

/* eslint-disable */
/* tslint:disable */

export namespace Bloombeasts {
`;

  let missingFiles = [];
  let processedFiles = [];

  for (const file of fileOrder) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`Processing: ${file}`);
      output += processFile(filePath);
      processedFiles.push(file);
    } else {
      console.warn(`Warning: File not found: ${file}`);
      missingFiles.push(file);
    }
  }

  output += `
} // End namespace Bloombeasts

export default Bloombeasts;
`;

  // Write the bundled file to the root scripts directory
  const outputPath = path.join(__dirname, 'Bloombeasts-Compiled-Code.ts');
  fs.writeFileSync(outputPath, output, 'utf8');

  console.log('\n=== Bundle Complete ===');
  console.log(`Output file: ${outputPath}`);
  console.log(`Processed files: ${processedFiles.length}`);
  if (missingFiles.length > 0) {
    console.log(`Missing files: ${missingFiles.length}`);
    missingFiles.forEach(f => console.log(`  - ${f}`));
  }
}

// Run the bundler
bundle();