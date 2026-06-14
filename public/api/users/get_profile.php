<?php
session_start();

require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';
require_once __DIR__ . '/../../../tintin-core/includes/block_helpers.php';

apiRequireMethod('GET');
$currentUserId = apiRequireAuth();
session_write_close();

$userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 0;
$username = trim((string) ($_GET['username'] ?? ''));

if ($userId <= 0 && $username === '') {
	apiError('INVALID_USER_REFERENCE', 'Missing user reference', 400);
}

if ($userId > 0) {
	$stmt = $pdo->prepare('SELECT id, username, created_at, avatar_updated_at, bio FROM users WHERE id = ? LIMIT 1');
	$stmt->execute([$userId]);
} else {
	$stmt = $pdo->prepare('SELECT id, username, created_at, avatar_updated_at, bio FROM users WHERE username = ? LIMIT 1');
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
$isBlockedByMe = false;
if ($targetUserId > 0 && $targetUserId !== $currentUserId) {
	$isBlockedByMe = blockIsUserBlockedBy($pdo, $currentUserId, $targetUserId);
}

apiSuccess([
	'user' => [
		'user_id' => $targetUserId,
		'username' => $targetUsername,
		'public_ident' => 'usr-' . $targetUserId,
		'member_since' => (string) ($userRow['created_at'] ?? ''),
		'bio' => (string) ($userRow['bio'] ?? ''),
		'is_current_user' => $targetUserId === $currentUserId,
		'is_blocked_by_me' => $isBlockedByMe,
		'avatar_url' => 'api/users/get_avatar.php?user_id=' . $targetUserId . '&size=256&v=' . urlencode($avatarVersion),
	],
]);
