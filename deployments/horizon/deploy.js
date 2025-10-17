import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Meta Horizon scripts folder path
// Update this path to match your Meta Horizon world ID
const HORIZON_SCRIPTS_PATH = path.join(
  process.env.LOCALAPPDATA || process.env.APPDATA,
  '../LocalLow/Meta/Horizon Worlds/861948146997513/scripts'
);

console.log('Deploying BloomBeasts to Meta Horizon...\n');

// Source files
const standaloneBundle = path.resolve(__dirname, '../../dist/BloomBeasts-GameEngine-Standalone.ts');
const typesFile = path.resolve(__dirname, 'src/BloomBeasts-Types.ts');
const platformFile = path.resolve(__dirname, 'src/BloomBeasts-GamePlatform.ts');
const gameFile = path.resolve(__dirname, 'src/BloomBeasts-Game.ts');

// Destination files
const destStandalone = path.join(HORIZON_SCRIPTS_PATH, 'BloomBeasts-GameEngine-Standalone.ts');
const destTypes = path.join(HORIZON_SCRIPTS_PATH, 'BloomBeasts-Types.ts');
const destPlatform = path.join(HORIZON_SCRIPTS_PATH, 'BloomBeasts-GamePlatform.ts');
const destGame = path.join(HORIZON_SCRIPTS_PATH, 'BloomBeasts-Game.ts');

try {
  // Ensure destination directory exists
  if (!fs.existsSync(HORIZON_SCRIPTS_PATH)) {
    console.error(`Error: Horizon scripts folder not found at ${HORIZON_SCRIPTS_PATH}`);
    console.error('Please update the path in deploy.js to match your Meta Horizon world ID.');
    process.exit(1);
  }

  // Copy standalone bundle
  console.log(`Copying standalone bundle...`);
  console.log(`  From: ${standaloneBundle}`);
  console.log(`  To:   ${destStandalone}`);
  fs.copyFileSync(standaloneBundle, destStandalone);
  console.log(`  ✓ Copied (${(fs.statSync(destStandalone).size / 1024).toFixed(2)} KB)\n`);

  // Copy types file
  console.log(`Copying types file...`);
  console.log(`  From: ${typesFile}`);
  console.log(`  To:   ${destTypes}`);
  fs.copyFileSync(typesFile, destTypes);
  console.log(`  ✓ Copied (${(fs.statSync(destTypes).size / 1024).toFixed(2)} KB)\n`);

  // Copy platform file
  console.log(`Copying platform file...`);
  console.log(`  From: ${platformFile}`);
  console.log(`  To:   ${destPlatform}`);
  fs.copyFileSync(platformFile, destPlatform);
  console.log(`  ✓ Copied (${(fs.statSync(destPlatform).size / 1024).toFixed(2)} KB)\n`);

  // Copy game file
  console.log(`Copying game file...`);
  console.log(`  From: ${gameFile}`);
  console.log(`  To:   ${destGame}`);
  fs.copyFileSync(gameFile, destGame);
  console.log(`  ✓ Copied (${(fs.statSync(destGame).size / 1024).toFixed(2)} KB)\n`);

  console.log('✓ Deployment complete!');
  console.log('\nFiles deployed to Meta Horizon:');
  console.log('  - BloomBeasts-GameEngine-Standalone.ts (469 KB) - Game engine');
  console.log('  - BloomBeasts-Types.ts (2 KB) - Shared type definitions');
  console.log('  - BloomBeasts-GamePlatform.ts (6 KB) - Platform adapter');
  console.log('  - BloomBeasts-Game.ts (32 KB) - UI component');
  console.log('\nYou can now use these files in your Meta Horizon world.');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
