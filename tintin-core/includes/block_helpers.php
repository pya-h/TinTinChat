<?php

require_once __DIR__ . '/api_helpers.php';

function blockValidateTargetUserId(int $currentUserId, int $targetUserId): void
{
    if ($targetUserId <= 0) {
        apiError('INVALID_TARGET_USER', 'Invalid target user', 400);
    }

    if ($currentUserId === $targetUserId) {
        apiError('INVALID_BLOCK_TARGET', 'You cannot block yourself', 400);
    }
}

function blockFindTargetUserId(PDO $pdo, ?int $userId = null, ?string $username = null): int
{
    $normalizedUserId = max(0, (int) ($userId ?? 0));
    $normalizedUsername = trim((string) ($username ?? ''));

    if ($normalizedUserId > 0) {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$normalizedUserId]);
    } else {
        if ($normalizedUsername === '') {
            apiError('INVALID_TARGET_USER', 'Missing target user reference', 400);
        }
        $safeUsername = apiNormalizeUsername($normalizedUsername, 'INVALID_TARGET_USERNAME');
        $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
        $stmt->execute([$safeUsername]);
    }

    $targetId = (int) ($stmt->fetchColumn() ?: 0);
    if ($targetId <= 0) {
        apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
    }

    return $targetId;
}

function blockIsUserBlockedBy(PDO $pdo, int $blockerId, int $blockedUserId): bool
{
    $stmt = $pdo->prepare(
        'SELECT 1 FROM user_blocks WHERE blocker_user_id = ? AND blocked_user_id = ? LIMIT 1'
    );
    $stmt->execute([$blockerId, $blockedUserId]);
    return (bool) $stmt->fetchColumn();
}

function blockEnforceSenderAllowed(PDO $pdo, int $senderId, int $receiverId): void
{
    if (blockIsUserBlockedBy($pdo, $receiverId, $senderId)) {
        apiError('BLOCKED_BY_USER', 'You cannot send messages to this user', 403);
    }
    if (blockIsUserBlockedBy($pdo, $senderId, $receiverId)) {
        apiError('BLOCKED_USER', 'You have blocked this user. Unblock them to send messages.', 403);
    }
}
