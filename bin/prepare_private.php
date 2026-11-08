<?php
declare(strict_types=1);

/** Build a new private installation from a verified package; never modify the live site. */
function prepareMusicPrivate(string $package, string $digest, string $live, string $target): array
{
    if (!preg_match('/^[a-f0-9]{64}$/D', $digest) || !is_file($package) || !hash_equals($digest, hash_file('sha256', $package))) {
        throw new RuntimeException('Package checksum mismatch.');
    }
    $normalize = static fn(string $path): string => str_replace('\\', '/', $path);
    $live = realpath($live) ?: throw new RuntimeException('Live directory missing.');
    $parent = realpath(dirname($target)) ?: throw new RuntimeException('Target parent missing.');
    $target = $parent . DIRECTORY_SEPARATOR . basename($target);
    $livePrefix = $normalize($live) . '/';
    $targetPrefix = $normalize($target) . '/';
    if (PHP_OS_FAMILY === 'Windows') { $livePrefix = strtolower($livePrefix); $targetPrefix = strtolower($targetPrefix); }
    if (str_starts_with($targetPrefix, $livePrefix) || str_starts_with($livePrefix, $targetPrefix) || file_exists($target) || is_link($target)) {
        throw new RuntimeException('Target must be new and outside the live directory.');
    }
    $database = $live . '/storage/freiberger.sqlite';
    if (!is_file($database) || is_link($database)) throw new RuntimeException('Live music database missing or linked.');
    $zip = new ZipArchive();
    if ($zip->open($package) !== true) throw new RuntimeException('Cannot open deployment package.');
    $seen = []; $expanded = 0;
    try {
        if ($zip->numFiles > 10000) throw new RuntimeException('Too many package entries.');
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $name = $zip->getNameIndex($i);
            if (!is_string($name) || isset($seen[$name]) || str_contains($name, '\\') || str_contains($name, "\0") || preg_match('#(^|/)\.{1,2}(/|$)#', $name)) throw new RuntimeException('Unsafe package entry.');
            if (!preg_match('#^(webroot/(index\.(html|php)|\.htaccess|assets/[^/]+\.(js|css)|covers/[a-zA-Z0-9_./-]+\.(svg|jpe?g|png|webp|gif|mp3|m4a|ogg|wav|mp4|webm)|api/(index|bootstrap|runtime|cms|youtube)\.php)|server/(vendor/[a-zA-Z0-9_./-]+|lib/[A-Za-z0-9_-]+\.php|bin/[A-Za-z0-9_-]+\.php|migrations/[A-Za-z0-9_-]+\.sql|docs/[A-Za-z0-9_-]+\.md|config/cms_config\.sample\.php))$#D', $name)) throw new RuntimeException('Unexpected package path.');
            if ($zip->getExternalAttributesIndex($i, $system, $attributes) && (($attributes >> 16) & 0170000) === 0120000) throw new RuntimeException('Linked package entry.');
            $expanded += $zip->statIndex($i)['size'];
            if ($expanded > 268435456) throw new RuntimeException('Package exceeds 256 MiB limit.');
            $seen[$name] = true;
        }
        foreach (['webroot/index.html','webroot/api/index.php','server/lib/Database.php','server/bin/migrate.php','server/config/cms_config.sample.php','server/migrations/101_admin_credentials.sql','server/migrations/102_login_attempts.sql'] as $name) {
            if (!isset($seen[$name])) throw new RuntimeException('Required package file missing.');
        }
        // Only new private paths are created. No chmod, rename or write touches live files.
        if (!mkdir($target, 0700)) throw new RuntimeException('Cannot create private target.');
        if (DIRECTORY_SEPARATOR === '/' && !chmod($target, 0700)) throw new RuntimeException('Cannot protect private target.');
        if (file_put_contents($target . '/.htaccess', "Require all denied\n", LOCK_EX) === false) throw new RuntimeException('Cannot write HTTP denial.');
        foreach (array_keys($seen) as $name) {
            $destination = $target . '/' . $name;
            if (!is_dir(dirname($destination)) && !mkdir(dirname($destination), 0700, true)) throw new RuntimeException('Cannot create package directory.');
            $stream = $zip->getStream($name);
            $out = fopen($destination, 'xb');
            if (!$stream || !$out) throw new RuntimeException('Cannot extract package entry.');
            try { if (stream_copy_to_stream($stream, $out) !== $zip->statName($name)['size']) throw new RuntimeException('Incomplete package entry.'); }
            finally { fclose($stream); fclose($out); }
            if (DIRECTORY_SEPARATOR === '/' && !chmod($destination, 0600)) throw new RuntimeException('Cannot protect package file.');
        }
    } finally { $zip->close(); }
    $server = $target . '/server';
    foreach (['data','data/uploads','data/sessions'] as $directory) if (!mkdir($server . '/' . $directory, 0700, true)) throw new RuntimeException('Cannot create private runtime directory.');
    $source = new PDO('sqlite:' . $database, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::SQLITE_ATTR_OPEN_FLAGS => PDO::SQLITE_OPEN_READONLY]);
    $source->exec('PRAGMA busy_timeout=5000');
    $version = $source->query('PRAGMA data_version')->fetchColumn();
    $source->exec('VACUUM INTO ' . $source->quote($server . '/data/content.sqlite'));
    $db = new PDO('sqlite:' . $server . '/data/content.sqlite', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    $verify = static function(PDO $connection): void {
        if ($connection->query('PRAGMA integrity_check')->fetchAll(PDO::FETCH_COLUMN) !== ['ok'] || $connection->query('PRAGMA foreign_key_check')->fetchAll()) throw new RuntimeException('Private database verification failed.');
    };
    $verify($db);
    $db->exec('PRAGMA foreign_keys=ON');
    $counts = [];
    foreach (['releases','books','chapters','places','series'] as $table) {
        $rows = $db->query("SELECT * FROM $table")->fetchAll(); $counts[$table] = count($rows);
        // Preserve live media referenced by the current contents, without copying legacy code.
        foreach ($rows as $row) foreach ($row as $field => $value) {
            if (!in_array($field, ['cover','image','audio_url'], true) || !is_string($value) || !str_starts_with($value, '/') || str_starts_with($value, '//')) continue;
            $relative = rawurldecode(parse_url($value, PHP_URL_PATH) ?? '');
            if (str_contains($relative, '\\') || preg_match('#(^|/)\.\.?(/|$)|[\x00-\x1f]#', $relative) || !preg_match('/\.(jpe?g|png|webp|svg|gif|mp3|m4a|ogg|wav|mp4|webm)$/iD', $relative)) throw new RuntimeException('Unexpected live media reference.');
            $original = realpath($live . $relative);
            $destination = $target . '/webroot' . $relative;
            if ($original === false) { if (!is_file($destination)) throw new RuntimeException('Referenced live media missing.'); continue; }
            $mediaPrefix = $normalize($original);
            if (PHP_OS_FAMILY === 'Windows') $mediaPrefix = strtolower($mediaPrefix);
            if (!str_starts_with($mediaPrefix, $livePrefix) || is_link($live . $relative)) throw new RuntimeException('Linked or external live media reference.');
            $expanded += filesize($original);
            if ($expanded > 536870912) throw new RuntimeException('Private installation exceeds 512 MiB limit.');
            if (!is_dir(dirname($destination)) && !mkdir(dirname($destination), 0700, true)) throw new RuntimeException('Cannot create media directory.');
            if (!copy($original, $destination) || !hash_equals(hash_file('sha256', $original), hash_file('sha256', $destination))) throw new RuntimeException('Private media copy failed.');
        }
    }
    // Initial migrations apply only to the new working copy, without creating a backup.
    $db->beginTransaction();
    try {
        $db->exec('CREATE TABLE IF NOT EXISTS music_schema_migrations (version INTEGER PRIMARY KEY)');
        $applied = $db->query('SELECT version FROM music_schema_migrations')->fetchAll(PDO::FETCH_COLUMN);
        foreach (glob($server . '/migrations/*.sql') as $file) {
            $number = (int)basename($file);
            if (in_array($number, $applied)) continue;
            $db->exec(file_get_contents($file));
            $db->prepare('INSERT INTO music_schema_migrations VALUES (?)')->execute([$number]);
        }
        $verify($db); $db->commit();
    } catch (Throwable $e) { if ($db->inTransaction()) $db->rollBack(); throw $e; }
    if ($version != $source->query('PRAGMA data_version')->fetchColumn()) throw new RuntimeException('Live contents changed during preparation; private copy not marked ready.');
    if (!copy($server . '/config/cms_config.sample.php', $server . '/config/cms_config.php')) throw new RuntimeException('Cannot create private configuration.');
    if (DIRECTORY_SEPARATOR === '/') {
        foreach ([$server . '/config/cms_config.php', $server . '/data/content.sqlite'] as $file) if (!chmod($file, 0600)) throw new RuntimeException('Cannot protect runtime file.');
    }
    $result = ['status' => 'prepared-private', 'content_counts' => $counts, 'package_sha256' => $digest, 'backup_created' => false, 'live_changed' => false];
    if (file_put_contents($target . '/PREPARED.json', json_encode($result, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR), LOCK_EX) === false) throw new RuntimeException('Cannot write completion marker.');
    return $result;
}

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    try {
        if ($argc !== 5) throw new RuntimeException('Usage: php prepare_private.php PACKAGE.zip SHA256 LIVE_DIRECTORY NEW_PRIVATE_DIRECTORY');
        if (DIRECTORY_SEPARATOR === '/') umask(0077);
        echo json_encode(prepareMusicPrivate($argv[1], $argv[2], $argv[3], $argv[4]), JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR) . PHP_EOL;
    } catch (Throwable $e) { fwrite(STDERR, 'Private preparation stopped: ' . $e->getMessage() . PHP_EOL); exit(1); }
}
