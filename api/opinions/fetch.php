<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('GET');
$currentUserId = apiRequireAuth();
session_write_close();

$targetUserId = isset($_GET['target_user_id']) ? (int) $_GET['target_user_id'] : 0;

if ($targetUserId > 0) {
    $stmt = $pdo->prepare(
        'SELECT o.id, o.body, o.created_at, o.updated_at, u.username AS target_username, u.id AS target_user_id
         FROM user_opinions o
         JOIN users u ON o.target_user_id = u.id
         WHERE o.author_user_id = ? AND o.target_user_id = ?
         LIMIT 1'
    );
    $stmt->execute([$currentUserId, $targetUserId]);
    $opinion = $stmt->fetch(PDO::FETCH_ASSOC);
    apiSuccess(['opinion' => $opinion ?: null]);
}

$stmt = $pdo->prepare(
    'SELECT o.id, o.body, o.target_user_id, o.created_at, o.updated_at, u.username AS target_username
     FROM user_opinions o
     JOIN users u ON o.target_user_id = u.id
     WHERE o.author_user_id = ?
     ORDER BY o.updated_at DESC'
);
$stmt->execute([$currentUserId]);
$opinions = $stmt->fetchAll(PDO::FETCH_ASSOC);

apiSuccess(['opinions' => $opinions]);
