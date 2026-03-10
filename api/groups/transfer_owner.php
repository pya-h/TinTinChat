<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/group_helpers.php';

apiRequireMethod('POST');
$currentUserId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$groupId = groupParseId($body['group_id'] ?? $_POST['group_id'] ?? null);
$newOwnerUserId = groupParseId($body['new_owner_user_id'] ?? $_POST['new_owner_user_id'] ?? null);
if ($groupId <= 0 || $newOwnerUserId <= 0) {
	apiError('INVALID_PARAMETERS', 'Invalid group/new owner parameters', 400);
}

if ($newOwnerUserId === $currentUserId) {
	apiError('INVALID_NEW_OWNER', 'New owner must be different from current owner', 400);
}

$pdo->beginTransaction();
try {
	$lockCurrentStmt = $pdo->prepare('SELECT role FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1 FOR UPDATE');
	$lockCurrentStmt->execute([$groupId, $currentUserId]);
	$currentRole = $lockCurrentStmt->fetchColumn();
	if ($currentRole !== 'owner') {
		throw new RuntimeException('GROUP_FORBIDDEN');
	}

	$lockTargetStmt = $pdo->prepare('SELECT role FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1 FOR UPDATE');
	$lockTargetStmt->execute([$groupId, $newOwnerUserId]);
	$targetRole = $lockTargetStmt->fetchColumn();
	if (!$targetRole) {
		throw new RuntimeException('GROUP_MEMBER_NOT_FOUND');
	}

	$setCurrentAdminStmt = $pdo->prepare('UPDATE group_members SET role = ? WHERE group_id = ? AND user_id = ? LIMIT 1');
	$setCurrentAdminStmt->execute(['admin', $groupId, $currentUserId]);
	if ($setCurrentAdminStmt->rowCount() !== 1) {
		throw new RuntimeException('OWNER_TRANSFER_FAILED');
	}

	$setNewOwnerStmt = $pdo->prepare('UPDATE group_members SET role = ? WHERE group_id = ? AND user_id = ? LIMIT 1');
	$setNewOwnerStmt->execute(['owner', $groupId, $newOwnerUserId]);
	if ($setNewOwnerStmt->rowCount() !== 1) {
		throw new RuntimeException('OWNER_TRANSFER_FAILED');
	}

	$updateGroupStmt = $pdo->prepare('UPDATE groups SET created_by_user_id = ?, updated_at = NOW() WHERE id = ? LIMIT 1');
	$updateGroupStmt->execute([$newOwnerUserId, $groupId]);
	if ($updateGroupStmt->rowCount() !== 1) {
		throw new RuntimeException('OWNER_TRANSFER_FAILED');
	}

	$pdo->commit();
} catch (RuntimeException $ex) {
	if ($pdo->inTransaction()) {
		$pdo->rollBack();
	}
	if ($ex->getMessage() === 'GROUP_FORBIDDEN') {
		apiError('GROUP_FORBIDDEN', 'Only owner can transfer ownership', 403);
	}
	if ($ex->getMessage() === 'GROUP_MEMBER_NOT_FOUND') {
		apiError('GROUP_MEMBER_NOT_FOUND', 'Target user is not in this group', 404);
	}
	apiError('OWNER_TRANSFER_FAILED', 'Failed to transfer ownership', 500);
} catch (Throwable $ex) {
	if ($pdo->inTransaction()) {
		$pdo->rollBack();
	}
	apiError('OWNER_TRANSFER_FAILED', 'Failed to transfer ownership', 500);
}

apiSuccess([
	'group_id' => $groupId,
	'previous_owner_user_id' => $currentUserId,
	'new_owner_user_id' => $newOwnerUserId,
]);
