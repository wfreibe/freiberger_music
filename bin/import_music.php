<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit(1); }
require_once dirname(__DIR__) . '/lib/Database.php';
require_once dirname(__DIR__) . '/lib/DatabaseMaintenance.php';
try {
    $source = $argv[1] ?? '';
    $target = Database::getConfig()['db_path'] ?? '';
    if ($argc !== 2 || !is_file($source) || !is_string($target) || $target === '' || file_exists($target)) throw new RuntimeException('Usage: php bin/import_music.php SOURCE.sqlite; configured destination must not exist.');
    if (!is_dir(dirname($target)) && !mkdir(dirname($target), 0700, true)) throw new RuntimeException('Cannot create private data directory.');
    $db = new PDO('sqlite:' . $source, null, null, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::SQLITE_ATTR_OPEN_FLAGS=>PDO::SQLITE_OPEN_READONLY]);
    DatabaseMaintenance::verify($db);
    $db->exec('VACUUM INTO ' . $db->quote($target));
    PrivateStorage::file($target);
    $copy = DatabaseMaintenance::open($target); DatabaseMaintenance::verify($copy);
    foreach (['releases','places','books','chapters','series'] as $table) {
        $original = (int)$db->query("SELECT COUNT(*) FROM $table")->fetchColumn();
        $copied = (int)$copy->query("SELECT COUNT(*) FROM $table")->fetchColumn();
        if ($original !== $copied) throw new RuntimeException('Import counts do not match.');
        echo "$table: $copied records preserved\n";
    }
    echo "Verified copy created. Source unchanged. Run bin/migrate.php next.\n";
} catch (Throwable $e) { fwrite(STDERR, 'Import failed: ' . $e->getMessage() . PHP_EOL); exit(1); }
