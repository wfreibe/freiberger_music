<?php
// Router for the loopback-only PHP development server; never serve storage or source files.
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if (is_string($path) && ($path === '/api' || str_starts_with($path, '/api/'))) {
    require __DIR__ . '/../api/index.php';
    return;
}

if ($path === '/studio' || $path === '/studio/' || $path === '/studio/index.php') {
    require __DIR__ . '/../studio/index.php';
    return;
}
if ($path === '/studio/studio.css') {
    header('Content-Type: text/css; charset=utf-8');
    readfile(__DIR__ . '/../studio/studio.css');
    return;
}

http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo 'Not found';
