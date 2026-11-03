<?php
// Tests the index.php pre-renderer across various routes

$testRoutes = [
    '/' => 'FREIBERGER · music · stories · places · memories',
    '/die-orte-die-uns-sahen' => 'Die Orte, die uns sahen — Buch & Hörbuch | FREIBERGER',
    '/places/santorini' => 'SANTORINI (Σαντορίνη) — Schauplätze & Musik | FREIBERGER',
    '/places' => 'Schauplätze & Musik — Ägäis & Ionisches Meer | FREIBERGER',
    '/gard-7' => 'GARD 7 — Künstler & Audiovisuelle Produktionen | FREIBERGER',
    '/impressum' => 'Impressum & Datenschutz | FREIBERGER',
];

$allPassed = true;

foreach ($testRoutes as $route => $expectedTitle) {
    $_SERVER['REQUEST_URI'] = $route;
    $_SERVER['HTTP_HOST'] = 'freiberger.music';
    $_SERVER['HTTPS'] = 'on';
    $_SERVER['SCRIPT_NAME'] = '/index.php';

    ob_start();
    require __DIR__ . '/../index.php';
    $output = ob_get_clean();

    // Check title
    preg_match('/<title>(.*?)<\/title>/', $output, $mTitle);
    $actualTitle = $mTitle[1] ?? '';

    // Check OG image
    preg_match('/<meta property="og:image" content="(.*?)"/', $output, $mImg);
    $actualImg = $mImg[1] ?? '';

    // Check noscript
    $hasNoscript = strpos($output, '<noscript>') !== false;

    $decodedTitle = html_entity_decode($actualTitle, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $titleOk = ($decodedTitle === $expectedTitle);
    $imgOk = ($actualImg === 'https://freiberger.music/covers/og-share.jpg');

    if ($titleOk && $imgOk && $hasNoscript) {
        echo "✓ Route: {$route}\n";
        echo "   Title: {$actualTitle}\n";
        echo "   Image: {$actualImg}\n";
    } else {
        $allPassed = false;
        echo "✗ Route: {$route} FAILED\n";
        echo "   Expected Title: {$expectedTitle}\n";
        echo "   Actual Title:   {$actualTitle}\n";
        echo "   Actual Image:   {$actualImg}\n";
        echo "   Has Noscript:   " . ($hasNoscript ? 'YES' : 'NO') . "\n";
    }
}

if ($allPassed) {
    echo "\n🎉 ALL CRAWLER PRE-RENDER TESTS PASSED!\n";
    exit(0);
} else {
    echo "\n❌ SOME TESTS FAILED!\n";
    exit(1);
}
