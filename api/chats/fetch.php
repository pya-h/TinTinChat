<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';
require_once __DIR__ . '/../../includes/group_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();

$stmt = $pdo->prepare('
	SELECT
			u.id AS user_id,
		u.username,
		MAX(m.created_at) AS last_interaction,
		SUM(CASE WHEN m.receiver_id = ? AND m.seen_at IS NULL THEN 1 ELSE 0 END) AS unread_count
	FROM messages m
	JOIN users u
		ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
	WHERE (m.sender_id = ? OR m.receiver_id = ?)
		AND m.group_id IS NULL
	GROUP BY u.id, u.username
	ORDER BY MAX(m.created_at) DESC
');
$stmt->execute([$userId, $userId, $userId, $userId]);
$userRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$chatUserItems = array_map(
	static function (array $row): array {
		return [
				'user_id' => (int) ($row['user_id'] ?? 0),
			'username' => (string) ($row['username'] ?? ''),
			'unread_count' => max(0, (int) ($row['unread_count'] ?? 0)),
			'last_interaction' => (string) ($row['last_interaction'] ?? ''),
		];
	},
	$userRows
);

$users = array_values(array_filter(array_map(
	static function (array $row): string {
		return (string) ($row['username'] ?? '');
	},
	$userRows
)));

$groupStmt = $pdo->prepare(
	'SELECT
		g.id,
		g.title,
		g.description,
		gm.role,
		MAX(m.created_at) AS last_message_at,
		COUNT(DISTINCT gm2.user_id) AS member_count
	FROM groups g
	JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = ?
	LEFT JOIN group_members gm2 ON gm2.group_id = g.id
	LEFT JOIN messages m ON m.group_id = g.id
	GROUP BY g.id, g.title, g.description, gm.role
	ORDER BY COALESCE(MAX(m.created_at), g.updated_at, g.created_at) DESC'
);
$groupStmt->execute([$userId]);
$groups = $groupStmt->fetchAll(PDO::FETCH_ASSOC);

apiSuccess([
	'chatUsers' => $users,
	'chatUserItems' => $chatUserItems,
	'chatGroups' => $groups,
]);
