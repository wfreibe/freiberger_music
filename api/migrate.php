<?php
// freiberger.music — SQLite Schema Migration Runner

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function runMigrations(PDO $pdo, bool $verbose = false): int {
    // 1. Ensure migrations table exists
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // 2. Fetch already applied migration versions
    $appliedStmt = $pdo->query("SELECT version FROM schema_migrations");
    $applied = $appliedStmt->fetchAll(PDO::FETCH_COLUMN);
    $appliedSet = array_flip($applied);

    // 3. Scan migrations directory
    $migrationsDir = __DIR__ . '/migrations';
    if (!is_dir($migrationsDir)) {
        return 0;
    }

    $files = scandir($migrationsDir);
    if ($files === false) {
        return 0;
    }

    $migrationFiles = [];
    foreach ($files as $file) {
        if (preg_match('/^(\d+)_(.+)\.sql$/', $file, $matches)) {
            $version = (int)$matches[1];
            $name = $matches[2];
            $migrationFiles[$version] = [
                'file' => $file,
                'path' => $migrationsDir . '/' . $file,
                'name' => $name
            ];
        }
    }
    ksort($migrationFiles);

    $appliedCount = 0;

    foreach ($migrationFiles as $version => $info) {
        if (isset($appliedSet[$version])) {
            continue; // Already applied
        }

        if ($verbose) {
            echo "Applying migration {$info['file']}...\n";
        }

        $sql = file_get_contents($info['path']);
        if ($sql === false || trim($sql) === '') {
            continue;
        }

        // Split statements by semicolon to avoid multi-statement issues in SQLite
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            function($s) { return !empty($s); }
        );

        $pdo->beginTransaction();
        try {
            foreach ($statements as $stmt) {
                // Check if statement is an ADD COLUMN and column already exists
                if (preg_match('/ALTER\s+TABLE\s+(\w+)\s+ADD\s+COLUMN\s+(\w+)/i', $stmt, $m)) {
                    $table = $m[1];
                    $col = $m[2];
                    $colCheck = $pdo->query("PRAGMA table_info({$table})")->fetchAll(PDO::FETCH_ASSOC);
                    $exists = false;
                    foreach ($colCheck as $c) {
                        if (strcasecmp($c['name'], $col) === 0) {
                            $exists = true;
                            break;
                        }
                    }
                    if ($exists) {
                        continue; // Column already exists, skip statement
                    }
                }
                $pdo->exec($stmt);
            }

            $record = $pdo->prepare("INSERT INTO schema_migrations (version, name) VALUES (:version, :name)");
            $record->execute([
                ':version' => $version,
                ':name' => $info['name']
            ]);

            $pdo->commit();
            $appliedCount++;
            if ($verbose) {
                echo "  ✓ Migration {$info['file']} applied successfully.\n";
            }
        } catch (Throwable $e) {
            $pdo->rollBack();
            if ($verbose) {
                echo "  ❌ Migration {$info['file']} failed: " . $e->getMessage() . "\n";
            }
            throw $e;
        }
    }

    return $appliedCount;
}

// CLI Execution
if (php_sapi_name() === 'cli' && isset($argv[0]) && realpath($argv[0]) === realpath(__FILE__)) {
    echo "=== freiberger.music SQLite Schema Migrations ===\n";
    $pdo = getDbConnection();
    try {
        $count = runMigrations($pdo, true);
        echo "\nDone. Newly applied migrations: {$count}\n";
    } catch (Throwable $e) {
        echo "\nFailed: " . $e->getMessage() . "\n";
        exit(1);
    }
}
