<?php
declare(strict_types=1);
// Installed packages keep PHP libraries outside the public document root.
$server = is_dir(dirname(__DIR__, 2) . '/server/lib') ? dirname(__DIR__, 2) . '/server' : dirname(__DIR__);
require_once $server . '/lib/Database.php';
require_once $server . '/lib/Auth.php';
