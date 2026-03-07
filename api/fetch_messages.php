<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('GET');
$userId = apiRequireAuth();
$otherUsername = apiNormalizeUsername($_GET['with'] ?? '', 'INVALID_TARGET_USERNAME');

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$otherUsername]);
$otherUser = $stmt->fetch();

if (!$otherUser) {
  apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}
$otherUserId = $otherUser['id'];

$offset = isset($_GET['offset']) ? max(0, (int)$_GET['offset']) : 0;
$last_msg_id = isset($_GET['lastMsg']) ? (int)$_GET['lastMsg'] : 0;
$limit = max(1, min(100, isset($_GET['limit']) ? (int)$_GET['limit'] : 20));

$count_query = $pdo->prepare('
    SELECT COUNT(*) as total
    FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
');
$count_query->execute([$userId, $otherUserId, $otherUserId, $userId]);
$total_count = $count_query->fetch()['total'];
$hasMore = ($offset + $limit) < $total_count;

if(!$hasMore) {
  $limit = $total_count - $offset;
  $offset = 0;
} else if($offset < $total_count) {
  $offset = max(0, $total_count - $limit - $offset);
}

$params = [$userId, $otherUserId, $otherUserId, $userId];
if ($last_msg_id) {
  $where_clause = '((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)) AND m.id > ?';
  $params[] = $last_msg_id;
} else {
  $where_clause = '(m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)';
}
$stmt = $pdo->prepare("SELECT m.id, m.sender_id, m.receiver_id, m.message, m.message_for_sender, m.message_type, m.voice_file_path, m.image_file_path, m.any_file_path, m.file_size, m.reply_to_message_id, m.forwarded_from_message_id, m.forwarded_by_user_id, m.created_at, m.seen_at,
  r.id AS reply_message_id,
  r.sender_id AS reply_sender_id,
  r.message AS reply_message,
  r.message_for_sender AS reply_message_for_sender,
  r.message_type AS reply_message_type,
  fu.username AS forwarded_by_username,
  fmu.username AS forwarded_original_sender_username
  FROM messages m
  LEFT JOIN messages r ON r.id = m.reply_to_message_id
  LEFT JOIN users fu ON fu.id = m.forwarded_by_user_id
  LEFT JOIN messages fm ON fm.id = m.forwarded_from_message_id
  LEFT JOIN users fmu ON fmu.id = fm.sender_id
  WHERE $where_clause ORDER BY m.created_at ASC LIMIT $limit OFFSET $offset");

$stmt->execute($params);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

apiSuccess([
  'messages' => $messages,
  'hasMore' => $hasMore,
  'total' => $total_count,
  'offset' => $offset,
  'limit' => $limit
]);
