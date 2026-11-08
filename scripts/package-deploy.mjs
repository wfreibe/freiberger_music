import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZipArchive } from '../frontend/node_modules/archiver/index.js';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist-packages');
fs.mkdirSync(output, { recursive: true });
const zip = new ZipArchive({ zlib: { level: 9 } });
const destination = fs.createWriteStream(path.join(output, 'freiberger-music-deploy.zip'));
const finished = new Promise((resolve, reject) => { destination.on('close', resolve); destination.on('error', reject); zip.on('error', reject); });
zip.pipe(destination);
function add(source, target) {
  if (/^vendor\/composer\/tmp-/.test(source) || /[~]$/.test(source)) return;
  const full = path.join(root, source);
  const stat = fs.lstatSync(full);
  if (stat.isSymbolicLink()) throw new Error('Symlinks are not allowed in packages');
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(full)) add(`${source}/${name}`, `${target}/${name}`);
  } else {
    if (/\.(sqlite.*|db|log|env|key|pem|zip)$/i.test(source) || /(^|\/)cms_config\.php$/.test(source)) throw new Error(`Runtime file in package: ${source}`);
    zip.file(full, { name: target });
  }
}
for (const name of fs.readdirSync(path.join(root, 'dist'))) {
  if (name !== 'covers') add(`dist/${name}`, `webroot/${name}`);
}
add('covers', 'webroot/covers');
add('index.php', 'webroot/index.php');
// Explicit API allowlist: never expose migrations, SQL seeds or obsolete Studio.
for (const name of ['index.php','bootstrap.php','runtime.php','cms.php','youtube.php']) add(`api/${name}`, `webroot/api/${name}`);
add('.htaccess.domainfactory', 'webroot/.htaccess');
for (const folder of ['lib','bin','migrations','docs','vendor']) add(folder, `server/${folder}`);
add('config/cms_config.sample.php', 'server/config/cms_config.sample.php');
await zip.finalize(); await finished;
const archive = path.join(output, 'freiberger-music-deploy.zip');
const digest = createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
fs.copyFileSync(path.join(root, 'bin/prepare_private.php'), path.join(output, 'prepare_private.php'));
fs.writeFileSync(path.join(output, 'prepare-private.sh'), `#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "$0")"
exec /usr/bin/php83 ./prepare_private.php ./freiberger-music-deploy.zip ${digest} /kunden/272116_83558/webseiten/freiberger_music /kunden/272116_83558/freiberger-music-private
`);
console.log('Deployment package created: dist-packages/freiberger-music-deploy.zip (no database, credentials or uploads)');
console.log('Private preparation: upload the ZIP, prepare_private.php and prepare-private.sh outside the public webroot.');
