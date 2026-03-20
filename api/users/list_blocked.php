<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('GET');
$currentUserId = apiRequireAuth();
session_write_close();

$stmt = $pdo->prepare(
    'SELECT ub.blocked_user_id AS id, u.username, ub.created_at AS blocked_at
     FROM user_blocks ub
     JOIN users u ON u.id = ub.blocked_user_id
     WHERE ub.blocker_user_id = ?
     ORDER BY ub.created_at DESC
     LIMIT 200'
);
$stmt->execute([$currentUserId]);
$blockedUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

apiSuccess(['blocked_users' => $blockedUsers]);
