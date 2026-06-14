<?php
session_start();

require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/group_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();

$stmt = $pdo->prepare(
	'SELECT
		g.id,
		g.title,
		g.description,
		gm.role,
		g.created_at,
		g.updated_at,
		MAX(m.created_at) AS last_message_at,
		COUNT(DISTINCT gm2.user_id) AS member_count,
		(
			SELECT COUNT(*)
			FROM messages m_unread
			WHERE m_unread.group_id = g.id
			  AND m_unread.sender_id <> ?
			  AND m_unread.id > COALESCE((
				SELECT gmr.last_read_message_id
				FROM group_member_reads gmr
				WHERE gmr.group_id = g.id
				  AND gmr.user_id = ?
				LIMIT 1
			), 0)
		) AS unread_count
	 FROM groups g
	 JOIN group_members gm ON gm.group_id = g.id AND gm.user_id = ?
	 LEFT JOIN group_members gm2 ON gm2.group_id = g.id
	 LEFT JOIN messages m ON m.group_id = g.id
	 GROUP BY g.id, g.title, g.description, gm.role, g.created_at, g.updated_at
	 ORDER BY COALESCE(MAX(m.created_at), g.updated_at, g.created_at) DESC'
);
$stmt->execute([$userId, $userId, $userId]);
$groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

apiSuccess(['groups' => $groups]);
