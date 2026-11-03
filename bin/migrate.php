<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit(1); }
require_once dirname(__DIR__) . '/lib/Database.php';
require_once dirname(__DIR__) . '/lib/DatabaseMaintenance.php';
try {
    $config = Database::getConfig();
    $path = $config['db_path'] ?? '';
    if ($argc !== 1 || !is_string($path) || !is_file($path)) {
        throw new RuntimeException('Existing music database required. Import a verified copy before migration.');
    }
    $db = DatabaseMaintenance::open($path);
    foreach (['releases', 'places', 'books', 'chapters', 'series'] as $table) {
        $stmt = $db->prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?");
        $stmt->execute([$table]);
        if (!$stmt->fetchColumn()) throw new RuntimeException('Incomplete music database.');
        $stmt->closeCursor();
    }
    $hasVersions = $db->query("SELECT name FROM sqlite_master WHERE name='music_schema_migrations'")->fetchAll();
    $applied = $hasVersions ? $db->query('SELECT version FROM music_schema_migrations')->fetchAll(PDO::FETCH_COLUMN) : [];
    $pending = array_filter(glob(dirname(__DIR__) . '/migrations/*.sql'), static function ($file) use ($applied) {
        return !in_array((int)basename($file), $applied);
    });
    if ($pending) {
        DatabaseMaintenance::backup($db, $config['backup_dir'] ?? '', 'pre_migration');
        $db->beginTransaction();
        try {
            $db->exec('CREATE TABLE IF NOT EXISTS music_schema_migrations (version INTEGER PRIMARY KEY)');
            foreach ($pending as $file) {
                $db->exec(file_get_contents($file));
                $db->prepare('INSERT INTO music_schema_migrations VALUES (?)')->execute([(int)basename($file)]);
            }
            DatabaseMaintenance::verify($db);
            $db->commit();
        } catch (Throwable $e) { if ($db->inTransaction()) $db->rollBack(); throw $e; }
    }
    DatabaseMaintenance::verify($db);
    echo 'Music migrations complete; integrity_check=ok; foreign_key_check=0' . PHP_EOL;
} catch (Throwable $e) { fwrite(STDERR, 'Music migration failed: ' . $e->getMessage() . PHP_EOL); exit(1); }
