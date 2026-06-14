<?php
session_start();

require_once __DIR__ . '/../../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../../tintin-core/includes/api_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiRequireSuperuserAdmin($pdo, $userId);

$body = apiGetJsonBody();
$targetUserId = isset($body['user_id']) ? (int) $body['user_id'] : 0;
$makeBanned = !empty($body['ban']);

if ($targetUserId <= 0) {
	apiError('INVALID_USER_ID', 'Invalid user id.', 400);
}

if ($targetUserId === $userId) {
	apiError('FORBIDDEN', 'You cannot ban yourself.', 403);
}

$superuserUsername = apiGetConfiguredSuperuserUsername();

$targetStmt = $pdo->prepare('SELECT id, username, banned_at FROM users WHERE id = ? LIMIT 1');
$targetStmt->execute([$targetUserId]);
$targetUser = $targetStmt->fetch(PDO::FETCH_ASSOC);
if (!$targetUser) {
	apiError('USER_NOT_FOUND', 'User not found.', 404);
}

$targetUsername = (string) ($targetUser['username'] ?? '');
if ($superuserUsername !== '' && strcasecmp($targetUsername, $superuserUsername) === 0) {
	apiError('FORBIDDEN', 'Cannot ban the superuser.', 403);
}

$bannedAt = $makeBanned ? date('Y-m-d H:i:s') : null;

$updateStmt = $pdo->prepare('UPDATE users SET banned_at = ? WHERE id = ? LIMIT 1');
$updateStmt->execute([$bannedAt, $targetUserId]);

apiSuccess([
	'user_id' => $targetUserId,
	'username' => $targetUsername,
	'banned_at' => $bannedAt,
]);
