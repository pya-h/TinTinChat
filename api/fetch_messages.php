<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Not logged in']);
  exit;
}

$userId = $_SESSION['user_id'];
$otherUsername = $_GET['with'] ?? '';

if (!$otherUsername) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing target username']);
  exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$otherUsername]);
$otherUser = $stmt->fetch();

if (!$otherUser) {
  http_response_code(404);
  echo json_encode(['error' => 'Target user not found']);
  exit;
}
$otherUserId = $otherUser['id'];

$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$last_msg_id = isset($_GET['lastMsg']) ? (int)$_GET['lastMsg'] : 0;
$limit = max(1, isset($_GET['limit']) ? (int)$_GET['limit'] : 20);

$count_query = $pdo->prepare('
    SELECT COUNT(*) as total
    FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
');
$count_query->execute([$userId, $otherUserId, $otherUserId, $userId]);
$total_count = $count_query->fetch()['total'];
$hasMore = ($offset + $limit) < $total_count;

if($offset < $total_count) {
  $offset = max(0, $total_count - $limit - $offset);
}

if(!$hasMore) {
  $limit = $total_count;
}

$params = [$userId, $otherUserId, $otherUserId, $userId];
if ($last_msg_id) {
  $where_clause = '((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND id > ?';
  $params[] = $last_msg_id;
} else {
  $where_clause = '(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)';
}
$stmt = $pdo->prepare("SELECT id, sender_id, receiver_id, message, message_for_sender, message_type, voice_file_path, image_file_path, any_file_path, file_size, created_at, seen_at
    FROM messages WHERE $where_clause ORDER BY created_at ASC LIMIT $limit OFFSET $offset");

$stmt->execute($params);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  'messages' => $messages,
  'hasMore' => $hasMore,
  'total' => $total_count,
  'offset' => $offset,
  'limit' => $limit
]);
