<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/group_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$groupId = groupParseId($body['group_id'] ?? $_POST['group_id'] ?? null);
if ($groupId <= 0) {
	apiError('INVALID_GROUP_ID', 'Invalid group id', 400);
}

groupRequireManagePermission($pdo, $groupId, $userId);
$newToken = groupGenerateUniqueJoinToken($pdo);

$updateStmt = $pdo->prepare('UPDATE groups SET join_token = ?, updated_at = NOW() WHERE id = ? LIMIT 1');
if (!$updateStmt->execute([$newToken, $groupId])) {
	apiError('GROUP_JOIN_LINK_ROTATE_FAILED', 'Failed to rotate join link', 500);
}

apiSuccess([
	'group_id' => $groupId,
	'join_token' => $newToken,
	'join_link' => groupBuildJoinLink($newToken),
]);
