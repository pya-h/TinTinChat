<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('GET');
$user_id = apiRequireAuth();
$other_username = $_GET['with'] ?? '';

if (!$other_username) {
  apiError('MISSING_TARGET', 'Missing target username', 400);
}

if(!isset($_GET['offsetMsgId'])) {
  apiError('MISSING_OFFSET', 'Cannot fetch recent messages without specifying the offset message', 400);
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$stmt->execute([$other_username]);
$other_user = $stmt->fetch();

if (!$other_user) {
  apiError('TARGET_NOT_FOUND', 'Target user not found', 404);
}
$other_user_id = $other_user['id'];
$last_msg_id = (int)$_GET['offsetMsgId'];

$stmt = $pdo->prepare("SELECT id, sender_id, receiver_id, message, message_for_sender, message_type, voice_file_path, image_file_path, any_file_path, file_size, reply_to_message_id, forwarded_from_message_id, forwarded_by_user_id, created_at, seen_at,
  r.id AS reply_message_id,
  r.sender_id AS reply_sender_id,
  r.message AS reply_message,
  r.message_for_sender AS reply_message_for_sender,
  r.message_type AS reply_message_type,
  fu.username AS forwarded_by_username,
  fmu.username AS forwarded_original_sender_username
  FROM messages
  LEFT JOIN messages r ON r.id = messages.reply_to_message_id
  LEFT JOIN users fu ON fu.id = messages.forwarded_by_user_id
  LEFT JOIN messages fm ON fm.id = messages.forwarded_from_message_id
  LEFT JOIN users fmu ON fmu.id = fm.sender_id
  WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND id > ? ORDER BY created_at ASC");
$stmt->execute([$user_id, $other_user_id, $other_user_id, $user_id, $last_msg_id]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
apiSuccess([
  'messages' => $messages,
]);