<?php
declare(strict_types=1);
final class MusicMedia
{
    public static function directory(): string
    {
        $path = Database::getConfig()['upload_dir'] ?? dirname(__DIR__) . '/data/uploads';
        if (!is_string($path) || $path === '') throw new RuntimeException('Upload storage unavailable.');
        return $path;
    }

    public static function upload(array $file): string
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'] ?? '') || ($file['size'] ?? 0) > 8 * 1024 * 1024) throw new InvalidArgumentException('Bild fehlt oder ist größer als 8 MiB.');
        $info = @getimagesize($file['tmp_name']);
        if (!$info || $info[0] * $info[1] > 12000000 || !in_array($info['mime'], ['image/jpeg','image/png','image/webp'], true)) throw new InvalidArgumentException('JPEG, PNG oder WebP bis 12 Millionen Pixel verwenden.');
        $image = @imagecreatefromstring(file_get_contents($file['tmp_name']));
        if (!$image) throw new InvalidArgumentException('Bild kann nicht gelesen werden.');
        $directory = self::directory();
        if (!is_dir($directory) && !mkdir($directory, 0700, true)) throw new RuntimeException('Upload storage unavailable.');
        PrivateStorage::directory($directory);
        $id = bin2hex(random_bytes(24)) . '.webp';
        try {
            if (!imagewebp($image, $directory . '/' . $id, 90)) throw new RuntimeException('Upload failed.');
            PrivateStorage::file($directory . '/' . $id);
        } finally { imagedestroy($image); }
        return '/api/media/' . $id;
    }

    public static function serve(string $id): void
    {
        if (!preg_match('/^[a-f0-9]{48}\.webp$/D', $id)) { http_response_code(404); exit; }
        $file = self::directory() . '/' . $id;
        if (!is_file($file)) { http_response_code(404); exit; }
        header('Content-Type: image/webp'); header('Cache-Control: public, max-age=31536000, immutable');
        header('Content-Length: ' . filesize($file)); readfile($file); exit;
    }
}
