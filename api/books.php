<?php
$_GET['route'] = 'books' . (isset($_GET['slug']) ? '/' . $_GET['slug'] : '');
require_once __DIR__ . '/index.php';
