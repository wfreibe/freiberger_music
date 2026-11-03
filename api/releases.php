<?php
$_GET['route'] = 'releases' . (isset($_GET['slug']) ? '/' . $_GET['slug'] : '');
require_once __DIR__ . '/index.php';
