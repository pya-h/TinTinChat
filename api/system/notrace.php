<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/admin.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$word = isset($body['word']) ? trim((string) $body['word']) : '';

if ($word === '') {
    apiError('MISSING_WORD', 'Missing required parameter', 400);
}

$stmt = $pdo->prepare('SELECT id, username, is_admin, banned_at FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

try {
    performEmergencyReset($user, $word);
    apiSuccess(['result' => 'ok']);
} catch (Exception $ex) {
    apiError('OPERATION_FAILED', 'Operation failed', 400);
}
