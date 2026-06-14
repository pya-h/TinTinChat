<?php
session_start();
require_once __DIR__ . '/../../../tintin-core/includes/db.php';
require_once __DIR__ . '/../../../tintin-core/includes/api_helpers.php';
require_once __DIR__ . '/../../../tintin-core/includes/group_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();

$groupId = groupParseId($_GET['group_id'] ?? null);
$otherUsername = $groupId > 0 ? '' : apiNormalizeUsername($_GET['with'] ?? '', 'INVALID_TARGET_USERNAME');

$params = [];
$whereClause = '';

if ($groupId > 0) {
    groupRequireMembership($pdo, $groupId, $userId);
    $whereClause = 'm.group_id = ?';
    $params[] = $groupId;
} else {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$otherUsername]);
    $otherUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$otherUser) {
        apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
    }

    $otherUserId = (int) ($otherUser['id'] ?? 0);
    $whereClause = '((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))';
    $params = [$userId, $otherUserId, $otherUserId, $userId];
}

$statsStmt = $pdo->prepare(
    "SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN m.message_type = 'text' THEN 1 ELSE 0 END) AS text_count,
        SUM(CASE WHEN m.message_type = 'voice' THEN 1 ELSE 0 END) AS voice_count,
        SUM(CASE WHEN m.message_type = 'image' THEN 1 ELSE 0 END) AS image_count,
        SUM(CASE WHEN m.message_type = 'video' THEN 1 ELSE 0 END) AS video_count,
        SUM(CASE WHEN m.message_type = 'file' THEN 1 ELSE 0 END) AS file_count,
        SUM(CASE WHEN m.message_type = 'sticker' THEN 1 ELSE 0 END) AS sticker_count
     FROM messages m
     WHERE $whereClause"
);
$statsStmt->execute($params);
$row = $statsStmt->fetch(PDO::FETCH_ASSOC) ?: [];

apiSuccess([
    'stats' => [
        'total' => (int) ($row['total'] ?? 0),
        'text' => (int) ($row['text_count'] ?? 0),
        'voice' => (int) ($row['voice_count'] ?? 0),
        'image' => (int) ($row['image_count'] ?? 0),
        'video' => (int) ($row['video_count'] ?? 0),
        'file' => (int) ($row['file_count'] ?? 0),
        'sticker' => (int) ($row['sticker_count'] ?? 0),
    ],
]);
