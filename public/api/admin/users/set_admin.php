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
$makeAdmin = !empty($body['is_admin']) ? 1 : 0;

if ($targetUserId <= 0) {
    apiError('INVALID_USER_ID', 'Invalid user id.', 400);
}

if ($targetUserId === $userId) {
    apiError('FORBIDDEN', 'You cannot change your own admin role.', 403);
}

$superuserUsername = apiGetConfiguredSuperuserUsername();

$targetStmt = $pdo->prepare('SELECT id, username, is_admin FROM users WHERE id = ? LIMIT 1');
$targetStmt->execute([$targetUserId]);
$targetUser = $targetStmt->fetch(PDO::FETCH_ASSOC);
if (!$targetUser) {
    apiError('USER_NOT_FOUND', 'User not found.', 404);
}

$targetUsername = (string) ($targetUser['username'] ?? '');
if ($superuserUsername !== '' && strcasecmp($targetUsername, $superuserUsername) === 0) {
    apiError('FORBIDDEN', 'Cannot modify superuser admin role.', 403);
}

$updateStmt = $pdo->prepare('UPDATE users SET is_admin = ? WHERE id = ? LIMIT 1');
$updateStmt->execute([$makeAdmin, $targetUserId]);

apiSuccess([
    'user_id' => $targetUserId,
    'username' => $targetUsername,
    'is_admin' => (bool) $makeAdmin,
]);
