<?php
// Comprehensive database seeder with Songs (PLIcnGWUVhwf4) and Audiobooks (PLetVEDapYTxM)

require_once __DIR__ . '/../api/bootstrap.php';

$pdo = getDbConnection();

$pdo->exec("DELETE FROM releases");
$pdo->exec("DELETE FROM chapters");
$pdo->exec("DELETE FROM books");
$pdo->exec("DELETE FROM series");

// Seed Series
$pdo->exec("
    INSERT INTO series (id, slug, title, description, sort_order) VALUES
    (1, 'the-greece-chapters', 'THE GREECE CHAPTERS', 'Der offizielle Soundtrack zum Buch Die Orte, die uns sahen.', 1),
    (2, 'hoerbuch-die-orte-die-uns-sahen', 'DAS HÖRBUCH', 'Die ungekürzte Autorenlesung mit atmosphärischen Klanglandschaften.', 2)
");

// Seed Book
$pdo->exec("
    INSERT INTO books (id, slug, title, subtitle, author, description, cover, release_year, formats) VALUES
    (
        1,
        'die-orte-die-uns-sahen',
        'Die Orte, die uns sahen',
        'Als die Zukunft noch keinen Namen hatte',
        'Werner Freiberger',
        'Eine biografisch-poetische Reise durch Griechenland. Elf Kapitel und ein Epilog erzählen von Jugend, Freiheit, Aufbrüchen, Freundschaft und den Schauplätzen, die als Musik und Erinnerung weiterleben.',
        '/covers/books/die-orte-die-mich-sahen.svg',
        2026,
        'BUCH · E-BOOK · HÖRBUCH · MUSIK'
    )
");

// Read Enriched Data
$songsJson = json_decode(file_get_contents(__DIR__ . '/enriched_songs.json'), true);
$audiobooksJson = json_decode(file_get_contents(__DIR__ . '/enriched_videos.json'), true);

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

// 1. Insert the 10 Songs in exact specified order
$songsMeta = [
    [
        'slug' => 'bevor-das-licht-einen-namen-hatte',
        'videoId' => 'dvLEsXrZXJ8',
        'title' => 'Bevor das Licht einen Namen hatte',
        'subtitle' => 'Von Delos nach Delphi',
        'place' => 'athens',
        'bpm' => 134,
        'genre' => 'Mythic Aegean Future Garage',
        'featured' => 1,
        'sort_order' => 1
    ],
    [
        'slug' => 'das-meer-das-uns-bewahrte',
        'videoId' => 'd87nefPuDgU',
        'title' => 'Das Meer, das uns bewahrte',
        'subtitle' => 'Eine Erinnerung an Zakynthos & Marathonisi',
        'place' => 'zakynthos',
        'bpm' => 124,
        'genre' => 'Ionian Ritual Trip-Hop / Future Garage',
        'featured' => 0,
        'sort_order' => 2
    ],
    [
        'slug' => 'wo-das-gruen-uns-wiederfand',
        'videoId' => '5WFzRxamMPs',
        'title' => 'Wo das Grün uns wiederfand',
        'subtitle' => 'Eine Erinnerung an Korfu & Korkyra',
        'place' => 'corfu',
        'bpm' => 118,
        'genre' => 'Ionian Future Garage / Ambient 2-Step',
        'featured' => 0,
        'sort_order' => 3
    ],
    [
        'slug' => 'die-stadt-die-mich-sah',
        'videoId' => '3-_lDTXqijw',
        'title' => 'Die Stadt, die mich sah',
        'subtitle' => 'Eine Erinnerung an Athen',
        'place' => 'athens',
        'bpm' => 124,
        'genre' => 'Dark Atmospheric 2-Step / Future Garage',
        'featured' => 0,
        'sort_order' => 4
    ],
    [
        'slug' => 'der-himmel-kannte-unsere-namen',
        'videoId' => 'ZSzFRGumV9Q',
        'title' => 'Der Himmel kannte unsere Namen',
        'subtitle' => 'Eine Reise durch Kreta',
        'place' => 'crete',
        'bpm' => 127,
        'genre' => 'Cretan Ritual Future Garage',
        'featured' => 0,
        'sort_order' => 5
    ],
    [
        'slug' => 'wo-die-asche-atmet',
        'videoId' => 'YTb6bBPs7sc',
        'title' => 'Wo die Asche atmet',
        'subtitle' => 'Eine Erinnerung an Santorini & Akrotiri',
        'place' => 'santorini',
        'bpm' => 125,
        'genre' => 'Dark Aegean Deep House',
        'featured' => 0,
        'sort_order' => 6
    ],
    [
        'slug' => 'als-der-horizont-uns-wiedersah',
        'videoId' => '3iGRwql0ug8',
        'title' => 'Als der Horizont uns wiedersah',
        'subtitle' => 'Eine Rückkehr nach Naxos',
        'place' => 'naxos',
        'bpm' => 129,
        'genre' => 'Mythic Cycladic Future Garage',
        'featured' => 0,
        'sort_order' => 7
    ],
    [
        'slug' => 'bis-unter-dem-wasser-wieder-land-erscheint',
        'videoId' => 'pVy3cQxnpm0',
        'title' => 'Bis unter dem Wasser wieder Land erscheint',
        'subtitle' => 'Eine Reise nach Rhodos & Helios',
        'place' => 'rhodes',
        'bpm' => 129,
        'genre' => 'Cinematic Rhodian Future Garage',
        'featured' => 0,
        'sort_order' => 8
    ],
    [
        'slug' => 'der-puls-der-uns-verband',
        'videoId' => 'gonZwH0MBlU',
        'title' => 'Der Puls, der uns verband',
        'subtitle' => 'Eine Erinnerung an Kos & Nisyros',
        'place' => 'kos',
        'bpm' => 126,
        'genre' => 'German Future Garage / 2-Step',
        'featured' => 0,
        'sort_order' => 9
    ],
    [
        'slug' => 'was-das-meer-bewahrte',
        'videoId' => 'UbpEoFPuQEo',
        'title' => 'Was das Meer bewahrte',
        'subtitle' => 'Between horizon and stone',
        'place' => 'naxos',
        'bpm' => 129,
        'genre' => 'Cinematic Ritual Future Garage',
        'featured' => 0,
        'sort_order' => 10
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

foreach ($songsMeta as $meta) {
    $vData = null;
    foreach ($songsJson as $s) {
        if ($s['videoId'] === $meta['videoId']) {
            $vData = $s;
            break;
        }
    }

    $description = $vData['description'] ?? '';
    $descLines = explode("\n\n", trim($description));
    $shortDesc = $descLines[0] ?? $meta['subtitle'];
    $story = implode("\n\n", array_slice($descLines, 1));
    $duration = $vData['duration'] ?? '06:30';
    $cover = "/covers/songs/{$meta['slug']}.jpg";
    $placeId = $placesMap[$meta['place']] ?? 1;

    $relStmt->execute([
        ':slug' => $meta['slug'],
        ':title' => $meta['title'],
        ':subtitle' => $meta['subtitle'],
        ':type' => 'song',
        ':release_date' => '2026-03-01',
        ':cover' => $cover,
        ':youtube_id' => $meta['videoId'],
        ':youtube_playlist_id' => 'PLIcnGWUVhwf4',
        ':genre' => $meta['genre'],
        ':bpm' => $meta['bpm'],
        ':duration' => $duration,
        ':description' => $shortDesc,
        ':story' => $story,
        ':place_id' => $placeId,
        ':chapter_id' => null,
        ':series_id' => 1,
        ':featured' => $meta['featured'],
        ':sort_order' => $meta['sort_order']
    ]);
}

// 2. Insert the 12 Audiobook Episodes & Chapters
$audiobookMeta = [
    ['num' => 1, 'slug' => 'hoerbuch-kapitel-01-athen', 'videoId' => 'mFlu63ixea0', 'title' => 'Kapitel 1: Die Stadt über der Stadt', 'subtitle' => 'Eine Erinnerung an Athen', 'place' => 'athens', 'song_slug' => 'die-stadt-die-mich-sah'],
    ['num' => 2, 'slug' => 'hoerbuch-kapitel-02-zakynthos', 'videoId' => 'SGIPOr37FGo', 'title' => 'Kapitel 2: Jung genug, dem Horizont zu glauben', 'subtitle' => 'Eine Erinnerung an Zakynthos', 'place' => 'zakynthos', 'song_slug' => 'das-meer-das-uns-bewahrte'],
    ['num' => 3, 'slug' => 'hoerbuch-kapitel-03-korfu', 'videoId' => 'QxlfYFukqPc', 'title' => 'Kapitel 3: Grün, das keinen Horizont brauchte', 'subtitle' => 'Eine Erinnerung an Korfu', 'place' => 'corfu', 'song_slug' => 'wo-das-gruen-uns-wiederfand'],
    ['num' => 4, 'slug' => 'hoerbuch-kapitel-04-piraeus-naxos', 'videoId' => 'C987RXDOBXg', 'title' => 'Kapitel 4: Die Ader hinaus in die Welt', 'subtitle' => 'Von Athen nach Naxos', 'place' => 'athens', 'song_slug' => 'bevor-das-licht-einen-namen-hatte'],
    ['num' => 5, 'slug' => 'hoerbuch-kapitel-05-naxos', 'videoId' => '_yDPQxWTi3k', 'title' => 'Kapitel 5: Stimmen unter freiem Himmel', 'subtitle' => 'Eine Erinnerung an Naxos', 'place' => 'naxos', 'song_slug' => 'als-der-horizont-uns-wiedersah'],
    ['num' => 6, 'slug' => 'hoerbuch-kapitel-06-santorini', 'videoId' => '7GSmcCNjK-k', 'title' => 'Kapitel 6: Der Sprung und der Fall', 'subtitle' => 'Eine Erinnerung an Santorini', 'place' => 'santorini', 'song_slug' => 'wo-die-asche-atmet'],
    ['num' => 7, 'slug' => 'hoerbuch-kapitel-07-kreta', 'videoId' => '1BumkaxNeVc', 'title' => 'Kapitel 7: Drei Motoren unter einem jungen Himmel', 'subtitle' => 'Eine Erinnerung an Kreta', 'place' => 'crete', 'song_slug' => 'der-himmel-kannte-unsere-namen'],
    ['num' => 8, 'slug' => 'hoerbuch-kapitel-08-santorini-die-hand', 'videoId' => 'qhopAuzIMpw', 'title' => 'Kapitel 8: Die Hand, die bleibt', 'subtitle' => 'Eine Erinnerung an Santorini', 'place' => 'santorini', 'song_slug' => 'wo-die-asche-atmet'],
    ['num' => 9, 'slug' => 'hoerbuch-kapitel-09-naxos-das-tor', 'videoId' => 'QnkkH3MLwF8', 'title' => 'Kapitel 9: Das Tor, das uns wiedersah', 'subtitle' => 'Eine Erinnerung an Naxos', 'place' => 'naxos', 'song_slug' => 'als-der-horizont-uns-wiedersah'],
    ['num' => 10, 'slug' => 'hoerbuch-kapitel-10-kos', 'videoId' => '0VK8VV8YcEY', 'title' => 'Kapitel 10: Vor dem ersten Schlag', 'subtitle' => 'Eine Erinnerung an Kos', 'place' => 'kos', 'song_slug' => 'der-puls-der-uns-verband'],
    ['num' => 11, 'slug' => 'hoerbuch-kapitel-11-rhodos', 'videoId' => '4IrJb9gCyTc', 'title' => 'Kapitel 11: Zwei Flaschen auf einem Tisch', 'subtitle' => 'Eine Erinnerung an Rhodos', 'place' => 'rhodes', 'song_slug' => 'bis-unter-dem-wasser-wieder-land-erscheint'],
    ['num' => 12, 'slug' => 'hoerbuch-epilog-was-das-meer-bewahrte', 'videoId' => 'EsAG0h01TfE', 'title' => 'Epilog: Was das Meer bewahrte', 'subtitle' => 'Ein Rückblick auf Griechenland', 'place' => 'naxos', 'song_slug' => 'was-das-meer-bewahrte']
];

$chStmt = $pdo->prepare("
    INSERT INTO chapters (
        book_id, chapter_number, title, subtitle, place_id, release_id, excerpt, sort_order
    ) VALUES (
        :book_id, :chapter_number, :title, :subtitle, :place_id, :release_id, :excerpt, :sort_order
    )
");

foreach ($audiobookMeta as $meta) {
    $vData = null;
    foreach ($audiobooksJson as $ab) {
        if ($ab['videoId'] === $meta['videoId']) {
            $vData = $ab;
            break;
        }
    }

    $description = $vData['description'] ?? '';
    $descLines = explode("\n\n", trim($description));
    $shortDesc = $descLines[0] ?? $meta['subtitle'];
    $story = implode("\n\n", array_slice($descLines, 1));
    $duration = $vData['duration'] ?? '18:00';
    $cover = "/covers/episodes/" . str_replace('hoerbuch-', '', $meta['slug']) . ".jpg";
    $placeId = $placesMap[$meta['place']] ?? 1;

    // Find companion song ID
    $songStmt = $pdo->prepare("SELECT id FROM releases WHERE slug = :slug LIMIT 1");
    $songStmt->execute([':slug' => $meta['song_slug']]);
    $songId = $songStmt->fetchColumn() ?: null;

    // Insert Audiobook Release
    $relStmt->execute([
        ':slug' => $meta['slug'],
        ':title' => $meta['title'],
        ':subtitle' => $meta['subtitle'],
        ':type' => 'audiobook',
        ':release_date' => '2026-03-01',
        ':cover' => $cover,
        ':youtube_id' => $meta['videoId'],
        ':youtube_playlist_id' => 'PLetVEDapYTxM',
        ':genre' => 'Hörbuch / Autorenlesung',
        ':bpm' => null,
        ':duration' => $duration,
        ':description' => $shortDesc,
        ':story' => $story,
        ':place_id' => $placeId,
        ':chapter_id' => null,
        ':series_id' => 2,
        ':featured' => 0,
        ':sort_order' => 100 + $meta['num']
    ]);

    $audiobookReleaseId = (int)$pdo->lastInsertId();

    // Insert Chapter pointing to companion Song
    $chStmt->execute([
        ':book_id' => 1,
        ':chapter_number' => $meta['num'],
        ':title' => $meta['title'],
        ':subtitle' => $meta['subtitle'],
        ':place_id' => $placeId,
        ':release_id' => $songId ?: $audiobookReleaseId,
        ':excerpt' => $shortDesc,
        ':sort_order' => $meta['num']
    ]);

    $chapterId = (int)$pdo->lastInsertId();

    // Link chapter back
    $pdo->prepare("UPDATE releases SET chapter_id = :chapter_id WHERE id = :id")
        ->execute([':chapter_id' => $chapterId, ':id' => $audiobookReleaseId]);
}

echo "✓ Successfully imported 10 Songs & 12 Audiobooks into SQLite!\n";
