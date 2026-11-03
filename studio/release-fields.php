<?php
declare(strict_types=1);
require_once __DIR__ . '/../api/youtube.php';

const RELEASE_TYPES = [
    'song' => 'Song (Buch-Soundtrack)', 'audiobook' => 'Hörbuch', 'gard7' => 'GARD 7',
    'single' => 'Single', 'ep' => 'EP', 'album' => 'Album', 'chapter_audio' => 'Audio-Kapitel',
];

function prepareReleaseMediaFields(array $input, array $existing = []): array {
    $type = $input['type'] ?? $existing['type'] ?? 'single';
    if (!is_string($type) || !array_key_exists($type, RELEASE_TYPES)) {
        throw new InvalidArgumentException('Bitte einen gültigen Inhaltstyp auswählen.');
    }
    $rawVideo = $input['youtube_id'] ?? $existing['youtube_id'] ?? '';
    $video = is_string($rawVideo) ? normalizeYouTubeVideoId($rawVideo) : null;
    if ($video === null) {
        throw new InvalidArgumentException('Bitte eine gültige YouTube-Video-ID oder einen YouTube-Video-Link eingeben.');
    }
    $playlist = $input['youtube_playlist_id'] ?? $existing['youtube_playlist_id'] ?? '';
    if (!is_string($playlist)) throw new InvalidArgumentException('Ungültige Playlist-ID.');
    return ['type' => $type, 'youtube_id' => $video, 'youtube_playlist_id' => trim($playlist)];
}
