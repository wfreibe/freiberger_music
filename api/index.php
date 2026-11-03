<?php
// freiberger.music — API Main Router

try {
    require_once __DIR__ . '/bootstrap.php';

    if (preg_match('#/api/cms(?:/|$)#', parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH))) { require __DIR__ . '/cms.php'; exit; }
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') { header('Allow: GET'); errorResponse('Method not allowed', 405); }
    $pdo = getDbConnection();

// Extract route
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$parsedUri = parse_url($requestUri, PHP_URL_PATH);

// Normalize path relative to /api
// e.g. /freiberger-music/api/releases/foo or /api/releases/foo
$path = $parsedUri;
$pos = strpos($path, '/api');
if ($pos !== false) {
    $path = substr($path, $pos + 4);
}
// Trim leading and trailing slashes
$path = trim($path, '/');
// Strip .php if called directly (e.g., releases.php)
$path = preg_replace('/\.php$/', '', $path);

// Check fallback query param ?route=...
if (empty($path) && !empty($_GET['route'])) {
    $path = trim($_GET['route'], '/');
}

$segments = !empty($path) ? explode('/', $path) : [];
$resource = $segments[0] ?? 'info';
$identifier = $segments[1] ?? null;

// Route dispatching
switch ($resource) {
    case 'ready':
        $pdo->query('SELECT id FROM releases LIMIT 1');
        $pdo->query('SELECT credential_version FROM admin_credentials LIMIT 1');
        jsonResponse(['ready' => true]);
        break;
    case 'media':
        require_once $server . '/lib/MusicMedia.php';
        MusicMedia::serve($identifier ?? '');
        break;
    case '':
    case 'info':
        jsonResponse([
            'name' => 'freiberger.music API',
            'version' => '1.0.0',
            'description' => 'Audiovisual artist archive of places, music and memory',
            'endpoints' => [
                '/api/releases',
                '/api/releases/{slug}',
                '/api/places',
                '/api/places/{slug}',
                '/api/books',
                '/api/books/{slug}',
                '/api/series',
                '/api/search?q={query}'
            ]
        ]);
        break;

    case 'releases':
        if ($identifier) {
            // Single release by slug or id
            $stmt = $pdo->prepare("
                SELECT r.*,
                       p.name AS place_name, p.slug AS place_slug, p.tagline AS place_tagline, p.accent_color AS place_accent,
                       c.title AS chapter_title, c.chapter_number, c.subtitle AS chapter_subtitle,
                       s.title AS series_title, s.slug AS series_slug
                FROM releases r
                LEFT JOIN places p ON r.place_id = p.id
                LEFT JOIN chapters c ON r.chapter_id = c.id
                LEFT JOIN series s ON r.series_id = s.id
                WHERE r.slug = :slug OR r.id = :id
                LIMIT 1
            ");
            $stmt->execute([':slug' => $identifier, ':id' => is_numeric($identifier) ? (int)$identifier : 0]);
            $release = $stmt->fetch();

            if (!$release) {
                errorResponse("Release '{$identifier}' not found", 404);
            }
            jsonResponse($release);
        } else {
            // List releases
            $featured = isset($_GET['featured']) ? (int)$_GET['featured'] : null;
            $placeSlug = $_GET['place'] ?? null;
            $seriesSlug = $_GET['series'] ?? null;

            $sql = "
                SELECT r.*,
                       p.name AS place_name, p.slug AS place_slug, p.accent_color AS place_accent,
                       c.title AS chapter_title, c.chapter_number,
                       s.title AS series_title, s.slug AS series_slug
                FROM releases r
                LEFT JOIN places p ON r.place_id = p.id
                LEFT JOIN chapters c ON r.chapter_id = c.id
                LEFT JOIN series s ON r.series_id = s.id
                WHERE 1=1
            ";
            $params = [];

            if ($featured !== null) {
                $sql .= " AND r.featured = :featured";
                $params[':featured'] = $featured;
            }
            if ($placeSlug !== null) {
                $sql .= " AND p.slug = :place_slug";
                $params[':place_slug'] = $placeSlug;
            }
            $type = $_GET['type'] ?? null;
            if ($type !== null) {
                $sql .= " AND r.type = :type";
                $params[':type'] = $type;
            }
            if ($seriesSlug !== null) {
                $sql .= " AND s.slug = :series_slug";
                $params[':series_slug'] = $seriesSlug;
            }

            $sql .= " ORDER BY r.sort_order ASC, r.release_date DESC";

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $releases = $stmt->fetchAll();

            jsonResponse($releases);
        }
        break;

    case 'places':
        if ($identifier) {
            // Single place by slug
            $stmt = $pdo->prepare("SELECT * FROM places WHERE slug = :slug OR id = :id LIMIT 1");
            $stmt->execute([':slug' => $identifier, ':id' => is_numeric($identifier) ? (int)$identifier : 0]);
            $place = $stmt->fetch();

            if (!$place) {
                errorResponse("Place '{$identifier}' not found", 404);
            }

            // Fetch releases for this place
            $relStmt = $pdo->prepare("SELECT * FROM releases WHERE place_id = :place_id ORDER BY sort_order ASC");
            $relStmt->execute([':place_id' => $place['id']]);
            $place['releases'] = $relStmt->fetchAll();

            // Fetch chapters for this place
            $chStmt = $pdo->prepare("SELECT * FROM chapters WHERE place_id = :place_id ORDER BY chapter_number ASC");
            $chStmt->execute([':place_id' => $place['id']]);
            $place['chapters'] = $chStmt->fetchAll();

            jsonResponse($place);
        } else {
            // List all places with track counts
            $stmt = $pdo->query("
                SELECT p.*,
                       COUNT(r.id) AS track_count
                FROM places p
                LEFT JOIN releases r ON r.place_id = p.id
                GROUP BY p.id
                ORDER BY p.sort_order ASC
            ");
            $places = $stmt->fetchAll();
            jsonResponse($places);
        }
        break;

    case 'books':
        if ($identifier) {
            // Slug alias mapping (e.g. legacy/QR code 'die-orte-die-mich-sahen' -> 'die-orte-die-uns-sahen')
            $targetSlug = ($identifier === 'die-orte-die-mich-sahen') ? 'die-orte-die-uns-sahen' : $identifier;

            // Single book with its chapters and linked songs
            $stmt = $pdo->prepare("SELECT * FROM books WHERE is_published=1 AND (slug = :slug OR slug = :orig_slug OR id = :id) LIMIT 1");
            $stmt->execute([
                ':slug' => $targetSlug,
                ':orig_slug' => $identifier,
                ':id' => is_numeric($identifier) ? (int)$identifier : 0
            ]);
            $book = $stmt->fetch();

            if (!$book) {
                errorResponse("Book '{$identifier}' not found", 404);
            }

            // Chapters with linked place & release
            $chStmt = $pdo->prepare("
                SELECT c.*,
                       p.name AS place_name, p.slug AS place_slug, p.accent_color AS place_accent,
                       r.id AS release_id, r.title AS release_title, r.slug AS release_slug,
                       r.duration AS release_duration, r.bpm AS release_bpm, r.youtube_id AS release_youtube_id,
                       r.cover AS release_cover
                FROM chapters c
                LEFT JOIN places p ON c.place_id = p.id
                LEFT JOIN releases r ON c.release_id = r.id
                WHERE c.book_id = :book_id
                ORDER BY c.chapter_number ASC
            ");
            $chStmt->execute([':book_id' => $book['id']]);
            $book['chapters'] = $chStmt->fetchAll();

            jsonResponse($book);
        } else {
            $stmt = $pdo->query("SELECT * FROM books WHERE is_published=1 ORDER BY sort_order ASC, id ASC");
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'series':
        if ($identifier) {
            $stmt = $pdo->prepare("SELECT * FROM series WHERE slug = :slug LIMIT 1");
            $stmt->execute([':slug' => $identifier]);
            $series = $stmt->fetch();
            if (!$series) {
                errorResponse("Series '{$identifier}' not found", 404);
            }
            $relStmt = $pdo->prepare("
                SELECT r.*, p.name AS place_name, p.slug AS place_slug
                FROM releases r
                LEFT JOIN places p ON r.place_id = p.id
                WHERE r.series_id = :series_id
                ORDER BY r.sort_order ASC
            ");
            $relStmt->execute([':series_id' => $series['id']]);
            $series['releases'] = $relStmt->fetchAll();
            jsonResponse($series);
        } else {
            $stmt = $pdo->query("SELECT * FROM series ORDER BY sort_order ASC");
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'search':
        $query = trim($_GET['q'] ?? '');
        if (strlen($query) < 2) {
            jsonResponse(['releases' => [], 'places' => [], 'chapters' => []]);
        }

        $term = '%' . $query . '%';

        $relStmt = $pdo->prepare("
            SELECT id, slug, title, subtitle, cover, bpm, genre
            FROM releases
            WHERE title LIKE :q OR subtitle LIKE :q OR description LIKE :q OR story LIKE :q
            ORDER BY sort_order ASC LIMIT 8
        ");
        $relStmt->execute([':q' => $term]);

        $placeStmt = $pdo->prepare("
            SELECT id, slug, name, tagline
            FROM places
            WHERE name LIKE :q OR tagline LIKE :q OR description LIKE :q
            ORDER BY sort_order ASC LIMIT 5
        ");
        $placeStmt->execute([':q' => $term]);

        $chStmt = $pdo->prepare("
            SELECT c.id, c.chapter_number, c.title, c.subtitle, p.name AS place_name
            FROM chapters c
            LEFT JOIN places p ON c.place_id = p.id
            WHERE c.title LIKE :q OR c.subtitle LIKE :q OR c.excerpt LIKE :q
            ORDER BY c.chapter_number ASC LIMIT 5
        ");
        $chStmt->execute([':q' => $term]);

        jsonResponse([
            'query' => $query,
            'releases' => $relStmt->fetchAll(),
            'places' => $placeStmt->fetchAll(),
            'chapters' => $chStmt->fetchAll()
        ]);
        break;

    default:
        errorResponse("Unknown API resource '{$resource}'", 404);
        break;
}
} catch (\Throwable $e) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode([
        'error' => true,
        'message' => 'Service temporarily unavailable',
        
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}
