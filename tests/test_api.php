<?php
// freiberger.music API Test Runner

function testEndpoint(string $uri, string $description): bool {
    echo "Testing {$description} ({$uri})...\n";
    $runner = __DIR__ . '/runner.php';
    $cmd = 'php ' . escapeshellarg($runner) . ' ' . escapeshellarg($uri);
    $output = shell_exec($cmd);

    $data = json_decode($output, true);
    if ($data === null && !empty($output)) {
        echo "  FAILED: Invalid JSON returned.\n";
        echo "  Raw output: " . substr($output, 0, 150) . "\n";
        return false;
    }

    if (is_array($data) && isset($data['error'])) {
        $msg = $data['message'] ?? $data['error'];
        echo "  FAILED: API returned error: " . (is_string($msg) ? $msg : json_encode($msg)) . "\n";
        return false;
    }

    $count = is_array($data) ? count($data) : 1;
    echo "  SUCCESS: Valid JSON returned. (Items/Keys: {$count})\n";
    return true;
}

$allPassed = true;
$tests = [
    ['/api/releases', 'List Releases'],
    ['/api/releases?type=song', 'List Songs'],
    ['/api/releases?type=audiobook', 'List Audiobooks'],
    ['/api/releases?type=gard7', 'List GARD 7 Tracks'],
    ['/api/releases/was-das-meer-bewahrte', 'Single Release'],
    ['/api/places', 'List Places'],
    ['/api/places/naxos', 'Single Place'],
    ['/api/books/die-orte-die-uns-sahen', 'Book & Chapters (Canonical Slug)'],
    ['/api/books/die-orte-die-mich-sahen', 'Book & Chapters (Legacy Alias)'],
    ['/api/search?q=naxos', 'Search Query'],
];

foreach ($tests as $t) {
    if (!testEndpoint($t[0], $t[1])) {
        $allPassed = false;
    }
}

if ($allPassed) {
    echo "\n✅ All API test endpoints passed successfully!\n";
    exit(0);
} else {
    echo "\n❌ Some API test endpoints failed!\n";
    exit(1);
}
