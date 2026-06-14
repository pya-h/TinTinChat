<?php
session_start();

require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';
require_once __DIR__ . '/../../../tintin-core/includes/group_helpers.php';

apiRequireMethod('POST');
$userId = apiRequireAuth();
apiRequireCsrf();
apiRequireAdminOrSuperuser($pdo, $userId);

$body = apiGetJsonBody();
$groupId = groupParseId($body['group_id'] ?? $_POST['group_id'] ?? null);

$params = [];
$where = '';
if ($groupId > 0) {
	$where = 'WHERE g.id = ?';
	$params[] = $groupId;
}

$groupsStmt = $pdo->prepare("SELECT g.id, g.title FROM groups g {$where} ORDER BY g.id ASC");
$groupsStmt->execute($params);
$groups = $groupsStmt->fetchAll(PDO::FETCH_ASSOC);

$memberCountStmt = $pdo->prepare('SELECT COUNT(*) FROM group_members WHERE group_id = ?');
$memberKeysCountStmt = $pdo->prepare('SELECT COUNT(*) FROM group_member_keys WHERE group_id = ?');
$missingMembersStmt = $pdo->prepare(
	'SELECT gm.user_id, u.username
	 FROM group_members gm
	 JOIN users u ON u.id = gm.user_id
	 LEFT JOIN group_member_keys gmk ON gmk.group_id = gm.group_id AND gmk.user_id = gm.user_id
	 WHERE gm.group_id = ? AND gmk.user_id IS NULL
	 ORDER BY u.username ASC'
);
$textStatsStmt = $pdo->prepare(
	"SELECT
		COUNT(*) AS total_text_messages,
		SUM(CASE WHEN message LIKE 'gcm1:%' THEN 1 ELSE 0 END) AS encrypted_text_messages,
		SUM(CASE WHEN message NOT LIKE 'gcm1:%' THEN 1 ELSE 0 END) AS legacy_plaintext_messages
	 FROM messages
	 WHERE group_id = ? AND message_type = 'text'"
);

$health = [];
foreach ($groups as $group) {
	$currentGroupId = (int) $group['id'];

	$memberCountStmt->execute([$currentGroupId]);
	$membersCount = (int) $memberCountStmt->fetchColumn();

	$memberKeysCountStmt->execute([$currentGroupId]);
	$memberKeysCount = (int) $memberKeysCountStmt->fetchColumn();

	$missingMembersStmt->execute([$currentGroupId]);
	$missingMembers = $missingMembersStmt->fetchAll(PDO::FETCH_ASSOC);

	$textStatsStmt->execute([$currentGroupId]);
	$textStats = $textStatsStmt->fetch(PDO::FETCH_ASSOC) ?: [];
	$totalText = (int) ($textStats['total_text_messages'] ?? 0);
	$encryptedText = (int) ($textStats['encrypted_text_messages'] ?? 0);
	$legacyPlainText = (int) ($textStats['legacy_plaintext_messages'] ?? 0);

	$health[] = [
		'group_id' => $currentGroupId,
		'title' => (string) ($group['title'] ?? ''),
		'members_count' => $membersCount,
		'member_keys_count' => $memberKeysCount,
		'missing_member_keys_count' => count($missingMembers),
		'missing_member_keys' => $missingMembers,
		'text_messages_count' => $totalText,
		'encrypted_text_messages_count' => $encryptedText,
		'legacy_plaintext_text_messages_count' => $legacyPlainText,
		'is_healthy' => count($missingMembers) === 0,
	];
}

apiSuccess([
	'checked_at' => gmdate('Y-m-d H:i:s'),
	'groups_checked' => count($health),
	'groups' => $health,
]);
