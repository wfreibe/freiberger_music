<?php
// freiberger.music — API Bootstrap

declare(strict_types=1);
require_once __DIR__ . '/youtube.php';
require_once __DIR__ . '/runtime.php';

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', '0');

// CORS & Security Headers

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Handle preflight requests
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Polyfills for PHP < 8.0
if (!function_exists('str_starts_with')) {
    function str_starts_with(string $haystack, string $needle): bool {
        return $needle === '' || strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}
if (!function_exists('str_ends_with')) {
    function str_ends_with(string $haystack, string $needle): bool {
        return $needle === '' || (strlen($haystack) >= strlen($needle) && substr_compare($haystack, $needle, -strlen($needle)) === 0);
    }
}
if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool {
        return $needle === '' || strpos($haystack, $needle) !== false;
    }
}

// JSON Output Helper
function jsonResponse($data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    if (!preg_match('#/api/cms(?:/|$)#', parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH))) $data = publicMusicContent($data);
    echo json_encode(normalizeYouTubeResponse($data), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function errorResponse(string $message, int $statusCode = 400): void {
    jsonResponse([
        'error' => true,
        'message' => $message,
        'timestamp' => time()
    ], $statusCode);
}

function getDbConnection(): PDO { return Database::getConnection(); }

function publicMusicContent($data) {
    if (!is_array($data)) return $data;
    if (array_key_exists('chapter_content_blocks', $data)) { global $server; require_once $server . '/lib/ContentBlocks.php'; $data['chapter_content_blocks']=ContentBlocks::response($data['chapter_content_blocks'],false); }
    if (array_key_exists('content_blocks', $data)) {
        global $server; require_once $server . '/lib/ContentBlocks.php';
        $data['content_blocks'] = ContentBlocks::response($data['content_blocks'], false);
        if (!array_filter($data['content_blocks'], static fn($b) => $b['type'] === 'legacy')) {
            foreach (['description','story','lyrics','excerpt','cover','image'] as $field) if (array_key_exists($field,$data)) $data[$field] = null;
        }
    }
    foreach ($data as $key => $value) if ($key !== 'content_blocks' && is_array($value)) $data[$key] = publicMusicContent($value);
    return $data;
}
