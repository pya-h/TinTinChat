<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';
require_once __DIR__ . '/../includes/group_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();

$stmt = $pdo->prepare('
  SELECT DISTINCT u.username
  FROM users u
  JOIN (
    SELECT sender_id as user_id, created_at as interaction_date FROM messages WHERE receiver_id = ?
    UNION
    SELECT receiver_id as user_id, created_at as interaction_date FROM messages WHERE sender_id = ?
  ) m ON u.id = m.user_id
  WHERE u.id != ? ORDER BY interaction_date DESC
');
$stmt->execute([$userId, $userId, $userId]);
$users = $stmt->fetchAll(PDO::FETCH_COLUMN);

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

apiSuccess(['chatUsers' => $users, 'chatGroups' => $groups]);
