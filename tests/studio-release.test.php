<?php
require_once __DIR__ . '/../studio/release-fields.php';
function check($condition, $message) {
    if (!$condition) throw new RuntimeException($message);
}
$id = 'elMGltCaFfM';
foreach ([$id, " https://www.youtube.com/watch?v=$id&list=example ", "https://youtu.be/$id?t=30", "https://www.youtube.com/shorts/$id", "https://youtube.com/live/$id", "https://www.youtube-nocookie.com/embed/$id"] as $value) {
    check(normalizeYouTubeVideoId($value) === $id, 'Video normalization failed');
}
foreach (['https://example.com/watch?v=' . $id, 'https://youtube.com.evil.test/watch?v=' . $id, 'not a video', 'https://youtube.com/watch?v[]=bad', 'https://youtube.com/playlist?list=abc'] as $value) {
    check(normalizeYouTubeVideoId($value) === null, 'Invalid video accepted');
}
check(normalizeYouTubeVideoId('') === '', 'Empty video must support audio-only releases');
$db = new PDO('sqlite::memory:');
$db->exec('CREATE TABLE releases (id INTEGER PRIMARY KEY, type TEXT, youtube_id TEXT, youtube_playlist_id TEXT)');
$db->exec("INSERT INTO releases VALUES (48, 'song', '3iGRwql0ug8', 'PLIcnGWUVhwf4')");
$existing = $db->query('SELECT * FROM releases WHERE id = 48')->fetch(PDO::FETCH_ASSOC);
$fields = prepareReleaseMediaFields(['youtube_id' => "https://www.youtube.com/watch?v=$id"], $existing);
$stmt = $db->prepare('UPDATE releases SET type = :type, youtube_id = :youtube_id, youtube_playlist_id = :youtube_playlist_id WHERE id = 48');
$stmt->execute($fields);
$song = $db->query("SELECT * FROM releases WHERE type = 'song'")->fetch(PDO::FETCH_ASSOC);
check($song && $song['youtube_id'] === $id, 'Editing must keep song visible on book page');
check($song['youtube_playlist_id'] === 'PLIcnGWUVhwf4', 'Missing playlist field must preserve association');
check(prepareReleaseMediaFields(['type' => 'song'], ['type' => 'single'])['type'] === 'song', 'Existing damaged type must be repairable');
foreach (['audiobook', 'gard7', 'chapter_audio'] as $type) {
    check(prepareReleaseMediaFields(['youtube_id' => $id], ['type' => $type])['type'] === $type, 'Other types must survive editing');
}
try { prepareReleaseMediaFields(['youtube_id' => 'broken']); throw new RuntimeException('Expected validation error'); } catch (InvalidArgumentException $e) {}
try { prepareReleaseMediaFields(['type' => 'invalid']); throw new RuntimeException('Expected type error'); } catch (InvalidArgumentException $e) {}
$normalized = normalizeYouTubeResponse(['releases' => [['youtube_id' => "https://youtu.be/$id"]], 'chapters' => [['release_youtube_id' => "https://youtube.com/watch?v=$id"]]]);
check($normalized['releases'][0]['youtube_id'] === $id && $normalized['chapters'][0]['release_youtube_id'] === $id, 'Legacy response normalization failed');
echo "PASS: URL validation, edit preserves song visibility and playlist, type repair, legacy API URLs\n";

