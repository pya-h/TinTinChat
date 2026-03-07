<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
$otherUsername = apiNormalizeUsername($_GET['with'] ?? '', 'INVALID_TARGET_USERNAME');
$maxIds = 200;

$rawIds = trim((string) ($_GET['message_ids'] ?? ''));
if ($rawIds === '') {
    apiSuccess(['seen_message_ids' => [], 'seen_messages' => []]);
}

$messageIds = array_values(array_unique(array_filter(array_map('intval', explode(',', $rawIds)), static function ($id) {
    return $id > 0;
})));

if (count($messageIds) > $maxIds) {
    $messageIds = array_slice($messageIds, 0, $maxIds);
}

if (empty($messageIds)) {
    apiSuccess(['seen_message_ids' => [], 'seen_messages' => []]);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? LIMIT 1');
$stmt->execute([$otherUsername]);
$otherUser = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$otherUser) {
    apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}
$otherUserId = (int) $otherUser['id'];

$placeholders = implode(',', array_fill(0, count($messageIds), '?'));
$params = array_merge([$userId, $otherUserId], $messageIds);

$seenStmt = $pdo->prepare(
    "SELECT id, seen_at
     FROM messages
     WHERE sender_id = ?
       AND receiver_id = ?
       AND seen_at IS NOT NULL
       AND id IN ($placeholders)"
);
$seenStmt->execute($params);
$seenRows = $seenStmt->fetchAll(PDO::FETCH_ASSOC);
$seenMessageIds = [];
$seenMessages = [];
foreach ($seenRows as $row) {
    $id = isset($row['id']) ? (int) $row['id'] : 0;
    if ($id <= 0) {
        continue;
    }
    $seenMessageIds[] = $id;
    $seenMessages[] = [
        'id' => $id,
        'seen_at' => (string) ($row['seen_at'] ?? ''),
    ];
}

apiSuccess(['seen_message_ids' => $seenMessageIds, 'seen_messages' => $seenMessages]);
