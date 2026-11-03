<?php
// Generates 1200x630 OpenGraph share image with GD
$width = 1200;
$height = 630;

$im = imagecreatetruecolor($width, $height);
imageantialias($im, true);

// Create Aegean dark gradient background
for ($y = 0; $y < $height; $y++) {
    $ratio = $y / $height;
    if ($ratio < 0.5) {
        $subRatio = $ratio * 2;
        $r = (int)(10 + (20 - 10) * $subRatio);
        $g = (int)(12 + (28 - 12) * $subRatio);
        $b = (int)(15 + (36 - 15) * $subRatio);
    } else {
        $subRatio = ($ratio - 0.5) * 2;
        $r = (int)(20 + (11 - 20) * $subRatio);
        $g = (int)(28 + (13 - 28) * $subRatio);
        $b = (int)(36 + (16 - 36) * $subRatio);
    }
    $col = imagecolorallocate($im, $r, $g, $b);
    imageline($im, 0, $y, $width, $y, $col);
}

// Colors
$gold = imagecolorallocate($im, 212, 180, 131);       // #d4b483
$teal = imagecolorallocate($im, 56, 119, 128);       // #387780
$white = imagecolorallocate($im, 232, 229, 222);     // #e8e5de
$muted = imagecolorallocate($im, 158, 155, 147);     // #9e9b93
$dim = imagecolorallocate($im, 84, 82, 78);          // #54524e
$borderCol = imagecolorallocatealpha($im, 212, 180, 131, 100);

// Elegant double border
imagerectangle($im, 40, 40, $width - 40, $height - 40, $borderCol);
imagerectangle($im, 46, 46, $width - 46, $height - 46, imagecolorallocatealpha($im, 56, 119, 128, 110));

// Corner marks
$cornerLen = 30;
imageline($im, 35, 35, 35 + $cornerLen, 35, $gold);
imageline($im, 35, 35, 35, 35 + $cornerLen, $gold);
imageline($im, $width - 35, 35, $width - 35 - $cornerLen, 35, $gold);
imageline($im, $width - 35, 35, $width - 35, 35 + $cornerLen, $gold);
imageline($im, 35, $height - 35, 35 + $cornerLen, $height - 35, $gold);
imageline($im, 35, $height - 35, 35, $height - 35 - $cornerLen, $gold);
imageline($im, $width - 35, $height - 35, $width - 35 - $cornerLen, $height - 35, $gold);
imageline($im, $width - 35, $height - 35, $width - 35, $height - 35 - $cornerLen, $gold);

// Select font
$fontGeorgia = 'C:/Windows/Fonts/georgia.ttf';
$fontGeorgiaBold = 'C:/Windows/Fonts/georgiab.ttf';
if (!file_exists($fontGeorgiaBold)) $fontGeorgiaBold = $fontGeorgia;
$fontArial = 'C:/Windows/Fonts/arial.ttf';
$fontArialBold = 'C:/Windows/Fonts/arialbd.ttf';
if (!file_exists($fontArialBold)) $fontArialBold = $fontArial;

function drawCenteredText($im, $size, $angle, $y, $color, $font, $text) {
    global $width;
    $box = imagettfbbox($size, $angle, $font, $text);
    $textWidth = abs($box[4] - $box[0]);
    $x = (int)(($width - $textWidth) / 2);
    imagettftext($im, $size, $angle, $x, $y, $color, $font, $text);
}

// 1. Supertitle
drawCenteredText($im, 15, 0, 160, $gold, $fontArialBold, 'W E R N E R   F R E I B E R G E R');

// 2. Main Title
drawCenteredText($im, 44, 0, 245, $white, $fontGeorgiaBold, 'DIE ORTE, DIE UNS SAHEN');

// 3. Teal accent line
$lineWidth = 180;
$lineX1 = (int)(($width - $lineWidth) / 2);
$lineX2 = $lineX1 + $lineWidth;
imagefilledrectangle($im, $lineX1, 280, $lineX2, 283, $teal);
imagefilledellipse($im, (int)($width / 2), 282, 8, 8, $gold);

// 4. Subtitle / Tagline
drawCenteredText($im, 20, 0, 345, $muted, $fontGeorgia, 'Als die Zukunft noch keinen Namen hatte');

// 5. Category / Content scope
drawCenteredText($im, 14, 0, 420, $white, $fontArial, 'SOUNDTRACK  ·  HÖRBUCH  ·  SCHAUPLÄTZE  ·  GARD 7');

// 6. Secondary description
drawCenteredText($im, 13, 0, 465, $muted, $fontArial, '11 Kapitel · 11 Schauplätze · 11 Klanglandschaften in Griechenland');

// 7. Footer brand badge
drawCenteredText($im, 13, 0, 550, $gold, $fontArialBold, 'F R E I B E R G E R . M U S I C');

$outPath = __DIR__ . '/../covers/og-share.jpg';
imagejpeg($im, $outPath, 95);
imagedestroy($im);

echo "✓ Created: " . realpath($outPath) . " (" . filesize($outPath) . " bytes)\n";
