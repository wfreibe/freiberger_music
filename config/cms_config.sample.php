<?php
// Copy to private server/config/cms_config.php; never put runtime data in webroot.
return [
    'db_path' => dirname(__DIR__) . '/data/content.sqlite',
    'backup_dir' => dirname(__DIR__) . '/backups',
    'session_save_path' => dirname(__DIR__) . '/data/sessions',
    'upload_dir' => dirname(__DIR__) . '/data/uploads',
    'cookie_secure' => true,
];
