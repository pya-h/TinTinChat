<?php
session_start();
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../../includes/api_helpers.php';
require_once __DIR__ . '/../../includes/group_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
session_write_close();

$groupId = groupParseId($_GET['group_id'] ?? null);
$otherUsername = $groupId > 0 ? '' : apiNormalizeUsername($_GET['with'] ?? '', 'INVALID_TARGET_USERNAME');

$offset = max(0, (int) ($_GET['offset'] ?? 0));
$limit = max(1, min(200, (int) ($_GET['limit'] ?? 50)));

$params = [];
$whereClause = '';

if ($groupId > 0) {
    groupRequireMembership($pdo, $groupId, $userId);
    $whereClause = 'm.group_id = ? AND m.message_type = ? AND m.any_file_path IS NOT NULL';
    $params = [$groupId, 'file'];
} else {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$otherUsername]);
    $otherUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$otherUser) {
        apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
    }

    $otherUserId = (int) ($otherUser['id'] ?? 0);
    $whereClause = '((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)) AND m.message_type = ? AND m.any_file_path IS NOT NULL';
    $params = [$userId, $otherUserId, $otherUserId, $userId, 'file'];
}

$countStmt = $pdo->prepare("SELECT COUNT(*) FROM messages m WHERE $whereClause");
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();

$listStmt = $pdo->prepare(
    "SELECT
        m.id,
        m.sender_id,
        m.receiver_id,
        m.group_id,
        m.message,
        m.message_for_sender,
        m.message_type,
        m.any_file_path,
        m.file_purged_at,
        m.file_size,
        m.created_at,
        su.username AS sender_username
     FROM messages m
     LEFT JOIN users su ON su.id = m.sender_id
     WHERE $whereClause
     ORDER BY m.created_at DESC, m.id DESC
     LIMIT $limit OFFSET $offset"
);
$listStmt->execute($params);
$items = $listStmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($items as &$item) {
    $item['any_file_path'] = !empty($item['any_file_path']) ? 1 : null;
}
unset($item);

$nextOffset = $offset + count($items);
$hasMore = $nextOffset < $total;

apiSuccess([
    'items' => $items,
    'offset' => $offset,
    'nextOffset' => $nextOffset,
    'limit' => $limit,
    'total' => $total,
    'hasMore' => $hasMore,
]);
