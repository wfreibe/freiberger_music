// Copies dist/index.html and dist/assets to the project root for immediate Apache serving
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const rootDir = path.resolve(__dirname, '..');

// Copy index.html to root (adapted for local XAMPP /freiberger-music subfolder)
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  html = html.replaceAll('="/assets/', '="/freiberger-music/assets/');
  fs.writeFileSync(path.join(rootDir, 'index.html'), html, 'utf8');
  console.log('✓ Copied dist/index.html -> root index.html (configured for /freiberger-music)');
}

// Copy assets directory to root
const distAssets = path.join(distDir, 'assets');
const rootAssets = path.join(rootDir, 'assets');
if (fs.existsSync(distAssets)) {
  if (!fs.existsSync(rootAssets)) {
    fs.mkdirSync(rootAssets, { recursive: true });
  } else {
    // Purge previous hashed bundles so obsolete versions don't pile up
    const existingFiles = fs.readdirSync(rootAssets);
    let deletedCount = 0;
    for (const file of existingFiles) {
      if (/^index-.*\.(js|css|map)$/.test(file)) {
        try {
          fs.unlinkSync(path.join(rootAssets, file));
          deletedCount++;
        } catch (e) {
          console.warn(`Could not delete old asset ${file}:`, e.message);
        }
      }
    }
    if (deletedCount > 0) {
      console.log(`✓ Purged ${deletedCount} obsolete bundle(s) from root /assets`);
    }
  }
  const files = fs.readdirSync(distAssets);
  for (const file of files) {
    fs.copyFileSync(path.join(distAssets, file), path.join(rootAssets, file));
  }
  console.log(`✓ Copied ${files.length} fresh assets to root /assets`);
}
