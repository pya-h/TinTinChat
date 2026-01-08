<?php
session_start();
require_once '../includes/db.php';

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

$limit = max(1, min($limit, 100));

$countStmt = $pdo->prepare('
    SELECT COUNT(*) as total
    FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
');
$countStmt->execute([$userId, $otherUserId, $otherUserId, $userId]);
$totalMessages = $countStmt->fetch()['total'];

$stmt = $pdo->prepare('
    SELECT id, sender_id, receiver_id, message, message_for_sender, message_type, voice_file_path, image_file_path, created_at
    FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at DESC
    LIMIT ' . $limit . ' OFFSET ' . $offset);
$stmt->execute([$userId, $otherUserId, $otherUserId, $userId]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

$messages = array_reverse($messages);

$hasMore = ($offset + $limit) < $totalMessages;

echo json_encode([
  'messages' => $messages,
  'hasMore' => $hasMore,
  'total' => $totalMessages,
  'offset' => $offset,
  'limit' => $limit
]);
