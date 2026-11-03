<?php
// Dump current SQLite schema & data to api/schema.sql

require_once __DIR__ . '/../api/bootstrap.php';

$pdo = getDbConnection();

$tables = ['places', 'series', 'books', 'chapters', 'releases'];
$sqlDump = "-- Schema & Seed Data for freiberger.music\n-- Includes audiobook playlists PLYjciFHvZoyU (DE) and PLbf_CjWtjwr0 (FR)\n\nPRAGMA foreign_keys = ON;\n\n";

foreach ($tables as $table) {
    // Get table DDL
    $stmt = $pdo->query("SELECT sql FROM sqlite_master WHERE type='table' AND name='{$table}'");
    $ddl = $stmt->fetchColumn();
    $sqlDump .= "DROP TABLE IF EXISTS {$table};\n";
    $sqlDump .= $ddl . ";\n\n";

    // Get rows
    $rows = $pdo->query("SELECT * FROM {$table}")->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($rows)) {
        foreach ($rows as $row) {
            $cols = array_keys($row);
            $vals = array_map(function($val) use ($pdo) {
                if ($val === null) return 'NULL';
                return $pdo->quote((string)$val);
            }, array_values($row));

            $sqlDump .= "INSERT INTO {$table} (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $vals) . ");\n";
        }
        $sqlDump .= "\n";
    }
}

file_put_contents(__DIR__ . '/../api/schema.sql', $sqlDump);
echo "✓ Successfully updated api/schema.sql with all official playlist data!\n";

