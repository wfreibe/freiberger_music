<?php
declare(strict_types=1);
$zip = new ZipArchive();
if ($zip->open(dirname(__DIR__) . '/dist-packages/freiberger-music-deploy.zip') !== true) throw new RuntimeException('Package missing.');
$seen = [];
for ($i=0; $i<$zip->numFiles; $i++) {
    $name = $zip->getNameIndex($i);
    if (isset($seen[$name])) throw new RuntimeException('Duplicate archive entry: ' . $name);
    $seen[$name] = true;
    if (preg_match('#(^|/)(storage|uploads|sessions|node_modules|\.git|cms_config\.php)(/|$)|\.(sqlite.*|db|key|pem|log|env)$#i', $name)) throw new RuntimeException('Runtime data in archive.');
    if (str_starts_with($name, 'webroot/') && preg_match('#\.(sql|md)$|/(lib|bin|config|studio)/#i', $name)) throw new RuntimeException('Private source in webroot.');
}
foreach (['webroot/index.html','webroot/index.php','webroot/api/cms.php','webroot/.htaccess','server/lib/Auth.php','server/bin/migrate.php','server/config/cms_config.sample.php'] as $required) if (!isset($seen[$required])) throw new RuntimeException('Required entry missing: ' . $required);
$headers = $zip->getFromName('webroot/.htaccess');
if (!preg_match("/frame-src\\s+'self'(?:\\s|;)/", $headers)) throw new RuntimeException('CMS preview requires same-origin frames.');
if (!str_contains($headers, 'Header set X-Frame-Options "SAMEORIGIN"')) throw new RuntimeException('Same-origin embedding protection missing.');
$html = $zip->getFromName('webroot/index.html');
preg_match_all('#(?:src|href)="(/assets/[^"]+)"#', $html, $assets);
foreach ($assets[1] as $asset) if (!isset($seen['webroot' . $asset])) throw new RuntimeException('Missing asset.');
echo 'Deployment archive verified: unique entries, assets present, private data excluded.' . PHP_EOL;
