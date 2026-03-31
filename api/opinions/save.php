<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$currentUserId = apiRequireAuth();
apiRequireCsrf();

$data = apiGetJsonBody();
$targetUserId = (int) ($data['target_user_id'] ?? 0);
$body = trim((string) ($data['body'] ?? ''));
$opinionId = (int) ($data['opinion_id'] ?? 0);

if ($targetUserId <= 0) {
    apiError('INVALID_TARGET', 'Invalid target user', 400);
}

if ($targetUserId === $currentUserId) {
    apiError('SELF_OPINION', 'Cannot write an opinion about yourself', 400);
}

if ($body === '') {
    apiError('MISSING_BODY', 'Opinion text is required', 400);
}

if (strlen($body) > 500) {
    apiError('BODY_TOO_LONG', 'Opinion must be 500 characters or fewer', 400);
}

$checkStmt = $pdo->prepare('SELECT id FROM users WHERE id = ? LIMIT 1');
$checkStmt->execute([$targetUserId]);
if (!$checkStmt->fetch()) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

if ($opinionId > 0) {
    // Edit existing opinion (must belong to current user)
    $stmt = $pdo->prepare(
        'UPDATE user_opinions SET body = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND author_user_id = ?'
    );
    if (!$stmt->execute([$body, $opinionId, $currentUserId]) || $stmt->rowCount() === 0) {
        apiError('UPDATE_FAILED', 'Could not update opinion', 400);
    }
} else {
    // Insert new opinion
    $stmt = $pdo->prepare(
        'INSERT INTO user_opinions (author_user_id, target_user_id, body) VALUES (?, ?, ?)'
    );
    if (!$stmt->execute([$currentUserId, $targetUserId, $body])) {
        apiError('DB_SAVE_FAILED', 'Could not save opinion', 500);
    }
    $opinionId = (int) $pdo->lastInsertId();
}

$fetchStmt = $pdo->prepare(
    'SELECT o.id, o.body, o.created_at, o.updated_at, u.username AS target_username, u.id AS target_user_id
     FROM user_opinions o
     JOIN users u ON o.target_user_id = u.id
     WHERE o.id = ? AND o.author_user_id = ?
     LIMIT 1'
);
$fetchStmt->execute([$opinionId, $currentUserId]);
$opinion = $fetchStmt->fetch(PDO::FETCH_ASSOC);

apiSuccess(['opinion' => $opinion, 'message' => 'Opinion saved']);
