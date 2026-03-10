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


$role = groupRequireMembership($pdo, $groupId, $userId);

if ($role === 'owner') {
	$pdo->beginTransaction();
	try {
		$lockMembersStmt = $pdo->prepare('SELECT user_id, role FROM group_members WHERE group_id = ? FOR UPDATE');
		$lockMembersStmt->execute([$groupId]);
		$members = $lockMembersStmt->fetchAll(PDO::FETCH_ASSOC);
		$memberCount = count($members);

		if ($memberCount > 1) {
			throw new RuntimeException('OWNER_TRANSFER_REQUIRED');
		}

		$deleteMembershipStmt = $pdo->prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1');
		$deleteMembershipStmt->execute([$groupId, $userId]);

		$deleteGroupStmt = $pdo->prepare('DELETE FROM groups WHERE id = ? LIMIT 1');
		$deleteGroupStmt->execute([$groupId]);

		$pdo->commit();
	} catch (RuntimeException $ex) {
		if ($pdo->inTransaction()) {
			$pdo->rollBack();
		}
		if ($ex->getMessage() === 'OWNER_TRANSFER_REQUIRED') {
			apiError('OWNER_TRANSFER_REQUIRED', 'Transfer ownership before leaving this group', 400);
		}
		apiError('GROUP_LEAVE_FAILED', 'Failed to leave group', 500);
	} catch (Throwable $ex) {
		if ($pdo->inTransaction()) {
			$pdo->rollBack();
		}
		apiError('GROUP_LEAVE_FAILED', 'Failed to leave group', 500);
	}

	apiSuccess(['group_id' => $groupId, 'group_deleted' => true]);
}

$deleteStmt = $pdo->prepare('DELETE FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1');
if (!$deleteStmt->execute([$groupId, $userId])) {
	apiError('GROUP_LEAVE_FAILED', 'Failed to leave group', 500);
}

apiSuccess(['group_id' => $groupId, 'group_deleted' => false]);
