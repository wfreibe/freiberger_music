<?php
declare(strict_types=1);

// Accept video IDs and common public YouTube links without fetching remote content.
function normalizeYouTubeVideoId(string $value): ?string {
    $value = trim($value);
    if ($value === '' || preg_match('/^[A-Za-z0-9_-]{11}$/D', $value)) return $value;
    $url = parse_url($value);
    if (!$url || !in_array(strtolower($url['scheme'] ?? ''), ['http', 'https'], true)) return null;
    $host = strtolower($url['host'] ?? '');
    $path = $url['path'] ?? '';
    $id = null;
    if ($host === 'youtu.be') {
        $id = trim($path, '/');
    } elseif (in_array($host, ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'], true)) {
        if ($path === '/watch') {
            parse_str($url['query'] ?? '', $query);
            $id = $query['v'] ?? null;
        } elseif (preg_match('~^/(?:embed|shorts|live)/([^/]+)/?$~', $path, $match)) {
            $id = $match[1];
        }
    }
    return is_string($id) && preg_match('/^[A-Za-z0-9_-]{11}$/D', $id) ? $id : null;
}

// Also support full URLs saved by older Studio versions, without changing the database.
function normalizeYouTubeResponse($data) {
    if (!is_array($data)) return $data;
    foreach ($data as $key => $value) {
        if (in_array($key, ['youtube_id', 'release_youtube_id'], true) && is_string($value)) {
            $data[$key] = normalizeYouTubeVideoId($value) ?? $value;
        } elseif (is_array($value)) {
            $data[$key] = normalizeYouTubeResponse($value);
        }
    }
    return $data;
}
