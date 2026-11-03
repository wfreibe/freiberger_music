<?php
/**
 * freiberger.music — SPA Pre-renderer & Dynamic OpenGraph Inserter
 *
 * Serves index.html with dynamically injected SEO <meta> tags and
 * crawler-friendly <noscript> content based on the requested route.
 * Preact takes over hydration on the client side without conflict.
 */

// 0. Polyfills for broad PHP compatibility (PHP 7.4 - 8.3+)
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

// 0b. Global Failsafe: Any unexpected runtime error falls back to serving clean index.html
try {

    // 1. Locate and read base index.html
    $htmlPath = __DIR__ . '/index.html';
    if (!file_exists($htmlPath)) {
        http_response_code(503);
        echo '<!DOCTYPE html><html><head><title>freiberger.music</title></head><body>Service Unavailable: index.html not found.</body></html>';
        return;
    }

    $html = file_get_contents($htmlPath);
    if ($html === false) {
        http_response_code(500);
        echo 'Error loading index.html';
        return;
    }

    // 2. Determine base URL and canonical host
    $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'freiberger.music';
    $rawUri = $_SERVER['REQUEST_URI'] ?? '/';

    // Parse path and strip query params
    $parsedPath = parse_url($rawUri, PHP_URL_PATH) ?? '/';

    // Determine subfolder prefix (e.g. /freiberger-music on local XAMPP)
    $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
    $route = $parsedPath;
    if ($scriptDir !== '' && str_starts_with($route, $scriptDir)) {
        $route = substr($route, strlen($scriptDir));
    }
    $route = '/' . ltrim($route, '/');
    if (strlen($route) > 1 && str_ends_with($route, '/')) {
        $route = rtrim($route, '/');
    }

    if ($route === '/the_places_that_saw_us') {
        $route = '/the-places-that-saw-us';
    }

    $baseUrl = $scheme . '://' . $host . ($scriptDir ? $scriptDir : '');
    $canonicalUrl = $baseUrl . ($route === '/' ? '' : $route);
    $defaultOgImage = $baseUrl . '/covers/og-share.jpg';

    // 3. Database connection helper (failsafe)
    if (!function_exists('freiberger_get_db')) {
        function freiberger_get_db(): ?PDO {
            static $db = null;
            if ($db !== null) return $db;
            if (!extension_loaded('pdo_sqlite')) return null;
            try {
                require_once __DIR__ . '/api/runtime.php';
                $db = Database::getConnection();
                return $db;
            } catch (\Throwable $e) {
                return null;
            }
        }
    }

    // 4. Default metadata
    $pageTitle = 'FREIBERGER · music · stories · places · memories';
    $pageDesc = 'MUSIC FROM PLACES THAT REMEMBER · Der offizielle Soundtrack und das ungekürzte Hörbuch zu den Schauplätzen in Griechenland von Werner Freiberger.';
    $ogImage = $defaultOgImage;
    $noscriptHtml = '';

    // 5. Route dispatch
    $db = freiberger_get_db();

    if ($route === '/die-orte-die-uns-sahen' || $route === '/die-orte-die-mich-sahen') {
        $pageTitle = 'Die Orte, die uns sahen — Buch & Hörbuch | FREIBERGER';
        $pageDesc = 'Eine biografisch-poetische Reise durch Griechenland. Elf Kapitel und ein Epilog von Werner Freiberger – als Buch, ungekürztes Hörbuch und Soundtrack.';
        
        $chaptersList = '';
        if ($db) {
            try {
                $stmt = $db->query("SELECT chapter_number, title, subtitle FROM chapters WHERE book_id = 1 ORDER BY CAST(chapter_number AS INTEGER) ASC");
                $rows = $stmt->fetchAll();
                foreach ($rows as $row) {
                    $chaptersList .= '<li><strong>Kapitel ' . htmlspecialchars((string)$row['chapter_number']) . ': ' . htmlspecialchars($row['title']) . '</strong>' . ($row['subtitle'] ? ' – ' . htmlspecialchars($row['subtitle']) : '') . '</li>';
                }
            } catch (\Throwable $e) {}
        }

        $noscriptHtml = '<article class="seo-content">'
            . '<h1>Die Orte, die uns sahen</h1>'
            . '<p class="subtitle">Als die Zukunft noch keinen Namen hatte · Ein Werk von Werner Freiberger</p>'
            . '<p>Eine biografisch-poetische Reise durch Griechenland. Elf Kapitel und ein Epilog erzählen von Jugend, Freiheit, Aufbrüchen, Freundschaft und den Schauplätzen, die als Musik und Erinnerung weiterleben.</p>'
            . '<p>Formate: BUCH · E-BOOK · HÖRBUCH · MUSIK (2026)</p>'
            . ($chaptersList ? '<h2>Kapitelübersicht</h2><ul>' . $chaptersList . '</ul>' : '')
            . '</article>';

    } elseif ($route === '/the-places-that-saw-us') {
        $pageTitle = 'The Places That Saw Us — Book & Soundtrack | FREIBERGER';
        $pageDesc = 'The English edition of The Places That Saw Us by Werner Freiberger. Discover the accompanying soundtrack. Audiobook coming soon.';
        $noscriptHtml = '<article class="seo-content" lang="en">'
            . '<h1>The Places That Saw Us</h1>'
            . '<p>By Werner Freiberger</p>'
            . '<p>The soundtrack to the English edition.</p>'
            . '<h2>Audiobook</h2><p>Coming soon</p>'
            . '</article>';

    } elseif ($route === '/les-lieux-qui-nous-ont-vus') {
        $pageTitle = 'Les lieux qui nous ont vus — Livre & musique | FREIBERGER';
        $pageDesc = 'L’édition française de Werner Freiberger, accompagnée des chansons en allemand. Livre audio en français disponible.';
        $noscriptHtml = '<article class="seo-content" lang="fr">'
            . '<h1>Les lieux qui nous ont vus</h1><p>Werner Freiberger</p>'
            . '<p>Découvrez les chansons en allemand qui accompagnent le livre.</p>'
            . '<h2>Livre audio</h2><p>Écoutez les douze chapitres en français.</p></article>';

    } elseif (str_starts_with($route, '/places/')) {
        $slug = substr($route, strlen('/places/'));
        $place = null;
        if ($db && $slug) {
            try {
                $stmt = $db->prepare("SELECT * FROM places WHERE slug = :slug LIMIT 1");
                $stmt->execute([':slug' => $slug]);
                $place = $stmt->fetch();
            } catch (\Throwable $e) {}
        }

        if ($place) {
            $placeName = htmlspecialchars($place['name'] ?? '');
            $greekName = htmlspecialchars($place['greek_name'] ?? '');
            $tagline = htmlspecialchars($place['tagline'] ?? '');
            $desc = htmlspecialchars($place['description'] ?? '');
            $coords = htmlspecialchars($place['coordinates'] ?? '');

            $pageTitle = $placeName . ' (' . $greekName . ') — Schauplätze & Musik | FREIBERGER';
            $pageDesc = ($place['tagline'] ? $place['tagline'] . ' — ' : '') . $place['description'];

            // Fetch tracks for this place
            $tracksList = '';
            if ($db) {
                try {
                    $tStmt = $db->prepare("SELECT title, subtitle, genre, duration FROM releases WHERE place_id = :pid ORDER BY sort_order ASC");
                    $tStmt->execute([':pid' => $place['id']]);
                    $tracks = $tStmt->fetchAll();
                    foreach ($tracks as $tr) {
                        $tracksList .= '<li>' . htmlspecialchars($tr['title']) . ($tr['subtitle'] ? ' (' . htmlspecialchars($tr['subtitle']) . ')' : '') . ' – ' . htmlspecialchars($tr['genre'] ?? 'Future Garage') . '</li>';
                    }
                } catch (\Throwable $e) {}
            }

            $noscriptHtml = '<article class="seo-content">'
                . '<h1>' . $placeName . ' (' . $greekName . ')</h1>'
                . '<p class="tagline"><strong>' . $tagline . '</strong></p>'
                . '<p>' . $desc . '</p>'
                . ($coords ? '<p>Koordinaten: ' . $coords . '</p>' : '')
                . ($tracksList ? '<h2>Musik an diesem Ort</h2><ul>' . $tracksList . '</ul>' : '')
                . '<p><a href="' . htmlspecialchars($baseUrl) . '/places">← Zurück zur Schauplatz-Übersicht</a></p>'
                . '</article>';
        } else {
            $pageTitle = 'Schauplatz — FREIBERGER';
        }

    } elseif ($route === '/places') {
        $pageTitle = 'Schauplätze & Musik — Ägäis & Ionisches Meer | FREIBERGER';
        $pageDesc = 'Erkunde die griechischen Schauplätze aus Die Orte, die uns sahen: Athen, Naxos, Santorini, Kreta, Korfu, Zakynthos, Rhodos und Kos.';

        $placesList = '';
        if ($db) {
            try {
                $stmt = $db->query("SELECT slug, name, greek_name, tagline FROM places ORDER BY sort_order ASC");
                $rows = $stmt->fetchAll();
                foreach ($rows as $row) {
                    $placesList .= '<li><a href="' . htmlspecialchars($baseUrl) . '/places/' . htmlspecialchars($row['slug']) . '">'
                        . '<strong>' . htmlspecialchars($row['name']) . ' (' . htmlspecialchars($row['greek_name']) . ')</strong></a>'
                        . ($row['tagline'] ? ' – ' . htmlspecialchars($row['tagline']) : '')
                        . '</li>';
                }
            } catch (\Throwable $e) {}
        }

        $noscriptHtml = '<article class="seo-content">'
            . '<h1>Schauplätze in Griechenland</h1>'
            . '<p>Eine Reise durch die Klanglandschaften und Schauplätze aus dem Werk „Die Orte, die uns sahen“.</p>'
            . ($placesList ? '<ul>' . $placesList . '</ul>' : '')
            . '</article>';

    } elseif ($route === '/gard-7' || $route === '/gard7') {
        $pageTitle = 'GARD 7 — Künstler & Audiovisuelle Produktionen | FREIBERGER';
        $pageDesc = 'Die Songs, Beats und audiovisuellen Produktionen von GARD 7. Ein eigener Kosmos aus modernen elektronischen Klangwelten und Musikvideos.';

        $gardTracks = '';
        if ($db) {
            try {
                $stmt = $db->query("SELECT title, subtitle, genre, duration, youtube_id FROM releases WHERE type = 'gard7' OR series_id IN (SELECT id FROM series WHERE slug = 'gard-7') ORDER BY sort_order ASC");
                $rows = $stmt->fetchAll();
                foreach ($rows as $tr) {
                    $gardTracks .= '<li><strong>' . htmlspecialchars($tr['title']) . '</strong>'
                        . ($tr['subtitle'] ? ' – ' . htmlspecialchars($tr['subtitle']) : '')
                        . ($tr['genre'] ? ' [' . htmlspecialchars($tr['genre']) . ']' : '')
                        . '</li>';
                }
            } catch (\Throwable $e) {}
        }

        $noscriptHtml = '<article class="seo-content">'
            . '<h1>GARD 7</h1>'
            . '<p class="tagline">KÜNSTLER & PRODUKTIONEN</p>'
            . '<p>Die Songs, Beats und audiovisuellen Produktionen von GARD 7. Ein eigener Kosmos aus modernen elektronischen Klangwelten und Videos.</p>'
            . ($gardTracks ? '<h2>Song-Videos & Tracks</h2><ul>' . $gardTracks . '</ul>' : '')
            . '</article>';

    } elseif ($route === '/impressum' || $route === '/datenschutz' || $route === '/legal') {
        $pageTitle = 'Impressum & Datenschutz | FREIBERGER';
        $pageDesc = 'Impressum, Angaben gemäß § 5 TMG und Datenschutzerklärung für freiberger.music.';

        $noscriptHtml = '<article class="seo-content">'
            . '<h1>Impressum & Datenschutz</h1>'
            . '<p>Angaben gemäß § 5 TMG / Verantwortlich für den Inhalt:</p>'
            . '<p>Werner Freiberger · freiberger.music</p>'
            . '<p>100% werbe- und trackingfrei. Keine Analyse-Cookies oder externe Werbedienste.</p>'
            . '</article>';

    } else {
        // Default homepage
        $pageTitle = 'Musik & Hörbücher | FREIBERGER';
        $pageDesc = 'Musikvideos, Songs und Hörbücher von FREIBERGER und GARD 7. Alle Veröffentlichungen mit Filtern nach Inhalt und Sprache.';
        $noscriptHtml = '<article class="seo-content">'
            . '<h1>FREIBERGER — Musik &amp; Hörbücher</h1>'
            . '<p>Entdecke Musikvideos, Songs und Hörbücher von FREIBERGER und GARD 7.</p>'
            . '<p>Alle Veröffentlichungen mit Filtern nach Musik, Hörbüchern und der Sprache des Inhalts.</p>'
            . '</article>';
    }

    // 6. Perform string replacements on HTML template
    // Title
    $html = preg_replace('/<title>.*?<\/title>/is', '<title>' . htmlspecialchars($pageTitle) . '</title>', $html);

    // Meta description
    $html = preg_replace('/<meta\s+name="description"\s+content=".*?"\s*\/?>/is', '<meta name="description" content="' . htmlspecialchars($pageDesc) . '" />', $html);

    // OpenGraph tags
    $html = preg_replace('/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/is', '<meta property="og:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
    $html = preg_replace('/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/is', '<meta property="og:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
    $html = preg_replace('/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/is', '<meta property="og:url" content="' . htmlspecialchars($canonicalUrl) . '" />', $html);
    $html = preg_replace('/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/is', '<meta property="og:image" content="' . htmlspecialchars($ogImage) . '" />', $html);

    // Twitter Card tags
    $html = preg_replace('/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/is', '<meta name="twitter:title" content="' . htmlspecialchars($pageTitle) . '" />', $html);
    $html = preg_replace('/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/is', '<meta name="twitter:description" content="' . htmlspecialchars($pageDesc) . '" />', $html);
    $html = preg_replace('/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/is', '<meta name="twitter:image" content="' . htmlspecialchars($ogImage) . '" />', $html);

    // 7. Inject noscript crawler content into <div id="app"></div>
    if ($noscriptHtml !== '') {
        $noscriptBlock = '<noscript><style>.seo-content{max-width:800px;margin:40px auto;padding:0 20px;font-family:sans-serif;line-height:1.6;color:#e8e5de;background:#0b0c0e}.seo-content h1{font-size:28px;margin-bottom:12px;color:#d4b483}.seo-content h2{font-size:20px;margin-top:24px;margin-bottom:10px;color:#387780}.seo-content ul{padding-left:20px;margin-bottom:20px}.seo-content li{margin-bottom:6px}.seo-content a{color:#d4b483}</style>' . $noscriptHtml . '</noscript>';
        $html = str_replace('<div id="app"></div>', '<div id="app">' . $noscriptBlock . '</div>', $html);
    }

    // 8. Output rendered page
    if (!headers_sent()) {
        header('Content-Type: text/html; charset=UTF-8');
    }
    echo $html;

} catch (\Throwable $e) {
    // Failsafe: Output index.html directly so the site NEVER fails with 500
    if (!headers_sent()) {
        header('Content-Type: text/html; charset=UTF-8');
    }
    if (file_exists(__DIR__ . '/index.html')) {
        readfile(__DIR__ . '/index.html');
    } else {
        http_response_code(500);
        echo 'Error loading application.';
    }
    return;
}
