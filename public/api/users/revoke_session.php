<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/session.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireBanCheck($pdo, $userId);

$csrfHeader = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
if (!verifyCsrfToken($csrfHeader)) {
    apiError('INVALID_CSRF', 'Invalid CSRF token', 403);
}

$body = json_decode(file_get_contents('php://input'), true);
$sessionId = isset($body['session_id']) ? (int) $body['session_id'] : 0;

if ($sessionId <= 0) {
    apiError('INVALID_SESSION_ID', 'Missing or invalid session ID', 400);
}

// Prevent revoking the current session via this endpoint
$currentToken = $_SESSION['ident'] ?? '';
$stmt = $pdo->prepare('SELECT session_token, created_at FROM user_sessions WHERE id = ? AND user_id = ?');
$stmt->execute([$sessionId, $userId]);
$target = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$target) {
    apiError('SESSION_NOT_FOUND', 'Session not found', 404);
}

if ($target['session_token'] === $currentToken) {
    apiError('CANNOT_REVOKE_CURRENT', 'Cannot revoke the current session', 400);
}

// Check 12-hour age requirement
$createdTs = strtotime($target['created_at']);
$ageHours = (time() - $createdTs) / 3600;
if ($ageHours < 12) {
    apiError('SESSION_TOO_NEW', 'Sessions can only be revoked after 12 hours', 400);
}

$deleted = deleteUserSession($sessionId, $userId);
if (!$deleted) {
    apiError('REVOKE_FAILED', 'Unable to revoke session', 500);
}

apiSuccess(['revoked_session_id' => $sessionId]);
