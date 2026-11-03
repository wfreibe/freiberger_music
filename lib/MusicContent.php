<?php
declare(strict_types=1);
if (!function_exists('normalizeYouTubeVideoId')) require_once __DIR__ . '/YouTube.php';

final class MusicContent
{
    public const TABLES = ['releases', 'places', 'books', 'chapters', 'series'];
    public const LINKS = ['place_id' => 'places', 'book_id' => 'books', 'release_id' => 'releases', 'chapter_id' => 'chapters', 'series_id' => 'series', 'soundtrack_series_id' => 'series', 'audiobook_series_id' => 'series'];

    public static function fields(PDO $db, string $table): array
    {
        if (!in_array($table, self::TABLES, true)) throw new InvalidArgumentException('Unbekannter Inhaltsbereich.');
        $fields = array_values(array_filter($db->query("PRAGMA table_info($table)")->fetchAll(),
            static fn($field) => !in_array($field['name'], ['id', 'created_at'], true)));
        if ($table === 'books') {
            $order = array_flip(['language','title','menu_label','sort_order','show_in_navigation','is_published','slug']);
            usort($fields, static fn($a,$b) => ($order[$a['name']] ?? 99) <=> ($order[$b['name']] ?? 99) ?: $a['cid'] <=> $b['cid']);
        }
        return $fields;
    }

    public static function revision(array $row): string
    {
        return hash('sha256', json_encode($row, JSON_THROW_ON_ERROR));
    }

    public static function validate(PDO $db, string $table, array $input): array
    {
        $fields = self::fields($db, $table);
        $allowed = array_column($fields, 'name');
        if (array_diff(array_keys($input), $allowed)) throw new InvalidArgumentException('Unbekanntes Eingabefeld.');
        $result = [];
        foreach ($fields as $field) {
            $name = $field['name'];
            if (!array_key_exists($name, $input)) {
                if ($field['notnull'] && $field['dflt_value'] === null) throw new InvalidArgumentException("Pflichtfeld fehlt: $name");
                continue;
            }
            $value = $input[$name];
            if ($value === '' || $value === null) {
                if ($field['notnull']) throw new InvalidArgumentException("Pflichtfeld fehlt: $name");
                $result[$name] = null;
                continue;
            }
            if (str_contains(strtoupper($field['type']), 'INT')) {
                if (filter_var($value, FILTER_VALIDATE_INT) === false || (int)$value < 0 || (int)$value > 2147483647) {
                    throw new InvalidArgumentException("Ungültige Zahl: $name");
                }
                $value = (int)$value;
                if ($name === 'featured' && !in_array($value, [0, 1], true)) throw new InvalidArgumentException('Ungültiger Sichtbarkeitswert.');
                if (in_array($name, ['show_in_navigation','is_published'], true) && !in_array($value, [0,1], true)) throw new InvalidArgumentException('Ungültiger Sichtbarkeitswert.');
                if (isset(self::LINKS[$name])) {
                    $target = self::LINKS[$name];
                    $stmt = $db->prepare("SELECT 1 FROM $target WHERE id=?");
                    $stmt->execute([$value]);
                    if (!$stmt->fetchColumn()) throw new InvalidArgumentException("Ungültige Verknüpfung: $name");
                }
            } else {
                if (!is_string($value) || strlen($value) > 100000 || str_contains($value, "\0")) throw new InvalidArgumentException("Ungültiger Text: $name");
                $value = trim($value);
                if ($field['notnull'] && $value === '') throw new InvalidArgumentException("Pflichtfeld fehlt: $name");
                if ($name === 'slug' && !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D', $value)) throw new InvalidArgumentException('Ungültiger URL-Name.');
                if ($table === 'books' && $name === 'slug' && in_array($value, ['api','cms','studio','places','gard-7','gard7','impressum','datenschutz','legal','assets','covers','server','storage'], true)) throw new InvalidArgumentException('Dieser URL-Name ist für eine Systemseite reserviert.');
                if ($table === 'books' && $name === 'language' && !in_array($value, ['de','en','fr'], true)) throw new InvalidArgumentException('Bitte DE, EN oder FR auswählen.');
                if ($name === 'soundtrack_source' && !in_array($value, ['series','english_book'], true)) throw new InvalidArgumentException('Ungültige Soundtrack-Quelle.');
                if ($name === 'menu_label' && strlen($value) > 200) throw new InvalidArgumentException('Menübezeichnung ist zu lang.');
                if ($name === 'type' && !in_array($value, ['song','audiobook','gard7','single','ep','album','chapter_audio'], true)) throw new InvalidArgumentException('Ungültiger Inhaltstyp.');
                if ($name === 'youtube_id') {
                    $value = normalizeYouTubeVideoId($value);
                    if ($value === null) throw new InvalidArgumentException('Ungültiges YouTube-Video.');
                }
                if ($name === 'accent_color' && !preg_match('/^#[a-f0-9]{6}$/iD', $value)) throw new InvalidArgumentException('Ungültige Farbe.');
                if ($name === 'release_date' && (!preg_match('/^\d{4}-\d{2}-\d{2}$/D', $value) || !checkdate((int)substr($value,5,2),(int)substr($value,8,2),(int)substr($value,0,4)))) throw new InvalidArgumentException('Ungültiges Datum.');
                if (str_ends_with($name, '_url') || in_array($name, ['cover','image'], true)) {
                    if (!self::safeUrl($value)) throw new InvalidArgumentException("Ungültiger Link: $name");
                }
            }
            $result[$name] = $value;
        }
        return $result;
    }

    private static function safeUrl(string $value): bool
    {
        if (preg_match('/[\x00-\x20\\\\]/', $value)) return false;
        if (str_starts_with($value, '/') && !str_starts_with($value, '//')) return true;
        return filter_var($value, FILTER_VALIDATE_URL) !== false && strtolower(parse_url($value, PHP_URL_SCHEME) ?? '') === 'https';
    }

    public static function save(PDO $db, string $table, ?int $id, array $input, ?string $revision): array
    {
        self::fields($db, $table);
        $db->beginTransaction();
        try {
            if ($id !== null) {
                $stmt = $db->prepare("SELECT * FROM $table WHERE id=?");
                $stmt->execute([$id]);
                $existing = $stmt->fetch();
                if (!$existing) throw new OutOfBoundsException('Inhalt nicht gefunden.');
                if ($revision === null || !hash_equals(self::revision($existing), $revision)) throw new LogicException('Inhalt wurde inzwischen geändert. Bitte neu laden.');
                $input = array_replace(array_intersect_key($existing, array_flip(array_column(self::fields($db, $table), 'name'))), $input);
            }
            $values = self::validate($db, $table, $input);
            if (!$values) throw new InvalidArgumentException('Keine Inhalte angegeben.');
            $columns = array_keys($values);
            if ($id === null) {
                $sql = "INSERT INTO $table (" . implode(',', $columns) . ') VALUES (' . implode(',', array_fill(0, count($columns), '?')) . ')';
                $db->prepare($sql)->execute(array_values($values));
                $id = (int)$db->lastInsertId();
            } else {
                $sql = "UPDATE $table SET " . implode(',', array_map(static fn($c) => "$c=?", $columns)) . ' WHERE id=?';
                $db->prepare($sql)->execute([...array_values($values), $id]);
            }
            $stmt = $db->prepare("SELECT * FROM $table WHERE id=?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            $db->commit();
            return ['item' => $row, 'revision' => self::revision($row)];
        } catch (Throwable $e) { if ($db->inTransaction()) $db->rollBack(); throw $e; }
    }
}
