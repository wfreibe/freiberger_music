<?php
// freiberger.music — Studio CMS

declare(strict_types=1);

// The former Studio is replaced by the authenticated Preact CMS.
header('Location: /cms', true, 302);
exit;

require_once __DIR__ . '/../api/bootstrap.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/release-fields.php';

$pdo = getDbConnection();
$view = $_GET['view'] ?? 'releases';
$action = $_GET['action'] ?? 'list';
$error = null;
$success = null;

// Handle Login
if ($view === 'login') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!verifyCsrfToken($_POST['csrf_token'] ?? null)) {
            $error = 'Sicherheitstoken ungültig oder abgelaufen (CSRF). Bitte versuchen Sie es erneut.';
        } else {
            $password = $_POST['password'] ?? '';
            $result = studioLogin($password);
            if ($result['success']) {
                header('Location: index.php?view=releases');
                exit;
            } else {
                $error = $result['message'];
            }
        }
    }
} elseif ($view === 'logout') {
    studioLogout();
    header('Location: index.php?view=login');
    exit;
} else {
    requireStudioAuth();
}

// Handle Form Submissions when Authenticated
if (isStudioLoggedIn() && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? null)) {
        $error = 'Sicherheitstoken ungültig oder abgelaufen (CSRF). Bitte laden Sie die Seite neu.';
    } else {
        // SAVE / UPDATE RELEASE
    if ($view === 'releases' && in_array($action, ['create', 'edit'], true)) {
        $id = !empty($_POST['id']) ? (int)$_POST['id'] : null;
        $title = trim($_POST['title'] ?? '');
        $subtitle = trim($_POST['subtitle'] ?? '');
        $slug = trim($_POST['slug'] ?? '');
        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        }
        $release_date = $_POST['release_date'] ?? date('Y-m-d');
        $cover = trim($_POST['cover'] ?? '');
        $genre = trim($_POST['genre'] ?? 'Future Garage');
        $bpm = !empty($_POST['bpm']) ? (int)$_POST['bpm'] : null;
        $duration = trim($_POST['duration'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $story = trim($_POST['story'] ?? '');
        $lyrics = trim($_POST['lyrics'] ?? '');
        $place_id = !empty($_POST['place_id']) ? (int)$_POST['place_id'] : null;
        $chapter_id = !empty($_POST['chapter_id']) ? (int)$_POST['chapter_id'] : null;
        $series_id = !empty($_POST['series_id']) ? (int)$_POST['series_id'] : null;
        $featured = !empty($_POST['featured']) ? 1 : 0;
        $sort_order = !empty($_POST['sort_order']) ? (int)$_POST['sort_order'] : 0;
        $audio_url = trim($_POST['audio_url'] ?? '');
        $spotify_url = trim($_POST['spotify_url'] ?? '');
        $apple_music_url = trim($_POST['apple_music_url'] ?? '');

        if (empty($title)) {
            $error = 'Bitte einen Titel eingeben.';
        } else {
            try {
                $existing = [];
                if ($id) {
                    $lookup = $pdo->prepare('SELECT type, youtube_id, youtube_playlist_id FROM releases WHERE id = :id');
                    $lookup->execute([':id' => $id]);
                    $existing = $lookup->fetch();
                    if (!$existing) throw new InvalidArgumentException('Der Release wurde nicht gefunden.');
                }
                $mediaFields = prepareReleaseMediaFields($_POST, $existing);
                $type = $mediaFields['type'];
                $youtube_id = $mediaFields['youtube_id'];
                $youtube_playlist_id = $mediaFields['youtube_playlist_id'];
                if ($id) {
                    $stmt = $pdo->prepare("
                        UPDATE releases SET
                            slug = :slug, title = :title, subtitle = :subtitle, type = :type,
                            release_date = :release_date, cover = :cover, youtube_id = :youtube_id,
                            youtube_playlist_id = :youtube_playlist_id, genre = :genre, bpm = :bpm,
                            duration = :duration, description = :description, story = :story,
                            lyrics = :lyrics, place_id = :place_id, chapter_id = :chapter_id,
                            series_id = :series_id, featured = :featured, sort_order = :sort_order,
                            audio_url = :audio_url, spotify_url = :spotify_url, apple_music_url = :apple_music_url
                        WHERE id = :id
                    ");
                    $stmt->execute([
                        ':id' => $id, ':slug' => $slug, ':title' => $title, ':subtitle' => $subtitle,
                        ':type' => $type, ':release_date' => $release_date, ':cover' => $cover,
                        ':youtube_id' => $youtube_id, ':youtube_playlist_id' => $youtube_playlist_id,
                        ':genre' => $genre, ':bpm' => $bpm, ':duration' => $duration,
                        ':description' => $description, ':story' => $story, ':lyrics' => $lyrics,
                        ':place_id' => $place_id, ':chapter_id' => $chapter_id, ':series_id' => $series_id,
                        ':featured' => $featured, ':sort_order' => $sort_order,
                        ':audio_url' => $audio_url, ':spotify_url' => $spotify_url, ':apple_music_url' => $apple_music_url
                    ]);
                    $success = "Release '{$title}' erfolgreich aktualisiert.";
                    $action = 'list';
                } else {
                    $stmt = $pdo->prepare("
                        INSERT INTO releases (
                            slug, title, subtitle, type, release_date, cover, youtube_id,
                            youtube_playlist_id, genre, bpm, duration, description, story,
                            lyrics, place_id, chapter_id, series_id, featured, sort_order,
                            audio_url, spotify_url, apple_music_url
                        ) VALUES (
                            :slug, :title, :subtitle, :type, :release_date, :cover, :youtube_id,
                            :youtube_playlist_id, :genre, :bpm, :duration, :description, :story,
                            :lyrics, :place_id, :chapter_id, :series_id, :featured, :sort_order,
                            :audio_url, :spotify_url, :apple_music_url
                        )
                    ");
                    $stmt->execute([
                        ':slug' => $slug, ':title' => $title, ':subtitle' => $subtitle,
                        ':type' => $type, ':release_date' => $release_date, ':cover' => $cover,
                        ':youtube_id' => $youtube_id, ':youtube_playlist_id' => $youtube_playlist_id,
                        ':genre' => $genre, ':bpm' => $bpm, ':duration' => $duration,
                        ':description' => $description, ':story' => $story, ':lyrics' => $lyrics,
                        ':place_id' => $place_id, ':chapter_id' => $chapter_id, ':series_id' => $series_id,
                        ':featured' => $featured, ':sort_order' => $sort_order,
                        ':audio_url' => $audio_url, ':spotify_url' => $spotify_url, ':apple_music_url' => $apple_music_url
                    ]);
                    $success = "Neuer Release '{$title}' erfolgreich angelegt.";
                    $action = 'list';
                }
            } catch (InvalidArgumentException $e) {
                $error = $e->getMessage();
            } catch (PDOException $e) {
                $error = 'Fehler beim Speichern: ' . $e->getMessage();
            }
        }
    }

    // DELETE RELEASE
    if ($view === 'releases' && $action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id > 0) {
            $stmt = $pdo->prepare("DELETE FROM releases WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $success = "Release gelöscht.";
            $action = 'list';
        }
    }
    }
}

// Fetch helper data
$places = [];
$chapters = [];
$seriesList = [];
if (isStudioLoggedIn()) {
    $places = $pdo->query("SELECT id, name, slug FROM places ORDER BY sort_order ASC")->fetchAll();
    $chapters = $pdo->query("SELECT id, chapter_number, title FROM chapters ORDER BY chapter_number ASC")->fetchAll();
    $seriesList = $pdo->query("SELECT id, title, slug FROM series ORDER BY sort_order ASC")->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FREIBERGER · Studio</title>
    <link rel="stylesheet" href="studio.css">
</head>
<body>

<?php if (!isStudioLoggedIn()): ?>
    <!-- LOGIN SCREEN -->
    <div class="login-screen">
        <div class="login-card">
            <h2>FREIBERGER Studio</h2>
            <p>Audiovisuelles Archiv Verwaltung</p>

            <?php if ($error): ?>
                <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>

            <form method="POST" action="index.php?view=login">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(getCsrfToken()) ?>">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label for="password">Passwort</label>
                    <input type="password" id="password" name="password" required autofocus placeholder="Passwort eingeben">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Einloggen</button>
            </form>
            <div style="margin-top: 24px; text-align: center;">
                <a href="../" style="color: var(--text-dim); text-decoration: none; font-size: 12px;">← Zurück zur Website</a>
            </div>
        </div>
    </div>
<?php else: ?>
    <!-- STUDIO APP -->
    <div class="studio-layout">
        <aside class="studio-sidebar">
            <div class="studio-brand">
                FREIBERGER
                <span>STUDIO · ARCHIVE CMS</span>
            </div>

            <nav class="studio-nav">
                <a href="index.php?view=releases" class="<?= $view === 'releases' ? 'active' : '' ?>">
                    Releases
                    <span style="font-size: 11px; opacity: 0.6;"><?= $pdo->query("SELECT COUNT(*) FROM releases")->fetchColumn() ?></span>
                </a>
                <a href="index.php?view=places" class="<?= $view === 'places' ? 'active' : '' ?>">
                    Orte (Places)
                    <span style="font-size: 11px; opacity: 0.6;"><?= $pdo->query("SELECT COUNT(*) FROM places")->fetchColumn() ?></span>
                </a>
                <a href="index.php?view=chapters" class="<?= $view === 'chapters' ? 'active' : '' ?>">
                    Buchkapitel
                    <span style="font-size: 11px; opacity: 0.6;"><?= $pdo->query("SELECT COUNT(*) FROM chapters")->fetchColumn() ?></span>
                </a>
            </nav>

            <div class="studio-sidebar-footer">
                <a href="../" target="_blank">↗ Website ansehen</a>
                <a href="../api/" target="_blank">↗ API Endpoints</a>
                <a href="index.php?view=logout" style="color: #e07a6d; margin-top: 8px;">Abmelden</a>
            </div>
        </aside>

        <main class="studio-main">
            <?php if ($success): ?>
                <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
            <?php endif; ?>
            <?php if ($error): ?>
                <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>

            <?php if ($view === 'releases'): ?>
                <?php if ($action === 'create' || $action === 'edit'): ?>
                    <?php
                    $release = [
                        'id' => '',
                        'title' => '',
                        'subtitle' => '',
                        'slug' => '',
                        'type' => 'single',
                        'release_date' => date('Y-m-d'),
                        'cover' => '/covers/was-das-meer-bewahrte.svg',
                        'youtube_id' => '',
                        'youtube_playlist_id' => '',
                        'genre' => 'Future Garage',
                        'bpm' => 128,
                        'duration' => '05:30',
                        'description' => '',
                        'story' => '',
                        'lyrics' => '',
                        'place_id' => '',
                        'chapter_id' => '',
                        'series_id' => 1,
                        'featured' => 0,
                        'sort_order' => 10
                    ];
                    if ($action === 'edit' && !empty($_GET['id'])) {
                        $stmt = $pdo->prepare("SELECT * FROM releases WHERE id = :id");
                        $stmt->execute([':id' => (int)$_GET['id']]);
                        $found = $stmt->fetch();
                        if ($found) $release = $found;
                    }
                    ?>
                    <div class="studio-header">
                        <div>
                            <h1><?= $action === 'edit' ? 'Release bearbeiten' : 'Neuer Release' ?></h1>
                            <p><?= htmlspecialchars($release['title'] ?: 'Neues Musikstück anlegen') ?></p>
                        </div>
                        <a href="index.php?view=releases" class="btn btn-secondary">← Zurück zur Liste</a>
                    </div>

                    <form method="POST" action="index.php?view=releases&action=<?= $action ?>" class="studio-card">
                        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(getCsrfToken()) ?>">
                        <input type="hidden" name="id" value="<?= htmlspecialchars((string)$release['id']) ?>">

                        <div class="form-grid">
                            <div class="form-group">
                                <label for="title">Titel *</label>
                                <input type="text" id="title" name="title" value="<?= htmlspecialchars($release['title']) ?>" required placeholder="z. B. Was das Meer bewahrte">
                            </div>

                            <div class="form-group">
                                <label for="subtitle">Untertitel</label>
                                <input type="text" id="subtitle" name="subtitle" value="<?= htmlspecialchars((string)$release['subtitle']) ?>" placeholder="z. B. Between horizon and stone">
                            </div>

                            <div class="form-group">
                                <label for="slug">Slug (URL-Pfad)</label>
                                <input type="text" id="slug" name="slug" value="<?= htmlspecialchars($release['slug']) ?>" placeholder="z. B. was-das-meer-bewahrte">
                            </div>

                            <div class="form-group">
                                <label for="cover">Cover Bildpfad</label>
                                <input type="text" id="cover" name="cover" value="<?= htmlspecialchars((string)$release['cover']) ?>" placeholder="/covers/was-das-meer-bewahrte.svg">
                            </div>

                            <div class="form-group">
                                <label for="youtube_id">YouTube Video ID oder Link</label>
                                <input type="text" id="youtube_id" name="youtube_id" value="<?= htmlspecialchars((string)$release['youtube_id']) ?>" placeholder="z. B. dQw4w9WgXcQ">
                            </div>

                            <div class="form-group">
                                <label for="type">Inhaltstyp</label>
                                <select id="type" name="type" required>
                                    <?php foreach (RELEASE_TYPES as $value => $label): ?>
                                        <option value="<?= $value ?>" <?= $release['type'] === $value ? 'selected' : '' ?>><?= htmlspecialchars($label) ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="youtube_playlist_id">YouTube Playlist ID</label>
                                <input type="text" id="youtube_playlist_id" name="youtube_playlist_id" value="<?= htmlspecialchars((string)$release['youtube_playlist_id']) ?>">
                            </div>

                            <div class="form-group">
                                <label for="audio_url">Direkte Audiodatei (MP3-Pfad)</label>
                                <input type="text" id="audio_url" name="audio_url" value="<?= htmlspecialchars((string)($release['audio_url'] ?? '')) ?>" placeholder="/audio/songs/bevor-das-licht.mp3">
                            </div>

                            <div class="form-group">
                                <label for="spotify_url">Spotify URL</label>
                                <input type="text" id="spotify_url" name="spotify_url" value="<?= htmlspecialchars((string)($release['spotify_url'] ?? '')) ?>" placeholder="https://open.spotify.com/track/...">
                            </div>

                            <div class="form-group">
                                <label for="apple_music_url">Apple Music URL</label>
                                <input type="text" id="apple_music_url" name="apple_music_url" value="<?= htmlspecialchars((string)($release['apple_music_url'] ?? '')) ?>" placeholder="https://music.apple.com/...">
                            </div>

                            <div class="form-group">
                                <label for="genre">Genre</label>
                                <input type="text" id="genre" name="genre" value="<?= htmlspecialchars($release['genre']) ?>" placeholder="Future Garage, Deep Ambient...">
                            </div>

                            <div class="form-group">
                                <label for="bpm">BPM (Tempo)</label>
                                <input type="number" id="bpm" name="bpm" value="<?= htmlspecialchars((string)$release['bpm']) ?>" placeholder="128">
                            </div>

                            <div class="form-group">
                                <label for="duration">Dauer</label>
                                <input type="text" id="duration" name="duration" value="<?= htmlspecialchars((string)$release['duration']) ?>" placeholder="05:51">
                            </div>

                            <div class="form-group">
                                <label for="place_id">Zugeordneter Ort</label>
                                <select id="place_id" name="place_id">
                                    <option value="">-- Kein Ort --</option>
                                    <?php foreach ($places as $p): ?>
                                        <option value="<?= $p['id'] ?>" <?= $release['place_id'] == $p['id'] ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($p['name']) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="chapter_id">Zugeordnetes Buchkapitel</label>
                                <select id="chapter_id" name="chapter_id">
                                    <option value="">-- Kein Kapitel --</option>
                                    <?php foreach ($chapters as $c): ?>
                                        <option value="<?= $c['id'] ?>" <?= $release['chapter_id'] == $c['id'] ? 'selected' : '' ?>>
                                            Kapitel <?= $c['chapter_number'] ?>: <?= htmlspecialchars($c['title']) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="series_id">Serie</label>
                                <select id="series_id" name="series_id">
                                    <option value="">-- Keine Serie --</option>
                                    <?php foreach ($seriesList as $s): ?>
                                        <option value="<?= $s['id'] ?>" <?= $release['series_id'] == $s['id'] ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($s['title']) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="release_date">Veröffentlichungsdatum</label>
                                <input type="text" id="release_date" name="release_date" value="<?= htmlspecialchars((string)$release['release_date']) ?>" placeholder="JJJJ-MM-TT">
                            </div>

                            <div class="form-group">
                                <label for="sort_order">Sortierreihenfolge</label>
                                <input type="number" id="sort_order" name="sort_order" value="<?= htmlspecialchars((string)$release['sort_order']) ?>">
                            </div>

                            <div class="checkbox-group">
                                <input type="checkbox" id="featured" name="featured" value="1" <?= !empty($release['featured']) ? 'checked' : '' ?>>
                                <label for="featured" style="cursor: pointer;">Auf Startseite hervorheben (Featured)</label>
                            </div>

                            <div class="form-group full-width">
                                <label for="description">Kurzbeschreibung</label>
                                <textarea id="description" name="description" placeholder="Einleitender Text zum Release..."><?= htmlspecialchars((string)$release['description']) ?></textarea>
                            </div>

                            <div class="form-group full-width">
                                <label for="story">Hintergrundgeschichte (Story)</label>
                                <textarea id="story" name="story" style="min-height: 140px;" placeholder="Detaillierte Entstehungsgeschichte, Erinnerung an den Ort..."><?= htmlspecialchars((string)$release['story']) ?></textarea>
                            </div>

                            <div class="form-group full-width">
                                <label for="lyrics">Lyrics / Poesie</label>
                                <textarea id="lyrics" name="lyrics" style="min-height: 100px;" placeholder="Textfragmente oder Gedichtzeilen..."><?= htmlspecialchars((string)$release['lyrics']) ?></textarea>
                            </div>
                        </div>

                        <div class="form-actions">
                            <a href="index.php?view=releases" class="btn btn-secondary">Abbrechen</a>
                            <button type="submit" class="btn btn-primary">Speichern</button>
                        </div>
                    </form>

                <?php else: ?>
                    <!-- LIST RELEASES -->
                    <div class="studio-header">
                        <div>
                            <h1>Releases</h1>
                            <p>Verwalte deine Musikveröffentlichungen, Zuordnungen zu Orten und Buchkapiteln.</p>
                        </div>
                        <a href="index.php?view=releases&action=create" class="btn btn-primary">+ Neuer Release</a>
                    </div>

                    <div class="studio-card">
                        <table class="studio-table">
                            <thead>
                                <tr>
                                    <th style="width: 60px;">Cover</th>
                                    <th>Titel & Untertitel</th>
                                    <th>Ort</th>
                                    <th>Tempo / Genre</th>
                                    <th>Kapitel</th>
                                    <th>Status</th>
                                    <th style="text-align: right;">Aktionen</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $stmt = $pdo->query("
                                    SELECT r.*, p.name AS place_name, c.chapter_number
                                    FROM releases r
                                    LEFT JOIN places p ON r.place_id = p.id
                                    LEFT JOIN chapters c ON r.chapter_id = c.id
                                    ORDER BY r.sort_order ASC, r.id ASC
                                ");
                                $releases = $stmt->fetchAll();
                                foreach ($releases as $rel):
                                ?>
                                <tr>
                                    <td>
                                        <img src="<?= htmlspecialchars($rel['cover'] ?: '/covers/placeholder.svg') ?>" class="table-cover" alt="" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' fill=\'%23222\'><rect width=\'100%25\' height=\'100%25\'/></svg>'">
                                    </td>
                                    <td>
                                        <div style="font-weight: 500; font-size: 14px;"><?= htmlspecialchars($rel['title']) ?></div>
                                        <div style="font-size: 12px; color: var(--text-dim);"><?= htmlspecialchars((string)$rel['subtitle']) ?></div>
                                    </td>
                                    <td>
                                        <?php if ($rel['place_name']): ?>
                                            <span class="badge badge-place"><?= htmlspecialchars($rel['place_name']) ?></span>
                                        <?php else: ?>
                                            <span style="color: var(--text-dim); font-size: 12px;">—</span>
                                        <?php endif; ?>
                                    </td>
                                    <td style="font-size: 12px; color: var(--text-muted);">
                                        <?= $rel['bpm'] ? htmlspecialchars((string)$rel['bpm']) . ' BPM' : '—' ?>
                                        <div style="font-size: 11px; color: var(--text-dim);"><?= htmlspecialchars($rel['genre']) ?></div>
                                    </td>
                                    <td style="font-size: 12px; color: var(--text-muted);">
                                        <?= $rel['chapter_number'] ? 'Kapitel ' . htmlspecialchars((string)$rel['chapter_number']) : '—' ?>
                                    </td>
                                    <td>
                                        <?php if (!empty($rel['featured'])): ?>
                                            <span class="badge badge-featured">Featured</span>
                                        <?php endif; ?>
                                    </td>
                                    <td style="text-align: right;">
                                        <a href="index.php?view=releases&action=edit&id=<?= $rel['id'] ?>" class="btn btn-secondary btn-sm">Bearbeiten</a>
                                        <form method="POST" action="index.php?view=releases&action=delete" style="display: inline;" onsubmit="return confirm('Release wirklich unwiderruflich löschen?');">
                                            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(getCsrfToken()) ?>">
                                            <input type="hidden" name="id" value="<?= $rel['id'] ?>">
                                            <button type="submit" class="btn btn-danger btn-sm">Löschen</button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>

            <?php elseif ($view === 'places'): ?>
                <!-- PLACES OVERVIEW -->
                <div class="studio-header">
                    <div>
                        <h1>Orte (Places)</h1>
                        <p>Die 8 Schauplätze Griechenlands im Archiv-Kosmos.</p>
                    </div>
                </div>

                <div class="studio-card">
                    <table class="studio-table">
                        <thead>
                            <tr>
                                <th>Ort</th>
                                <th>Griechisch</th>
                                <th>Tagline</th>
                                <th>Koordinaten</th>
                                <th>Verknüpfte Releases</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $stmt = $pdo->query("
                                SELECT p.*, COUNT(r.id) AS track_count
                                FROM places p
                                LEFT JOIN releases r ON r.place_id = p.id
                                GROUP BY p.id
                                ORDER BY p.sort_order ASC
                            ");
                            foreach ($stmt->fetchAll() as $p):
                            ?>
                            <tr>
                                <td style="font-weight: 600; letter-spacing: 0.05em;"><?= htmlspecialchars($p['name']) ?></td>
                                <td style="color: var(--text-dim); font-size: 13px;"><?= htmlspecialchars((string)$p['greek_name']) ?></td>
                                <td style="color: var(--text-muted); font-size: 13px;"><?= htmlspecialchars((string)$p['tagline']) ?></td>
                                <td style="font-family: var(--font-mono); font-size: 12px; color: var(--text-dim);"><?= htmlspecialchars((string)$p['coordinates']) ?></td>
                                <td>
                                    <span class="badge badge-place"><?= $p['track_count'] ?> Tracks</span>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

            <?php elseif ($view === 'chapters'): ?>
                <!-- CHAPTERS OVERVIEW -->
                <div class="studio-header">
                    <div>
                        <h1>Buchkapitel</h1>
                        <p>„Die Orte, die mich sahen“ — 11 Kapitel · 11 Orte · 11 Songs</p>
                    </div>
                </div>

                <div class="studio-card">
                    <table class="studio-table">
                        <thead>
                            <tr>
                                <th style="width: 60px;">Kapitel</th>
                                <th>Titel & Untertitel</th>
                                <th>Ort</th>
                                <th>Zugeordneter Song</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $stmt = $pdo->query("
                                SELECT c.*, p.name AS place_name, r.title AS release_title
                                FROM chapters c
                                LEFT JOIN places p ON c.place_id = p.id
                                LEFT JOIN releases r ON c.release_id = r.id
                                ORDER BY c.chapter_number ASC
                            ");
                            foreach ($stmt->fetchAll() as $c):
                            ?>
                            <tr>
                                <td style="font-family: var(--font-mono); font-size: 14px; font-weight: 600; color: var(--accent-gold);">
                                    <?= sprintf('%02d', $c['chapter_number']) ?>
                                </td>
                                <td>
                                    <div style="font-weight: 500;"><?= htmlspecialchars($c['title']) ?></div>
                                    <div style="font-size: 12px; color: var(--text-dim);"><?= htmlspecialchars((string)$c['subtitle']) ?></div>
                                </td>
                                <td>
                                    <?php if ($c['place_name']): ?>
                                        <span class="badge badge-place"><?= htmlspecialchars($c['place_name']) ?></span>
                                    <?php else: ?>
                                        <span style="color: var(--text-dim);">—</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($c['release_title']): ?>
                                        ♫ <?= htmlspecialchars($c['release_title']) ?>
                                    <?php else: ?>
                                        <span style="color: var(--text-dim);">—</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </main>
    </div>
<?php endif; ?>

</body>
</html>
