<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();

$otherUsername = apiNormalizeUsername($_GET['with'] ?? '', 'INVALID_TARGET_USERNAME');
$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$stmt->execute([$otherUsername]);
$otherUser = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$otherUser) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$otherUserId = (int) $otherUser['id'];
if ($otherUserId === $userId) {
    apiSuccess(['is_typing' => false]);
}

$check = $pdo->prepare(
    'SELECT is_typing, updated_at
     FROM chat_typing_status
     WHERE typer_user_id = ? AND target_user_id = ?
     LIMIT 1'
);
$check->execute([$otherUserId, $userId]);
$row = $check->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    apiSuccess(['is_typing' => false]);
}

$isTyping = (int) ($row['is_typing'] ?? 0) === 1;
$updatedAt = isset($row['updated_at']) ? strtotime((string) $row['updated_at']) : false;
$isFresh = $updatedAt !== false && $updatedAt >= (time() - 8);

apiSuccess([
    'is_typing' => $isTyping && $isFresh,
    'updated_at' => $row['updated_at'] ?? null,
]);
