<?php
session_start();

require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';

apiRequireMethod('GET');
$currentUserId = apiRequireAuth();
session_write_close();

$targetUserId = isset($_GET['target_user_id']) ? (int) $_GET['target_user_id'] : 0;

if ($targetUserId > 0) {
    // Fetch all opinions about a specific user
    $stmt = $pdo->prepare(
        'SELECT o.id, o.body, o.created_at, o.updated_at, u.username AS target_username, u.id AS target_user_id
         FROM user_opinions o
         JOIN users u ON o.target_user_id = u.id
         WHERE o.author_user_id = ? AND o.target_user_id = ?
         ORDER BY o.created_at DESC'
    );
    $stmt->execute([$currentUserId, $targetUserId]);
    $opinions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    apiSuccess(['opinions' => $opinions]);
}

// Fetch all opinions grouped by target user
$stmt = $pdo->prepare(
    'SELECT o.id, o.body, o.target_user_id, o.created_at, o.updated_at, u.username AS target_username
     FROM user_opinions o
     JOIN users u ON o.target_user_id = u.id
     WHERE o.author_user_id = ?
     ORDER BY o.created_at DESC'
);
$stmt->execute([$currentUserId]);
$allOpinions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Group by target user for the panel view
$grouped = [];
foreach ($allOpinions as $op) {
    $tid = (int) $op['target_user_id'];
    if (!isset($grouped[$tid])) {
        $grouped[$tid] = [
            'target_user_id' => $tid,
            'target_username' => $op['target_username'],
            'count' => 0,
            'latest_body' => $op['body'],
            'latest_date' => $op['updated_at'] ?: $op['created_at'],
        ];
    }
    $grouped[$tid]['count']++;
}

apiSuccess([
    'opinions' => $allOpinions,
    'grouped' => array_values($grouped),
]);
