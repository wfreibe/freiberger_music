<?php
declare(strict_types=1);
header('Cache-Control: no-store');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$route = trim(substr(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), strpos($_SERVER['REQUEST_URI'], '/api/cms') + 8), '/');
$parts = explode('/', $route);
try {
    if ($method === 'POST' && $route === 'upload') {
        Auth::requireAdmin(); Auth::requireCsrf();
        require_once $server . '/lib/MusicMedia.php';
        jsonResponse(['url' => MusicMedia::upload($_FILES['image'] ?? [])], 201);
    }
    if ($method === 'GET' && $route === 'session') {
        jsonResponse(['authenticated' => Auth::isAuthenticated(), 'passwordChangeRequired' => Auth::passwordChangeRequired(), 'csrf_token' => Auth::getCsrfToken()]);
    }
    if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'], true)) { header('Allow: GET, POST, PUT, DELETE'); errorResponse('Method not allowed', 405); }
    $data = [];
    if ($method !== 'GET') {
        Auth::requireCsrf();
        if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) errorResponse('JSON required', 415);
        $raw = file_get_contents('php://input', false, null, 0, 262145);
        if (strlen($raw) > 262144) errorResponse('Request too large', 413);
        $data = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($data)) errorResponse('JSON object required');
    }
    if ($method === 'POST' && $route === 'login') {
        if (!is_string($data['username'] ?? null) || !is_string($data['password'] ?? null) || strlen($data['username']) > 100 || strlen($data['password']) > 1024) errorResponse('Ungültige Anmeldung.');
        $result = Auth::login($data['username'], $data['password']);
        $result['csrf_token'] = Auth::getCsrfToken();
        jsonResponse($result, http_response_code() ?: 200);
    }
    if ($method === 'POST' && $route === 'password') {
        if (!is_string($data['password'] ?? null) || !is_string($data['confirmation'] ?? null)) errorResponse('Ungültige Passworteingabe.');
        $result = Auth::changePassword($data['password'], $data['confirmation']);
        jsonResponse($result, http_response_code() ?: 200);
    }
    if ($method === 'POST' && $route === 'logout') { Auth::logout(); jsonResponse(['success' => true]); }
    Auth::requireAdmin();
    require_once $server . '/lib/MusicContent.php';
    $db = Database::getConnection();
    $table = $parts[0];
    if (!in_array($table, MusicContent::TABLES, true) || count($parts) > 2) errorResponse('Not found', 404);
    $id = isset($parts[1]) && ctype_digit($parts[1]) && (int)$parts[1] > 0 ? (int)$parts[1] : null;
    if (isset($parts[1]) && $id === null) errorResponse('Not found', 404);
    if ($method === 'GET' && $id === null) {
        $items = $db->query("SELECT * FROM $table ORDER BY id")->fetchAll();
        $choices = [];
        foreach (MusicContent::TABLES as $target) $choices[$target] = $db->query("SELECT id, " . ($target === 'places' ? 'name' : 'title') . " AS label FROM $target ORDER BY id")->fetchAll();
        jsonResponse(['items' => array_map(static fn($row) => ['item' => $row, 'revision' => MusicContent::revision($row)], $items), 'fields' => MusicContent::fields($db, $table), 'choices' => $choices]);
    }
    if (($method === 'POST' && $id === null) || ($method === 'PUT' && $id !== null)) {
        if (!is_array($data['item'] ?? null) || (isset($data['revision']) && !is_string($data['revision']))) errorResponse('Ungültige Eingabe.');
        jsonResponse(MusicContent::save($db, $table, $id, $data['item'], $data['revision'] ?? null), $method === 'POST' ? 201 : 200);
    }
    if ($method === 'DELETE' && $id !== null) {
        // Block removal of linked content rather than silently changing related records.
        $db->beginTransaction();
        foreach (MusicContent::TABLES as $source) {
            foreach (MusicContent::fields($db, $source) as $field) {
                $column = $field['name'];
                if ((MusicContent::LINKS[$column] ?? null) !== $table) continue;
                $check = $db->prepare("SELECT 1 FROM $source WHERE $column=? LIMIT 1");
                $check->execute([$id]);
                if ($check->fetchColumn()) throw new LogicException('Inhalt ist noch verknüpft. Zuerst die Verknüpfungen entfernen.');
            }
        }
        $stmt = $db->prepare("SELECT * FROM $table WHERE id=?"); $stmt->execute([$id]); $row = $stmt->fetch();
        if (!$row) throw new OutOfBoundsException('Inhalt nicht gefunden.');
        if (!is_string($data['revision'] ?? null) || !hash_equals(MusicContent::revision($row), $data['revision'])) throw new LogicException('Inhalt wurde inzwischen geändert. Bitte neu laden.');
        $db->prepare("DELETE FROM $table WHERE id=?")->execute([$id]);
        $db->commit(); jsonResponse(['success' => true]);
    }
    errorResponse('Method not allowed', 405);
} catch (Throwable $e) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    if ($e instanceof InvalidArgumentException || $e instanceof JsonException) errorResponse($e instanceof JsonException ? 'Ungültiges JSON.' : $e->getMessage(), 400);
    if ($e instanceof OutOfBoundsException) errorResponse($e->getMessage(), 404);
    if ($e instanceof LogicException) errorResponse($e->getMessage(), 409);
    if ($e instanceof PDOException && (string)$e->getCode() === '23000') errorResponse('URL-Name oder Verknüpfung steht im Konflikt.', 409);
    errorResponse('CMS vorübergehend nicht verfügbar.', 503);
}
