<?php
session_start();
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/api_helpers.php';

apiRequireMethod('GET');
$user_id = apiRequireAuth();
$other_username = apiNormalizeUsername($_GET['with'] ?? '', 'INVALID_TARGET_USERNAME');

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
$last_msg_id = max(0, (int)$_GET['offsetMsgId']);

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
  WHERE ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)) AND m.id > ? ORDER BY m.created_at ASC");
$stmt->execute([$user_id, $other_user_id, $other_user_id, $user_id, $last_msg_id]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
apiSuccess([
  'messages' => $messages,
]);