<?php
// Script to populate SQLite database with Werner Freiberger's 12 YouTube Playlist videos

require_once __DIR__ . '/../api/bootstrap.php';

$pdo = getDbConnection();

// Read enriched videos JSON
$json = file_get_contents(__DIR__ . '/enriched_videos.json');
$videos = json_decode($json, true);

// Clear old releases and chapters
$pdo->exec("DELETE FROM releases");
$pdo->exec("DELETE FROM chapters");

// Ensure places exist
$placesMap = [
    'athens' => 3,
    'zakynthos' => 4,
    'corfu' => 8,
    'naxos' => 1,
    'santorini' => 2,
    'crete' => 5,
    'kos' => 7,
    'rhodes' => 6
];

$episodesMeta = [
    [
        'num' => 1,
        'slug' => 'kapitel-01-athen',
        'videoId' => 'mFlu63ixea0',
        'title' => 'Kapitel 1: Die Stadt über der Stadt',
        'subtitle' => 'Eine Erinnerung an Athen',
        'place' => 'athens',
        'bpm' => 120,
        'genre' => 'Story & Music / Future Garage',
        'featured' => 0
    ],
    [
        'num' => 2,
        'slug' => 'kapitel-02-zakynthos',
        'videoId' => 'SGIPOr37FGo',
        'title' => 'Kapitel 2: Jung genug, dem Horizont zu glauben',
        'subtitle' => 'Eine Erinnerung an Zakynthos',
        'place' => 'zakynthos',
        'bpm' => 124,
        'genre' => 'Story & Music / Future Garage',
        'featured' => 0
    ],
    [
        'num' => 3,
        'slug' => 'kapitel-03-korfu',
        'videoId' => 'QxlfYFukqPc',
        'title' => 'Kapitel 3: Grün, das keinen Horizont brauchte',
        'subtitle' => 'Eine Erinnerung an Korfu',
        'place' => 'corfu',
        'bpm' => 118,
        'genre' => 'Story & Music / Ambient',
        'featured' => 0
    ],
    [
        'num' => 4,
        'slug' => 'kapitel-04-piraeus-naxos',
        'videoId' => 'C987RXDOBXg',
        'title' => 'Kapitel 4: Die Ader hinaus in die Welt',
        'subtitle' => 'Von Athen nach Naxos',
        'place' => 'athens',
        'bpm' => 126,
        'genre' => 'Story & Music / Melodic Garage',
        'featured' => 0
    ],
    [
        'num' => 5,
        'slug' => 'kapitel-05-naxos',
        'videoId' => '_yDPQxWTi3k',
        'title' => 'Kapitel 5: Stimmen unter freiem Himmel',
        'subtitle' => 'Eine Erinnerung an Naxos',
        'place' => 'naxos',
        'bpm' => 128,
        'genre' => 'Story & Music / Future Garage',
        'featured' => 0
    ],
    [
        'num' => 6,
        'slug' => 'kapitel-06-santorini',
        'videoId' => '7GSmcCNjK-k',
        'title' => 'Kapitel 6: Der Sprung und der Fall',
        'subtitle' => 'Eine Erinnerung an Santorini',
        'place' => 'santorini',
        'bpm' => 125,
        'genre' => 'Story & Music / Future Garage',
        'featured' => 0
    ],
    [
        'num' => 7,
        'slug' => 'kapitel-07-kreta',
        'videoId' => '1BumkaxNeVc',
        'title' => 'Kapitel 7: Drei Motoren unter einem jungen Himmel',
        'subtitle' => 'Eine Erinnerung an Kreta',
        'place' => 'crete',
        'bpm' => 127,
        'genre' => 'Story & Music / Future Garage',
        'featured' => 0
    ],
    [
        'num' => 8,
        'slug' => 'kapitel-08-santorini-die-hand',
        'videoId' => 'qhopAuzIMpw',
        'title' => 'Kapitel 8: Die Hand, die bleibt',
        'subtitle' => 'Eine Erinnerung an Santorini',
        'place' => 'santorini',
        'bpm' => 122,
        'genre' => 'Story & Music / Deep Ambient',
        'featured' => 0
    ],
    [
        'num' => 9,
        'slug' => 'kapitel-09-naxos-das-tor',
        'videoId' => 'QnkkH3MLwF8',
        'title' => 'Kapitel 9: Das Tor, das uns wiedersah',
        'subtitle' => 'Eine Erinnerung an Naxos',
        'place' => 'naxos',
        'bpm' => 126,
        'genre' => 'Story & Music / Future Garage',
        'featured' => 0
    ],
    [
        'num' => 10,
        'slug' => 'kapitel-10-kos',
        'videoId' => '0VK8VV8YcEY',
        'title' => 'Kapitel 10: Vor dem ersten Schlag',
        'subtitle' => 'Eine Erinnerung an Kos',
        'place' => 'kos',
        'bpm' => 120,
        'genre' => 'Story & Music / Ambient Electronica',
        'featured' => 0
    ],
    [
        'num' => 11,
        'slug' => 'kapitel-11-rhodos',
        'videoId' => '4IrJb9gCyTc',
        'title' => 'Kapitel 11: Zwei Flaschen auf einem Tisch',
        'subtitle' => 'Eine Erinnerung an Rhodos',
        'place' => 'rhodes',
        'bpm' => 125,
        'genre' => 'Story & Music / Future Garage',
        'featured' => 0
    ],
    [
        'num' => 12,
        'slug' => 'epilog-was-das-meer-bewahrte',
        'videoId' => 'EsAG0h01TfE',
        'title' => 'Epilog: Was das Meer bewahrte',
        'subtitle' => 'Ein Rückblick auf Griechenland',
        'place' => 'naxos',
        'bpm' => 129,
        'genre' => 'Story & Music / Future Garage',
        'featured' => 1 // Highlighted on Home Stage!
    ]
];

$relStmt = $pdo->prepare("
    INSERT INTO releases (
        slug, title, subtitle, type, release_date, cover, youtube_id,
        youtube_playlist_id, genre, bpm, duration, description, story,
        place_id, chapter_id, series_id, featured, sort_order
    ) VALUES (
        :slug, :title, :subtitle, :type, :release_date, :cover, :youtube_id,
        :youtube_playlist_id, :genre, :bpm, :duration, :description, :story,
        :place_id, :chapter_id, :series_id, :featured, :sort_order
    )
");

$chStmt = $pdo->prepare("
    INSERT INTO chapters (
        book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order
    ) VALUES (
        :book_id, :chapter_number, :title, :subtitle, :place_id, :release_id, :excerpt, :sort_order
    )
");

foreach ($episodesMeta as $idx => $meta) {
    // Find matching enriched video
    $vData = null;
    foreach ($videos as $v) {
        if ($v['videoId'] === $meta['videoId']) {
            $vData = $v;
            break;
        }
    }

    $description = $vData['description'] ?? '';
    // Clean description paragraphs
    $descLines = explode("\n\n", trim($description));
    $shortDesc = $descLines[0] ?? '';
    $story = implode("\n\n", array_slice($descLines, 1));
    $duration = $vData['duration'] ?? '18:00';
    $placeId = $placesMap[$meta['place']] ?? 1;
    $cover = "/covers/episodes/{$meta['slug']}.jpg";

    // Insert Release
    $relStmt->execute([
        ':slug' => $meta['slug'],
        ':title' => $meta['title'],
        ':subtitle' => $meta['subtitle'],
        ':type' => 'chapter_audio',
        ':release_date' => '2026-03-01',
        ':cover' => $cover,
        ':youtube_id' => $meta['videoId'],
        ':youtube_playlist_id' => 'PLetVEDapYTxM',
        ':genre' => $meta['genre'],
        ':bpm' => $meta['bpm'],
        ':duration' => $duration,
        ':description' => $shortDesc,
        ':story' => $story,
        ':place_id' => $placeId,
        ':chapter_id' => null, // will link
        ':series_id' => 1,
        ':featured' => $meta['featured'],
        ':sort_order' => $meta['num']
    ]);

    $releaseId = (int)$pdo->lastInsertId();

    // Insert Chapter in Book 1 (Die Orte, die uns sahen)
    $chStmt->execute([
        ':book_id' => 1,
        ':chapter_number' => $meta['num'],
        ':title' => $meta['title'],
        ':subtitle' => $meta['subtitle'],
        ':place_id' => $placeId,
        ':release_id' => $releaseId,
        ':excerpt' => $shortDesc,
        ':sort_order' => $meta['num']
    ]);

    $chapterId = (int)$pdo->lastInsertId();

    // Cross-link release to chapter
    $pdo->prepare("UPDATE releases SET chapter_id = :chapter_id WHERE id = :id")
        ->execute([':chapter_id' => $chapterId, ':id' => $releaseId]);
}

// Update Book title to exact branding: Die Orte, die uns sahen
$pdo->exec("
    UPDATE books SET
        title = 'Die Orte, die uns sahen',
        subtitle = 'Als die Zukunft noch keinen Namen hatte'
    WHERE id = 1
");

echo "✓ Successfully imported all 12 official YouTube playlist videos into SQLite!\n";
