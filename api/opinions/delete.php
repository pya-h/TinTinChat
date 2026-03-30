<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('POST');
$currentUserId = apiRequireAuth();
apiRequireCsrf();

$data = apiGetJsonBody();
$targetUserId = (int) ($data['target_user_id'] ?? 0);

if ($targetUserId <= 0) {
    apiError('INVALID_TARGET', 'Invalid target user', 400);
}

$stmt = $pdo->prepare('DELETE FROM user_opinions WHERE author_user_id = ? AND target_user_id = ?');
$stmt->execute([$currentUserId, $targetUserId]);

apiSuccess(['message' => 'Opinion deleted']);
