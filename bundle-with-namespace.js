import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processedFiles = new Set();
const fileContents = [];

function resolveImportPath(fromFile, importPath) {
  const fromDir = path.dirname(fromFile);
  let resolvedPath = path.resolve(fromDir, importPath);

  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
    resolvedPath = path.join(resolvedPath, 'index.ts');
  }

  if (!fs.existsSync(resolvedPath) && !resolvedPath.endsWith('.ts')) {
    const tsPath = resolvedPath + '.ts';
    if (fs.existsSync(tsPath)) {
      resolvedPath = tsPath;
    }
  }

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    const basePath = resolvedPath.replace(/\.ts$/, '');
    const indexPath = path.join(basePath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      resolvedPath = indexPath;
    }
  }

  return resolvedPath;
}

function extractImports(content) {
  const imports = [];
  const lines = content.split('\n');
  let inImport = false;
  let currentImport = '';

  for (const line of lines) {
    if (inImport) {
      currentImport += ' ' + line.trim();
      if (line.includes(';') || line.includes('from')) {
        const match = currentImport.match(/from\s+['"](.+)['"]/);
        if (match) imports.push(match[1]);
        inImport = false;
        currentImport = '';
      }
    } else {
      const trimmed = line.trim();
      if (trimmed.startsWith('import ')) {
        if (line.includes(';') || line.includes('from')) {
          const match = line.match(/from\s+['"](.+)['"]/);
          if (match) imports.push(match[1]);
        } else {
          inImport = true;
          currentImport = line;
        }
      } else if (trimmed.startsWith('export ') && trimmed.includes('from')) {
        const match = line.match(/from\s+['"](.+)['"]/);
        if (match) imports.push(match[1]);
      }
    }
  }

  return imports;
}

function removeImportsAndExports(content) {
  const lines = content.split('\n');
  const result = [];
  let inImportBlock = false;
  let inExportBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip import statements
    if (trimmed.startsWith('import ')) {
      inImportBlock = true;
      if (!trimmed.includes(';')) continue;
      inImportBlock = false;
      continue;
    }

    if (inImportBlock) {
      if (trimmed.includes(';')) inImportBlock = false;
      continue;
    }

    // Skip export {...} from statements (multi-line)
    if (trimmed.startsWith('export {')) {
      const nextLine = lines[i + 1]?.trim() || '';
      if (!trimmed.includes('}') || nextLine.startsWith('from ')) {
        inExportBlock = true;
        continue;
      }
      // Single-line export {} without from - keep but remove export keyword
    }

    if (inExportBlock) {
      if (trimmed.includes(';') || (trimmed.includes('}') && !lines[i + 1]?.trim().startsWith('from'))) {
        inExportBlock = false;
      }
      continue;
    }

    // Skip export from statements
    if (trimmed.startsWith('export ') && trimmed.includes(' from ')) {
      if (!trimmed.includes(';')) {
        for (let j = i + 1; j < lines.length; j++) {
          i = j;
          if (lines[j].includes(';')) break;
        }
      }
      continue;
    }

    // Handle export keyword
    let processedLine = line;
    if (trimmed.startsWith('export ')) {
      // Keep export for class, interface, type, const, function, enum declarations
      // Inside a namespace, exports become namespace members
      if (trimmed.match(/^export\s+(class|interface|type|const|let|var|function|enum|abstract\s+class)\s/)) {
        processedLine = line; // Keep the export
      } else if (trimmed.startsWith('export default ')) {
        // Skip export default statements entirely (they're re-exports)
        continue;
      } else {
        // For other exports, remove the export keyword
        processedLine = line.replace(/^(\s*)export\s+/, '$1');
      }
    }

    result.push(processedLine);
  }

  return result.join('\n');
}

function processFile(filePath) {
  const normalizedPath = path.resolve(filePath);

  if (processedFiles.has(normalizedPath)) return;
  if (!fs.existsSync(normalizedPath)) {
    console.warn(`Warning: File not found: ${normalizedPath}`);
    return;
  }
  if (normalizedPath.includes('.test.') || normalizedPath.includes('__tests__')) return;

  // Skip bloombeasts/ui/index.ts - it just re-exports from web and would cause issues in namespace
  if (normalizedPath.includes('bloombeasts\\ui\\index.ts') ||
      normalizedPath.includes('bloombeasts/ui/index.ts')) {
    console.log(`Skipping re-export file: ${path.relative(__dirname, normalizedPath)}`);
    return;
  }

  console.log(`Processing: ${path.relative(__dirname, normalizedPath)}`);
  processedFiles.add(normalizedPath);

  let content = fs.readFileSync(normalizedPath, 'utf8');

  // Process imports first (depth-first)
  const imports = extractImports(content);
  for (const importPath of imports) {
    if (!importPath.startsWith('.')) continue;
    const resolvedPath = resolveImportPath(normalizedPath, importPath);
    processFile(resolvedPath);
  }

  // Remove imports and exports
  content = removeImportsAndExports(content);

  fileContents.push({
    path: normalizedPath,
    relativePath: path.relative(__dirname, normalizedPath),
    fileName: path.basename(normalizedPath, '.ts'),
    content: content.trim()
  });
}

console.log('Building standalone TypeScript bundle with namespace...\n');

// Track const/let/var declarations to detect duplicates
const declaredConstants = new Map();

// Process entry point - core game engine
const entryPoint = path.resolve(__dirname, './bloombeasts/engine/index.ts');
processFile(entryPoint);

// Process core game logic
processFile(path.resolve(__dirname, './bloombeasts/gameManager.ts'));
processFile(path.resolve(__dirname, './bloombeasts/systems/CardCollectionManager.ts'));
processFile(path.resolve(__dirname, './bloombeasts/systems/SoundManager.ts'));
processFile(path.resolve(__dirname, './bloombeasts/systems/BattleDisplayManager.ts'));
processFile(path.resolve(__dirname, './bloombeasts/screens/missions/BattleStateManager.ts'));
processFile(path.resolve(__dirname, './bloombeasts/screens/missions/OpponentAI.ts'));
processFile(path.resolve(__dirname, './bloombeasts/screens/missions/MissionManager.ts'));
processFile(path.resolve(__dirname, './bloombeasts/screens/missions/MissionSelectionUI.ts'));
processFile(path.resolve(__dirname, './bloombeasts/screens/missions/MissionBattleUI.ts'));
processFile(path.resolve(__dirname, './bloombeasts/screens/missions/definitions/index.ts'));
processFile(path.resolve(__dirname, './bloombeasts/screens/cards/CardCollection.ts'));
processFile(path.resolve(__dirname, './bloombeasts/AssetCatalog.ts'));

// Process BloomBeastsGame (main game controller)
processFile(path.resolve(__dirname, './bloombeasts/BloomBeastsGame.ts'));

// Handle duplicate const declarations
// Don't rename - namespaces already provide isolation
for (const file of fileContents) {
  file.fileName = path.basename(file.path, '.ts');
}

// Generate bundle wrapped in namespace
const bundle = `/**
 * BloomBeasts Game Engine - Meta Horizon Edition
 * Standalone TypeScript Bundle
 *
 * This file contains the complete BloomBeasts game engine in a single standalone TypeScript file.
 * All code is wrapped in the BloomBeasts namespace to avoid global scope pollution.
 *
 * Usage in Meta Horizon:
 *   // Access types and classes via the BloomBeasts namespace
 *   const game = new BloomBeasts.GameManager(platform);
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated: ${new Date().toISOString()}
 * Files: ${processedFiles.size}
 *
 * @version 1.0.0
 * @license MIT
 */

/* eslint-disable */
/* tslint:disable */

// ==================== Global Type Declarations ====================

// ==================== BloomBeasts Namespace ====================

namespace BloomBeasts {

  // ==================== Game Engine Code ====================
  // All type declarations and implementations are included from source files below.
  // UI implementations are provided by the platform via UIMethodMappings interface.

${fileContents.map(file => {
  if (!file.content.trim()) return '';

  // Indent all lines by 2 spaces for namespace
  const indented = file.content.split('\n').map(line => {
    if (line.trim() === '') return '';
    return '  ' + line;
  }).join('\n');

  return `  // ==================== ${file.relativePath} ====================\n\n${indented}`;
}).filter(Boolean).join('\n\n')}

}

// Export the namespace as a module
export { BloomBeasts };

// Make BloomBeasts available globally
if (typeof globalThis !== 'undefined') {
  (globalThis as any).BloomBeasts = BloomBeasts;
}
`;

// Write output
const outputDir = path.resolve(__dirname, 'deployments/horizon/src');
const outputPath = path.join(outputDir, 'BloomBeasts-GameEngine-Standalone.ts');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, bundle, 'utf8');

console.log(`\n✓ Standalone TypeScript bundle created!`);
console.log(`  Output: ${path.relative(__dirname, outputPath)}`);
console.log(`  Files bundled: ${processedFiles.size}`);
console.log(`  Size: ${(bundle.length / 1024).toFixed(2)} KB`);
console.log(`\nAll code is in the BloomBeasts namespace.`);
console.log(`Example usage: const game = new BloomBeasts.GameManager(platform);`);
