<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/group_helpers.php';
require_once __DIR__ . '/../../includes/group_crypto_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();

$body = apiGetJsonBody();
$joinToken = trim((string) ($body['token'] ?? $_POST['token'] ?? ''));
if ($joinToken === '') {
	apiError('INVALID_JOIN_TOKEN', 'Invalid join token', 400);
}
if (strlen($joinToken) > 128 || !preg_match('/^[a-f0-9]{32,128}$/i', $joinToken)) {
	apiError('INVALID_JOIN_TOKEN', 'Invalid join token', 400);
}

$groupStmt = $pdo->prepare('SELECT id, title, description FROM groups WHERE join_token = ? LIMIT 1');
$groupStmt->execute([$joinToken]);
$group = $groupStmt->fetch(PDO::FETCH_ASSOC);
if (!$group) {
	apiError('GROUP_NOT_FOUND', 'Group not found for this invite link', 404);
}

$groupId = (int) $group['id'];
$existsStmt = $pdo->prepare('SELECT role FROM group_members WHERE group_id = ? AND user_id = ? LIMIT 1');
$existsStmt->execute([$groupId, $userId]);
$existingRole = $existsStmt->fetchColumn();
if ($existingRole) {
	apiSuccess([
		'group' => [
			'id' => $groupId,
			'title' => $group['title'],
			'description' => $group['description'],
		],
		'role' => $existingRole,
		'already_member' => true,
	]);
}

$pdo->beginTransaction();
try {
	$insertStmt = $pdo->prepare('INSERT INTO group_members (group_id, user_id, role, invited_by_user_id) VALUES (?, ?, ?, NULL)');
	if (!$insertStmt->execute([$groupId, $userId, 'member'])) {
		throw new RuntimeException('GROUP_JOIN_FAILED');
	}

	groupEnsureMemberHasSharedKey($pdo, $groupId, $userId);

	$pdo->commit();
} catch (Throwable $ex) {
	if ($pdo->inTransaction()) {
		$pdo->rollBack();
	}
	if ($ex instanceof RuntimeException && $ex->getMessage() === 'GROUP_JOIN_FAILED') {
		apiError('GROUP_JOIN_FAILED', 'Failed to join group', 500);
	}
	apiError('GROUP_JOIN_KEY_ASSIGNMENT_FAILED', 'Failed to assign group encryption key', 500);
}

apiSuccess([
	'group' => [
		'id' => $groupId,
		'title' => $group['title'],
		'description' => $group['description'],
	],
	'role' => 'member',
	'already_member' => false,
]);
