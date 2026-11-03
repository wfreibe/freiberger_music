<?php
$_GET['route'] = 'series' . (isset($_GET['slug']) ? '/' . $_GET['slug'] : '');
require_once __DIR__ . '/index.php';
