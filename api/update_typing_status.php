<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$targetUsername = apiNormalizeUsername($body['target'] ?? '', 'INVALID_TARGET_USERNAME');
$isTypingRaw = $body['is_typing'] ?? false;
$isTyping = (int) filter_var($isTypingRaw, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
if ($isTyping !== 0 && $isTyping !== 1) {
    $isTyping = 0;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$stmt->execute([$targetUsername]);
$targetUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$targetUser) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$targetUserId = (int) $targetUser['id'];
if ($targetUserId === $userId) {
    apiError('INVALID_TARGET_USERNAME', 'Cannot update typing status for self', 400);
}

$upsert = $pdo->prepare(
    'INSERT INTO chat_typing_status (typer_user_id, target_user_id, is_typing)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE is_typing = VALUES(is_typing), updated_at = CURRENT_TIMESTAMP'
);
$upsert->execute([$userId, $targetUserId, $isTyping]);

apiSuccess(['is_typing' => (bool) $isTyping]);
