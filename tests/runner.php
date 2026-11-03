<?php
$uri = $argv[1] ?? "/api/releases";
$_SERVER["REQUEST_URI"] = $uri;
$_SERVER["REQUEST_METHOD"] = "GET";
$parts = parse_url($uri);
if (!empty($parts['query'])) {
    parse_str($parts['query'], $_GET);
}
require __DIR__ . "/../api/index.php";

