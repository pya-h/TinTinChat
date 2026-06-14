<?php
session_start();

require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/group_helpers.php';

apiRequireMethod('POST');
$requestUserId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$groupId = groupParseId($body['group_id'] ?? $_POST['group_id'] ?? null);
$targetUserId = groupParseId($body['user_id'] ?? $_POST['user_id'] ?? null);

if ($groupId <= 0 || $targetUserId <= 0) {
	apiError('INVALID_PARAMETERS', 'Invalid group/member parameters', 400);
}

$requestRole = groupRequireManagePermission($pdo, $groupId, $requestUserId);
if ($targetUserId === $requestUserId) {
	apiError('SELF_REMOVE_NOT_ALLOWED', 'Use leave group to remove yourself', 400);
}

$targetStmt = $pdo->prepare('SELECT role FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1');
$targetStmt->execute([$groupId, $targetUserId]);
$targetRole = $targetStmt->fetchColumn();
if (!$targetRole) {
	apiError('GROUP_MEMBER_NOT_FOUND', 'Target user is not in this group', 404);
}

if ($targetRole === 'owner') {
	apiError('OWNER_REMOVE_NOT_ALLOWED', 'Owner cannot be removed from group', 400);
}

if ($requestRole === 'admin' && $targetRole !== 'member') {
	apiError('GROUP_FORBIDDEN', 'Admins can only remove members', 403);
}

$deleteStmt = $pdo->prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1');
if (!$deleteStmt->execute([$groupId, $targetUserId])) {
	apiError('GROUP_MEMBER_REMOVE_FAILED', 'Failed to remove member', 500);
}

apiSuccess(['group_id' => $groupId, 'removed_user_id' => $targetUserId]);
