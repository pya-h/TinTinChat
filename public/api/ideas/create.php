<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$input = apiGetJsonBody();
$body = trim((string) ($input['body'] ?? ''));
if ($body === '') {
    apiError('EMPTY_BODY', 'Idea body cannot be empty.', 400);
}
if (strlen($body) > 2000) {
    apiError('BODY_TOO_LONG', 'Idea body must be 2000 characters or fewer.', 400);
}

// Rate-limit: max 5 ideas per hour per user
$rateLimitStmt = $pdo->prepare('
    SELECT COUNT(*) FROM ideas
    WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
');
$rateLimitStmt->execute([$userId]);
if ((int) $rateLimitStmt->fetchColumn() >= 5) {
    apiError('RATE_LIMITED', 'You can only post 5 ideas per hour. Please wait.', 429);
}

$stmt = $pdo->prepare('INSERT INTO ideas (user_id, body) VALUES (?, ?)');
$stmt->execute([$userId, $body]);
$ideaId = (int) $pdo->lastInsertId();

apiSuccess(['idea_id' => $ideaId]);
