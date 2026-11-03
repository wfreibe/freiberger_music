import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

test('private preparation preserves live files, imports current media and creates no backup', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'music-private-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const live = path.join(temp, 'live');
  fs.mkdirSync(path.join(live, 'storage'), { recursive: true });
  fs.mkdirSync(path.join(live, 'covers'));
  fs.writeFileSync(path.join(live, 'index.php'), '<?php echo "Synthetic original site";');
  fs.writeFileSync(path.join(live, '.htaccess'), 'DirectoryIndex index.php\n');
  fs.writeFileSync(path.join(live, 'covers', 'private-test.svg'), '<svg xmlns="http://www.w3.org/2000/svg"><title>Synthetic live cover</title></svg>');
  const database = path.join(live, 'storage', 'freiberger.sqlite');
  const php = args => spawnSync('php', args, { encoding: 'utf8', env: { ...process.env, CMS_DB_PATH: database }, windowsHide: true });
  const fixture = php(['tests/cms-fixture.php']); assert.equal(fixture.status, 0, fixture.stderr);
  const link = php(['-r', '$d=new PDO("sqlite:".getenv("CMS_DB_PATH"));$d->exec("UPDATE releases SET cover=\'/covers/private-test.svg\' WHERE id=1");']); assert.equal(link.status, 0, link.stderr);
  const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  function manifest(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const file = path.join(directory, entry.name); return entry.isDirectory() ? manifest(file) : [[file, hash(file)]];
    });
  }
  const before = manifest(live);
  const archive = path.resolve('dist-packages/freiberger-music-deploy.zip');
  assert.ok(fs.existsSync(archive), 'Build the deployment package before this test.');
  const digest = hash(archive);
  const prepare = (target, input = archive, expected = digest) => php(['bin/prepare_private.php', input, expected, live, target]);
  const inside = path.join(live, 'private');
  assert.notEqual(prepare(inside).status, 0); assert.equal(fs.existsSync(inside), false);
  const badHashTarget = path.join(temp, 'bad-hash');
  assert.notEqual(prepare(badHashTarget, archive, '0'.repeat(64)).status, 0); assert.equal(fs.existsSync(badHashTarget), false);
  const malicious = path.join(temp, 'malicious.zip'); fs.copyFileSync(archive, malicious);
  const modify = php(['-r', '$z=new ZipArchive();if($z->open($argv[1])!==true || !$z->addFromString("webroot/../../escape.php","unsafe") || !$z->close()) exit(1);', malicious]); assert.equal(modify.status, 0, modify.stderr);
  const maliciousTarget = path.join(temp, 'unsafe');
  assert.notEqual(prepare(maliciousTarget, malicious, hash(malicious)).status, 0); assert.equal(fs.existsSync(maliciousTarget), false);
  const target = path.join(temp, 'private');
  const result = prepare(target); assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, 'prepared-private'); assert.equal(report.backup_created, false); assert.equal(report.content_counts.releases, 1);
  assert.deepEqual(manifest(live), before, 'Live database, code, settings and media remain byte-identical.');
  assert.equal(hash(path.join(target, 'webroot', 'covers', 'private-test.svg')), hash(path.join(live, 'covers', 'private-test.svg')));
  assert.equal(fs.existsSync(path.join(target, 'server', 'backups')), false);
  assert.match(fs.readFileSync(path.join(target, '.htaccess'), 'utf8'), /Require all denied/);
  const clone = path.join(target, 'server', 'data', 'content.sqlite');
  const inspect = php(['-r', '$d=new PDO("sqlite:".$argv[1]); echo json_encode([$d->query("PRAGMA integrity_check")->fetchColumn(),$d->query("SELECT COUNT(*) FROM admin_credentials")->fetchColumn(),$d->query("SELECT COUNT(*) FROM music_schema_migrations")->fetchColumn()]);', clone]);
  assert.equal(inspect.status, 0, inspect.stderr); assert.deepEqual(JSON.parse(inspect.stdout), ['ok', 0, 2]);
  assert.notEqual(prepare(target).status, 0, 'Existing preparation is never overwritten.');
  assert.deepEqual(manifest(live), before);
  if (process.platform !== 'win32') assert.equal(fs.statSync(target).mode & 0o777, 0o700);
});
