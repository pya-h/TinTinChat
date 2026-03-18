<?php

require_once __DIR__ . '/api_helpers.php';

function groupParseId($value): int
{
    if (!is_numeric($value)) {
        return 0;
    }
    return max(0, (int) $value);
}

function groupGenerateJoinToken(): string
{
    return bin2hex(random_bytes(TTC_GROUP_JOIN_TOKEN_BYTES));
}

function groupGenerateUniqueJoinToken(PDO $pdo, int $maxAttempts = 5): string
{
    $attempts = max(1, $maxAttempts);
    $stmt = $pdo->prepare('SELECT 1 FROM groups WHERE join_token = ? LIMIT 1');

    for ($i = 0; $i < $attempts; $i++) {
        $candidate = groupGenerateJoinToken();
        $stmt->execute([$candidate]);
        if (!$stmt->fetchColumn()) {
            return $candidate;
        }
    }

    apiError('GROUP_JOIN_TOKEN_EXHAUSTED', 'Unable to generate unique group join token', 500);
    throw new RuntimeException('Unable to generate unique group join token');
}

function groupBuildJoinLink(string $token): string
{
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

    $scriptName = (string) ($_SERVER['SCRIPT_NAME'] ?? '');
    $basePath = '/';
    if ($scriptName !== '') {
        $normalizedScript = str_replace('\\', '/', $scriptName);
        $apiPos = strpos($normalizedScript, '/api/');

        if ($apiPos !== false) {
            $projectBase = rtrim(substr($normalizedScript, 0, $apiPos), '/');
        } else {
            $apiDir = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');
            $projectBase = rtrim(str_replace('\\', '/', dirname($apiDir)), '/');
        }

        $basePath = $projectBase === '' ? '/' : $projectBase . '/';
    }

    return $scheme . '://' . $host . $basePath . 'dashboard.php?join_group=' . urlencode($token);
}

function groupStringLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return (int) mb_strlen($value);
    }

    return strlen($value);
}

function groupGetMembershipRole(PDO $pdo, int $groupId, int $userId): ?string
{
    $stmt = $pdo->prepare('SELECT role FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1');
    $stmt->execute([$groupId, $userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row || !isset($row['role'])) {
        return null;
    }

    return (string) $row['role'];
}

function groupRequireMembership(PDO $pdo, int $groupId, int $userId): string
{
    $role = groupGetMembershipRole($pdo, $groupId, $userId);
    if ($role === null) {
        apiError('GROUP_FORBIDDEN', 'You are not a member of this group', 403);
    }

    return $role;
}

function groupRequireManagePermission(PDO $pdo, int $groupId, int $userId): string
{
    $role = groupRequireMembership($pdo, $groupId, $userId);
    if (!in_array($role, ['owner', 'admin'], true)) {
        apiError('GROUP_FORBIDDEN', 'Only group owner/admin can perform this action', 403);
    }

    return $role;
}

function groupFetchById(PDO $pdo, int $groupId): ?array
{
    $stmt = $pdo->prepare('SELECT id, title, description, created_by_user_id, join_token, created_at, updated_at FROM groups WHERE id = ? LIMIT 1');
    $stmt->execute([$groupId]);
    $group = $stmt->fetch(PDO::FETCH_ASSOC);

    return $group ?: null;
}

function groupMarkMessagesSeenAndRead(PDO $pdo, int $groupId, int $viewerUserId, int $upToMessageId = 0): void
{
    if ($groupId <= 0 || $viewerUserId <= 0) {
        return;
    }

    $maxMessageId = max(0, $upToMessageId);
    if ($maxMessageId <= 0) {
        $maxStmt = $pdo->prepare('SELECT COALESCE(MAX(id), 0) FROM messages WHERE group_id = ?');
        $maxStmt->execute([$groupId]);
        $maxMessageId = (int) $maxStmt->fetchColumn();
    }

    if ($maxMessageId <= 0) {
        return;
    }

    $readStmt = $pdo->prepare(
        'INSERT INTO group_member_reads (group_id, user_id, last_read_message_id, last_read_at)
         VALUES (?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
            last_read_message_id = GREATEST(last_read_message_id, VALUES(last_read_message_id)),
            last_read_at = NOW()'
    );
    $readStmt->execute([$groupId, $viewerUserId, $maxMessageId]);

    $seenStmt = $pdo->prepare(
        'UPDATE messages
         SET group_seen_at = NOW(),
             group_seen_by_user_id = ?
         WHERE group_id = ?
           AND sender_id <> ?
           AND group_seen_at IS NULL
           AND id <= ?'
    );
    $seenStmt->execute([$viewerUserId, $groupId, $viewerUserId, $maxMessageId]);
}
