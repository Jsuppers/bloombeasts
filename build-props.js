import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building flattened props for Meta Horizon...\n');

// Create output directories
const outputDir = path.resolve(__dirname, 'dist/props');
const imagesDir = path.join(outputDir, 'images');
const audioDir = path.join(outputDir, 'audio');

fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(audioDir, { recursive: true });

// Helper to flatten filename (preserve uniqueness but remove folder structure)
function flattenFileName(filePath, baseDir) {
  const relativePath = path.relative(baseDir, filePath);
  // Replace path separators with underscores to maintain uniqueness
  // e.g., "cards/Fire/CinderPup.png" -> "cards_Fire_CinderPup.png"
  return relativePath.replace(/[\/\\]/g, '_');
}

// Recursively copy files from source to destination with flattened names
function copyFilesFlat(sourceDir, destDir, baseDir, extensions) {
  if (!fs.existsSync(sourceDir)) {
    console.warn(`Warning: Source directory not found: ${sourceDir}`);
    return 0;
  }

  let count = 0;
  const items = fs.readdirSync(sourceDir);

  for (const item of items) {
    const sourcePath = path.join(sourceDir, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      count += copyFilesFlat(sourcePath, destDir, baseDir, extensions);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (extensions.includes(ext)) {
        const flatName = flattenFileName(sourcePath, baseDir);
        const destPath = path.join(destDir, flatName);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`  ✓ ${flatName}`);
        count++;
      }
    }
  }

  return count;
}

// Copy images
console.log('Copying images...');
const imagesSource = path.resolve(__dirname, 'shared/images');
const imageCount = copyFilesFlat(imagesSource, imagesDir, imagesSource, ['.png', '.jpg', '.jpeg', '.gif']);
console.log(`\n✓ Copied ${imageCount} images\n`);

// Copy audio
console.log('Copying audio...');
const audioSource = path.resolve(__dirname, 'shared/audio');
const audioCount = copyFilesFlat(audioSource, audioDir, audioSource, ['.mp3', '.wav', '.ogg', '.m4a']);
console.log(`\n✓ Copied ${audioCount} audio files\n`);

// Generate a manifest file listing all assets
const manifest = {
  images: fs.readdirSync(imagesDir).sort(),
  audio: fs.readdirSync(audioDir).sort(),
  generated: new Date().toISOString(),
  totalImages: imageCount,
  totalAudio: audioCount,
};

fs.writeFileSync(
  path.join(outputDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('✓ Asset manifest created\n');
console.log('═══════════════════════════════════════');
console.log(`Total Images: ${imageCount}`);
console.log(`Total Audio:  ${audioCount}`);
console.log(`Output: dist/props/`);
console.log('═══════════════════════════════════════\n');
console.log('Assets are now ready for upload to Meta Horizon!');
console.log('All files have been flattened into a single directory per type.');
