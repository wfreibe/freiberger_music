<?php
$_GET['route'] = 'places' . (isset($_GET['slug']) ? '/' . $_GET['slug'] : '');
require_once __DIR__ . '/index.php';
