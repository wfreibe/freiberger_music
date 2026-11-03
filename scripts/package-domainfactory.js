const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { pathToFileURL } = require('url');

const rootDir = path.resolve(__dirname, '..');
const deployDir = path.resolve(rootDir, 'deploy-domainfactory');
const updateZipPath = path.join(rootDir, 'deploy-domainfactory.zip');
const initialZipPath = path.join(rootDir, 'deploy-domainfactory-initial.zip');

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const items = fs.readdirSync(src);
    for (const item of items) {
      if (item.startsWith('.git') || item === 'node_modules' || item.endsWith('.tmp')) continue;
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Platform-independent ZIP archiver using native Node.js 'archiver' with OS fallback
async function createZipArchive(sourceDir, outZipPath) {
  if (fs.existsSync(outZipPath)) fs.unlinkSync(outZipPath);

  // 1. Try native Node.js archiver
  try {
    const archiverPath = path.resolve(__dirname, '../frontend/node_modules/archiver/index.js');
    if (fs.existsSync(archiverPath)) {
      const mod = await import(pathToFileURL(archiverPath).href);
      return await new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outZipPath);
        const zip = mod.ZipArchive
          ? new mod.ZipArchive({ zlib: { level: 9 } })
          : (typeof mod.default === 'function' ? mod.default('zip', { zlib: { level: 9 } }) : mod('zip', { zlib: { level: 9 } }));

        output.on('close', () => {
          resolve({ method: 'archiver (Node.js)', size: zip.pointer() });
        });
        output.on('error', (err) => reject(err));
        zip.on('error', (err) => reject(err));

        zip.pipe(output);
        zip.directory(sourceDir, false);
        zip.finalize().catch(reject);
      });
    }
  } catch (archiverErr) {
    console.warn('  (archiver notice:', archiverErr.message, '- falling back to OS CLI)');
  }

  // 2. Fallback: OS CLI
  return new Promise((resolve, reject) => {
    try {
      if (process.platform === 'win32') {
        execSync(`powershell -Command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${outZipPath}' -Force"`);
      } else {
        execSync(`cd "${sourceDir}" && zip -r -9 "${outZipPath}" ./*`);
      }
      resolve({ method: 'OS CLI fallback', size: fs.statSync(outZipPath).size });
    } catch (err) {
      reject(err);
    }
  });
}

async function run() {
  console.log('🚀 Preparing DomainFactory Deployment Package...');

  // Clean or create deploy directory
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
  fs.mkdirSync(deployDir, { recursive: true });

  // 1. Copy index.html (configured for DomainFactory root /)
  console.log('  → Copying index.html (root /assets/ paths)...');
  const distHtml = path.join(rootDir, 'dist', 'index.html');
  if (fs.existsSync(distHtml)) {
    fs.copyFileSync(distHtml, path.join(deployDir, 'index.html'));
  } else {
    let html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    html = html.replaceAll('="/freiberger-music/assets/', '="/assets/');
    fs.writeFileSync(path.join(deployDir, 'index.html'), html, 'utf8');
  }

  // 1b. Copy index.php (crawler pre-renderer & dynamic meta generator)
  console.log('  → Copying index.php (crawler pre-renderer)...');
  const rootPhp = path.join(rootDir, 'index.php');
  if (fs.existsSync(rootPhp)) {
    fs.copyFileSync(rootPhp, path.join(deployDir, 'index.php'));
  }

  // 2. Copy assets/
  console.log('  → Copying assets/...');
  copyRecursive(path.join(rootDir, 'assets'), path.join(deployDir, 'assets'));

  // 3. Copy covers/
  console.log('  → Copying covers/...');
  copyRecursive(path.join(rootDir, 'covers'), path.join(deployDir, 'covers'));

  // 4. Copy api/
  console.log('  → Copying api/...');
  copyRecursive(path.join(rootDir, 'api'), path.join(deployDir, 'api'));

  // 5. Setup storage/ (Directory protection only, EXCLUDING live database)
  console.log('  → Setting up storage/ (.htaccess protection, EXCLUDING live freiberger.sqlite)...');
  const deployStorageDir = path.join(deployDir, 'storage');
  fs.mkdirSync(deployStorageDir, { recursive: true });
  const storageHtaccess = path.join(rootDir, 'storage', '.htaccess');
  if (fs.existsSync(storageHtaccess)) {
    fs.copyFileSync(storageHtaccess, path.join(deployStorageDir, '.htaccess'));
  }

  // 6. Copy studio/ (Studio CMS Admin)...
  console.log('  → Copying studio/ (Studio CMS Admin)...');
  copyRecursive(path.join(rootDir, 'studio'), path.join(deployDir, 'studio'));

  // 7. Copy .htaccess.domainfactory -> .htaccess
  console.log('  → Copying .htaccess (configured for DomainFactory root)...');
  fs.copyFileSync(path.join(rootDir, '.htaccess.domainfactory'), path.join(deployDir, '.htaccess'));

  // 8. Create standard update ZIP archive (safe for production: NO database overwrite)
  console.log('  → Creating safe update ZIP archive (deploy-domainfactory.zip)...');
  try {
    const res = await createZipArchive(deployDir, updateZipPath);
    console.log(`  ✓ deploy-domainfactory.zip created (${(res.size / 1024).toFixed(1)} KB via ${res.method})`);
  } catch (e) {
    console.warn('  ✗ Update zip creation failed:', e.message);
  }

  // 9. Create optional initial installation ZIP (includes freiberger.sqlite for brand new deployments)
  const sourceSqlite = path.join(rootDir, 'storage', 'freiberger.sqlite');
  if (fs.existsSync(sourceSqlite)) {
    console.log('  → Creating initial setup ZIP with DB (deploy-domainfactory-initial.zip)...');
    const targetSqlite = path.join(deployStorageDir, 'freiberger.sqlite');
    fs.copyFileSync(sourceSqlite, targetSqlite);
    try {
      const initRes = await createZipArchive(deployDir, initialZipPath);
      console.log(`  ✓ deploy-domainfactory-initial.zip created (${(initRes.size / 1024).toFixed(1)} KB via ${initRes.method})`);
    } catch (e) {
      console.warn('  ✗ Initial zip creation failed:', e.message);
    } finally {
      // Remove database from deployDir so deploy-domainfactory/ folder remains safe for direct FTP sync (no DB overwrite)
      if (fs.existsSync(targetSqlite)) {
        fs.unlinkSync(targetSqlite);
        console.log('  ✓ Removed freiberger.sqlite from deploy-domainfactory/storage/ (safe for direct FTP sync)');
      }
    }
  }

  // 10. Summary
  console.log('\n✅ Deployment packages created successfully!');
  console.log('   Folder (Code only):   ' + deployDir);
  console.log('   Update ZIP (Safe):    ' + updateZipPath);
  console.log('   Initial ZIP (w/ DB):  ' + initialZipPath);
  console.log('\n📦 Standard Deploy Directory Content (Database protected):');
  fs.readdirSync(deployDir).forEach(file => {
    console.log('   • ' + file);
  });
}

run().catch(err => {
  console.error('Fatal deployment error:', err);
  process.exit(1);
});
