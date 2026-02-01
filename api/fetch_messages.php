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

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$last_msg_id = isset($_GET['lastMsg']) ? (int)$_GET['lastMsg'] : 0;
$limit = max(1, min($limit, 100));

$count_query = $pdo->prepare('
    SELECT COUNT(*) as total
    FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
');
$count_query->execute([$userId, $otherUserId, $otherUserId, $userId]);
$total_count = $count_query->fetch()['total'];
$where_clause = $last_msg_id 
  ? "((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND id > $last_msg_id" 
  : '(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)';
$stmt = $pdo->prepare("SELECT id, sender_id, receiver_id, message, message_for_sender, message_type, voice_file_path, image_file_path, created_at, seen_at
    FROM messages WHERE $where_clause ORDER BY created_at DESC LIMIT $limit OFFSET $offset");
$stmt->execute([$userId, $otherUserId, $otherUserId, $userId]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

$messages = array_reverse($messages);

$hasMore = ($offset + $limit) < $total_count;

echo json_encode([
  'messages' => $messages,
  'hasMore' => $hasMore,
  'total' => $total_count,
  'offset' => $offset,
  'limit' => $limit
]);
