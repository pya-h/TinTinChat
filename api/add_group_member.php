<?php
session_start();

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/group_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$groupId = groupParseId($body['group_id'] ?? $_POST['group_id'] ?? null);
if ($groupId <= 0) {
    apiError('INVALID_GROUP_ID', 'Invalid group id', 400);
}

groupRequireManagePermission($pdo, $groupId, $userId);

$targetUsername = apiNormalizeUsername($body['username'] ?? $_POST['username'] ?? '', 'INVALID_TARGET_USERNAME');
$targetStmt = $pdo->prepare('SELECT id, username FROM users WHERE username = ? LIMIT 1');
$targetStmt->execute([$targetUsername]);
$target = $targetStmt->fetch(PDO::FETCH_ASSOC);
if (!$target) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}
$targetUserId = (int) $target['id'];

$existsStmt = $pdo->prepare('SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1');
$existsStmt->execute([$groupId, $targetUserId]);
if ($existsStmt->fetchColumn()) {
    apiError('ALREADY_GROUP_MEMBER', 'User is already a group member', 409);
}

$insertStmt = $pdo->prepare('INSERT INTO group_members (group_id, user_id, role, invited_by_user_id) VALUES (?, ?, ?, ?)');
if (!$insertStmt->execute([$groupId, $targetUserId, 'member', $userId])) {
    apiError('GROUP_MEMBER_ADD_FAILED', 'Failed to add member', 500);
}

apiSuccess([
    'member' => [
        'user_id' => $targetUserId,
        'username' => $target['username'],
        'role' => 'member',
    ],
]);
