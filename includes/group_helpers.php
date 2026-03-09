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
    try {
        return bin2hex(random_bytes(TTC_GROUP_JOIN_TOKEN_BYTES));
    } catch (Throwable $ex) {
        return sha1(uniqid('grp_', true) . microtime(true));
    }
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
        $apiDir = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');
        $projectBase = rtrim(str_replace('\\', '/', dirname($apiDir)), '/');
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
