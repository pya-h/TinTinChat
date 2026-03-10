<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('GET');
$currentUserId = apiRequireAuth();

$userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
$username = trim((string) ($_GET['username'] ?? ''));

if ($userId <= 0 && $username === '') {
    apiError('INVALID_USER_REFERENCE', 'Missing user reference', 400);
}

if ($userId > 0) {
    $stmt = $pdo->prepare('SELECT id, username, created_at, avatar_updated_at FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
} else {
    $stmt = $pdo->prepare('SELECT id, username, created_at, avatar_updated_at FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
}

$userRow = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$userRow) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}

$targetUserId = (int) ($userRow['id'] ?? 0);
$targetUsername = (string) ($userRow['username'] ?? '');
$avatarUpdatedAt = (string) ($userRow['avatar_updated_at'] ?? '');
$avatarVersion = $avatarUpdatedAt !== '' ? (string) strtotime($avatarUpdatedAt) : (string) time();

apiSuccess([
    'user' => [
        'user_id' => $targetUserId,
        'username' => $targetUsername,
        'public_ident' => 'usr-' . $targetUserId,
        'member_since' => (string) ($userRow['created_at'] ?? ''),
        'is_current_user' => $targetUserId === $currentUserId,
        'avatar_url' => 'api/get_avatar.php?user_id=' . $targetUserId . '&size=256&v=' . urlencode($avatarVersion),
    ],
]);
