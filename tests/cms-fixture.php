<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') exit(1);
require_once dirname(__DIR__) . '/lib/Database.php';
$path = getenv('CMS_DB_PATH');
if (!$path || file_exists($path)) exit(1);
$db = new PDO('sqlite:' . $path, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
// Production schema with synthetic rows only; no local or live database is read.
$schema = file_get_contents(dirname(__DIR__) . '/api/schema.sql');
preg_match_all('/CREATE TABLE\s+\w+\s*\([\s\S]*?\);/', $schema, $tables);
foreach ($tables[0] as $sql) $db->exec($sql);
$db->exec("INSERT INTO places(id,slug,name) VALUES(1,'test-island','Test Island'); INSERT INTO series(id,slug,title) VALUES(1,'test-series','Test Series'); INSERT INTO books(id,slug,title) VALUES(1,'test-book','Test Book'); INSERT INTO releases(id,slug,title,type,youtube_id) VALUES(1,'test-song','Test Song','song','dvLEsXrZXJ8');");
echo "Synthetic music fixture ready\n";
