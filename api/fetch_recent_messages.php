<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Not logged in']);
  exit;
}

$user_id = $_SESSION['user_id'];
$other_username = $_GET['with'] ?? '';

if (!$other_username) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing target username!']);
  exit;
}

if(!isset($_GET['offsetMsgId'])) {
  http_response_code(400);
  echo json_encode(['error' => 'Cannot fetch recent messages without specifying the offset message!']);
  exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$other_username]);
$other_user = $stmt->fetch();

if (!$other_user) {
  http_response_code(404);
  echo json_encode(['error' => 'Target user not found']);
  exit;
}
$other_user_id = $other_user['id'];
$last_msg_id = (int)$_GET['offsetMsgId'];

$stmt = $pdo->prepare("SELECT id, sender_id, receiver_id, message, message_for_sender, message_type, voice_file_path, image_file_path, any_file_path, file_size, reply_to_message_id, created_at,
  r.id AS reply_message_id,
  r.sender_id AS reply_sender_id,
  r.message AS reply_message,
  r.message_for_sender AS reply_message_for_sender,
  r.message_type AS reply_message_type
  FROM messages
  LEFT JOIN messages r ON r.id = messages.reply_to_message_id
  WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND id > ? ORDER BY created_at ASC");
$stmt->execute([$user_id, $other_user_id, $other_user_id, $user_id, $last_msg_id]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode([
  'messages' => $messages,
]);