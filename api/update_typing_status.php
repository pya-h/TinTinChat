<?php
require_once __DIR__ . '/typing/update.php';
return;

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';
require_once __DIR__ . '/../includes/group_helpers.php';

function ensureGroupTypingStatusTable(PDO $pdo): void
{
    static $initialized = false;
    if ($initialized) {
        return;
    }

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS group_typing_status (
            group_id INT NOT NULL,
            typer_user_id INT NOT NULL,
            is_typing TINYINT(1) NOT NULL DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (group_id, typer_user_id),
            KEY idx_group_typing_lookup (group_id, updated_at),
            CONSTRAINT fk_group_typing_group
              FOREIGN KEY (group_id) REFERENCES groups(id)
              ON DELETE CASCADE,
            CONSTRAINT fk_group_typing_user
              FOREIGN KEY (typer_user_id) REFERENCES users(id)
              ON DELETE CASCADE
        )'
    );

    $initialized = true;
}

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$targetUsernameRaw = trim((string) ($body['target'] ?? ''));
$groupId = groupParseId($body['group_id'] ?? 0);
$isTypingRaw = $body['is_typing'] ?? false;
$isTyping = (int) filter_var($isTypingRaw, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
if ($isTyping !== 0 && $isTyping !== 1) {
    $isTyping = 0;
}

if ($groupId > 0) {
    groupRequireMembership($pdo, $groupId, $userId);
    ensureGroupTypingStatusTable($pdo);

    $upsert = $pdo->prepare(
        'INSERT INTO group_typing_status (group_id, typer_user_id, is_typing)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE is_typing = VALUES(is_typing), updated_at = CURRENT_TIMESTAMP'
    );
    $upsert->execute([$groupId, $userId, $isTyping]);

    apiSuccess([
        'is_typing' => (bool) $isTyping,
        'scope' => 'group',
        'group_id' => $groupId,
    ]);
}

$targetUsername = apiNormalizeUsername($targetUsernameRaw, 'INVALID_TARGET_USERNAME');

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
