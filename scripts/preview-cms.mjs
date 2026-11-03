import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'music-preview-'));
const config = path.join(temp, 'config.php');
fs.writeFileSync(config, `<?php return ['db_path'=>getenv('CMS_DB_PATH'),'backup_dir'=>getenv('CMS_BACKUP_DIR'),'session_save_path'=>__DIR__.'/sessions','cookie_secure'=>false];`);
const env = { ...process.env, CMS_CONFIG_PATH: config, CMS_DB_PATH: path.join(temp, 'content.sqlite'), CMS_BACKUP_DIR: path.join(temp, 'backups') };
for (const args of [['tests/cms-fixture.php'], ['bin/migrate.php']]) {
  const result = spawnSync('php', args, { env, stdio: 'inherit', windowsHide: true });
  if (result.status !== 0) process.exit(1);
}
if (process.argv.includes('--with-test-admin')) {
  const code = "require 'lib/Database.php'; Database::getConnection()->prepare('INSERT INTO admin_credentials(id,username,password_hash,must_change_password,credential_version) VALUES(1,?,?,0,1)')->execute(['preview',password_hash('Synthetic-preview-only-123',PASSWORD_DEFAULT)]);";
  const result = spawnSync('php', ['-r', code], { env, stdio: 'inherit', windowsHide: true });
  if (result.status !== 0) process.exit(1);
}
const child = spawn(process.execPath, ['scripts/dev-server.mjs'], { env, stdio: 'inherit', windowsHide: true });
child.on('exit', code => { fs.rmSync(temp, { recursive: true, force: true }); process.exitCode = code ?? 1; });
process.on('SIGINT', () => child.kill());
process.on('SIGTERM', () => child.kill());
