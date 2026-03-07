<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

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

apiSuccess(['chatUsers' => $users]);
